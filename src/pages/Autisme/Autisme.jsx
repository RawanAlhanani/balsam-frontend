import React, { useEffect, useState } from 'react';
import { getAutismePages } from '../../api';
import { Link } from 'react-router-dom';
import PageBanner from '../../components/PageBanner';

const Autisme = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAutismePages()
            .then(response => {
                setPages(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching autisme pages:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }} className="eco_headings"><h3>جاري التحميل...</h3></div>;

    return (
        <div className="content">
            <PageBanner title="فهم التوحد" />

            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>فهم التوحد</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="row">
                        {pages.map(page => (
                            <div key={page.id} className="col-md-4 col-sm-6" style={{ marginBottom: '30px' }}>
                                <div className="eco_blog_column">
                                    <figure>
                                        <div className="eco_thumb eco_hover_effect">
                                            <img src={`/storage/MesImages/${page.page_image}`} alt="" style={{ height: '200px', objectFit: 'cover' }} />
                                            <div className="eco_hover_btn">
                                                <Link className="mediem_btn_02" to={`/page_autisme/${page.id}`}>قراءة المزيد</Link>
                                            </div>
                                        </div>
                                    </figure>
                                    <div className="eco_blog_content">
                                        <div className="eco-event-title">
                                            <h5>{page.titre}</h5>
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
