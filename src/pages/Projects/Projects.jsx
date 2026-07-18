import { useEffect, useState } from 'react';
import { getProjects } from '../../api';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../utils/formatters';
import PageBanner from '../../components/PageBanner';

// Helper function to extract paragraph content from structured_description
const getParagraphContent = (structuredDescription) => {
    if (!structuredDescription || !structuredDescription.sections) {
        return '';
    }
    const paragraphs = structuredDescription.sections
        .filter(section => section.type === 'paragraph')
        .map(section => section.content)
        .join(' '); // Join paragraphs with a space
    return paragraphs;
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getProjects()
            .then(response => {
                setProjects(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching projects:", error);
                setError("حدث خطأ أثناء تحميل المشاريع.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }} className="eco_headings"><h3>جاري التحميل...</h3></div>;
    if (error) return <div style={{ textAlign: 'center', padding: '100px' }} className="alert alert-danger">{error}</div>;

    return (
        <div className="content">
            <PageBanner />

            <section>
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>مشاريع جمعية بلسم</b></h3>
                        <h6>نبذل قصارى جهدنا لخدمتكم</h6>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="eco_featured_causes">
                        <div className="row">
                            {projects.map((v) => (
                                <div key={v.id} className="col-md-4 col-sm-6 responsive-devider-50">
                                    <div className="eco_flip-container">
                                        <div className="flipper feature-blog">
                                            <div className="front">
                                                <figure>
                                                    <div className="eco-thumb">
                                                        <img src={getStorageUrl(v.projet_image)} alt="" />
                                                    </div>
                                                </figure>
                                                <div className="feature_blog_caption">
                                                    <h5><Link to={`/projet/${v.id}`}>{v.titre}</Link></h5>
                                                    <p>
                                                        {v.structured_description
                                                            ? getParagraphContent(v.structured_description).substring(0, 150)
                                                            : ''}
                                                        ...
                                                    </p>
                                                    <Link to={`/projet/${v.id}`} className="ProjectsRead">قراءة المزيد</Link>
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
        </div>
    );
};

export default Projects;