import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActivity } from '../../api';
import PageBanner from '../../components/PageBanner';
import { getStorageUrl } from '../../utils/formatters';

const SingleActivity = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);

        getActivity(id)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching activity detail:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="content">
            <PageBanner title="جاري التحميل..." />
            <div style={{ textAlign: 'center', padding: '100px' }} className="eco_headings">
                <h3>جاري التحميل...</h3>
            </div>
        </div>
    );

    if (!data || !data.activity) return (
        <div className="content">
            <PageBanner title="خطأ" />
            <div style={{ textAlign: 'center', padding: '100px' }} className="eco_headings">
                <h3>النشاط غير موجود.</h3>
            </div>
        </div>
    );

    const { activity, latest_activities } = data;

    return (
        <div className="content" key={id}>
            <PageBanner title={activity.titre} />

            <section className="eco_services_environment" style={{ padding: '60px 0' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="eco_headings" style={{ textAlign: 'right', marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0d5377' }}>{activity.titre}</h2>
                                {activity.typeactivite && (
                                    <h6 style={{ color: '#f05c7d', marginTop: '10px', fontSize: '18px' }}>
                                        {activity.typeactivite.nom_type}
                                    </h6>
                                )}
                                <span style={{ marginTop: '15px' }}><i className="icon-nature-2"></i></span>
                            </div>
                            
                            <figure style={{ marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                                <img src={getStorageUrl(activity.image_activite)} alt={activity.titre} style={{ width: '100%', display: 'block' }} />
                            </figure>

                            <div className="aboutus" style={{ fontSize: '18px', lineHeight: '1.8', color: '#555', textAlign: 'justify' }}>
                                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '25px', borderRight: '5px solid #0d5377' }}>
                                    <p style={{ margin: '5px 0' }}><strong><i className="fa fa-calendar"></i> التاريخ:</strong> {activity.date_activite}</p>
                                    <p style={{ margin: '5px 0' }}><strong><i className="fa fa-map-marker"></i> المكان:</strong> {activity.lieu_activite}</p>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: activity.description?.replace(/\n/g, '<br />') }} />
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <Link to={`/vouloirParticiper/${activity.id}`} className="aread" style={{ padding: '15px 40px', fontSize: '18px' }}>
                                    المشاركة في النشاط
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-md-4">
                            <div className="eco_headings" style={{ textAlign: 'right', marginBottom: '25px' }}>
                                <h4 style={{ fontSize: '24px', fontWeight: 'bold' }}><b>أنشطة أخرى</b></h4>
                            </div>
                            <ul className="eco_widget_post" style={{ padding: 0 }}>
                                {latest_activities?.map(item => (
                                    <li key={item.id} style={{ marginBottom: '25px', listStyle: 'none', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                        <div className="eco_recent_posts" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <figure style={{ margin: 0, flexShrink: 0 }}>
                                                <div className="eco_thumb eco_hover_effect" style={{ width: '100px', height: '75px', borderRadius: '6px', overflow: 'hidden' }}>
                                                    <Link to={`/uneActivite/${item.id}`}>
                                                        <img src={getStorageUrl(item.image_activite)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </Link>
                                                </div>
                                            </figure>
                                            <div className="eco_post-content" style={{ padding: '0 15px', flexGrow: 1 }}>
                                                <p style={{ margin: 0 }}>
                                                    <Link 
                                                        to={`/uneActivite/${item.id}`} 
                                                        style={{ fontSize: '17px', color: '#333', fontWeight: '600', lineHeight: '1.4' }}
                                                    >
                                                        {item.titre}
                                                    </Link>
                                                </p>
                                                <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
                                                    <i className="fa fa-calendar-o"></i> {item.date_activite}
                                                </small>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleActivity;
