import React, { useState } from 'react';
import PageBanner from '../../components/PageBanner';
import { submitContact } from '../../api';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await submitContact(formData);
            setStatus({ type: 'success', message: res.data.message || 'تم إرسال رسالتكم بنجاح.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            if (err.response?.status === 422 && err.response.data.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setStatus({ type: 'danger', message: firstError });
            } else {
                setStatus({ type: 'danger', message: err.response?.data?.message || 'حدث خطأ أثناء إرسال رسالتكم. الرجاء المحاولة مرة أخرى.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="content">
            <PageBanner title="تواصل معنا" />
            <section>
                <div className="container">
                    <div className="eco_contact_form">
                        <div className="row">
                            <div className="col-md-8 no-padding col-sm-12 responsive-991-width">
                                <form onSubmit={handleSubmit}>
                                    <div className="your-submit-message">
                                        <h5 className="eco_sm_titles">أرسل لنا رسالة</h5>
                                        {status.message && (
                                            <div className={`alert alert-${status.type}`} style={{ textAlign: 'center' }}>
                                                {status.message}
                                            </div>
                                        )}
                                        <div className="writeing-felid">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <input type="text" name="name" placeholder="أدخل الاسم" className="form-control" value={formData.name} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="email" name="email" placeholder="البريد الإلكتروني" className="form-control" value={formData.email} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-12">
                                                    <input type="text" name="subject" placeholder="الموضوع" className="form-control" value={formData.subject} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-12">
                                                    <textarea name="message" placeholder="نص الرسالة" className="form-control" style={{ height: '150px' }} value={formData.message} onChange={handleChange} required></textarea>
                                                </div>
                                            </div>
                                            <button className="btn-small xsmall-btn" type="submit" disabled={submitting}>
                                                {submitting ? 'جارٍ الإرسال...' : 'أرسل'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-4 no-padding col-sm-12 responsive-991-width">
                                <div className="eco_detail_address">
                                    <h5 className="eco_sm_titles">معلومات التواصل</h5>
                                    <ul className="eco_admin_info">
                                        <li><i className="fa fa-phone" aria-hidden="true"></i><p>32 07 06 00 6 212+</p></li>
                                        <li><i className="fa fa-envelope" aria-hidden="true"></i><p>info@balsam.com </p></li>
                                    </ul>
                                    <h5 className="eco_sm_titles">حسابات التواصل الاجتماعي</h5>
                                    <ul className="social-icons">
                                        <li><a href="https://facebook.com/BalsamAutisme/"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                                        <li><a href="https://twitter.com/"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
                                        <li><a href="https://instagram.com/"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
