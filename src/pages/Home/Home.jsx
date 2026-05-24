import React, { useEffect, useState } from 'react';
import { getHomeData } from '../../api';
import HomeSlider from './components/HomeSlider';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import NewsSection from './components/NewsSection';
import VideoSection from './components/VideoSection';
import GallerySection from './components/GallerySection';
import DonationSection from './components/DonationSection';

const Home = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getHomeData();
                setData(response.data);
            } catch (err) {
                console.error("Error fetching home data:", err);
                setError("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="content" style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div id="status"></div> {/* Using theme's status/preloader style if available */}
                <div className="eco_headings"><h3>جاري التحميل...</h3></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="content" style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="content">
            <HomeSlider images={data.slider_images} />
            
            <div style={{ clear: 'both' }}></div>

            <AboutSection aboutData={data.about_us} />

            <ProjectsSection projects={data.projects} />

            <NewsSection news={data.news} />

            <VideoSection />

            <GallerySection images={data.gallery_images} />

            <DonationSection />
        </div>
    );
};

export default Home;
