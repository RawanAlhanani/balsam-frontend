import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminActivityReports = () => {
    const [activities, setActivities] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '', location: '', activity_type: '', beneficiaries: '',
        moderator: '', presentation_title: '', start_time: '', end_time: '',
        summary: ''
    });

    useEffect(() => { fetchActivities(); }, []);

    const fetchActivities = async () => {
        const res = await api.get('/admin/activity-reports');
        setActivities(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/activity-reports', formData);
            setShowForm(false);
            fetchActivities();
        } catch (err) { alert('خطأ في الحفظ'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('حذف هذا التقرير؟')) {
            await api.delete(`/admin/activity-reports/${id}`);
            fetchActivities();
        }
    };

    const handlePrint = (activity) => {
        const printWindow = window.open('', '_blank');
        const logoUrl = window.location.origin + '/backend/app-assets/images/logo/meeting.jpg';
        
        const content = `
            <html dir="rtl">
            <head>
                <title>تقرير عن نشاط</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
                    
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    
                    body { 
                        font-family: 'Amiri', serif; 
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    .background-frame {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 210mm;
                        height: 297mm;
                        z-index: -1;
                    }

                    .background-frame img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }

                    .print-table {
                        width: 100%;
                        border-collapse: collapse;
                        position: relative;
                        z-index: 1;
                    }

                    .page-header-space {
                        height: 55mm;
                    }

                    .page-footer-space {
                        height: 45mm;
                    }

                    .content-cell {
                        padding: 0 25mm;
                        vertical-align: top;
                    }

                    .header-title { text-align: center; margin-bottom: 30px; }
                    .title { font-size: 26px; font-weight: bold; color: #1a5a96; text-decoration: underline; }
                    
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
                    .info-item { border-bottom: 1px dashed #bbb; padding: 5px; font-size: 18px; }
                    .info-label { font-weight: bold; color: #333; margin-left: 10px; }
                    
                    .section { margin-bottom: 20px; page-break-inside: avoid; }
                    .section-title { font-size: 19px; font-weight: bold; color: #1a5a96; border-right: 5px solid #1a5a96; padding-right: 12px; margin-bottom: 8px; background: rgba(26, 90, 150, 0.05); }
                    .section-content { padding: 5px 15px; white-space: pre-wrap; font-size: 17px; min-height: 100px; border: 1px solid #eee; }
                    
                    .footer-signatures { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 20px; page-break-inside: avoid; }
                    .signature-box { text-align: center; width: 220px; }
                    
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="background-frame">
                    <img src="${logoUrl}" alt="background" />
                </div>

                <table class="print-table">
                    <thead>
                        <tr><td><div class="page-header-space"></div></td></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="content-cell">
                                <div class="header-title">
                                    <div class="title">تقرير عن نشاط</div>
                                </div>

                                <div class="info-grid">
                                    <div class="info-item"><span class="info-label">اليوم والتاريخ:</span> ${activity.date}</div>
                                    <div class="info-item"><span class="info-label">المكان:</span> ${activity.location}</div>
                                    <div class="info-item"><span class="info-label">نوع النشاط:</span> ${activity.activity_type}</div>
                                    <div class="info-item"><span class="info-label">المستفيدون:</span> ${activity.beneficiaries}</div>
                                    <div class="info-item"><span class="info-label">المؤطر:</span> ${activity.moderator}</div>
                                    <div class="info-item"><span class="info-label">عنوان العرض:</span> ${activity.presentation_title}</div>
                                    <div class="info-item"><span class="info-label">ساعة البداية:</span> ${activity.start_time}</div>
                                    <div class="info-item"><span class="info-label">ساعة النهاية:</span> ${activity.end_time}</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">ملخص عن النشاط</div>
                                    <div class="section-content">${activity.summary || '................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................'}</div>
                                </div>

                                <div class="footer-signatures">
                                    <div class="signature-box">
                                        <strong>إمضاء: الكاتب العام</strong>
                                    </div>
                                    <div class="signature-box">
                                        <strong>إمضاء: الرئيس</strong>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr><td><div class="page-footer-space"></div></td></tr>
                    </tfoot>
                </table>

                <script>
                    window.onload = function() { 
                        setTimeout(() => {
                            window.print(); 
                            window.close(); 
                        }, 500);
                    }
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">تقارير الأنشطة</h3>
                    </div>
                    <div className="col-md-6 text-right">
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'إلغاء' : 'إضافة تقرير نشاط جديد'}
                        </button>
                    </div>
                </div>
                <div className="content-body">
                    {showForm && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-4 mb-2"><label>التاريخ</label><input type="date" className="form-control" onChange={e => setFormData({...formData, date: e.target.value})} required /></div>
                                        <div className="col-md-4 mb-2"><label>المكان</label><input className="form-control" onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                                        <div className="col-md-4 mb-2"><label>نوع النشاط</label><input className="form-control" onChange={e => setFormData({...formData, activity_type: e.target.value})} /></div>
                                        
                                        <div className="col-md-4 mb-2"><label>المستفيدون</label><input className="form-control" onChange={e => setFormData({...formData, beneficiaries: e.target.value})} /></div>
                                        <div className="col-md-4 mb-2"><label>المؤطر</label><input className="form-control" onChange={e => setFormData({...formData, moderator: e.target.value})} /></div>
                                        <div className="col-md-4 mb-2"><label>عنوان العرض</label><input className="form-control" onChange={e => setFormData({...formData, presentation_title: e.target.value})} /></div>

                                        <div className="col-md-2 mb-2"><label>ساعة البدء</label><input type="time" className="form-control" onChange={e => setFormData({...formData, start_time: e.target.value})} /></div>
                                        <div className="col-md-2 mb-2"><label>ساعة النهاية</label><input type="time" className="form-control" onChange={e => setFormData({...formData, end_time: e.target.value})} /></div>
                                        
                                        <div className="col-md-12 mb-2"><label>ملخص عن النشاط</label><textarea className="form-control" rows="6" onChange={e => setFormData({...formData, summary: e.target.value})}></textarea></div>
                                    </div>
                                    <button className="btn btn-success mt-3">حفظ التقرير</button>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="card">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>التاريخ</th>
                                        <th>المكان</th>
                                        <th>نوع النشاط</th>
                                        <th>المؤطر</th>
                                        <th>العمليات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.date}</td>
                                            <td>{a.location}</td>
                                            <td>{a.activity_type}</td>
                                            <td>{a.moderator}</td>
                                            <td>
                                                <button onClick={() => handleDelete(a.id)} className="btn btn-danger btn-sm">حذف</button>
                                                <button className="btn btn-info btn-sm ml-1" onClick={() => handlePrint(a)}>طباعة</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminActivityReports;
