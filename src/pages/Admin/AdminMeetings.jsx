import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormPanel, AdminFormGroup,
    AdminFormActions, AdminTableWrap, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const AdminMeetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '', location: '', start_time: '', end_time: '',
        attendees: '', absentees: '', agenda: '', discussions: '',
        decisions: '', next_meeting_date: ''
    });

    useEffect(() => { fetchMeetings(); }, []);

    const fetchMeetings = async () => {
        const res = await api.get('/admin/meetings');
        setMeetings(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/meetings', formData);
            setShowForm(false);
            fetchMeetings();
        } catch (err) { alert('خطأ في الحفظ'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('حذف هذا التقرير؟')) {
            await api.delete(`/admin/meetings/${id}`);
            fetchMeetings();
        }
    };

    const handlePrint = (meeting) => {
        const printWindow = window.open('', '_blank');
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
        <AdminPage>
            <AdminPageHeader
                title="تقارير الاجتماعات"
                subtitle="إنشاء وطباعة محاضر الاجتماعات"
                badge="التقارير"
                actions={
                    <AdminBtn variant={showForm ? 'secondary' : 'primary'} icon={showForm ? 'la-times' : 'la-plus'} onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'إلغاء' : 'إضافة تقرير'}
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminFormPanel title="تقرير اجتماع جديد" open={showForm} onClose={() => setShowForm(false)} onSubmit={handleSubmit}>
                    <div className="row">
                        <AdminFormGroup label="التاريخ" className="col-md-4">
                            <input type="date" className="form-control" onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="المكان" className="col-md-4">
                            <input className="form-control" onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="ساعة البدء" className="col-md-2">
                            <input type="time" className="form-control" onChange={e => setFormData({ ...formData, start_time: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="ساعة النهاية" className="col-md-2">
                            <input type="time" className="form-control" onChange={e => setFormData({ ...formData, end_time: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الحاضرون" className="col-md-6">
                            <textarea className="form-control" rows="3" onChange={e => setFormData({ ...formData, attendees: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="الغائبون" className="col-md-6">
                            <textarea className="form-control" rows="3" onChange={e => setFormData({ ...formData, absentees: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="جدول الأعمال" className="col-md-12">
                            <textarea className="form-control" rows="3" onChange={e => setFormData({ ...formData, agenda: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="المناقشة" className="col-md-12">
                            <textarea className="form-control" rows="4" onChange={e => setFormData({ ...formData, discussions: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="أهم القرارات" className="col-md-12">
                            <textarea className="form-control" rows="4" onChange={e => setFormData({ ...formData, decisions: e.target.value })} />
                        </AdminFormGroup>
                        <AdminFormGroup label="موعد اللقاء المقبل" className="col-md-4">
                            <input type="date" className="form-control" onChange={e => setFormData({ ...formData, next_meeting_date: e.target.value })} />
                        </AdminFormGroup>
                    </div>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check">حفظ التقرير</AdminBtn>
                    </AdminFormActions>
                </AdminFormPanel>

                <AdminCard title="قائمة الاجتماعات" icon="la-comments" flush>
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
                                                <AdminBtn variant="danger" icon="la-trash" onClick={() => handleDelete(m.id)}>حذف</AdminBtn>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminTableWrap>
                </AdminCard>
            </div>
        </AdminPage>
    );
};

export default AdminMeetings;
