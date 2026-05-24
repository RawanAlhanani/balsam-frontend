import React, { useEffect, useRef } from 'react';
import { getStorageUrl } from '../../../utils/formatters';

const HomeSlider = ({ images }) => {
    const sliderRef = useRef(null);

    useEffect(() => {
        let slider = null;
        
        // Small timeout to ensure DOM is ready and jQuery is available
        const timer = setTimeout(() => {
            if (window.jQuery && window.jQuery.fn.sliderPro && images?.length > 0) {
                slider = window.jQuery('#example1').sliderPro({
                    width: '100%',
                    height: 500,
                    fade: true,
                    arrows: true,
                    buttons: false,
                    fullScreen: false,
                    shuffle: false,
                    smallSize: 500,
                    mediumSize: 1000,
                    largeSize: 3000,
                    thumbnailArrows: true,
                    autoplay: true,
                    autoplayDelay: 5000
                });
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            // Optional: Destroy slider on unmount if plugin supports it
            // if (slider && slider.destroy) slider.destroy();
        };
    }, [images]);

    if (!images || images.length === 0) return null;

    return (
        <>
            <div style={{ direction: 'ltr' }} id="example1" className="slider-pro" ref={sliderRef}>
                <div className="sp-slides">
                    {images.map(img => (
                        <div className="sp-slide" key={img.id}>
                            <img 
                                className="sp-image" 
                                src="/content/view/themes/balsam/assests/sliderpro/css/images/blank.gif"
                                data-src={getStorageUrl(img.nomImage)}
                                data-retina={getStorageUrl(img.nomImage)} 
                                alt="" 
                            />
                        </div>
                    ))}
                </div>

                {/* Hardcoded Thumbnails from original design */}
                <div className="sp-thumbnails">
                    <div className="sp-thumbnail">
                        <div className="sp-thumbnail-title">
                            <img src="/content/upload/new-slider-25-6-2018/01.png" alt="thumb1" />
                        </div>
                    </div>
                    <div className="sp-thumbnail">
                        <div className="sp-thumbnail-title">
                            <img src="/content/upload/new-slider-25-6-2018/02.png" alt="thumb2" />
                        </div>
                    </div>
                    <div className="sp-thumbnail">
                        <div className="sp-thumbnail-title">
                            <img src="/content/upload/new-slider-25-6-2018/03.png" alt="thumb3" />
                        </div>
                    </div>
                    <div className="sp-thumbnail">
                        <div className="sp-thumbnail-title">
                            <img src="/content/upload/new-slider-25-6-2018/04.png" alt="thumb4" />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .sp-thumbnail {
                    width: 100%;
                }
                .sp-thumbnail-title img {
                    width: 80px;
                    display: table;
                    margin: auto;
                }
                .sp-thumbnail-title {
                    padding: 10px;
                }
                .sp-bottom-thumbnails.sp-has-pointer .sp-selected-thumbnail:before {
                    display: none;
                }
                .sp-bottom-thumbnails.sp-has-pointer .sp-selected-thumbnail:after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                    left: 50%;
                    top: 0;
                    margin-left: -20px;
                    border-bottom: 15px solid #fff;
                    border-left: 20px solid transparent;
                    border-right: 20px solid transparent;
                }
                .slider-pro {
                    margin-bottom: 30px;
                }
            `}</style>
        </>
    );
};

export default HomeSlider;
