// Products data
const products = [
  {
      id: 1,
      name: "Red Velvet Cake",
      price: 500,
      description: "Soft, creamy, and rich red velvet delight.",
      image: "images/red.jpg"
  },
  {
      id: 2,
      name: "Chocolate Fudge Cake",
      price: 600,
      description: "Rich chocolate layers with creamy fudge.",
      image: "images/fudgecake.jpg"
  },
  {
      id: 3,
      name: "Glazed Donuts ",
      price: 250,
      description: "6 pieces of freshly glazed donuts.",
      image: "images/donuts.jpg"
  },
  {
      id: 4,
      name: "Fresh Croissants",
      price: 120,
      description: "Buttery croissants baked fresh every morning.",
      image: "images/croissants.jpg"
  },
  {
      id: 5,
      name: "Blueberry Muffins",
      price: 200,
      description: "Soft muffins filled with blueberries.",
      image: "images/muffin.jpg"
  },
  {
      id: 6,
      name: "Chocolate Chip Cookies",
      price: 180,
      description: "Crunchy outside, gooey inside.",
      image: "images/cookies.jpg"
  },
  {
      id: 7,
      name: "Creamy Cheesecake",
      price: 450,
      description: "Classic New York style cheesecake.",
      image: "images/cheescake.jpg"
  },
  {
      id: 8,
      name: "Strawberry Tart",
      price: 350,
      description: "Fresh strawberries with vanilla cream.",
      image: "images/tart.jpg"
  }
];


let orders = JSON.parse(localStorage.getItem('orders')) || [];
let orderIdCounter = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
let pendingOrder = null;

// Page navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
  document.getElementById(pageId + '-page').classList.remove('hidden');

  const heroSection = document.getElementById('hero-section');
  if (pageId === 'home') {
      heroSection.style.display = 'block';
  } else {
      heroSection.style.display = 'none';
  }

  if (pageId === 'myorders') {
      displayOrders();
  }
}


function displayProducts(container, productsToShow = products) {
  const grid = document.getElementById(container);
  grid.innerHTML = productsToShow.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image" style="background-image:url('${product.image}')">
        <div class="price-tag">₹${product.price}</div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', function(e) {
          const productId = this.getAttribute('data-product-id');
          showProductModal(productId);
      });
  });
}


function showProductModal(productId) {
  const product = products.find(p => p.id == productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  modal.querySelector('.modal-product-image').src = product.image;
  modal.querySelector('.modal-product-name').textContent = product.name;
  modal.querySelector('.modal-product-description').textContent = product.description;
  modal.querySelector('.modal-product-price').textContent = `₹${product.price}`;

  const orderBtn = modal.querySelector('.modal-order-btn');
  orderBtn.onclick = () => {
      orderProduct(product.id);
      closeModal('product-modal');
  };

  modal.style.display = 'block';
}

// Order product
function orderProduct(productId) {
  const product = products.find(p => p.id === productId);
  pendingOrder = {
      id: orderIdCounter++,
      product: product.name,
      price: product.price,
      type: 'regular',
      date: new Date().toLocaleDateString(),
      status: Math.random() > 0.5 ? 'Delivered' : 'Pending'
  };
  showOrderConfirmation();
}


function showOrderConfirmation() {
  document.getElementById('order-confirmation-modal').style.display = 'block';
}


function confirmOrder() {
  if (pendingOrder) {
      orders.push(pendingOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      closeModal('order-confirmation-modal');
      pendingOrder = null;
      showPage('myorders');
  }
}


document.addEventListener('DOMContentLoaded', function() {
  const customOrderForm = document.getElementById('custom-order-form');
  if (customOrderForm) {
      customOrderForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const cakeType = document.getElementById('cake-type').value;
          const size = document.getElementById('cake-size').value;
          const frosting = document.getElementById('frosting').value;
          const message = document.getElementById('cake-message').value;
          const instructions = document.getElementById('special-instructions').value;
          const deliveryDate = document.getElementById('delivery-date').value;

          const prices = {
              'small': 400,
              'medium': 700,
              'large': 1000
          };

          const sizeLabels = {
              'small': 'Small (1 lb)',
              'medium': 'Medium (2 lb)',
              'large': 'Large (3 lb)'
          };

          pendingOrder = {
              id: orderIdCounter++,
              product: `Custom ${cakeType.replace('-', ' ')} Cake (${sizeLabels[size]})`,
              price: prices[size],
              type: 'custom',
              date: new Date().toLocaleDateString(),
              deliveryDate: deliveryDate,
              message: message,
              frosting: frosting,
              instructions: instructions,
              status: Math.random() > 0.5 ? 'Delivered' : 'Pending'
          };
          showOrderConfirmation();
      });
  }
});


function filterOrders(status) {
  let filteredOrders = [];
  if (status === 'all') {
      filteredOrders = orders;
  } else {
      filteredOrders = orders.filter(order => order.status === status);
  }
  displayOrders(filteredOrders);
}

function displayOrders(ordersToShow = orders) {
  const container = document.getElementById('orders-container');
  const totalPriceElement = document.getElementById('total-price');

  if (ordersToShow.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #666; font-size: 18px; margin-top: 50px;">No orders found for this status.</p>';
      if (totalPriceElement) totalPriceElement.textContent = '₹0';
      return;
  }

  const totalPrice = ordersToShow.reduce((sum, order) => sum + order.price, 0);
  if (totalPriceElement) {
      totalPriceElement.textContent = `₹${totalPrice}`;
  }

  container.innerHTML = ordersToShow.map(order => `
    <div class="product-card" style="margin-bottom: 20px;">
      <div class="product-info">
        <h3>Order #${order.id}</h3>
        <p><strong>Product:</strong> ${order.product}</p>
        <p><strong>Price:</strong> ₹${order.price}</p>
        <p><strong>Order Date:</strong> ${order.date}</p>
        ${order.deliveryDate ? `<p><strong>Delivery Date:</strong> ${order.deliveryDate}</p>` : ''}
        ${order.message ? `<p><strong>Message:</strong> ${order.message}</p>` : ''}
        ${order.frosting ? `<p><strong>Frosting:</strong> ${order.frosting}</p>` : ''}
        ${order.instructions ? `<p><strong>Instructions:</strong> ${order.instructions}</p>` : ''}
        <p><strong>Status:</strong> <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></p>
      </div>
    </div>
  `).join('');
}


function showAboutModal() {
  document.getElementById('about-modal').style.display = 'block';
}

function showContactModal() {
  document.getElementById('contact-modal').style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}


window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
  }
}


document.addEventListener('DOMContentLoaded', function() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const deliveryDateInput = document.getElementById('delivery-date');
  if (deliveryDateInput) {
      deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
  }

  displayProducts('home-products-grid', products.slice(0, 3));
  displayProducts('all-products-grid');
  showPage('home');
});