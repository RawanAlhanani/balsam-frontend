import React from 'react';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../../utils/formatters';

const GallerySection = ({ images }) => {
    if (!images || images.length === 0) return null;

    return (
        <section className="eco_services_environment">
            <div className="container">
                <div className="eco_headings">
                    <h3><b>معرض الصور</b></h3>
                    <h6> بعض صورنا</h6>
                    <span><i className="icon-nature-2"></i></span>
                </div>
                <div className="eco_featured_causes">
                    <div className="row">
                        {images.map(img => (
                            <div key={img.id} className="col-md-3 col-sm-6 responsive-devider-50 mb20">
                                <a 
                                    className="example-image-link" 
                                    href={getStorageUrl(img.nomImage)} 
                                    data-lightbox="example-set"
                                >
                                    <img 
                                        className="example-image" 
                                        src={getStorageUrl(img.nomImage)} 
                                        alt="" 
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                </a>
                            </div>
                        ))}
                        <div style={{ textAlign: 'center', margin: 'auto' }}>
                            <Link to="/nosPhotos" className="aread">المزيد من الصور</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
