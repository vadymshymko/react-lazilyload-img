import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

let observer = null;
let isActive = false;

const ReactLazilyLoadImg = memo(({
  src,
  srcSet,
  className,
  mainImgClassName,
  mainImgOnLoad,
  placeholderSrc,
  placeholderSrcSet,
  placeholderClassName,
  placeholderOnLoad,
  loadingClassName,
  onLoad,
  ...props
}) => {
  const imgRef = useRef();

  const handleImgLoad = (event) => {
    const isMainImg = (src && event.target.src === src)
      || (srcSet && event.target.srcset === srcSet);

    if (isMainImg) {
      imgRef.current.className = `${className} ${mainImgClassName}`;

      if (mainImgOnLoad) {
        mainImgOnLoad(event);
      }
    } else if (placeholderOnLoad) {
      placeholderOnLoad(event);
    }

    if (onLoad) {
      onLoad(event);
    }
  };

  const loadMainImg = () => {
    if (
      imgRef.current.src !== src
      || imgRef.current.srcset !== srcSet
    ) {
      imgRef.current.className = `${className} ${mainImgClassName} ${loadingClassName}`;
      imgRef.current.src = src;
      imgRef.current.srcset = srcSet;
    }
  };

  const lazyLoad = (entries) => {
    if (observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMainImg();
          observer.unobserve(imgRef.current);
        }
      });
    } else if (!isActive) {
      isActive = true;

      setTimeout(() => {
        if (
          imgRef.current.getBoundingClientRect().top
          <= window.innerHeight
          && imgRef.current.getBoundingClientRect().bottom >= 0
          && getComputedStyle(imgRef.current).display !== 'none'
        ) {
          document.removeEventListener('scroll', lazyLoad);
          window.removeEventListener('resize', lazyLoad);
          window.removeEventListener('orientationchange', lazyLoad);

          loadMainImg();
        }

        isActive = false;
      }, 200);
    }
  };

  const reset = () => {
    isActive = false;

    if (observer) {
      observer.unobserve(imgRef.current);
    }

    document.removeEventListener('scroll', lazyLoad);
    window.removeEventListener('resize', lazyLoad);
    window.removeEventListener('orientationchange', lazyLoad);
  };

  const init = () => {
    reset();

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(lazyLoad);
      observer.observe(imgRef.current);
    } else if (
      imgRef.current.getBoundingClientRect().top <= window.innerHeight
      && imgRef.current.getBoundingClientRect().bottom >= 0
      && getComputedStyle(imgRef.current).display !== 'none'
    ) {
      loadMainImg();
    } else {
      document.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      window.addEventListener('orientationchange', lazyLoad);
    }
  };

  useEffect(() => {
    init();
    return reset;
  }, []);

  useEffect(init, [src, srcSet]);

  return (
    /* eslint-disable-next-line jsx-a11y/alt-text */
    <img
      {...props}
      src={placeholderSrc}
      srcSet={placeholderSrcSet}
      className={`${className} ${placeholderClassName}`}
      onLoad={handleImgLoad}
      ref={imgRef}
    />
  );
});

ReactLazilyLoadImg.propTypes = {
  className: PropTypes.string,
  loadingClassName: PropTypes.string,
  mainImgClassName: PropTypes.string,
  mainImgOnLoad: PropTypes.func,
  onLoad: PropTypes.func,
  placeholderClassName: PropTypes.string,
  placeholderOnLoad: PropTypes.func,
  placeholderSrc: PropTypes.string,
  placeholderSrcSet: PropTypes.string,
  src: PropTypes.string,
  srcSet: PropTypes.string,
};

ReactLazilyLoadImg.defaultProps = {
  className: '',
  loadingClassName: '',
  mainImgClassName: '',
  mainImgOnLoad: null,
  onLoad: null,
  placeholderClassName: '',
  placeholderOnLoad: null,
  placeholderSrc: '',
  placeholderSrcSet: '',
  src: '',
  srcSet: '',
};

export default ReactLazilyLoadImg;
