import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

class ReactLazilyLoadImg extends PureComponent {
  static propTypes = {
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

  static defaultProps = {
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

  constructor(props) {
    super(props);

    this.imgRef = createRef();
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    const { src: prevSrc, srcSet: prevSrcSet } = this.props;
    const { src, srcSet } = this.props;

    if (src !== prevSrc || srcSet !== prevSrcSet) {
      this.init();
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  reset = () => {
    this.isActive = false;

    if (this.observer) {
      this.observer.unobserve(this.imgRef.current);
    }

    document.removeEventListener('scroll', this.lazyLoad);
    window.removeEventListener('resize', this.lazyLoad);
    window.removeEventListener('orientationchange', this.lazyLoad);
  };

  handleImgLoad = (event) => {
    const {
      src,
      srcSet,
      className,
      onLoad,
      mainImgClassName,
      mainImgOnLoad,
      placeholderOnLoad,
    } = this.props;

    const isMainImg = (src && event.target.src === src)
      || (srcSet && event.target.srcset === srcSet);

    if (isMainImg && mainImgOnLoad) {
      this.imgRef.current.className = `${className} ${mainImgClassName}`;

      mainImgOnLoad(event);
    } else if (placeholderOnLoad) {
      placeholderOnLoad(event);
    }

    if (onLoad) {
      onLoad(event);
    }
  };

  loadMainImg = () => {
    const {
      src,
      srcSet,
      className,
      mainImgClassName,
      loadingClassName,
    } = this.props;

    if (
      this.imgRef.current.src !== src
      || this.imgRef.current.srcset !== srcSet
    ) {
      this.imgRef.current.className = `${className} ${mainImgClassName} ${loadingClassName}`;
      this.imgRef.current.src = src;
      this.imgRef.current.srcset = srcSet;
    }
  };

  lazyLoad = (entries) => {
    if (this.observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadMainImg();
          this.observer.unobserve(this.imgRef.current);
        }
      });
    } else if (!this.isActive) {
      this.isActive = true;

      setTimeout(() => {
        if (
          this.imgRef.current.getBoundingClientRect().top
          <= window.innerHeight
          && this.imgRef.current.getBoundingClientRect().bottom >= 0
          && getComputedStyle(this.imgRef.current).display !== 'none'
        ) {
          document.removeEventListener('scroll', this.lazyLoad);
          window.removeEventListener('resize', this.lazyLoad);
          window.removeEventListener('orientationchange', this.lazyLoad);

          this.loadMainImg();
        }

        this.isActive = false;
      }, 200);
    }
  };

  init = () => {
    this.reset();

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(this.lazyLoad);
      this.observer.observe(this.imgRef.current);
    } else if (
      this.imgRef.current.getBoundingClientRect().top <= window.innerHeight
      && this.imgRef.current.getBoundingClientRect().bottom >= 0
      && getComputedStyle(this.imgRef.current).display !== 'none'
    ) {
      this.loadMainImg();
    } else {
      document.addEventListener('scroll', this.lazyLoad);
      window.addEventListener('resize', this.lazyLoad);
      window.addEventListener('orientationchange', this.lazyLoad);
    }
  };

  render() {
    const {
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
      ...props
    } = this.props;

    return (
      /* eslint-disable-next-line jsx-a11y/alt-text */
      <img
        {...props}
        src={placeholderSrc}
        srcSet={placeholderSrcSet}
        className={`${className} ${placeholderClassName}`}
        onLoad={this.handleImgLoad}
        ref={this.imgRef}
      />
    );
  }
}

export default ReactLazilyLoadImg;
