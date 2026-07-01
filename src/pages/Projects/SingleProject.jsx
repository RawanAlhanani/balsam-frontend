import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../../api';
import PageBanner from '../../components/PageBanner';
import { getStorageUrl, formatDescription } from '../../utils/formatters';

const SingleProject = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProject(id)
            .then(response => {
                setProject(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching project:", error);
                setLoading(false);
            });
    }, [id]);

    const renderContent = (item) => {
        if (item.structured_description && item.structured_description.sections && item.structured_description.sections.length > 0) {
            return item.structured_description.sections.map((section, index) => {
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
                                {section.items && section.items.map((listItem, itemIndex) => (
                                    <li key={itemIndex} dangerouslySetInnerHTML={{ __html: listItem }} />
                                ))}
                            </ListTag>
                        );
                    default:
                        return null;
                }
            });
        } else if (item.description) {
            // Fallback to old description if structured_description is not available
            return <div dangerouslySetInnerHTML={{ __html: formatDescription(item.description) }} />;
        }
        return null;
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>;
    if (!project) return <div style={{ textAlign: 'center', padding: '100px' }}>المشروع غير موجود.</div>;

    return (
        <div className="content">
            <PageBanner />

            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>{project.titre}</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            {project.projet_image && (
                                <figure style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <img src={getStorageUrl(project.projet_image)} alt={project.titre} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                </figure>
                            )}
                            <div className="aboutus" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                                {renderContent(project)}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleProject;