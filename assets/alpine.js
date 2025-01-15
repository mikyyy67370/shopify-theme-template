// Alpine.js configuration
document.addEventListener('alpine:init', () => {
  // Cart drawer functionality
  Alpine.store('cart', {
    isOpen: false,
    items: [],
    total: 0,
    
    toggle() {
      this.isOpen = !this.isOpen;
    },
    
    close() {
      this.isOpen = false;
    }
  });

  // Mobile menu functionality
  Alpine.store('mobileMenu', {
    isOpen: false,
    
    toggle() {
      this.isOpen = !this.isOpen;
    },
    
    close() {
      this.isOpen = false;
    }
  });

  // Search functionality
  Alpine.store('search', {
    isOpen: false,
    query: '',
    results: [],
    isLoading: false,
    
    toggle() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },
    
    async search() {
      if (this.query.length < 2) return;
      
      this.isLoading = true;
      try {
        const response = await fetch(`/search/suggest.json?q=${this.query}&resources[type]=product`);
        const data = await response.json();
        this.results = data.resources.results.products;
      } catch (error) {
        console.error('Search error:', error);
        this.results = [];
      } finally {
        this.isLoading = false;
      }
    }
  });

  // Product functionality
  Alpine.data('product', () => ({
    selectedVariant: null,
    quantity: 1,
    
    init() {
      this.selectedVariant = this.$refs.productForm.querySelector('[name="id"]').value;
    },
    
    async addToCart() {
      try {
        const formData = new FormData();
        formData.append('id', this.selectedVariant);
        formData.append('quantity', this.quantity);
        
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        // Update cart count and open cart drawer
        Alpine.store('cart').items.push(data);
        Alpine.store('cart').isOpen = true;
        
        // Show success notification
        this.$dispatch('show-notification', {
          type: 'success',
          message: 'Product added to cart'
        });
      } catch (error) {
        console.error('Add to cart error:', error);
        this.$dispatch('show-notification', {
          type: 'error',
          message: 'Could not add product to cart'
        });
      }
    }
  }));

  // Notification functionality
  Alpine.data('notifications', () => ({
    notifications: [],
    
    add(notification) {
      const id = Date.now();
      this.notifications.push({ ...notification, id });
      
      setTimeout(() => {
        this.remove(id);
      }, 5000);
    },
    
    remove(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    }
  }));
});
