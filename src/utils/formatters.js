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
 * Prefers relative paths if the assets were copied to the public folder.
 * @param {string} imageName - The name of the image file.
 * @returns {string} - The complete URL.
 */
export const getStorageUrl = (imageName) => {
    if (!imageName) return "/backend/app-assets/images/portrait/small/avatar-s-19.png"; // Placeholder
    
    // We copied assets to public/storage/MesImages
    // Using relative path /storage/MesImages/... allows the browser to fetch from the Vite dev server
    return `/storage/MesImages/${imageName}`;
};
