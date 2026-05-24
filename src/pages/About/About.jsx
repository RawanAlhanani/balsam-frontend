import React, { useEffect, useState } from 'react';
import { getAbout } from '../../api';
import { formatDescription, getStorageUrl } from '../../utils/formatters';
import PageBanner from '../../components/PageBanner';

const About = () => {
    const [abouts, setAbouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAbout()
            .then(response => {
                setAbouts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching about data:", error);
                setError("حدث خطأ أثناء تحميل البيانات.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }} className="eco_headings"><h3>جاري التحميل...</h3></div>;
    if (error) return <div style={{ textAlign: 'center', padding: '100px' }} className="alert alert-danger">{error}</div>;

    return (
        <div className="content">
            <PageBanner title="من نحن" />
            
            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>من نحن</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    {abouts.map(ab => (
                        <div className="eco_services" key={ab.id} style={{ marginBottom: '50px' }}>
                            <div className="row">
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <div className="aboutus">
                                        <div style={{ fontSize: '15px' }}>
                                            <h4 style={{ color: '#0d5377', marginBottom: '20px' }}>{ab.titre}</h4>
                                            <div dangerouslySetInnerHTML={{ __html: formatDescription(ab.description) }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <figure>
                                        <div className="thumb-widthout-layer">
                                            <img 
                                                style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} 
                                                src={getStorageUrl(ab.about_image)} 
                                                alt={ab.titre} 
                                            />
                                        </div>
                                    </figure>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
