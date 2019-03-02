import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LazilyLoadImg extends Component {
  static propTypes = {
    placeholderSrc: PropTypes.string,
    placeholderSrcSet: PropTypes.string,
    placeholderClassName: PropTypes.string,
    onPlaceholderLoad: PropTypes.func,
    onPlaceholderError: PropTypes.func,
    src: PropTypes.string,
    srcSet: PropTypes.string,
    className: PropTypes.string,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    loadAfterPlaceholderEnd: PropTypes.bool,
    useObserverFallback: PropTypes.bool,
  }

  static defaultProps = {
    placeholderSrc: null,
    placeholderSrcSet: null,
    placeholderClassName: '',
    onPlaceholderLoad: () => {},
    onPlaceholderError: () => {},
    src: null,
    srcSet: null,
    className: '',
    onLoad: () => {},
    onError: () => {},
    loadAfterPlaceholderEnd: false,
    useObserverFallback: true,
  }

  constructor(props) {
    super(props);

    this.img = null;
    this.observer = null;
    this.isActive = false;

    this.isMainImgLoading = false;
  }

  componentDidMount() {
    if (this.img) {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(this.lazyLoad);
        this.observer.observe(this.img);
      } else if (
        (
          this.img.getBoundingClientRect().top <= window.innerHeight
          && this.img.getBoundingClientRect().bottom >= 0
        )
        && getComputedStyle(this.img).display !== 'none'
      ) {
        this.loadMainImg();
      } else {
        document.addEventListener('scroll', this.lazyLoad);
        window.addEventListener('resize', this.lazyLoad);
        window.addEventListener('orientationchange', this.lazyLoad);
      }
    }
  }

  componentWillUnmount() {
    if ('IntersectionObserver' in window && this.observer && this.img) {
      this.observer.unobserve(this.img);
    }

    document.removeEventListener('scroll', this.lazyLoad);
    window.removeEventListener('resize', this.lazyLoad);
    window.removeEventListener('orientationchange', this.lazyLoad);
  }

  lazyLoad = (entries) => {
    if (this.observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadMainImg();
          this.observer.unobserve(this.img);
        }
      });
    } else if (this.isActive === false) {
      this.isActive = true;

      setTimeout(() => {
        if (
          (
            this.img.getBoundingClientRect().top <= window.innerHeight
            && this.img.getBoundingClientRect().bottom >= 0
          )
          && getComputedStyle(this.img).display !== 'none'
        ) {
          document.removeEventListener('scroll', this.lazyLoad);
          window.removeEventListener('resize', this.lazyLoad);
          window.removeEventListener('orientationchange', this.lazyLoad);

          this.loadMainImg();
        }

        this.isActive = false;
      }, 200);
    }
  }

  handleImgRef = (node) => {
    this.img = node;
  }

  handleLoad = (event) => {
    const {
      onPlaceholderLoad,
      onLoad,
      loadAfterPlaceholderEnd,
      useObserverFallback,
    } = this.props;

    if (this.isMainImgLoading) {
      onLoad(event);
    } else {
      onPlaceholderLoad(event);

      if (
        loadAfterPlaceholderEnd
        || (
          !('IntersectionObserver' in window)
          && !useObserverFallback
        )
      ) {
        this.loadMainImg();
      }
    }
  }

  handleError = (event) => {
    const {
      onPlaceholderError,
      onError,
      loadAfterPlaceholderEnd,
    } = this.props;


    if (this.isMainImgLoading) {
      onError(event);
    } else {
      onPlaceholderError(event);

      if (loadAfterPlaceholderEnd) {
        this.loadMainImg();
      }
    }
  }

  loadMainImg = () => {
    const {
      src,
      srcSet,
      className,
      onLoad,
      onError,
    } = this.props;

    if (
      this.img
      && (
        src || srcSet
      )
    ) {
      this.isMainImgLoading = true;

      this.img.onLoad = onLoad;
      this.img.onError = onError;
      this.img.src = src;
      this.img.srcSet = srcSet;
      this.img.className = className;
    }
  }

  render() {
    const {
      placeholderSrc,
      placeholderSrcSet,
      placeholderClassName,
      onPlaceholderLoad,
      onPlaceholderError,
      src,
      srcSet,
      className,
      onLoad,
      onError,
      loadAfterPlaceholderEnd,
      useObserverFallback,
      ...props
    } = this.props;

    if (
      !placeholderSrc
      && !placeholderSrcSet
      && !src
      && !srcSet
    ) {
      return null;
    }

    /* eslint-disable jsx-a11y/alt-text */
    return (
      <img
        {...props}
        src={placeholderSrc}
        srcSet={placeholderSrcSet}
        className={placeholderClassName}
        onLoad={this.handleLoad}
        onError={this.handleError}
        ref={this.handleImgRef}
      />
    );
    /* eslint-enable jsx-a11y/alt-text */
  }
}

export default LazilyLoadImg;
