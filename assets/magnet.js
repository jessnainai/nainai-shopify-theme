theme.MagnetButton = (function () {
  class MagnetButton {
    constructor(container, magnetStrength = 0.15) {
      this.container = container;
      this.child = this.container.children[0]; // Cache reference to child
      this.magnetStrength = magnetStrength; // Similar to "this.magnet" in the Motion example
      this.animationFrame = null; // For canceling animations
      this.currentX = 0; // Store current X position
      this.currentY = 0; // Store current Y position
      this.targetX = 0; // Target X position for animation
      this.targetY = 0; // Target Y position for animation
    }

    load() {
      this.addEventListeners();
    }

    addEventListeners() {
      this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.container.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    handleMouseMove(e) {
      const pos = this.container.getBoundingClientRect();
      const mx = (e.clientX - pos.left) / this.container.offsetWidth - 0.5;
      const my = (e.clientY - pos.top) / this.container.offsetHeight - 0.5;

      this.targetX = mx * this.magnetStrength * this.container.offsetWidth;
      this.targetY = my * this.magnetStrength * this.container.offsetHeight;

      this.animate(); // Start the animation
    }

    handleMouseLeave() {
      this.targetX = 0;
      this.targetY = 0;

      this.animate(); // Reset animation
    }

    animate() {
      if (this.animationFrame) cancelAnimationFrame(this.animationFrame);

      const easing = 0.15; // Easing factor (spring-like effect)
      const dx = this.targetX - this.currentX;
      const dy = this.targetY - this.currentY;

      this.currentX += dx * easing;
      this.currentY += dy * easing;

      this.container.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
      this.child.style.transform = `translate(${this.currentX * 0.2}px, ${this.currentY * 0.2}px)`; // Slightly reduced for child

      // Continue animation if not yet settled
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
      }
    }

    onKeyDown(e) {
      this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
      let focusableElements;
      if (
        this.container.querySelector('[data-drawer="newsletter-popup"]') ||
        this.container.dataset.drawerPanel != undefined
      ) {
        focusableElements = 'a, button, input';
      } else if (this.container.dataset.drawer == 'quick-view-drawer') {
        focusableElements = 'a, button, select, textarea';
      } else {
        focusableElements = 'a, button, input, select, textarea';
      }

      const firstFocusableElement = this.container.querySelector(focusableElements);
      const focusableContent = this.container.querySelectorAll(focusableElements);
      const logoFocus = this.container.querySelector('[data-age-declined] a');
      const lastFocusableElement = focusableContent[focusableContent.length - 1];
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
      if (!isTabPressed) return;
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (this.container.querySelector('[data-age-verifier]')) {
          if (document.activeElement == this.container.querySelector('[data-submit-age]')) {
            firstFocusableElement.focus();
            e.preventDefault();
          } else if (document.activeElement === lastFocusableElement) {
            if (logoFocus) {
              logoFocus.focus();
            } else {
              lastFocusableElement.focus();
            }
            e.preventDefault();
          }
        } else if (this.container.dataset.drawer == 'account-drawer') {
          if (e.target.closest('form')) {
            const lastFocusableElemnts = e.target.closest('form').querySelectorAll('account-event a');
            const lastFocusableElemnt = lastFocusableElemnts[lastFocusableElemnts.length - 1];
            if (document.activeElement === lastFocusableElemnt) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    }
  }

  return MagnetButton;
})();

theme.OnScroll = (function () {
  class OnScroll {
    constructor(container) {
      this.container = container;
      this.triggered = false;
    }

    scroll(scrollElement) {
      if (scrollElement && scrollElement.querySelector('a')) {
        let nextUrl = scrollElement.querySelector('a').getAttribute('href');
        let product_count = scrollElement.querySelector('a').getAttribute('data-product-count');
        let page_count = scrollElement.querySelector('a').getAttribute('data-current-page');
        let total_product_count = scrollElement.querySelector('a').getAttribute('data-total-product');
        if (isOnScreen(scrollElement) && this.triggered == false) {
          this.triggered = true;
          scrollElement.querySelector('a').remove();
          if (scrollElement.querySelector('[data-infinite-scroll]')) {
            scrollElement.querySelector('[data-infinite-scroll]').classList.remove('hidden');
          }
          this.fetchFilterData(nextUrl).then((responseText) => {
            const resultData = new DOMParser().parseFromString(responseText, 'text/html');
            if (resultData.querySelector('[data-scroll-event]')) {
              document.querySelector('[data-scroll-event]').innerHTML =
                resultData.querySelector('[data-scroll-event]').innerHTML;
            } else if (resultData.querySelector('[data-load-more]')) {
              document.querySelector('[data-load-more]').innerHTML =
                resultData.querySelector('[data-load-more]').innerHTML;
            } else {
              scrollElement.remove();
            }
            let html = resultData.querySelector('[main-collection-products]');
            if (html.querySelector('[data-applied-filters]')) {
              html.removeChild(html.querySelector('[data-applied-filters'));
            }
            let elmnt = document.querySelector('[main-collection-products]');
            /* Result for the collection and search page */
            if (html) {
              elmnt.innerHTML += html.innerHTML;
              this.triggered = false;
            }
            var product_counts = product_count * (parseInt(page_count) + parseInt(1));
            let limitHtml = document.querySelector('[data-total-products-count]');

            if (product_counts > total_product_count) {

              limitHtml.textContent = total_product_count + '/' + total_product_count;
            } else {

              limitHtml.textContent = product_counts + '/' + total_product_count;
            }

          });
        }
      }
    }

    fetchFilterData(url) {
      return fetch(url).then((response) => response.text());
    }
  }
  return OnScroll;
})();


document.addEventListener('keyup', function (event) {
  // close drawers/popup on keydown tab
  if (event.code && event.code.toUpperCase() === 'ESCAPE') {
    let popupModals = document.querySelectorAll('[data-drawer-popup]');
    popupModals.forEach((modal) => {
      if (modal.querySelector('video')) {
        modal.querySelector('video').pause();
      }
      modal.classList.remove('show');
      modal.style.display = ''; // Reset display property
    });
    document.body.classList.remove('overflow-hidden');
  }
});

class LoadMore extends HTMLElement {
  constructor() {
    super();
    this.onScroll = new theme.OnScroll(this);
    this.addEventListener('click', (e) => {
      e.preventDefault();
      this.onScroll.scroll(this);
    });
  }
}
customElements.define('load-more', LoadMore);
class DataScroll extends HTMLElement {
  constructor() {
    super();
    // Attach event listeners directly in the constructor
    window.addEventListener('load', () => {
      window.addEventListener('scroll', () => {
        const scrollElement = document.querySelector('[data-scroll-event]');
        if (scrollElement) {
          (this.onScroll = new theme.OnScroll(this)), this.onScroll.scroll(scrollElement);
        }
      });
    });
  }
}
customElements.define('data-scroll', DataScroll);

class CloseDrawer extends HTMLElement {
  constructor() {
    super();
    this.closebutton = this.querySelector('button');
    const closeDrawer = document.querySelectorAll('[data-close-drawer]');
    this.closebutton.addEventListener('click', this.onCloseButtonClick);
    closeDrawer.forEach((drawer) => drawer.addEventListener('click', this.onCloseButtonClick));
  }
  onCloseButtonClick() {
    this.drawer = this.closest('[shop-the-look-section]');
    if (this.drawer) {
      this.shopDrawer = this.drawer.querySelector('[data-shop-look-drawer]');
    }
    if (this.shopDrawer && this.drawer) {
      const blockId = this.shopDrawer.dataset.hotspot;
      const block = document.getElementById('hotspot-' + blockId);
      block.classList.add('active-drawer');
      block.querySelector('[data-shop-the-icon]').classList.remove('hidden');
      block.querySelector('.media').classList.add('hidden');

      setTimeout(() => {
        block.classList.remove('active-drawer');
        block.querySelector('[data-shop-the-icon]').classList.add('hidden');
        block.querySelector('.media').classList.remove('hidden');
      }, 4000);

      const element = document.querySelector('[data-drawer="shop-the-look-drawer-' + blockId + '"]');
      if (element.querySelector('video')) {
        element.querySelector('video').pause();
      }
    }

    if (this.closest('mobile-menu')) {
      this.closest('mobile-menu')
        .querySelectorAll('[data-mobile-item]')
        .forEach((item, index) => {
          item.classList.remove('animate');
        });
    }

    this.conatctDrawer = this.closest('[data-contact-drawer]');
    if (this.conatctDrawer) {
      this.blockId = this.dataset.block;
      document
        .querySelector('[data-drawer="product-query--drawer-' + blockId + '"]')
        .classList.remove('show', 'shadow');
      document.querySelector('[data-drawer="product-query--drawer-' + blockId + '"]').style.display = 'none';
    }

    const closestElement = this.closest('[data-drawer]');
    if (this.closest('[data-section-id="product-query--drawer"]')) {
      document.querySelectorAll('[data-section-id="product-query--drawer"]').forEach((drawer) => {
        drawer.classList.remove('show', 'shadow');
        drawer.style.display = 'none';
      });
    }

    closestElement.classList.remove('show', 'shadow');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      if (document.querySelector('[data-header-wrapper]')) {
        document.querySelector('[data-header-wrapper]').style.position = 'unset';
      }
      closestElement.style.display = 'none';
      // simar js start
      if (closestElement.dataset.drawer == 'cart-drawer') {
        const header = document.querySelector('[data-header-section');
        if (header && header.dataset.headerView == 'half-width-menu') {
          if (header.dataset.headerStickyType == 'sticky-none' && header.classList.contains('sticky-always')) {
            header.classList.remove('sticky-always');
          }
        }
      }
      // simar js end
    }, 400);

    const quickViewDrawer = this.closest('quick-view-drawer');
    if (quickViewDrawer) {
      Array.from(quickViewDrawer.querySelectorAll('video')).forEach(function (video) {
        video.pause();
      });
      Array.from(quickViewDrawer.querySelectorAll('.youtube_video,.youtube-video')).forEach(function (video) {
        video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
      });
      Array.from(quickViewDrawer.querySelectorAll('.vimeo_video,.vimeo-video')).forEach(function (video) {
        video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
      });
    }
  }
}
customElements.define('close-drawer', CloseDrawer);

class TabContent extends HTMLElement {
  constructor() {
    super();
    this.tabs = this.querySelectorAll('[data-tab]');
    this.tabs.forEach((item) => item.addEventListener('click', this.onTabClick.bind(this)));
  }

  onTabClick(event) {
    event.preventDefault();
    let activeTab = event.currentTarget.dataset.tab;
    this.tabs.forEach((item) => {
      item.classList.remove('active');
      let tab_content = item.dataset.tab + '-tab-content';
      document.querySelector(`[${tab_content}]`).classList.remove('active');
      document.querySelector(`[${tab_content}]`).classList.add('hidden');
    });
    let activeTabContent = `${activeTab}-tab-content`;
    document.querySelector(`[${activeTabContent}]`).classList.add('active');
    document.querySelector(`[${activeTabContent}]`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
    let view_all_results_link = document.querySelector('[view-all-search-results]');
    let link_href = view_all_results_link.getAttribute('href');
    let link_url = new URL(link_href, window.location.origin);
    if (activeTab == 'collection') {
      activeTab = 'product';
    }
    link_url.searchParams.set('type', activeTab); // Change 'type' to 'newtype'
    view_all_results_link.setAttribute('href', link_url.toString());
  }
}
customElements.define('tab-content', TabContent);

function setCookieValue(cookieValue, expireTime) {
  let date = new Date();
  date.setTime(date.getTime() + parseInt(expireTime) * 24 * 60 * 60 * 1000);
  Cookies.set(`is_${cookieValue}`, cookieValue, { expires: date, path: '/' });
}

class PasswordFacet extends HTMLElement {
  constructor() {
    super();
    if (document.querySelector('[data-form-error]')) {
      const popupModal = document.querySelector('[data-password-form-popup]');
      setTimeout(() => {
        popupModal.classList.add('show');
        document.body.classList.add('overflow-hidden');
      }, 400);
      popupModal.style.display = 'flex';
    }
    this.querySelector('button').addEventListener('click', this.init.bind(this));
    // (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
  }

  init(e) {
    const popupModal = document.querySelector('popup-modal');
    popupModal.modalPopupOpen('data-password-form-popup');
  }
}
customElements.define('password-facet', PasswordFacet);

class SearchDrawer extends HTMLElement {
  constructor() {
    super();
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
  }
}
customElements.define('search-drawer', SearchDrawer);

class AccountDrawer extends HTMLElement {
  constructor() {
    super();
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
  }
}
customElements.define('account-drawer', AccountDrawer);

class popupModal extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[popup-content-body]');
    this.querySelectorAll('[data-popup-close]').forEach((item) => {
      item.addEventListener('click', this.modalPopupClose.bind(this));
      // item.addEventListener('touchend', this.modalPopupClose.bind(this));
    });
    // document.addEventListener('keydown', this.trapTabKey.bind(this));
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
  }

  modalPopupClose(e) {


    if (!Shopify.designMode) {
      if (e == 'newsletterPopup') {
      } else {
        let target_popup = e.target.closest('[data-popup-modal]');
        if (target_popup && target_popup.dataset.newsletterPopup !== undefined) {
          let newsletterCookieTime = document.querySelector('input[name="newsletterCookieValue"]').value;
          setCookieValue('newsletter_popup_closed', newsletterCookieTime);
        }
      }
    }
    let popupModals = document.querySelectorAll('[data-popup-modal]');
    popupModals.forEach((modal) => {
      if (modal.querySelector('video')) {
        modal.querySelector('video').pause();
      }
      modal.classList.remove('show');
      modal.style.display = 'none'; // Reset display property
    });
    document.body.classList.remove('overflow-hidden');
  }

  modalPopupOpen(popup) {

    setTimeout(() => {
      document.querySelector(`[${popup}]`).classList.add('show');
      document.body.classList.add('overflow-hidden');
      document.querySelector(`[${popup}]`).focus();
    }, 400);
    document.querySelector(`[${popup}]`).style.display = 'flex';
  }
}
customElements.define('popup-modal', popupModal);

