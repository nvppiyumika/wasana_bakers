window.addEventListener('load', () => {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
    loadProducts();
    loadAdmins();
    loadUsers();
    loadMessages();
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
    if (window.location.pathname.includes('admin.html')) {
        loadOrders();
    }
    checkLoginStatus();
    handleContactForm();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Popup Logic
const loginBtn = document.getElementById('login-btn');
const userNameBtn = document.getElementById('user-name-btn');
const loginChoicePopup = document.getElementById('login-choice-popup');
const userLoginBtn = document.getElementById('user-login-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');
const closeChoice = document.getElementById('close-choice');
const userLoginPopup = document.getElementById('user-login-popup');
const closeUserLogin = document.getElementById('close-user-login');
const cancelUserLogin = document.getElementById('cancel-user-login');
const signupLink = document.getElementById('signup-link');
const signupPopup = document.getElementById('signup-popup');
const closeSignup = document.getElementById('close-signup');
const cancelSignup = document.getElementById('cancel-signup');
const loginLink = document.getElementById('login-link');
const adminLoginPopup = document.getElementById('admin-login-popup');
const closeAdminLogin = document.getElementById('close-admin-login');
const cancelAdminLogin = document.getElementById('cancel-admin-login');
const logoutPopup = document.getElementById('logout-popup');
const closeLogout = document.getElementById('close-logout');
const logoutConfirmBtn = document.getElementById('logout-confirm-btn');
const cancelLogout = document.getElementById('cancel-logout');
const updateProductPopup = document.getElementById('update-product-popup');
const closeUpdateProduct = document.getElementById('close-update-product');
const cancelUpdateProduct = document.getElementById('cancel-update-product');
const updateAdminPopup = document.getElementById('update-admin-popup');
const closeUpdateAdmin = document.getElementById('close-update-admin');
const cancelUpdateAdmin = document.getElementById('cancel-update-admin');
const updateUserPopup = document.getElementById('update-user-popup');
const closeUpdateUser = document.getElementById('close-update-user');
const cancelUpdateUser = document.getElementById('cancel-update-user');
const updateOrderPopup = document.getElementById('update-order-popup');
const closeUpdateOrder = document.getElementById('close-update-order');
const cancelUpdateOrder = document.getElementById('cancel-update-order');

// Check Login Status
async function checkLoginStatus() {
    try {
        const response = await fetch('api/check-login.php', { credentials: 'same-origin' });
        const result = await response.json();
        if (result.loggedIn && result.display_name) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userNameBtn) {
                userNameBtn.style.display = 'inline-block';
                userNameBtn.textContent = result.display_name;
            }
            if (window.location.pathname.includes('admin.html') && result.type !== 'admin') {
                window.location.href = 'index.html';
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userNameBtn) userNameBtn.style.display = 'none';
            if (window.location.pathname.includes('admin.html')) {
                window.location.href = 'index.html';
            }
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (userNameBtn) userNameBtn.style.display = 'none';
    }
}

// Open Login Choice Popup
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginChoicePopup) loginChoicePopup.style.display = 'flex';
    });
}

// Open User Login Popup
if (userLoginBtn) {
    userLoginBtn.addEventListener('click', () => {
        if (loginChoicePopup) loginChoicePopup.style.display = 'none';
        if (userLoginPopup) userLoginPopup.style.display = 'flex';
    });
}

// Open Admin Login Popup
if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
        if (loginChoicePopup) loginChoicePopup.style.display = 'none';
        if (adminLoginPopup) adminLoginPopup.style.display = 'flex';
    });
}

// Open SignUp Popup
if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (userLoginPopup) userLoginPopup.style.display = 'none';
        if (signupPopup) signupPopup.style.display = 'flex';
    });
}

// Open Login Popup from SignUp
if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (signupPopup) signupPopup.style.display = 'none';
        if (userLoginPopup) userLoginPopup.style.display = 'flex';
    });
}

// Open Logout Popup
if (userNameBtn) {
    userNameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (logoutPopup) logoutPopup.style.display = 'flex';
    });
}

// Handle Logout
if (logoutConfirmBtn) {
    logoutConfirmBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('api/logout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            });
            const result = await response.json();
            if (result.success) {
                if (logoutPopup) logoutPopup.style.display = 'none';
                if (loginBtn) loginBtn.style.display = 'inline-block';
                if (userNameBtn) userNameBtn.style.display = 'none';
                if (window.location.pathname.includes('admin.html')) {
                    window.location.href = 'index.html';
                } else {
                    window.location.reload();
                }
                alert(result.message);
            } else {
                alert('Logout failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Logout failed. Please try again.');
        }
    });
}

