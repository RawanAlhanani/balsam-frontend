import React from 'react';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../../utils/formatters';

const ProjectsSection = ({ projects }) => {
    if (!projects || projects.length === 0) return null;

    return (
        <section>
            <div className="container">
                <div className="eco_headings">
                    <h3><b>مشاريع جمعية بلسم</b></h3>
                    <h6>نبذل قصارى جهدنا لخدمتكم</h6>
                    <span><i className="icon-nature-2"></i></span>
                </div>
                <div className="eco_featured_causes">
                    <div className="row">
                        {projects.map(pr => (
                            <div key={pr.id} className="col-md-3 col-sm-6 responsive-devider-50">
                                <div className="eco_flip-container">
                                    <div className="flipper feature-blog">
                                        <div className="front">
                                            <figure>
                                                <div className="eco-thumb">
                                                    <img 
                                                        src={getStorageUrl(pr.projet_image)} 
                                                        alt={pr.titre} 
                                                        style={{ height: '220px', width: '100%', objectFit: 'cover' }} 
                                                    />
                                                </div>
                                            </figure>
                                            <div className="feature_blog_caption">
                                                <Link to={`/projet/${pr.id}`} className="ProjectsRead">{pr.titre}</Link>
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
    );
};

export default ProjectsSection;
