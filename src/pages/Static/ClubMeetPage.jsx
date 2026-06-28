import React from 'react';
import PageBanner from '../../components/PageBanner';

const ClubMeetPage = () => {
    return (
        <div className="content">
            <PageBanner />

            <section>
                <div className="eco_blog_detail">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-9 col-sm-12 col-xs-12 responsive-991-width">
                                <div className="eco_blog_detail_post">
                                    <figure>
                                        <img className="img-responsive cimage" src="/content/upload/reports/icon1.png" alt="Photo" />
                                    </figure>
                                    <div className="eco_blog_detail_content">
                                        <div className="eco_share-tag">
                                            <span> شارك المحتوى</span>
                                            <ul className="social-icons">
                                                <li><a href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                                                <li><a href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
                                                <li><a href="#"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
                                            </ul>
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

export default ClubMeetPage;
