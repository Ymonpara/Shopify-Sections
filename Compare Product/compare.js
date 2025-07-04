let compareHandles = JSON.parse(localStorage.getItem('compareHandles')) || [];
let compareList = [];

// Save to localStorage
function saveCompareHandles() {
  localStorage.setItem('compareHandles', JSON.stringify(compareHandles));
}

// Format money
window.Shopify = window.Shopify || {};
Shopify.formatMoney = function(cents) {
  return '$' + (cents / 100).toFixed(2);
};

// Fetch product by handle
function fetchProductData(handle) {
  return fetch(`/products/${handle}.js`).then(res => res.json());
}

// Render compare popup
function renderCompareProducts() {
  const container = document.querySelector('.compare-products-container');
  container.innerHTML = '';

  if (compareList.length === 0) {
    document.getElementById('compare-popup').classList.add('d-none');
    return;
  }

  document.getElementById('compare-popup').classList.remove('d-none');

  compareList.forEach(product => {
    const available = product.variants.some(v => v.available) ? 'In Stock' : 'Out of Stock';
    const imageUrl = product.featured_image || '';

    const variants = product.variants.map(v => `
      <li>${v.title} - ${Shopify.formatMoney(v.price)}</li>
    `).join('');

    const productHTML = `
      <div class="compare-product" data-handle="${product.handle}">
        <button class="remove-product">×</button>
        <img src="${imageUrl}" alt="${product.title}" style="width: 100%; height: auto; margin-bottom: 10px;">
        <h4>${product.title}</h4>
        <p><strong>Price:</strong> ${Shopify.formatMoney(product.price)}</p>
        <p><strong>Type:</strong> ${product.type}</p>
        <p><strong>Vendor:</strong> ${product.vendor}</p>
        <p><strong>Availability:</strong> ${available}</p>
        <ul>${variants}</ul>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', productHTML);
  });
}

// Update button text for compare buttons
function updateCompareButtons() {
  document.querySelectorAll('.compare-toggle').forEach(button => {
    const handle = button.getAttribute('data-handle');
    if (compareHandles.includes(handle)) {
      button.textContent = 'Remove from Compare';
      button.classList.add('in-compare');
    } else {
      button.textContent = 'Add to Compare';
      button.classList.remove('in-compare');
    }
  });
}

// Load compare list from localStorage on page load
function loadCompareList() {
  if (compareHandles.length === 0) return;

  Promise.all(compareHandles.map(fetchProductData)).then(products => {
    compareList = products;
    renderCompareProducts();
    updateCompareButtons();
  });
}

// Event Listeners
document.addEventListener('click', function (e) {
  // Toggle compare button
  if (e.target.classList.contains('compare-toggle')) {
    const btn = e.target;
    const handle = btn.getAttribute('data-handle');

    if (compareHandles.includes(handle)) {
      // Remove from compare
      compareHandles = compareHandles.filter(h => h !== handle);
      compareList = compareList.filter(p => p.handle !== handle);
      saveCompareHandles();
      renderCompareProducts();
      updateCompareButtons();
    } else {
      // Add to compare
      compareHandles.push(handle);
      saveCompareHandles();

      fetchProductData(handle).then(product => {
        compareList.push(product);
        renderCompareProducts();
        updateCompareButtons();
      });
    }
  }

  // Remove individual product from popup
  if (e.target.classList.contains('remove-product')) {
    const handle = e.target.closest('.compare-product').getAttribute('data-handle');
    compareHandles = compareHandles.filter(h => h !== handle);
    compareList = compareList.filter(p => p.handle !== handle);
    saveCompareHandles();
    renderCompareProducts();
    updateCompareButtons();
  }

  // Remove all products
  if (e.target.id === 'clear-compare') {
    compareHandles = [];
    compareList = [];
    saveCompareHandles();
    renderCompareProducts();
    updateCompareButtons();
  }
});

// On page load
document.addEventListener('DOMContentLoaded', () => {
  loadCompareList();
});