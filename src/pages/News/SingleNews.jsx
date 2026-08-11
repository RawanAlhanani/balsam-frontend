import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSingleNews } from '../../api';
import PageBanner from '../../components/PageBanner';
import Loading from '../../components/Loading';
import { getStorageUrl } from '../../utils/formatters';

const SingleNews = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        setLoading(true);
        setError(null); // Clear previous errors
        window.scrollTo(0, 0);

        getSingleNews(id)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching news detail:", err);
                setError("حدث خطأ أثناء تحميل تفاصيل الخبر."); // User-friendly error
                setLoading(false);
            });
    }, [id]);

    const PLACEHOLDER_IMAGE = "/content/cache/system/images/noimage-650x380.jpg";

    // Consistent loading state
    if (loading) return <Loading />;

    // Consistent error state
    if (error) return (
        <div className="alert alert-danger text-center m-5">{error}</div>
    );

    // Consistent not found state
    if (!data || !data.news) return (
        <div className="text-center m-5 eco_headings"><h3>الخبر غير موجود.</h3></div>
    );

    const { news, latest_news } = data;

    return (
        <div className="content" key={id}>
            <PageBanner title={news.titre} />

            <section className="eco_services_environment py-5"> {/* Added padding */}
                <div className="container">
                    <div className="row justify-content-center"> {/* Centered content */}
                        <div className="col-lg-8 col-md-12"> {/* Changed col-md-10 to col-md-12 for main content */}
                            <div className="eco_headings mb-5 text-center"> {/* Centered heading */}
                                <h1 className="display-4 mb-3"><b>{news.titre}</b></h1> {/* Larger, more prominent title */}
                                <small className="text-muted d-block mb-4">
                                    <i className="fa fa-clock-o ml-1"></i> {new Date(news.updated_at).toLocaleDateString('ar-MA')}
                                </small>
                                <span><i className="icon-nature-2"></i></span>
                            </div>

                            <figure className="mb-5 text-center"> {/* Increased margin-bottom */}
                                <img
                                    src={news.image_info ? getStorageUrl(news.image_info) : PLACEHOLDER_IMAGE}
                                    alt={news.titre}
                                    className="img-fluid rounded shadow-sm" // Responsive image, rounded corners, shadow
                                    style={{ maxHeight: '450px', width: '100%', objectFit: 'contain', backgroundColor: '#f4f4f4' }}
                                />
                            </figure>

                            <div className="aboutus text-justify"> {/* Justified text for better readability */}
                                <p className="lead" dangerouslySetInnerHTML={{ __html: news.description?.replace(/\n/g, '<br />') }} />
                            </div>
                        </div>

                        {/* Sidebar for Latest News */}
                        <div className="col-lg-4 col-md-12 mt-5 mt-lg-0"> {/* Changed col-md-10 to col-md-12 for sidebar */}
                            <div className="mb-4">
                                <h4 className="h3 mb-3">   أخبار أخرى</h4>
                            </div>
                            <ul className="list-unstyled"> {/* Removed default list styling */}
                                {latest_news?.length > 0 ? (
                                    latest_news.map(item => (
                                        <li key={item.id} className="mb-4 pb-3 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 ml-3">
                                                    <Link to={`/Information/${item.id}`}>
                                                        <img
                                                            src={item.image_info ? getStorageUrl(item.image_info) : PLACEHOLDER_IMAGE}
                                                            alt={item.titre || "صورة الخبر"}
                                                            className="rounded"
                                                            style={{ width: '90px', height: '60px', objectFit: 'cover' }}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1">
                                                        <Link
                                                            to={`/Information/${item.id}`}
                                                            className="text-dark font-weight-bold"
                                                        >
                                                            {item.titre}
                                                        </Link>
                                                    </h6>
                                                    <small className="text-muted">
                                                        <i className="fa fa-clock-o ml-1"></i> {new Date(item.updated_at).toLocaleDateString('ar-MA')}
                                                    </small>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-muted text-center">لا توجد أخبار أخرى.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleNews;