import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormPanel, AdminFormGroup,
    AdminFormActions, AdminTableWrap, AdminBtn, AdminLoading, AdminAlert, AdminEmptyState
} from '../../components/Admin/ui/AdminUI';

// Simple Delete Confirmation Modal Component (re-used from AdminSettings)
const DeleteConfirmModal = ({ show, onClose, onConfirm, itemName, isDeleting }) => {
    if (!show) return null;
    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document" style={{ zIndex: 1060 }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">تأكيد الحذف</h5>
                        <button type="button" className="close" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        هل أنت متأكد أنك تريد حذف "{itemName}"؟
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
                        <button type="button" className="btn btn-danger" disabled={isDeleting} onClick={onConfirm}>
                            {isDeleting ? <span className="spinner-border spinner-border-sm"/> : 'حذف'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show" onClick={onClose} style={{ zIndex: 1050 }}></div>
        </div>
    );
};


const AdminActivityReports = () => {
    const [activities, setActivities] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '', location: '', activity_type: '', beneficiaries: '',
        moderator: '', presentation_title: '', start_time: '', end_time: '',
        summary: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');


    useEffect(() => { fetchActivities(); }, []);

    // Lock background scroll when modal is open
    useEffect(() => {
        if (showDeleteConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModal]);


    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/activity-reports');
            setActivities(res.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل تقارير الأنشطة', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/admin/activity-reports', formData);
            setShowForm(false);
            setFormData({ // Reset form
                date: '', location: '', activity_type: '', beneficiaries: '',
                moderator: '', presentation_title: '', start_time: '', end_time: '',
                summary: ''
            });
            await fetchActivities();
            setAlert({ message: 'تم حفظ التقرير بنجاح', type: 'success' });
        } catch (err) {
            setAlert({ message: 'خطأ في حفظ التقرير', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const promptDelete = (id, name) => {
        setDeleteTargetId(id);
        setDeleteTargetName(name);
        setShowDeleteConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/activity-reports/${deleteTargetId}`);
            await fetchActivities();
            setAlert({ message: 'تم حذف التقرير بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
        } catch (err) {
            setAlert({ message: 'خطأ في حذف التقرير', type: 'danger' });
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
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
        <>
        <AdminPage>
            <AdminPageHeader
                title="تقارير الأنشطة"
                subtitle="توثيق وطباعة تقارير الأنشطة"
                badge="التقارير"
                actions={
                    <AdminBtn variant={showForm ? 'secondary' : 'primary'} icon={showForm ? 'la-times' : 'la-plus'} onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'إلغاء' : 'إضافة تقرير'}
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminFormPanel title="تقرير نشاط جديد" open={showForm} onClose={() => setShowForm(false)} onSubmit={handleSubmit}>
                    <div className="row">
                        <AdminFormGroup label="التاريخ" className="col-md-4">
                            <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="المكان" className="col-md-4">
                            <input className="form-control" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="نوع النشاط" className="col-md-4">
                            <input className="form-control" value={formData.activity_type} onChange={e => setFormData({ ...formData, activity_type: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="المستفيدون" className="col-md-4">
                            <input className="form-control" value={formData.beneficiaries} onChange={e => setFormData({ ...formData, beneficiaries: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="المؤطر" className="col-md-4">
                            <input className="form-control" value={formData.moderator} onChange={e => setFormData({ ...formData, moderator: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="عنوان العرض" className="col-md-4">
                            <input className="form-control" value={formData.presentation_title} onChange={e => setFormData({ ...formData, presentation_title: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="ساعة البدء" className="col-md-2">
                            <input type="time" className="form-control" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="ساعة النهاية" className="col-md-2">
                            <input type="time" className="form-control" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="ملخص عن النشاط" className="col-md-12">
                            <textarea className="form-control" rows="6" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
                        </AdminFormGroup>
                    </div>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ التقرير'}
                        </AdminBtn>
                    </AdminFormActions>
                </AdminFormPanel>

                <AdminCard title="قائمة التقارير" icon="la-clipboard" flush>
                    {loading ? (
                        <AdminLoading />
                    ) : activities.length === 0 ? (
                        <AdminEmptyState message="لا توجد تقارير أنشطة لعرضها." />
                    ) : (
                        <AdminTableWrap>
                            <table className="table table-hover admin-table">
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
                                                <div className="admin-action-group">
                                                    <AdminBtn variant="info" icon="la-print" onClick={() => handlePrint(a)}>طباعة</AdminBtn>
                                                    <AdminBtn variant="danger" icon="la-trash" onClick={() => promptDelete(a.id, a.presentation_title || `تقرير بتاريخ ${a.date}`)}>حذف</AdminBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </AdminTableWrap>
                    )}
                </AdminCard>
            </div>
        </AdminPage>

        <DeleteConfirmModal
            show={showDeleteConfirmModal}
            onClose={() => setShowDeleteConfirmModal(false)}
            onConfirm={confirmDelete}
            itemName={deleteTargetName}
            isDeleting={deleting}
        />

        {alert.message && (
            <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
        )}
        </>
    );
};

export default AdminActivityReports;