class ageVerifier extends HTMLElement {
  constructor() {
    super();
    this.decline_btn = this.querySelector('[data-decline-age]');
    this.submit_btn = this.querySelector('[data-submit-age]');
    this.submit_incorrect = this.querySelector('[data-submit-incorrect]');
    this.decline_btn.addEventListener('click', this.ageDeclined.bind(this));
    this.submit_btn.addEventListener('click', this.ageSubmitted.bind(this));
    this.submit_incorrect.addEventListener('click', this.ageSubmittedIncorrect.bind(this));
    (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.onKeyDown();
  }

  ageDeclined() {
    this.querySelector('[data-age-verifier]').classList.add('hidden');
    this.querySelector('[data-age-declined]').classList.remove('hidden');
  }

  ageSubmittedIncorrect() {
    this.querySelector('[data-age-verifier]').classList.remove('hidden');
    this.querySelector('[data-age-declined]').classList.add('hidden');
    this.querySelector('[data-age-verifier] button').focus();
  }

  ageSubmitted() {
    this.style.display = 'none';
    var date = new Date();
    date.setTime(date.getTime() + parseInt('{{ section.settings.age_verify_popup_cookie }}') * 24 * 60 * 60 * 1000);
    Cookies.set('is_age_verified', 'age_verified', { expires: date, path: '/' });
  }
}
customElements.define('age-verifier', ageVerifier);



class MagnetArea extends HTMLElement {
  constructor() {
    // took 1 day to setup this js, satgur sir asked to remove this animation (06-07/June/2024)
    super();
    // (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.load();
    this.productId = this.dataset.productid;

    if (this.productId) {
      this.addEventListener('click', this.changeMedia.bind(this));
    }
  }
  changeMedia() {

    setTimeout(() => {
      this.dataIndex = this.closest('swiper-content')
        .querySelector('.swiper-slide-active')
        .getAttribute('data-swiper-slide-index');

      this.mainMedia = document.querySelector(`[data-product-slider=${this.productId}]`);

      if (this.mainMedia) {
        this.mainMedia?._selectSlide(parseInt(parseInt(this.dataIndex)));
      }
    }, 400);
  }
}
customElements.define('swiper-nav', MagnetArea);

class HoverLink extends HTMLAnchorElement {
  constructor() {
    super(), (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.load();
  }
}
customElements.define('hover-link', HoverLink, {
  extends: 'a',
});

class CustomListItem extends HTMLLIElement {
  constructor() {
    super(), (this.magnetButton = new theme.MagnetButton(this)), this.magnetButton.load();
  }
}

customElements.define('hover-li', CustomListItem, { extends: 'li' });

/*
class MagnetLink extends HoverLink {
  constructor() {
    super();
    // console.log('MagnetLink', this);
    // this.magnetButton = new theme.MagnetButton(this),
    // this.magnetButton.load()
  }

  connectedCallback() {
    this.addEventListeners(); 
  }

  addEventListeners() {
    console.log(this);

    this.addEventListener('mousemove', this.handleMouseMove);
    this.addEventListener('mouseleave', this.handleMouseLeave);

    const buttons = this.querySelectorAll('button');

    // buttons.forEach((el) => el.addEventListener('mousemove', this.handleMouseMove));
    // buttons.forEach((el) => el.addEventListener('mouseleave', this.handleMouseLeave));

    // document.addEventListener('mousemove', this.handleDocumentMouseMove);
  }

  handleMouseMove(e) {
    const pos = this.getBoundingClientRect();
    const mx = e.clientX - pos.left - pos.width / 2;
    const my = e.clientY - pos.top - pos.height / 2;

    this.style.transform = `translate(${mx * 0.15}px, ${my * 0.3}px)`;
    this.style.transform += `rotate3d(${mx * -0.1}, ${my * -0.3}, 0, 12deg)`;
    this.children[0].style.transform = `translate(${mx * 0.025}px, ${my * 0.075}px)`;
  }

  handleMouseLeave() {
    this.style.transform = 'translate3d(0px, 0px, 0px)';
    this.style.transform += 'rotate3d(0, 0, 0, 0deg)';
    this.children[0].style.transform = 'translate3d(0px, 0px, 0px)';
  }

  handleDocumentMouseMove(e) {
    // const cursor = document.querySelector('.cursor');
    // cursor.style.left = `${e.pageX - 25}px`;
    // cursor.style.top = `${e.pageY - 25}px`;
  }
}
customElements.define('magnet-link', MagnetLink, {
  extends: 'a',
});
*/
