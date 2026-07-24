import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAutismePage } from '../../api';
import PageBanner from '../../components/PageBanner';
import Loading from '../../components/Loading';
import { getStorageUrl } from '../../utils/formatters';

const SingleAutismePage = () => {
    const { id } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        getAutismePage(id)
            .then(response => {
                setPage(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching autisme page:", error);
                setError("حدث خطأ أثناء تحميل الصفحة."); // Set user-friendly error message
                setLoading(false);
            });
    }, [id]);

    const renderContent = () => {
        if (page.structured_description && page.structured_description.sections && page.structured_description.sections.length > 0) {
            return page.structured_description.sections.map((section, index) => {
                switch (section.type) {
                    case 'heading':
                        const HeadingTag = `h${section.level || 2}`; // Default to h2 if level is not specified
                        return <HeadingTag key={index} className={`mt-4 mb-3 h${section.level || 2}`}>{section.content}</HeadingTag>; // Added Bootstrap heading classes
                    case 'paragraph':
                        return <p key={index} className="lead mb-3" dangerouslySetInnerHTML={{ __html: section.content }} />; // Added Bootstrap paragraph classes
                    case 'list':
                        const ListTag = section.listType === 'number' ? 'ol' : 'ul';
                        return (
                            <ListTag key={index} className="mb-3 pl-4"> {/* Added Bootstrap list classes */}
                                {section.items && section.items.map((item, itemIndex) => (
                                    <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                                ))}
                            </ListTag>
                        );
                    default:
                        return null;
                }
            });
        } else if (page.description) {
            // Fallback to old description if structured_description is not available
            return <p className="lead mb-3" dangerouslySetInnerHTML={{ __html: page.description.replace(/\n/g, '<br />') }} />; // Added Bootstrap paragraph classes
        }
        return null;
    };

    if (loading) return <Loading />;
    if (error) return <div className="alert alert-danger text-center m-5">{error}</div>;
    if (!page && !loading) return <div className="text-center m-5 eco_headings"><h3>الصفحة غير موجودة.</h3></div>;


    return (
        <div className="content">
            <PageBanner title={page.titre} />

            <section className="eco_services_environment py-5"> {/* Added padding */}
                <div className="container">
                    <div className="row justify-content-center"> {/* Centered content */}
                        <div className="col-lg-8 col-md-10"> {/* Content column */}
                            <div className="eco_headings mb-5 text-center"> {/* Centered heading */}
                                <h1 className="display-4 mb-3"><b>{page.titre}</b></h1> {/* Larger, more prominent title */}
                                <span><i className="icon-nature-2"></i></span>
                            </div>

                            {page.page_image && (
                                <figure className="mb-5 text-center"> {/* Increased margin-bottom */}
                                    <img 
                                        src={getStorageUrl(page.page_image)} 
                                        alt={page.titre} 
                                        className="img-fluid rounded shadow-sm" // Responsive image, rounded corners, shadow
                                        style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }} 
                                    />
                                </figure>
                            )}

                            <div className="aboutus text-justify"> {/* Justified text for better readability */}
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleAutismePage;