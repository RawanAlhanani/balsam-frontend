import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import PageBanner from '../../components/PageBanner';
import Loading from '../../components/Loading';

const Participation = () => {
    const { activite_id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    // Participation generates a PDF request quoting the participant's child,
    // so only beneficiary accounts (the only ones with a registered Enfant)
    // are eligible — volunteers/admin_request accounts have none and would
    // otherwise hit a server error when the PDF template renders.
    const isEligible = user?.account_type === 'beneficiary';

    useEffect(() => {
        if (!user) {
            navigate('/se_connecter');
            return;
        }
        if (!isEligible) {
            setLoading(false);
            return;
        }

        api.get(`/activities/${activite_id}`)
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [activite_id, navigate]);

    const handleConfirm = () => {
        window.open(`${import.meta.env.VITE_API_BASE_URL}/generer/${activite_id}/${user.id}`, '_blank');
    };

    if (loading) return <Loading />;

    if (!isEligible) {
        return (
            <div className="content">
                <PageBanner title="تأكيد المشاركة" />
                <section className="eco_services_environment">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 offset-md-3" style={{ textAlign: 'center' }}>
                                <div className="alert alert-warning" style={{ padding: '30px' }}>
                                    خدمة المشاركة في الأنشطة متاحة فقط لحسابات الأسر المستفيدة المسجل لديها طفل. لا يمكن لحسابك الحالي الاستفادة من هذه الخدمة.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    if (!data) return <div style={{ textAlign: 'center', padding: '100px' }}>النشاط غير موجود.</div>;

    const { activity } = data;

    return (
        <div className="content">
            <PageBanner title="تأكيد المشاركة" />

            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>تأكيد المشاركة</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    <div className="row">
                        <div className="col-md-6 offset-md-3" style={{ textAlign: 'center' }}>
                            <div className="aboutus" style={{ padding: '30px', border: '1px solid #eee', borderRadius: '8px' }}>
                                <h4>هل ترغب في المشاركة في النشاط: <strong>{activity.titre}</strong>؟</h4>
                                <p style={{ marginTop: '20px' }}>سيتم تحميل طلب المشاركة بصيغة PDF.</p>
                                <div style={{ marginTop: '30px' }}>
                                    <button onClick={handleConfirm} className="aread" style={{ border: 'none', cursor: 'pointer' }}>تأكيد وتحميل الطلب</button>
                                    <button onClick={() => navigate(-1)} className="aread" style={{ border: 'none', cursor: 'pointer', background: '#999', marginRight: '10px' }}>إلغاء</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Participation;
