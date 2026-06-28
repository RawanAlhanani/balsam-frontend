import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActivity } from '../../api';
import PageBanner from '../../components/PageBanner';
import { getStorageUrl } from '../../utils/formatters';

const SingleActivity = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        setLoading(true);
        setError(null); // Clear previous errors
        window.scrollTo(0, 0);

        getActivity(id)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching activity detail:", err);
                setError("حدث خطأ أثناء تحميل تفاصيل النشاط."); // User-friendly error
                setLoading(false);
            });
    }, [id]);

    // Placeholder image URL (you can replace this with a local asset if preferred)
    const PLACEHOLDER_IMAGE = "https://via.placeholder.com/600x400?text=No+Image";

    // Consistent loading state
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>
        </div>
    );

    // Consistent error state
    if (error) return (
        <div className="alert alert-danger text-center m-5">{error}</div>
    );

    // Consistent not found state
    if (!data || !data.activity) return (
        <div className="text-center m-5 eco_headings"><h3>النشاط غير موجود.</h3></div>
    );

    const { activity, latest_activities } = data;

    return (
        <div className="content" key={id}>
            <PageBanner title={activity.titre} />

            <section className="eco_services_environment py-5"> {/* Added padding */}
                <div className="container">
                    <div className="row justify-content-center"> {/* Centered content */}
                        <div className="col-lg-8 col-md-12"> {/* Changed col-md-10 to col-md-12 for main content */}
                            <div className="eco_headings mb-5 text-center"> {/* Centered heading */}
                                <h1 className="display-4 mb-3"><b>{activity.titre}</b></h1> {/* Larger, more prominent title */}
                                {activity.typeactivite && (
                                    <h6 className="text-primary mt-3 mb-4 h4"> {/* Styled type */}
                                        {activity.typeactivite.nomActivite} {/* Corrected property name from nom_type to nomActivite */}
                                    </h6>
                                )}
                                <span><i className="icon-nature-2"></i></span>
                            </div>

                            <figure className="mb-5 text-center"> {/* Increased margin-bottom */}
                                <img
                                    src={activity.image_activite ? getStorageUrl(activity.image_activite) : PLACEHOLDER_IMAGE}
                                    alt={activity.titre}
                                    className="img-fluid rounded shadow-sm" // Responsive image, rounded corners, shadow
                                    style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }}
                                />
                            </figure>

                            <div className="aboutus text-justify"> {/* Justified text for better readability */}
                                <div className="bg-light p-4 rounded mb-4 border-right border-primary border-5"> {/* Styled info box */}
                                    <p className="mb-2"><strong><i className="fa fa-calendar text-primary ml-2"></i> التاريخ:</strong> {activity.date_activite}</p> {/* Changed mr-2 to ml-2 for RTL */}
                                    <p className="mb-0"><strong><i className="fa fa-map-marker text-primary ml-2"></i> المكان:</strong> {activity.lieu_activite || 'غير محدد'}</p> {/* Changed mr-2 to ml-2 for RTL */}
                                </div>
                                <p className="lead" dangerouslySetInnerHTML={{ __html: activity.description?.replace(/\n/g, '<br />') }} />
                            </div>

                            <div className="text-center mt-5"> {/* Centered button */}
                                <Link to={`/vouloirParticiper/${activity.id}`} className="btn btn-primary btn-lg">
                                    المشاركة في النشاط <i className="la la-arrow-left ml-2"></i> {/* Added icon, changed mr-2 to ml-2 */}
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar for Latest Activities */}
                        <div className="col-lg-4 col-md-12 mt-5 mt-lg-0 "> {/* Changed col-md-10 to col-md-12 for sidebar */}
                            <div className="mb-4">
                                <h4 className="h3 mb-3">أنشطة أخرى</h4>
                            </div>
                            <ul className="list-unstyled mr-auto"> {/* Removed default list styling */}
                                {latest_activities?.length > 0 ? (
                                    latest_activities.map(item => (
                                        <li key={item.id} className="mb-4 pb-3 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 ml-3"> {/* Changed mr-3 to ml-3 */}
                                                    <Link to={`/uneActivite/${item.id}`}>
                                                        <img
                                                            src={item.image_activite ? getStorageUrl(item.image_activite) : PLACEHOLDER_IMAGE}
                                                            alt={item.titre || "Activity Image"}
                                                            className="rounded"
                                                            style={{ width: '90px', height: '60px', objectFit: 'cover' }}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1">
                                                        <Link
                                                            to={`/uneActivite/${item.id}`}
                                                            className="text-dark font-weight-bold"
                                                        >
                                                            {item.titre}
                                                        </Link>
                                                    </h6>
                                                    <small className="text-muted">
                                                        <i className="fa fa-calendar-o ml-1"></i> {item.date_activite} {/* Changed mr-1 to ml-1 */}
                                                    </small>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-muted text-center">لا توجد أنشطة أخرى.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleActivity;