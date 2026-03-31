let currentInterval;
let timeoutId;

document.addEventListener('DOMContentLoaded', () => {
  const noJsElements = document.querySelectorAll('.no-js-menu');
  noJsElements.forEach(el => el.remove());
});
class GSAPInitializer {
  static initialize() {
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, SplitText);
    } else {
      console.warn('GSAP is not defined');
    }
  }
}

GSAPInitializer.initialize();



var DOMAnimations = {
  slideUp: function (element, duration = 500) {
    return new Promise(function (resolve, reject) {
      element.style.height = element.offsetHeight + 'px';
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = duration + 'ms';
      element.offsetHeight;
      element.style.overflow = 'hidden';
      element.style.height = 0;
      element.style.paddingTop = 0;
      element.style.paddingBottom = 0;
      element.style.marginTop = 0;
      element.style.marginBottom = 0;
      window.setTimeout(function () {
        element.style.display = 'none';
        element.style.removeProperty('height');
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition-duration');
        element.style.removeProperty('transition-property');
        resolve(false);
      }, duration);
    });
  },

  slideDown: function (element, duration = 500) {
    return new Promise(function (resolve, reject) {
      element.style.removeProperty('display');
      let display = window.getComputedStyle(element).display;

      if (display === 'none') display = 'block';

      element.style.display = display;
      let height = element.offsetHeight;
      element.style.overflow = 'hidden';
      element.style.height = 0;
      element.style.paddingTop = 0;
      element.style.paddingBottom = 0;
      element.style.marginTop = 0;
      element.style.marginBottom = 0;
      element.offsetHeight;
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = duration + 'ms';
      element.style.height = height + 'px';
      element.style.removeProperty('padding-top');
      element.style.removeProperty('padding-bottom');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');
      window.setTimeout(function () {
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition-duration');
        element.style.removeProperty('transition-property');
      }, duration);
    });
  },

  slideToggle: function (element, duration = 500) {
    if (window.getComputedStyle(element).display === 'none') {
      return this.slideDown(element, duration);
    } else {
      return this.slideUp(element, duration);
    }
  },

  classToggle: function (element, className) {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  },
};

if (!Element.prototype.fadeIn) {
  Element.prototype.fadeIn = function () {
    let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
      func =
        typeof arguments[0] === 'function' ? arguments[0] : typeof arguments[1] === 'function' ? arguments[1] : null;

    this.style.opacity = 0;
    this.style.filter = 'alpha(opacity=0)';
    this.style.display = 'inline-block';
    this.style.visibility = 'visible';

    let $this = this,
      opacity = 0,
      timer = setInterval(function () {
        opacity += 50 / ms;
        if (opacity >= 1) {
          clearInterval(timer);
          opacity = 1;

          if (func) func('done!');
        }
        $this.style.opacity = opacity;
        $this.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
      }, 50);
  };
}

if (!Element.prototype.fadeOut) {
  Element.prototype.fadeOut = function () {
    let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
      func =
        typeof arguments[0] === 'function' ? arguments[0] : typeof arguments[1] === 'function' ? arguments[1] : null;

    let $this = this,
      opacity = 1,
      timer = setInterval(function () {
        opacity -= 50 / ms;
        if (opacity <= 0) {
          clearInterval(timer);
          opacity = 0;
          $this.style.display = 'none';
          $this.style.visibility = 'hidden';

          if (func) func('done!');
        }
        $this.style.opacity = opacity;
        $this.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
      }, 50);
  };
}

const swiperInstances = {
  mainmedia: null,
  thumbs: null,
};

class SwiperContent extends HTMLElement {
  constructor() {
    super();
    this._initial_run();
    if (this.dataset.resize == 'true') {
      const resizeObserver = new ResizeObserver(() => this._initial_run());
      resizeObserver.observe(this.querySelector('[data-swiper]'));
    }
  }

  _initial_run() {
    setTimeout(() => {
      this.swiper_selectorid = this.dataset.id;
      this.swiper_settings = this.querySelector('[data-swiper]').getAttribute('data-swiper');
      this.swiper_selector = this.querySelector('[data-swiper]');
      this.closestWrapper = this.closest('[data-scrollable-wrapper]');
      this.swiper_selectorid = this.dataset.id;
      this._initSwiper();
    }, 10);
  }

  _initSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
    this.swiper_settings = JSON.parse(this.swiper_settings);
    if (this.swiper_settings) {
      this.swiper = new Swiper(this.swiper_selector, this.swiper_settings);
    }
    const productMedia = this.swiper?.el?.dataset?.productMedia;
    if (productMedia) {
      if (productMedia === `main-media-${this.swiper_selectorid}`) {
        swiperInstances.mainmedia = this.swiper;
      } else if (productMedia === `main-thumb-${this.swiper_selectorid}`) {
        swiperInstances.thumbs = this.swiper;
      }

      // Check if both Swiper instances are initialized
      if (swiperInstances.mainmedia && swiperInstances.thumbs) {
        swiperInstances.mainmedia.controller.control = swiperInstances.thumbs;
        swiperInstances.thumbs.controller.control = swiperInstances.mainmedia;
      }
    }
    this._customEvents(this);
    this._gsapAnimation(this);
  }

  increaseAutoplaySpeed(newDelay) {
    if (this.swiper && this.swiper.autoplay) {
      this.swiper.params.speed = newDelay; // Set the new delay
      this.swiper.autoplay.stop(); // Stop autoplay to apply the new delay
      this.swiper.autoplay.start(); // Restart autoplay
    }
  }

  _selectSlide(index) {
    if (this.swiper) {
      this.swiper.slideToLoop(index);
    }
  }

  _stopAutoplay() {
    this.swiper.autoplay.stop();
  }

  _startAutoplay() {
    this.swiper.autoplay.start();
  }

  _draggable(status) {
    if (this.swiper) {
      this.swiper.allowTouchMove = status;
    }
  }

  _gsapAnimation(mainSlider) {
    if (this.querySelector('[data-swiper]').classList.contains('splitslider')) {
      let swiperKey = 0;
      let allSwiperSlideGet = this.querySelectorAll('.swiper-slide');
      for (swiperKey = 0; swiperKey < allSwiperSlideGet.length; swiperKey++) {
        if (swiperKey > 0) {
          let splitContent = allSwiperSlideGet[swiperKey]
            .querySelector('.ytransition-content')
            .querySelector('.splitslider--content-text');
          let getAllimages = allSwiperSlideGet[swiperKey].querySelectorAll('.ytransition-split-media-image');

          let visibleMediaElement;
          if (getAllimages.length === 1) {
            visibleMediaElement = getAllimages[0];
          } else {
            visibleMediaElement = Array.from(getAllimages).find((element) => {
              let style = window.getComputedStyle(element);
              return style.display !== 'none' && style.visibility !== 'hidden';
            });
          }
          let splitMediaImages = visibleMediaElement ? visibleMediaElement.querySelector('img') : null;

          if (splitMediaImages == null) {
            splitMediaImages = allSwiperSlideGet[swiperKey]
              .querySelector('.ytransition-split-media-image')
              .querySelector('svg');
          }
          let imageContentArea = allSwiperSlideGet[swiperKey].querySelectorAll('.transition-content-image');
          gsap.set(
            splitContent,
            {
              yPercent: 10,
            },
            '<'
          );
          gsap.set(splitMediaImages, {
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
          });
          gsap.set(imageContentArea, {
            perspective: 400,
            opacity: 0,
            yPercent: 100,
          });
        } else {
          let splitContent = allSwiperSlideGet[swiperKey]
            .querySelector('.ytransition-content')
            .querySelector('.splitslider--content-text');
          let getAllimages = allSwiperSlideGet[swiperKey].querySelectorAll('.ytransition-split-media-image');

          let visibleMediaElement;
          if (getAllimages.length === 1) {
            visibleMediaElement = getAllimages[0];
          } else {
            visibleMediaElement = Array.from(getAllimages).find((element) => {
              let style = window.getComputedStyle(element);
              return style.display !== 'none' && style.visibility !== 'hidden';
            });
          }
          let splitMediaImages = visibleMediaElement ? visibleMediaElement.querySelector('img') : null;

          if (splitMediaImages == null) {
            splitMediaImages = allSwiperSlideGet[swiperKey]
              .querySelector('.ytransition-split-media-image')
              .querySelector('svg');
          }

          let imageContentArea = allSwiperSlideGet[swiperKey].querySelectorAll('.transition-content-image');
          gsap.set(
            splitContent,
            {
              yPercent: 0,
            },
            '<'
          );
          gsap.set(splitMediaImages, {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          });
          gsap.set(imageContentArea, {
            duration: 1,
            yPercent: 0,
            ease: 'power4',
            stagger: 0.1,
            opacity: 1,
          });
        }
      }

      this.swiper.on('slideChange', function (e) {
        let timeLineSwiper = gsap.timeline();
        let activeSlide = this.slides[e.activeIndex];
        let previousSlide = this.slides[e.previousIndex];

        function getVisibleMediaElement(slide) {
          let mediaWrappers = slide.querySelectorAll('.ytransition-split-media-image');

          return mediaWrappers.length === 1
            ? mediaWrappers[0]
            : Array.from(mediaWrappers).find((element) => {
              let style = window.getComputedStyle(element);
              return style.display !== 'none' && style.visibility !== 'hidden';
            });
        }
        let activevisibleMediaElement = getVisibleMediaElement(activeSlide);
        let imageSwiperSlideActive = activevisibleMediaElement ? activevisibleMediaElement.querySelector('img') : null;

        let prevvisibleMediaElement = getVisibleMediaElement(previousSlide);
        let imageSwiperSlidePrevious = prevvisibleMediaElement ? prevvisibleMediaElement.querySelector('img') : null;

        let svgSwiperSlideActive = activeSlide
          .querySelector('.ytransition-split-media-image')
          .querySelector('.placeholder-svg');
        let svgSwiperSlidePrevious = previousSlide
          .querySelector('.ytransition-split-media-image')
          .querySelector('.placeholder-svg');

        let ytransitionContentActive,
          ytransitionContentPrevious,
          imageContentTransition,
          imageContentActiveText,
          imageContentPrevText = '';
        if (activeSlide.getElementsByClassName('ytransition-content').length > 0) {
          ytransitionContentActive = activeSlide
            .querySelector('.ytransition-content')
            .querySelector('.splitslider--content');
        }
        if (previousSlide.getElementsByClassName('ytransition-content').length > 0) {
          ytransitionContentPrevious = previousSlide
            .querySelector('.ytransition-content')
            .querySelector('.splitslider--content');
        }
        if (activeSlide.querySelectorAll('.ytransition-image-content').length > 0) {
          if (
            activeSlide.querySelector('.ytransition-image-content').querySelectorAll('.transition-content-image')
              .length > 0
          ) {
            imageContentActiveText = activeSlide
              .querySelector('.ytransition-image-content')
              .querySelector('.splitslider--content')
              .querySelectorAll('.transition-content-image');
          }
        }
        if (previousSlide.querySelectorAll('.ytransition-image-content').length > 0) {
          if (
            previousSlide.querySelector('.ytransition-image-content').querySelectorAll('.transition-content-image')
              .length > 0
          ) {
            imageContentPrevText = previousSlide
              .querySelector('.ytransition-image-content')
              .querySelector('.splitslider--content')
              .querySelectorAll('.transition-content-image');
          }
        }
        timeLineSwiper.to(imageSwiperSlideActive, 1, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        });
        if (svgSwiperSlideActive) {
          timeLineSwiper.to(svgSwiperSlideActive, 1, {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          });
        }
        if (ytransitionContentActive != '') {
          timeLineSwiper.to(
            ytransitionContentActive,
            1,
            {
              yPercent: 0,
            },
            '<'
          );
        }
        if (imageContentActiveText != '') {
          timeLineSwiper.to(imageContentActiveText, {
            duration: 1,
            yPercent: 0,
            ease: 'power4',
            stagger: 0.1,
            opacity: 1,
          });
        }
        if (ytransitionContentPrevious != '') {
          timeLineSwiper.set(
            ytransitionContentPrevious,
            {
              yPercent: 10,
            },
            '<'
          );
        }
        if (imageContentPrevText != '') {
          timeLineSwiper.set(
            imageContentPrevText,
            {
              opacity: 0,
              yPercent: 100,
            },
            '<'
          );
        }
        timeLineSwiper.set(
          imageSwiperSlidePrevious,
          {
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
          },
          '<'
        );
        if (svgSwiperSlidePrevious) {
          timeLineSwiper.set(
            svgSwiperSlidePrevious,
            {
              clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
            },
            '<'
          );
        }
      });
    }
  }

  _customEvents(mainSlider) {
    this.swiper.on('slideChange', function (e) {
      this.section = document.querySelector(`[id="shopify-section-${this.el.dataset.section}"]`);

      this.previousSlide = this.slides[e.previousIndex];
      this.activeSlide = this.slides[e.activeIndex];
      if (this.previousSlide) {
        this.previousSlide.querySelectorAll('video').forEach(function (video) {
          video.pause();
        });
        this.previousSlide.querySelectorAll('.youtube-video').forEach((video) => {
          video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        });
        this.previousSlide.querySelectorAll('.vimeo-video').forEach((video) => {
          video.contentWindow.postMessage('{"method":"pause"}', '*');
        });

        if (
          this.previousSlide &&
          this.previousSlide.querySelector('product-model') &&
          !this.previousSlide.querySelector('product-model').classList.contains('shopify-model-viewer-ui__disabled')
        ) {
          this.previousSlide?.querySelector('product-model')?.modelViewerUI.pause();
        }
      }
      if (this.activeSlide) {
        if (
          !(
            mainSlider.classList.contains('main--product-media') ||
            mainSlider.classList.contains('quickview--product-media')
          )
        ) {
          this.activeSlide.querySelectorAll('video').forEach(function (video) {
            video.play();
          });
        }
      }

      /*if (this.el.classList.contains('hero-banner--main-images')) {
        let target = this.section.querySelector('[data-running-text]');
        if (target) {
          target.innerHTML = ''; // Clear the text
        }
        let message = this.activeSlide.getAttribute('data-running-content');
        // function showText(target, message, index, interval) {
        //   if (index < message.length) {
        //     target.innerHTML = target.innerHTML + message[index++];
        //     setTimeout(function () {
        //       showText(target, message, index, interval);
        //     }, interval);
        //   }
        // }
        function showText(target, message, index, interval) {
          clearInterval(currentInterval);
          currentInterval = setInterval(function () {
            if (index < message.length) {
              target.innerHTML += message[index++];
            } else {
              clearInterval(currentInterval);
            }
          }, interval);
        }
        // Now call showText
        if (this.activeSlide.getAttribute('data-running-content')) {
          showText(target, message, 0, 50);
        }
      }*/

      if (this.el.classList.contains('hero-banner--main-images')) {
        let target = this.section.querySelector('[data-running-text]');
        if (target) {
          target.innerHTML = '';
        }

        let message = this.activeSlide.getAttribute('data-running-content');

        function showText(target, message, index, interval) {
          if (index < message.length) {
            target.innerHTML = target.innerHTML + message[index++];
            timeoutId = setTimeout(function () {
              showText(target, message, index, interval);
            }, interval);
          }
        }

        function clearPreviousTimeout() {
          if (timeoutId) {
            clearTimeout(timeoutId); // Clear the previously set timeout
            timeoutId = null; // Reset the timeout ID
          }
        }
        // Clear any previous text animation
        clearPreviousTimeout();
        // Start showing text if there is new content for the active slide
        if (this.activeSlide.getAttribute('data-running-content')) {
          showText(target, message, 0, 50);
        }
      }
    });
  }
}

customElements.define('swiper-content', SwiperContent);

class MediaGallery extends HTMLElement {
  constructor() {
    super();
    if (!this.querySelector('[data-product-thumbnails]')) return;
    this.id = this.dataset.id;
    this.sliderInstance = false;
    this.thumbsInstance = false;
  }

  connectedCallback() {
    this._initThumbnailsSize();
    if (!this.id) {
      return;
    }
    const slideItem = this.querySelector(`[data-product-media="main-media-${this.id}"]`);
    if (slideItem) {
      const resizeObserver = new ResizeObserver(() => this._initThumbnailsSize());
      resizeObserver.observe(slideItem);
    } else {
      console.warn('MediaGallery: main-media element not found.');
    }
    this.init();
  }
  _initThumbnailsSize() {
    const slideItem = this.querySelector(`[data-product-media="main-media-${this.id}"]`);
    if (slideItem) {
      requestAnimationFrame(() => {
        this.mainItemheight = slideItem.getBoundingClientRect().height;
        const thumbmedia = this.querySelector(`[data-product-media="main-thumb-${this.id}"] ul`);

        if (thumbmedia) {
          thumbmedia.style.setProperty('--thumb_height', `${this.mainItemheight}px`);
        } else {
          console.warn('MediaGallery: main-thumb element not found.');
        }
      });
    } else {
      console.warn('MediaGallery: main-media element not found.');
    }
  }

  init() {
    this.mediaLayout = this.dataset.mediaLayout;
    this.sliderThumbs = new Swiper(`[data-slider-thumbs="${this.id}"]`, {
      loop: true,
      speed: 800,
      direction: 'vertical',
      slidesPerView: 'auto',
      freeMode: false,

    });

    this.sliderImages = new Swiper(`[data-slider-images="${this.id}"]`, {
      loop: true,
      speed: 800,
      slidesPerView: 1.2,
      spaceBetween: 2,
      pagination: {
        enabled: false,
        el: `.swiper-pagination-${this.id}`,
        type: 'bullets',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        enabled: false,
        nextEl: `.swiper-button-next-${this.id}`,
        prevEl: `.swiper-button-prev-${this.id}`,
      },
      thumbs: {
        swiper: this.sliderThumbs,
      },
      breakpoints: {
        768: {
          slidesPerView: 1,
          navigation: {
            enabled: true,
            nextEl: `.swiper-button-next-${this.id}`,
            prevEl: `.swiper-button-prev-${this.id}`,
          },
          pagination: {
            enabled: false,
            el: `.swiper-pagination-${this.id}`,
            type: 'bullets',
            clickable: true,
          },
        },
      },
    });
    this._customEvents();
  }
  _selectSlide(index) {
    if (this.sliderImages) {
      this.sliderImages.slideToLoop(index);
      this.sliderThumbs.slideToLoop(index);
    }
  }

  _draggable(status) {
    if (this.sliderImages) {
      this.sliderImages.allowTouchMove = status;
      this.sliderThumbs.allowTouchMove = status;
    }
  }

  _customEvents() {
    this.sliderImages.on('slideChange', function (e) {
      this.section = document.querySelector(`[id="shopify-section-${this.el.dataset.section}"]`);

      this.previousSlide = this.slides[e.previousIndex];
      this.activeSlide = this.slides[e.activeIndex];

      if (this.previousSlide) {
        this.previousSlide.querySelectorAll('video').forEach(function (video) {
          video.pause();
        });

        this.previousSlide.querySelectorAll('.youtube-video').forEach((video) => {
          video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        });
        this.previousSlide.querySelectorAll('.vimeo-video').forEach((video) => {
          video.contentWindow.postMessage('{"method":"pause"}', '*');
        });

        if (
          this.previousSlide &&
          this.previousSlide.querySelector('product-model') &&
          !this.previousSlide.querySelector('product-model').classList.contains('shopify-model-viewer-ui__disabled')
        ) {
          this.previousSlide?.querySelector('product-model')?.pauseModel();
        }
      }

      if (
        this.activeSlide &&
        this.activeSlide.querySelector('product-model') &&
        !this.activeSlide.querySelector('product-model').classList.contains('shopify-model-viewer-ui__disabled')
      ) {
        this.activeSlide?.querySelector('product-model')?.pauseModel();
      }
    });
  }
}

customElements.define('media-gallery', MediaGallery);

class AnimateSlideshow extends HTMLElement {
  constructor() {
    super();
    this.main = this;
    this.initializeSlider(this);
  }

  initializeSlider(mainContainer) {
    const buttons = mainContainer.querySelectorAll('[data-animate-btn-slide]');
    const boxes = mainContainer.querySelectorAll('[data-animate-item]');

    setTimeout(() => {
      boxes[0].classList.add('active');
      this.textAnimated(mainContainer);
      this.addCustomSwipe(mainContainer);
    }, 100);

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (!button.classList.contains('active') && !mainContainer.classList.contains('active-slider')) {
          mainContainer.classList.add('active-slider');
          const index = Array.prototype.indexOf.call(buttons, button);
          buttons.forEach((btn) => btn.classList.remove('active'));
          boxes.forEach((box) => box.classList.remove('active'));

          button.classList.add('active');
          boxes[index].classList.add('active');
          this.textAnimated(mainContainer);
        }
      });
    });
  }

  customSelectSlide(currentIndex) {
    const buttons = this.main.querySelectorAll('[data-animate-btn-slide]');
    const boxes = this.main.querySelectorAll('[data-animate-item]');

    buttons.forEach((btn) => btn.classList.remove('active'));
    boxes.forEach((box) => box.classList.remove('active'));
    buttons[currentIndex].classList.add('active');
    boxes[currentIndex].classList.add('active');
    this.textAnimated(this.main);
  }

  customNextPrev(mainContainer, customEvent) {
    const buttons = mainContainer.querySelectorAll('[data-animate-btn-slide]');
    const boxes = mainContainer.querySelectorAll('[data-animate-item]');
    let currentIndex = Array.prototype.indexOf.call(
      buttons,
      mainContainer.querySelector('[data-animate-btn-slide].active')
    );

    if (customEvent === 'right') {
      currentIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
    } else if (customEvent === 'left') {
      currentIndex = currentIndex === buttons.length - 1 ? 0 : currentIndex + 1;
    }
    if (buttons[currentIndex] != undefined) {
      buttons.forEach((btn) => btn.classList.remove('active'));
      boxes.forEach((box) => box.classList.remove('active'));

      buttons[currentIndex].classList.add('active');
      boxes[currentIndex].classList.add('active');
      this.textAnimated(mainContainer);
    }
  }

  textAnimated(mainContainer) {
    const activeBox = mainContainer.querySelector('[data-animate-item].active');
    if (!activeBox) return;

    const contentData = activeBox.querySelector('[data-animate-content]');
    if (!contentData) return;

    const headings = contentData.querySelectorAll('[data-animate-heading]');
    const subheadings = contentData.querySelectorAll('[data-animate-subheading]');
    const descriptions = contentData.querySelectorAll('[data-animate-description]');
    const buttons = contentData.querySelectorAll('[data-animate-button]');

    const tl1 = gsap.timeline();
    const tl2 = gsap.timeline();
    const tl3 = gsap.timeline();
    const tl4 = gsap.timeline();

    if (subheadings) {
      tl1.from(subheadings, 1.8, { y: 100, ease: 'power4.out', delay: 0, stagger: { amount: 0.5 } });
    }
    if (headings) {
      tl2.from(headings, 1.8, { y: 200, ease: 'power4.out', delay: 0.4, stagger: { amount: 0.5 } });
    }
    if (descriptions) {
      tl3.from(descriptions, 1.8, { y: 100, ease: 'power4.out', delay: 0.7, stagger: { amount: 0.5 } });
    }
    if (buttons) {
      tl4.from(buttons, 1.8, { y: 100, ease: 'power4.out', delay: 1, stagger: { amount: 0.5 } });
    }
    setTimeout(() => {
      mainContainer.classList.remove('active-slider');
    }, 1000);
  }

  addCustomSwipe(mainContainer) {
    // Add swipe logic here (if any)
    let startX, startY, endX, endY;
    // Detect touch start or mouse down
    mainContainer.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    });

    mainContainer.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
    });

    // Detect touch end or mouse up
    mainContainer.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      handleSwipe();
    });

    mainContainer.addEventListener('mouseup', (e) => {
      endX = e.clientX;
      endY = e.clientY;
      handleSwipe();
    });

    // Swipe handler
    function handleSwipe() {
      const diffX = endX - startX;
      const diffY = endY - startY;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
          customEvent('swipeRight');
        } else {
          customEvent('swipeLeft');
        }
      } else {
        // Vertical swipe
        if (diffY > 0) {
          customEvent('swipeDown');
        } else {
          customEvent('swipeUp');
        }
      }
    }

    // Trigger custom events
    function customEvent(eventType) {
      const event = new Event(eventType);
      mainContainer.dispatchEvent(event);
    }

    // Listen for custom swipe events
    mainContainer.addEventListener('swipeRight', () => {
      if (!mainContainer.classList.contains('active-slider')) {
        mainContainer.classList.add('active-slider');
        this.customNextPrev(mainContainer, 'right');
      }
    });

    mainContainer.addEventListener('swipeLeft', () => {
      if (!mainContainer.classList.contains('active-slider')) {
        mainContainer.classList.add('active-slider');
        this.customNextPrev(mainContainer, 'left');
      }
    });

    mainContainer.addEventListener('swipeUp', () => { });

    mainContainer.addEventListener('swipeDown', () => { });
  }
}
customElements.define('animate-slideshow', AnimateSlideshow);

