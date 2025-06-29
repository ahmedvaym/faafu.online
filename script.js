 // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCqdg6ePdCGvlzHpaEFgOUFPaHEsPYIApw",
            authDomain: "operationinterectiondata.firebaseapp.com",
            databaseURL: "https://operationinterectiondata-default-rtdb.firebaseio.com",
            projectId: "operationinterectiondata",
            storageBucket: "operationinterectiondata.appspot.com",
            messagingSenderId: "211887231593",
            appId: "1:211887231593:web:aac4253ab20803876348f8",
            measurementId: "G-HSL5TF5FTB"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

        // App state
        let state = {
            cart: JSON.parse(localStorage.getItem('cart')) || {},
            currentPage: 'home',
            currentCategory: null,
            currentSearch: '',
            currentProduct: null,
            orderDetails: null,
            paymentMethod: null,
            uploadedFile: null,
            products: []
        };

        // DOM elements
        const mainContent = document.getElementById('mainContent');
        const cartCount = document.getElementById('cartCount');
        const cartLink = document.getElementById('cartLink');
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        const navLinks = document.querySelectorAll('.nav-link');
        const currentYear = document.getElementById('currentYear');
        const logoAnimation = document.getElementById('logoAnimation');
        const logoCircle = document.getElementById('logoCircle');

        // Initialize the app
        function init() {
            // Set current year in footer
            currentYear.textContent = new Date().getFullYear();

            // Add click event to logo animation
            logoCircle.addEventListener('click', () => {
                // Immediately fade out and hide the animation when clicked
                logoAnimation.style.animation = 'fadeOut 0.5s ease-in-out forwards';
                
                // Load products and page after animation completes
                setTimeout(() => {
                    logoAnimation.style.display = 'none';
                    loadProducts();
                }, 500);
            });

            // Auto-hide the animation after 3 seconds if not clicked
            setTimeout(() => {
                if (logoAnimation.style.display !== 'none') {
                    logoAnimation.style.animation = 'fadeOut 0.5s ease-in-out forwards';
                    setTimeout(() => {
                        logoAnimation.style.display = 'none';
                        loadProducts();
                    }, 500);
                }
            }, 3000);
            
            // Add event listeners for navigation
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = link.dataset.page;
                    const category = link.dataset.category;
                    
                    if (category) {
                        state.currentCategory = category;
                        state.currentSearch = '';
                        searchInput.value = '';
                    }
                    
                    loadPage(page);
                });
            });

            cartLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadPage('cart');
            });

            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                state.currentSearch = searchInput.value;
                state.currentCategory = null;
                loadPage('products');
            });
        }

        // Load products from Firebase
        function loadProducts() {
            database.ref('products').on('value', (snapshot) => {
                const productsData = snapshot.val();
                if (productsData) {
                    // Convert object to array
                    state.products = Object.keys(productsData).map(key => {
                        return { id: key, ...productsData[key] };
                    });
                    
                    // If no products in Firebase, add some sample products
                    if (state.products.length === 0) {
                        addSampleProducts();
                    } else {
                        if (state.currentPage) {
                            loadPage(state.currentPage);
                        }
                    }
                } else {
                    // If no products node exists, add sample products
                    addSampleProducts();
                }
            });
        }

        // Add sample products to Firebase
        function addSampleProducts() {
            const sampleProducts = [
                {
                    name: 'Wireless Earbuds',
                    price: 29.99,
                    original_price: 49.99,
                    image: 'https://via.placeholder.com/300x200?text=Wireless+Earbuds',
                    description: 'High-quality wireless earbuds with 20hr battery life.',
                    category: 'electronics',
                    featured: true
                },
                {
                    name: 'Smart Watch',
                    price: 59.99,
                    original_price: 79.99,
                    image: 'https://via.placeholder.com/300x200?text=Smart+Watch',
                    description: 'Fitness tracker with heart rate monitor and GPS.',
                    category: 'electronics',
                    featured: true
                },
                {
                    name: 'Summer Dress',
                    price: 19.99,
                    original_price: 29.99,
                    image: 'https://via.placeholder.com/300x200?text=Summer+Dress',
                    description: 'Lightweight summer dress in various colors.',
                    category: 'fashion',
                    featured: true
                },
                {
                    name: 'Garden Tool Set',
                    price: 39.99,
                    original_price: 49.99,
                    image: 'https://via.placeholder.com/300x200?text=Garden+Tools',
                    description: '8-piece garden tool set with storage bag.',
                    category: 'home',
                    featured: true
                },
                {
                    name: 'Robot Toy',
                    price: 24.99,
                    original_price: 34.99,
                    image: 'https://via.placeholder.com/300x200?text=Robot+Toy',
                    description: 'Programmable robot toy for kids.',
                    category: 'toys',
                    featured: false
                },
                {
                    name: 'Bluetooth Speaker',
                    price: 35.99,
                    original_price: 45.99,
                    image: 'https://via.placeholder.com/300x200?text=Bluetooth+Speaker',
                    description: 'Portable waterproof bluetooth speaker.',
                    category: 'electronics',
                    featured: false
                },
                {
                    name: 'Running Shoes',
                    price: 49.99,
                    original_price: 69.99,
                    image: 'https://via.placeholder.com/300x200?text=Running+Shoes',
                    description: 'Lightweight running shoes with cushioned soles.',
                    category: 'fashion',
                    featured: false
                },
                {
                    name: 'Air Fryer',
                    price: 79.99,
                    original_price: 99.99,
                    image: 'https://via.placeholder.com/300x200?text=Air+Fryer',
                    description: '5.5L digital air fryer with 8 preset functions.',
                    category: 'home',
                    featured: false
                }
            ];

            // Add each product to Firebase
            sampleProducts.forEach(product => {
                database.ref('products').push(product);
            });
        }

        // Load a page based on state
        function loadPage(page) {
            state.currentPage = page;
            
            switch(page) {
                case 'home':
                    renderHomePage();
                    break;
                case 'products':
                    renderProductsPage();
                    break;
                case 'product':
                    renderProductDetailPage();
                    break;
                case 'cart':
                    renderCartPage();
                    break;
                case 'checkout':
                    renderCheckoutPage();
                    break;
                case 'pending-review':
                    renderPendingReviewPage();
                    break;
                case 'order-confirmation':
                    renderOrderConfirmationPage();
                    break;
                default:
                    renderHomePage();
            }
            
            // Update active nav link
            updateActiveNavLink();
        }

        // Render home page
        function renderHomePage() {
            const featuredProducts = state.products.filter(product => product.featured);
            
            mainContent.innerHTML = `
                <section class="banner">
                    <div class="slider">
                        <div class="slide active">
                            <div class="banner-text">
                                <h2>Summer Sale!</h2>
                                <p>Up to 70% off selected items</p>
                                <a href="#" class="btn" id="saleBtn">Shop Now</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="categories">
                    <h2>Shop by Category</h2>
                    <div class="category-grid">
                        <a href="#" class="category-item" data-page="products" data-category="electronics">
                            <img src="https://via.placeholder.com/300x200?text=Electronics" alt="Electronics">
                            <h3>Electronics</h3>
                        </a>
                        <a href="#" class="category-item" data-page="products" data-category="fashion">
                            <img src="https://via.placeholder.com/300x200?text=Fashion" alt="Fashion">
                            <h3>Fashion</h3>
                        </a>
                        <a href="#" class="category-item" data-page="products" data-category="home">
                            <img src="https://via.placeholder.com/300x200?text=Home+Garden" alt="Home & Garden">
                            <h3>Home & Garden</h3>
                        </a>
                        <a href="#" class="category-item" data-page="products" data-category="toys">
                            <img src="https://via.placeholder.com/300x200?text=Toys" alt="Toys">
                            <h3>Toys</h3>
                        </a>
                    </div>
                </section>

                <section class="featured-products">
                    <h2>Featured Products</h2>
                    <div class="product-grid">
                        ${featuredProducts.length > 0 ? 
                            featuredProducts.map(product => `
                                <div class="product-card">
                                    <img src="${product.image}" alt="${product.name}">
                                    <h3>${product.name}</h3>
                                    <div class="price">
                                        <span class="current-price">$${product.price.toFixed(2)}</span>
                                        ${product.original_price > product.price ? 
                                            `<span class="original-price">$${product.original_price.toFixed(2)}</span>` : ''}
                                    </div>
                                    <div class="product-actions">
                                        <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                                        <button class="btn view-detail-btn" data-id="${product.id}">View Details</button>
                                    </div>
                                </div>
                            `).join('') :
                            '<p>No featured products available.</p>'
                        }
                    </div>
                </section>
            `;
            
            // Add event listeners to dynamically created elements
            document.querySelectorAll('.category-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.currentCategory = item.dataset.category;
                    state.currentSearch = '';
                    searchInput.value = '';
                    loadPage('products');
                });
            });
            
            document.querySelectorAll('.view-detail-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = btn.dataset.id;
                    viewProductDetail(productId);
                });
            });
            
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = btn.dataset.id;
                    addToCart(productId);
                    alert('Product added to cart!');
                });
            });
            
            document.getElementById('saleBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                state.currentCategory = null;
                state.currentSearch = '';
                searchInput.value = '';
                loadPage('products');
            });
        }

        // Render products page
        function renderProductsPage() {
            let filteredProducts = [...state.products];
            
            if (state.currentCategory) {
                filteredProducts = filteredProducts.filter(
                    product => product.category === state.currentCategory
                );
            }
            
            if (state.currentSearch) {
                const searchTerm = state.currentSearch.toLowerCase();
                filteredProducts = filteredProducts.filter(
                    product => product.name.toLowerCase().includes(searchTerm) || 
                               (product.description && product.description.toLowerCase().includes(searchTerm))
                );
            }
            
            mainContent.innerHTML = `
                <h1>${state.currentCategory ? state.currentCategory.charAt(0).toUpperCase() + state.currentCategory.slice(1) : 'Our Products'}</h1>

                <div class="product-filters">
                    <form id="filterForm">
                        <input type="text" id="filterSearch" placeholder="Search products..." 
                               value="${state.currentSearch}">
                        <select id="categoryFilter">
                            <option value="">All Categories</option>
                            <option value="electronics" ${state.currentCategory === 'electronics' ? 'selected' : ''}>Electronics</option>
                            <option value="fashion" ${state.currentCategory === 'fashion' ? 'selected' : ''}>Fashion</option>
                            <option value="home" ${state.currentCategory === 'home' ? 'selected' : ''}>Home & Garden</option>
                            <option value="toys" ${state.currentCategory === 'toys' ? 'selected' : ''}>Toys</option>
                        </select>
                        <button type="submit" class="btn">Filter</button>
                    </form>
                </div>

                <div class="product-listing">
                    <div class="product-grid">
                        ${filteredProducts.length > 0 ? 
                            filteredProducts.map(product => `
                                <div class="product-card">
                                    <img src="${product.image}" alt="${product.name}">
                                    <h3>${product.name}</h3>
                                    <div class="price">
                                        <span class="current-price">$${product.price.toFixed(2)}</span>
                                        ${product.original_price > product.price ? 
                                            `<span class="original-price">$${product.original_price.toFixed(2)}</span>` : ''}
                                    </div>
                                    <div class="product-actions">
                                        <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                                        <button class="btn view-detail-btn" data-id="${product.id}">View Details</button>
                                    </div>
                                </div>
                            `).join('') :
                            '<p>No products found matching your criteria.</p>'
                        }
                    </div>
                </div>
            `;
            
            // Add event listeners
            document.getElementById('filterForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                state.currentSearch = document.getElementById('filterSearch').value;
                state.currentCategory = document.getElementById('categoryFilter').value;
                loadPage('products');
            });
            
            document.querySelectorAll('.view-detail-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = btn.dataset.id;
                    viewProductDetail(productId);
                });
            });
            
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = btn.dataset.id;
                    addToCart(productId);
                    alert('Product added to cart!');
                });
            });
        }

        // View product detail
        function viewProductDetail(productId) {
            const product = state.products.find(p => p.id === productId);
            if (!product) return;
            
            state.currentProduct = product;
            loadPage('product');
        }

        // Render product detail page
        function renderProductDetailPage() {
            if (!state.currentProduct) {
                loadPage('products');
                return;
            }
            
            const product = state.currentProduct;
            
            mainContent.innerHTML = `
                <div class="product-detail">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h1>${product.name}</h1>
                        <div class="product-price">
                            $${product.price.toFixed(2)}
                            ${product.original_price > product.price ? 
                                `<span class="original-price">$${product.original_price.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="product-description">
                            <p>${product.description || 'No description available.'}</p>
                        </div>
                        <form id="addToCartForm">
                            <div class="quantity-selector">
                                <label for="quantity">Quantity:</label>
                                <input type="number" name="quantity" id="quantity" value="1" min="1">
                            </div>
                            <button type="submit" class="btn">Add to Cart</button>
                        </form>
                    </div>
                </div>
            `;
            
            document.getElementById('addToCartForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const quantity = parseInt(document.getElementById('quantity').value) || 1;
                addToCart(product.id, quantity);
                alert(`${product.name} has been added to your cart!`);
            });
        }

        // Render cart page
        function renderCartPage() {
            const cartItems = Object.entries(state.cart)
                .map(([id, quantity]) => {
                    const product = state.products.find(p => p.id === id);
                    if (!product) return null;
                    
                    return {
                        product,
                        quantity
                    };
                })
                .filter(item => item !== null);
            
            const subtotal = cartItems.reduce((sum, item) => 
                sum + (item.product.price * item.quantity), 0);
            
            mainContent.innerHTML = `
                <h1>Your Shopping Cart</h1>
                
                <div class="cart-items">
                    ${cartItems.length > 0 ? 
                        cartItems.map(item => `
                            <div class="cart-item">
                                <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                                <div class="cart-item-details">
                                    <h3>${item.product.name}</h3>
                                    <div class="cart-item-price">
                                        $${item.product.price.toFixed(2)} x ${item.quantity}
                                    </div>
                                    <button class="btn remove-from-cart-btn" data-id="${item.product.id}">Remove</button>
                                </div>
                                <div>
                                    $${(item.product.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        `).join('') :
                        '<p>Your cart is empty.</p>'
                    }
                </div>
                
                ${cartItems.length > 0 ? `
                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span>$5.99</span>
                    </div>
                    <div class="summary-row summary-total">
                        <span>Total:</span>
                        <span>$${(subtotal + 5.99).toFixed(2)}</span>
                    </div>
                    <button class="btn" id="checkoutBtn" style="width: 100%; margin-top: 20px;">Proceed to Checkout</button>
                </div>
                ` : ''}
            `;
            
            // Add event listeners
            document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = btn.dataset.id;
                    removeFromCart(productId);
                });
            });
            
            document.getElementById('checkoutBtn')?.addEventListener('click', () => {
                loadPage('checkout');
            });
        }

        // Render checkout page
        function renderCheckoutPage() {
            const cartItems = Object.entries(state.cart)
                .map(([id, quantity]) => {
                    const product = state.products.find(p => p.id === id);
                    if (!product) return null;
                    
                    return {
                        product,
                        quantity
                    };
                })
                .filter(item => item !== null);
            
            if (cartItems.length === 0) {
                loadPage('cart');
                return;
            }
            
            const subtotal = cartItems.reduce((sum, item) => 
                sum + (item.product.price * item.quantity), 0);
            const total = subtotal + 5.99;
            
            // Generate a random order number
            const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
            
            // Save order details to state
            state.orderDetails = {
                orderNumber,
                items: cartItems,
                subtotal,
                shipping: 5.99,
                total,
                date: new Date().toLocaleDateString(),
                status: 'pending'
            };
            
            mainContent.innerHTML = `
                <h1>Checkout</h1>
                
                <div class="checkout-columns">
                    <div style="background-color: white; padding: 15px; border-radius: 8px;">
                        <h2>Shipping Information</h2>
                        <form id="shippingForm">
                            <div>
                                <label>Full Name</label>
                                <input type="text" id="fullName" required>
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="email" id="email" required>
                            </div>
                            <div>
                                <label>Address</label>
                                <input type="text" id="address" required>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <div style="flex: 1;">
                                    <label>City</label>
                                    <input type="text" id="city" required>
                                </div>
                                <div style="flex: 1;">
                                    <label>State/Province</label>
                                    <input type="text" id="state" required>
                                </div>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <div style="flex: 1;">
                                    <label>Postal Code</label>
                                    <input type="text" id="postalCode" required>
                                </div>
                                <div style="flex: 1;">
                                    <label>Country</label>
                                    <select id="country" required>
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                        <option>Australia</option>
                                        <option>Germany</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label>Phone Number</label>
                                <input type="tel" id="phone" required>
                            </div>
                        </form>
                        
                        <h2 style="margin-top: 20px;">Payment Method</h2>
                        
                        <div class="payment-method selected" id="bankTransferMethod">
                            <label>
                                <input type="radio" name="payment" value="bank_transfer" checked>
                                Bank Transfer
                            </label>
                            <div class="payment-method-details">
                                <div style="margin-top: 10px;">
                                    <div class="bank-info">
                                        <p><strong>Bank Name:</strong> Global Commerce Bank</p>
                                        <p><strong>Account Name:</strong> Temu-like Store</p>
                                        <p><strong>Account Number:</strong> 1234567890</p>
                                        <p><strong>SWIFT/BIC:</strong> GCBKUS33</p>
                                        <p><strong>Reference:</strong> ${orderNumber}</p>
                                    </div>
                                    <p style="margin: 10px 0;">Please upload your payment slip after completing the bank transfer.</p>
                                    
                                    <div class="upload-area" id="uploadArea">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <p>Click to upload payment slip</p>
                                        <p style="font-size: 12px; color: #666;">(JPEG, PNG or PDF, max 5MB)</p>
                                        <input type="file" id="fileInput" accept=".jpg,.jpeg,.png,.pdf" style="display: none;">
                                        <div class="file-name" id="fileName"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div style="background-color: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                            <h2>Order Summary</h2>
                            ${cartItems.map(item => `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                    <span>${item.product.name} x ${item.quantity}</span>
                                    <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                            
                            <div style="border-top: 1px solid #eee; margin: 10px 0; padding-top: 10px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span>Subtotal:</span>
                                    <span>$${subtotal.toFixed(2)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span>Shipping:</span>
                                    <span>$5.99</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px;">
                                    <span>Total:</span>
                                    <span>$${total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <button class="btn" id="placeOrderBtn" style="width: 100%;">Place Order</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Set payment method to bank transfer by default
            state.paymentMethod = 'bank_transfer';
            
            // File upload handling
            const uploadArea = document.getElementById('uploadArea');
            const fileInput = document.getElementById('fileInput');
            const fileName = document.getElementById('fileName');
            
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                        alert('File size exceeds 5MB limit');
                        return;
                    }
                    
                    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                    if (!validTypes.includes(file.type)) {
                        alert('Please upload a JPEG, PNG, or PDF file');
                        return;
                    }
                    
                    // Read the file and convert to base64
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        fileName.textContent = file.name;
                        state.uploadedFile = event.target.result; // Store base64 string
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            document.getElementById('placeOrderBtn').addEventListener('click', () => {
                if (!document.getElementById('shippingForm').checkValidity()) {
                    alert('Please fill out all required shipping information.');
                    return;
                }
                
                if (!state.uploadedFile) {
                    alert('Please upload your payment slip for bank transfer.');
                    return;
                }
                
                // Save shipping info to order details
                state.orderDetails.shippingInfo = {
                    name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    postalCode: document.getElementById('postalCode').value,
                    country: document.getElementById('country').value,
                    phone: document.getElementById('phone').value
                };
                
                state.orderDetails.paymentMethod = state.paymentMethod;
                state.orderDetails.paymentSlip = state.uploadedFile; // Store the base64 image
                
                // Save order to Firebase
                database.ref('orders').push(state.orderDetails)
                    .then(() => {
                        // Clear cart after successful order
                        state.cart = {};
                        saveCart();
                        updateCartCount();
                        
                        loadPage('pending-review');
                    })
                    .catch(error => {
                        alert('Error placing order: ' + error.message);
                    });
            });
        }

        // Render pending review page for bank transfers
        function renderPendingReviewPage() {
            if (!state.orderDetails) {
                loadPage('home');
                return;
            }
            
            mainContent.innerHTML = `
                <div class="pending-review">
                    <i class="fas fa-clock"></i>
                    <h1>Payment Under Review</h1>
                    <p>Thank you for your order! Your bank transfer payment is being reviewed.</p>
                    <p>We will notify you by email once your payment is confirmed.</p>
                    <p>Your order number is: <strong>${state.orderDetails.orderNumber}</strong></p>
                    
                    <div class="order-details">
                        <h3>Order Summary</h3>
                        <div class="order-details-row">
                            <div class="order-details-label">Order Date:</div>
                            <div>${state.orderDetails.date}</div>
                        </div>
                        <div class="order-details-row">
                            <div class="order-details-label">Payment Method:</div>
                            <div>Bank Transfer</div>
                        </div>
                        <div class="order-details-row">
                            <div class="order-details-label">Total Amount:</div>
                            <div>$${state.orderDetails.total.toFixed(2)}</div>
                        </div>
                    </div>
                    
                    <button class="btn" id="continueShoppingBtn">Continue Shopping</button>
                </div>
            `;
            
            document.getElementById('continueShoppingBtn').addEventListener('click', () => {
                loadPage('home');
            });
        }

        // Render order confirmation page
        function renderOrderConfirmationPage() {
            if (!state.orderDetails) {
                loadPage('home');
                return;
            }
            
            mainContent.innerHTML = `
                <div class="order-confirmation">
                    <i class="fas fa-check-circle"></i>
                    <h1>Order Confirmed!</h1>
                    <p>Thank you for your purchase. Your order has been confirmed.</p>
                    <p>We've sent the order details to your email.</p>
                    <p>Your order number is: <strong>${state.orderDetails.orderNumber}</strong></p>
                    
                    <div class="order-details">
                        <h3>Order Details</h3>
                        <div class="order-details-row">
                            <div class="order-details-label">Order Date:</div>
                            <div>${state.orderDetails.date}</div>
                        </div>
                        <div class="order-details-row">
                            <div class="order-details-label">Payment Method:</div>
                            <div>Bank Transfer</div>
                        </div>
                        <div class="order-details-row">
                            <div class="order-details-label">Shipping To:</div>
                            <div>
                                ${state.orderDetails.shippingInfo.name}<br>
                                ${state.orderDetails.shippingInfo.address}<br>
                                ${state.orderDetails.shippingInfo.city}, ${state.orderDetails.shippingInfo.state} ${state.orderDetails.shippingInfo.postalCode}<br>
                                ${state.orderDetails.shippingInfo.country}
                            </div>
                        </div>
                        <div class="order-details-row">
                            <div class="order-details-label">Total Amount:</div>
                            <div>$${state.orderDetails.total.toFixed(2)}</div>
                        </div>
                    </div>
                    
                    <button class="btn" id="continueShoppingBtn">Continue Shopping</button>
                </div>
            `;
            
            document.getElementById('continueShoppingBtn').addEventListener('click', () => {
                loadPage('home');
            });
            
            // Download order confirmation
            downloadOrderConfirmation();
        }

        // Download order confirmation as PDF
        function downloadOrderConfirmation() {
            const order = state.orderDetails;
            let content = `Order Confirmation\n\n`;
            content += `Order Number: ${order.orderNumber}\n`;
            content += `Date: ${order.date}\n\n`;
            content += `Shipping Information:\n`;
            content += `${order.shippingInfo.name}\n`;
            content += `${order.shippingInfo.address}\n`;
            content += `${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}\n`;
            content += `${order.shippingInfo.country}\n\n`;
            content += `Payment Method: Bank Transfer\n\n`;
            content += `Order Items:\n`;
            
            order.items.forEach(item => {
                content += `${item.product.name} x ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}\n`;
            });
            
            content += `\nSubtotal: $${order.subtotal.toFixed(2)}\n`;
            content += `Shipping: $${order.shipping.toFixed(2)}\n`;
            content += `Total: $${order.total.toFixed(2)}\n\n`;
            content += `Thank you for your purchase!`;
            
            // Create a Blob with the content
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            // Create a download link and trigger it
            const a = document.createElement('a');
            a.href = url;
            a.download = `Order_${order.orderNumber}.txt`;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
        }

        // Update active nav link
        function updateActiveNavLink() {
            navLinks.forEach(link => {
                if (link.dataset.page === state.currentPage && 
                    (!link.dataset.category || link.dataset.category === state.currentCategory)) {
                    link.style.color = '#ff5722';
                    link.style.fontWeight = 'bold';
                } else {
                    link.style.color = '#333';
                    link.style.fontWeight = 'normal';
                }
            });
        }

        // Add to cart
        function addToCart(productId, quantity = 1) {
            if (state.cart[productId]) {
                state.cart[productId] += quantity;
            } else {
                state.cart[productId] = quantity;
            }
            
            saveCart();
            updateCartCount();
        }

        // Remove from cart
        function removeFromCart(productId) {
            delete state.cart[productId];
            saveCart();
            updateCartCount();
            renderCartPage(); // Refresh the cart page
        }

        // Save cart to localStorage
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(state.cart));
        }

        // Update cart count
        function updateCartCount() {
            const count = Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);