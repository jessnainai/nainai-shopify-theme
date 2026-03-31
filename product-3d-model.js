if (!customElements.get('product-model')) {
  customElements.define(
    'product-model',
    class ProductModel extends HTMLElement {
      constructor() {
        super();
        this.model = this.querySelector('model-viewer');
        this.closeButton = this.querySelector('.close-product-model');
        this.modelViewerUI = null;
        this.slider = this.closest(
          'media-gallery,swiper-content.main--product-media,swiper-content.quickview--product-media,swiper-content'
        );
        this.loadContent();
      }

      loadContent() {
        Shopify.loadFeatures([
          {
            name: 'model-viewer-ui',
            version: '1.0',
            onLoad: function () {
              this.modelViewerUI = new Shopify.ModelViewerUI(this.model);
              this.model.addEventListener(
                'shopify_model_viewer_ui_toggle_play',
                function () {
                  this.closeButton.classList.remove('hidden');
                  if (this.slider) {
                    this.slider._draggable(false);
                  }
                }.bind(this)
              );

              this.model.addEventListener(
                'shopify_model_viewer_ui_toggle_pause',
                function () {
                  this.closeButton.classList.add('hidden');
                  if (this.slider) {
                    this.slider._draggable(true);
                  }
                }.bind(this)
              );

              this.closeButton.addEventListener(
                'click',
                function () {
                  console.log('clicked on the Closebutton');
                  if (this.model) {
                    this.pauseModel();
                  }
                }.bind(this)
              );
            }.bind(this),
          },
        ]);
      }

      /*pauseModel() {
        // Check if modelViewerUI is initialized and if pause() exists
        if (this.modelViewerUI && typeof this.modelViewerUI.pause === 'function') {
          this.modelViewerUI.pause();
        } else {
          console.warn('modelViewerUI is not initialized or does not have a pause() function');
        }
      }*/

      pauseModel() {
        // Check if modelViewerUI is initialized and if pause() exists
        if (this.modelViewerUI && typeof this.modelViewerUI.pause === 'function') {
          this.modelViewerUI.pause(); // Call the pause function if it exists
        } else if (this.model && typeof this.model.pause === 'function') {
          // Fallback: check if the model-viewer element itself has a pause method
          this.model.pause();
        } else {
          console.warn('modelViewerUI is not initialized or does not have a pause() function');
        }
      }

    }
  );
}

window.ProductModel = {
  loadShopifyXR() {
    Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: this.setupShopifyXR.bind(this),
      },
    ]);
  },

  setupShopifyXR(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', () => this.setupShopifyXR());
      return;
    }

    document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
      window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
      modelJSON.remove();
    });
    window.ShopifyXR.setupXRElements();
  },
};

window.addEventListener('DOMContentLoaded', () => {
  if (window.ProductModel) window.ProductModel.loadShopifyXR();
});
