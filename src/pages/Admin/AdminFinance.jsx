import React, { useState, useEffect } from 'react';
import api from '../../api';

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

    useEffect(() => { 
        fetchFinance(); 
        fetchCategories();
    }, [filter]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/finance-categories');
            const sorted = { income: [], expense: [] };
            res.data.forEach(c => sorted[c.type].push(c.name));
            setCategories(sorted);
            if (!formData.category && sorted.income.length > 0) {
                setFormData(prev => ({...prev, category: sorted.income[0]}));
            }
        } catch (err) { console.error(err); }
    };

    const fetchFinance = async () => {
        const res = await api.get(`/admin/finance?month=${filter.month}&year=${filter.year}`);
        setFinanceData(res.data);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
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
                </style>
            </head>
            <body>
                <div class="background-frame">
                    <img src="${logoUrl}" alt="background" />
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
                <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); }</script>
            </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/finance/${isEditing}`, formData);
            } else {
                await api.post('/admin/finance', formData);
            }
            setShowForm(false);
            setIsEditing(null);
            fetchFinance();
        } catch (err) { alert('خطأ في الحفظ'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('حذف هذه العملية؟')) {
            await api.delete(`/admin/finance/${id}`);
            fetchFinance();
        }
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">التقرير المالي</h3>
                    </div>
                    <div className="col-md-6 text-right">
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'إلغاء' : 'إضافة عملية مالية'}
                        </button>
                    </div>
                </div>
                <div className="content-body">
                    {/* Summary Cards */}
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card text-white bg-success">
                                <div className="card-body text-center">
                                    <h4>إجمالي المداخيل</h4>
                                    <h2>{financeData.total_income} DH</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-white bg-danger">
                                <div className="card-body text-center">
                                    <h4>إجمالي المصاريف</h4>
                                    <h2>{financeData.total_expense} DH</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-white bg-info">
                                <div className="card-body text-center">
                                    <h4>الباقي</h4>
                                    <h2>{financeData.balance} DH</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="card mb-4">
                        <div className="card-body d-flex align-items-center">
                            <label className="mr-2">الشهر:</label>
                            <select className="form-control col-md-2 mr-3" value={filter.month} onChange={e => setFilter({...filter, month: e.target.value})}>
                                {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                            </select>
                            <label className="mr-2">السنة:</label>
                            <input type="number" className="form-control col-md-2" value={filter.year} onChange={e => setFilter({...filter, year: e.target.value})} />
                        </div>
                    </div>

                    {showForm && (
                        <div className="card mb-4 border-primary">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <label>النوع</label>
                                            <select className="form-control" onChange={e => {
                                                const type = e.target.value;
                                                setFormData({...formData, type, category: categories[type][0]});
                                            }}>
                                                <option value="income">مدخول (+)</option>
                                                <option value="expense">مصروف (-)</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label>الفئة</label>
                                            <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                                {categories[formData.type].map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-2"><label>المبلغ</label><input type="number" className="form-control" onChange={e => setFormData({...formData, amount: e.target.value})} required /></div>
                                        <div className="col-md-2"><label>التاريخ</label><input type="date" className="form-control" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required /></div>
                                        <div className="col-md-3"><label>الوصف</label><input className="form-control" onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                                    </div>
                                    <button className="btn btn-success mt-3">حفظ العملية</button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="text-right mb-2">
                        <button className="btn btn-info" onClick={handlePrint}>
                            <i className="la la-print"></i> استخراج التقرير الشهري (PDF)
                        </button>
                    </div>

                    <div className="card">
                        <div className="table-responsive">
                            <table className="table table-striped">
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
                                            <td>{t.amount} DH</td>
                                            <td>{t.description}</td>
                                            <td>
                                                <button onClick={() => handleEdit(t)} className="btn btn-sm btn-outline-primary mr-1">تعديل</button>
                                                <button onClick={() => handleDelete(t.id)} className="btn btn-sm btn-outline-dark">حذف</button>
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

export default AdminFinance;