// Close Popups
[closeChoice, closeUserLogin, closeSignup, closeAdminLogin, closeLogout, closeUpdateProduct, closeUpdateAdmin, closeUpdateUser, closeUpdateOrder].forEach(closeBtn => {
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            [loginChoicePopup, userLoginPopup, signupPopup, adminLoginPopup, logoutPopup, updateProductPopup, updateAdminPopup, updateUserPopup, updateOrderPopup].forEach(popup => {
                if (popup) popup.style.display = 'none';
            });
        });
    }
});

[cancelUserLogin, cancelSignup, cancelAdminLogin, cancelLogout, cancelUpdateProduct, cancelUpdateAdmin, cancelUpdateUser, cancelUpdateOrder].forEach(cancelBtn => {
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            [userLoginPopup, signupPopup, adminLoginPopup, logoutPopup, updateProductPopup, updateAdminPopup, updateUserPopup, updateOrderPopup].forEach(popup => {
                if (popup) popup.style.display = 'none';
            });
        });
    }
});

// Close Popup on Outside Click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
        [loginChoicePopup, userLoginPopup, signupPopup, adminLoginPopup, logoutPopup, updateProductPopup, updateAdminPopup, updateUserPopup, updateOrderPopup].forEach(popup => {
            if (popup) popup.style.display = 'none';
        });
    }
});

// Password Visibility Toggle
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const passwordField = this.previousElementSibling;
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});

// Input Validation
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\+?\d{10,15}$/.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

// User Signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            first_name: document.getElementById('first-name').value.trim(),
            last_name: document.getElementById('last-name').value.trim(),
            address: document.getElementById('address').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('signup-password').value,
            confirm_password: document.getElementById('confirm-password').value
        };

        if (!formData.first_name || !formData.last_name || !formData.address || !formData.phone || !formData.email || !formData.password) {
            alert('All fields are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (!validatePhone(formData.phone)) {
            alert('Invalid phone number');
            return;
        }
        if (!validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }
        if (formData.password !== formData.confirm_password) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('api/signup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (signupPopup) signupPopup.style.display = 'none';
                if (userLoginPopup) userLoginPopup.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Signup failed. Please try again.');
        }
    });
}

// User Login
const userLoginForm = document.getElementById('user-login-form');
if (userLoginForm) {
    userLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username_email: document.getElementById('username-email').value.trim(),
            password: document.getElementById('password').value,
            type: 'user'
        };

        if (!formData.username_email || !formData.password) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (userLoginPopup) userLoginPopup.style.display = 'none';
                if (loginBtn) loginBtn.style.display = 'none';
                if (userNameBtn) {
                    userNameBtn.style.display = 'inline-block';
                    userNameBtn.textContent = result.display_name;
                }
                window.location.reload();
            }
        } catch (error) {
            console.error('Error during user login:', error);
            alert('Login failed. Please try again.');
        }
    });
}

// Admin Login
const adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username_email: document.getElementById('admin-username-email').value.trim(),
            password: document.getElementById('admin-password').value,
            type: 'admin'
        };

        if (!formData.username_email || !formData.password) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (adminLoginPopup) adminLoginPopup.style.display = 'none';
                if (loginBtn) loginBtn.style.display = 'none';
                if (userNameBtn) {
                    userNameBtn.style.display = 'inline-block';
                    userNameBtn.textContent = result.display_name;
                }
                window.location.href = 'admin.html';
            }
        } catch (error) {
            console.error('Error during admin login:', error);
            alert('Login failed. Please try again.');
        }
    });
}

// Contact Form Submission
function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('contact-name').value.trim(),
                email: document.getElementById('contact-email').value.trim(),
                message: document.getElementById('contact-message').value.trim()
            };

            if (!formData.name || !formData.email || !formData.message) {
                alert('All fields are required');
                return;
            }
            if (!validateEmail(formData.email)) {
                alert('Invalid email format');
                return;
            }

            try {
                const response = await fetch('api/contact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                alert(result.message);
                if (result.success) {
                    contactForm.reset();
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('Failed to send message. Please try again.');
            }
        });
    }
}

