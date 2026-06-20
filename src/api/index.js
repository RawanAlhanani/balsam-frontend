import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('admin_token');
    
    // Prioritize admin token for admin routes, or just send whichever exists
    const activeToken = adminToken || token;
    
    if (activeToken) {
        config.headers.Authorization = `Bearer ${activeToken}`;
    }
    return config;
});

export const getHomeData = () => api.get('/home-data');
export const getAbout = () => api.get('/about');
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const getNews = () => api.get('/news');
export const getSingleNews = (id) => api.get(`/news/${id}`);
export const getActivities = () => api.get('/activities');
export const getActivity = (id) => api.get(`/activities/${id}`);
export const getPartenaires = () => api.get('/partenaires');
export const getPhotos = () => api.get('/photos');
export const getAutismePages = () => api.get('/autisme-pages');
export const getAutismePage = (id) => api.get(`/autisme-pages/${id}`);
export const submitVolunteerForm = (data) => api.post('/volunteers', data);
export const getAdminVolunteers = () => api.get('/admin/volunteers');
export const updateVolunteerStatus = (id, status) => api.put(`/admin/volunteers/${id}/status`, { status });
export const registerStagiaire = (data) => api.post('/register-stagiaire', data);

export default api;
