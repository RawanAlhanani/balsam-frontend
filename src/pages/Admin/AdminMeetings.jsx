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
    const [printingId, setPrintingId] = useState(null);
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

    // Generated server-side via dompdf and downloaded as a real PDF, instead
    // of the previous hidden-iframe + window.print() approach - that was
    // unreliable on mobile browsers (iOS Safari in particular doesn't print
    // iframe content reliably) and had a race condition where the letterhead
    // image/font could still be loading when print() fired.
    const handlePrint = async (meeting) => {
        setPrintingId(meeting.id);
        // Open the tab synchronously, inside the click's call stack, so popup
        // blockers treat it as user-initiated - opening it later after the
        // `await` below would get silently blocked (it's no longer inside a
        // trusted user-gesture context).
        const newTab = window.open('', '_blank');
        try {
            const res = await api.get(`/admin/meetings/${meeting.id}/print`, { responseType: 'blob' });
            const blobUrl = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            if (newTab) {
                newTab.location.href = blobUrl;
            } else {
                // Even the synchronous open was blocked - fall back to a direct download.
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `محضر-اجتماع-${meeting.date}.pdf`;
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        } catch (err) {
            if (newTab) newTab.close();
            setAlert({ message: 'حدث خطأ أثناء إنشاء ملف PDF.', type: 'danger' });
            console.error(err);
        } finally {
            setPrintingId(null);
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
                                                        <AdminBtn variant="info" icon="la-print" onClick={() => handlePrint(m)} disabled={printingId === m.id}>
                                                            {printingId === m.id ? 'جارِ الإنشاء...' : 'طباعة'}
                                                        </AdminBtn>
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