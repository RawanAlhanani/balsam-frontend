/**
 * Formats description text by handling custom separators and markers used in the database.
 * @param {string} desc - The raw description string.
 * @returns {string} - The formatted HTML string.
 */
export const formatDescription = (desc) => {
    if (!desc) return "";
    
    const paraphs = desc.split("---");
    let contenu = "";
    
    paraphs.forEach(p => {
        const puces = p.split("***");
        if (puces.length > 1) {
            contenu += "<ul>";
            puces.forEach(cc => {
                if (cc.trim()) {
                    contenu += "<li>" + cc.trim() + "</li>";
                }
            });
            contenu += "</ul>";
        } else if (p.includes('===')) {
            const text = p.replace("===", "");
            contenu += "<strong> " + text.trim() + " </strong>";
        } else if (p.includes('==')) {
            const text = p.replace("==", "");
            contenu += '<strong>' + text.trim() + '</strong><br /> <br />';
        } else {
            contenu += p.trim() + "<br /> <br />";
        }
    });
    
    return contenu;
};

/**
 * Gets the full storage URL for an image.
 * @param {string} imageName - The name of the image file.
 * @param {string} type - Optional type to help locate the image (e.g., 'activity', 'child').
 * @returns {string} - The complete URL.
 */
export const getStorageUrl = (imageName, type = '') => {
    if (!imageName) return "/backend/app-assets/images/portrait/small/avatar-s-19.png"; // Placeholder
    
    // If it's already an absolute URL, return it
    if (imageName.startsWith('http')) return imageName;

    // Strip only a trailing "/api" (anchored to the end) - a plain string
    // replace would match the FIRST "/api" anywhere, which on this app's
    // real host (api.balsam.ma) falls inside "https://api..." and mangles
    // the URL instead of removing the intended path suffix.
    const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || 'http://localhost:8000';
    const storageBase = import.meta.env.VITE_STORAGE_URL || `${backendUrl}/storage/MesImages`;

    // Strategy: 
    // 1. Most new images are in /storage/MesImages/
    // 2. Some old ones might be in /ImagesActivites/ or /PhotoEnfant/
    
    // If the name contains "activity" or we know it's an activity and it's old, 
    // we might need to check /ImagesActivites/
    // However, for simplicity and since we are moving towards /MesImages/, 
    // we'll primarily use the storageBase.
    
    return `${storageBase}/${imageName}`;
};

/**
 * Builds a URL for a file stored under Laravel's public storage disk
 * (e.g. "cvs/xxx.pdf"), unlike getStorageUrl() which assumes the MesImages
 * subfolder specifically.
 * @param {string} path - The relative storage path (e.g. from $file->store('cvs', 'public')).
 * @returns {string|null}
 */
export const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    // Strip only a trailing "/api" (anchored to the end) - a plain string
    // replace would match the FIRST "/api" anywhere, which on this app's
    // real host (api.balsam.ma) falls inside "https://api..." and mangles
    // the URL instead of removing the intended path suffix.
    const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || 'http://localhost:8000';
    return `${backendUrl}/storage/${path}`;
};
