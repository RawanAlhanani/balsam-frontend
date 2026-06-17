import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { getStorageUrl } from '../../utils/formatters';

const AdminTuteurs = () => {
    const [tuteurs, setTuteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchTuteurs = () => {
        api.get('/admin/tuteurs')
            .then(res => {
                setTuteurs(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        const isAdmin = localStorage.getItem('is_admin');
        if (!isAdmin) {
            navigate('/connecte');
            return;
        }
        fetchTuteurs();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المسجل وجميع بياناته؟')) {
            try {
                await api.delete(`/admin/tuteurs/${id}`);
                fetchTuteurs();
            } catch (err) {
                alert('خطأ في الحذف');
            }
        }
    };

    if (loading) return <div className="app-content content"><div className="content-wrapper"><div className="content-body" style={{ textAlign: 'center', padding: '100px' }}><h3>جاري التحميل...</h3></div></div></div>;

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-body">
                    <section id="file-export">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">أولياء الأمور و أبناؤهم</h4>
                                        <div className="heading-elements">
                                            <ul className="list-inline mb-0">
                                                <li><a data-action="expand"><i className="ft-maximize"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="card-content collapse show table-responsive">
                                        <div className="card-body card-dashboard">
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>الاسم العائلي</th>
                                                        <th>الاسم الشخصي</th>
                                                        <th>الهاتف</th>
                                                        <th>الواتساب</th>
                                                        <th>تكوين</th>
                                                        <th>رقم البطاقة الوطنية</th>
                                                        <th>العنوان</th>
                                                        <th>المنطقة</th>
                                                        <th>نسب الطفل</th>
                                                        <th>اسم الطفل</th>
                                                        <th>تاريخ الازدياد</th>
                                                        <th>جنس الطفل</th>
                                                        <th>حالة التوحد</th>
                                                        <th>كلام الطفل</th>
                                                        <th>التخصصات المتبعة</th>
                                                        <th>المرافق</th>
                                                        <th>متمدرس</th>
                                                        <th>الصورة</th>
                                                        <th>تغيير</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tuteurs.map(tuteur => (
                                                        tuteur.enfants?.map(enfant => (
                                                            <tr key={enfant.id}>
                                                                <td>{tuteur.nom_tuteur}</td>
                                                                <td>{tuteur.prenom_tuteur}</td>
                                                                <td>{tuteur.telephon}</td>
                                                                <td>{tuteur.whatsapp}</td>
                                                                <td>{tuteur.formation == 1 ? 'نعم' : 'لا'}</td>
                                                                <td>{tuteur.CIN}</td>
                                                                <td>{tuteur.adresse}</td>
                                                                <td>{tuteur.region?.nom_region}</td>
                                                                <td>{enfant.nom_enfant}</td>
                                                                <td>{enfant.prenom_enfant}</td>
                                                                <td>{enfant.date_naissance}</td>
                                                                <td>{enfant.sexeEnfant == 2 ? 'ذكر' : 'أنثى'}</td>
                                                                <td>
                                                                    {enfant.statut == 1 ? 'توحد خفيف' : enfant.statut == 2 ? 'توحد متوسط' : 'توحد شديد'}
                                                                </td>
                                                                <td>
                                                                    {enfant.parole == 1 ? 'غير متكلم' : enfant.parole == 2 ? 'يصدر بعض الأصوات' : enfant.parole == 3 ? 'يتكلم بعض الكلمات' : 'يتكلم'}
                                                                </td>
                                                                <td>
                                                                    {/* Doctors info would need another fetch or with() in backend */}
                                                                    {/* For now we leave it placeholder or add to API */}
                                                                </td>
                                                                <td>{enfant.avs == 1 ? 'نعم' : 'لا'}</td>
                                                                <td>{enfant.etude == 1 ? 'نعم' : 'لا'}</td>
                                                                <td>
                                                                    <img width="90" src={getStorageUrl(enfant.photo || 'Profile.png')} alt="" />
                                                                </td>
                                                                <td className="Last">
                                                                    <button type="button" className="btn btn-round btn-primary btn-sm">تفاصيل</button>
                                                                    <Link to={`/admin/editTuteur/${enfant.id}`} className="btn btn-round btn-warning btn-sm">تعديل</Link>
                                                                    <button type="button" className="btn btn-round btn-danger btn-sm" onClick={() => handleDelete(tuteur.id)}>حذف</button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminTuteurs;