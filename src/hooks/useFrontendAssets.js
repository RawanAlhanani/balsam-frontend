import { useEffect } from 'react';

// Bundled from the ~36 individual legacy theme files (see scripts/build-bundle
// history) into 2 requests - loading them one-by-one, with scripts awaited in
// series, was adding several seconds of pure request-queueing latency to every
// first page load.
const useFrontendAssets = () => {
    const styles = [
        "/content/view/themes/balsam/assests/bundle.css"
    ];

    const scripts = [
        "/content/view/themes/balsam/assests/bundle.js"
    ];

    useEffect(() => {
        const injectedElements = [];

        // Inject CSS files
        styles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            document.head.appendChild(link);
            injectedElements.push(link);
        });

        // Inject JS files
        const injectScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = false; // Ensure scripts load in order
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
                injectedElements.push(script);
            });
        };

        const loadScripts = async () => {
            for (const src of scripts) {
                try {
                    await injectScript(src);
                } catch (error) {
                    console.error(`Failed to load script: ${src}`, error);
                }
            }
        };

        loadScripts();

        // Cleanup function
        return () => {
            injectedElements.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        };
    }, []); // Empty dependency array means this runs once on mount and cleans up on unmount
};

export default useFrontendAssets;