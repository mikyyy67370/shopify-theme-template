// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Cart functions
const updateCart = async () => {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    
    // Update cart count
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = cart.item_count;
    });
    
    // Update cart total
    document.querySelectorAll('[data-cart-total]').forEach(el => {
      el.textContent = Shopify.formatMoney(cart.total_price);
    });
    
    return cart;
  } catch (error) {
    console.error('Error updating cart:', error);
  }
};

const removeFromCart = async (lineItem) => {
  try {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line: lineItem,
        quantity: 0
      })
    });
    
    await updateCart();
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};

// Product functions
const updateProductPrice = (variant) => {
  const priceElement = document.querySelector('[data-product-price]');
  const compareElement = document.querySelector('[data-product-compare]');
  
  if (priceElement) {
    priceElement.textContent = Shopify.formatMoney(variant.price);
  }
  
  if (compareElement) {
    if (variant.compare_at_price > variant.price) {
      compareElement.textContent = Shopify.formatMoney(variant.compare_at_price);
      compareElement.classList.remove('hidden');
    } else {
      compareElement.classList.add('hidden');
    }
  }
};

const updateProductImage = (variant) => {
  if (!variant.featured_image) return;
  
  const img = document.querySelector(`[data-product-image="${variant.featured_image.id}"]`);
  if (img) {
    const container = document.querySelector('[data-product-images]');
    container.querySelectorAll('[data-product-image]').forEach(el => {
      el.classList.add('hidden');
    });
    img.classList.remove('hidden');
  }
};

// Collection functions
const updateFilters = debounce(() => {
  const form = document.querySelector('[data-collection-filters]');
  if (!form) return;
  
  const formData = new FormData(form);
  const searchParams = new URLSearchParams(formData);
  const url = `${window.location.pathname}?${searchParams.toString()}`;
  
  window.history.replaceState({}, '', url);
  
  // Reload collection grid
  const grid = document.querySelector('[data-collection-grid]');
  if (grid) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newGrid = doc.querySelector('[data-collection-grid]');
        if (newGrid) {
          grid.innerHTML = newGrid.innerHTML;
        }
      });
  }
}, 500);

// Search functions
const initializeSearch = () => {
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  
  if (!searchInput || !searchResults) return;
  
  searchInput.addEventListener('input', debounce(async (e) => {
    const query = e.target.value;
    
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    
    try {
      const response = await fetch(`/search/suggest.json?q=${query}&resources[type]=product`);
      const data = await response.json();
      
      const products = data.resources.results.products;
      
      searchResults.innerHTML = products.map(product => `
        <a href="${product.url}" class="block p-4 hover:bg-gray-50">
          <div class="flex items-center">
            <img src="${product.featured_image.url}" alt="${product.title}" class="w-16 h-16 object-cover rounded">
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">${product.title}</h4>
              <p class="text-sm text-gray-500">${Shopify.formatMoney(product.price)}</p>
            </div>
          </div>
        </a>
      `).join('');
    } catch (error) {
      console.error('Search error:', error);
    }
  }, 300));
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeSearch();
  
  // Initialize quantity selectors
  document.querySelectorAll('[data-quantity-input]').forEach(input => {
    const min = parseInt(input.getAttribute('min')) || 1;
    const max = parseInt(input.getAttribute('max')) || 99;
    
    input.addEventListener('change', () => {
      const value = parseInt(input.value);
      if (isNaN(value) || value < min) input.value = min;
      if (value > max) input.value = max;
    });
  });
  
  // Initialize collection filters
  const filterForm = document.querySelector('[data-collection-filters]');
  if (filterForm) {
    filterForm.addEventListener('change', updateFilters);
  }
});

// Handle dynamic content updates
document.addEventListener('shopify:section:load', (event) => {
  const section = event.target;
  
  if (section.hasAttribute('data-section-type')) {
    switch (section.getAttribute('data-section-type')) {
      case 'collection':
        initializeSearch();
        break;
      case 'product':
        // Reinitialize product-specific functionality
        break;
    }
  }
});
