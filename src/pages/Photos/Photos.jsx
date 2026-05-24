import React, { useEffect, useState } from 'react';
import { getPhotos } from '../../api';
import { getStorageUrl } from '../../utils/formatters';
import PageBanner from '../../components/PageBanner';

const Photos = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getPhotos()
            .then(response => {
                setPhotos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching photos:", error);
                setError("حدث خطأ أثناء تحميل الصور.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }} className="eco_headings"><h3>جاري التحميل...</h3></div>;
    if (error) return <div style={{ textAlign: 'center', padding: '100px' }} className="alert alert-danger">{error}</div>;

    return (
        <div className="content">
            <PageBanner title="معرض الصور" />

            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>معرض الصور</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="row">
                        {photos.map(img => (
                            <div key={img.id} className="col-md-3 col-sm-6 mb20" style={{ marginBottom: '20px' }}>
                                <a className="example-image-link" href={getStorageUrl(img.nomImage)} data-lightbox="example-set">
                                    <img className="example-image" src={getStorageUrl(img.nomImage)} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Photos;