class SmoothScroll {
  constructor(el) {
    this.el = el;

    this.currentY = 0;
    this.targetY = 0;
    this.setup();
    this.onWindowResize();
    this.animate();
  }

  setup() {
    document.body.style.height = `${this.el.offsetHeight}px`;
    window.addEventListener('scroll', () => {
      this.targetY = window.scrollY;
    });
  }

  onWindowResize() {
    window.addEventListener('resize', () => {
      document.body.style.height = `${this.el.offsetHeight}px`;
    });
  }

  animate() {
    this.currentY = lerp(this.currentY, this.targetY, 0.04);
    this.el.style.transform = `translate3d(0, -${this.currentY}px, 0)`;
    requestAnimationFrame(this.animate.bind(this));
  }
}
// const scrollable = document.querySelector('body');
// new SmoothScroll(scrollable);

class FilterToggler extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest('section');
    this.filterNav = this.querySelector('[data-filters-nav]');
    this.productsWrapper = this.closest('[data-collection-wrapper]').querySelector('[data-products-wrapper]');
    this.filtersSidebar = this.section.querySelector('[data-filters-sidebar]');
    this.mobileFilterButton = this.querySelector('[data-filters-mobile]');

    this.filterNav?.addEventListener('click', this.toggleFilterSidebar.bind(this));
    this.mobileFilterButton?.addEventListener('click', this.showMobileFilters.bind(this));
  }

  toggleFilterSidebar(event) {
    event.preventDefault();
    const isOpened = this.filterNav.classList.toggle('filters-opened');
    this.productsWrapper.classList.toggle('open-filter', isOpened);
    // this.filtersSidebar.classList.toggle('active', isOpened);
    this.filterNav.querySelector('span').innerText = isOpened ? hideFilters : showFilters;
  }

  showMobileFilters(event) {
    event.preventDefault();
    this.filtersSidebar.classList.add('active');
    document.body.classList.add('overflow-hidden');
  }
}

customElements.define('filter-toggler', FilterToggler);

class FilterForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));
    // const facetForms = this.querySelectorAll('form');
    // facetForms.forEach((facetForm) => {
    //   facetForm.addEventListener('input', this.onSubmitHandler.bind(this));
    // });
    if (this.querySelector('[data-mobile-filter-toggle]')) {
      this.querySelector('[data-mobile-filter-toggle]').addEventListener('click', this.closeMobilePopover.bind(this));
    }

    if (this.dataset.horizontalFilter == 'horizontal' && this.dataset.filterSticky == 'true') {
      //window.addEventListener('scroll', this.onFilterScroll.bind(this));
    }
    if (this.dataset.horizontalFilter == 'horizontal-bottom' && this.dataset.filterSticky == 'true') {

    }
  }


  onFilterScroll() {
    const topbar = this.closest('[data-custom-dropdown-wrapper]');
    let headerBottom = 0;

    const header = document.querySelector('header');
    if (header) {
      headerBottom = header.getBoundingClientRect().bottom;
    }
    if (header.querySelector('[data-header-section]').classList.contains('sticky-none')) {
      headerBottom = 0;
    }
    const offsetTop = this.closest('[data-custom-dropdown-wrapper]').getBoundingClientRect().top - headerBottom;

    const threshold = header.querySelector('[data-header-section]')?.getBoundingClientRect().height; // Adjust this value as needed

    if (offsetTop < 0) {
      if (!topbar.classList.contains('is-sticky')) {
        topbar.classList.add('is-sticky');
      }
    }
    else if (offsetTop > threshold) {
      if (topbar.classList.contains('is-sticky')) {
        topbar.classList.remove('is-sticky');
      }
    }
  }
  onFilterBottomScroll() {

    const topbar = this.closest('[data-custom-dropdown-wrapper]');
    if (topbar) {
      const currentSection = this.closest('.shopify-section');
      const sectionWrapper = currentSection.querySelector('[data-collection-wrapper]');
      const sectionFilter = currentSection.querySelector('[data-filter-option]');

      if (sectionWrapper) {
        const rect = topbar.getBoundingClientRect();
        const section = sectionWrapper.getBoundingClientRect();

        if (rect.bottom < window.innerHeight && section.bottom > window.innerHeight) {

          topbar.classList.add('is-bottom-sticky');

          topbar.classList.remove('is-bottom-sticky');
        }
      }
    }
  }





  closeMobilePopover() {
    const mobilePopover = this.closest('[data-filters-sidebar]').classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }

  createSearchParams(form) {
    return new URLSearchParams(new FormData(form)).toString();
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const sortingFilterForms = this.closest('filter-faced-form').querySelectorAll('form');

    let forms = [];
    sortingFilterForms.forEach((sortingFilterForm) => {
      forms.push(this.createSearchParams(sortingFilterForm));
    });
    forms = forms.filter(function (el) {
      return el;
    });

    this.onSubmitForm(forms.join('&'), event);
    if (document.querySelector('.sticky-horizontal-filter')) {
      if (document.querySelector('.sticky-horizontal-filter').classList.contains('open')) {
        this.closest('.shopify-section').querySelector('.top-filter').scrollIntoView({
          behavior: 'smooth'
        });
        document.querySelector('[data-sticky-filter]').classList.remove('open');
        const buttons = document.querySelector('[data-sticky-toggle-button]');
        const openBtn = buttons.querySelector('.open-icon');
        const closeBtn = buttons.querySelector('.close-icon');
        if (openBtn.classList.contains('hidden')) {
          openBtn.classList.remove('hidden');
        }
        if (!closeBtn.classList.contains('hidden')) {
          closeBtn.classList.add('hidden');
        }
      }
    }
    setTimeout(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.sort();
    }, 1500);
  }

  onSubmitForm(searchParams, event) {
    const query = document.querySelector('[search-page-input]');
    if (query) {
      const queryValue = query.value;
      searchParams = `${searchParams}&type=product&q=${queryValue}`;
    }

    FilterForm.renderPage(searchParams, event);
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    const url =
      event.currentTarget.href.indexOf('?') == -1
        ? ''
        : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FilterForm.renderPage(url);
  }

  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  static getSections() {
    const collectioSection = document.getElementById('collection--list-grid');
    const searchSection = document.getElementById('search--list-grid');
    if (collectioSection) {
      return [
        {
          section: document.getElementById('collection--list-grid').dataset.id,
        },
      ];
    }
    if (searchSection) {
      return [
        {
          section: document.getElementById('search--list-grid').dataset.id,
        },
      ];
    }
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FilterForm.searchParamsPrev = searchParams;
    const sections = FilterForm.getSections();
    sections.forEach((section) => {
      const query = document.querySelector('[search-page-input]');
      if (query) {
        const queryValue = query.value;
        const url = `${window.location.pathname}?section_id=${section.section}&q=${queryValue}&${searchParams}`;
        FilterForm.renderSectionFromFetch(url, event);
      } else {
        const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
        FilterForm.renderSectionFromFetch(url, event);
      }
    });

    if (updateURLHash) {
      FilterForm.updateURLHash(searchParams);
    }
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FilterForm.renderFiltersBar(html, event);
        FilterForm.renderProductGrid(html);
      });
  }
  static renderProductGrid(html) {
    // const searchGrid = document.querySelector('.search--result-body');
    const resultData = new DOMParser().parseFromString(html, 'text/html');
    if (document.querySelector('[data-collections-grid]') && resultData.querySelector('[data-collections-grid]')) {
      document.querySelector('[data-collections-grid]').innerHTML =
        resultData.querySelector('[data-collections-grid]').innerHTML;
    }
    if (
      document.querySelector('[main-search-products-count]') &&
      resultData.querySelector('[main-search-products-count]')
    ) {
      document.querySelector('[main-search-products-count]').innerHTML =
        resultData.querySelector('[main-search-products-count]').innerHTML;
    }
    if (document.querySelector('[data-collection-topbar]') && resultData.querySelector('[data-collection-topbar]')) {
      document.querySelector('[data-collection-topbar]').innerHTML =
        resultData.querySelector('[data-collection-topbar]').innerHTML;
    }
  }
  static renderFiltersBar(html, event) {
    const resultData = new DOMParser().parseFromString(html, 'text/html');
    if (document.querySelector('[data-filters-sidebar]') && resultData.querySelector('[data-filters-sidebar]')) {
      document.querySelector('[data-filters-sidebar]').innerHTML =
        resultData.querySelector('[data-filters-sidebar]').innerHTML;
    }
    const dropdownWrappers = document.querySelectorAll('[data-custom-dropdown-wrapper]');
    const resultDropdownWrappers = resultData.querySelectorAll('[data-custom-dropdown-wrapper]');

    if (dropdownWrappers.length > 0 && resultDropdownWrappers.length > 0) {
      dropdownWrappers.forEach((dropdown, index) => {

        if (resultDropdownWrappers[index]) {
          dropdown.innerHTML = resultDropdownWrappers[index].innerHTML;
        }
      });
    }

  }
}
customElements.define('filter-faced-form', FilterForm);

class PriceRangeFilters extends HTMLElement {
  constructor() {
    super();

    if (!this.querySelector('[data-range-bars]')) return;
    this.rangeBars = this.querySelectorAll('input[type=range]');
    this.numberFields = this.querySelectorAll('input[type=number]');
    this.progress = this.querySelector('[data-filter-progress]');

    this.thumbsGap = 1;

    this.rangeBars.forEach((rangeBar) => {
      rangeBar.addEventListener('input', this.rangeBarHandle.bind(this));
    });

    this.numberFields.forEach((numberField) => {
      numberField.addEventListener('input', this.numberFieldHandle.bind(this));
    });
  }

  rangeBarHandle(event) {
    this.rangeBars.forEach((el) => {
      let minVal = parseInt(this.rangeBars[0].value),
        maxVal = parseInt(this.rangeBars[1].value);

      if (maxVal - minVal < this.thumbsGap) {
        if (el.target.className === 'input-min') {
          this.rangeBars[0].value = maxVal - this.thumbsGap;
        } else {
          this.rangeBars[1].value = minVal + this.thumbsGap;
        }
      } else {
        this.numberFields[0].value = minVal;
        this.numberFields[1].value = maxVal;
        this.progress.style.left = (minVal / this.rangeBars[0].max) * 100 + '%';
        this.progress.style.right = 100 - (maxVal / this.rangeBars[1].max) * 100 + '%';
      }
    });
  }

  numberFieldHandle(event) {
    this.numberFields.forEach((el) => {
      let minPrice = parseFloat(this.numberFields[0].value),
        maxPrice = parseFloat(this.numberFields[1].value);

      if (maxPrice - minPrice >= this.thumbsGap && maxPrice <= this.rangeBars[1].max) {
        if (e.target.className === 'input-min') {
          this.rangeBars[0].value = minPrice;
          this.progress.style.left = (minPrice / this.rangeBars[0].max) * 100 + '%';
        } else {
          this.rangeBars[1].value = maxPrice;
          this.progress.style.right = 100 - (maxPrice / this.rangeBars[1].max) * 100 + '%';
        }
      }
    });
  }
}
customElements.define('price-range-bar', PriceRangeFilters);

class ClearAllFilters extends HTMLElement {
  constructor() {
    super();
    const removeLink = this.querySelector('a');
    removeLink.setAttribute('role', 'button');
    removeLink.addEventListener('click', this.clearFilter.bind(this));
    removeLink.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'SPACE') this.clearFilter(event);
    });
  }

  clearFilter(event) {
    event.preventDefault();
    const form = this.closest('filter-faced-form') || document.querySelector('filter-faced-form') || document.querySelector('[data-filter-faced-form]');
    const forms = document.querySelector('[data-filter-faced-form]');

    if (forms) {

      forms.onActiveFilterClick(event);
    }
    form.onActiveFilterClick(event);
  }
}
customElements.define('filter-remove', ClearAllFilters);

class Variants extends HTMLElement {
  constructor() {
    super();
    //this._onVariantChange();

    this.colors = this.querySelectorAll('[variant-item]');
    this.section = this.closest('section');
    this.type = this.dataset.type;
    this.hideOption = this.dataset.unavailable;
    this.hidesoldOut = this.dataset.soldout;
    this.preorderStatus = this.dataset.preorder;

    if (this.colors && this.colors.length > 0) {
      // this.colors[0].classList.add('active');

      this.colors.forEach((option) => {
        option.addEventListener('click', () => {
          this.colors.forEach((elem) => {
            elem.classList.remove('active');
          });

          option.classList.add('active');
        });

        option.addEventListener('mouseover', () => {
          this.colors.forEach((elem) => {
            if (elem.querySelector('.show-tooltip')) {
              elem.querySelector('.tooltip').classList.remove('show-tooltip');
            }

            if (option.querySelector('.tooltip')) {
              option.querySelector('.tooltip').classList.add('show-tooltip');
            }
          });
        });

        option.addEventListener('mouseleave', () => {
          this.colors.forEach((elem) => {
            if (elem.querySelector('.show-tooltip')) {
              elem.querySelector('.tooltip').classList.remove('show-tooltip');
            }
          });
        });
      });
    }
    // this._updateOptions();
    // this._updateMasterVariantId();
    // this._getVariantOptions();
    this.addEventListener('change', this._onVariantChange);
    this._internals = this.attachInternals();
  }

  _onVariantChange(event) {
    this._updateOptions();
    this._updateMasterVariantId();
    this._updateVariantStatuses();
    // this._getVariantOptions();

    if (!this.currentVariant) {
      this._addToCartHandle(true, '', true);
    } else {
      if (!this.closest('quick-view-drawer')) {
        this._updateUrl();
        this.updatePickupAvailability();
      }
      this._updateVariantFeeds();
      if (this.closest('[data-product-card]')) {
        this._renderCardInfo();
      } else {
        this._renderProductInfo();
      }
    }

    this._updateMedia();
  }
  _renderCardInfo() {
    const requestedVariantId = this.currentVariant.id;
    const sectionId = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;
    const sectionProductId = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;

    fetch(`/products/${this.dataset.handle}?variant=${requestedVariantId}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const addButtonUpdated = html.querySelector(`[data-button = product--submit-${this.dataset.product}]`);
        const updatedButton = document.querySelector(`[data-button = product--submit-${this.dataset.product}]`);
        if (addButtonUpdated.hasAttribute('disabled')) {
          updatedButton.setAttribute('disabled', 'disabled');
        } else {
          updatedButton.removeAttribute('disabled');
        }

        const priceWrapperdestination = document.getElementById(
          `price-title-wrapper-${this.dataset.section}-${this.dataset.product}`
        );

        const priceWrapperSource = html.getElementById(
          `price-title-wrapper-${this.dataset.section}-${this.dataset.product}`
        );
        if (priceWrapperSource && priceWrapperdestination) {
          priceWrapperdestination.innerHTML = priceWrapperSource.innerHTML;
        }
      });
  }
  _updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;
    this.productMedia = this.section.querySelector(
      `media-gallery,swiper-content.main--product-media,swiper-content.quickview--product-thumbnail,swiper-content[data-id="${this.dataset.section}-${this.dataset.product}"]`
    );


    if (this.productMedia) {
      const newMedia = this.productMedia.querySelector(
        `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
      );
      if (newMedia) {
        const slideIndex = parseInt(newMedia.getAttribute('data-swiper-slide-index'));
        if (!isNaN(slideIndex)) {

          if (this.productMedia.querySelector('.swiper-autoplay')) {
            this.productMedia.increaseAutoplaySpeed(2000);
            this.productMedia._selectSlide(slideIndex);
            this.productMedia.increaseAutoplaySpeed(6000);
          } else {
            this.productMedia._selectSlide(slideIndex);
          }

        }
      }
    }

    const productCard = this.closest('[data-product-card]');
    if (productCard && productCard.querySelector('[data-product-media]')) {
      let imageContent = `${this.currentVariant.featured_media.preview_image.src}&width=180 180w,
        ${this.currentVariant.featured_media.preview_image.src}&width=360 360w,
        ${this.currentVariant.featured_media.preview_image.src}&width=540 540w,
        ${this.currentVariant.featured_media.preview_image.src}&width=720 720w,
        ${this.currentVariant.featured_media.preview_image.src}&width=900 900w`;

      productCard.querySelector('[data-product-media]').querySelector('img').srcset = imageContent;
    }
  }

  _updateUrl() {
    if (this.dataset.page != 'product') return;
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  _updateVariantFeeds() {
    const productForms = document.querySelectorAll(
      `#main-product-form-${this.dataset.section},#quick-view-product-form-${this.dataset.section}, #main-product-form-installment-${this.dataset.section}, #main-product-form-merged-installment-${this.dataset.section},
      #main-product-form-${this.dataset.section}-${this.dataset.product}`
    );

    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  _addToCartHandle(disable = true, text, modifyClass = true) {
    this.productForm =
      document.getElementById(`main-product-form-${this.dataset.section}`) ||
      document.getElementById(`main-product-form-${this.dataset.section}-${this.dataset.product}`) ||
      document.getElementById(`main-card-product-form-${this.dataset.section}-${this.dataset.product}`) ||
      document.getElementById(`quick-view-product-form-${this.dataset.section}-${this.dataset.product}`) ||
      document.getElementById(`quick-view-product-form-${this.dataset.section}`);

    if (!this.productForm) return;
    const addToCartButton = this.productForm.querySelector('[name="add"]');
    const addButtonText = this.productForm.querySelector('[name="add"] > [data-product-button]');
    const stickyAddButtonText = this.closest('section').querySelector(
      `#sticky-product--submit-btn-${this.dataset.section}`
    );
    this.productvariantInventory = JSON.parse(
      this.querySelector('[type="application/json"][data-name="main-product-inventories"]').textContent
    );
    if (this.currentVariant) {
      this.variantInventory = this.productvariantInventory.find((variant) => {
        return variant.id == this.currentVariant.id;
      });
    }

    if (!addToCartButton) return;
    if (disable) {
      addToCartButton.setAttribute('disabled', 'disabled');
      if (this.currentVariant) {
        if (text || addButtonText) addButtonText.textContent = text;
      } else {
        if (addButtonText) addButtonText.textContent = window.addToCartButtonStrings.unavailable;
        if (stickyAddButtonText) {
          // stickyAddButtonText.textContent = window.addToCartButtonStrings.unavailable;
          stickyAddButtonText.setAttribute('diasbled', true);
        }
        const inventory = document.getElementById(
          `product-inventory-wrapper-${this.dataset.section}-${this.dataset.product}`
        );
        if (inventory) {
          inventory.classList.add('hidden');
        }
        const priceTitledestination = document.getElementById(`price--wrapper-${this.dataset.section}`);
        priceTitledestination.classList.add('hidden');
        const pickUpAvailability = document.getElementById(`pickup-availability-${this.dataset.section}`);
        pickUpAvailability.classList.add('hidden');
      }
    } else {
      addToCartButton.removeAttribute('disabled');

      if (
        this.preorderStatus != 'false' &&
        this.variantInventory &&
        this.variantInventory.inventory_policy == 'continue' &&
        this.variantInventory.inventory_quantity <= 0
      ) {
        addButtonText.textContent = window.addToCartButtonStrings.preOrder;
      } else if (addButtonText) {
        addButtonText.textContent = window.addToCartButtonStrings.addToCart;
      }

      if (stickyAddButtonText) {
        // stickyAddButtonText.textContent = window.addToCartButtonStrings.addToCart;
        stickyAddButtonText.removeAttribute('diasbled');
      }
    }

    if (!modifyClass) return;
  }

  _updateOptions() {
    this.options = Array.from(this.querySelectorAll('optionset'), (element) => {
      return Array.from(element.querySelectorAll('input')).find((radio) => radio.checked)?.value;
    });
    if (this.type == 'dropdown') {
      this.options = Array.from(this.querySelectorAll('select'), (element) => {
        return Array.from(element.querySelectorAll('option')).find((option) => option.selected)?.value;
      });
    }
  }

  _updateMasterVariantId() {
    this.currentVariant = this._getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }
  updatePickupAvailability() { }
  _updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(':checked').value === variant.option1
    );

    const option_sets = [...this.querySelectorAll('[data-optionset], select')];

    option_sets.forEach((option, index) => {
      if (index === 0) return;

      const optionInputs = [...option.querySelectorAll('input[type="radio"], option')];
      const previousOptionSelected = option_sets[index - 1].querySelector(':checked').value;

      let availableOptionInputsValue;
      let unavailableOptionInputsValue;

      availableOptionInputsValue = selectedOptionOneVariants
        .filter((variant) => variant.available && variant[`option${index}`] === previousOptionSelected)
        .map((variantOption) => variantOption[`option${index + 1}`]);

      this._setInputAvailability(optionInputs, availableOptionInputsValue);

      unavailableOptionInputsValue = selectedOptionOneVariants
        .filter((variant) => variant[`option${index}`] === previousOptionSelected)
        .map((variantOption) => variantOption[`option${index + 1}`]);

      if (this.hideOption == 'true') {
        this._setUnAvailability(optionInputs, unavailableOptionInputsValue);
      }
    });
  }

  _setInputAvailability(elementList, availableValuesList) {
    elementList.forEach((element) => {
      const value = element.getAttribute('value');
      const availableElement = availableValuesList.includes(value);

      if (element.tagName === 'INPUT') {
        element.classList.toggle('disabled', !availableElement);
        if (this.hidesoldOut == 'true') {
          element.parentNode.classList.toggle('hidden', !availableElement);
        }
      } else if (element.tagName === 'OPTION') {
        element.classList.toggle('disabled', !availableElement);
        if (this.hidesoldOut == 'true') {
          element.classList.toggle('hidden', !availableElement);
        }
      }
    });
  }

  _setUnAvailability(elementList, unavailableValuesList) {
    let selectedElement = null;
    elementList.forEach((element) => {
      const value = element.getAttribute('value');
      const availableElement = unavailableValuesList.includes(value);
      if (element.tagName === 'INPUT') {
        if (!availableElement) {
          element.parentNode.classList.add('hidden');
        } else {
          if (element.parentNode.classList.contains('hidden')) {
            element.parentNode.classList.remove('hidden');
          }
        }
        if (element.type === 'radio' && element.checked && element.parentNode.classList.contains('hidden')) {
          selectedElement = element;
        }
      } else if (element.tagName === 'OPTION') {

        if (!availableElement) {
          element.classList.add('hidden');
        } else {
          if (element.classList.contains('hidden')) {
            element.classList.remove('hidden');
          }
          if (element.classList.contains('disabled')) {
            // element.classList.remove('disabled');
          }
        }
        if (!element.classList.contains('hidden')) {
          selectedElement = element;
        }
      }
    });
    if (selectedElement) {
      let clicked = false;
      for (let i = 0; i < elementList.length; i++) {
        const element = elementList[i];
        if (
          element.tagName === 'INPUT' &&
          element.type === 'radio' &&
          !element.parentNode.classList.contains('hidden')
        ) {
          element.click();
          clicked = true;
          break;
        }

        if (element.tagName === 'OPTION' && !element.classList.contains('hidden')) {
          const selectElement = element.closest('select');
          if (selectElement) {
            const previouslySelected = selectElement.querySelector('option[selected]');

            if (previouslySelected && previouslySelected !== element) {
              previouslySelected.removeAttribute('selected');
            }

            element.setAttribute('selected', 'selected');
            element.click();
            clicked = true;

            break;

            // Optional: If you want to indicate that an option was clicked
          }
        }
        if (!clicked) {
          console.log('No available radio buttons found to click.');
        }
      }
    }
  }

  _renderProductInfo() {
    const requestedVariantId = this.currentVariant.id;
    const sectionId = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;

    fetch(
      `${this.dataset.url}?variant=${requestedVariantId}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section
      }`
    )
      .then((response) => response.text())
      .then((responseText) => {
        // if (this.currentVariant.id !== requestedVariantId) return;

        const html = new DOMParser().parseFromString(responseText, 'text/html');



        const priceTitleWrapperdestination = document.getElementById(`price-title-wrapper-${this.dataset.section}`);
        const priceTitleWrapperSource = html.getElementById(
          `price-title-wrapper-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`
        );

        if (document.getElementById(`price--wrapper-${this.dataset.section}`)) {
          const priceTitledestination = document.getElementById(`price--wrapper-${this.dataset.section}`);
          priceTitledestination.classList.remove('hidden');
        }

        const priceWrapperdestination = document.getElementById(
          `price-title-wrapper-${this.dataset.section}-${this.dataset.product}`
        );

        const priceWrapperSource = html.getElementById(
          `price-title-wrapper-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}-${this.dataset.product
          }`
        );

        const inventorydestination = document.getElementById(
          `product-inventory-wrapper-${this.dataset.section}-${this.dataset.product}`
        );

        const variantsDestination = document.getElementById(
          `products-variants-${this.dataset.section}-${this.dataset.product}`
        );
        const variantsSource = html.getElementById(`products-variants-${this.dataset.section}-${this.dataset.product}`);

        const inventorySource = html.getElementById(
          `product-inventory-wrapper-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section
          }-${this.dataset.product}`
        );

        const stickyBuyButtonSource = html.getElementById(`sticky-buy-button-${this.dataset.section}`);
        const stickyBuyButtonDestination = document.getElementById(
          `sticky-buy-button-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`
        );

        if (stickyBuyButtonSource && stickyBuyButtonDestination) {
          stickyBuyButtonDestination.innerHTML = stickyBuyButtonSource.innerHTML;
        }

        // const buttondestination = document.getElementById(`product-form-context-${this.dataset.section}-${this.dataset.product}`);
        // const buttonSource = html.getElementById(
        //   `product-form-context-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}-${this.dataset.product}`
        // );

        const destination = document.getElementById(`price--wrapper-${this.dataset.section}`);
        const source = html.getElementById(
          `price--wrapper-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`
        );

        if (variantsSource && variantsDestination) {
          variantsDestination.innerHTML = variantsSource.innerHTML;
        }

        const colorNameDestination = this.querySelector(
          `[data-selected-variant=${this.dataset.section}-${this.dataset.product}]`
        );
        const colorNameSource = html.querySelector(
          `[data-selected-variant=${this.dataset.section}-${this.dataset.product}]`
        );

        const skuSource = html.getElementById(
          `product--sku-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`
        );
        const skuDestination = document.getElementById(`product--sku-${this.dataset.section}`);

        const pickupDestination = this.section.querySelector(
          `[data-main-pickup-info=${this.dataset.section}-${this.dataset.product}]`
        );
        const pickupSource = html.querySelector(
          `[data-main-pickup-info=${this.dataset.section}-${this.dataset.product}]`
        );
        const pickUpAvailability = document.getElementById(
          `pickup-availability-${this.dataset.section}-${this.dataset.product}`
        );

        if (colorNameSource && colorNameDestination) {
          colorNameDestination.innerText = colorNameSource.innerText;
        }

        if (priceTitleWrapperSource && priceTitleWrapperdestination) {
          priceTitleWrapperdestination.innerHTML = priceTitleWrapperSource.innerHTML;
          priceTitleWrapperdestination.classList.remove('hidden');
        }

        if (source && destination) {
          destination.innerHTML = source.innerHTML;
        }

        if (priceWrapperSource && priceWrapperdestination) {
          priceWrapperdestination.innerHTML = priceWrapperSource.innerHTML;
          priceWrapperdestination.classList.remove('hidden');
        }

        if (pickupSource && pickupDestination) {
          pickupDestination.innerHTML = '';
          pickupDestination.innerHTML = pickupSource.innerHTML;
          pickUpAvailability.classList.remove('hidden');
        }

        if (inventorySource && inventorydestination) {
          inventorydestination.innerHTML = inventorySource.innerHTML;
          inventorydestination.classList.remove('hidden');
        }

        if (skuSource && skuDestination) {
          skuDestination.innerHTML = skuSource.innerHTML;
          skuDestination.classList.toggle('hidden', skuSource.classList.contains('hidden'));
        }

        const price = document.getElementById(`price-title-wrapper-${this.dataset.section}`);

        if (price) price.classList.remove('hidden');

        // if (inventoryDestination) inventoryDestination.classList.toggle('hidden', inventorySource.innerText === '');

        //const addButtonUpdated = html.getElementById(`product--submit-btn-${sectionId}`);
        const addButtonUpdated = html.querySelector(
          `[data-prid=product--submit-btn-${sectionId}-${this.dataset.product}]`
        );

        this._addToCartHandle(
          addButtonUpdated ? addButtonUpdated.hasAttribute('disabled') : true,
          window.addToCartButtonStrings.soldOut
        );
      });
  }

  _getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  _getVariantOptions() {

    let combinationExists,
      combinationExists2,
      combinationExists3 = '';
    let availableVariantExists,
      availableVariantExists2,
      availableVariantExists3 = '';
    let productOptions = this.querySelectorAll('[data-product-loop-variants]');
    this.productvariantInventorys = JSON.parse(
      this.querySelector('[type="application/json"][data-name="main-product-options"]').textContent
    );
    this.variantProduct = JSON.parse(
      this.querySelector('[type="application/json"][data-name="main-product"]').textContent
    );

    this.productvariantInventorys[0]['values'].forEach((value, valueIndex) => {
      combinationExists = this.variantProduct.some((variant) => variant['option1'] === value && variant);
      availableVariantExists = this.variantProduct.some(
        (variant) => variant['option1'] === value && variant['available']
      );
      if (this.type == 'button') {

        const optionsArray = Array.from(productOptions);
        const optionValue = optionsArray[valueIndex].querySelector('.productOption');
        if (optionValue) {
          optionValue.parentElement.classList.toggle('hidden', !combinationExists);
          optionValue.classList.toggle('not-available', !availableVariantExists);
        }
      } else {
        const optionValue = Array.from(selector.querySelectorAll('.productOption option'))[valueIndex];
        if (optionValue) {
          optionValue.classList.toggle('hidden', !combinationExists);
          optionValue.toggleAttribute('disabled', !availableVariantExists);
        }
      }
      this.productvariantInventorys[1]['values'].forEach((value2, valueIndex2) => {
        (combinationExists2 = this.variantProduct.some(
          (variant) => variant['option2'] === value2 && variant['option1'] === this.currentVariant['option1'] && variant
        )),
          (availableVariantExists2 = this.variantProduct.some(
            (variant) =>
              variant['option2'] === value2 &&
              variant['option1'] === this.currentVariant['option1'] &&
              variant['available']
          ));
        if (this.type == 'button') {

          const optionsArray = Array.from(productOptions);
          const optionValue = optionsArray[valueIndex].querySelector('.productOption');
          if (optionValue) {
            optionValue.parentElement.classList.toggle('hidden', !combinationExists2);
            optionValue.classList.toggle('not-available', !availableVariantExists2);
          }
        } else {
          const optionValue = Array.from(selector.querySelectorAll('.productOption option'))[valueIndex];
          if (optionValue) {
            optionValue.classList.toggle('hidden', !combinationExists2);
            optionValue.toggleAttribute('disabled', !availableVariantExists2);
          }
        }


        this.productvariantInventorys[2]['values'].forEach((value3, valueIndex3) => {
          (combinationExists3 = this.variantProduct.some(
            (variant) =>
              variant['option3'] === value3 &&
              variant['option1'] === this.currentVariant['option1'] &&
              variant['option2'] === this.currentVariant['option2'] &&
              variant
          )),
            (availableVariantExists3 = this.variantProduct.some(
              (variant) =>
                variant['option3'] === value3 &&
                variant['option1'] === this.currentVariant['option1'] &&
                variant['option2'] === this.currentVariant['option2'] &&
                variant['available']
            ));
          if (this.type == 'button') {

            const optionsArray = Array.from(productOptions);
            const optionValue = optionsArray[valueIndex].querySelector('.productOption');
            if (optionValue) {
              optionValue.parentElement.classList.toggle('hidden', !combinationExists3);
              optionValue.classList.toggle('not-available', !availableVariantExists3);
            }
          } else {
            const optionValue = Array.from(selector.querySelectorAll('.productOption option'))[valueIndex];
            if (optionValue) {
              optionValue.classList.toggle('hidden', !combinationExists3);
              optionValue.toggleAttribute('disabled', !availableVariantExists3);
            }
          }
        });
      });
    });
  }
}
customElements.define('variants-set', Variants);

class QuantitySet extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true });
    this.input.addEventListener('change', this.inputChangeHandler.bind(this));

    this.querySelector('[button-plus]').addEventListener('click', this.onClickplus.bind(this));
    this.querySelector('[button-minus]').addEventListener('click', this.onClickminus.bind(this));
  }

  inputChangeHandler(event) {
    this.validateQtyRules();
  }

  onClickplus(event) {
    event.preventDefault();
    const previousValue = this.input.value;
    this.input.stepUp();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }
  onClickminus(event) {
    event.preventDefault();
    const previousValue = this.input.value;
    this.input.stepDown();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }

  validateQtyRules() {
    const value = parseInt(this.input.value);
    if (this.input.min) {
      const min = parseInt(this.input.min);
      const buttonDecresae = this.querySelector("[name='decrease']");
      buttonDecresae.classList.toggle('disabled', value <= min);
    }
    if (this.input.max) {
      const max = parseInt(this.input.max);
      const buttonIncrease = this.querySelector("[name='increase']");
      buttonIncrease.classList.toggle('disabled', value >= max);
    }
  }
}
customElements.define('quantity-set', QuantitySet);

class DragElement extends HTMLElement {
  constructor() {
    super();
    if (!this.querySelector('[data-cursor]')) return false;
    this.cursor = this.querySelector('[data-cursor]');
    this.imageComparison(this.cursor);
  }

  imageComparison(cursor) {
    if (!cursor.offsetParent) {
      return false;
    }
    let layout = '';
    let active = false;
    const parentSection = cursor.closest('.shopify-section');
    const parentWrapper = cursor.closest('[data-parent-wrapper]');
    const imagWrapper = parentSection.querySelector('[data-parent-wrapper]');
    cursor.addEventListener('mousedown', function () {
      active = true;
      imagWrapper.classList.remove('animating');
      parentSection.classList.add('scrolling');
    });

    parentSection.addEventListener('mouseup', function () {
      active = false;
      parentSection.classList.remove('scrolling');
      imagWrapper.classList.add('animating');
    });

    parentSection.addEventListener('mouseleave', function () {
      active = false;
      parentSection.classList.remove('scrolling');
      imagWrapper.classList.add('animating');
    });

    // parentWrapper.addEventListener(
    //   'click',
    //   function (e) {
    //     layout = parentSection.querySelector('[data-parent-wrapper]').getAttribute('data-layout');
    //     let bounding = parentSection.getBoundingClientRect();
    //     const event = (e.touches && e.touches[0]) || e;
    //     let x = layout ? event.pageX - (bounding.left + window.scrollX) : event.pageY - (bounding.top + window.scrollY);

    //     this.scrollIt(x, layout, parentSection);
    //   }.bind(this)
    // );
    parentSection.addEventListener(
      'mousemove',
      function (e) {
        if (!active) return;
        if (
          parentSection.querySelector('[data-parent-wrapper]') &&
          parentSection.querySelector('[data-parent-wrapper]').getAttribute('data-layout') === 'horizontal'
        ) {
          layout = parentSection.querySelector('[data-parent-wrapper]').getAttribute('data-layout');
        }
        let bounding = parentSection.getBoundingClientRect();
        const event = (e.touches && e.touches[0]) || e;
        let x = layout ? event.pageX - (bounding.left + window.scrollX) : event.pageY - (bounding.top + window.scrollY);
        this.scrollIt(x, layout, parentSection);
      }.bind(this)
    );

    cursor.addEventListener('touchstart', function () {
      active = true;
      imagWrapper.classList.remove('animating');
      parentSection.classList.add('scrolling');
    });

    cursor.addEventListener('touchend', function () {
      active = false;
      parentSection.classList.remove('scrolling');
      imagWrapper.classList.add('animating');
    });

    document.addEventListener('touchleave', function () {
      active = false;
      parentSection.classList.remove('scrolling');
      imagWrapper.classList.add('animating');
    });
    parentSection.addEventListener(
      'touchmove',
      function (e) {
        if (!active) return;
        if (parentSection.querySelector('[data-parent-wrapper]')) {
          layout = parentSection.querySelector('[data-parent-wrapper]').getAttribute('data-layout');
        }
        let bounding = parentSection.getBoundingClientRect();
        const event = (e.touches && e.touches[0]) || e;
        let x = layout ? event.pageX - (bounding.left + window.scrollX) : event.pageY - (bounding.top + window.scrollY);
        this.scrollIt(x, layout, parentSection);
      }.bind(this)
    );
  }

  scrollIt(x, layout, parentSection) {
    const distance = layout
      ? parentSection.querySelector('[data-parent-wrapper]').clientWidth
      : parentSection.querySelector('[data-parent-wrapper]').clientHeight;
    const max = distance - 20;
    const min = 20;
    const mouseX = Math.max(min, Math.min(x, max));
    const mousePercent = (mouseX * 100) / distance;
    parentSection.querySelector('[data-parent-wrapper]').style.setProperty('--percent', mousePercent + '%');
  }
}
customElements.define('drag-element', DragElement);


 
class ScrollObserver {
  constructor() {
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll);
    this.targetY = 0;
    this.currentY = 0;
    this.currentScrollTop = 0;
  }

  handleScroll() {
    document.querySelectorAll('section').forEach((section) => {
      if (isOnScreen(section)) {
        if (section.classList.contains('section-before-after')) {
          setTimeout(() => {
            // section.classList.add('section-in-view');
            if (section.querySelector('[data-parent-wrapper]')) {
              if (section.querySelector('[data-parent-wrapper]').classList.contains('animating')) return;
              section.querySelector('[data-parent-wrapper]').classList.add('animating');
              setTimeout(() => {
                // section.querySelector('[data-parent-wrapper]').classList.remove('animating');
                const percent = section.querySelector('[data-parent-wrapper]').getAttribute('data-percentage-value');
                section.querySelector('[data-parent-wrapper]').style.setProperty('--percent', `${percent}%`);
              }, 1000);
            }
          }, 1000);
        }
        setTimeout(() => {
          if (section.querySelector('variety-heading')) {
            if (section.querySelector('.outline--filled')) {
              section.querySelectorAll('.outline--filled').forEach((item) => {
                item.classList.add('outline-animate');
              });
            }
          }

          if (section.classList.contains('section-in-view')) return;
          section.classList.add('section-in-view');

          section.querySelectorAll('video').forEach(function (video) {
            if (video.hasAttribute('autoplay')) {
              video.play();
            }
          });
          if (section.classList.contains('section-media-gallery')) {
            const mediaWraper = section.querySelector('[data-media-gallery]');
            if (mediaWraper) {
              if (
                mediaWraper.classList.contains('media-gallery-text-visibility-time-delay') ||
                mediaWraper.classList.contains('media-gallery-text-visibility-delay-and-disappear')
              ) {
                const delayDuration = mediaWraper.getAttribute('data-delay-duration');
                const delayAndDisappear = mediaWraper.getAttribute('data-disappear-duration');
                const mediaItems = mediaWraper.querySelectorAll('[data-media-item]');
                const delayTime = parseInt(delayDuration) * 1000;
                const disappearTime = parseInt(delayAndDisappear) * 1000;
                setTimeout(() => {
                  mediaItems.forEach((item) => {
                    if (item) {
                      item.classList.add('media-gallery-content-show');
                    }
                  });
                  if (mediaWraper.classList.contains('media-gallery-text-visibility-delay-and-disappear')) {
                    setTimeout(() => {
                      mediaItems.forEach((item) => {
                        if (item) {
                          item.classList.remove('media-gallery-content-show');
                        }
                      });
                    }, disappearTime);
                  }
                }, delayTime);
              }
            }
          }
        }, 500);
      } else {
        section.classList.remove('section-in-view');
        if (section) {
          section.querySelectorAll('video').forEach(function (video) {
            video.pause();
          });

          section.querySelectorAll('.youtube-video').forEach((video) => {
            video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
          });
          section.querySelectorAll('.vimeo-video').forEach((video) => {
            video.contentWindow.postMessage('{"method":"pause"}', '*');
          });

          /*if (
            section &&
            section.querySelector('product-model') &&
            !section.querySelector('product-model').classList.contains('shopify-model-viewer-ui__disabled')
          ) {
            section?.querySelector('product-model')?.pauseModel();
          }*/

          // Ensure the product-model element exists and has the pauseModel method
          const productModelElement = section.querySelector('product-model');
          if (
            productModelElement &&
            productModelElement instanceof HTMLElement && // Ensure it's an HTML element
            productModelElement.classList.contains('shopify-model-viewer-ui__disabled') === false &&
            typeof productModelElement.pauseModel === 'function' // Check if pauseModel is a valid function
          ) {
            productModelElement.pauseModel();
          }
        }

        // section.classList.remove('media-cards-animate');
      }
    });

    const headerSection = document.querySelector('[data-header-section]');
    if (headerSection) {
      if (headerSection.classList.contains('sticky-none')){
         const headerSectionHeight = headerSection.offsetHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const dynamicHeight = scrollTop > headerSectionHeight ? 0 : Math.max(headerSectionHeight - scrollTop, 0);

      document.body.style.setProperty('--dynamic_header_height', `${dynamicHeight}px`);

      this.currentScrollTop = scrollTop;
      }
    }
  }
}
let scrollObserver = new ScrollObserver();

class ImageOverlayText extends HTMLElement {
  constructor() {
    super();
    this.parent = this.closest('[data-content-wrapper]');
    this.addEventListener('mousemove', this.showContent.bind(this));
    this.section = this.closest('.shopify-section');
    this.wrapper = this.closest('[data-content-wrapper]');
    if (this.wrapper) {
      this.wrapper.addEventListener(
        'mousemove',
        function () {
          if (this.wrapper.classList.contains('active')) return;
          const currentActive = this.section.querySelector('[data-content-wrapper].active');
          if (currentActive) {
            currentActive.classList.remove('active');
          }
          this.wrapper.classList.add('active');
        }.bind(this)
      );
    }
    if (this.marquee) {
      this.setMarqueeSpeed();
    }
  }

  showContent() {
    if (this.classList.contains('active')) return false;
    if (this.parent.querySelector('.featured-collections-list--content-inner.active')) {
      this.parent.querySelector('.featured-collections-list--content-inner.active').classList.remove('active');
    }
    this.classList.add('active');
    this.activeImage = this.parent.querySelector('.featured-collections-list--image-inner.active');
    this.currentElementImage = this.parent.querySelector(`[data-image-id=${this.dataset.id}]`);
    if (this.currentElementImage) {
      if (this.activeImage) {
        this.activeImage.classList.remove('active');
      }
      this.currentElementImage.classList.add('active');
    }
  }

  setMarqueeSpeed() {
    this.marqueeSpeed = parseInt(this.marquee.dataset.marqueeSpeed) || 5;
    this.node = this.marquee.querySelector('[data-marquee-node]');
    if (this.node) {
      const resizeObserver = new ResizeObserver(this.calculateSpeed.bind(this));
      resizeObserver.observe(this);
    }
  }
  calculateSpeed() {
    if (window.innerWidth > 1024) {
      const containerHeight = this.offsetHeight;
      const nodeHeight = this.node.offsetHeight;
      const distance = nodeHeight + containerHeight;
      const duration = this.marqueeSpeed * distance;

      this.style.setProperty('--animation_speed', `${duration}ms`);
    } else {
      const containerWidth = this.offsetWidth;
      const nodeWidth = this.node.offsetWidth;
      const distance = nodeWidth + containerWidth;
      const duration = this.marqueeSpeed * distance;

      this.style.setProperty('--animation_speed', `${duration}ms`);
    }
  }
}
customElements.define('image-overlay-text', ImageOverlayText);

class HighlightedProducts extends HTMLElement {
  connectedCallback() {
    Array.from(this.querySelectorAll('[data-product-card]')).map((productCard) => {
      productCard.addEventListener('mouseover', this.handleMouseOver.bind(this, productCard));
    });
  }

  handleMouseOver(productCard) {
    const productId = productCard.dataset.id;
    const hoveredItem = productCard.closest('section').querySelector(`[data-product-item="${productId}"]`);
    Array.from(productCard.closest('section').querySelectorAll('[data-product-item]')).map((item) => {
      item.classList.replace('active', 'hidden');
    });
    if (this.dataset.fixedItem && hoveredItem) {
      hoveredItem.classList.replace('hidden', 'active');
    }
  }
}

customElements.define('highlighted-products', HighlightedProducts);

class CountdownFacet extends HTMLElement {
  constructor() {
    super();
    this.init_countdown();
  }

  init_countdown() {
    this.targetDate = new Date(this.getAttribute('data-countdown-input')).getTime();
    this.timer_labels = {
      days: this.querySelector('[data-days]'),
      hours: this.querySelector('[data-hours]'),
      minutes: this.querySelector('[data-minutes]'),
      seconds: this.querySelector('[data-seconds]'),
    };
    this.interval = setInterval(() => this.timerCountFunc(this.targetDate), 1000);
  }

  timerCountFunc(targetDate) {
    const dateNow = new Date().getTime();
    const remainingTime = targetDate - dateNow;
    if (remainingTime <= 0) {
      const mainElement = this.closest('.shopify-section');

      if (this.getAttribute('data-timeout-style') == 'show') {
        mainElement.querySelector('[data-message]').classList.remove('hidden');
        mainElement.querySelector('counter-facet').style.display = 'none';
      }
      if (this.getAttribute('data-timeout-style') == 'hide') {
        mainElement.querySelector('counter-facet').style.display = 'none';
      }
      return;
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    this.timer_labels.days.innerHTML = days;
    this.timer_labels.hours.innerHTML = hours;
    this.timer_labels.minutes.innerHTML = minutes;
    this.timer_labels.seconds.innerHTML = seconds;
  }
}

customElements.define('counter-facet', CountdownFacet);

class OverlayContainer extends HTMLElement {
  constructor() {
    super();

    this.init();
  }
  init() {
    fetch(`${window.routes.cart_url}?section_id=cart-drawer`)
      .then((response) => response.text())
      .then((responseText) => {
        const sectionCartDrawer = new DOMParser()
          .parseFromString(responseText, 'text/html')
          .querySelector('.shopify-section');
      })
      .catch((e) => {
        console.log('something went wrong!');
      });
  }
}
customElements.define('overlay-container', OverlayContainer);

class StoreLocator extends HTMLElement {
  constructor() {
    super();
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
  }
}
customElements.define('store-locator', StoreLocator);

class ExpandSet extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('mouseover', this.onMouseOverHandler.bind(this));
  }
  onMouseOverHandler() {
    if (this.classList.contains('active')) return;
    Array.from(this.closest('section').querySelectorAll('expand-set')).map((item) => {
      item.classList.remove('active');
    });
    this.classList.add('active');
  }
}
customElements.define('expand-set', ExpandSet);

class Hotspot extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.blockid = event.currentTarget.dataset.hotspot;
      this.open(this.blockid);
    });

    this.addEventListener('mouseover', this.onActionOver.bind(this));
    this.addEventListener('mouseleave', this.onActionLeave.bind(this));
  }
  open(blockid) {
    if (document.querySelector('[data-drawer="shop-the-look-drawer-' + blockid + '"]')) {
      setTimeout(() => {
        document.querySelector('[data-drawer="shop-the-look-drawer-' + blockid + '"]').classList.add('show');
        document.body.classList.add('overflow-hidden');
      }, 400);
      setTimeout(() => {
        document.querySelector('[data-drawer="shop-the-look-drawer-' + blockid + '"]').classList.add('shadow');
      }, 800);
      document.querySelector('[data-drawer="shop-the-look-drawer-' + blockid + '"]').style.display = 'flex';
      const element = document.querySelector('[data-drawer="shop-the-look-drawer-' + blockid + '"]');
      if (element.querySelector('video')) {
        element.querySelector('video').play();
      }
    }
  }
  onActionOver() {
    if (this.classList.contains('active-drawer')) return;
    this.classList.add('hover-drawer');
  }
  onActionLeave() {
    this.classList.remove('hover-drawer');
  }
}
customElements.define('hot-spot', Hotspot);

class SwingText extends HTMLElement {
  constructor() {
    super();
    var direction = parseInt(this.dataset.direction);

    this.defaultOptions = {
      radius: direction === 1 ? 700 : 900,
      dir: direction,
      letterSpacing: 0,
      animation: {
        duration: 6,
        onComplete: function () { },
      },
    };
    this.options = this.defaultOptions;
    this.letters = [];
    this.splitchars = '';
    this.length = 11;
    this.chars = this.dataset.text;
    this.splitchars += '<div class="BackgroundText-inner" data-split-text="" >';
    for (this.i = 0; this.i < this.length; this.i++) {
      if (this.chars[this.i]) {
        let currentChar = this.chars[this.i];
        if (typeof currentChar === 'string') {
          const trimmedChar = currentChar.trim();
          if (trimmedChar === '') {
            currentChar = '&nbsp;';
          }
        }
        this.splitchars += '<span  class="char">' + currentChar + '</span>';
      }
    }
    this.splitchars += '</div>';
    this.innerHTML = this.splitchars;

    this.init();

    //this.helo();
  }

  init() {
    this.$letters = this.querySelectorAll('span');
    this.letters = [];
    for (let i = 0; i < this.$letters.length; i++) {
      this.letters.push({ el: this.$letters[i] });
    }

    this.calc();
    this.rotateWord();
  }
  outerWidth(el) {
    const style = getComputedStyle(el);
    return el.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
  }
  calc() {
    if (this.options.radius === -1) return false;
    this.calcBase();
    this.calcLetters();
  }
  calcBase() {
    this.dtWord = 0;
    this.letters.forEach((letter, index) => {
      const width = this.outerWidth(letter.el);
      this.dtWord += width;
      this.letters[index].center = this.dtWord - width / 2;
      this.letters[index].width = width;
    });
    const e = this.dtWord / 2;
    if (this.options.radius < e) this.options.radius = e;
    this.dtArcBase = this.dtWord;
    const r = 2 * Math.asin(this.dtArcBase / (2 * this.options.radius));
    this.dtArc = this.options.radius * r;
  }
  calcLetters() {
    let e = 0;
    this.letters.forEach((letter, index) => {
      this.outer = ((letter.width / this.dtWord) * this.dtArc) / this.options.radius;
      this.cen = this.options.radius * Math.cos(this.outer / 2);
      this.leng = Math.acos((this.dtWord / 2 - e) / this.options.radius) + this.outer / 2;
      this.dia = Math.cos(this.leng) * this.cen;
      this.far = Math.sin(this.leng) * this.cen;
      this.heighh = e + Math.abs(this.dtWord / 2 - this.dia - e);
      this.mdo = 0 | (this.heighh - letter.center);
      this.vlo = 0 | (this.options.radius - this.far);
      this.yaxis = 0 | (-Math.asin(this.dia / this.options.radius) * (180 / Math.PI));
      e = 2 * this.heighh - e;
      this.letters[index].x = this.mdo - (this.letters.length / 2 - index);
      this.letters[index].y = this.options.dir === 1 ? this.vlo : -this.vlo;
      this.letters[index].a = this.options.dir === 1 ? this.yaxis : -this.yaxis;
    });
  }
  rotateWord() {
    const l =
      this.options.dir === 1
        ? Math.max(...this.letters.map((letter) => letter.y))
        : Math.min(...this.letters.map((letter) => letter.x));
    this.letters.forEach((letter) => {
      if (this.options.dir === 1) {
        letter.y = letter.y - l;
      } else {
        letter.y = letter.y;
      }

      letter.el.style.transition = `transform ${this.options.animation.duration}s ${this.options.animation.ease || 'ease-in-out'
        }`;

      letter.el.style.transform = `translate3d(${letter.x}px, ${letter.y}px,0px) rotate(${letter.a}deg)`;
    });

    setTimeout(() => {
      this.letters.forEach((letter) => {
        letter.el.style.transition = `transform ${this.options.animation.duration}s ${this.options.animation.ease || 'ease-in-out'
          }`;
        letter.el.style.transform = `translate3d(${0}px, ${0}px,0px) rotate(${0}deg)`;
      });

      setTimeout(() => {
        this.animateLoop();
      }, this.options.animation.duration * 500);
    }, this.options.animation.duration * 500);
  }
  animateLoop() {
    const self = this;
    const direction = this.options.dir === 1 ? 'down' : 'up';
    this[direction]({
      onComplete: 'loop',
    });
  }

  up(t) {
    this.ease = this.options.animation.ease;
    this.duration = this.options.animation.duration;
    this.onComplete = t.onComplete;

    this.set({
      radius: this.options.radius,
      letterSpacing: this.options.letterSpacing,
      dir: this.options.dir,
      animation: {
        ease: this.ease,
        duration: this.duration,
        onComplete: function () {
          if (this.onComplete) {
            this.onComplete === 'loop' ? this.animateLoop() : this.onComplete();
          }
        },
      },
    });
  }
  down(t) {
    this.ease = this.options.animation.ease;
    this.duration = this.options.animation.duration;
    this.onComplete = t.onComplete;

    this.set({
      radius: -1,
      letterSpacing: 0,
      dir: this.options.dir,
      animation: {
        ease: this.ease,
        duration: this.duration,
        onComplete: function () {
          if (this.onComplete) {
            this.onComplete === 'loop' ? this.animateLoop() : this.onComplete();
          }
        },
      },
    });
  }
  onResize() {
    this.calc();
    this.rotateWord();
  }
  set(options) {
    this.options = Object.assign({}, this.options, options);
    this.calc();
    this.rotateWord();
  }
}
customElements.define('swing-text', SwingText);

class TrendingSet extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('mouseover', this.onMouseOverHandler.bind(this));
    this.closest('[data-trending-wrapper]').addEventListener('mouseleave', this.onMouseOutHandler.bind(this));

    this.description_height();

    const resizeObserver = new ResizeObserver(() => this.description_height());
    resizeObserver.observe(this.querySelector('[data-content-item]'));

    this.swatches = this.querySelectorAll('[data-product-swatche-item]');
    this.swatches.forEach((item) => item.addEventListener('mouseover', this.onSwatchChange.bind(this)));
  }
  onSwatchChange(event) {
    let activeLi = event.currentTarget.dataset.id;
    if (!activeLi) return;

    const activeItem = this.querySelector('[data-trending-media].active');
    if (activeItem) {
      activeItem.classList.remove('active');
      activeItem.classList.add('processing');
      setTimeout(() => {
        activeItem.classList.remove('processing');
      }, 400);
    }
    this.trendingMedia = this.querySelectorAll('[data-trending-media]');
    this.trendingMedia.forEach((item) => {
      item.classList.add('hidden');
    });

    const featuredMedia = this.querySelector(`[data-media-id=product-${activeLi}]`);
    featuredMedia.classList.remove('hidden');
    if (featuredMedia) {
      featuredMedia.classList.add('active');
    }
    // this.querySelectorAll('[data-trending-media]').forEach((item) => {
    //   if (item.classList.contains('active'))
    //   {
    //     item.style.zIndex = '3';
    //   }else{
    //     item.style.zIndex = '1';
    //   }
    //});
  }
  description_height() {
    Array.from(this.querySelectorAll('[data-content-item]')).map((content_item) => {
      this.style.setProperty('--desc-height', `${content_item.getBoundingClientRect().height}px`);
    });
  }
  onMouseOverHandler() {
    if (this.classList.contains('is-deployed')) return false;

    Array.from(this.closest('section').querySelectorAll('trending-set')).map((item) => {
      item.classList.remove('is-deployed', 'is-retracted');

      if (this.dataset.column != item.getAttribute('data-column')) {
        item.classList.add('is-retracted');
      }
    });
    this.classList.add('is-deployed');
  }

  onMouseOutHandler() {
    Array.from(this.closest('section').querySelectorAll('trending-set')).map((item) => {
      item.classList.remove('is-deployed', 'is-retracted');
    });
  }
}
customElements.define('trending-set', TrendingSet);

function animateValue(id, start, end, duration) {
  let range = end - start;
  let current = start;
  //let obj = document.querySelector('[data-pop-circle]');
  let obj = id;
  let starttime;
  let fn = (ms) => {
    let progress = 0;
    if (starttime === undefined) {
      starttime = ms;
    } else {
      progress = ms - starttime;
      if (progress >= duration) {
        // current = end.toLocaleString()  + ' ' + progress + 'ms';
        current = end;
      } else {
        current = start + Math.floor((progress / duration) * range);
      }
    }
    // obj.innerHTML = current.toLocaleString();
    // obj.style.transform = `scale(${current})`;
    obj.style.transform = `translate3d(${current}px, 0px, 0px) rotate(-0.3092deg)`;
    if (progress < duration) {
      requestAnimationFrame(fn);
    }
  };
  requestAnimationFrame(fn);
}

class ImageTextAccordion extends HTMLElement {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.imagesMain = this.querySelector('[data-attr]');
    this.itemList = this.querySelectorAll('[accordion-menu-list]');
    this.imagesList = this.querySelectorAll('[accordion-menu-images]');
    this.imagesCount = this.imagesList.length;
    if (this.imagesCount > 3) {
      this.imagesMain.style.position = 'sticky';
    }

    this.itemList.forEach((item) => item.addEventListener('mouseover', this.onHover.bind(this)));
    this.updateNextClassOnHover();
    this.updatePrevClass();
  }

  onHover(event) {
    this.imagesList.forEach((item) => item.classList.remove('active'));
    this.itemList.forEach((item) => {
      item.classList.remove('active');
      this.itemList[0].classList.add('active');
    });

    event.currentTarget.classList.add('active');
    const index = parseInt(event.currentTarget.getAttribute('data-index'));
    const correspondingImage = this.querySelector(
      `.images-text-accordion--image-list-inner-wrapper[data-index="${index}"]`
    );
    if (correspondingImage) {
      correspondingImage.classList.add('active');
    }

    this.updateNextClassOnHover();
    this.updatePrevClass();
  }

  updateNextClassOnHover() {
    this.imagesList.forEach((item) => item.classList.remove('next-1', 'next-2', 'next-3', 'prev'));

    let nextIndex = 0;
    const activeIndex = Array.from(this.imagesList).findIndex((item) => item.classList.contains('active'));
    if (activeIndex !== -1) {
      for (let i = 1; i <= 3; i++) {
        nextIndex = (activeIndex + i) % this.imagesList.length;
        this.imagesList[nextIndex].classList.add('next-' + i);
      }
    }
  }

  updatePrevClass() {
    const activeIndex = Array.from(this.imagesList).findIndex((item) => item.classList.contains('active'));
    if (activeIndex !== -1) {
      let prevIndex = (activeIndex - 1 + this.imagesList.length) % this.imagesList.length;
      this.imagesList[prevIndex].classList.add('prev');
    }
  }
}
customElements.define('images-text-accordion', ImageTextAccordion);

class BestSellingProducts extends HTMLElement {
  constructor() {
    super();
    this.expandBtn = this.querySelector('[data-expand-btn]');
    if (this.expandBtn) {
      this.expandBtn.addEventListener('click', this.show.bind(this));
    }
    this.collapseBtn = this.querySelector('[data-collapse-btn]');
    if (this.collapseBtn) {
      this.collapseBtn.addEventListener('click', this.hide.bind(this));
    }
  }
  show() {
    this.classList.add('text-hide');
    setTimeout(
      function () {
        this.classList.add('active');
      }.bind(this),
      500
    );
  }
  hide(e) {
    e.preventDefault();
    this.classList.remove('active');
    setTimeout(
      function () {
        this.classList.remove('text-hide');
      }.bind(this),
      500
    );
  }
}

customElements.define('best-selling-products', BestSellingProducts);

class Accordion {
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector('summary');

    this.content = el.querySelector('[data-accordion-content]') || el.querySelector('[data-collapsible-content]');
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();
    this.el.style.overflow = 'hidden';
    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    this.isClosing = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    if (this.content) {
      this.content.style.opacity = '0';
    }
    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: 'linear',
      }
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);

    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    const openDetails = this.el.parentElement.querySelector('details[open]');
    if (openDetails && openDetails !== this.el) {
      const accordionInstance = openDetails._accordionInstance;
      if (accordionInstance) {
        accordionInstance.shrink();
      }
    }
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;

    this.el._accordionInstance = this;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    if (this.content) {
      this.content.style.opacity = '1';
    }
    this.isExpanding = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;
    if (this.animation) {
      this.animation.cancel();
    }
    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: 'linear',
      }
    );

    this.animation.onfinish = () => this.onAnimationFinish(true);

    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = this.el.style.overflow = '';
  }
}
if (!customElements.get('product-form-context')) {
  customElements.define(
    'product-form-context',
    class ProductForm extends HTMLElement {
      constructor() {
        super();
        this.section = this.closest('section');
        this.form = this.querySelector('form');
        this.form.querySelector('[name=id]').disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        if (this.section.querySelector('[data-sticky-buy-button]')) {
          this.stickyBuyButton = this.section.querySelector('[data-sticky-buy-button]');
        }
        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.querySelector('[data-add-cart-error]')) {
          this.querySelector('[data-add-cart-error]').classList.add('hidden');
          this.querySelector('[data-add-cart-error]').innerHTML = '';
        }

        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        // this.querySelector('[data-atc-loader]').classList.remove('hidden');
        this.querySelector('[data-add-to-cart]').innerHTML += atcLoaderSVG;
        this.querySelector('[data-atc-text]').classList.add('hidden');
        if (this.stickyBuyButton) {
          // this.stickyBuyButton.innerHTML += atcLoaderSVG;
          this.stickyBuyButton.innerHTML += atcLoaderSVG;
          this.stickyBuyButton.querySelector('[data-atc-text]').classList.add('hidden');
        }

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);

        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.section)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        for (var pair of formData.entries()) {
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cart_error, {
                source: 'product-form-context',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              if (this.querySelector('[data-add-cart-error]')) {
                this.querySelector('[data-add-cart-error]').classList.remove('hidden');
                if (response.errors) {
                  if (response.email) {
                    this.querySelector('[data-add-cart-error]').innerHTML = response.errors.email;
                  }
                  if (response.errors.send_on) {
                    this.querySelector('[data-add-cart-error]').innerHTML = response.errors.send_on;
                  }
                } else if (response.description) {
                  this.querySelector('[data-add-cart-error]').innerHTML = response.description;
                }
              }
              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButton.querySelector('span').classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            if (!this.error) {
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form-context',
                productVariantId: formData.get('id'),
                cartData: response,
              });
              this.error = false;

              if (this.closest('quick-view-drawer')) {
                this.closest('quick-view-drawer').querySelector('[data-drawer-close]').click();
              }

              const header = document.querySelector('[data-header-section]');
              if (header && header.dataset.headerView == 'half-width-menu') {
                if (header.dataset.headerStickyType == 'sticky-scroll-up' && header.classList.contains('is-hidden')) {
                  header.classList.remove('is-hidden');
                } else if (header.dataset.headerStickyType == 'sticky-none') {
                  header.classList.add('sticky-always');
                }
              }

              this.cart.renderContents(response);
              setTimeout(() => {
                this.cart.querySelector('[data-drawer-close]').focus();
              }, 200);
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            // this.querySelector('[data-atc-loader]').classList.add('hidden');
            this.querySelector('[data-atc-loader]').remove();
            this.querySelector('[data-atc-text]').classList.remove('hidden');
            if (this.stickyBuyButton) {
              // this.stickyBuyButton.querySelector('[data-atc-loader]').classList.add('hidden');
              this.stickyBuyButton.querySelector('[data-atc-loader]').remove();
              this.stickyBuyButton.querySelector('[data-atc-text]').classList.remove('hidden');
            }
          });
      }
    }
  );
}
class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('product-recommendations');
          setTimeout(() => {
            ScrollTrigger.refresh();
            ScrollTrigger.sort();
          }, 1000);
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;

          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    new IntersectionObserver(handleIntersection.bind(this), { rootMargin: '0px 0px 400px 0px' }).observe(this);

  }
}

customElements.define('product-recommendations', ProductRecommendations);
class MapElement extends HTMLElement {
  static get observedAttributes() {
    return ['data-location', 'data-map-style'];
  }

  constructor() {
    super();
    this.map = null;
    this.marker = null;
    this.mapLoaded = false;
  }

