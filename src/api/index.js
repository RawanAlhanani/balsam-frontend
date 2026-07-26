import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Enable cookies for CSRF protection
});

let isRefreshing = false;
let refreshSubscribers = [];
let csrfTokenInitialized = false;

// Function to add request to queue
function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

// Function to process queued requests
function onRefreshed(token) {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
}

// Initialize CSRF token
export const initializeCsrfToken = async () => {
    if (csrfTokenInitialized) return;
    
    try {
        await axios.get(`${API_BASE_URL}/csrf-cookie`, { withCredentials: true });
        csrfTokenInitialized = true;
    } catch (error) {
        console.warn('Failed to initialize CSRF token:', error);
    }
};

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(async (config) => {
    // Ensure CSRF token is initialized for stateful requests
    if (!csrfTokenInitialized && config.method !== 'get') {
        await initializeCsrfToken();
    }
    
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('admin_token');
    
    // Prioritize admin token for admin routes, or just send whichever exists
    const activeToken = adminToken || token;
    
    if (activeToken) {
        config.headers.Authorization = `Bearer ${activeToken}`;
    }
    
    // Add CSRF token if available
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    
    return config;
});

// Add a response interceptor for token refresh and error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 (Unauthorized) and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, wait for the refresh to complete
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // Attempt to refresh the token
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/refresh`, {
                        refresh_token: refreshToken
                    }, { withCredentials: true });
                    
                    const newToken = response.data.access_token;
                    const newRefreshToken = response.data.refresh_token;
                    
                    // Update tokens in localStorage
                    const isAdmin = localStorage.getItem('is_admin') === 'true';
                    if (isAdmin) {
                        localStorage.setItem('admin_token', newToken);
                        localStorage.setItem('refresh_token', newRefreshToken);
                    } else {
                        localStorage.setItem('token', newToken);
                        localStorage.setItem('refresh_token', newRefreshToken);
                    }
                    
                    // Update authorization header
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    
                    // Process queued requests
                    onRefreshed(newToken);
                    isRefreshing = false;
                    
                    // Retry original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Read this before clearing storage below, otherwise it's always false
                const wasAdmin = localStorage.getItem('is_admin') === 'true';

                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('admin_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                localStorage.removeItem('is_admin');
                localStorage.removeItem('admin_role');

                // Redirect to the real login routes (see App.jsx) if not already there
                const loginPath = wasAdmin ? '/connecte' : '/se_connecter';
                if (window.location.pathname !== loginPath) {
                    window.location.href = loginPath;
                }

                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// Helper function to get cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export const getHomeData = () => api.get('/home-data');
export const getAbout = () => api.get('/about');
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const getNews = (page = 1) => api.get('/news', { params: { page } });
export const getSingleNews = (id) => api.get(`/news/${id}`);
export const getActivities = () => api.get('/activities');
export const getActivity = (id) => api.get(`/activities/${id}`);
export const getPartenaires = () => api.get('/partenaires');
export const getPhotos = (page = 1) => api.get('/photos', { params: { page } });
export const getAutismePages = () => api.get('/autisme-pages');
export const getAutismePage = (id) => api.get(`/autisme-pages/${id}`);
export const submitVolunteerForm = (data) => api.post('/volunteers', data);
export const getAdminVolunteers = () => api.get('/admin/volunteers');
export const updateVolunteerStatus = (id, status) => api.put(`/admin/volunteers/${id}/status`, { status });
export const registerStagiaire = (data) => api.post('/register-stagiaire', data);
export const submitContact = (data) => api.post('/contact', data);
export const getContactMessages = (page = 1) => api.get('/admin/contact-messages', { params: { page } });
export const deleteContactMessage = (id) => api.delete(`/admin/contact-messages/${id}`);
export const getSiteSettings = () => api.get('/site-settings');
export const updateSiteSettings = (data) => api.put('/admin/site-settings', data);

// Auth functions
export const login = (credentials) => api.post('/login', credentials);
export const adminLogin = (credentials) => api.post('/admin-login', credentials);
export const logout = () => api.post('/logout');
export const refreshToken = (refreshToken) => api.post('/refresh', { refresh_token: refreshToken });

export default api;
