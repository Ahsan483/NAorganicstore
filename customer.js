document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products');
    let cart = [];

    // Fetch products from the server
    fetch('get_products.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const products = data.products;

                if (products.length === 0) {
                    productsContainer.innerHTML = '<p>No products available</p>';
                    return;
                }

                // Generate product cards dynamically
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');

                    productCard.innerHTML = `
                        <div class="product-slider">
                            <div class="slider-wrapper">
                                <img src="${product.images[0]}" alt="${product.name}" class="slider-image">
                                <button class="prev">&#10094;</button>
                                <button class="next">&#10095;</button>
                            </div>
                        </div>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <p class="product-price">Rs ${product.price}</p>
                        <button class="buy-now" data-id="${product.id}" data-price="${product.price}">Add to Cart</button>
                    `;

                    productsContainer.appendChild(productCard);

                    // Add slider functionality
                    const slider = productCard.querySelector('.product-slider');
                    let currentIndex = 0;
                    const images = product.images;
                    const sliderWrapper = slider.querySelector('.slider-wrapper');
                    const totalImages = images.length;

                    function updateSlider() {
                        if (totalImages > 0) {
                            if (currentIndex >= totalImages) currentIndex = 0;
                            if (currentIndex < 0) currentIndex = totalImages - 1;
                            sliderWrapper.querySelector('img').src = images[currentIndex];
                        }
                    }

                    slider.querySelector('.next').addEventListener('click', () => {
                        currentIndex++;
                        updateSlider();
                    });

                    slider.querySelector('.prev').addEventListener('click', () => {
                        currentIndex--;
                        updateSlider();
                    });

                    updateSlider();
                });

                // Add event listener to "Add to Cart" buttons
                const buyButtons = document.querySelectorAll('.buy-now');
                buyButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.dataset.id;
                        const productPrice = parseFloat(e.target.dataset.price);
                        addToCart(productId, productPrice);
                    });
                });
            } else {
                productsContainer.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(err => {
            console.error('Error fetching products:', err);
            productsContainer.innerHTML = '<p>Error loading products</p>';
        });

    function addToCart(productId, productPrice) {
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex !== -1) {
            cart[productIndex].quantity += 1;
        } else {
            cart.push({ id: productId, price: productPrice, quantity: 1 });
        }

        updateCartSummary();
    }

    function updateCartSummary() {
        const cartSummary = document.getElementById('cart-summary');
        const orderDetails = document.getElementById('order-details');
        orderDetails.innerHTML = '';

        let total = 0;

        cart.forEach(item => {
            const productRow = document.createElement('div');
            productRow.classList.add('product-row');
            productRow.innerHTML = `
                <span>Product ${item.id} (x${item.quantity})</span>
                <span>Rs ${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">
                    <img src="trash.png" alt="Remove" class="remove-icon" />
                </button>
                <button class="decrease-quantity" data-id="${item.id}">
                    <img src="cart.png" alt="Decrease Quantity" class="decrease-icon" />
                    <span>${item.quantity}</span>
                </button>
            `;
            orderDetails.appendChild(productRow);

            total += item.price * item.quantity;
        });

        const totalRow = document.createElement('div');
        totalRow.classList.add('total-row');
        totalRow.innerHTML = `<strong>Total: Rs ${total.toFixed(2)}</strong>`;
        orderDetails.appendChild(totalRow);

        cartSummary.classList.remove('hidden');


        document.getElementById('confirm-order').addEventListener('click', () => {
            showConfirmationPopup(total);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('button').dataset.id;
                cart = cart.filter(item => item.id !== productId);
                updateCartSummary();
            });
        });

        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('button').dataset.id;
                const productIndex = cart.findIndex(item => item.id === productId);

                if (productIndex !== -1 && cart[productIndex].quantity > 1) {
                    cart[productIndex].quantity -= 1;
                    updateCartSummary();
                }
            });
        });
    }

    function showConfirmationPopup(total) {
        const overlay = document.getElementById('overlay');

        overlay.classList.add('hidden');

        const confirmationPopup = document.getElementById('confirmation-popup');
        const orderSummary = document.getElementById('order-summary');

        orderSummary.innerText = `Your total order amount is Rs ${total.toFixed(2)}. Do you wish to proceed?`;
        confirmationPopup.classList.remove('hidden');
        overlay.classList.remove('hidden');
    }

    document.getElementById('confirm-popup').addEventListener('click', () => {
        const confirmationPopup = document.getElementById('confirmation-popup');
        const overlay = document.getElementById('overlay');

        confirmationPopup.classList.add('hidden');
        overlay.classList.add('hidden');

        showCustomerForm();
    });

    function showCustomerForm() {

        const customerForm = document.getElementById('customer-form');
        const overlay = document.getElementById('overlay');

        customerForm.classList.remove('hidden');
        overlay.classList.remove('hidden');



        document.getElementById('details-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                first_name: document.getElementById('first-name').value,
                last_name: document.getElementById('last-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                cart: cart, // Include cart details
            };

            try {
                const response = await fetch('save_order.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                if (result.success) {
                    alert('Order confirmed and saved successfully!');
                    customerForm.classList.add('hidden');
                    overlay.classList.add('hidden');
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error saving order:', error);
                alert('Failed to save order. Please try again later.');
            }
        });
    }

});