  connectedCallback() {
    this.initMap();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.mapLoaded) {
      this.updateMap();
    }
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
  }

  initMap() {
    if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      this.loadGoogleMapsApi().then(() => {
        this.mapLoaded = true;
        this.createMap();
      });
    } else {
      this.mapLoaded = true;
      this.createMap();
    }
  }

  loadGoogleMapsApi() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapApiKey}&libraries=marker`;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }

  createMap() {
    const mapAddress = this.getAttribute('data-location');
    const mapStyle = this.getAttribute('data-map-style');
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: mapAddress }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const options = {
          zoom: 17,
          center: results[0].geometry.location,
          mapId: 'roadmap',
          // styles: this.getMapStyle(mapStyle),
          // mapTypeId: 'roadmap',
          // keyboardShortcuts: false,
        };

        this.map = new google.maps.Map(this, options);
        // this.marker = new google.maps.Marker({
        //   map: this.map,
        //   position: results[0].geometry.location,
        // });
        const styledMapType = new google.maps.StyledMapType(this.getMapStyle(mapStyle));
        this.map.mapTypes.set('styled_map', styledMapType);
        this.map.setMapTypeId('styled_map');
        this.marker = new google.maps.marker.AdvancedMarkerElement({
          map: this.map,
          position: results[0].geometry.location,
        });

        this.handleResize = () => {
          google.maps.event.trigger(this.map, 'resize');
          this.map.setCenter(results[0].geometry.location);
        };
        window.addEventListener('resize', this.handleResize);
      }
    });
  }

  updateMap() {
    if (this.map && this.marker) {
      const mapAddress = this.getAttribute('data-location');
      const mapStyle = this.getAttribute('data-map-style');
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: mapAddress }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          this.closest('[data-gmap-error]').classList.add(hidden);
          this.map.setCenter(location);
          this.marker.setPosition(location);
          this.map.setOptions({ styles: this.getMapStyle(mapStyle) });
        } else {
          this.closest('[data-gmap-error]').classList.remove(hidden);
          //console.e('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }

  getMapStyle(mapStyle) {
    const styles = {
      night: [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      ],
      dark: [
        { elementType: 'geometry', stylers: [{ color: '#212121' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      ],
      silver: [
        { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#bdbdbd' }],
        },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
        { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
        { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
        { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
        { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
        { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
      ],
      retro: [
        { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
        { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#dcd2be' }],
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#ae9e90' }],
        },
        { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#93817c' }] },
        { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
        { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#447530' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
        { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e9bc62' }] },
        { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#e98d58' }] },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#db8555' }],
        },
        { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#806b63' }] },
        { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'transit.line', elementType: 'labels.text.fill', stylers: [{ color: '#8f7d77' }] },
        { featureType: 'transit.line', elementType: 'labels.text.stroke', stylers: [{ color: '#ebe3cd' }] },
        { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#92998d' }] },
      ],
      aubergine: [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      ],
    };

    return styles[mapStyle] || [];
  }
}

customElements.define('map-element', MapElement);

class AnimateWow {
  constructor() {
    this.wow = new WOW({
      boxClass: 'wow', // animated element css class (default is wow)
      animateClass: 'animated', // animation css class (default is animated)
      offset: 50, // distance to the element when triggering the animation (default is 0)
      mobile: true, // trigger animations on mobile devices (default is true)
      live: true, // act on asynchronously loaded content (default is true)
      scrollContainer: null, // optional scroll container selector, otherwise use window,
      resetAnimation: true, // reset animation on end (default is true)
    });
    this.wow.init();
  }
}
// new AnimateWow();



class SplitSplider extends HTMLElement {
  constructor() {
    super();

    this.id = this.dataset.sectionid;
    this.up = document.querySelector(`.swiper-button-prev-${this.id}`);
    this.down = document.querySelector(`.swiper-button-next-${this.id}`);
    this.counter = 1;

    this.up.addEventListener('click', () => {
      this.currentSlide = this.querySelector('.selected');
      this.moveUp(this.currentSlide);
    });

    this.down.addEventListener('click', () => {
      this.currentSlide = document.querySelector('.selected');
      this.moveDown(this.currentSlide);
    });
  }

  moveUp(currentSlide) {
    this.prevSlide = currentSlide.previousElementSibling;
    this.currentSlideUp = currentSlide.querySelector('[split-slider-image]');
    this.currentSlideDown = currentSlide.querySelector('[split-slider-contents]');
    this.prevSlideUp = this.prevSlide.querySelector('[split-slider-contents]');
    this.prevSlideDown = this.prevSlide.querySelector('[split-slider-image]');

    if (this.prevSlide !== null) {
      this.counter = this.counter - 1;

      if (window.innerWidth > 786) {
        // For desktop, translate along the Y-axis
        if (this.counter % 2 === 0) {
          this.currentSlideUp.style.transform = 'translateY(-100%)';
          this.currentSlideDown.style.transform = 'translateY(100%)';
        } else {
          this.currentSlideUp.style.transform = 'translateY(100%)';
          this.currentSlideDown.style.transform = 'translateY(-100%)';
        }

        this.prevSlideUp.style.transform = 'translateY(0%)';
        this.prevSlideDown.style.transform = 'translateY(0%)';
      }

      this.currentSlide.classList.remove('selected');
      this.prevSlide.classList.add('selected');

      // Enable the down button if there is a next slide
      this.down.classList.remove('disabled');
    } else {
      // Disable the up button if there is no previous slide
      this.up.classList.add('disabled');
    }
  }

  moveDown(currentSlide) {
    this.nextSlide = currentSlide.nextElementSibling;
    this.currentSlideUp = currentSlide.querySelector('[split-slider-contents]');
    this.currentSlideDown = currentSlide.querySelector('[split-slider-image]');
    this.nextSlideUp = this.nextSlide.querySelector('[split-slider-image]');
    this.nextSlideDown = this.nextSlide.querySelector('[split-slider-contents]');

    if (this.nextSlide !== null) {
      this.counter = this.counter + 1;

      if (window.innerWidth > 786) {
        // For desktop, translate along the Y-axis
        if (this.counter % 2 === 0) {
          this.currentSlideUp.style.transform = 'translateY(-100%)';
          this.currentSlideDown.style.transform = 'translateY(100%)';
        } else {
          this.currentSlideUp.style.transform = 'translateY(100%)';
          this.currentSlideDown.style.transform = 'translateY(-100%)';
        }

        this.nextSlideUp.style.transform = 'translateY(0%) matrix(1, 0, 0, 1, 0, 0)';
        this.nextSlideDown.style.transform = 'translateY(0%) matrix(1, 0, 0, 1, 0, 0)';
      }

      this.currentSlide.classList.remove('selected');
      this.nextSlide.classList.add('selected');

      // Enable the up button if there is a previous slide
      this.up.classList.remove('disabled');
    } else {
      // Disable the down button if there is no next slide
      this.down.classList.add('disabled');
    }
  }
}
customElements.define('split-slider', SplitSplider);

class CountryProvince extends HTMLElement {
  constructor() {
    super();
    this.provinceElement = this.querySelector('[name="address[province]"]');
    this.countryElement = this.querySelector('[name="address[country]"]');
    this.countryElement.addEventListener('change', this.CountryChange.bind(this));

    const defaultCountry = this.countryElement.getAttribute('data-default');

    if (defaultCountry) {
      const selectedIndex = Array.from(this.countryElement.options).findIndex(
        (option) => option.value === defaultCountry
      );
      this.countryElement.selectedIndex = selectedIndex !== -1 ? selectedIndex : 0;
      this.countryElement.dispatchEvent(new Event('change'));
    } else {
      this.CountryChange();
    }
  }

  CountryChange() {
    const option = this.countryElement.options[this.countryElement.selectedIndex];
    const provinces = JSON.parse(option.dataset.provinces);
    this.provinceElement.parentElement.hidden = provinces.length === 0;

    if (provinces.length !== 0) {
      this.provinceElement.innerHTML = '';
      provinces.forEach((data) => {
        const selected = data[1] === this.dataset.province;
        this.provinceElement.options.add(new Option(data[1], data[0], selected, selected));
      });
    }
  }
}
customElements.define('country-province', CountryProvince);

class ShippingCalculator extends HTMLElement {
  constructor() {
    super(), this._setupCountries();
    this.submitButton = this.querySelector('[type="submit"]');
    this.resultsElement = this.querySelector('[data-shipping-result]');
    this.submitButton.addEventListener('click', this.handleFormSubmit.bind(this));
  }
  handleFormSubmit(event) {
    event.preventDefault();
    const zip = this.querySelector('[name="address[zip]"]').value;
    const country = this.querySelector('[name="address[country]"]').value;
    const province = this.querySelector('[name="address[province]"]').value;
    const body = JSON.stringify({
      shipping_address: {
        zip,
        country,
        province,
      },
    });

    let sectionUrl = `${routes.cart_url}/shipping_rates.json`;
    sectionUrl = sectionUrl.replace('//', '/');

    fetch(sectionUrl, {
      ...fetchConfig(),
      ...{ body },
    })
      .then((response) => response.json())
      .then((parsedState) => {
        parsedState.shipping_rates
          ? this.formatShippingRates(parsedState.shipping_rates)
          : this.formatError(parsedState);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        (this.resultsElement.hidden = !1), this.submitButton.removeAttribute('aria-busy');
      });
  }

  formatShippingRates(shippingRates) {
    const shippingRatesList = shippingRates.map((rate) => {
      const { presentment_name, currency, price } = rate;
      return `<p class="form--message success">${presentment_name}: ${currency} ${price}</p>`;
    });

    this.resultsElement.innerHTML = `${shippingRatesList.join('')}`;
    this.resultsElement.classList.remove('hidden');
  }

  formatError(errors) {
    const errorMessages = Object.values(errors)
      .map((error) => `<p class="form--message error">${error}</p>`)
      .join('');
    this.resultsElement.innerHTML = `${errorMessages}`;
    this.resultsElement.classList.remove('hidden');
  }

  _setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      new Shopify.CountryProvinceSelector('[shippingCountry]', '[shippingProvince]', {
        hideElement: '[shippingProvince]',
      });
    }
  }
}
customElements.define('shipping-calculator', ShippingCalculator);

class GiftWrapping extends HTMLElement {
  constructor() {
    super();
    this.giftWrapId = this.dataset.giftWrapId;
    this.giftWrapsInCart = parseInt(this.getAttribute('gift-wraps-in-cart'));
    this.itemInCart = parseInt(this.getAttribute('item-in-cart'));
    (this.cartItemsSize = parseInt(this.getAttribute('cart-items-size'))),
      (this.itemsInCart = parseInt(this.getAttribute('items-in-cart')));

    if (this.cartItemsSize == 1 && this.giftWrapsInCart > 0) return this.removeGiftWrap();

    const debouncedOnChange = debounce(this.onChange.bind(this), 10);
    this.addEventListener('change', debouncedOnChange);

    if (this.giftWrapsInCart === 1) {
      this.hideGiftWrappingSection();
    }
  }

  onChange(event) {
    if (event.target.checked) {
      this.setAttribute('gift-wraps-in-cart', '1');
      this.addGiftWrap();
    }
  }

  addGiftWrap() {
    const body = JSON.stringify({
      updates: {
        [this.giftWrapId]: this.itemInCart,
      },
      sections:
        this.getAttribute('gift-template') === 'cart'
          ? this.getcartSectionsToRender().map((section) => section.section)
          : this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    this.fetchGiftWrap(body);
    if (this.giftWrapsInCart === 1) {
      this.hideGiftWrappingSection();
    }
  }
  removeGiftWrap() {
    const body = JSON.stringify({
      updates: {
        [this.giftWrapId]: 0,
      },
      sections:
        this.getAttribute('gift-template') === 'cart'
          ? this.getcartSectionsToRender().map((section) => section.section)
          : this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });
    this.fetchGiftWrap(body);
  }

  fetchGiftWrap(body) {
    fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => response.text())
      .then((state) => {
        const parsedState = JSON.parse(state);

        const sectionsToRender =
          this.getAttribute('gift-template') === 'cart' ? this.getcartSectionsToRender() : this.getSectionsToRender();

        if (this.getAttribute('gift-template') === 'cart') {
          sectionsToRender.forEach((section) => {
            const elementToReplace =
              document.getElementById(section.id).querySelector(section.selector) ||
              document.getElementById(section.id);
            elementToReplace.innerHTML = this.getSectionInnerHTML(
              parsedState.sections[section.section],
              section.selector
            );
            const cartHtml = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
            const chtml = new DOMParser().parseFromString(cartHtml, 'text/html');

            const shippingBar = chtml.querySelector('[data-cart-shipping]').getAttribute('data-barwidth');
            setTimeout(() => {
              shippingconversion();
              //document.getElementById(section.id).style.setProperty('--progress_width', shippingBar);
            }, 400);
          });
        } else {
          this.getSectionsToRender().forEach((section) => {
            const elementToReplace =
              document.getElementById(section.id).querySelector(section.selector) ||
              document.getElementById(section.id);
            const cartHtml = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
            const html = new DOMParser().parseFromString(cartHtml, 'text/html');
            const drawerContentD = elementToReplace.querySelector('[data-cart-drawer-content]');
            const drawerContentS = html.querySelector('[data-cart-drawer-content]');

            if (drawerContentS && drawerContentD) {
              drawerContentD.innerHTML = '';
              drawerContentD.innerHTML = drawerContentS.innerHTML;
            }

            const drawerbodyD = elementToReplace.querySelector('[data-cart-drawer-body]');
            const drawerbodyS = html.querySelector('[data-cart-drawer-body]');

            if (drawerbodyS && drawerbodyD) {
              drawerbodyD.innerHTML = '';
              drawerbodyD.innerHTML = drawerbodyS.innerHTML;
            }

            const drawerheaderD = elementToReplace.querySelector('[data-cart-drawer-header]');
            const drawerheaderS = html.querySelector('[data-cart-drawer-header]');

            if (drawerheaderS && drawerheaderD) {
              drawerheaderD.innerHTML = '';
              drawerheaderD.innerHTML = drawerheaderS.innerHTML;
            }
            if (html.querySelector('[data-cart-shipping]')) {
              const shippingBar = html.querySelector('[data-cart-shipping]').getAttribute('data-barwidth');
              setTimeout(() => {
                //document.getElementById(section.id).style.setProperty('--progress_width', shippingBar);
                shippingconversion();
              }, 400);
            }
          });
        }

        this.hideGiftWrappingSection();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  hideGiftWrappingSection() {
    document.querySelector('[gift-wrapping-section]').style.display = 'none';
  }

  getSectionsToRender() {
    return [
      {
        id: 'cartdrawer',
        section: document.querySelector('[cart-drawer]').dataset.id,
        selector: '[cart-drawer]',
      },
    ];
  }

  getcartSectionsToRender() {
    return [
      {
        id: 'main-cart',
        section: document.querySelector('[data-cart-wrapper]').dataset.id,
        selector: '.main--cart-render',
      },
    ];
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }
}

customElements.define('gift-wrapping', GiftWrapping);

class ProductMedia extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest('section');
    if (this.section.querySelector('[data-product-layout]').getAttribute('data-product-layout') == 'layout_1' || this.section.querySelector('[data-product-layout]').getAttribute('data-product-layout') == 'layout_3') {
      // this.handleMediaPlay();
    }

    if (this.dataset.mediaLayout) {
      if (this.dataset.mediaLayout == 'thumbnails') {
        this.id = this.dataset.id;
        this._initThumbnailsSize();
        const resizeObserver = new ResizeObserver(() => this._initThumbnailsSize());
        resizeObserver.observe(this.querySelector(`[data-product-media="main-media-${this.id}"]`));
      }
    }
  }
  _initThumbnailsSize() {
    const slideItem = this.querySelector(`[data-product-media="main-media-${this.id}"] [data-media-id]`);
    if (slideItem) {
      setTimeout(() => {
        this.mainItemheight = slideItem.getBoundingClientRect().height;
        this.thumbmedia = this.querySelector(`[data-product-media="main-thumb-${this.id}"] ul`);
        this.thumbmedia.style.setProperty('--thumb_height', `${this.mainItemheight}px`);
      }, 400);
    }
  }

  handleMediaPlay() {
    this.addEventListener('mouseover', (e) => {
      setTimeout(() => {
        this.section.querySelector('swiper-content')?._startAutoplay();
      }, 200);
    });

    this.addEventListener('mouseout', (e) => {
      setTimeout(() => {
        this.section.querySelector('swiper-content')?._stopAutoplay();
      }, 200);
    });
  }
}
customElements.define('product-media', ProductMedia);

class Quickview extends HTMLElement {
  constructor() {
    super();
    this.selector = '[data-drawer="quick-view-drawer"]';
    this.drawer = document.querySelector(this.selector);
    if (!this.drawer) return;
    this.data_close_drawer = this.drawer.querySelector('[data-drawer-close]');
    this.addEventListener('click', this.onClick.bind(this));
    (this.magnetButton = new theme.MagnetButton(this.drawer)), this.magnetButton.onKeyDown();
  }

  onClick(event) {
    event.preventDefault();
    // this.querySelector('[data-atc-loader]').classList.remove('hidden');
    this.querySelector('.quick--view-icon').classList.add('hidden');
    this.querySelector('[product-quickview-btn]').innerHTML += atcLoaderSVG;
    this.fetchProduct();
  }

  open() {
    if (this.drawer) {
      setTimeout(() => {
        this.drawer.classList.add('show');
        document.body.classList.add('overflow-hidden');
      }, 200);
      setTimeout(() => {
        this.drawer.classList.add('shadow');
        this.data_close_drawer.tabIndex = 0;
        this.drawer.querySelector('[data-drawer-close]').focus();
      }, 600);
      this.drawer.style.display = 'flex';
    }
  }

  fetchProduct() {
    const sectionId = this.drawer.dataset.sectionId;
    const sectionUrl = `${this.dataset.productUrl}?section_id=${sectionId}`;

    fetch(sectionUrl)
      .then((response) => response.text())
      .then((responseText) => {
        const productElement = new DOMParser().parseFromString(responseText, 'text/html').querySelector(this.selector);

        if (productElement) {
          this.drawer.innerHTML = productElement.innerHTML;

          // Reinitialize payment buttons if necessary
          if (window.Shopify && Shopify.PaymentButton) {
            Shopify.PaymentButton.init();
          }
          this.querySelector('[data-atc-loader]').remove();
          this.querySelector('.quick--view-icon').classList.remove('hidden');
          this.open();
          window.ProductModel.loadShopifyXR();
        } else {
          console.info('Product element not found in the fetched content.');
        }
      })
      .catch((error) => {
        console.info('Error fetching or parsing product content:', error);
      });
  }
}
customElements.define('quick-view', Quickview);

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}
const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  // removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (event.target !== container && event.target !== last && event.target !== first) return;

    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if ((event.target === container || event.target === first) && event.shiftKey) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  if (elementToFocus) {
    elementToFocus.focus();

    if (
      elementToFocus.tagName === 'INPUT' &&
      ['search', 'text', 'email', 'url'].includes(elementToFocus.type) &&
      elementToFocus.value
    ) {
      elementToFocus.setSelectionRange(0, elementToFocus.value.length);
    }
  }
}

class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
      this.closest(`[id="cart-product-item-${this.dataset.index}"]`).classList.add('zoom');
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.setHeaderCartIconAccessibility();
    this.setUpCartButtonListeners();

    document.body.addEventListener(
      'click',
      function (e) {
        let outside_status = true;
        if (e.target == this || e.target.closest('cart-drawer')) {
          outside_status = false;
        }
        if (
          e.target == document.querySelector('list-set[data-source="cart-drawer"]') ||
          e.target.closest('list-set[data-source="cart-drawer"]')
        ) {
          outside_status = false;
        }
        if (outside_status && this.classList.contains('show')) {
          this.querySelector('[data-drawer-close]').click();
        }
      }.bind(this)
    );
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('[data-source="cart-drawer"]');
    if (!cartLink) return;
    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  setUpCartButtonListeners() {
    const cartButtons = document.querySelectorAll('[data-cart-toggle]');
    cartButtons.forEach((cartButton) => {
      cartButton.addEventListener('click', (event) => {
        cartButton.parentElement.classList.toggle('active');
        event.preventDefault();
        this.toggleWrapper(event);
      });
    });

    const cartRemoveButtons = document.querySelectorAll('[data-cart-remove]');
    cartRemoveButtons.forEach((removeButton) => {
      removeButton.addEventListener('click', (event) => {
        removeButton.parentElement.classList.toggle('active');
        event.preventDefault();
        this.toggleWrapper(event);
      });
    });
  }

  toggleWrapper(event) {
    const id = event.currentTarget.getAttribute('data-toggle-id');
    const noteWrapper = document.querySelector(`[data-cart-note-wrapper="${id}"]`);
    noteWrapper.classList.toggle('active');
    if (noteWrapper.classList.contains('active')) {
      noteWrapper.style.maxHeight = noteWrapper.scrollHeight + 'px';
    } else {
      noteWrapper.style.maxHeight = null;
    }
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);

    requestAnimationFrame(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('[data-cart-drawer-body]').classList.remove('is-empty');

    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const elementToReplace =
        document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
      elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
      const cartHtml = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
      const html = new DOMParser().parseFromString(cartHtml, 'text/html');
      const cartCount = html.querySelector('[data-cart-items]');
      if (cartCount) {
        const cartItems = cartCount.dataset.cartItems;
        if (cartItems == 0 || cartItems == '0' || cartItems == '') {
          document.querySelector('[data-cart-count]').classList.add('hidden');
          document.querySelector('[data-cart-count]').textContent = '';
        } else if (parseInt(cartItems) > 99) {
          document.querySelector('[data-cart-count]').classList.remove('hidden');
          document.querySelector('[data-cart-count]').classList.add('large-items');
          document.querySelector('[data-cart-count]').textContent = '';
        } else {
          document.querySelector('[data-cart-count]').classList.remove('hidden', 'large-items');
          document.querySelector('[data-cart-count]').textContent = cartItems;
        }
      }
      if (html.querySelector('[data-cart-shipping]')) {
        const shippingBar = html.querySelector('[data-cart-shipping]').getAttribute('data-barwidth');
        setTimeout(() => {
          //document.getElementById(section.id).style.setProperty('--progress_width', shippingBar);
          shippingconversion();
        }, 400);
      }
      this.setUpCartButtonListeners();
    });

    setTimeout(() => {
      const cartLink = document.querySelector('[data-source="cart-drawer"]');
      this.open();
      setTimeout(() => {
        document.querySelector(`[cart-drawer-section]`).classList.add('show');
        document.body.classList.add('overflow-hidden');
      }, 400);
      setTimeout(() => {
        document.querySelector(`[cart-drawer-section]`).classList.add('shadow');
      }, 600);
      document.querySelector(`[cart-drawer-section]`).style.display = 'flex';
    }, 1200);

    requestAnimationFrame(() => {
      const drawer = this.querySelector('[data-drawer]');
      if (drawer) {
        drawer.classList.remove('show');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => {
          drawer.style.display = 'none';
        }, 1000);
      }
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: document.querySelector('[cart-drawer-section]').dataset.id,
        selector: '.side-drawer',
      },
    ];
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartNote extends HTMLElement {
  constructor() {
    super(),
      this.addEventListener(
        'input',
        debounce((event) => {
          const body = JSON.stringify({ note: event.target.value });
          fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
        }, 300)
      );
  }
}
customElements.define('cart-note', CartNote);

class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement =
      document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');
    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 10);

    this.changeImg = this.querySelectorAll('[data-line-item]');
    this.imagesList = document.querySelectorAll('[data-cart-right-image]');

    this.changeImg.forEach((item) => item.addEventListener('mouseover', this.onHoverchangeImage.bind(this)));

    this.addEventListener('change', debouncedOnChange.bind(this));
  }
  onChange(event) {
    const inputValue = parseInt(event.target.value);
    const index = event.target.dataset.index;
    let message = '';

    if (message) {
      document.getElementById(`Line-item-error-${index}`).textContent = message;
      return;
    } else {
      this.updateQuantity(
        event.target.dataset.index,
        event.target.value,
        document.activeElement.getAttribute('name'),
        event.target.dataset.quantityVariantId
      );
    }
  }
  getSectionsToRender() {
    return [
      {
        id: 'main-cart',
        section: document.querySelector('[data-cart-wrapper]').dataset.id,
        selector: '.main--cart-render',
      },
      // {
      //   id: 'cart-count-icon',
      //   section: 'cart-count-icon',
      //   selector: '.shopify-section',
      // },
    ];
  }
  updateQuantity(line, quantity, name, variantId) {
    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        if (parsedState.errors) {
          if (this.querySelector(`[data-cart-error-${line}]`)) {
            this.querySelector(`[data-cart-error-${line}]`).classList.remove('hidden');
            this.querySelector(`[data-cart-error-${line}]`).textContent = parsedState.errors;
            const lineQty = this.querySelector(`.quantity-input[data-index="${line}"]`);
            if (lineQty) {
              lineQty.value = lineQty.dataset.previousValue;
            }
          }
        }
        const quantityElement =
          document.getElementById(`Quantity-${line}`) || document.getElementById(`cart-product-item-${line}`);
        const items = document.querySelectorAll('.cart-items');

        this.classList.toggle('is-empty', parsedState.item_count === 0);
        const cartDrawerWrapper = document.querySelector('cart-drawer');
        const cartFooter = document.getElementById('main-cart-footer');

        if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
        if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

        this.getSectionsToRender().forEach((section) => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          elementToReplace.innerHTML = this.getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          );

          const cartHtml = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
          const chtml = new DOMParser().parseFromString(cartHtml, 'text/html');
          const cartCount = chtml.querySelector('cart-remove-button');
          if (cartCount) {
            const cartItems = cartCount.dataset.count;
            if (cartItems == 0 || cartItems == '0' || cartItems == '') {
              document.querySelector('[data-cart-count]').classList.add('hidden');
              document.querySelector('[data-cart-count]').textContent = '';
            } else if (parseInt(cartItems) > 99) {
              document.querySelector('[data-cart-count]').classList.remove('hidden');
              document.querySelector('[data-cart-count]').classList.add('large-items');
              document.querySelector('[data-cart-count]').textContent = '';
            } else {
              document.querySelector('[data-cart-count]').classList.remove('hidden', 'large-items');
              document.querySelector('[data-cart-count]').textContent = cartItems;
            }
            this.querySelector(`[data-index="${line}"]`).setAttribute(
              'data-previous-value',
              this.querySelector(`[data-index="${line}"]`).value
            );
          } else {
            document.querySelector('[data-cart-count]').classList.add('hidden');
            document.querySelector('[data-cart-count]').textContent = '';
          }
          if (chtml.querySelector('[data-cart-shipping]')) {
            const shippingBar = chtml.querySelector('[data-cart-shipping]').getAttribute('data-barwidth');
            setTimeout(() => {
              shippingconversion();
              //document.getElementById(section.id).style.setProperty('--progress_width', shippingBar);
            }, 400);
          }
        });
      })
      .catch(() => {
        // if (this.querySelector(`[data-cart-error-${line}]`)) {
        //   const previousCartValue = this.querySelector(`[data-index="${line}"]`).dataset.previousValue;
        //   this.querySelector(`[data-cart-error-${line}]`).classList.remove('hidden');
        //   this.querySelector(`[data-cart-error-${line}]`).textContent = window.cartStrings.error;
        //   this.querySelector(`[data-index="${line}"]`).value = previousCartValue;
        // }
      })
      .finally(() => { });
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  onHoverchangeImage(event) {
    this.index = event.currentTarget.getAttribute('data-product-id');
    this.correspondingImage = document.querySelector(`.right-side-image[data-image-id="${this.index}"]`);
    if (this.correspondingImage) {
      if (this.correspondingImage.classList.contains('active')) return;
      this.imagesList.forEach((item) => item.classList.remove('active'));
      this.correspondingImage.classList.add('active');
    }
  }
}
customElements.define('cart-items', CartItems);

class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.setupEventListeners();

    if (this.input) {
      this.input.addEventListener(
        'input',
        this.debounce((event) => {
          this.onChange(event);
        }, 300).bind(this)
      );
    }
  }

  setupEventListeners() {
    document.body.addEventListener(
      'click',
      function (e) {
        let outside_status = true;
        if (e.target == document.querySelector('search-drawer') || e.target.closest('search-drawer')) {
          outside_status = false;
        }
        if (
          e.target == document.querySelector('list-set[data-source="search-drawer"]') ||
          e.target.closest('list-set[data-source="search-drawer"]')
        ) {
          outside_status = false;
        }
        if (outside_status && document.querySelector('search-drawer').classList.contains('show')) {
          document.querySelector('search-drawer').querySelector('[data-drawer-close]').click();
        }
      }.bind(this)
    );
  }

  debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase();
    fetch(`${routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&section_id=search-drawer`)
      .then((response) => {
        if (!response.ok) {
          console.log('error');
        }
        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('[data-search-results]').innerHTML;
        document.querySelector('[data-search-results]').innerHTML = resultsMarkup;
        if (document.querySelector('[data-search-terms]')) {
          document.querySelector('[data-search-terms]').classList.add('hidden');
        }
      })
      .catch((error) => {
        if (error?.code === 20) {
          return;
        }
        throw error;
      });
  }

  clearSearch() {
    document.querySelector('[data-search-input]').value = '';
    document.querySelector('[data-search-results]').innerHTML = '';
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    const newSearchTerm = this.getQuery();
    if (newSearchTerm == '') {
      this.clearSearch();
      if (document.querySelector('[data-search-terms]')) {
        document.querySelector('[data-search-terms]').classList.remove('hidden');
      }
    } else {
      document.querySelector('[data-search-results]').innerHTML = `<div class="search-loader text-center"> <svg
        width="40"
        height="40"
        style="shape-rendering: auto; animation-play-state: running; animation-delay: 0s; background: none;"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle cx="50" cy="50" fill="none" stroke="#d9e2ed" stroke-width="6" r="35"
            stroke-dasharray="164.93361431346415 56.97787143782138"
            style="animation-play-state: running; animation-delay: 0s;"
            transform="rotate(115.597 50 50)">
            <animateTransform attributeName="transform" type="rotate" calcMode="linear"
                values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s"
                repeatCount="indefinite">
            </animateTransform>
        </circle>
      </svg></div>`;
      this.searchTerm = newSearchTerm;
      this.getSearchResults(this.searchTerm);
    }
  }
}

customElements.define('predictive-search', PredictiveSearch);

class CartDrawerItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement =
      document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');
    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 10);

    this.addEventListener('change', debouncedOnChange.bind(this));
  }
  onChange(event) {
    this.updateQuantity(
      event.target.dataset.index,
      event.target.value,
      document.activeElement.getAttribute('name'),
      event.target.dataset.quantityVariantId
    );
  }
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: document.querySelector('[cart-drawer-section]').dataset.id,
        selector: '.side-drawer',
      },
      // {
      //   id: 'cart-count-icon',
      //   section: 'cart-count-icon',
      //   selector: '.shopify-section',
      // },
    ];
  }
  updateQuantity(line, quantity, name, variantId) {
    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        if (parsedState.errors) {
          if (this.querySelector(`[data-cart-error-${line}]`)) {
            this.querySelector(`[data-cart-error-${line}]`).classList.remove('hidden');
            this.querySelector(`[data-cart-error-${line}]`).textContent = parsedState.errors;
            const lineQty = this.querySelector(`.quantity-input[data-index="${line}"]`);
            if (lineQty) {
              lineQty.value = lineQty.dataset.previousValue;
            }
          }
        }
        const quantityElement =
          document.getElementById(`Quantity-${line}`) || document.getElementById(`cart-product-item-${line}`);
        const items = document.querySelectorAll('.cart-items');

        this.classList.toggle('is-empty', parsedState.item_count === 0);
        const cartDrawerWrapper = document.querySelector('cart-drawer');
        const cartFooter = document.getElementById('main-cart-footer');

        if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
        if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

        this.getSectionsToRender().forEach((section) => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          const cartHtml = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
          const html = new DOMParser().parseFromString(cartHtml, 'text/html');

          const drawerbodyD = elementToReplace.querySelector('[data-cart-drawer-body]');
          const drawerbodyS = html.querySelector('[data-cart-drawer-body]');

          if (drawerbodyS && drawerbodyD) {
            drawerbodyD.innerHTML = '';
            drawerbodyD.innerHTML = drawerbodyS.innerHTML;
          }

          const drawerheaderD = elementToReplace.querySelector('[data-cart-drawer-header]');
          const drawerheaderS = html.querySelector('[data-cart-drawer-header]');

          if (drawerheaderS && drawerheaderD) {
            drawerheaderD.innerHTML = '';
            drawerheaderD.innerHTML = drawerheaderS.innerHTML;
          }

          const drawerContentD = elementToReplace.querySelector('[data-cart-drawer-content]');
          const drawerContentS = html.querySelector('[data-cart-drawer-content]');
          if (drawerContentS == null) {
            elementToReplace.innerHTML = this.getSectionInnerHTML(
              parsedState.sections[section.section],
              section.selector
            );
            document.querySelector('[data-cart-count]').classList.add('hidden');
            document.querySelector('[data-cart-count]').textContent = '';
          } else {
            drawerContentD.innerHTML = '';
            drawerContentD.innerHTML = drawerContentS.innerHTML;
            const cartCount = html.querySelector('[data-cart-items]');
            if (cartCount) {
              const cartItems = cartCount.dataset.cartItems;
              if (cartItems == 0 || cartItems == '0' || cartItems == '') {
                document.querySelector('[data-cart-count]').classList.add('hidden');
                document.querySelector('[data-cart-count]').textContent = '';
              } else if (parseInt(cartItems) > 99) {
                document.querySelector('[data-cart-count]').classList.remove('hidden');
                document.querySelector('[data-cart-count]').classList.add('large-items');
                document.querySelector('[data-cart-count]').textContent = '';
              } else {
                document.querySelector('[data-cart-count]').classList.remove('hidden', 'large-items');
                document.querySelector('[data-cart-count]').textContent = cartItems;
              }
              this.querySelector(`[data-index="${line}"]`).setAttribute(
                'data-previous-value',
                this.querySelector(`[data-index="${line}"]`).value
              );
            }
          }
          if (html.querySelector('[data-cart-shipping]')) {
            const shippingBar = html.querySelector('[data-cart-shipping]').getAttribute('data-barwidth');
            setTimeout(() => {
              shippingconversion();
              //document.getElementById(section.id).style.setProperty('--progress_width', shippingBar);
            }, 400);
          }
        });
      })
      .catch(() => { })
      .finally(() => { });
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }
}
customElements.define('cart-drawer-items', CartDrawerItems);

class Productqueryform extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.blockid = event.currentTarget.dataset.queryform;
      this.open(this.blockid);

      (this.magnetButton = new theme.MagnetButton(
        document.querySelector(`[data-drawer="product-query--drawer-${this.blockid}"] [data-drawer-panel]`)
      )),
        this.magnetButton.onKeyDown();
    });
    if (document.querySelector('[data-contact-message]')) {
      this.blokID = this.dataset.queryform;
      this.open(this.blokID);
    }
  }
  open(blockid) {
    if (document.querySelector('[data-drawer="product-query--drawer-' + blockid + '"]')) {
      setTimeout(() => {
        document.querySelector('[data-drawer="product-query--drawer-' + blockid + '"]').classList.add('show');
        document.body.classList.add('overflow-hidden');
      }, 400);
      setTimeout(() => {
        document.querySelector('[data-drawer="product-query--drawer-' + blockid + '"]').classList.add('shadow');
        document
          .querySelector('[data-drawer="product-query--drawer-' + blockid + '"]')
          .querySelector('[data-drawer-close]')
          .focus();
      }, 800);
      document.querySelector('[data-drawer="product-query--drawer-' + blockid + '"]').style.display = 'flex';
    }
  }
}
customElements.define('product-query-form', Productqueryform);

class BlogReadMore extends HTMLElement {
  constructor() {
    super();
    this.init();
  }
  init() {
    const readMoreElement = this;
    const originalWidth = readMoreElement.style.width;
    readMoreElement.style.width = 'auto';
    requestAnimationFrame(() => {
      const width = readMoreElement.getBoundingClientRect().width;
      readMoreElement.style.width = originalWidth;
      this.closest('[data-blog-readmore]').style.setProperty('--text-width', `${width}px`);
    });
  }
}
customElements.define('blog-read-more', BlogReadMore);

class MarqueeOnScroll extends HTMLElement {
  constructor() {
    super();
    this.element = this.querySelector('.marquee--block-node-inner');
    this.desktopSpeed = parseInt(this.dataset.marqueeSpeedDesktop);
    this.mobileSpeed = parseInt(this.dataset.marqueeSpeedMobile);
    if (this.element) {
      window.addEventListener('scroll', this.onScrollHandler.bind(this));
    }
  }
  onScrollHandler() {
    const marqueeElement = this.element;
    const marqueeParent = this;
    const position = marqueeParent.getBoundingClientRect();
    const elementPosition = marqueeElement.getBoundingClientRect();
    const Elewidth = position.width;
    if (isOnScreen(this)) {
      let speed = this.desktopSpeed;
      if (window.innerWidth < 768 && this.mobileSpeed) {
        speed = this.mobileSpeed;
      }
      if (marqueeParent.classList.contains('rtl-direction')) {
        var marqueepsoition = -(Elewidth / 2) + elementPosition.top;
        marqueeElement.style.transform = `translate3d(${(marqueepsoition / speed) * 10}px, 0px, 0px)`;
      } else {
        var marqueepsoition = Elewidth / 2 - elementPosition.top;
        marqueeElement.style.transform = `translate3d(${(marqueepsoition / speed) * 10}px, 0px, 0px)`;
      }
    }
  }
}
customElements.define('marquee-on-scroll', MarqueeOnScroll);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.loadYouTubeAPI();
    this.mp4VideoReady();
    this.interval = setInterval(() => {
      if (window.ytApiLoaded) {
        clearInterval(this.interval);
        if (this.classList.contains('autoplay-status-false')) {
          let loadBtn;
          if (this.dataset.playBehaviour === 'floated') {
            loadBtn = this.closest('.shopify-section').querySelector('[data-video-play-button]');
          } else {
            loadBtn = this.closest('.shopify-section').querySelector('[data-play-button]');
          }
          loadBtn.addEventListener('click', this.loadContent.bind(this));
        } else {
          this.addObserver();
        }
        this.videoPlayInit();
        this.onYouTubeIframeAPIReady();
      }
    }, 500);
    window.addEventListener('scroll', this.scrollEvent.bind(this));
  }

  addObserver() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadContent();
            observer.unobserve(this);
          }
        });
      },
      { rootMargin: '0px 0px 1000px 0px' }
    );
    observer.observe(this);
  }

  loadContent() {
    if (!this.querySelector('template')) return false;
    const content = this.querySelector('template').content.firstElementChild.cloneNode(true);
    this.appendChild(content);
    if (this.dataset.type === 'youtube') {
      this.onYouTubeIframeAPIReady();
    }
    if (this.querySelector('video') && this.querySelector('video').hasAttribute('data-autoplay')) {
      this.querySelector('video').play();
      const parent = this.closest('.shopify-section');
      const parentWrapper = parent.querySelector('[data-video-main-wrapper]');
      const videoStatus = parentWrapper.querySelector('[data-autoplay]').dataset.autoplay;

      const contentVisibility = parentWrapper.querySelector('[data-content-visibility]')?.dataset.contentVisibility;

      if (contentVisibility && contentVisibility === 'hidden' && videoStatus) {
        if (parentWrapper) {
          parentWrapper.querySelector('[data-content-visibility]').style.display = 'none';
        }
      }
      this.closest('.shopify-section').classList.add('video-started');
    }
  }

  loadYouTubeAPI() {
    if (!window.ytApiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onload = () => {
        window.ytApiLoaded = true;
      };
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  scrollEvent() {
    if (!isOnScreen(this)) {
      if (this.querySelector('video') && !this.querySelector('video').hasAttribute('autoplay')) {
        this.querySelector('video').pause();
      }
      if (
        this.querySelector('.youtube_video,.youtube-video') &&
        this.querySelector('.youtube_video,.youtube-video').hasAttribute('data-autoplay') &&
        this.querySelector('.youtube_video,.youtube-video').getAttribute('data-autoplay') === 'false'
      ) {
        this.querySelector('.youtube_video,.youtube-video').contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        );
      }

      if (
        this.querySelector('.vimeo_video,.vimeo-video') &&
        this.querySelector('.vimeo_video,.vimeo-video').hasAttribute('data-autoplay') &&
        this.querySelector('.vimeo_video,.vimeo-video').getAttribute('data-autoplay') === 'false'
      ) {
        this.querySelector('.vimeo_video,.vimeo-video').contentWindow.postMessage('{"method":"pause"}', '*');
      }
    }
  }

  videoPlayInit() {
    this.videodatawrapper = this.closest('.section-video');
    if (!this.dataset.playBehaviour) return;
    if (this.dataset.playBehaviour === 'floated') {
      this.playButtons = this.videodatawrapper.querySelectorAll('[data-video-play-button]');
    } else {
      this.playButtons = this.videodatawrapper.querySelectorAll('[data-play-button]');
    }

    const parent = this.closest('.shopify-section');
    const parentWrapper = parent.querySelector('[data-video-main-wrapper]');

    const videoStyle = parentWrapper.querySelector('video');
    const iframeStyle = parentWrapper.querySelector('iframe');

    const videoWrapper = parentWrapper.querySelector('[data-content-wrapper]');
    const videoMobileWrapper = parentWrapper.querySelector('[data-mobile-content-button]');
    const videoThumbnail = parentWrapper.querySelector('[data-video-overlay]');
    const contentVisibility = parentWrapper.querySelector('[data-content-visibility]')?.dataset.contentVisibility;
    if (this.playButtons.length > 0) {
      if (parentWrapper) {
        this.playButtons.forEach((button) => {
          button.addEventListener('click', (event) => {
            event.preventDefault();

            if (contentVisibility === 'hidden') {
              if (videoWrapper) {
                videoWrapper.style.display = 'none';
              }
            }
            if (videoThumbnail) {
              videoThumbnail.style.display = 'none';
            }

            if (videoStyle) {
              videoStyle.style.display = 'block';
              videoStyle.play();
              button.closest('.shopify-section').classList.add('video-started');
            } else if (iframeStyle) {
              iframeStyle.style.display = 'block';
            }
            if (this.dataset.playBehaviour === 'floated') {
              parentWrapper.querySelector('.king_animted').style.display = 'none';
              videoMobileWrapper.style.display = 'none';
            } else {
              videoMobileWrapper.style.display = 'none';
              videoWrapper.querySelector('[data-content-button]').classList.remove('d-md-block');
              videoWrapper.querySelector('[data-content-button]').style.display = 'none';
            }
          });
        });
      }
    }
    if (contentVisibility === 'hidden') {
      if (videoWrapper) {
        videoWrapper.style.display = 'none';
      }
    }
  }

  onYouTubeIframeAPIReady() {
    if (typeof YT !== 'undefined' && YT.Player) {
      const youtubeVideo = this.querySelector('.youtubeVideo');
      if (youtubeVideo) {
        const divId = youtubeVideo.getAttribute('id');
        const vidId = youtubeVideo.getAttribute('data-id');
        if (divId && vidId) {
          const player = new YT.Player(divId, {
            videoId: vidId,
            playerVars: {
              showinfo: 0,
              controls: 0,
              fs: 0,
              rel: 0,
              height: '100%',
              width: '100%',
              iv_load_policy: 3,
              html5: 1,
              loop: 1,
              autoplay: 1,
              playsinline: 1,
              modestbranding: 1,
              disablekb: 1,
              wmode: 'opaque',
            },
            events: {
              onReady: (event) => this.onYouTubePlayerReady(event),
              onStateChange: (event) => this.onYouTubePlayerStateChange(event),
            },
          });
          if (player.playVideo && !this.querySelector('video[data-video-image-wrapper]')) {
            player.playVideo();
            this.closest('.shopify-section').classList.add('video-started');
          }
          return;
        }
      }
    } else {
      console.warn('YouTube IFrame API is not loaded or YT object is not available.');
    }
  }

  onYouTubePlayerReady(event) {
    event.target.mute();
    event.target.playVideo();
    this.closest('.shopify-section').classList.add('video-started');
  }

  onYouTubePlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      event.target.playVideo();
      this.closest('.shopify-section').classList.add('video-started');
    } else {
      this.closeVideoMedia();
    }
  }

  mp4VideoReady() {
    document.querySelectorAll('video').forEach((video) => {
      video.onplay = () => {
        this.closeVideoMedia();
      };
    });
  }

  vimeoVideoReady(section = document) {
    section.querySelectorAll('.sr-vimeo-video').forEach((video) => {
      let divId = video.getAttribute('id');
      let player = new Vimeo.Player(divId);
      player.on('play', () => {
        section.closest('.shopify-section').classList.add('video-started');
        this.closeVideoMedia();
      });
    });
  }

  closeVideoMedia() {
    // Your implementation to close video media
  }
}

customElements.define('deferred-media-video', DeferredMedia);

class CustomDropdown extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      parent: this.closest('[data-custom-dropdown-wrapper]'),
      button: this.querySelector('[data-dropdown-button]'),
      panel: this.querySelector('[data-dropdown-content]'),
      wrapper: this.querySelector('[data-horizontal-wrapper]'),
    };

    this.scrollStep = 100; // Set the scroll step to 40 pixels
    this.wrapper = null;
    this.leftArrow = null;
    this.rightArrow = null;

    if (this.elements.button) {
      this.elements.button.addEventListener('click', this.togglePanel.bind(this));
    }
    // if (this.elements.panel) {
    //   this.elements.panel.addEventListener('focusout', this.closePanel.bind(this));
    // }

    document.body.addEventListener(
      'click',
      function (event) {
        if (event.target != this && !this.contains(event.target)) {
          if (this.classList.contains('active')) {
            this.hidePanel();
          }
        }
      }.bind(this)
    );
    this.addEventListener('keyup', this.onKeyUp.bind(this));
    if (this.dataset.desktopOnly != undefined) {
      window.addEventListener(
        'resize',
        function () {
          if (window.innerWidth > 766) {
            this.classList.remove('active');
            this.elements.panel.style.display = 'none';
          } else {
            this.elements.panel.style.display = 'block';
          }
        }.bind(this)
      );
    }
    this.dropDownMenuPositions();
    this.offsetForDropDown();
    const resizeObserverDropdown = new ResizeObserver(this.offsetForDropDown.bind(this));
    resizeObserverDropdown.observe(this.closest('[data-custom-dropdown-wrapper]'));
  }

  connectedCallback() {
    this.wrappers = this.closest('section').querySelectorAll('[data-horizontal-wrapper]');
    this.leftArrows = this.closest('section').querySelectorAll('[data-arrow-left]');
    this.rightArrows = this.closest('section').querySelectorAll('[data-arrow-right]');
    if (this.wrappers.length > 0) {
      this.leftArrows.forEach((arrow, index) => {
        arrow.addEventListener('click', () => this.scrollLeftFun(index));
      });
      this.rightArrows.forEach((arrow, index) => {
        arrow.addEventListener('click', () => this.scrollRightFun(index));
      });
      window.addEventListener('resize', this.updateArrows.bind(this));
      this.updateArrows();
    }
  }


  offsetForDropDown() {
    const submenu = this.querySelector('[data-dropdown-content]');
    if (submenu) {
      const container = this.closest('[data-horizontal-wrapper]');
      if (!container) {
        console.info('Parent container not found');
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const menuRect = this.getBoundingClientRect();
      const submenuRect = submenu.getBoundingClientRect();
      const gap = 0; // Adjust this if you want a different gap

      let defaultSpaceFromRight;
      let createSpaceFromRight;

      if (window.innerWidth > 1440) {
        defaultSpaceFromRight = 250;
        createSpaceFromRight = 350;
      } else if (window.innerWidth <= 1440) {
        defaultSpaceFromRight = 100;
        createSpaceFromRight = 200;
      } else {
        defaultSpaceFromRight = 100;
        createSpaceFromRight = 100;
      }

      let offsetLeft = menuRect.left - containerRect.left;
      let windowInnerWidth = window.innerWidth - defaultSpaceFromRight;
      // Check if submenu overflows the window width
      const spaceRight = windowInnerWidth - (menuRect.left + submenuRect.width + gap);
      if (spaceRight < 0) {
        // Not enough space on the right, adjust the left position
        offsetLeft += spaceRight - createSpaceFromRight; // Creating a 300px gap from the right side
      }

      // Ensure the submenu stays within the viewport with the defined gap
      offsetLeft = Math.max(offsetLeft, gap);

      submenu.style.left = `${offsetLeft}px`;
    }
  }

  dropDownMenuPositions() {
    if (window.innerWidth < 992) return false;
    this.querySelector('[data-dropdown-content]').classList.remove('menu-position-left');
    const windowSize = window.innerWidth - 200;
    const rect = this.getBoundingClientRect();
    let currentPosition = rect.left + rect.width;

    const grandChildList = this.querySelector('[data-dropdown-content]');
    if (grandChildList) {
      currentPosition += grandChildList.getBoundingClientRect().width;
    }

    if (currentPosition >= windowSize) {
      this.querySelector('[data-dropdown-content]').classList.add('menu-position-left');
    }
  }

  callOffsetForDropDown(index) {
    // Select the specific horizontal wrapper based on the index
    const wrapper = this.wrappers[index];

    // Find all `custom-dropdown` elements within the specified horizontal wrapper
    const filterDropdowns = wrapper.querySelectorAll('custom-dropdown');

    // Loop through each dropdown and call its offsetForDropDown method
    filterDropdowns.forEach((filterDropdown) => {
      // Check if the method exists and is a function before calling it
      if (typeof filterDropdown.offsetForDropDown === 'function') {
        filterDropdown.offsetForDropDown();
      }
    });
  }


  scrollLeftFun(index) {
    const wrapper = this.wrappers[index];
    wrapper.scrollBy({ left: -this.scrollStep, behavior: 'smooth' });
    this.updateArrowsImmediate(-this.scrollStep, index);
    this.callOffsetForDropDown(index);
  }

  scrollRightFun(index) {
    const wrapper = this.wrappers[index];
    wrapper.scrollBy({ left: this.scrollStep, behavior: 'smooth' });
    this.updateArrowsImmediate(this.scrollStep, index);
    this.callOffsetForDropDown(index);
  }

  updateArrows() {
    this.wrappers.forEach((wrapper, index) => {
      const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;

      // Update visibility of left arrows
      if (wrapper.scrollLeft === 0) {
        this.leftArrows[index].style.display = 'none';
      } else {
        this.leftArrows[index].style.display = 'flex';
      }

      // Update visibility of right arrows
      if (wrapper.scrollLeft >= maxScrollLeft) {
        this.rightArrows[index].style.display = 'none';
      } else {
        this.rightArrows[index].style.display = 'flex';
      }
    });
  }

  updateArrowsImmediate(scrollChange, index) {
    const wrapper = this.wrappers[index];
    const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    const newScrollLeft = Math.max(0, Math.min(wrapper.scrollLeft + scrollChange, maxScrollLeft));

    // Update visibility of left arrows
    if (newScrollLeft === 0) {
      this.leftArrows[index].style.display = 'none';
    } else {
      this.leftArrows[index].style.display = 'flex';
    }

    // Update visibility of right arrows
    if (newScrollLeft >= maxScrollLeft) {
      this.rightArrows[index].style.display = 'none';
    } else {
      this.rightArrows[index].style.display = 'flex';
    }
  }



  hidePanel() {
    if (this.elements.panel) {
      this.classList.remove('active');
      this.elements.button.setAttribute('aria-expanded', 'false');
      // this.elements.panel.style.display = 'none';
      DOMAnimations.slideUp(this.elements.panel);
    }
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() === 'ESCAPE') {
      if (window.innerWidth <= 766) return false;
      this.hidePanel();
      this.elements.button.focus();
    }
  }

  togglePanel() {
    if (this.classList.contains('active')) {
      this.hidePanel();
      this.elements.button.focus();
    } else {
      if (this.elements.parent.querySelector('custom-dropdown.active')) {
        const activeElement = this.elements.parent.querySelector('custom-dropdown.active');
        activeElement.classList.remove('active');
        activeElement.querySelector('[data-dropdown-button]').setAttribute('aria-expanded', 'false');

        DOMAnimations.slideUp(activeElement.querySelector('[data-dropdown-content]'));
      }
      if (this.elements.panel) {
        this.classList.add('active');
        DOMAnimations.slideDown(this.elements.panel);
        this.offsetForDropDown();

        this.elements.button.setAttribute('aria-expanded', 'true');
      }
    }
  }

  closePanel(event) {
    if (!event.relatedTarget || event.relatedTarget.nodeName !== 'BUTTON') {
      this.hidePanel();
    }
  }
}
customElements.define('custom-dropdown', CustomDropdown);

class RecipientForm extends HTMLElement {
  constructor() {
    super();

    this.elementForms = this.querySelector('[data-recipient-form]');

    this.recipientFieldsLiveRegion = this.querySelector(`#Recipient-fields-live-region-${this.dataset.sectionId}`);
    this.checkboxInput = this.querySelector(`#Recipient-checkbox-${this.dataset.sectionId}`);
    this.checkboxInput.disabled = false;
    this.hiddenControlField = this.querySelector(`#Recipient-control-${this.dataset.sectionId}`);
    this.hiddenControlField.disabled = true;
    this.emailInput = this.querySelector(`#Recipient-email-${this.dataset.sectionId}`);
    this.nameInput = this.querySelector(`#Recipient-name-${this.dataset.sectionId}`);
    this.messageInput = this.querySelector(`#Recipient-message-${this.dataset.sectionId}`);

    this.sendonInput = this.querySelector(`#Recipient-send-on-${this.dataset.sectionId}`);
    this.offsetProperty = this.querySelector(`#Recipient-timezone-offset-${this.dataset.sectionId}`);
    if (this.offsetProperty) this.offsetProperty.value = new Date().getTimezoneOffset().toString();

    this.errorMessageWrapper = this.querySelector('[data-error-message]');
    this.errorMessageList = this.errorMessageWrapper?.querySelector('ul');
    this.errorMessage = this.errorMessageWrapper?.querySelector('[data-error-field]');
    this.defaultErrorHeader = this.errorMessage?.innerText;
    this.currentProductVariantId = this.dataset.productVariantId;
    this.addEventListener('change', this.onChange.bind(this));
    this.onChange();

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleCheckboxClick();
  }

  cartUpdateUnsubscriber = undefined;
  variantChangeUnsubscriber = undefined;
  cartErrorUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source === 'product-form' && event.productVariantId.toString() === this.currentProductVariantId) {
        this.resetRecipientForm();
      }
    });

    this.variantChangeUnsubscriber = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
      if (event.data.sectionId === this.dataset.sectionId) {
        this.currentProductVariantId = event.data.variant.id.toString();
      }
    });

    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartError, (event) => {
      if (event.source === 'product-form' && event.productVariantId.toString() === this.currentProductVariantId) {
        this.displayErrorMessage(event.message, event.errors);
      }
    });

    this.checkboxInput.addEventListener('click', this.handleCheckboxClick);
  }

  handleCheckboxClick() {
    if (this.checkboxInput.checked) {
      DOMAnimations.slideDown(this.elementForms);
      this.classList.add('active');
    } else {
      DOMAnimations.slideUp(this.elementForms);
      this.classList.remove('active');
    }
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }

    if (this.variantChangeUnsubscriber) {
      this.variantChangeUnsubscriber();
    }

    if (this.cartErrorUnsubscriber) {
      this.cartErrorUnsubscriber();
    }
  }

  onChange() {
    if (this.checkboxInput.checked) {
      this.enableInputFields();
      this.recipientFieldsLiveRegion.innerText = window.accessibilityStrings.recipientFormExpanded;
      this.classList.add('active');
    } else {
      this.clearInputFields();
      this.disableInputFields();
      this.clearErrorMessage();

      this.recipientFieldsLiveRegion.innerText = window.accessibilityStrings.recipientFormCollapsed;
    }
  }

  inputFields() {
    return [this.emailInput, this.nameInput, this.messageInput, this.sendonInput];
  }

  disableableFields() {
    return [...this.inputFields(), this.offsetProperty];
  }

  clearInputFields() {
    this.inputFields().forEach((field) => (field.value = ''));
  }

  enableInputFields() {
    this.disableableFields().forEach((field) => (field.disabled = false));
  }

  disableInputFields() {
    this.disableableFields().forEach((field) => (field.disabled = true));
  }

  displayErrorMessage(title, body) {
    this.clearErrorMessage();
    this.errorMessageWrapper = false;
    if (typeof body === 'object') {
      this.errorMessage.innerText = this.defaultErrorHeader;
      return Object.entries(body).forEach(([key, value]) => {
        const errorMessageId = `RecipientForm-${key}-error-${this.dataset.sectionId}`;
        const fieldSelector = `#Recipient-${key}-${this.dataset.sectionId}`;
        const message = `${value.join(', ')}`;
        const errorMessageElement = this.querySelector(`#${errorMessageId}`);
        const errorTextElement = errorMessageElement?.querySelector('.error-message');
        if (!errorTextElement) return;

        if (this.errorMessageList) {
          this.errorMessageList.appendChild(this.createErrorListItem(fieldSelector, message));
        }

        errorTextElement.innerText = `${message}.`;
        errorMessageElement.classList.remove('hidden');

        const inputElement = this[`${key}Input`];
        if (!inputElement) return;

        inputElement.setAttribute('aria-invalid', true);
        inputElement.setAttribute('aria-describedby', errorMessageId);
      });
    }

    this.errorMessage.innerText = body;
  }

  createErrorListItem(target, message) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', target);
    a.innerText = message;
    li.appendChild(a);
    li.className = 'error-message';
    return li;
  }

  clearErrorMessage() {
    this.errorMessageWrapper = true;

    if (this.errorMessageList) this.errorMessageList.innerHTML = '';

    this.querySelectorAll('.recipient-fields .form__message').forEach((field) => {
      field.classList.add('hidden');
      const textField = field.querySelector('.error-message');
      if (textField) textField.innerText = '';
    });

    [this.emailInput, this.messageInput, this.nameInput, this.sendonInput].forEach((inputElement) => {
      inputElement.setAttribute('aria-invalid', false);
      inputElement.removeAttribute('aria-describedby');
    });
  }

  resetRecipientForm() {
    if (this.checkboxInput.checked) {
      this.checkboxInput.checked = false;
      this.clearInputFields();
      this.clearErrorMessage();
    }
  }
}
customElements.define('recipient-form', RecipientForm);

class ListSet extends HTMLElement {
  constructor() {
    super();
    this.magnetButton = new theme.MagnetButton(this);
    this.magnetButton.load();
    this.addEventListener('click', this.onClickHandler.bind(this));
  }

  onClickHandler(e) {
    switch (this.dataset.source) {
      case 'search-drawer':
        if (document.querySelector(`[data-drawer="${this.dataset.source}"]`) && this.dataset.behaviour == 'drawer') {
          e.preventDefault();
          setTimeout(() => {
            document.querySelector(`[data-drawer="${this.dataset.source}"]`).classList.add('show');
            document.body.classList.add('overflow-hidden');
          }, 400);
          setTimeout(() => {
            document.querySelector(`[data-drawer="${this.dataset.source}"]`).classList.add('shadow');
            document
              .querySelector(`[data-drawer="${this.dataset.source}"]`)
              .querySelector('input[type="search"]')
              .focus();
          }, 800);
          document.querySelector(`[data-drawer="${this.dataset.source}"]`).style.display = 'flex';
        }
        break;

      case 'cart-drawer':
        if (document.querySelector(`[data-drawer="${this.dataset.source}"]`) && this.dataset.behaviour == 'drawer') {
          e.preventDefault();
          setTimeout(() => {
            document.querySelector(`[data-drawer="${this.dataset.source}"]`).classList.add('show');
            document.body.classList.add('overflow-hidden');
          }, 400);
          setTimeout(() => {
            document.querySelector(`[data-drawer="${this.dataset.source}"]`).classList.add('shadow');
          }, 800);
          document.querySelector(`[data-drawer="${this.dataset.source}"]`).style.display = 'flex';
        }
        break;

      case 'account-drawer':
        if (document.querySelector(`[data-drawer="${this.dataset.source}"]`) && this.dataset.behaviour == 'drawer') {
          e.preventDefault();
          setTimeout(() => {
            document.querySelector(`[data-drawer="${this.dataset.source}"]`).classList.add('show');
            document.body.classList.add('overflow-hidden');
            if (document.querySelector('[data-header-wrapper]')) {
              document.querySelector('[data-header-wrapper]').style.position = 'relative';
            }
          }, 400);
          setTimeout(() => {
            document.querySelector(`[data-drawer="${this.dataset.source}"]`).classList.add('shadow');
          }, 800);
          document.querySelector(`[data-drawer="${this.dataset.source}"]`).style.display = 'flex';
        }
        break;

      default:
        break;
    }
  }
}
customElements.define('list-set', ListSet);

