// shopify-wishlist.js - Complete Wishlist Solution
document.addEventListener('DOMContentLoaded', function() {
  class ShopifyWishlist {
    constructor() {
      this.key = 'shopify-wishlist-pro';
      this.init();
    }

    init() {
      this.setupEventDelegation();
      this.updateButtonStates();
      this.updateWishlistCount();
      this.displayWishlistItems();
    }

    // Main wishlist operations
    getWishlist() {
      return JSON.parse(localStorage.getItem(this.key)) || {};
    }

    saveWishlist(wishlist) {
      localStorage.setItem(this.key, JSON.stringify(wishlist));
      this.updateWishlistCount();
      this.updateButtonStates();
      this.displayWishlistItems();
    }

    addProduct(product) {
      const wishlist = this.getWishlist();
      if (!wishlist[product.variantId]) {
        wishlist[product.variantId] = {
          id: product.variantId,
          title: product.title,
          handle: product.handle,
          image: product.image,
          price: product.price,
          variantTitle: product.variantTitle
        };
        this.saveWishlist(wishlist);
        return true;
      }
      return false;
    }

    removeProduct(variantId) {
      const wishlist = this.getWishlist();
      if (wishlist[variantId]) {
        delete wishlist[variantId];
        this.saveWishlist(wishlist);
        return true;
      }
      return false;
    }

    // UI Updates
    updateButtonStates() {
      document.querySelectorAll('[data-variant-id]').forEach(button => {
        const variantId = button.dataset.variantId;
        const isInWishlist = this.isInWishlist(variantId);
        
        if (button.hasAttribute('data-wishlist-add')) {
          button.style.display = isInWishlist ? 'none' : '';
          button.disabled = false;
          button.innerHTML = button.dataset.defaultText || '♡ Add to Wishlist';
        } else if (button.hasAttribute('data-wishlist-remove')) {
          button.style.display = isInWishlist ? '' : 'none';
          button.disabled = false;
          button.innerHTML = button.dataset.defaultText || '♥ Remove from Wishlist';
        }
      });
    }

    updateWishlistCount() {
      const count = Object.keys(this.getWishlist()).length;
      document.querySelectorAll('.wishlist-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline-block' : 'none';
      });
    }

    // Wishlist Page Display
    displayWishlistItems() {
      const container = document.getElementById('wishlist-items');
      if (!container) return;

      const wishlist = this.getWishlist();
      container.innerHTML = '';

      if (Object.keys(wishlist).length === 0) {
        container.innerHTML = `
          <div class="empty-wishlist">
            <p>Your wishlist is empty</p>
            <a href="/collections/all" class="button">Continue Shopping</a>
          </div>
        `;
        return;
      }

      Object.values(wishlist).forEach(product => {
        const item = document.createElement('div');
        item.className = 'wishlist-item';
        item.dataset.variantId = product.id;
        item.innerHTML = `
          <div class="wishlist-item-image">
            <a href="/products/${product.handle}">
              <img src="${product.image}" alt="${product.title}" loading="lazy">
            </a>
          </div>
          <div class="wishlist-item-details">
            <h3><a href="/products/${product.handle}">${product.title}</a></h3>
            ${product.variantTitle ? `<div class="variant">${product.variantTitle}</div>` : ''}
            <div class="wishlist-item-price">${product.price}</div>
            <div class="wishlist-item-actions">
              <button class="wishlist-remove-btn" 
                      data-wishlist-remove 
                      data-variant-id="${product.id}">
                Remove
              </button>
              <form class="add-to-cart-form">
                <input type="hidden" name="id" value="${product.id}">
                <button type="submit" class="add-to-cart-btn">Add to Cart</button>
              </form>
            </div>
          </div>
        `;
        container.appendChild(item);
      });
    }

    // Event Handling
    setupEventDelegation() {
      // Add to wishlist
      document.body.addEventListener('click', (e) => {
        const addButton = e.target.closest('[data-wishlist-add]');
        if (addButton) {
          e.preventDefault();
          this.handleAddToWishlist(addButton);
        }
      });

      // Remove from wishlist (works for dynamically added elements)
      document.body.addEventListener('click', (e) => {
        const removeButton = e.target.closest('[data-wishlist-remove]');
        if (removeButton) {
          e.preventDefault();
          this.handleRemoveFromWishlist(removeButton);
        }
      });

      // Add to cart from wishlist
      document.body.addEventListener('submit', (e) => {
        const atcForm = e.target.closest('.add-to-cart-form');
        if (atcForm) {
          e.preventDefault();
          this.handleAddToCart(atcForm);
        }
      });
    }

    // Action Handlers
    handleAddToWishlist(button) {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<span class="wishlist-loading">Adding...</span>';
      button.disabled = true;

      const productData = {
        variantId: button.dataset.variantId,
        title: button.dataset.productTitle || '',
        handle: button.dataset.productHandle,
        image: button.dataset.productImage || '',
        price: button.dataset.productPrice || '',
        variantTitle: button.dataset.variantTitle || ''
      };

      setTimeout(() => {
        const added = this.addProduct(productData);
        this.showNotification(
          added ? `${productData.title} added to wishlist` : 'Already in wishlist',
          added ? 'success' : 'info'
        );
        button.innerHTML = originalHTML;
        button.disabled = false;
      }, 300);
    }

    handleRemoveFromWishlist(button) {
      const originalHTML = button.innerHTML;
      const variantId = button.dataset.variantId;
      button.innerHTML = '<span class="wishlist-loading">Removing...</span>';
      button.disabled = true;

      setTimeout(() => {
        this.removeProduct(variantId);
        this.showNotification('Item removed from wishlist', 'info');
        
        // Directly remove the item from view on wishlist page
        const wishlistItem = button.closest('.wishlist-item');
        if (wishlistItem) {
          wishlistItem.style.opacity = '0';
          setTimeout(() => {
            wishlistItem.remove();
            if (!document.querySelector('.wishlist-item')) {
              this.displayWishlistItems(); // Show empty state
            }
          }, 300);
        }
      }, 300);
    }

    handleAddToCart(form) {
      const button = form.querySelector('[type="submit"]');
      const originalText = button.textContent;
      button.textContent = 'Adding...';
      button.disabled = true;

      fetch('/cart/add.js', {
        method: 'POST',
        body: new FormData(form)
      })
      .then(response => response.json())
      .then(() => {
        button.textContent = 'Added!';
        this.updateCartCount();
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      })
      .catch(error => {
        console.error('Error:', error);
        button.textContent = 'Error';
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      });
    }

    // Helpers
    isInWishlist(variantId) {
      return !!this.getWishlist()[variantId];
    }

    updateCartCount() {
      fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
          document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = cart.item_count;
            el.style.display = cart.item_count > 0 ? 'inline-block' : 'none';
          });
        });
    }

    showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `wishlist-notification ${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => notification.classList.add('show'), 10);
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }

  // Initialize
  window.ShopifyWishlist = new ShopifyWishlist();
});