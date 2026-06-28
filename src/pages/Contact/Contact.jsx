import React from 'react';
import PageBanner from '../../components/PageBanner';

const Contact = () => {
    return (
        <div className="content">
            <PageBanner/>

            <section>
                <div className="container">
                    <div className="eco_contact_form">
                        <div className="row">
                            <div className="col-md-8 no-padding col-sm-12 responsive-991-width">
                                <form>
                                    <div className="your-submit-message">
                                        <h5 className="eco_sm_titles">أرسل لنا رسالة</h5>
                                        <div className="writeing-felid">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <input type="text" placeholder="أدخل الاسم" className="form-control" />
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="email" placeholder="البريد الإلكتروني" className="form-control" />
                                                </div>
                                                <div className="col-md-12">
                                                    <input type="text" placeholder="الموضوع" className="form-control" />
                                                </div>
                                                <div className="col-md-12">
                                                    <textarea placeholder="نص الرسالة" className="form-control" style={{ height: '150px' }}></textarea>
                                                </div>
                                            </div>
                                            <button className="btn-small xsmall-btn" type="button">أرسل</button>
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
