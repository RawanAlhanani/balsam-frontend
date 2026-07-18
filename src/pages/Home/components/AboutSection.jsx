import React from 'react';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../../utils/formatters';

const renderContent = (page) => {
    if (page.structured_description && page.structured_description.sections && page.structured_description.sections.length > 0) {
        return page.structured_description.sections.map((section, index) => {
            switch (section.type) {
                case 'heading':
                    const HeadingTag = `h${section.level || 2}`; // Default to h2 if level is not specified
                    return <HeadingTag key={index}>{section.content}</HeadingTag>;
                case 'paragraph':
                    return <p key={index} dangerouslySetInnerHTML={{ __html: section.content }} />;
                case 'list':
                    const ListTag = section.listType === 'number' ? 'ol' : 'ul';
                    return (
                        <ListTag key={index}>
                            {section.items && section.items.map((item, itemIndex) => (
                                <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </ListTag>
                    );
                default:
                    return null;
            }
        });
    }
    return null;
};

const AboutSection = ({ aboutData }) => {
    if (!aboutData || aboutData.length === 0) return null;

    const mainAbout = aboutData[0];

    return (
        <section className="eco_services_environment">
            <div className="container">
                <div className="eco_headings">
                    <h3><b>جمعية بلسم لذوي التوحد</b></h3>
                    <h6>من نحن</h6>
                    <span><i className="icon-nature-2"></i></span>
                </div>
                <div className="eco_services">
                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="aboutus">
                                <div style={{ fontSize: '15px' }}>
                                    {aboutData.map(ab => (
                                        <div key={ab.id}>
                                            {renderContent(ab)}
                                        </div>
                                    ))}
                                </div>
                                <Link to="/about" className="aread">قراءة المزيد</Link>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 hidden-sm-down">
                            <figure>
                                <div className="thumb-widthout-layer">
                                    <img 
                                        style={{ height: '90%', width: '100%', objectFit: 'cover' }} 
                                        src={getStorageUrl(mainAbout.about_image)} 
                                        alt="" 
                                    />
                                </div>
                            </figure>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;