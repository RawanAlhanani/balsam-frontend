import React from 'react';

const DonationSection = () => {
    return (
        <section className="eco_services_environment">
            <div className="container">
                <div className="eco_headings">
                    <h3><b>للتبرع لجمعية بلسم :</b></h3>
                    <span><i className="icon-nature-2"></i></span>
                </div>
                <div className="eco_featured_causes">
                    <div className="row">
                        <div className="sendMail col-md-8 offset-md-2" style={{ textAlign: 'center' }}>
                            <img src="/content/upload/who-are-we/BANK.png" alt="معلومات الحساب البنكي للتبرع" className="img-fluid rounded shadow-sm" />
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .sendMail {
                    display: table;
                    margin: auto;
                }
            `}</style>
        </section>
    );
};

export default DonationSection;
