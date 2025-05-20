// Hide all popups on page load
window.addEventListener('load', () => {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
    loadProducts();
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
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

// Popup Logic for Login
const loginBtn = document.getElementById('login-btn');
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

// Open Login Choice Popup
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginChoicePopup.style.display = 'flex';
    });
}

// Open User Login Popup
if (userLoginBtn) {
    userLoginBtn.addEventListener('click', () => {
        loginChoicePopup.style.display = 'none';
        userLoginPopup.style.display = 'flex';
    });
}

// Open Admin Login Popup
if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
        loginChoicePopup.style.display = 'none';
        adminLoginPopup.style.display = 'flex';
    });
}

// Open SignUp Popup
if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        userLoginPopup.style.display = 'none';
        signupPopup.style.display = 'flex';
    });
}

// Open Login Popup from SignUp
if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupPopup.style.display = 'none';
        userLoginPopup.style.display = 'flex';
    });
}

// Close Popups
[closeChoice, closeUserLogin, closeSignup, closeAdminLogin].forEach(closeBtn => {
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            [loginChoicePopup, userLoginPopup, signupPopup, adminLoginPopup].forEach(popup => {
                if (popup) popup.style.display = 'none';
            });
        });
    }
});

[cancelUserLogin, cancelSignup, cancelAdminLogin].forEach(cancelBtn => {
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            [userLoginPopup, signupPopup, adminLoginPopup].forEach(popup => {
                if (popup) popup.style.display = 'none';
            });
        });
    }
});

// Close Popup on Outside Click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
        [loginChoicePopup, userLoginPopup, signupPopup, adminLoginPopup].forEach(popup => {
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

// User Signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            password: document.getElementById('signup-password').value,
            confirm_password: document.getElementById('confirm-password').value
        };

        const response = await fetch('api/signup.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            signupPopup.style.display = 'none';
            userLoginPopup.style.display = 'flex';
        }
    });
}

// User Login
const userLoginForm = document.getElementById('user-login-form');
if (userLoginForm) {
    userLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username_email: document.getElementById('username-email').value,
            password: document.getElementById('password').value,
            type: 'user'
        };

        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            userLoginPopup.style.display = 'none';
            window.location.reload();
        }
    });
}

// Admin Login
const adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username_email: document.getElementById('admin-username-email').value,
            password: document.getElementById('admin-password').value,
            type: 'admin'
        };

        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            adminLoginPopup.style.display = 'none';
            window.location.href = 'admin.html';
        }
    });
}

// Load Products
async function loadProducts() {
    const category = document.getElementById('category')?.value || 'all';
    const response = await fetch(`api/products.php?category=${category}`);
    const products = await response.json();
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p>Category: ${product.category}</p>
                    <p>Availability: ${product.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}</p>
                    <p class="price">LKR ${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Add To Cart</button>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });

    // Add to Cart Event Listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const productId = btn.getAttribute('data-product-id');
            const response = await fetch('api/cart.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, quantity: 1 })
            });
            const result = await response.json();
            alert(result.message);
            if (result.success && window.location.pathname.includes('cart.html')) {
                loadCart();
            }
        });
    });
}

// Load Cart
async function loadCart() {
    const response = await fetch('api/cart.php');
    const result = await response.json();
    const cartTableBody = document.querySelector('.cart-table tbody');
    const cartSummary = document.querySelector('.summary-details');
    if (!cartTableBody || !result.success) {
        cartTableBody.innerHTML = '<tr><td colspan="5">Please log in to view your cart</td></tr>';
        return;
    }

    let subtotal = 0;
    cartTableBody.innerHTML = '';
    result.items.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        const row = `
            <tr>
                <td class="product-info">
                    <img src="${item.image}" alt="${item.name}">
                    <span>${item.name}</span>
                </td>
                <td>LKR ${item.price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-cart-id="${item.id}"></td>
                <td>LKR ${itemSubtotal.toFixed(2)}</td>
                <td><button class="remove-btn" data-cart-id="${item.id}"><i class="fas fa-trash-alt"></i></button></td>
            </tr>
        `;
        cartTableBody.innerHTML += row;
    });

    const shipping = 200;
    const total = subtotal + shipping;
    cartSummary.innerHTML = `
        <p><span>Subtotal:</span> LKR ${subtotal.toFixed(2)}</p>
        <p><span>Shipping:</span> LKR ${shipping.toFixed(2)}</p>
        <p class="total"><span>Total:</span> LKR ${total.toFixed(2)}</p>
    `;

    // Remove Item Event Listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const cartId = btn.getAttribute('data-cart-id');
            const response = await fetch('api/cart.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_id: cartId })
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) loadCart();
        });
    });
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
        addProductPopup.style.display = 'flex';
    });
}

// Open Add Admin Popup
if (addAdminBtn) {
    addAdminBtn.addEventListener('click', () => {
        addAdminPopup.style.display = 'flex';
    });
}

// Open Add User Popup
if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
        addUserPopup.style.display = 'flex';
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
        const formData = new FormData();
        formData.append('name', document.getElementById('product-name').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('image', document.getElementById('product-image').files[0]);
        formData.append('availability', document.getElementById('availability').value);

        const response = await fetch('api/add-product.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            addProductPopup.style.display = 'none';
            loadProducts();
            addProductForm.reset();
        }
    });
}

// Add Admin Form Submission
const addAdminForm = document.getElementById('add-admin-form');
if (addAdminForm) {
    addAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username: document.getElementById('admin-username').value,
            email: document.getElementById('admin-email').value,
            password: document.getElementById('admin-password').value
        };

        const response = await fetch('api/add-admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            addAdminPopup.style.display = 'none';
            addAdminForm.reset();
            // Optionally reload admins section
        }
    });
}

// Add User Form Submission
const addUserForm = document.getElementById('add-user-form');
if (addUserForm) {
    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('user-email').value,
            password: document.getElementById('user-password').value
        };

        const response = await fetch('api/add-user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            addUserPopup.style.display = 'none';
            addUserForm.reset();
            // Optionally reload users section
        }
    });
}