import React, { useEffect, useState } from 'react';
import { getAutismePages } from '../../api';
import { Link } from 'react-router-dom';
import PageBanner from '../../components/PageBanner';
import Loading from '../../components/Loading';
import { getStorageUrl } from '../../utils/formatters'; // Assuming getStorageUrl is available

const Autisme = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        getAutismePages()
            .then(response => {
                setPages(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching autisme pages:", error);
                setError("حدث خطأ أثناء تحميل صفحات التوحد."); // Set user-friendly error message
                setLoading(false);
            });
    }, []);

    if (loading) return <Loading />;
    if (error) return <div className="alert alert-danger text-center m-5">{error}</div>;
    if (pages.length === 0 && !loading) return <div className="text-center m-5 eco_headings"><h3>لا توجد صفحات توحد لعرضها حاليًا.</h3></div>;


    return (
        <div className="content">
            <PageBanner  />

            <section className="eco_services_environment py-5"> {/* Added padding */}
                <div className="container">
                    <div className="eco_headings mb-5 text-center"> {/* Centered heading */}
                        <h3><b>فهم التوحد</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="row justify-content-center"> {/* Centered cards */}
                        {pages.map(page => (
                            <div key={page.id} className="col-lg-4 col-md-6 col-sm-12 mb-4"> {/* Adjusted column sizes */}
                                <div className="card h-100 shadow-sm border-0"> {/* Modern card styling */}
                                    <img 
                                        src={getStorageUrl(page.page_image)} 
                                        className="card-img-top" 
                                        alt={page.titre} 
                                        style={{ height: '220px', objectFit: 'cover' }} 
                                    />
                                    <div className="card-body text-center d-flex flex-column"> {/* Centered content */}
                                        <h5 className="card-title text-primary mb-3">{page.titre}</h5> {/* Styled title */}
                                        {/* Optional: Add a short description preview here if available in page data */}
                                        {/* <p className="card-text text-muted">A short snippet of the description...</p> */}
                                        <div className="mt-auto"> {/* Push button to bottom */}
                                            <Link className="btn btn-outline-primary mt-3" to={`/page_autisme/${page.id}`}>
                                                قراءة المزيد <i className="la la-arrow-right"></i> {/* Added icon */}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Autisme;