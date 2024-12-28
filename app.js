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
  const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');

  const sections = document.querySelectorAll('main section');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // 📌 Show Specific Section
  function showSection(sectionId) {
    sections.forEach(section => {
      // Always keep the video section visible
      if (section.id === 'video') {
        section.style.display = 'block';
        section.classList.add('active');
        return;
      }

      // Hide all other sections
      section.style.display = 'none';
      section.classList.remove('active');
    });

    const targetSection = document.querySelector(sectionId);

    if (targetSection) {
      targetSection.style.display = 'block';
      targetSection.classList.add('active');
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Hide Featured Products when Products section is active
    const featuredProductsSection = document.querySelector('#featured-products');
    if (sectionId === '#products') {
      featuredProductsSection.style.display = 'none';
      featuredProductsSection.classList.remove('active');
    } else {
      featuredProductsSection.style.display = 'block';
      featuredProductsSection.classList.add('active');
    }
  }

  /**
 * 📲 Open WhatsApp Chat with a Pre-Filled Message
 * @param {string} phoneNumber - The WhatsApp number (with country code, no + sign)
 * @param {string} message - Pre-filled message for the chat
 */
  function openWhatsAppChat(phoneNumber, message) {
    console.log("message is..",message);
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
  }


  // 📌 Navbar Link Click Handler
  navbarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');

      if (targetId.startsWith('#')) {
        showSection(targetId);
        navbarLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');

        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          bsCollapse.hide();
        }
      }
    });
  });

  // Toast Notification Function
  function showToast(type, message) {
    const toastEl = type === 'success' ? document.getElementById('successToast') : document.getElementById('errorToast');
    const toastMessageEl = type === 'success' ? document.getElementById('successToastMessage') : document.getElementById('errorToastMessage');

    toastMessageEl.textContent = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

  // 📌 Update Cart UI with Quantity Controls and Remove Button
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
    addRemoveEventListeners(); // Ensure remove event listeners are re-attached
  }

  // 📌 Add Event Listeners for Quantity Controls
  function addQuantityEventListeners() {
    // Increase Quantity
    document.querySelectorAll('.increase-qty').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
      });
    });

    // Decrease Quantity
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

    // Manual Quantity Update
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

  toggleBuyButton();
  // 📌 Add to Cart Function
  function addToCart(product) {
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    cartModal.show();
  }


  // 📌 Add Remove Button Event Listeners
  function addRemoveEventListeners() {
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        removeFromCart(index);
      });
    });
  }
  // 📌 Remove from Cart
  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showToast('success', 'Product removed from cart successfully!');
  }

  // 📌 Add to Cart from Buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const product = {
        name: button.dataset.productName,
        price: parseFloat(button.dataset.productPrice),
      };
      addToCart(product);
    });
  });

  // 📌 Add to Cart from Modal
  addToCartButtonModal.addEventListener('click', () => {
    const title = document.getElementById('productModalTitle').textContent;
    const price = parseFloat(document.getElementById('productModalPrice').textContent);
    addToCart({ name: title, price });
    productModal.hide();
  });

  // 📌 Attach WhatsApp Button Listeners
  document.querySelectorAll('.whatsapp-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const productName = button.dataset.productName || 'General Inquiry';
      const price = button.dataset.productPrice || '';
      const phoneNumber = '923420565171'; // Replace with your WhatsApp Business number

      let message = `Hello! I'm interested in *${productName}*`;
      if (price) {
        message += ` priced at Rs.${price}`;
      }

      openWhatsAppChat(phoneNumber, message);
    });
  });


  // 📌 Open Product Details Modal when Clicking on Card
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-cart') || e.target.closest('.whatsapp-button')) {
        return;
      }

      const title = card.dataset.title;
      const description = card.dataset.description;
      const price = card.dataset.price;
      const image = card.dataset.image;

      document.getElementById('productModalTitle').textContent = title;
      document.getElementById('productModalDescription').textContent = description;
      document.getElementById('productModalPrice').textContent = price;
      document.getElementById('productModalImageLarge').src = image;
      document.getElementById('productModalImageSmall1').src = image;
      document.getElementById('productModalImageSmall2').src = image;

      productModal.show();
    });
  });

  // 📌 Smooth Scrolling and Section Visibility
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href'); // Get the section ID
      const targetSection = document.querySelector(targetId); // Select the target section

      if (targetSection) {
        // Hide all sections
        document.querySelectorAll('main section').forEach(section => {
          section.classList.remove('active');
        });

        // Show target section
        targetSection.classList.add('active');

        // Smooth scroll to the target section considering navbar height
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        window.scrollTo({
          top: targetSection.offsetTop - navbarHeight - 20,
          behavior: 'smooth'
        });

        // Update active link styling
        document.querySelectorAll('.navbar-nav .nav-link').forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');

        // Collapse mobile navbar if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          bsCollapse.hide();
        }
      }
    });
  });


  // 📌 Navbar Cart Link Logic
  document.querySelector('.navbar-nav .nav-link[href="#cart"]').addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.show();

    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      bsCollapse.hide();
    }
  });

  // 📌 Validate Contact Number
  function validateContactNumber(contactNumber) {
    const contactPattern = /^[0-9]{10,15}$/; // Only digits, 10-15 characters
    return contactPattern.test(contactNumber);
  }

  // 📌 Smooth Scroll to Contact Section from "Get in Touch" Button
  document.querySelector('.btn[href="#contact"]').addEventListener('click', (e) => {
    e.preventDefault();

    const targetSection = document.querySelector('#contact');
    if (targetSection) {
      // Ensure other sections are hidden
      document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
      });

      // Show and scroll to the Contact section
      targetSection.classList.add('active');
      targetSection.style.display = 'block';

      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      window.scrollTo({
        top: targetSection.offsetTop - navbarHeight - 20,
        behavior: 'smooth'
      });
    }
  });

  // 📌 Smooth Scroll to Featured Products from "Shop Now" Button
  document.querySelectorAll('a[href="#featured-products"]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const targetSection = document.querySelector('#featured-products');
      if (targetSection) {
        document.querySelectorAll('main section').forEach(section => {
          section.classList.remove('active');
          section.style.display = 'none';
        });

        targetSection.classList.add('active');
        targetSection.style.display = 'block';

        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        window.scrollTo({
          top: targetSection.offsetTop - navbarHeight - 20,
          behavior: 'smooth'
        });
      }
    });
  });


  // 📌 Smooth Scroll to About Section from "Learn More" Button
  document.querySelector('.btn[href="#about"]').addEventListener('click', (e) => {
    e.preventDefault();

    const targetSection = document.querySelector('#about');
    if (targetSection) {
      // Hide all sections
      document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
      });

      // Show and scroll to the About section
      targetSection.classList.add('active');
      targetSection.style.display = 'block';

      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      window.scrollTo({
        top: targetSection.offsetTop - navbarHeight - 20,
        behavior: 'smooth'
      });
    }
  });


  document.getElementById('proceedToBuy').addEventListener('click', async () => {
    const customerName = document.getElementById('customerName').value.trim();
    const customerContact = document.getElementById('customerContact').value.trim();
    const customerLocation = document.getElementById('customerLocation').value.trim();
    const totalAmount = document.getElementById('grandTotal').textContent;
    const orderId = `ORDER-${Math.floor(Math.random() * 100000)}`;
  
    if (cart.length === 0) {
      showToast('error', 'Your cart is empty! Please add products before proceeding.');
      return;
    }
  
    const cartDetails = cart.map(item => `${item.name} (x${item.quantity}) - Rs.${item.price * item.quantity}`).join(', ');
  
    try {
      const response = await fetch('/api/whatsapp/send-whatsapp-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '+923420565171', // Replace with your test number
          orderId: orderId,
          customerName: customerName,
          customerContact: customerContact,
          customerLocation: customerLocation,
          totalAmount: totalAmount,
          items: cartDetails
        })
      });
  
      const result = await response.json();
  
      if (result.success) {
        showToast('success', 'Order details sent to WhatsApp!');
        clearCartAndForm();
      } else {
        throw new Error(result.error || 'Failed to send order details');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Failed to send order details');
    }
  });
  

  // 📌 Smooth Scroll to Home Section on Logo Click
  document.querySelector('.navbar-brand').addEventListener('click', (e) => {
    e.preventDefault();

    const targetSection = document.querySelector('#home');
    if (targetSection) {
      // Hide all sections
      document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
      });

      // Show and scroll to the Home section
      targetSection.classList.add('active');
      targetSection.style.display = 'block';

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Collapse mobile navbar if open
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      bsCollapse.hide();
    }

    // Update Active Link in Navbar
    document.querySelectorAll('.navbar-nav .nav-link').forEach(nav => nav.classList.remove('active'));
    document.querySelector('.navbar-nav .nav-link[href="#home"]').classList.add('active');
  });


  // 📌 Clear Cart and Order Form After Successful Purchase
  function clearCartAndForm() {
    // Clear Cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();

    // Clear Form Fields
    document.getElementById('customerName').value = '';
    document.getElementById('customerContact').value = '';
    document.getElementById('customerLocation').value = '';

    // Disable Buy Button
    toggleBuyButton();

    // Close Cart Modal
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartDetailsModal'));
    cartModal.hide();
  }

  // 📌 Disable Buy Button if Cart is Empty
  function toggleBuyButton() {
    const proceedToBuy = document.getElementById('proceedToBuy');
    proceedToBuy.disabled = cart.length === 0;
  }

  // 📌 Initialize Cart UI
  updateCartUI();

  // 📌 Default Section on Page Load
  const defaultSection = window.location.hash || '#home';
  showSection(defaultSection);
  document.querySelectorAll('main section').forEach(section => {
    section.classList.remove('active');
  });
  document.querySelector('#home').classList.add('active');
});
