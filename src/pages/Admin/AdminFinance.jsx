import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminStatCard, AdminFormPanel,
    AdminFormGroup, AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert, AdminLoading, AdminEmptyState
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

const AdminFinance = () => {
    const [financeData, setFinanceData] = useState({ transactions: [], total_income: 0, total_expense: 0, previous_balance: 0, balance: 0 });
    const [categories, setCategories] = useState({ income: [], expense: [] });
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(null); // ID of transaction being edited
    const [filter, setFilter] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    const [formData, setFormData] = useState({
        type: 'income',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
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


    useEffect(() => {
        fetchCategories();
    }, []); // Fetch categories once on mount

    useEffect(() => {
        fetchFinance();
    }, [filter]); // Refetch finance data when filter changes

    // Lock background scroll and interactions when delete modal is open
    useEffect(() => {
        if (showDeleteConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModal]);


    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/finance-categories');
            const sorted = { income: [], expense: [] };
            res.data.forEach(c => sorted[c.type].push(c.name));
            setCategories(sorted);
            if (!formData.category && sorted.income.length > 0) {
                setFormData(prev => ({ ...prev, category: sorted.income[0] }));
            }
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        }
    };

    const fetchFinance = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/finance?month=${filter.month}&year=${filter.year}`);
            setFinanceData(res.data);
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
            type: 'income',
            category: categories.income.length > 0 ? categories.income[0] : '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            description: ''
        });
        setIsEditing(null);
        setFormErrors({}); // Clear form errors on reset
    };

    const handleEdit = (transaction) => {
        setFormData({
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            date: transaction.date,
            description: transaction.description || ''
        });
        setIsEditing(transaction.id);
        setShowForm(true);
        setFormErrors({}); // Clear form errors when opening edit form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handlePrint = () => {
        const logoUrl = window.location.origin + '/backend/app-assets/images/logo/meeting.jpg';

        const incomes = financeData.transactions.filter(t => t.type === 'income');
        const expenses = financeData.transactions.filter(t => t.type === 'expense');

        const prevMonth = filter.month === 1 ? 12 : filter.month - 1;
        const prevYear = filter.month === 1 ? filter.year - 1 : filter.year;

        const content = `
            <html dir="rtl">
            <head>
                <title>التقرير المالي - ${filter.month}/${filter.year}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
                    @page { size: A4; margin: 0; }
                    body { font-family: 'Amiri', serif; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

                    .background-frame { position: fixed; top: 0; left: 0; width: 210mm; height: 297mm; z-index: -1; }
                    .background-frame img { width: 100%; height: 100%; display: block; }

                    .print-table { width: 100%; border-collapse: collapse; position: relative; z-index: 1; }
                    .header-space { height: 55mm; }
                    .footer-space { height: 45mm; }
                    .content-cell { padding: 0 20mm; vertical-align: top; }

                    .report-title { text-align: center; font-size: 24px; font-weight: bold; color: #1a5a96; margin-bottom: 20px; text-decoration: underline; }

                    .summary-grid { display: flex; justify-content: space-between; margin-bottom: 30px; border: 2px solid #1a5a96; padding: 15px; border-radius: 10px; background: rgba(26, 90, 150, 0.05); }
                    .summary-item { text-align: center; flex: 1; }
                    .summary-label { font-weight: bold; font-size: 16px; display: block; }
                    .summary-value { font-size: 20px; color: #1a5a96; font-weight: bold; }

                    .table-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333; border-right: 5px solid #1a5a96; padding-right: 10px; margin-top: 15px; }
                    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .data-table th { background-color: #1a5a96; color: white; padding: 8px; border: 1px solid #ddd; font-size: 14px; }
                    .data-table td { padding: 6px; border: 1px solid #ddd; text-align: center; font-size: 14px; }
                    .income-row { background-color: rgba(40, 167, 69, 0.03); }
                    .expense-row { background-color: rgba(220, 53, 69, 0.03); }
                    .carry-over-row { background-color: #fff9c4; font-weight: bold; }

                    .total-line { font-weight: bold; background: #f5f5f5 !important; }
                    .final-balance-box { margin-top: 20px; padding: 15px; border: 2px solid #1a5a96; text-align: center; font-size: 20px; background: #e3f2fd; }

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
                    <thead><tr><td><div class="header-space"></div></td></tr></thead>
                    <tbody>
                        <tr>
                            <td class="content-cell">
                                <div class="report-title">التقرير المالي لشهر ${filter.month} سنة ${filter.year}</div>

                                <div class="summary-grid">
                                    <div class="summary-item"><span class="summary-label">رصيد الشهر السابق</span><span class="summary-value">${financeData.previous_balance} DH</span></div>
                                    <div class="summary-item"><span class="summary-label">مداخيل الشهر</span><span class="summary-value">${financeData.total_income} DH</span></div>
                                    <div class="summary-item"><span class="summary-label">مصاريف الشهر</span><span class="summary-value">${financeData.total_expense} DH</span></div>
                                </div>

                                <div class="table-title">تفاصيل المداخيل (Incomes)</div>
                                <table class="data-table">
                                    <thead><tr><th>التاريخ</th><th>الفئة</th><th>الوصف</th><th>المبلغ</th></tr></thead>
                                    <tbody>
                                        <tr class="carry-over-row">
                                            <td>01/${filter.month}/${filter.year}</td>
                                            <td>رصيد مرحل</td>
                                            <td>الباقي من شهر ${prevMonth}/${prevYear}</td>
                                            <td>${financeData.previous_balance} DH</td>
                                        </tr>
                                        ${incomes.map(t => `
                                            <tr class="income-row">
                                                <td>${t.date}</td>
                                                <td>${t.category}</td>
                                                <td>${t.description || '-'}</td>
                                                <td>${t.amount} DH</td>
                                            </tr>
                                        `).join('')}
                                        <tr class="total-line"><td colspan="3">المجموع الكلي للمداخيل (مع الرصيد السابق)</td><td>${financeData.previous_balance + financeData.total_income} DH</td></tr>
                                    </tbody>
                                </table>

                                <div class="table-title">تفاصيل المصاريف (Expenses)</div>
                                <table class="data-table">
                                    <thead><tr><th>التاريخ</th><th>الفئة</th><th>الوصف</th><th>المبلغ</th></tr></thead>
                                    <tbody>
                                        ${expenses.map(t => `
                                            <tr class="expense-row">
                                                <td>${t.date}</td>
                                                <td>${t.category}</td>
                                                <td>${t.description || '-'}</td>
                                                <td>${t.amount} DH</td>
                                            </tr>
                                        `).join('')}
                                        <tr class="total-line"><td colspan="3">إجمالي مصاريف الشهر</td><td>${financeData.total_expense} DH</td></tr>
                                    </tbody>
                                </table>

                                <div class="final-balance-box">
                                    الرصيد النهائي المتبقي (الباقي): <strong>${financeData.balance} DH</strong>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot><tr><td><div class="footer-space"></div></td></tr></tfoot>
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({}); // Clear previous errors
        setAlert({ message: '', type: '' }); // Clear general alert

        try {
            if (isEditing) {
                await api.put(`/admin/finance/${isEditing}`, formData);
                setAlert({ message: 'تم تحديث العملية بنجاح', type: 'success' });
            } else {
                await api.post('/admin/finance', formData);
                setAlert({ message: 'تم إضافة العملية بنجاح', type: 'success' });
            }
            setShowForm(false);
            resetForm();
            fetchFinance();
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

    const promptDelete = (id, description) => {
        setDeleteTargetId(id);
        setDeleteTargetName(description || 'هذه العملية');
        setShowDeleteConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/finance/${deleteTargetId}`);
            setAlert({ message: 'تم حذف العملية بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
            fetchFinance();
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

    return (
        <>
            <AdminPage>
                <AdminPageHeader
                    title="التقرير المالي"
                    subtitle="متابعة المداخيل والمصاريف والرصيد الشهري"
                    badge="المالية"
                    actions={
                        <AdminBtn variant={showForm ? 'secondary' : 'primary'} icon={showForm ? 'la-times' : 'la-plus'} onClick={() => { setShowForm(!showForm); resetForm(); }}>
                            {showForm ? 'إلغاء' : 'إضافة عملية'}
                        </AdminBtn>
                    }
                />
                <div className="content-body">
                    <div className="row">
                        <div className="col-md-4">
                            <AdminStatCard label="إجمالي المداخيل" value={financeData.total_income} suffix=" DH" icon="la-arrow-up" color="success" />
                        </div>
                        <div className="col-md-4">
                            <AdminStatCard label="إجمالي المصاريف" value={financeData.total_expense} suffix=" DH" icon="la-arrow-down" color="danger" />
                        </div>
                        <div className="col-md-4">
                            <AdminStatCard label="الباقي" value={financeData.balance} suffix=" DH" icon="la-wallet" color="info" />
                        </div>
                    </div>

                    <div className="admin-filter-bar">
                        <label>الشهر:</label>
                        <select className="form-control" value={filter.month} onChange={e => setFilter({ ...filter, month: parseInt(e.target.value) })}>
                            {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                        </select>
                        <label>السنة:</label>
                        <input type="number" className="form-control" value={filter.year} onChange={e => setFilter({ ...filter, year: parseInt(e.target.value) })} />
                        <AdminBtn variant="info" icon="la-print" onClick={handlePrint}>استخراج التقرير الشهري</AdminBtn>
                    </div>

                    <AdminFormPanel
                        title={isEditing ? 'تعديل العملية' : 'إضافة عملية مالية'}
                        open={showForm}
                        onClose={() => { setShowForm(false); resetForm(); }}
                        onSubmit={handleSubmit}
                    >
                        <div className="row">
                            <AdminFormGroup label="النوع" className="col-md-2">
                                <select className="form-control" name="type" value={formData.type} onChange={e => {
                                    const type = e.target.value;
                                    setFormData({ ...formData, type, category: categories[type].length > 0 ? categories[type][0] : '' });
                                    if (formErrors.type) setFormErrors(prev => ({ ...prev, type: null }));
                                }}>
                                    <option value="income">مدخول (+)</option>
                                    <option value="expense">مصروف (-)</option>
                                </select>
                                {formErrors.type && <div className="text-danger small mt-1">{formErrors.type[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="الفئة" className="col-md-3">
                                <select className="form-control" name="category" value={formData.category} onChange={handleInputChange}>
                                    {categories[formData.type].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                {formErrors.category && <div className="text-danger small mt-1">{formErrors.category[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="المبلغ" className="col-md-2">
                                <input type="number" className="form-control" name="amount" value={formData.amount} onChange={handleInputChange} required />
                                {formErrors.amount && <div className="text-danger small mt-1">{formErrors.amount[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="التاريخ" className="col-md-2">
                                <input type="date" className="form-control" name="date" value={formData.date} onChange={handleInputChange} required />
                                {formErrors.date && <div className="text-danger small mt-1">{formErrors.date[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="الوصف" className="col-md-3">
                                <input className="form-control" name="description" value={formData.description} onChange={handleInputChange} />
                                {formErrors.description && <div className="text-danger small mt-1">{formErrors.description[0]}</div>}
                            </AdminFormGroup>
                        </div>
                        <AdminFormActions>
                            <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                                {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : 'حفظ العملية'}
                            </AdminBtn>
                            <AdminBtn variant="secondary" icon="la-times" onClick={() => { setShowForm(false); resetForm(); }}>إلغاء</AdminBtn>
                        </AdminFormActions>
                    </AdminFormPanel>

                    <AdminCard title="سجل العمليات" icon="la-list" flush>
                        {loading ? (
                            <AdminLoading />
                        ) : financeData.transactions.length === 0 ? (
                            <AdminEmptyState icon="la-list" message="لا توجد عمليات مالية مسجلة لهذا الشهر" hint="أضف عملية مالية جديدة من الزر أعلاه" />
                        ) : (
                            <AdminTableWrap>
                                <table className="table table-hover admin-table">
                                    <thead>
                                        <tr>
                                            <th>التاريخ</th>
                                            <th>النوع</th>
                                            <th>الفئة</th>
                                            <th>المبلغ</th>
                                            <th>الوصف</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {financeData.transactions.map(t => (
                                            <tr key={t.id} className={t.type === 'income' ? 'table-success' : 'table-danger'}>
                                                <td>{t.date}</td>
                                                <td>{t.type === 'income' ? 'مدخول' : 'مصروف'}</td>
                                                <td>{t.category}</td>
                                                <td><strong>{t.amount} DH</strong></td>
                                                <td>{t.description}</td>
                                                <td>
                                                    <div className="admin-action-group">
                                                        <AdminBtn variant="outline-primary" icon="la-edit" onClick={() => handleEdit(t)}>تعديل</AdminBtn>
                                                        <AdminBtn variant="outline-danger" icon="la-trash" onClick={() => promptDelete(t.id, t.description)}>حذف</AdminBtn>
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

export default AdminFinance;