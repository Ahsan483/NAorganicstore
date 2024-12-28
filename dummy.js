// 📌 Sticky Navbar on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('sticky', window.scrollY > 50);
  });
  
  // 📌 Document Ready
  document.addEventListener('DOMContentLoaded', () => {
    const cartCount = document.getElementById('cart-count');
    const cartModal = new bootstrap.Modal(document.getElementById('cartDetailsModal'));
    const productModal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
    const cartItemsTable = document.getElementById('cartItemsTable');
    const grandTotal = document.getElementById('grandTotal');
    const addToCartButtonModal = document.querySelector('.add-to-cart-modal');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const sections = document.querySelectorAll('main section');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // 📌 Path-to-Section Mapping
    const routeMap = {
      '/home': '#home',
      '/products': '#products',
      '/about': '#about',
      '/contact': '#contact',
      '/cart': '#cart'
    };
  
    // 📌 Show Specific Section Based on Path
    function showSectionFromPath(path) {
      const sectionId = routeMap[path] || '#home';
      showSection(sectionId);
    }
  
    // 📌 Show Specific Section
    function showSection(sectionId) {
      sections.forEach(section => {
        if (section.id === 'video') {
          section.style.display = 'block';
          section.classList.add('active');
          return;
        }
        section.style.display = 'none';
        section.classList.remove('active');
      });
  
      const targetSection = document.querySelector(sectionId);
      if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
  
        const navbarHeight = document.querySelector('.navbar').offsetHeight || 0;
        window.scrollTo({
          top: targetSection.offsetTop - navbarHeight - 20,
          behavior: 'smooth'
        });
  
        if (window.location.pathname !== sectionId) {
          history.pushState(null, '', Object.keys(routeMap).find(key => routeMap[key] === sectionId) || '/home');
        }
      }
    }
  
    // 📌 Handle Browser Back/Forward Button
    window.addEventListener('popstate', () => {
      showSectionFromPath(window.location.pathname);
    });
  
    // 📌 Toast Notification
    function showToast(type, message) {
      const toastEl = type === 'success' ? document.getElementById('successToast') : document.getElementById('errorToast');
      const toastMessageEl = type === 'success' ? document.getElementById('successToastMessage') : document.getElementById('errorToastMessage');
      toastMessageEl.textContent = message;
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  
    // 📌 Update Cart UI
    function updateCartUI() {
      cartItemsTable.innerHTML = '';
      let total = 0;
  
      cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItemsTable.innerHTML += `
          <tr>
            <td>${item.name}</td>
            <td>Rs. ${item.price}</td>
            <td>
              <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary decrease-qty" data-index="${index}">-</button>
                <input type="number" class="form-control text-center mx-1 cart-qty-input" 
                      value="${item.quantity}" min="1" data-index="${index}" style="width: 60px;">
                <button class="btn btn-sm btn-outline-secondary increase-qty" data-index="${index}">+</button>
              </div>
            </td>
            <td>Rs. ${item.price * item.quantity}</td>
            <td>
              <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Remove</button>
            </td>
          </tr>
        `;
      });
  
      grandTotal.textContent = total;
      cartCount.textContent = cart.length;
  
      toggleBuyButton();
      addQuantityEventListeners();
      addRemoveEventListeners();
    }
  
    // 📌 Add Quantity Event Listeners
    function addQuantityEventListeners() {
      document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          cart[index].quantity += 1;
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartUI();
        });
      });
  
      document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
          } else {
            showToast('error', 'Quantity cannot be less than 1');
          }
        });
      });
  
      document.querySelectorAll('.cart-qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
          const index = e.target.dataset.index;
          let newQuantity = parseInt(e.target.value, 10);
          if (isNaN(newQuantity) || newQuantity < 1) {
            showToast('error', 'Invalid Quantity');
            e.target.value = cart[index].quantity;
            return;
          }
          cart[index].quantity = newQuantity;
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartUI();
        });
      });
    }
  
    // 📌 Add/Remove Cart Event Listeners
    function addRemoveEventListeners() {
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartUI();
          showToast('success', 'Product removed from cart successfully!');
        });
      });
    }
  
    // 📌 Smooth Scrolling for Navbar Links
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = new URL(link.href).pathname;
        showSectionFromPath(path);
  
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          bsCollapse.hide();
        }
      });
    });
  
    // 📌 Cart Modal Logic
    document.querySelector('.navbar-nav .nav-link[href="/cart"]').addEventListener('click', (e) => {
      e.preventDefault();
      cartModal.show();
    });
  
    // 📌 Validate Contact Number
    function validateContactNumber(contactNumber) {
      return /^[0-9]{10,15}$/.test(contactNumber);
    }
  
    // 📌 Buy Button Click
    document.getElementById('proceedToBuy').addEventListener('click', () => {
      const customerContact = document.getElementById('customerContact').value.trim();
      if (!validateContactNumber(customerContact)) {
        showToast('error', 'Please enter a valid contact number.');
        return;
      }
      showToast('success', 'Your order has been placed successfully!');
      clearCartAndForm();
    });
  
    function clearCartAndForm() {
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    }
  
    // 📌 Initialize Default Section
    updateCartUI();
    showSectionFromPath(window.location.pathname);
  });
  