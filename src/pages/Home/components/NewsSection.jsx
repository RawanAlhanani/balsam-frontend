import React from 'react';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../../utils/formatters';

const NewsSection = ({ news }) => {
    if (!news || news.length === 0) return null;

    return (
        <section>
            <div className="container">
                <div className="eco_headings">
                    <h3><b>أحدث الأخبار</b></h3>
                </div>
                <div className="eco_blog_section">
                    <div className="row">
                        {news.map((inf, index) => (
                            <div key={inf.id} className="col-md-4 col-sm-6 responsive-col-xs">
                                <div className={`eco_blog_column ${index % 2 !== 0 ? 'blog-picture-down' : ''}`}>
                                    {index % 2 === 0 && (
                                        <figure>
                                            <div className="eco_thumb eco_hover_effect">
                                                <img src={getStorageUrl(inf.image_info)} alt={inf.titre} />
                                                <div className="eco_hover_btn">
                                                    <Link className="mediem_btn_02" to={`/Information/${inf.id}`}>قراءة المزيد</Link>
                                                </div>
                                            </div>
                                        </figure>
                                    )}
                                    <div className="eco_blog_content">
                                        <div className="eco-event-title">
                                            <h5>{inf.titre}</h5>
                                        </div>
                                        <div className="aboutus">
                                            <p style={{ textAlign: 'justify' }}>
                                                {inf.description.substring(0, 150)}...
                                            </p>
                                        </div>
                                    </div>
                                    {index % 2 !== 0 && (
                                        <figure>
                                            <div className="eco_thumb eco_hover_effect">
                                                <img src={getStorageUrl(inf.image_info)} alt={inf.titre} />
                                                <div className="eco_hover_btn">
                                                    <Link className="mediem_btn_02" to={`/Information/${inf.id}`}>قراءة المزيد</Link>
                                                </div>
                                            </div>
                                        </figure>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
