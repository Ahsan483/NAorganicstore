window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  navbar.classList.toggle('sticky', window.scrollY > 50);
});

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
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    const featuredProductsSection = document.querySelector('#featured-products');
    if (sectionId === '#products') {
      featuredProductsSection.style.display = 'none';
      featuredProductsSection.classList.remove('active');
    } else {
      featuredProductsSection.style.display = 'block';
      featuredProductsSection.classList.add('active');
    }
  }

  function openWhatsAppChat(phoneNumber, message) {
    console.log("message is..",message);
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
  }

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

  function showToast(type, message) {
    const toastEl = type === 'success' ? document.getElementById('successToast') : document.getElementById('errorToast');
    const toastMessageEl = type === 'success' ? document.getElementById('successToastMessage') : document.getElementById('errorToastMessage');

    toastMessageEl.textContent = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

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

  toggleBuyButton();
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


  function addRemoveEventListeners() {
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        removeFromCart(index);
      });
    });
  }
  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showToast('success', 'Product removed from cart successfully!');
  }

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

  addToCartButtonModal.addEventListener('click', () => {
    const title = document.getElementById('productModalTitle').textContent;
    const price = parseFloat(document.getElementById('productModalPrice').textContent);
    addToCart({ name: title, price });
    productModal.hide();
  });

  document.querySelectorAll('.whatsapp-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const productName = button.dataset.productName || 'General Inquiry';
      const price = button.dataset.productPrice || '';
      const phoneNumber = '+923291945009'; 

      let message = `Hello! I'm interested in *${productName}*`;
      if (price) {
        message += ` priced at Rs.${price}`;
      }

      openWhatsAppChat(phoneNumber, message);
    });
  });


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

  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        document.querySelectorAll('main section').forEach(section => {
          section.classList.remove('active');
        });

        targetSection.classList.add('active');

        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        window.scrollTo({
          top: targetSection.offsetTop - navbarHeight - 20,
          behavior: 'smooth'
        });

        document.querySelectorAll('.navbar-nav .nav-link').forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');

        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          bsCollapse.hide();
        }
      }
    });
  });


  document.querySelector('.navbar-nav .nav-link[href="#cart"]').addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.show();

    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      bsCollapse.hide();
    }
  });

  function validateContactNumber(contactNumber) {
    const contactPattern = /^[0-9]{10,15}$/; 
    return contactPattern.test(contactNumber);
  }

  document.querySelector('.btn[href="#contact"]').addEventListener('click', (e) => {
    e.preventDefault();

    const targetSection = document.querySelector('#contact');
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


  document.querySelector('.btn[href="#about"]').addEventListener('click', (e) => {
    e.preventDefault();

    const targetSection = document.querySelector('#about');
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


  document.getElementById('proceedToBuy').addEventListener('click', async () => {
    const customerName = document.getElementById('customerName').value.trim();
    const customerContact = document.getElementById('customerContact').value.trim();
    const customerLocation = document.getElementById('customerLocation').value.trim();
    const totalAmount = document.getElementById('grandTotal').textContent;
    const orderId = `ORDER-${Math.floor(Math.random() * 100000)}`;
  
    if (!validateContactNumber(customerContact)) {
      showToast('error', 'Invalid contact number! It should be in the format: 0xxxxxxxx71.');
      return;
    }

    if (cart.length === 0) {
      showToast('error', 'Your cart is empty! Please add products before proceeding.');
      return;
    }
  
    const cartDetails = cart.map(item => `${item.name} (x${item.quantity}) - Rs.${item.price * item.quantity}`).join(', ');
  
    try {
      const response = await fetch('https://r2v8ixgsmi.execute-api.ap-south-1.amazonaws.com/api/whatsapp/send-whatsapp-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '+923291945009',
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
        console.log('Error:', result.error );
        throw new Error(result.error || 'Failed to send order details');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Failed to send order details');
    }
  });
  

  document.querySelector('.navbar-brand').addEventListener('click', (e) => {
    e.preventDefault();

    const targetSection = document.querySelector('#home');
    if (targetSection) {
      document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
      });

      targetSection.classList.add('active');
      targetSection.style.display = 'block';

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      bsCollapse.hide();
    }

    document.querySelectorAll('.navbar-nav .nav-link').forEach(nav => nav.classList.remove('active'));
    document.querySelector('.navbar-nav .nav-link[href="#home"]').classList.add('active');
  });


  function clearCartAndForm() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();

    document.getElementById('customerName').value = '';
    document.getElementById('customerContact').value = '';
    document.getElementById('customerLocation').value = '';

    toggleBuyButton();

    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartDetailsModal'));
    cartModal.hide();
  }

  function toggleBuyButton() {
    const proceedToBuy = document.getElementById('proceedToBuy');
    proceedToBuy.disabled = cart.length === 0;
  }

  updateCartUI();

  const defaultSection = window.location.hash || '#home';
  showSection(defaultSection);
  document.querySelectorAll('main section').forEach(section => {
    section.classList.remove('active');
  });
  document.querySelector('#home').classList.add('active');
});
