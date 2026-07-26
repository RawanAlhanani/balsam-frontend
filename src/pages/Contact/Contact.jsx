import React, { useEffect, useState } from 'react';
import PageBanner from '../../components/PageBanner';
import { submitContact, getSiteSettings } from '../../api';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [siteSettings, setSiteSettings] = useState({});

    useEffect(() => {
        getSiteSettings()
            .then(res => setSiteSettings(res.data || {}))
            .catch(err => console.error('Error fetching site settings:', err));
    }, []);

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
                                        {siteSettings.phone && (
                                            <li><i className="fa fa-phone" aria-hidden="true"></i><p dir="ltr">{siteSettings.phone}</p></li>
                                        )}
                                        {siteSettings.email && (
                                            <li><i className="fa fa-envelope" aria-hidden="true"></i><p>{siteSettings.email}</p></li>
                                        )}
                                    </ul>
                                    <h5 className="eco_sm_titles">حسابات التواصل الاجتماعي</h5>
                                    <ul className="social-icons">
                                        {siteSettings.facebook_url && (
                                            <li><a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                                        )}
                                        {siteSettings.instagram_url && (
                                            <li><a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                                        )}
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
