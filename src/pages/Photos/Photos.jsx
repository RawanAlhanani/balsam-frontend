import React, { useEffect, useState } from 'react';
import { getPhotos } from '../../api';
import { getStorageUrl } from '../../utils/formatters';
import PageBanner from '../../components/PageBanner';
import OptimizedImage from '../../components/OptimizedImage';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';

const Photos = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        const fetchPhotos = async () => {
            setLoading(true);
            try {
                const response = await getPhotos(page);
                setPhotos(response.data.data);
                setLastPage(response.data.last_page);
            } catch (error) {
                console.error("Error fetching photos:", error);
                setError("حدث خطأ أثناء تحميل الصور.");
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, [page]);

    if (loading) return <Loading />;
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
                                <OptimizedImage
                                    src={getStorageUrl(img.nomImage)}
                                    alt={`صورة من معرض جمعية بلسم رقم ${img.id}`}
                                    className="example-image"
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            </div>
                        ))}
                    </div>
                    <Pagination currentPage={page} lastPage={lastPage} onPageChange={setPage} />
                </div>
            </section>
        </div>
    );
};

export default Photos;
