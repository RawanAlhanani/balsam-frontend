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

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>;
    if (!project) return <div style={{ textAlign: 'center', padding: '100px' }}>المشروع غير موجود.</div>;

    return (
        <div className="content">
            <PageBanner title={project.titre} />

            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>{project.titre}</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <figure style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <img src={getStorageUrl(project.projet_image)} alt={project.titre} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                            </figure>
                            <div className="aboutus" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                                <div dangerouslySetInnerHTML={{ __html: formatDescription(project.description) }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleProject;
