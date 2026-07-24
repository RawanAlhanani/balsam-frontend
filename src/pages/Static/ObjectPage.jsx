import React, { useEffect, useState } from 'react';
import { getNews } from '../../api';
import { getStorageUrl } from '../../utils/formatters';
import PageBanner from '../../components/PageBanner';
import Loading from '../../components/Loading';
import { Link } from 'react-router-dom';

const ObjectPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNews().then(res => {
            setNews(res.data.data.slice(0, 4));
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching news:", err);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="content">
            <PageBanner title="أهداف الجمعية" />

            <section>
                <div className="eco_blog_detail">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-9 col-sm-12 col-xs-12 responsive-991-width">
                                <div className="eco_blog_detail_post">
                                    <figure>
                                        <img className="img-responsive cimage" src="/content/upload/who-are-we/adobestock_92183997.jpg" alt="صورة توضيحية لأهداف الجمعية" />
                                    </figure>
                                    <div className="eco_blog_detail_content">
                                        <p><strong>تهدف الجمعية حسب قانونها الأساسي في المادة الخامسة إلى تقديم خدمات للأشخاص التوحديين وذويهم، وذلك ب:</strong></p>
                                        <p>1- استفادة الأطفال ذوي التوحد من تمدرس يمكنهم من الاندماج في المؤسسات التعليمية العمومية والخصوصية.</p>
                                        <p>2- تقديم جميع أنواع الخدمات الطبية والشبه الطبية للأطفال والأشخاص التوحديين في حدود الإمكانيات المتوفرة لدى الجمعية.</p>
                                        <p>3- تقديم خدمات تربوية، صحية، اجتماعية، رياضية، وتنظيم مخيمات تستجيب لمختلف حاجيات الأشخاص ذوي التوحد.</p>
                                        <p>4- تمكين أسر الأشخاص ذوي التوحد من تكوينات تستجيب لتطلعاتهم من أجل تكفل أفضل بهم.</p>
                                        <p>5- عقد شراكات مع المؤسسات الرسمية والخاصة والتعاون معها فيما له علاقة بمجال إفادة الأشخاص ذوي التوحد.</p>
                                        <div className="eco_share-tag">
                                            <span> شارك المحتوى</span>
                                            <ul className="social-icons">
                                                <li><a href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 col-sm-12 col-xs-12 responsive-991-width">
                                <div className="margin-buttom_50 responsive-column responsive-devider-50">
                                    <div className="widget_post_content">
                                        <h5 className="eco_sm_titles">أحدث الأخبار</h5>
                                        <ul className="eco_widget_list_style">
                                            {news.map(item => (
                                                <li key={item.id}><Link to={`/Information/${item.id}`}>{item.titre}</Link></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ObjectPage;
