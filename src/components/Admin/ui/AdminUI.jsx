import React, { useEffect } from 'react';

export const AdminPage = ({ children }) => (
    <div className="app-content content">
        <div className="content-wrapper">
            {children}
        </div>
    </div>
);

export const AdminPageHeader = ({ title, subtitle, actions, badge }) => (
    <div className="content-header row admin-page-header">
        <div className="content-header-left col-md-8 col-12 mb-2 mb-md-0">
            <div className="admin-page-header-inner">
                {badge && <span className="admin-page-badge">{badge}</span>}
                <h3 className="content-header-title">{title}</h3>
                {subtitle && <p className="content-header-subtitle">{subtitle}</p>}
            </div>
        </div>
        {actions && (
            <div className="content-header-right col-md-4 col-12 text-md-right">
                <div className="admin-page-actions">{actions}</div>
            </div>
        )}
    </div>
);

export const AdminCard = ({ title, icon, actions, children, className = '', flush = false }) => (
    <div className={`card admin-data-card ${flush ? 'admin-data-card--flush' : ''} ${className}`}>
        {title && (
            <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">
                    {icon && <i className={`la ${icon} mr-1`} />}
                    {title}
                </h4>
                {actions && <div className="admin-card-header-actions">{actions}</div>}
            </div>
        )}
        <div className="card-body">{children}</div>
    </div>
);

export const AdminLoading = ({ message = 'جاري التحميل...' }) => (
    <div className="admin-loading-state">
        <div className="admin-spinner" role="status" aria-label="loading" />
        <p>{message}</p>
    </div>
);

export const AdminEmptyState = ({ icon = 'la-inbox', message = 'لا توجد بيانات', hint }) => (
    <div className="admin-empty-state">
        <i className={`la ${icon}`} />
        <p className="admin-empty-title">{message}</p>
        {hint && <p className="admin-empty-hint">{hint}</p>}
    </div>
);

export const AdminFormPanel = ({ title, open, onClose, children, onSubmit }) => (
    open ? (
        <div className="card admin-form-panel mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">{title}</h4>
                <button type="button" className="btn btn-sm btn-light admin-form-close" onClick={onClose} aria-label="إغلاق">
                    <i className="la la-times" />
                </button>
            </div>
            <div className="card-body">
                {onSubmit ? <form onSubmit={onSubmit}>{children}</form> : children}
            </div>
        </div>
    ) : null
);

export const AdminAlert = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        if (!onClose) return;
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="admin-alert-container">
            <div className={`alert alert-${type} admin-floating-alert`} role="alert">
                <i className={`la ${type === 'success' ? 'la-check-circle' : 'la-exclamation-circle'} mr-1`} />
                {message}
                {onClose && (
                    <button type="button" className="close ml-2" onClick={onClose} aria-label="إغلاق">
                        <span>&times;</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export const AdminTableWrap = ({ children }) => (
    <div className="table-responsive admin-table-wrap">
        {children}
    </div>
);

export const AdminBtn = ({ variant = 'primary', size = 'sm', icon, children, className = '', as: Component = 'button', ...props }) => {
    return (
        <Component
            type={Component === 'button' ? (props.type || 'button') : undefined} // Only apply type to button element
            className={`btn btn-${variant} ${size ? `btn-${size}` : ''} admin-action-btn ${className}`}
            {...props}
        >
            {icon && <i className={`la ${icon}`} />}
            {children}
        </Component>
    );
};

export const AdminStatCard = ({ label, value, icon, color = 'primary', suffix }) => (
    <div className={`admin-stat-card admin-stat-card--${color}`}>
        <div className="admin-stat-card-body">
            <div className="admin-stat-info">
                <span className="admin-stat-label">{label}</span>
                <span className="admin-stat-value">{value}{suffix && <small>{suffix}</small>}</span>
            </div>
            {icon && (
                <div className={`admin-stat-icon bg-${color}`}>
                    <i className={`la ${icon}`} />
                </div>
            )}
        </div>
    </div>
);

export const AdminFormGroup = ({ label, children, className = '' }) => (
    <div className={`form-group admin-form-group ${className}`}>
        {label && <label className="admin-form-label">{label}</label>}
        {children}
    </div>
);

export const AdminFormActions = ({ children }) => (
    <div className="admin-form-actions">{children}</div>
);