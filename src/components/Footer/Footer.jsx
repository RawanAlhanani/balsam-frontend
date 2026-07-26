import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNews, getSiteSettings } from '../../api';
import { getStorageUrl } from '../../utils/formatters';

const Footer = () => {
    const [recentNews, setRecentNews] = useState([]);
    const [siteSettings, setSiteSettings] = useState({});

    useEffect(() => {
        getNews(1)
            .then(res => setRecentNews((res.data.data || []).slice(0, 3)))
            .catch(err => console.error('Error fetching footer news:', err));

        getSiteSettings()
            .then(res => setSiteSettings(res.data || {}))
            .catch(err => console.error('Error fetching site settings:', err));
    }, []);

    return (
        <footer>
            <div className="eco_footer_content">
                <div className="container">
                    <div className="eco_footer_columns">
                        <div className="row">
                            <div className="col-md-4 col-sm-6 responsive-devider-50">
                                <div className="eco_our_features">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13189.665953784403!2d-6.630924230224613!3d34.2634302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda759433821ff21%3A0xb646352b6f334c6!2z2KzZhdi52YrYqSDYqNmE2LPZhSDZhNiw2YjZiiDYp9mE2KrZiNit2K8gLdiv2KfYsSDYp9mE2LXYrdip!5e0!3m2!1sen!2sus!4v1621631442154!5m2!1sen!2sus"
                                        width="100%"
                                        height="250"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        title="map"
                                    ></iframe>
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6 responsive-devider-50">
                                <div className="eco_offices_info">
                                    <h5 className="eco_sm_titles"> جمعية بلسم لذوي التوحد <br />
                                           تعمل عى تحسين حياة المصابين بالتوحد</h5>

                                    <ul className="eco_admin_info">
                                        {siteSettings.phone && (
                                            <li><i className="fa fa-phone" aria-hidden="true"></i><p dir="ltr">{siteSettings.phone}</p></li>
                                        )}
                                        {siteSettings.email && (
                                            <li><i className="fa fa-envelope" aria-hidden="true"></i><p>{siteSettings.email}</p></li>
                                        )}
                                    </ul>

                                    <ul className="social-icons">
                                        {siteSettings.facebook_url && (
                                            <li><a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                                        )}
                                        {siteSettings.instagram_url && (
                                            <li><a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                                        )}
                                        <li><a href="https://www.youtube.com/channel/UCQbDMLX0jQlPYAGWWn5n3sQ" target="_blank" rel="noopener noreferrer"><i className="fa fa-youtube" aria-hidden="true"></i></a></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6 responsive-devider-50">
                                <div className="eco_recent_blog_post">
                                    <h5 className="eco_sm_titles">أحدث الأخبار</h5>
                                    <ul className="eco_widget_post lastNews">
                                        {recentNews.map(item => (
                                            <li key={item.id} className="eco_recent_posts">
                                                <div className="eco_thumb">
                                                    <Link to={`/Information/${item.id}`}>
                                                        <img src={getStorageUrl(item.image_info)} alt={item.titre} />
                                                    </Link>
                                                </div>
                                                <div className="eco_post-content">
                                                    <p>
                                                        <Link to={`/Information/${item.id}`}>{item.titre}</Link>
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="clear"></div>
                        </div>
                    </div>
                    <div className="eco_template_information">
                       <p>© Copyrights {new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
