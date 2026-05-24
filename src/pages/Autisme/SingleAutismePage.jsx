import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAutismePage } from '../../api';
import PageBanner from '../../components/PageBanner';
import { getStorageUrl } from '../../utils/formatters';

const SingleAutismePage = () => {
    const { id } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAutismePage(id)
            .then(response => {
                setPage(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching autisme page:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>;
    if (!page) return <div style={{ textAlign: 'center', padding: '100px' }}>الصفحة غير موجودة.</div>;

    return (
        <div className="content">
            <PageBanner title={page.titre} />

            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>{page.titre}</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <figure style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <img src={getStorageUrl(page.page_image)} alt={page.titre} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                            </figure>
                            <div className="aboutus" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                                <div dangerouslySetInnerHTML={{ __html: page.description.replace(/\n/g, '<br />') }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleAutismePage;
