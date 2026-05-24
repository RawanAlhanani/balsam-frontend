import React, { useEffect, useState } from 'react';
import { getNews } from '../../api';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../utils/formatters';
import PageBanner from '../../components/PageBanner';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getNews()
            .then(response => {
                setNews(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching news:", error);
                setError("حدث خطأ أثناء تحميل الأخبار.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }} className="eco_headings"><h3>جاري التحميل...</h3></div>;
    if (error) return <div style={{ textAlign: 'center', padding: '100px' }} className="alert alert-danger">{error}</div>;

    return (
        <div className="content">
            <PageBanner title="أخبارنا" />

            <section>
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>أخبار جمعية بلسم</b></h3>
                        <h6>نبذل قصارى جهدنا لخدمتكم</h6>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="eco_featured_causes">
                        <div className="row">
                            {news.map((v) => (
                                <div key={v.id} className="col-md-4 col-sm-6 responsive-devider-50">
                                    <div className="eco_flip-container">
                                        <div className="flipper feature-blog">
                                            <div className="front">
                                                <figure>
                                                    <div className="eco-thumb">
                                                        <img src={getStorageUrl(v.image_info)} alt="" />
                                                    </div>
                                                </figure>
                                                <div className="feature_blog_caption">
                                                    <h5><Link to={`/Information/${v.id}`}>{v.titre}</Link></h5>
                                                    <p>{v.description.substring(0, 150)}...</p>
                                                    <Link to={`/Information/${v.id}`} className="ProjectsRead">قراءة المزيد</Link>
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

export default News;