// Load Products
async function loadProducts() {
    const category = document.getElementById('category')?.value || 'all';
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    try {
        const response = await fetch(`api/products.php?category=${category}`, { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        let products;
        try {
            products = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text.substring(0, 100) + '...');
            throw new Error(`Invalid JSON response: ${e.message}`);
        }

        if (!Array.isArray(products)) {
            throw new Error(products.message || 'Invalid response from server');
        }

        productsGrid.innerHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p>No products found.</p>';
            return;
        }

        const isAdminPage = window.location.pathname.includes('admin.html');

        products.forEach(product => {
            const price = parseFloat(product.price);
            const formattedPrice = isNaN(price) ? '0.00' : price.toFixed(2);
            const imageSrc = product.image ? (product.image.startsWith('get-image.php') ? 'api/' + product.image : product.image) : 'images/placeholder.jpg';
            const productCard = `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${imageSrc}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'; console.warn('Image failed to load for product ID ${product.id}: ${imageSrc}');">
                    </div>
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p>Category: ${product.category}</p>
                        <p>Availability: ${product.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}</p>
                        <p class="price">LKR ${formattedPrice}</p>
                        ${isAdminPage ? `
                            <div class="admin-controls">
                                <button class="update-btn" data-product-id="${product.id}">Update</button>
                                <button class="delete-btn product-delete-btn" data-product-id="${product.id}">Delete</button>
                            </div>
                        ` : `
                            <button class="add-to-cart-btn" data-product-id="${product.id}" ${product.availability === 'out_of_stock' ? 'disabled' : ''}>Add To Cart</button>
                        `}
                    </div>
                </div>
            `;
            productsGrid.innerHTML += productCard;
        });

        if (isAdminPage) {
            document.querySelectorAll('.products-grid .update-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const productId = btn.getAttribute('data-product-id');
                    try {
                        const response = await fetch(`api/products.php?id=${productId}`, { credentials: 'same-origin' });
                        if (!response.ok) {
                            throw new Error(`Server error: ${response.status} ${response.statusText}`);
                        }
                        const product = await response.json();
                        if (product.success === false) {
                            throw new Error(product.message || 'Product not found');
                        }
                        const formElements = {
                            id: document.getElementById('update-product-id'),
                            name: document.getElementById('update-product-name'),
                            category: document.getElementById('update-category'),
                            price: document.getElementById('update-price'),
                            availability: document.getElementById('update-availability'),
                            image: document.getElementById('update-product-image')
                        };
                        if (!formElements.id || !formElements.name || !formElements.category || !formElements.price || !formElements.availability || !formElements.image) {
                            throw new Error('One or more form elements are missing');
                        }
                        formElements.id.value = product.id || '';
                        formElements.name.value = product.name || '';
                        formElements.category.value = product.category || '';
                        formElements.price.value = product.price ? parseFloat(product.price).toFixed(2) : '';
                        formElements.availability.value = product.availability || '';
                        formElements.image.value = '';
                        if (updateProductPopup) {
                            updateProductPopup.style.display = 'flex';
                        } else {
                            throw new Error('Update popup element not found');
                        }
                    } catch (error) {
                        console.error('Error fetching product:', error);
                        alert(`Failed to load product details: ${error.message}`);
                    }
                });
            });

            document.querySelectorAll('.products-grid .product-delete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const productId = btn.getAttribute('data-product-id');
                    if (confirm(`Are you sure you want to delete product ID ${productId}?`)) {
                        try {
                            const response = await fetch('api/delete-product.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'same-origin',
                                body: JSON.stringify({ product_id: productId })
                            });
                            const result = await response.json();
                            alert(result.message);
                            if (result.success) {
                                loadProducts();
                            }
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            alert('Failed to delete product. Please try again.');
                        }
                    }
                });
            });
        } else {
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const productId = btn.getAttribute('data-product-id');
                    try {
                        const response = await fetch('api/cart.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ product_id: productId, quantity: 1 })
                        });
                        const result = await response.json();
                        if (!result.success && result.message === 'Please log in to manage cart') {
                            if (loginChoicePopup) loginChoicePopup.style.display = 'flex';
                        } else {
                            alert(result.message);
                            if (result.success && window.location.pathname.includes('cart.html')) {
                                loadCart();
                            }
                        }
                    } catch (error) {
                        console.error('Error adding to cart:', error);
                        alert('Failed to add to cart. Please try again.');
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error loading products:', error.message, error.stack);
        if (productsGrid) {
            let errorMessage = 'Failed to load products. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid JSON')) {
                errorMessage = `Server returned invalid data: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            productsGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Load Orders
async function loadOrders() {
    const ordersGrid = document.querySelector('.orders-grid');
    if (!ordersGrid) return;

    try {
        const response = await fetch('api/orders.php', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const orders = await response.json();

        if (!Array.isArray(orders)) {
            throw new Error(orders.message || 'Invalid response from server');
        }

        ordersGrid.innerHTML = '';
        if (orders.length === 0) {
            ordersGrid.innerHTML = '<p>No orders found.</p>';
            return;
        }

        orders.forEach(order => {
            const itemsList = order.items;
            const orderCard = `
                <div class="order-card">
                    <p>Order #${order.id} - ${itemsList}</p>
                    <p>Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                    <p>Total: LKR ${parseFloat(order.total).toFixed(2)}</p>
                    <p>Created: ${order.created_at}</p>
                    <div class="admin-controls">
                        <button class="update-btn order-update-btn" data-order-id="${order.id}" data-order-status="${order.status}">Update Status</button>
                        <button class="delete-btn order-delete-btn" data-order-id="${order.id}">Delete</button>
                    </div>
                </div>
            `;
            ordersGrid.innerHTML += orderCard;
        });

        document.querySelectorAll('.orders-grid .order-update-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.getAttribute('data-order-id');
                const orderStatus = btn.getAttribute('data-order-status');
                const formElements = {
                    id: document.getElementById('update-order-id'),
                    status: document.getElementById('update-order-status')
                };
                if (!formElements.id || !formElements.status) {
                    alert('Form elements missing for order update');
                    return;
                }
                formElements.id.value = orderId;
                formElements.status.value = orderStatus;
                if (updateOrderPopup) {
                    updateOrderPopup.style.display = 'flex';
                } else {
                    alert('Update order popup not found');
                }
            });
        });

        document.querySelectorAll('.orders-grid .order-delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const orderId = btn.getAttribute('data-order-id');
                if (confirm(`Are you sure you want to delete order ID ${orderId}?`)) {
                    try {
                        const response = await fetch('api/delete-order.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ order_id: orderId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadOrders();
                        }
                    } catch (error) {
                        console.error('Error deleting order:', error);
                        alert('Failed to delete order. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading orders:', error.message, error.stack);
        if (ordersGrid) {
            let errorMessage = 'Failed to load orders. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid response')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            ordersGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Load Admins
async function loadAdmins() {
    const adminsGrid = document.querySelector('.admins-grid');
    if (!adminsGrid) {
        console.warn('Admins grid not found in DOM');
        return;
    }

    try {
        const response = await fetch('api/admins.php', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const admins = await response.json();

        if (!Array.isArray(admins)) {
            throw new Error(admins.message || 'Invalid response from server');
        }

        adminsGrid.innerHTML = '';
        if (admins.length === 0) {
            adminsGrid.innerHTML = '<p>No admins found.</p>';
            return;
        }

        admins.forEach(admin => {
            const adminCard = `
                <div class="admin-card">
                    <p>Name: ${admin.username}</p>
                    <p>Email: ${admin.email}</p>
                    <div class="admin-controls">
                        <button class="update-btn" data-admin-id="${admin.id}">Update</button>
                        <button class="delete-btn admin-delete-btn" data-admin-id="${admin.id}">Delete</button>
                    </div>
                </div>
            `;
            adminsGrid.innerHTML += adminCard;
        });

        document.querySelectorAll('.admins-grid .update-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const adminId = btn.getAttribute('data-admin-id');
                try {
                    const response = await fetch(`api/admins.php?id=${adminId}`, { credentials: 'same-origin' });
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    }
                    const admin = await response.json();
                    if (admin.success === false) {
                        throw new Error(admin.message || 'Admin not found');
                    }
                    const formElements = {
                        id: document.getElementById('update-admin-id'),
                        username: document.getElementById('update-admin-username'),
                        email: document.getElementById('update-admin-email'),
                        password: document.getElementById('update-admin-password')
                    };
                    if (!formElements.id || !formElements.username || !formElements.email || !formElements.password) {
                        throw new Error('One or more form elements are missing');
                    }
                    formElements.id.value = admin.id || '';
                    formElements.username.value = admin.username || '';
                    formElements.email.value = admin.email || '';
                    formElements.password.value = '';
                    if (updateAdminPopup) {
                        updateAdminPopup.style.display = 'flex';
                    } else {
                        throw new Error('Update admin popup element not found');
                    }
                } catch (error) {
                    console.error('Error fetching admin:', error);
                    alert(`Failed to load admin details: ${error.message}`);
                }
            });
        });

        document.querySelectorAll('.admins-grid .admin-delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const adminId = btn.getAttribute('data-admin-id');
                if (confirm(`Are you sure you want to delete admin ID ${adminId}?`)) {
                    try {
                        const response = await fetch('api/delete-admin.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ admin_id: adminId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadAdmins();
                        }
                    } catch (error) {
                        console.error('Error deleting admin:', error);
                        alert('Failed to delete admin. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading admins:', error.message, error.stack);
        if (adminsGrid) {
            let errorMessage = 'Failed to load admins. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid response')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            adminsGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Load Users
async function loadUsers() {
    const usersGrid = document.querySelector('.users-grid');
    if (!usersGrid) {
        console.warn('Users grid not found in DOM');
        return;
    }

    try {
        const response = await fetch('api/users.php', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const users = await response.json();

        if (!Array.isArray(users)) {
            throw new Error(users.message || 'Invalid response from server');
        }

        usersGrid.innerHTML = '';
        if (users.length === 0) {
            usersGrid.innerHTML = '<p>No users found.</p>';
            return;
        }

        users.forEach(user => {
            const userCard = `
                <div class="user-card">
                    <p>Name: ${user.first_name} ${user.last_name}</p>
                    <p>Email: ${user.email}</p>
                    <div class="admin-controls">
                        <button class="update-btn" data-user-id="${user.id}">Update</button>
                        <button class="delete-btn user-delete-btn" data-user-id="${user.id}">Delete</button>
                    </div>
                </div>
            `;
            usersGrid.innerHTML += userCard;
        });

        document.querySelectorAll('.users-grid .update-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = btn.getAttribute('data-user-id');
                try {
                    const response = await fetch(`api/users.php?id=${userId}`, { credentials: 'same-origin' });
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    }
                    const user = await response.json();
                    if (user.success === false) {
                        throw new Error(user.message || 'User not found');
                    }
                    const formElements = {
                        id: document.getElementById('update-user-id'),
                        first_name: document.getElementById('update-first-name'),
                        last_name: document.getElementById('update-last-name'),
                        address: document.getElementById('update-address'),
                        phone: document.getElementById('update-phone'),
                        email: document.getElementById('update-user-email'),
                        password: document.getElementById('update-user-password')
                    };
                    if (!formElements.id || !formElements.first_name || !formElements.last_name || !formElements.address || !formElements.phone || !formElements.email || !formElements.password) {
                        throw new Error('One or more form elements are missing');
                    }
                    formElements.id.value = user.id || '';
                    formElements.first_name.value = user.first_name || '';
                    formElements.last_name.value = user.last_name || '';
                    formElements.address.value = user.address || '';
                    formElements.phone.value = user.phone || '';
                    formElements.email.value = user.email || '';
                    formElements.password.value = '';
                    if (updateUserPopup) {
                        updateUserPopup.style.display = 'flex';
                    } else {
                        throw new Error('Update user popup element not found');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                    alert(`Failed to load user details: ${error.message}`);
                }
            });
        });

        document.querySelectorAll('.users-grid .user-delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = btn.getAttribute('data-user-id');
                if (confirm(`Are you sure you want to delete user ID ${userId}?`)) {
                    try {
                        const response = await fetch('api/delete-user.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ user_id: userId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadUsers();
                        }
                    } catch (error) {
                        console.error('Error deleting user:', error);
                        alert('Failed to delete user. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading users:', error.message, error.stack);
        if (usersGrid) {
            let errorMessage = 'Failed to load users. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid response')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            usersGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Load Messages
async function loadMessages() {
    const messagesGrid = document.querySelector('.messages-grid');
    if (!messagesGrid) {
        console.warn('Messages grid not found in DOM');
        return;
    }

    try {
        const response = await fetch('api/contact.php', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const messages = await response.json();

        if (!Array.isArray(messages)) {
            throw new Error(messages.message || 'Invalid response from server');
        }

        messagesGrid.innerHTML = '';
        if (messages.length === 0) {
            messagesGrid.innerHTML = '<p>No messages found.</p>';
            return;
        }

        messages.forEach(message => {
            const messageCard = `
                <div class="message-card">
                    <p>Name: ${message.name}</p>
                    <p>Email: ${message.email}</p>
                    <p>Message: ${message.message}</p>
                    <p>Received: ${message.created_at}</p>
                    <div class="admin-controls">
                        <button class="delete-btn message-delete-btn" data-message-id="${message.id}">Delete</button>
                    </div>
                </div>
            `;
            messagesGrid.innerHTML += messageCard;
        });

        document.querySelectorAll('.messages-grid .message-delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const messageId = btn.getAttribute('data-message-id');
                if (confirm(`Are you sure you want to delete message ID ${messageId}?`)) {
                    try {
                        const response = await fetch('api/delete-message.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ message_id: messageId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadMessages();
                        }
                    } catch (error) {
                        console.error('Error deleting message:', error);
                        alert('Failed to delete message. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading messages:', error.message, error.stack);
        if (messagesGrid) {
            let errorMessage = 'Failed to load messages. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid response')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            messagesGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Update Order Form Submission
const updateOrderForm = document.getElementById('update-order-form');
if (updateOrderForm) {
    updateOrderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            order_id: document.getElementById('update-order-id').value,
            status: document.getElementById('update-order-status').value
        };

        if (!formData.order_id || !formData.status) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await fetch('api/update-order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (updateOrderPopup) updateOrderPopup.style.display = 'none';
                updateOrderForm.reset();
                loadOrders();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order. Please try again.');
        }
    });
}

// Update Product Form Submission
const updateProductForm = document.getElementById('update-product-form');
if (updateProductForm) {
    updateProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imageInput = document.getElementById('update-product-image');
        const formData = new FormData();
        formData.append('product_id', document.getElementById('update-product-id').value);
        formData.append('name', document.getElementById('update-product-name').value.trim());
        formData.append('category', document.getElementById('update-category').value);
        formData.append('price', document.getElementById('update-price').value);
        formData.append('availability', document.getElementById('update-availability').value);
        if (imageInput.files.length > 0) {
            const maxSizeMB = 16;
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (imageInput.files[0].size > maxSizeBytes) {
                alert(`Image size exceeds ${maxSizeMB}MB. Please choose a smaller file.`);
                return;
            }
            formData.append('image', imageInput.files[0]);
        }

        if (!formData.get('product_id') || !formData.get('name') || !formData.get('category') || !formData.get('price') || !formData.get('availability')) {
            alert('All fields are required');
            return;
        }
        if (isNaN(formData.get('price')) || formData.get('price') <= 0) {
            alert('Price must be a positive number');
            return;
        }

        try {
            const response = await fetch('api/update-product.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (updateProductPopup) updateProductPopup.style.display = 'none';
                loadProducts();
                updateProductForm.reset();
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        }
    });
}

// Update Admin Form Submission
const updateAdminForm = document.getElementById('update-admin-form');
if (updateAdminForm) {
    updateAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            admin_id: document.getElementById('update-admin-id').value,
            username: document.getElementById('update-admin-username').value.trim(),
            email: document.getElementById('update-admin-email').value.trim(),
            password: document.getElementById('update-admin-password').value
        };

        if (!formData.admin_id || !formData.username || !formData.email) {
            alert('Username and email are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (formData.password && !validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('api/update-admin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (updateAdminPopup) updateAdminPopup.style.display = 'none';
                updateAdminForm.reset();
                loadAdmins();
            }
        } catch (error) {
            console.error('Error updating admin:', error);
            alert('Failed to update admin. Please try again.');
        }
    });
}

// Update User Form Submission
const updateUserForm = document.getElementById('update-user-form');
if (updateUserForm) {
    updateUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            user_id: document.getElementById('update-user-id').value,
            first_name: document.getElementById('update-first-name').value.trim(),
            last_name: document.getElementById('update-last-name').value.trim(),
            address: document.getElementById('update-address').value.trim(),
            phone: document.getElementById('update-phone').value.trim(),
            email: document.getElementById('update-user-email').value.trim(),
            password: document.getElementById('update-user-password').value
        };

        if (!formData.user_id || !formData.first_name || !formData.last_name || !formData.address || !formData.phone || !formData.email) {
            alert('Required fields are missing');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (!validatePhone(formData.phone)) {
            alert('Invalid phone number');
            return;
        }
        if (formData.password && !validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('api/update-user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (updateUserPopup) updateUserPopup.style.display = 'none';
                updateUserForm.reset();
                loadUsers();
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.');
        }
    });
}

// Load Cart
async function loadCart() {
    const cartTableBody = document.querySelector('.cart-table tbody');
    const cartSummary = document.querySelector('.summary-details');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!cartTableBody || !cartSummary || !checkoutBtn) return;

    try {
        const response = await fetch('api/cart.php', { credentials: 'same-origin' });
        const result = await response.json();
        if (!result.success) {
            cartTableBody.innerHTML = '<tr><td colspan="5">Please log in to view your cart</td></tr>';
            cartSummary.innerHTML = '';
            checkoutBtn.disabled = true;
            return;
        }

        let subtotal = 0;
        cartTableBody.innerHTML = '';
        if (result.items.length === 0) {
            cartTableBody.innerHTML = '<tr><td colspan="5">Your cart is empty</td></tr>';
            checkoutBtn.disabled = true;
        } else {
            result.items.forEach(item => {
                const price = parseFloat(item.price);
                const quantity = parseInt(item.quantity);
                const itemSubtotal = isNaN(price) || isNaN(quantity) ? 0 : price * quantity;
                subtotal += itemSubtotal;
                const imageSrc = item.image ? (item.image.startsWith('get-image.php') ? 'api/' + item.image : item.image) : 'images/placeholder.jpg';
                const row = `
                    <tr>
                        <td class="product-info">
                            <img src="${imageSrc}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'; console.warn('Image failed to load for cart item ID ${item.id}: ${imageSrc}');">
                            <span>${item.name}</span>
                        </td>
                        <td>LKR ${isNaN(price) ? '0.00' : price.toFixed(2)}</td>
                        <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-cart-id="${item.id}"></td>
                        <td>LKR ${itemSubtotal.toFixed(2)}</td>
                        <td><button class="remove-btn" data-cart-id="${item.id}"><i class="fas fa-trash-alt"></i></button></td>
                    </tr>
                `;
                cartTableBody.innerHTML += row;
            });
            checkoutBtn.disabled = false;
        }

        const shipping = 200;
        const total = subtotal + shipping;
        cartSummary.innerHTML = `
            <p><span>Subtotal:</span> LKR ${subtotal.toFixed(2)}</p>
            <p><span>Shipping:</span> LKR ${shipping.toFixed(2)}</p>
            <p class="total"><span>Total:</span> LKR ${total.toFixed(2)}</p>
        `;

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', async () => {
                const cartId = input.getAttribute('data-cart-id');
                const newQuantity = parseInt(input.value);
                if (newQuantity < 1) {
                    input.value = 1;
                    alert('Quantity must be at least 1');
                    return;
                }
                try {
                    const response = await fetch('api/cart.php', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin',
                        body: JSON.stringify({ cart_id: cartId, quantity: newQuantity })
                    });
                    const result = await response.json();
                    if (result.success) {
                        loadCart();
                    } else {
                        alert(result.message);
                        input.value = result.quantity || 1;
                    }
                } catch (error) {
                    console.error('Error updating quantity:', error);
                    alert('Failed to update quantity. Please try again.');
                    input.value = result.quantity || 1;
                }
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const cartId = btn.getAttribute('data-cart-id');
                if (confirm('Are you sure you want to remove this item?')) {
                    try {
                        const response = await fetch('api/cart.php', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ cart_id: cartId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadCart();
                        }
                    } catch (error) {
                        console.error('Error removing from cart:', error);
                        alert('Failed to remove item. Please try again.');
                    }
                }
            });
        });

        checkoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('api/checkout.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ items: result.items, subtotal, shipping, total })
                });
                const checkoutResult = await response.json();
                alert(checkoutResult.message);
                if (checkoutResult.success) {
                    loadCart();
                    window.location.href = 'index.html#home';
                }
            } catch (error) {
                console.error('Error during checkout:', error);
                alert('Failed to process checkout. Please try again.');
            }
        });
    } catch (error) {
        console.error('Error loading cart:', error);
        cartTableBody.innerHTML = '<tr><td colspan="5">Error loading cart. Please try again.</td></tr>';
        cartSummary.innerHTML = '';
        checkoutBtn.disabled = true;
    }
}

// Category Filter
document.getElementById('category')?.addEventListener('change', loadProducts);

// Popup Logic for Admin Actions
const addProductBtn = document.getElementById('add-product-btn');
const addProductPopup = document.getElementById('add-product-popup');
const closeProduct = document.getElementById('close-product');
const cancelProduct = document.getElementById('cancel-product');
const addAdminBtn = document.getElementById('add-admin-btn');
const addAdminPopup = document.getElementById('add-admin-popup');
const closeAdmin = document.getElementById('close-admin');
const cancelAdmin = document.getElementById('cancel-admin');
const addUserBtn = document.getElementById('add-user-btn');
const addUserPopup = document.getElementById('add-user-popup');
const closeUser = document.getElementById('close-user');
const cancelUser = document.getElementById('cancel-user');

// Open Add Product Popup
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        if (addProductPopup) addProductPopup.style.display = 'flex';
    });
}

// Open Add Admin Popup
if (addAdminBtn) {
    addAdminBtn.addEventListener('click', () => {
        if (addAdminPopup) addAdminPopup.style.display = 'flex';
    });
}

// Open Add User Popup
if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
        if (addUserPopup) addUserPopup.style.display = 'flex';
    });
}

// Close Popups
[closeProduct, cancelProduct, closeAdmin, cancelAdmin, closeUser, cancelUser].forEach(closeBtn => {
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            [addProductPopup, addAdminPopup, addUserPopup].forEach(popup => {
                if (popup) popup.style.display = 'none';
            });
        });
    }
});

// Close Popup on Outside Click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
        [addProductPopup, addAdminPopup, addUserPopup].forEach(popup => {
            if (popup) popup.style.display = 'none';
        });
    }
});

// Add Product Form Submission
const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imageInput = document.getElementById('product-image');
        if (imageInput.files.length === 0) {
            alert('Please select an image.');
            return;
        }

        const maxSizeMB = 16;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (imageInput.files[0].size > maxSizeBytes) {
            alert(`Image size exceeds ${maxSizeMB}MB. Please choose a smaller file.`);
            return;
        }

        const formData = new FormData();
        formData.append('name', document.getElementById('product-name').value.trim());
        formData.append('category', document.getElementById('category').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('image', imageInput.files[0]);
        formData.append('availability', document.getElementById('availability').value);

        if (!formData.get('name') || !formData.get('category') || !formData.get('price') || !formData.get('availability')) {
            alert('All fields are required');
            return;
        }
        if (isNaN(formData.get('price')) || formData.get('price') <= 0) {
            alert('Price must be a positive number');
            return;
        }

        try {
            const response = await fetch('api/add-products.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (addProductPopup) addProductPopup.style.display = 'none';
                loadProducts();
                addProductForm.reset();
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    });
}

// Add Admin Form Submission
const addAdminForm = document.getElementById('add-admin-form');
if (addAdminForm) {
    addAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username: document.getElementById('admin-username').value.trim(),
            email: document.getElementById('admin-email').value.trim(),
            password: document.getElementById('admin-password').value
        };

        if (!formData.username || !formData.email || !formData.password) {
            alert('All fields are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (!validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('api/add-admin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (addAdminPopup) addAdminPopup.style.display = 'none';
                addAdminForm.reset();
                loadAdmins();
            }
        } catch (error) {
            console.error('Error adding admin:', error);
            alert('Failed to add admin. Please try again.');
        }
    });
}

// Add User Form Submission
const addUserForm = document.getElementById('add-user-form');
if (addUserForm) {
    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            first_name: document.getElementById('first-name').value.trim(),
            last_name: document.getElementById('last-name').value.trim(),
            address: document.getElementById('address').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('user-email').value.trim(),
            password: document.getElementById('user-password').value
        };

        if (!formData.first_name || !formData.last_name || !formData.address || !formData.phone || !formData.email || !formData.password) {
            alert('All fields are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (!validatePhone(formData.phone)) {
            alert('Invalid phone number');
            return;
        }
        if (!validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('api/add-user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (addUserPopup) addUserPopup.style.display = 'none';
                addUserForm.reset();
                loadUsers();
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user. Please try again.');
        }
    });
}