class ScrollTop extends HTMLElement {
  constructor() {
    super();
    this.currentScrollTop = 0;
    this.BodyScrollTop = 0;
    this.scrollButton = this.querySelector('[back-to-top-button]');

    window.addEventListener('scroll', this.onScroll.bind(this), false);
    this.scrollButton.addEventListener('click', this.onClick.bind(this));
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 1000) {
      if (scrollTop > this.currentScrollTop) {
        this.scrollButton.classList.add('show');
      }
    } else {
      this.scrollButton.classList.remove('show');
    }
    this.currentScrollTop = scrollTop;
  }

  onClick() {
    this.smoothScrollToTop();
  }

  smoothScrollToTop() {
    const duration = 700;
    const start = window.pageYOffset;
    const startTime = performance.now();

    const scrollStep = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easing = this.easeInOutQuad(progress);

      window.scrollTo(0, start - start * easing);

      if (timeElapsed < duration) {
        requestAnimationFrame(scrollStep);
      }
    };

    requestAnimationFrame(scrollStep);
  }

  // Easing function for smooth scroll animation
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}

customElements.define('scroll-top', ScrollTop);

class CustomButton extends HTMLButtonElement {
  constructor() {
    super();
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.load();
  }

  connectedCallback() { }
}

customElements.define('magnet-button', CustomButton, { extends: 'button' });

class MediaZoomButton extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest('.shopify-section');
    this.slideIndex = this.dataset.index;
    this.sectionId = this.dataset.section;
    this.productMediaContent = this.section?.querySelector('[data-product-media-content]');
    if (this.productMediaContent) {
      this.template = this.productMediaContent.querySelector('template');
      this.addEventListener('click', this.openMediaPopup.bind(this));
    }
  }
  openMediaPopup() {
    if (!this.template) return false;
    const content = this.template.content.firstElementChild.cloneNode(true);
    document.body.appendChild(content);
    this.popup = document.querySelector(`#product-media-content-${this.sectionId}`);
    if (this.popup) {
      setTimeout(
        function () {
          this.popup.querySelector('swiper-content')?._selectSlide(parseInt(this.slideIndex));

          setTimeout(
            function () {
              this.popup.classList.add('show');
              //document.body.classList.add('overflow-hidden');
            }.bind(this),
            400
          );
          setTimeout(() => {
            this.popup.classList.add('shadow');
          }, 800);
          this.popup.style.display = 'flex';
        }.bind(this),
        200
      );
      setTimeout(() => {
        if (this.section.querySelector('swiper-content')) {
          this.section.querySelector('swiper-content')._selectSlide(parseInt(this.slideIndex));
        }
      }, 1300);
    }
  }
}

customElements.define('media-zoom-button', MediaZoomButton);

class ProductMediaPopup extends HTMLElement {
  constructor() {
    super();
    this.closeBtn = this.querySelector('[data-popup-close]');
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', this.closeMediaPopup.bind(this));
    }
  }
  closeMediaPopup() {
    this.classList.remove('show');
    this.style.display = ''; // Reset display property

    setTimeout(
      function () {
        this.remove();
      }.bind(this),
      500
    );
    //document.body.classList.remove('overflow-hidden');
  }
}

customElements.define('product-media-popup', ProductMediaPopup);

if (!customElements.get('pickup-info')) {
  customElements.define(
    'pickup-info',
    class PickupInfoElement extends HTMLElement {
      constructor() {
        super();
        if (!this.hasAttribute('available')) return;
        const button = this.querySelector('button');
        if (button) {
          button.addEventListener('click', (evt) => {
            this.fetchAvailability(this.dataset.variantId);
          });
          button.addEventListener('touchend', () => {
            this.fetchAvailability(this.dataset.variantId);
          });
        }
      }
      fetchAvailability(variant_id) {
        let rootUrl = this.dataset.rootUrl;
        if (!rootUrl.endsWith('/')) {
          rootUrl = rootUrl + '/';
        }
        const variantSectionUrl = `${rootUrl}variants/${variant_id}/?section_id=pickup-availability-drawer`;
        fetch(variantSectionUrl)
          .then((response) => response.text())
          .then((text) => {
            const sectionInnerHTML = new DOMParser()
              .parseFromString(text, 'text/html')
              .querySelector('.shopify-section');
            this.renderPreview(sectionInnerHTML);
            setTimeout(() => {
              document.querySelector('pickup-availability-drawer').classList.add('show');
              document.body.classList.add('overflow-hidden');
            }, 400);

            document.querySelector('pickup-availability-drawer').style.display = 'flex';
            document.querySelector('pickup-availability-drawer').focus();
          })
          .catch((e) => { });
      }
      renderPreview(sectionInnerHTML) {
        const drawer = document.querySelector('pickup-availability-drawer');
        if (drawer) drawer.remove();
        // sectionInnerHTML
        //   .querySelector('pickup-availability-drawer')
        //   .classList.add(`scheme-${this.dataset.sectionScheme}`);
        document.body.appendChild(sectionInnerHTML.querySelector('pickup-availability-drawer'));
      }
    }
  );
}
if (!customElements.get('pickup-availability-drawer')) {
  customElements.define(
    'pickup-availability-drawer',
    class PickupAvailabilityDrawer extends HTMLElement {
      constructor() {
        super();
        this.onBodyClick = this.handleBodyClick.bind(this);
        this.querySelector('button').addEventListener('click', () => {
          this.hide();
        });
        this.addEventListener('keyup', (event) => {
          if (event.code.toUpperCase() === 'ESCAPE') this.hide();
        });
        (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
      }

      handleBodyClick(evt) {
        const target = evt.target;
        if (
          target != this &&
          !target.closest('pickup-availability-drawer') &&
          target.id != 'ShowPickupAvailabilityDrawer'
        ) {
          this.hide();
        }
      }

      hide() {
        this.removeAttribute('open');

        document.body.removeEventListener('click', this.onBodyClick);
        document.body.classList.remove('overflow-hidden');
        // removeTrapFocus(this.focusElement);
      }

      show(focusElement) {
        this.focusElement = focusElement;
        this.setAttribute('open', '');
        document.body.addEventListener('click', this.onBodyClick);
        document.body.classList.add('overflow-hidden');
        // trapFocus(this);
      }
    }
  );
}

class StickyFeature extends HTMLDivElement {
  constructor() {
    super();
    this.section = this.closest('section');
    this.isEnabled = false;
  }

  connectedCallback() {
    this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
    this.resizeObserver.observe(document.body);
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleResize() {
    const currentWidth = window.innerWidth;
    this.isEnabled = currentWidth > 766;
    if (!this.isEnabled) {
      this.fadeIn(); // Ensure it's visible if the feature is disabled
    }
  }

  handleScroll() {
    if (!this.isEnabled) return;

    const windowHeight = window.innerHeight;
    const sectionRect = this.section.getBoundingClientRect();
    const screenMidpoint = windowHeight / 2;

    // Fade in when the section's bottom is above the screen midpoint
    if (sectionRect.bottom <= screenMidpoint) {
      this.fadeOut();
    }
    // Fade out when the section's bottom is below the screen midpoint
    else if (sectionRect.bottom > screenMidpoint) {
      this.fadeIn();
    }
  }

  fadeOut() {
    if (!this.classList.contains('fade-out')) {
      this.classList.add('fade-out');
      this.classList.remove('fade-in');
    }
  }

  fadeIn() {
    if (!this.classList.contains('fade-in')) {
      this.classList.add('fade-in');
      this.classList.remove('fade-out');
    }
  }
}
customElements.define('sticky-feature', StickyFeature, { extends: 'div' });

class StickyBuyButton extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest('section');
    this.footer = document.querySelector('footer');
    this.isEnabled = true;
    this.handleScroll();
  }

  connectedCallback() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    this.querySelector('[data-sticky-close]').addEventListener('click', this.closeSticky.bind(this));
  }

  closeSticky() {
    this.classList.add('hidden');
  }

  handleScroll() {
    if (!this.isEnabled) return;

    const windowHeight = window.innerHeight;
    const sectionRect = this.section.getBoundingClientRect();
    const footerRect = this.footer.getBoundingClientRect();
    const isFooterInView = footerRect.top < windowHeight && footerRect.bottom > 0;

    if (isFooterInView) {
      this.fadeOut();
    } else if (sectionRect.bottom <= windowHeight / 2) {
      this.fadeIn();
    } else if (sectionRect.bottom > windowHeight / 2) {
      this.fadeOut();
    }
  }

  fadeOut() {
    if (!this.classList.contains('fade-out')) {
      this.classList.add('fade-out');
      this.classList.remove('fade-in');
    }
  }

  fadeIn() {
    if (!this.classList.contains('fade-in')) {
      this.classList.add('fade-in');
      this.classList.remove('fade-out');
    }
  }
}

customElements.define('sticky-buy-button', StickyBuyButton);

class CustomControls extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest('section');
    this.mediaitem = this.closest('[data-media-item]');
    this.video = this.mediaitem.querySelector('video');
    this.playIcon = this.querySelector('[data-video-play]');
    this.pauseIcon = this.querySelector('[data-video-pause]');
  }

  connectedCallback() {
    this.playIcon.addEventListener('click', () => this.play());
    this.pauseIcon.addEventListener('click', () => this.pause());
    // this.updateIconVisibility();
    this.video.addEventListener('play', () => this.updateIconVisibility());
    this.video.addEventListener('pause', () => this.updateIconVisibility());
  }

  play() {
    if (this.video) {
      this.video.play();
      this.updateIconVisibility();
    }
  }

  pause() {
    if (this.video) {
      this.video.pause();
      this.updateIconVisibility();
    }
  }

  updateIconVisibility() {
    if (this.video) {
      if (this.video.paused) {
        this.playIcon.classList.remove('hidden');
        this.pauseIcon.classList.add('hidden');
      } else {
        this.playIcon.classList.add('hidden');
        this.pauseIcon.classList.remove('hidden');
      }
    }
  }
}

customElements.define('custom-controls', CustomControls);

/** gsap sections start **/
class CardAnimation {
  constructor() {
    this.cardTriggers = [];
    this.initAnimations();
    this.bindEvents();
  }

  initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set('[data-card-animate]', {
      opacity: 0,
      y: 75,
      scale: 0.9,
    });


    this.killCardTriggers();

    const scrollTrigger = ScrollTrigger.batch('[data-card-animate]', {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
        });
      },
      once: true,
    });

    this.cardTriggers.push(scrollTrigger);
  }

  bindEvents() {
    document.addEventListener('shopify:section:select', () => {
      this.refreshAnimations();
    });

    document.addEventListener('shopify:section:deselect', () => {
      this.refreshAnimations();
    });

    document.addEventListener('DOMContentLoaded', () => {
      this.initAnimations();
    });
  }

  refreshAnimations() {
    this.killCardTriggers();
    this.initAnimations(); // Reinitialize animations
  }


  killCardTriggers() {
    this.cardTriggers = this.cardTriggers.filter(trigger => trigger && typeof trigger.kill === 'function');
    this.cardTriggers.forEach(trigger => trigger.kill());
    this.cardTriggers = [];
  }
}

class ScrollAnimation {
  constructor() {
    this.animationSections = [];
    this.scrollTriggers = [];
    this.init();
  }

  init() {
    this.animationSections = Array.from(document.querySelectorAll('[data-saos]'));
    this.animationSections.forEach((animatedSecObj) => {
      let split = null;
      let chars = null;

      const animationType = animatedSecObj.getAttribute('data-saos');

      // If the animation requires text splitting
      if (
        animationType === 'scatter-fly' ||
        animationType === 'curve-rise' ||
        animationType === 'flash-flick' ||
        animationType === 'reveal' ||
        animationType === 'wave-slide-up' ||
        animationType === 'falling-curve'
      ) {
        split = new SplitText(animatedSecObj, { type: 'chars', charsClass: 'char' });
        chars = animatedSecObj.querySelectorAll('.char');
      }
      if (!animatedSecObj.classList.contains('is-animated-gsap')) {
        switch (animationType) {
          case 'slide-up':
            gsap.set(animatedSecObj, { opacity: 0 });
            break;

          case 'scatter-fly':
            gsap.set(chars, {
              willChange: 'opacity, transform',
              opacity: 0,
              xPercent: () => gsap.utils.random(-100, 100),
              yPercent: () => gsap.utils.random(-120, 120),
            });
            break;

          case 'curve-rise':
            gsap.set(chars, {
              willChange: 'opacity, transform',
              opacity: 0,
              rotationX: -90,
              yPercent: 50,
            });
            break;

          case 'flash-flick':
            gsap.set(chars, {
              willChange: 'opacity',
              opacity: 0,
              filter: 'blur(20px)',
            });
            break;

          case 'reveal':
            gsap.set(chars, {
              willChange: 'opacity, transform',
              opacity: 0,
              scale: 0.6,
              rotationZ: () => gsap.utils.random(-20, 20),
            });
            break;

          case 'wave-slide-up':
            gsap.set(chars, {
              willChange: 'opacity, transform',
              opacity: 0,
              yPercent: 20,
              scaleY: 2.0,
              scaleX: 0.7,
              transformOrigin: '50% 0%',
            });
            break;

          case 'falling-curve':
            gsap.set(chars, {
              willChange: 'transform',
              transformOrigin: '50% 0%',
              scaleY: 0,
            });
            break;

          default:
            console.warn(`No animation defined for: ${animationType}`);
            break;
        }
      }

      const scrollTrigger = ScrollTrigger.create({
        trigger: animatedSecObj,
        // pin: ".pinned-content",//".pinned-content",//"#MainContent",//"#king-body-main",
        // pinnedContainer: ".pinned-content",//".pinned-content",//"#MainContent", //
        start: "top 90%",
        markers: false,
        onToggle: () => {
          if (!animatedSecObj.classList.contains('is-animated-gsap')) {
            this.animationApplied(animatedSecObj, animatedSecObj.getAttribute('data-saos'));
          }
          animatedSecObj.classList.add('is-animated-gsap');
        },
      });
      this.scrollTriggers.push(scrollTrigger);
    });
  }

  animationApplied(elementAnimated, animationType) {
    let chars;
    let timeline = gsap.timeline(); // Declare timeline once

    switch (animationType) {
      case 'slide-up':
        return gsap.fromTo(
          elementAnimated,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          }
        );
      case 'scatter-fly':
        chars = elementAnimated.querySelectorAll('.char');
        timeline.to(chars, {
          'will-change': 'opacity, transform',
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          duration: 1,
          stagger: 0.02, // Add stagger for smoother animation
          ease: 'power2.out',
        });
        return timeline;

      case 'curve-rise':
        chars = elementAnimated.querySelectorAll('.char');
        timeline.to(chars, {
          ease: 'power1.inOut',
          opacity: 1,
          rotationX: 0,
          yPercent: 0,
          stagger: {
            each: 0.02,
            from: 0,
          },
        });
        return timeline;

      case 'flash-flick':
        chars = elementAnimated.querySelectorAll('.char');
        timeline.to(chars, {
          duration: 0.25,
          ease: 'power1.inOut',
          opacity: 1,
          filter: 'blur(0px)',
          stagger: {
            each: 0.02,
            from: 'random',
          },
        });
        return timeline;

      case 'reveal':
        chars = elementAnimated.querySelectorAll('.char');
        timeline.to(chars, {
          ease: 'power4',
          opacity: 1,
          scale: 1,
          rotation: 0,
          stagger: 0.02,
        });
        return timeline;

      case 'wave-slide-up':
        chars = elementAnimated.querySelectorAll('.char');
        timeline.to(chars, {
          duration: 1,
          ease: 'back.inOut(2)',
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: 0.02,
        });
        return timeline;

      case 'falling-curve':
        chars = elementAnimated.querySelectorAll('.char');
        timeline.to(chars, {
          ease: 'back',
          opacity: 1,
          scaleY: 1,
          yPercent: 0,
          stagger: 0.02,
        });
        return timeline;

      default:
        // console.info(`Unknown animation type: ${animationType}`);
        return null;
    }
  }

  kill() {
    this.scrollTriggers.forEach((trigger) => {
      trigger.kill();
    });
    this.scrollTriggers = [];
    this.animationSections.forEach((section) => {
      section.classList.remove('is-animated-gsap');
    });
  }

  reinit() {
    this.kill(); // Kill existing triggers and reset
    this.init(); // Reinitialize everything
  }
}
const saosScrollAnimation = new ScrollAnimation();


class CardAnimate extends HTMLDivElement {
  constructor() {
    super();
    this.initAnimations();
    this.bindEvents();
    this.scrollTrigger = null;
  }

  connectedCallback() {
    this.initAnimations();
    this.bindEvents();
  }

  disconnectedCallback() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
  }

  initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(this, {
      y: 75,
      scale: 0.9,
    });
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(this, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
        });
      },
      once: true,
    });
  }

  bindEvents() {
    document.addEventListener('shopify:section:select', () => {
      this.refreshAnimations();
    });

    document.addEventListener('shopify:section:deselect', () => {
      this.refreshAnimations();
    });
    document.addEventListener('DOMContentLoaded', () => {
      this.refreshAnimations();
      this.initAnimations();
    });
  }

  refreshAnimations() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.initAnimations();
    }
  }
}

customElements.define('card-animate', CardAnimate, { extends: 'div' });

class ClippedImage extends HTMLElement {
  constructor() {
    super();
    this.clippedItemsParent = null;
    this.clippedItem = null;
    this.scrollTriggerInstance = null; // To store the ScrollTrigger instance
    this.wrapperClosest = this.closest('.section-wrapper');
    this.totalItemsHeight = 0;
    this.initializeClipped();
  }

  initializeClipped() {
    this.clippedItemsParent = this.querySelector('[data-clipped-items]');
    this.clippedItem = this.querySelectorAll('[data-clipped-item]');
    this.allItems = this.querySelectorAll('.images-with-text-carousel--item')
    this.createScrollAnimation(this.clippedItemsParent, this.clippedItem);
  }

  createScrollAnimation(triggerElement, targetElements) {
    if (triggerElement && targetElements.length > 0) {

      this.scrollTriggerInstance = gsap
        .timeline({
          scrollTrigger: {
            id: this.dataset.section,
            trigger: this.wrapperClosest,
            // pin: '.pinned-content',
            // pinnedContainer: '.pinned-content',
            pin: this.section,
            pinnedContainer: this.section,
            start: "top top",
            end: '+=100%',
            pinSpacing: true,
            // end: () => "+=" + (this.wrapperClosest.offsetHeight * targetElements.length) + "px",
            pin: true,
            refreshPriority: 1,
            scrub: 2,
            markers: false,
          },
        })

      this.clippedItem.forEach((item, object) => {
        this.scrollTriggerInstance.to(item, { clipPath: 'polygon(-100% 0%, 100% 0%, 100% 100%, -25% 100%)' })
      })

    }
  }

  killClippedScrollTrigger(scrollTiggerId) {

    if (scrollTiggerId) {
      const scrollTriggerInstance = ScrollTrigger.getById(`${scrollTiggerId}`);
      scrollTriggerInstance.kill()
    }
  }
}

customElements.define('clipped-image', ClippedImage);

class RevealingText extends HTMLElement {
  constructor() {
    super();
    this._paragraph = null;
    this.split = null;
    this.masks = [];
    this.splitTimeline = null;
    this.chars = null;
  }

  connectedCallback() {
    this._paragraph = this.querySelector('[data-text-reveal]');
    this.splitRevealText(this._paragraph);

    this.resizeObserver = new ResizeObserver(() => {
      this.splitRevealText(this._paragraph); // Reinitialize the animation
    });

    this.resizeObserver.observe(this._paragraph);
  }

  splitRevealText(targetParagraph) {
    if (this.split) {
      this.split.revert(); // Clean up previous SplitText instance
    }
    if (this.splitTimeline) {
      this.splitTimeline.kill(); // Kill the previous GSAP timeline
    }

    if (this.dataset.revealStyle == 'style-1') {
      this.split = new SplitText(targetParagraph, { type: 'lines', linesClass: 'revealing-text-line' });
      this.split.lines.forEach((target) => {
        gsap.to(target, {
          backgroundPositionX: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: target,
            scrub: 1.5,
            markers: false,
            start: 'top 60%',
            end: 'bottom center',
          },
        });
      });
    } else {
      this.splitTimeline = gsap.timeline();
      this.split = new SplitText(targetParagraph, { type: 'words,chars', charsClass: 'revealing-text-char' });
      this.chars = this.split.chars; //an array of all the divs that wrap each character
      this.splitTimeline.from(
        this.chars,
        {
          duration: 0.8,
          opacity: 0,
          y: -10,
          ease: 'circ.out',
          stagger: 0.02,
          scrollTrigger: {
            trigger: targetParagraph,
            markers: false,
            start: 'top 60%',
            end: 'bottom center',
            scrub: 1.5,
          },
        },
        '+=0'
      );
    }
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this._paragraph);
    }
    if (this.split) {
      this.split.revert();
    }
    if (this.splitTimeline) {
      this.splitTimeline.kill();
    }
  }

  reinit() {
    this.splitRevealText(this._paragraph);
  }
}

customElements.define('reveal-text', RevealingText);



class TabsElement extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest('section');
    this.animation = this.dataset.animationEffect;
    this.productCards = this.section.querySelectorAll('[data-content-item]');
    this.tabWrapper = this.section.querySelector('[data-tab-wrapper]');
    // Initialize Resize Observer
    this.resizeObserver = new ResizeObserver(() => {
      this.updateTabLayout();
    });

    // Observe the section for size changes
    this.resizeObserver.observe(this.section);

    this.querySelectorAll('[data-tab-id]').forEach((tab) => {
      tab.addEventListener('click', this.handleTabs.bind(this));
    });
  }

  connectedCallback() {
    this.productCards.forEach((card) => {
      const infoBox = card.querySelector('[data-item-info]');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        if (infoBox) {
          infoBox.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
          infoBox.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (infoBox) {
          infoBox.style.opacity = '0';
        }
      });
    });
    this.updateTabLayout(); // Initial check on load
  }

  updateTabLayout() {
    const isMobile = window.innerWidth < 768;
    if (!this.tabWrapper) return;
    if (this.tabWrapper.dataset.tabWrapper === 'horizontal') {
      return;
    }
    // Toggle classes based on isMobile
    this.tabWrapper.classList.toggle('horizontal-tab', isMobile);
    this.tabWrapper.classList.toggle('vertical-tab', !isMobile);
  }

  handleTabs(event) {
    this.querySelectorAll('[data-tab-id]').forEach((tab) => tab.classList.remove('active'));
    this.section.querySelectorAll('[data-content-id]').forEach((content) => {
      content.classList.add('hidden');
      if (this.animation != 'none') {
        const productCards = content.querySelectorAll('[data-content-item]');
        gsap.to(productCards, { opacity: 0, y: 50, duration: 0 });
      }
    });

    const clickedTab = event.currentTarget;
    clickedTab.classList.add('active');

    const tabId = clickedTab.getAttribute('data-tab-id');

    const contentToShow = this.section.querySelector(`[data-content-id="${tabId}"]`);
    if (contentToShow) {
      contentToShow.classList.remove('hidden');
      if (this.animation != 'none') {
        const productCards = contentToShow.querySelectorAll('[data-content-item]');
        if (this.animation == 'fade') {
          gsap.fromTo(
            productCards,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          );
        }
        if (this.animation == 'bounce') {
          gsap.fromTo(
            productCards,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'elastic.out(1, 0.5)' }
          );
        }
      }
    }
  }
}

customElements.define('tabs-element', TabsElement);


/** gsap sections end **/

