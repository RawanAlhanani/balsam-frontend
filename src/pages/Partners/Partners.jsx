import React, { useEffect, useState } from 'react';
import { getPartenaires } from '../../api';
import PageBanner from '../../components/PageBanner';
import Loading from '../../components/Loading';
import OptimizedImage from '../../components/OptimizedImage';
import { getStorageUrl } from '../../utils/formatters';

const Partners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPartenaires()
            .then(response => {
                setPartners(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching partners:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="content">
            <PageBanner title="شركاؤنا" />

            <section>
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>شركاؤنا</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="row">
                        {partners.map(p => (
                            <div key={p.id} className="col-md-3 col-sm-6" style={{ marginBottom: '30px', textAlign: 'center' }}>
                                <div className="partner-item" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ width: '100%', height: '120px', flexShrink: 0 }}>
                                        <OptimizedImage src={getStorageUrl(p.imagePartenaire)} alt={p.nomPartenaire} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <h5 style={{ marginTop: '15px', fontSize: '15px' }}>{p.nomPartenaire}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Partners;
