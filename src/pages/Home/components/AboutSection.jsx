import React from 'react';
import { Link } from 'react-router-dom';
import { formatDescription, getStorageUrl } from '../../../utils/formatters';

const AboutSection = ({ aboutData }) => {
    if (!aboutData || aboutData.length === 0) return null;

    const mainAbout = aboutData[0];

    return (
        <section className="eco_services_environment">
            <div className="container">
                <div className="eco_headings">
                    <h3><b>جمعية بلسم لذوي التوحد</b></h3>
                    <h6>من نحن</h6>
                    <span><i className="icon-nature-2"></i></span>
                </div>
                <div className="eco_services">
                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="aboutus">
                                <div style={{ fontSize: '15px' }}>
                                    {aboutData.map(ab => (
                                        <div key={ab.id} dangerouslySetInnerHTML={{ __html: formatDescription(ab.description) }} />
                                    ))}
                                </div>
                                <Link to="/about" className="aread">قراءة المزيد</Link>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 hidden-sm-down">
                            <figure>
                                <div className="thumb-widthout-layer">
                                    <img 
                                        style={{ height: '90%', width: '100%', objectFit: 'cover' }} 
                                        src={getStorageUrl(mainAbout.about_image)} 
                                        alt="" 
                                    />
                                </div>
                            </figure>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
