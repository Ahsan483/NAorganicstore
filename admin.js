document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const orderList = document.getElementById('order-list');
    fetch('get_orders.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Check the data returned from the server
            if (data.success) {
                // Loop through orders and display them
                data.orders.forEach(order => {
                    const orderNotification = document.createElement('div');
                    orderNotification.classList.add('order-notification');

                    // Create an inner div for cart details
                    const cartDetails = document.createElement('div');
                    cartDetails.classList.add('cart-details');

                    // Check if the order has cart details
                    if (order.cart && order.cart.length > 0) {
                        const cartItems = order.cart.map(item => `
                            <li>
                                <strong>${item.product_name}</strong> - 
                                Quantity: ${item.quantity}, 
                                Price: $${item.price.toFixed(2)}
                            </li>
                        `).join('');
                        cartDetails.innerHTML = `
                            <ul>
                                <strong>Cart Items:</strong>
                                ${cartItems}
                            </ul>
                        `;
                    } else {
                        cartDetails.innerHTML = `<em>No cart items found for this order.</em>`;
                    }

                    orderNotification.innerHTML = `
                        <strong>New Order:</strong><br>
                        Order ID: ${order.id}<br>
                        Customer Name: ${order.first_name} ${order.last_name}<br>
                        Email: ${order.email}<br>
                        Phone: ${order.phone}<br>
                        Address: ${order.address}<br>
                        Order Date: ${order.created_at}<br>
                    `;
                    
                    // Append cart details to the order
                    orderNotification.appendChild(cartDetails);
                    orderList.appendChild(orderNotification);
                });
            } else {
                console.error('Error fetching orders:', data.message);
            }
        })
        .catch(err => console.error('Error:', err));

    // The rest of your product form code here (unchanged)
    const productForm = document.getElementById('product-form');
    const productImageInput = document.getElementById('product-images');
    const imagePreviewContainer = document.createElement('div'); // Container for image slider

    imagePreviewContainer.classList.add('image-slider');
    productForm.appendChild(imagePreviewContainer);

    productImageInput.addEventListener('change', (e) => {
        imagePreviewContainer.innerHTML = ''; // Clear previous previews

        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(event) {
                const imgElement = document.createElement('img');
                imgElement.src = event.target.result;
                imgElement.alt = `Product Image ${i + 1}`;
                imgElement.classList.add('slider-image');

                imagePreviewContainer.appendChild(imgElement);
            }

            reader.readAsDataURL(file);
        }
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const description = document.getElementById('product-description').value;
        const imageFiles = productImageInput.files;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);

        // Append each image to the FormData object
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images[]', imageFiles[i]);
        }

        fetch('add_product.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                productForm.reset();
                imagePreviewContainer.innerHTML = ''; // Clear the preview after submission
            })
            .catch(err => console.error('Error:', err));
    });
});
