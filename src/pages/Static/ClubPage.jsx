import React from 'react';
import PageBanner from '../../components/PageBanner';
import { Link } from 'react-router-dom';

const ClubPage = () => {
    return (
        <div className="content">
            <PageBanner title="نادي للأسر" />

            <section>
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>نادي للأسر</b></h3>
                        <h6>لقاءات النادي | نصائح للأسر</h6>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="eco_featured_causes">
                        <div className="row">
                            <div className="col-md-4 col-sm-6 responsive-devider-50">
                                <div className="eco_flip-container">
                                    <div className="flipper feature-blog">
                                        <div className="front">
                                            <figure>
                                                <div className="eco-thumb">
                                                    <img src="/content/cache/content/upload/reports/icon1-350x306.png" alt="" />
                                                </div>
                                            </figure>
                                            <div className="feature_blog_caption">
                                                <h5><Link to="/clubmeet">لقاءات النادي</Link></h5>
                                                <div className="progress-names">
                                                    <div className="progress-wrap progress">
                                                        <div className="progress-bar progress" style={{ width: '0%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6 responsive-devider-50">
                                <div className="eco_flip-container">
                                    <div className="flipper feature-blog">
                                        <div className="front">
                                            <figure>
                                                <div className="eco-thumb">
                                                    <img src="/content/cache/content/upload/reports/icon3-350x306.png" alt="" />
                                                </div>
                                            </figure>
                                            <div className="feature_blog_caption">
                                                <h5><Link to="/tipsfamilies">نصائح للأسر</Link></h5>
                                                <div className="progress-names">
                                                    <div className="progress-wrap progress">
                                                        <div className="progress-bar progress" style={{ width: '0%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClubPage;
