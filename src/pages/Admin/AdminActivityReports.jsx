import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormPanel, AdminFormGroup,
    AdminFormActions, AdminTableWrap, AdminBtn, AdminLoading, AdminAlert, AdminEmptyState
} from '../../components/Admin/ui/AdminUI';
import DeleteConfirmModal from '../../components/Admin/modals/DeleteConfirmModal';

// Helper function to personalize error messages
const getPersonalizedErrorMessage = (error) => {
    let rawMessage = '';
    if (error.response && error.response.data && error.response.data.message) {
        rawMessage = error.response.data.message.toLowerCase();
    } else if (error.message) {
        rawMessage = error.message.toLowerCase();
    }

    // Specific backend/SQL error patterns
    if (rawMessage.includes('sqlstate') || rawMessage.includes('database error') || rawMessage.includes('syntax error')) {
        return 'حدث خطأ في قاعدة البيانات. الرجاء إبلاغ الدعم الفني.'; // Database error. Please contact support.
    }
    if (rawMessage.includes('internal server error') || rawMessage.includes('undefined')) {
        return 'حدث خطأ غير متوقع من الخادم. الرجاء المحاولة مرة أخرى لاحقًا.'; // An unexpected server error occurred. Please try again later.
    }
    if (rawMessage.includes('network error') || rawMessage.includes('failed to fetch')) {
        return 'فشل الاتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'; // Failed to connect to the server. Please check your internet connection and try again.
    }

    // If the backend provided a message that doesn't match technical patterns, use it.
    // Assuming the backend message is already in Arabic or user-friendly if it's not a technical error.
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }

    // Fallback for any other unhandled errors
    return 'حدث خطأ ما. الرجاء المحاولة مرة أخرى.'; // Something went wrong. Please try again.
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
    const [formErrors, setFormErrors] = useState({}); // New state for form errors


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
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            date: '', location: '', activity_type: '', beneficiaries: '',
            moderator: '', presentation_title: '', start_time: '', end_time: '',
            summary: ''
        });
        setFormErrors({}); // Clear form errors on reset
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({}); // Clear previous errors
        setAlert({ message: '', type: '' }); // Clear general alert

        try {
            await api.post('/admin/activity-reports', formData);
            setShowForm(false);
            resetForm();
            await fetchActivities();
            setAlert({ message: 'تم حفظ التقرير بنجاح', type: 'success' });
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setFormErrors(err.response.data.errors);
                setAlert({ message: 'الرجاء مراجعة الأخطاء في النموذج.', type: 'danger' });
            } else {
                const errorMessage = getPersonalizedErrorMessage(err);
                setAlert({ message: errorMessage, type: 'danger' });
            }
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
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const handlePrint = (activity) => {
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
        </body>
        </html>
    `;

        // Remove any leftover print iframe from a previous click
        const oldFrame = document.getElementById('print-frame');
        if (oldFrame) oldFrame.remove();

        // Create a hidden iframe instead of window.open — avoids the popup blocker
        const iframe = document.createElement('iframe');
        iframe.id = 'print-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();

        const triggerPrint = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        };

        // Clean up the iframe once printing is done (or cancelled)
        iframe.contentWindow.onafterprint = () => {
            iframe.remove();
        };

        // Give the browser a moment to load the @import font + image before printing
        if (iframe.contentDocument.readyState === 'complete') {
            setTimeout(triggerPrint, 300);
        } else {
            iframe.onload = () => setTimeout(triggerPrint, 300);
        }
    };

    return (
        <>
        <AdminPage>
            <AdminPageHeader
                title="تقارير الأنشطة"
                subtitle="توثيق وطباعة تقارير الأنشطة"
                badge="التقارير"
                actions={
                    <AdminBtn variant={showForm ? 'secondary' : 'primary'} icon={showForm ? 'la-times' : 'la-plus'} onClick={() => { setShowForm(!showForm); resetForm(); }}>
                        {showForm ? 'إلغاء' : 'إضافة تقرير'}
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminFormPanel title="تقرير نشاط جديد" open={showForm} onClose={() => { setShowForm(false); resetForm(); }} onSubmit={handleSubmit}>
                    <div className="row">
                        <AdminFormGroup label="التاريخ" className="col-md-4">
                            <input type="date" className="form-control" name="date" value={formData.date} onChange={handleInputChange} required />
                            {formErrors.date && <div className="text-danger small mt-1">{formErrors.date[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="المكان" className="col-md-4">
                            <input className="form-control" name="location" value={formData.location} onChange={handleInputChange} />
                            {formErrors.location && <div className="text-danger small mt-1">{formErrors.location[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="نوع النشاط" className="col-md-4">
                            <input className="form-control" name="activity_type" value={formData.activity_type} onChange={handleInputChange} />
                            {formErrors.activity_type && <div className="text-danger small mt-1">{formErrors.activity_type[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="المستفيدون" className="col-md-4">
                            <input className="form-control" name="beneficiaries" value={formData.beneficiaries} onChange={handleInputChange} />
                            {formErrors.beneficiaries && <div className="text-danger small mt-1">{formErrors.beneficiaries[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="المؤطر" className="col-md-4">
                            <input className="form-control" name="moderator" value={formData.moderator} onChange={handleInputChange} />
                            {formErrors.moderator && <div className="text-danger small mt-1">{formErrors.moderator[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="عنوان العرض" className="col-md-4">
                            <input className="form-control" name="presentation_title" value={formData.presentation_title} onChange={handleInputChange} />
                            {formErrors.presentation_title && <div className="text-danger small mt-1">{formErrors.presentation_title[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="ساعة البدء" className="col-md-2">
                            <input type="time" className="form-control" name="start_time" value={formData.start_time} onChange={handleInputChange} />
                            {formErrors.start_time && <div className="text-danger small mt-1">{formErrors.start_time[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="ساعة النهاية" className="col-md-2">
                            <input type="time" className="form-control" name="end_time" value={formData.end_time} onChange={handleInputChange} />
                            {formErrors.end_time && <div className="text-danger small mt-1">{formErrors.end_time[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="ملخص عن النشاط" className="col-md-12">
                            <textarea className="form-control" rows="6" name="summary" value={formData.summary} onChange={handleInputChange} />
                            {formErrors.summary && <div className="text-danger small mt-1">{formErrors.summary[0]}</div>}
                        </AdminFormGroup>
                    </div>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : 'حفظ التقرير'}
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