import React, { useEffect, useState } from 'react';
import { getActivities } from '../../api';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../utils/formatters';
import PageBanner from '../../components/PageBanner';

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getActivities()
            .then(response => {
                setActivities(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching activities:", error);
                setError("حدث خطأ أثناء تحميل الأنشطة.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }} className="eco_headings"><h3>جاري التحميل...</h3></div>;
    if (error) return <div style={{ textAlign: 'center', padding: '100px' }} className="alert alert-danger">{error}</div>;

    return (
        <div className="content">
            <PageBanner title="أنشطتنا" />

            <section>
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>أنشطة جمعية بلسم</b></h3>
                        <h6>نبذل قصارى جهدنا لخدمتكم</h6>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="eco_featured_causes">
                        <div className="row">
                            {activities.map((v) => (
                                <div key={v.id} className="col-md-4 col-sm-6 responsive-devider-50">
                                    <div className="eco_flip-container">
                                        <div className="flipper feature-blog">
                                            <div className="front">
                                                <figure>
                                                    <div className="eco-thumb">
                                                        <img src={getStorageUrl(v.image_activite)} alt="" />
                                                    </div>
                                                </figure>
                                                <div className="feature_blog_caption">
                                                    <div className="row" style={{ alignItems: 'center' }}>
                                                        <div className="col-md-6">
                                                            <h5><Link to={`/uneActivite/${v.id}`}>{v.titre}</Link></h5>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <a href="#" className="ProjectsRead" style={{ background: '#f05c7d', pointerEvents: 'none' }}>
                                                                {v.typeactivite?.nom_type}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <small className="pull-right" style={{ marginTop: '10px', color: '#0d5377' }}>
                                                        تاريخ النشاط : {v.date_activite}
                                                    </small>
                                                    <div className="progress-names">
                                                        <div className="progress-wrap progress">
                                                            <div className="progress-bar progress" style={{ width: '170.5px' }}></div>
                                                        </div>
                                                    </div>
                                                    <div style={{ clear: 'both' }}>
                                                        <p>{v.description.replace(/--|---|===/g, "").substring(0, 150)}...</p>
                                                    </div>
                                                    <Link to={`/uneActivite/${v.id}`} className="ProjectsRead">قراءة المزيد</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Activities;