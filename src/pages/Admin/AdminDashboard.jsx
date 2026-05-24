import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">لوحة التحكم</h3>
                    </div>
                </div>
                <div className="content-body">
                    <div className="row">
                        <div className="col-xl-3 col-lg-6 col-12">
                            <div className="card pull-up">
                                <div className="card-content">
                                    <div className="card-body">
                                        <div className="media d-flex">
                                            <div className="media-body text-left">
                                                <h3 className="info">المسجلين</h3>
                                                <h6>إدارة أولياء الأمور</h6>
                                            </div>
                                            <div>
                                                <i className="la la-users info font-large-2 float-right"></i>
                                            </div>
                                        </div>
                                        <div className="progress progress-sm mt-1 mb-0 box-shadow-2">
                                            <div className="progress-bar bg-gradient-x-info" role="progressbar" style={{ width: '80%' }}></div>
                                        </div>
                                        <Link to="/admin/tuteurs" className="btn btn-sm btn-outline-info mt-2">عرض التفاصيل</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-xl-3 col-lg-6 col-12">
                            <div className="card pull-up">
                                <div className="card-content">
                                    <div className="card-body">
                                        <div className="media d-flex">
                                            <div className="media-body text-left">
                                                <h3 className="warning">الأنشطة</h3>
                                                <h6>إدارة أنشطة الجمعية</h6>
                                            </div>
                                            <div>
                                                <i className="la la-calendar warning font-large-2 float-right"></i>
                                            </div>
                                        </div>
                                        <div className="progress progress-sm mt-1 mb-0 box-shadow-2">
                                            <div className="progress-bar bg-gradient-x-warning" role="progressbar" style={{ width: '65%' }}></div>
                                        </div>
                                        <Link to="/admin/activites" className="btn btn-sm btn-outline-warning mt-2">عرض التفاصيل</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-12">
                            <div className="card pull-up">
                                <div className="card-content">
                                    <div className="card-body">
                                        <div className="media d-flex">
                                            <div className="media-body text-left">
                                                <h3 className="success">الأخبار</h3>
                                                <h6>إدارة مستجدات الموقع</h6>
                                            </div>
                                            <div>
                                                <i className="la la-newspaper-o success font-large-2 float-right"></i>
                                            </div>
                                        </div>
                                        <div className="progress progress-sm mt-1 mb-0 box-shadow-2">
                                            <div className="progress-bar bg-gradient-x-success" role="progressbar" style={{ width: '75%' }}></div>
                                        </div>
                                        <Link to="/admin/infos" className="btn btn-sm btn-outline-success mt-2">عرض التفاصيل</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-12">
                            <div className="card pull-up">
                                <div className="card-content">
                                    <div className="card-body">
                                        <div className="media d-flex">
                                            <div className="media-body text-left">
                                                <h3 className="danger">الشركاء</h3>
                                                <h6>إدارة شركاء الجمعية</h6>
                                            </div>
                                            <div>
                                                <i className="la la-handshake-o danger font-large-2 float-right"></i>
                                            </div>
                                        </div>
                                        <div className="progress progress-sm mt-1 mb-0 box-shadow-2">
                                            <div className="progress-bar bg-gradient-x-danger" role="progressbar" style={{ width: '50%' }}></div>
                                        </div>
                                        <Link to="/admin/partenaires" className="btn btn-sm btn-outline-danger mt-2">عرض التفاصيل</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-12 text-center">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">مرحباً بك في لوحة تحكم جمعية بلسم</h4>
                                    <p className="card-text">يمكنك إدارة جميع محتويات الموقع من خلال القائمة الجانبية.</p>
                                    <img src="/backend/app-assets/images/logo/logo.png" alt="Logo" style={{ width: '150px', marginTop: '20px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
