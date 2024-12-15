document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    let cart = [];
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await fetch('get_products.php');
            const data = await response.json();
            
            if (data.success) {
                renderProducts(data.products);
            } else {
                productList.innerHTML = `<div class="col-12 text-center"><p>${data.message}</p></div>`;
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            productList.innerHTML = '<div class="col-12 text-center"><p>Error loading products</p></div>';
        }
    };

    // Render products
    const renderProducts = (products) => {
        productList.innerHTML = products.map(product => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card product-card">
                    <div id="carousel-${product.id}" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${product.images.map((img, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${img}" class="d-block w-100 product-image" alt="${product.name}">
                                </div>
                            `).join('')}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>Rs ${product.price}</strong></p>
                        <button class="btn btn-primary w-100 add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
        addCartListeners();
    };

    // Add event listeners to "Add to Cart" buttons
    const addCartListeners = () => {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                const productName = e.target.dataset.name;
                const productPrice = parseFloat(e.target.dataset.price);
                addToCart(productId, productName, productPrice);
            });
        });
    };

    // Add item to cart
    const addToCart = (id, name, price) => {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        updateCart();
    };

    // Update cart UI
    const updateCart = () => {
        cartItems.innerHTML = cart.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <strong>${item.name}</strong> (x${item.quantity})
                </div>
                <div>
                    Rs ${(item.price * item.quantity).toFixed(2)}
                    <button class="btn btn-sm btn-danger ms-2 remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.innerHTML = `<h5>Total: Rs ${total.toFixed(2)}</h5>`;

        addRemoveListeners();
    };

    // Add event listeners to "Remove" buttons
    const addRemoveListeners = () => {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                cart = cart.filter(item => item.id !== productId);
                updateCart();
            });
        });
    };

    // Handle checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert(`Thank you for your order! Total: Rs ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`);
        cart = [];
        updateCart();
    });

    // Fetch products on page load
    fetchProducts();
});