if (isSafari()) {
  function initializeLocalizationContext(button) {
    const magnetButton = new theme.MagnetButton(button);
    magnetButton.load();
    magnetButton.onKeyDown();
    function countryLanguageModalOpen(event) {

      const popupModal = document.querySelector('popup-modal');
      if (popupModal) {
        popupModal.modalPopupOpen('data-localization-form-popup');
      }
    }
    button.addEventListener('click', countryLanguageModalOpen);
  }
  function setupLocalizationContexts() {
    const buttons = document.querySelectorAll('button[is="localization-context"]');

    buttons.forEach((button) => {
      initializeLocalizationContext(button);
    });
  }

  function initializeStoreLocatorContext(buttonElement) {
    const magnetButton = new theme.MagnetButton(buttonElement);
    magnetButton.load();
    magnetButton.onKeyDown();

    // Event handler for click events
    function onClickHandler() {
      const isSearchDrawer = document.querySelector('store-locator');
      setTimeout(() => {
        isSearchDrawer.classList.add('show');
        document.body.classList.add('overflow-hidden');
      }, 400);
      setTimeout(() => {
        isSearchDrawer.classList.add('shadow');
      }, 800);
      isSearchDrawer.style.display = 'flex';
      // Optional: Focus on the drawer close button after a delay
      // setTimeout(() => {
      //     document.getElementById('StoreLocator').querySelector('[data-drawer-close]').focus();
      // }, 500);
    }
    buttonElement.addEventListener('click', onClickHandler);
  }
}
class StoreLocatorContext extends HTMLButtonElement {
  constructor() {
    super();
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.load();
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
    this.addEventListener('click', this.onClickHandler.bind(this));
  }
  onClickHandler() {
    const isSearchDrawer = document.querySelector('store-locator');
    setTimeout(() => {
      isSearchDrawer.classList.add('show');
      document.body.classList.add('overflow-hidden');
    }, 400);
    setTimeout(() => {
      isSearchDrawer.classList.add('shadow');
    }, 800);
    isSearchDrawer.style.display = 'flex';
    // setTimeout(() => {
    //   document.getElementById('StoreLocator').querySelector('[data-drawer-close]').focus();
    // }, 500);
  }
}
 
customElements.define('store-locator-context', StoreLocatorContext, { extends: 'button' });

// class StoreLocatorContext extends HTMLElement {
//   constructor() {
//     super();
//     (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.load();
//     (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
//     this.addEventListener('click', this.onClickHandler.bind(this));
//   }
//   onClickHandler() {
//     const isSearchDrawer = document.querySelector('store-locator');
//     setTimeout(() => {
//       isSearchDrawer.classList.add('show');
//       document.body.classList.add('overflow-hidden');
//     }, 400);
//     setTimeout(() => {
//       isSearchDrawer.classList.add('shadow');
//     }, 800);
//     isSearchDrawer.style.display = 'flex';
//     // setTimeout(() => {
//     //   document.getElementById('StoreLocator').querySelector('[data-drawer-close]').focus();
//     // }, 500);
//   }
// }

//customElements.define('store-locator-context', StoreLocatorContext);

class localizationContext extends HTMLElement {
  constructor() {
    super();
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.load();
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
    if(this.dataset.size > 1){
      this.addEventListener('click', this.countryLanguageModalOpen.bind(this));
    }
    
  }

  countryLanguageModalOpen(e) {
    const popupModal = document.querySelector('popup-modal');
    popupModal.modalPopupOpen('data-localization-form-popup');
  }
}
customElements.define('localization-context', localizationContext);

class LocalizationForm extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      // input: this.querySelector('input[name="country_code"]'),
      button: this.querySelector('[data-custom-select-button]'),
      panel: this.querySelector('[data-custom-select-summary]'),
    };

    document.body.addEventListener(
      'click',
      function (event) {
        if (event.target != this && !this.contains(event.target)) {
          this.hidePanel();
        }
      }.bind(this)
    );

    document.body.addEventListener('keydown', this.handleKeyPress.bind(this));

    if (this.elements.button) {
      this.elements.button.addEventListener('click', this.togglePanel.bind(this));
      //this.elements.button.addEventListener('focusout', this.closePanel.bind(this));
    }
    this.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  handleKeyPress(event) {
    this.hidePanel();
  }

  hidePanel() {
    if (this.elements.panel) {
      this.elements.button.setAttribute('aria-expanded', 'false');
      this.elements.panel.style.display = 'none';
    }
  }

  onKeyUp(event) {
    if (event.code && event.code.toUpperCase() === 'ESCAPE') {
      this.hidePanel();
      this.elements.button.focus();
    }
  }

  onItemClick(event) {
    event.preventDefault();
    const form = this.querySelector('form');
    const input_field = form.querySelector('[data-input-selector]');
    if (input_field) {
      input_field.value = event.currentTarget.value;
    }
    if (form) form.submit();
  }

  togglePanel() {
    const isHidden = this.elements.panel.style.display === 'none';
    // Close other panels if any
    document.querySelectorAll('[data-custom-select]').forEach((panel) => {
      panel.querySelector('[data-custom-select-button]').setAttribute('aria-expanded', 'false');
      panel.querySelector('[data-custom-select-summary]').style.display = 'none';
    });

    if (this.elements.panel) {
      this.elements.panel.style.display = isHidden ? 'block' : 'none';
      // Adjust panel position based on viewport
      this.adjustPanelPosition();
      this.elements.button.setAttribute('aria-expanded', isHidden.toString());
      if (isHidden) {
        this.elements.button.focus();
      }
    }
  }

  adjustPanelPosition() {
    if (this.elements.panel) {
      const element = this.elements.panel;
      const dropdownHeight = element.clientHeight;
      const windowHeight = window.innerHeight;
      const dropdownTop = element.getBoundingClientRect().top;
      if (windowHeight - dropdownTop < dropdownHeight) {
        element.classList.add('top-position');
      } else {
        element.classList.remove('top-position');
      }
    }
  }

  closePanel(event) {
    if (!event.relatedTarget || event.relatedTarget.nodeName !== 'BUTTON') {
      this.hidePanel();
    }
  }
}
customElements.define('localization-form', LocalizationForm);

class ParallaxContainer extends HTMLElement {
  constructor() {
    super();
    this.parallaxImage = this.querySelector('[data-parallax-image]');
    this.windowInnerHeight = window.innerHeight;
    this.isActive = false;
    this.timeout = null;
    this.directionMap = {
      right: 0,
      top: 90,
      left: 180,
      bottom: 270,
    };
    this.directionMultipliers = {
      0: [1, 0],
      90: [0, -1],
      180: [-1, 0],
      270: [0, 1],
    };
    this.init();
    window.addEventListener('scroll', () => this.scrollHandler());
  }

  getParallaxInfo() {
    const { width, height, top } = this.parallaxImage.getBoundingClientRect();
    let element = this.parallaxImage;
    let multipliers,
      { angle, movement } = element.dataset;
    let movementPixels = Math.ceil(
      angle === 'top' ? height * (parseFloat(movement) / 100) : width * (parseFloat(movement) / 100)
    );

    angle = this.directionMap[angle] ?? parseFloat(angle);
    angle = isNaN(angle) ? 270 : angle; // Handle NaN
    movementPixels = isNaN(movementPixels) ? 100 : movementPixels; // Handle NaN
    angle %= 360;
    angle < 0 && (angle += 360);

    const toLeft = angle > 90 && angle < 270;
    const toTop = angle < 180;

    element.style[toLeft ? 'left' : 'right'] = 0;
    element.style[toTop ? 'top' : 'bottom'] = 0;

    if (angle % 90) {
      const radians = (angle * Math.PI) / 180;
      multipliers = [Math.cos(radians), Math.sin(radians) * -1];
    } else {
      multipliers = this.directionMultipliers[angle];
    }

    if (multipliers[0]) {
      element.style.width = `calc(100% + ${movementPixels * Math.abs(multipliers[0])}px)`;
    }
    if (multipliers[1]) {
      element.style.height = `calc(100% + ${movementPixels * Math.abs(multipliers[1])}px)`;
    }

    return { element, movementPixels, multipliers, top, height };
  }

  init() {
    const { element, movementPixels, multipliers, top, height } = this.getParallaxInfo();
    const scrolledInContainer = this.windowInnerHeight - top;
    const scrollArea = this.windowInnerHeight + height;
    const progress = scrolledInContainer / scrollArea;

    if (progress > -0.1 && progress < 1.1) {
      const position = Math.min(Math.max(progress, 0), 1) * movementPixels;
      gsap.to(element, {
        x: position * multipliers[0],
        y: position * multipliers[1],
        duration: 0.5,
        overwrite: 'auto',
      });
    }

    if (this.isActive) {
      requestAnimationFrame(this.init.bind(this));
    }
  }

  scrollHandler() {
    this.isActive ? clearTimeout(this.timeout) : ((this.isActive = true), requestAnimationFrame(this.init.bind(this)));
    this.timeout = setTimeout(() => (this.isActive = false), 20);
  }
}
customElements.define('parallax-container', ParallaxContainer);


class HeroContext extends HTMLElement {
  constructor() {
    super();

    this.section = this.closest('section');
    this._initHeroThumbanils();
    const resizeObserver = new ResizeObserver(() => this._initHeroThumbanils());
    resizeObserver.observe(this.closest('section'));

  }

  _initHeroThumbanils() {

    const newIsMobile = window.innerWidth < 768;
    // this.section.querySelector('swiper-content')?._stopAutoplay();
    this.querySelectorAll('[data-hero-item]').forEach((heroitem) => {
      if (!newIsMobile) {
        heroitem.addEventListener('mouseover', (e) => {
          this.section.querySelector('swiper-content')?._selectSlide(parseInt(heroitem.getAttribute('data-hero-item')));

          // if (this.section.querySelector('[data-hero-wrapper]').classList.contains('hero-active')) return;
          this.section.querySelector('swiper-content')?._startAutoplay();
          // this.section.querySelector('[data-hero-wrapper]').classList.add('hero-active');
        });
        heroitem.addEventListener('mouseout', (e) => {
          this.section.querySelector('swiper-content')?._stopAutoplay();
          /*if (this.section.querySelector('[data-hero-wrapper]').classList.contains('hero-active')) {
            this.section.querySelector('[data-hero-wrapper]').classList.remove('hero-active');
            this.section.querySelector('swiper-content')?._stopAutoplay();
          }*/
        });
      } else {
        heroitem.addEventListener('click', (e) => {
          this.section.querySelector('swiper-content')?._selectSlide(parseInt(heroitem.getAttribute('data-hero-item')));
          this.section.querySelector('swiper-content')?._startAutoplay();
          // this.section.querySelector('[data-hero-wrapper]').classList.add('hero-active');
        });
      }
    });
  }
}
customElements.define('hero-context', HeroContext);

class ProductsGrid extends HTMLElement {
  constructor() {
    super();
    this.leftWrap = this.querySelectorAll('[data-left-item]');
    this.middleWrap = this.querySelectorAll('[data-middle-item]');
    this.rightWrap = this.querySelectorAll('[data-right-item]');
    this.currentIndex = 0;
  }

  connectedCallback() {
    this.leftWrap.forEach((leftItem) => {
      leftItem.addEventListener('click', () => this.handleLeftItemClick(leftItem));
    });

    /*setInterval(() => {
      if (this.leftWrap.length > 0) {
        this.handleLeftItemClick(this.leftWrap[this.currentIndex]);

        // Update index to the next item, wrapping around if needed
        this.currentIndex = (this.currentIndex + 1) % this.leftWrap.length;
      }
    }, 5000);*/
  }

  handleLeftItemClick(selectedLeftItem) {
    const selectedItemId = selectedLeftItem.getAttribute('data-left-item');

    // Update active state for left items
    this.leftWrap.forEach((item) => {
      item.classList.remove('active');
    });
    selectedLeftItem.classList.add('active');

    // Update middle items
    this.middleWrap.forEach((middleItem) => {
      if (middleItem.getAttribute('data-middle-item') === selectedItemId) {
        middleItem.classList.remove('hidden');
        middleItem.classList.add('active');
      } else {
        middleItem.classList.add('hidden');
        middleItem.classList.remove('active');
      }
    });

    // Update right items
    this.rightWrap.forEach((rightItem) => {
      if (rightItem.getAttribute('data-right-item') === selectedItemId) {
        rightItem.classList.remove('hidden');
        rightItem.classList.add('active');
      } else {
        rightItem.classList.add('hidden');
        rightItem.classList.remove('active');
      }
    });
  }
}

customElements.define('products-grid', ProductsGrid);

function getHiddenHeightEl(el) {
  if (!el?.cloneNode) {
    return null;
  }
  const clone = el.cloneNode(true);
  Object.assign(clone.style, {
    overflow: 'visible',
    height: 'auto',
    maxHeight: 'none',
    opacity: '0',
    visibility: 'hidden',
    display: 'block',
  });
  el.after(clone);
  const height = clone.offsetHeight;
  clone.remove();
  return height;
}


/**
 *
 * Common Functions King
 *
 **/

function isOnScreen(elem) {
  if (!elem) {
    return;
  }
  const window = document.defaultView;
  const viewport_top = window.scrollY;
  const viewport_height = window.innerHeight;
  const viewport_bottom = viewport_top + viewport_height;
  const elemRect = elem.getBoundingClientRect();
  const top = elemRect.top + viewport_top;
  const height = elemRect.height;
  const bottom = top + height;

  return (
    (top >= viewport_top && top < viewport_bottom) ||
    (bottom > viewport_top && bottom <= viewport_bottom) ||
    (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
  );
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
  };
}

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

document.addEventListener('DOMContentLoaded', (event) => {

  ScrollTrigger.refresh();
  parallaxAnimation();
  let _target = event.target;

  var wow = new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 50,
    mobile: false,
  });
  setTimeout(() => {
    wow.init();
  }, 2100);

  // new AnimateWow();
  document.querySelectorAll('details').forEach((el) => {
    const accordion = new Accordion(el);
    el._accordionInstance = accordion; // Store instance for each details element
  });

  setTimeout(() => {
    saosScrollAnimation.init();
  }, 500);

  new CardAnimation();

  if (isSafari()) {
    setupLocalizationContexts();

    document.querySelectorAll('[is="store-locator-context"]').forEach((button) => {
      initializeStoreLocatorContext(button);
    });

    // document.querySelectorAll('[data-custom-select]').forEach((container) => {
    //   initializeLocalizationForm(container);
    // });
  }
});
window.addEventListener('load', function (e) {
  setTimeout(() => {
    ScrollTrigger.refresh();
    ScrollTrigger.sort();
  }, 1000);
});

window.addEventListener('resize', function (event) {
  setTimeout(() => {
    ScrollTrigger.refresh();
    ScrollTrigger.sort();
  }, 1000);
});


document.addEventListener('shopify:section:unload', (event) => {

  /*const clippedImageSection = event.target.querySelector('clipped-image');
  if (clippedImageSection) {
    clippedImageSection.killClippedScrollTrigger(event.target.id);
  }*/

  setTimeout(() => {
    ScrollTrigger.refresh();
    ScrollTrigger.sort();
  }, 1000);

});

document.addEventListener('shopify:section:load', (event) => {
  parallaxAnimation();
  let _target = event.target;

  scrollObserver.handleScroll(_target);

  document.querySelectorAll('details').forEach((el) => {
    const accordion = new Accordion(el);
    el._accordionInstance = accordion;
  });

  // Reinitialize Parallax
  const parallaxContainers = document.querySelectorAll('parallax-container');
  parallaxContainers.forEach((container) => {
    if (container instanceof ParallaxContainer) {
      container.reinit();
    }
  });

  // Reinitialize RevealingTexts
  const revealingTexts = document.querySelectorAll('reveal-text');
  revealingTexts.forEach((textElement) => {
    if (textElement instanceof RevealingText) {
      textElement.reinit();
    }
  });


  // Reinitialize Clipped image
  /*const clippedImageSection = event.target.querySelector('clipped-image');
  if (clippedImageSection) {
    clippedImageSection.killClippedScrollTrigger(event.target.id);
    setTimeout(() => {
      clippedImageSection.initializeClipped();
    }, 500);
  }*/

  setTimeout(() => {
    saosScrollAnimation.reinit();
  }, 500);
  setTimeout(() => {

    ScrollTrigger.refresh();
    ScrollTrigger.sort();
  }, 1000);
});

document.addEventListener('shopify:section:select', (event) => {
  parallaxAnimation();
  let _target = event.target;
  if (_target.querySelector('[data-drawer="quick-view-drawer"]')) {
    setTimeout(() => {
      _target.querySelector('[data-drawer="quick-view-drawer"]').classList.add('show');
      document.body.classList.add('overflow-hidden');
    }, 400);
    setTimeout(() => {
      _target.querySelector('[data-drawer="quick-view-drawer"]').classList.add('shadow');
    }, 800);
    _target.querySelector('[data-drawer="quick-view-drawer"]').style.display = 'flex';
  }

  if (_target.querySelector('[data-drawer="store-locator"]')) {
    setTimeout(() => {
      _target.querySelector('[data-drawer="store-locator"]').classList.add('show');
      document.body.classList.add('overflow-hidden');
    }, 400);
    setTimeout(() => {
      _target.querySelector('[data-drawer="store-locator"]').classList.add('shadow');
    }, 800);
    _target.querySelector('[data-drawer="store-locator"]').style.display = 'flex';
  }

  if (_target.querySelector('[data-drawer="newsletter-popup"]')) {
    const popupModal = document.querySelector('popup-modal');
    popupModal.modalPopupOpen('data-newsletter-popup');
  }

  if (_target.querySelector('[data-drawer="age-verifier"]')) {
    document.querySelector('[data-drawer="age-verifier"]').style.display = 'flex';
  }

  document.querySelectorAll('details').forEach((el) => {
    const accordion = new Accordion(el);
    el._accordionInstance = accordion; // Store instance for each details element
  });


  setTimeout(() => {
    saosScrollAnimation.reinit();
  }, 500);
});

document.addEventListener('shopify:section:deselect', (event) => {
  parallaxAnimation();
  let _target = event.target;
  if (_target.querySelector('[data-drawer="quick-view-drawer"]')) {
    _target.querySelector('[data-drawer="quick-view-drawer"]').classList.remove('show');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      _target.querySelector('[data-drawer="quick-view-drawer"]').style.display = 'none';
    }, 400);
  }

  if (_target.querySelector('[data-drawer="store-locator"]')) {
    _target.querySelector('[data-drawer="store-locator"]').classList.remove('show');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      _target.querySelector('[data-drawer="store-locator"]').style.display = 'none';
    }, 400);
  }

  if (_target.querySelector('[data-drawer="newsletter-popup"]')) {
    const popupModal = document.querySelector('popup-modal');
    popupModal.modalPopupClose();
  }

  if (_target.querySelector('[data-drawer="age-verifier"]')) {
    document.querySelector('[data-drawer="age-verifier"]').style.display = 'none';
  }
});

document.addEventListener('shopify:block:select', (event) => {
  parallaxAnimation();

  let _target = event.target;
  setTimeout(() => {
    if (_target.classList.contains('swiper-slide')) {
      let slideIndex = _target.dataset.swiperSlideIndex;
      if (slideIndex != undefined) {
        _target.closest('swiper-content')._selectSlide(slideIndex);
      } else {
        let slideIndexsplit = _target.dataset.splitIndex;
        _target.closest('swiper-content')._selectSlide(slideIndexsplit);
      }
    }
    if (_target.hasAttribute('data-animate-item')) {
      let animateSlideIndex = _target.dataset.index;
      _target.closest('animate-slideshow').customSelectSlide(animateSlideIndex);
    }
  }, 50);

  if (_target.classList.contains('images-with-text-carousel--item')) {
    // _target.style.clipPath = 'polygon(-100% 0%, 100% 0%, 100% 100%, -25% 100%)';
  }
});

document.addEventListener('shopify:block:deselect', (event) => {
  let _target = event.target;
});


function parallaxAnimation() {
  setTimeout(() => {
    if (window.innerWidth < 789) {
      return; // Exit the function early for mobile devices
    }

    const elements = document.querySelectorAll('[data-parallax-speed]');

    elements.forEach((t) => {
      let speed = parseFloat(t.getAttribute('data-parallax-speed'));
      if (isNaN(speed)) {
        return;
      }
      if (window.innerWidth < 1344 && t.classList.contains('verticale-label')) {
        speed = speed === 0.9 ? 0.2 : speed === -0.9 ? -0.4 : speed;
      }
      if (window.innerWidth >= 1344 && t.classList.contains('verticale-label')) {
        speed *= 1.9;
      }
      gsap.to(t, {
        y: () => -(window.innerHeight * speed) * 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: t,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }, 500);
}
window.addEventListener('resize', parallaxAnimation);

function shippingconversion() {
  const cartElement = document.querySelector('[data-cart-shippingbar]');
  if (cartElement) {
    const cartTotal = cartElement.getAttribute('data-cart-total');
    const shippingRate = cartElement.getAttribute('data-cart-rate');
    const shippingPrice = cartElement.getAttribute('data-cart-shipping');
    const conversionRate = Shopify.currency.rate || 1; // Get the current conversion rate
    const shippingRateInCurrentCurrency = Math.round(shippingRate * conversionRate);
    const cartTotalInCurrentCurrency = Math.round(cartTotal * conversionRate);
    const shippingPriceInCurrentCurrency = Math.round(shippingPrice * conversionRate);

    let adjustedShippingPercentage = (cartTotalInCurrentCurrency * 100) / shippingRateInCurrentCurrency;
    adjustedShippingPercentage =
      adjustedShippingPercentage > 100 ? 100 : Math.abs(adjustedShippingPercentage).toFixed(2);

    document
      .querySelector('[data-cart-wrapper]')
      .style.setProperty('--progress_width', `${adjustedShippingPercentage}%`);

    const shippingBarElement = document.querySelector('[data-cart-shippingbar]');
    if (shippingBarElement) {
      shippingBarElement.setAttribute('data-barwidth', `${adjustedShippingPercentage}%`);
    }
  }
}

class StickyFilterButton extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest('.shopify-section');
    this.handleScroll();
    setTimeout(() => {
      this.toggleButton = this.querySelector('.filter-toggle-button');
      this.filterSection = document.querySelector('[data-sticky-filter]');
      this.toggleButton.addEventListener('click', this.toggleFilter.bind(this));

    }, 500);
  }
  connectedCallback() {
    window.addEventListener('scroll', this.handleScroll.bind(this));

  }
  handleScroll() {
    const windowHeight = window.innerHeight;
    const sectionRect = this.section.getBoundingClientRect();
    const sectionRect1 = this.section.querySelector('[data-collections-grid]').getBoundingClientRect();

    const threshold = 300;
    const bottom = sectionRect1.bottom - threshold;
    if (sectionRect1.top <= 0 && bottom > 0) {
      if (!this.classList.contains('fade-in-sticky')) {
        this.classList.add('fade-in-sticky');
      }
    } else {
      if (this.classList.contains('fade-in-sticky')) {
        this.classList.remove('fade-in-sticky');
        if (this.querySelector('[data-sticky-filter]').classList.contains('open')) {
          this.querySelector('[data-sticky-filter]').classList.remove('open');
        }
        const buttons = document.querySelector('[data-sticky-toggle-button]');
        const openBtn = buttons.querySelector('.open-icon');
        const closeBtn = buttons.querySelector('.close-icon');
        if (openBtn.classList.contains('hidden')) {
          openBtn.classList.remove('hidden');
        }
        if (!closeBtn.classList.contains('hidden')) {
          closeBtn.classList.add('hidden');
        }
      }
    }
  }
  toggleFilter() {
    var openButton = this.toggleButton.querySelector('.open-icon');
    var closeButton = this.toggleButton.querySelector('.close-icon');
    // Toggle the 'open' class to trigger the animation
    this.filterSection.classList.toggle('open');
    if (this.filterSection.classList.contains('open')) {

      openButton.classList.add('hidden');
      closeButton.classList.remove('hidden');
    } else {
      openButton.classList.remove('hidden');
      closeButton.classList.add('hidden');
    }
  }


  disconnectedCallback() {
    this.toggleButton.removeEventListener('click', this.toggleFilter);
  }
}

customElements.define('sticky-filter-button', StickyFilterButton);

class CollectionProduct extends HTMLElement {
  constructor() {
    super();
    this.productGrid = this.querySelectorAll('[data-product-grid]');

    this.productGrid.forEach((item) => {
      const caption = item.querySelector('[data-discover-caption]');
      if (caption) {
        caption.addEventListener('click', () => this.toggleClass(item));
      }
    });
  }

  toggleClass(item) {
    const parentElement = item.closest('[data-product-grid]');

    if (parentElement.classList.contains('active-grid')) {
      parentElement.classList.remove('active-grid')
      return;
    }


    this.productGrid.forEach((item) => {
      if (item.classList.contains('active-grid')) {
        item.classList.remove('active-grid');
      }
    });

    if (parentElement) {
      parentElement.classList.add('active-grid');
    }
  }
}

customElements.define('collection-product-grid', CollectionProduct);
