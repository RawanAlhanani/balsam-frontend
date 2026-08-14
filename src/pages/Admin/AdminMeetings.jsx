import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormPanel, AdminFormGroup,
    AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert, AdminLoading, AdminEmptyState
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

const AdminMeetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '', location: '', start_time: '', end_time: '',
        attendees: '', absentees: '', agenda: '', discussions: '',
        decisions: '', next_meeting_date: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [formErrors, setFormErrors] = useState({}); // New state for form errors
    const [deleting, setDeleting] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');

    useEffect(() => { fetchMeetings(); }, []);

    // Lock background scroll and interactions when delete modal is open
    useEffect(() => {
        if (showDeleteConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModal]);

    const fetchMeetings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/meetings');
            setMeetings(res.data);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            date: '', location: '', start_time: '', end_time: '',
            attendees: '', absentees: '', agenda: '', discussions: '',
            decisions: '', next_meeting_date: ''
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
            await api.post('/admin/meetings', formData);
            setAlert({ message: 'تم حفظ تقرير الاجتماع بنجاح', type: 'success' });
            setShowForm(false);
            resetForm();
            fetchMeetings();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setFormErrors(err.response.data.errors);
                setAlert({ message: 'الرجاء مراجعة الأخطاء في النموذج.', type: 'danger' });
            } else {
                const errorMessage = getPersonalizedErrorMessage(err);
                setAlert({ message: errorMessage, type: 'danger' });
            }
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const promptDelete = (id, date) => {
        setDeleteTargetId(id);
        setDeleteTargetName(`تقرير اجتماع بتاريخ ${date}`);
        setShowDeleteConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/meetings/${deleteTargetId}`);
            setAlert({ message: 'تم حذف تقرير الاجتماع بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
            fetchMeetings();
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
            console.error(err);
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const handlePrint = (meeting) => {
        const logoUrl = window.location.origin + '/backend/app-assets/images/logo/meeting.jpg';

        const content = `
            <html dir="rtl">
            <head>
                <title>تقرير اجتماع</title>
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

                    /* Background frame on every page */
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

                    /* Table layout to force header/footer spacing on every page */
                    .print-table {
                        width: 100%;
                        border-collapse: collapse;
                        position: relative;
                        z-index: 1;
                    }

                    .page-header-space {
                        height: 55mm; /* Header height */
                    }

                    .page-footer-space {
                        height: 45mm; /* Footer height */
                    }

                    .content-cell {
                        padding: 0 25mm;
                        vertical-align: top;
                    }

                    .header-title { text-align: center; margin-bottom: 30px; }
                    .title { font-size: 26px; font-weight: bold; color: #1a5a96; }

                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
                    .info-item { border-bottom: 1px dashed #bbb; padding: 5px; }
                    .info-label { font-weight: bold; color: #333; margin-left: 10px; }

                    .section { margin-bottom: 20px; page-break-inside: avoid; }
                    .section-title { font-size: 19px; font-weight: bold; color: #1a5a96; border-right: 5px solid #1a5a96; padding-right: 12px; margin-bottom: 8px; background: rgba(26, 90, 150, 0.05); }
                    .section-content { padding: 5px 15px; white-space: pre-wrap; font-size: 16px; min-height: 40px; }

                    .footer-signatures { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 20px; page-break-inside: avoid; }
                    .signature-box { text-align: center; width: 220px; border-top: 1px solid #eee; padding-top: 10px; }

                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="background-frame">
                    <img src="${logoUrl}" alt="خلفية" />
                </div>

                <table class="print-table">
                    <thead>
                        <tr><td><div class="page-header-space"></div></td></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="content-cell">
                                <div class="header-title">
                                    <div class="title">محضر اجتماع الجمعية</div>
                                </div>

                                <div class="info-grid">
                                    <div class="info-item"><span class="info-label">التاريخ:</span> ${meeting.date}</div>
                                    <div class="info-item"><span class="info-label">المكان:</span> ${meeting.location}</div>
                                    <div class="info-item"><span class="info-label">من:</span> ${meeting.start_time}</div>
                                    <div class="info-item"><span class="info-label">إلى:</span> ${meeting.end_time}</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">الحضور</div>
                                    <div class="section-content">${meeting.attendees || '---'}</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">جدول الأعمال</div>
                                    <div class="section-content">${meeting.agenda || '---'}</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">مداولات الاجتماع</div>
                                    <div class="section-content">${meeting.discussions || '---'}</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">القرارات المتخذة</div>
                                    <div class="section-content">${meeting.decisions || '---'}</div>
                                </div>

                                ${meeting.next_meeting_date ? `
                                <div class="section">
                                    <div class="section-title">موعد الاجتماع المقبل</div>
                                    <div class="section-content">${meeting.next_meeting_date}</div>
                                </div>
                                ` : ''}

                                <div class="footer-signatures">
                                    <div class="signature-box">
                                        <strong>توقيع الكاتب العام</strong>
                                    </div>
                                    <div class="signature-box">
                                        <strong>توقيع رئيس الجمعية</strong>
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
                    title="تقارير الاجتماعات"
                    subtitle="إنشاء وطباعة محاضر الاجتماعات"
                    badge="التقارير"
                    actions={
                        <AdminBtn variant={showForm ? 'secondary' : 'primary'} icon={showForm ? 'la-times' : 'la-plus'} onClick={() => { setShowForm(!showForm); resetForm(); }}>
                            {showForm ? 'إلغاء' : 'إضافة تقرير'}
                        </AdminBtn>
                    }
                />
                <div className="content-body">
                    <AdminFormPanel title="تقرير اجتماع جديد" open={showForm} onClose={() => { setShowForm(false); resetForm(); }} onSubmit={handleSubmit}>
                        <div className="row">
                            <AdminFormGroup label="التاريخ" className="col-md-4">
                                <input type="date" className="form-control" name="date" value={formData.date} onChange={handleInputChange} required />
                                {formErrors.date && <div className="text-danger small mt-1">{formErrors.date[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="المكان" className="col-md-4">
                                <input className="form-control" name="location" value={formData.location} onChange={handleInputChange} required />
                                {formErrors.location && <div className="text-danger small mt-1">{formErrors.location[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="ساعة البدء" className="col-md-2">
                                <input type="time" className="form-control" name="start_time" value={formData.start_time} onChange={handleInputChange} required />
                                {formErrors.start_time && <div className="text-danger small mt-1">{formErrors.start_time[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="ساعة النهاية" className="col-md-2">
                                <input type="time" className="form-control" name="end_time" value={formData.end_time} onChange={handleInputChange} required />
                                {formErrors.end_time && <div className="text-danger small mt-1">{formErrors.end_time[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="الحاضرون" className="col-md-6">
                                <textarea className="form-control" rows="3" name="attendees" value={formData.attendees} onChange={handleInputChange} />
                                {formErrors.attendees && <div className="text-danger small mt-1">{formErrors.attendees[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="الغائبون" className="col-md-6">
                                <textarea className="form-control" rows="3" name="absentees" value={formData.absentees} onChange={handleInputChange} />
                                {formErrors.absentees && <div className="text-danger small mt-1">{formErrors.absentees[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="جدول الأعمال" className="col-md-12">
                                <textarea className="form-control" rows="3" name="agenda" value={formData.agenda} onChange={handleInputChange} />
                                {formErrors.agenda && <div className="text-danger small mt-1">{formErrors.agenda[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="المناقشة" className="col-md-12">
                                <textarea className="form-control" rows="4" name="discussions" value={formData.discussions} onChange={handleInputChange} />
                                {formErrors.discussions && <div className="text-danger small mt-1">{formErrors.discussions[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="أهم القرارات" className="col-md-12">
                                <textarea className="form-control" rows="4" name="decisions" value={formData.decisions} onChange={handleInputChange} />
                                {formErrors.decisions && <div className="text-danger small mt-1">{formErrors.decisions[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="موعد اللقاء المقبل" className="col-md-4">
                                <input type="date" className="form-control" name="next_meeting_date" value={formData.next_meeting_date} onChange={handleInputChange} />
                                {formErrors.next_meeting_date && <div className="text-danger small mt-1">{formErrors.next_meeting_date[0]}</div>}
                            </AdminFormGroup>
                        </div>
                        <AdminFormActions>
                            <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                                {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : 'حفظ التقرير'}
                            </AdminBtn>
                            <AdminBtn variant="secondary" icon="la-times" onClick={() => { setShowForm(false); resetForm(); }}>إلغاء</AdminBtn>
                        </AdminFormActions>
                    </AdminFormPanel>

                    <AdminCard title="قائمة الاجتماعات" icon="la-comments" flush>
                        {loading ? (
                            <AdminLoading />
                        ) : meetings.length === 0 ? (
                            <AdminEmptyState icon="la-comments" message="لا توجد تقارير اجتماعات مسجلة" hint="أضف تقرير اجتماع جديد من الزر أعلاه" />
                        ) : (
                            <AdminTableWrap>
                                <table className="table table-hover admin-table">
                                    <thead>
                                        <tr>
                                            <th>التاريخ</th>
                                            <th>المكان</th>
                                            <th>ساعة البدء</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meetings.map(m => (
                                            <tr key={m.id}>
                                                <td>{m.date}</td>
                                                <td>{m.location}</td>
                                                <td>{m.start_time}</td>
                                                <td>
                                                    <div className="admin-action-group">
                                                        <AdminBtn variant="info" icon="la-print" onClick={() => handlePrint(m)}>طباعة</AdminBtn>
                                                        <AdminBtn variant="danger" icon="la-trash" onClick={() => promptDelete(m.id, m.date)}>حذف</AdminBtn>
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

export default AdminMeetings;