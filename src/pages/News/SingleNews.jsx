import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSingleNews } from '../../api';
import PageBanner from '../../components/PageBanner';
import { getStorageUrl } from '../../utils/formatters';

const SingleNews = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);

        getSingleNews(id)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching news detail:", error);
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

    if (!data || !data.news) return (
        <div className="content">
            <PageBanner title="خطأ" />
            <div style={{ textAlign: 'center', padding: '100px' }} className="eco_headings">
                <h3>الخبر غير موجود.</h3>
            </div>
        </div>
    );

    const { news, latest_news } = data;

    return (
        <div className="content" key={id}>
            <PageBanner title={news.titre} />

            <section className="eco_services_environment" style={{ padding: '60px 0' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="eco_headings" style={{ textAlign: 'right', marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0d5377' }}>{news.titre}</h2>
                                <span style={{ marginTop: '15px' }}><i className="icon-nature-2"></i></span>
                            </div>
                            
                            <figure style={{ marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                                <img src={getStorageUrl(news.image_info)} alt={news.titre} style={{ width: '100%', display: 'block' }} />
                            </figure>

                            <div className="aboutus" style={{ fontSize: '18px', lineHeight: '1.8', color: '#555', textAlign: 'justify' }}>
                                <div dangerouslySetInnerHTML={{ __html: news.description?.replace(/\n/g, '<br />') }} />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-md-4">
                            <div className="eco_headings" style={{ textAlign: 'right', marginBottom: '25px' }}>
                                <h4 style={{ fontSize: '24px', fontWeight: 'bold' }}><b>أحدث الأخبار</b></h4>
                            </div>
                            <ul className="eco_widget_post" style={{ padding: 0 }}>
                                {latest_news?.map(item => (
                                    <li key={item.id} style={{ marginBottom: '25px', listStyle: 'none', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                        <div className="eco_recent_posts" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <figure style={{ margin: 0, flexShrink: 0 }}>
                                                <div className="eco_thumb eco_hover_effect" style={{ width: '100px', height: '75px', borderRadius: '6px', overflow: 'hidden' }}>
                                                    <Link to={`/Information/${item.id}`}>
                                                        <img src={getStorageUrl(item.image_info)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </Link>
                                                </div>
                                            </figure>
                                            <div className="eco_post-content" style={{ padding: '0 15px', flexGrow: 1 }}>
                                                <p style={{ margin: 0 }}>
                                                    <Link 
                                                        to={`/Information/${item.id}`} 
                                                        style={{ fontSize: '17px', color: '#333', fontWeight: '600', lineHeight: '1.4' }}
                                                    >
                                                        {item.titre}
                                                    </Link>
                                                </p>
                                                <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
                                                    <i className="fa fa-clock-o"></i> {new Date(item.updated_at).toLocaleDateString('ar-MA')}
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

export default SingleNews;
