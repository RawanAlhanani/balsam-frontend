import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminSettings = () => {
    const [types, setTypes] = useState([]);
    const [regions, setRegions] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        api.get('/admin/types').then(res => setTypes(res.data));
        api.get('/admin/regions').then(res => setRegions(res.data));
        api.get('/admin/doctors').then(res => setDoctors(res.data));
    }, []);

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">الإعدادات</h3>
                    </div>
                </div>
                <div className="content-body">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header"><h4>أنواع الأنشطة</h4></div>
                                <div className="card-body">
                                    <ul className="list-group">
                                        {types.map(t => <li key={t.id} className="list-group-item">{t.nomActivite}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header"><h4>المناطق</h4></div>
                                <div className="card-body">
                                    <ul className="list-group">
                                        {regions.map(r => <li key={r.id} className="list-group-item">{r.nom_region}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header"><h4>التخصصات</h4></div>
                                <div className="card-body">
                                    <ul className="list-group">
                                        {doctors.map(d => <li key={d.id} className="list-group-item">{d.specialite}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
