import React from 'react';
import './Loading.css';

const Loading = ({ message = 'جاري التحميل...', size = 'medium' }) => {
    return (
        <div className="loading-overlay">
            <div className={`loading-container loading-${size}`}>
                <div className="loading-logo">
                    <img 
                        src="/backend/app-assets/images/logo/logo.png" 
                        alt="Balsam Logo" 
                        className="loading-logo-image"
                    />
                </div>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};

export default Loading;
