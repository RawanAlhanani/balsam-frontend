import React, { useState, useRef, useEffect } from 'react';
import { getStorageUrl } from '../utils/formatters';

const OptimizedImage = ({ 
  src, 
  alt = '', 
  className = '', 
  style = {}, 
  loading = 'lazy',
  placeholder = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef(null);

  useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const imageSrc = typeof src === 'string' ? src : getStorageUrl(src);

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style,
        backgroundColor: placeholder && !isLoaded ? '#f0f0f0' : 'transparent',
        transition: 'opacity 0.3s ease',
        opacity: isLoaded ? 1 : 0.7
      }}
    >
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: style.objectFit || 'cover',
            display: 'block'
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
