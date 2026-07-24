import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getStorageUrl } from '../../../utils/formatters';
import './HomeSlider.css';

const AUTOPLAY_DELAY = 5000;

const HomeSlider = ({ images }) => {
    const count = images?.length || 0;

    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(null);
    const reducedMotion = useRef(
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    const goTo = useCallback((index) => {
        if (!count) return;
        setCurrent(((index % count) + count) % count);
    }, [count]);

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    useEffect(() => { setCurrent(0); }, [images]);

    useEffect(() => {
        if (paused || count <= 1 || reducedMotion.current) return;
        const timer = setTimeout(next, AUTOPLAY_DELAY);
        return () => clearTimeout(timer);
    }, [current, paused, count, next]);

    useEffect(() => {
        const handleVisibility = () => setPaused(document.hidden);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    };

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 40) { delta > 0 ? prev() : next(); }
        touchStartX.current = null;
    };

    if (!count) return null;

    return (
        <div
            className="homeSlider"
            role="region"
            aria-roledescription="carousel"
            aria-label="صور مميزة من أنشطة الجمعية"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="homeSlider__track">
                {images.map((img, i) => (
                    <div
                        key={img.id}
                        className={`homeSlider__slide${i === current ? ' is-active' : ''}`}
                        aria-hidden={i !== current}
                    >
                        <img
                            src={getStorageUrl(img.nomImage)}
                            alt=""
                            loading={i === 0 ? 'eager' : 'lazy'}
                        />
                    </div>
                ))}
                <div className="homeSlider__scrim" />
            </div>

            {count > 1 && (
                <>
                    <button type="button" className="homeSlider__arrow homeSlider__arrow--prev" onClick={prev} aria-label="الصورة السابقة">
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <button type="button" className="homeSlider__arrow homeSlider__arrow--next" onClick={next} aria-label="الصورة التالية">
                        <i className="fa fa-chevron-right" aria-hidden="true"></i>
                    </button>

                    <button
                        type="button"
                        className="homeSlider__playToggle"
                        onClick={() => setPaused(p => !p)}
                        aria-label={paused ? 'تشغيل العرض التلقائي للصور' : 'إيقاف العرض التلقائي للصور'}
                    >
                        <i className={`fa ${paused ? 'fa-play' : 'fa-pause'}`} aria-hidden="true"></i>
                    </button>

                    <div className="homeSlider__dots" role="tablist" aria-label="اختيار صورة">
                        {images.map((img, i) => (
                            <button
                                key={img.id}
                                type="button"
                                role="tab"
                                aria-selected={i === current}
                                aria-label={`الصورة ${i + 1} من ${count}`}
                                className={`homeSlider__dot${i === current ? ' is-active' : ''}`}
                                onClick={() => goTo(i)}
                            >
                                {i === current && (
                                    <span
                                        className="homeSlider__dot-progress"
                                        style={{
                                            animationDuration: `${AUTOPLAY_DELAY}ms`,
                                            animationPlayState: (paused || reducedMotion.current) ? 'paused' : 'running'
                                        }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeSlider;
