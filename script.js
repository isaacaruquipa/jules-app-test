document.addEventListener('DOMContentLoaded', () => {
    // Element Selectors
    const productListSection = document.getElementById('product-list-section');
    const addProductFormSection = document.getElementById('add-product-form-section');
    const editProductFormSection = document.getElementById('edit-product-form-section');
    const addProductForm = document.getElementById('add-product-form');
    const editProductForm = document.getElementById('edit-product-form');
    const mainElement = document.querySelector('main');
    const notificationsDiv = document.getElementById('notifications');

    // Product Data Structure
    let products = [];
    let currentEditProductId = null;

    const LOCAL_STORAGE_KEY = 'inventoryApp_products';

    // --- LOCAL STORAGE FUNCTIONS ---
    function saveProductsToLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    }

    function loadProductsFromLocalStorage() {
        const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedProducts) {
            products = JSON.parse(storedProducts);
        }
    }

    // --- NOTIFICATION FUNCTION ---
    function showNotification(message, type = 'success') {
        if (!notificationsDiv) return; // Guard clause if div not found

        notificationsDiv.textContent = message;
        notificationsDiv.className = `notification ${type}`; // e.g., "notification success"
        notificationsDiv.style.display = 'block';

        setTimeout(() => {
            notificationsDiv.style.display = 'none';
            notificationsDiv.textContent = '';
            notificationsDiv.className = '';
        }, 3000);
    }

    // --- RENDER PRODUCTS ---
    function renderProducts() {
        productListSection.innerHTML = ''; // Clear current content

        if (products.length === 0) {
            productListSection.innerHTML = '<p>No products in inventory.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-item-card'; // Using class from style.css

            const imageUrl = product.imageUrl || 'https://via.placeholder.com/100x100.png?text=No+Image';

            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}" style="width:100px; height:100px; object-fit: cover;">
                <h3>${product.name}</h3>
                <p>${product.description || 'No description available.'}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>Stock: ${product.quantity}</p>
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            `;
            productListSection.appendChild(productCard);
        });
    }

    // --- SHOW/HIDE FORM LOGIC & CONTROLS ---
    const showAddFormBtn = document.createElement('button');
    showAddFormBtn.id = 'show-add-form-btn';
    showAddFormBtn.textContent = 'Add New Product';
    if (mainElement && productListSection) {
        mainElement.insertBefore(showAddFormBtn, productListSection);
    }


    showAddFormBtn.addEventListener('click', () => {
        addProductFormSection.style.display = 'block';
        editProductFormSection.style.display = 'none';
        productListSection.style.display = 'none';
        showAddFormBtn.style.display = 'none'; // Hide the "Add New Product" button itself
    });

    function hideFormsAndShowList() {
        addProductFormSection.style.display = 'none';
        editProductFormSection.style.display = 'none';
        productListSection.style.display = 'block';
        showAddFormBtn.style.display = 'block'; // Show the "Add New Product" button
        currentEditProductId = null;
        addProductForm.reset();
        editProductForm.reset();
    }

    // Event listeners for Cancel buttons (assuming they will be added to HTML)
    // These need to be attached after the forms are populated in HTML
    // For now, I'll add placeholders and ensure they are attached later or use event delegation.

    // --- "ADD PRODUCT" FUNCTIONALITY ---
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('addProductName');
        const descriptionInput = document.getElementById('addProductDescription');
        const priceInput = document.getElementById('addProductPrice');
        const quantityInput = document.getElementById('addProductQuantity');
        const imageUrlInput = document.getElementById('addProductImageUrl');

        const name = nameInput.value.trim();
        const price = priceInput.value;
        const quantity = quantityInput.value;

        // Basic Form Validation
        if (!name || !price || !quantity) {
            showNotification('Please fill all required fields (Name, Price, Quantity).', 'error');
            return;
        }
        if (parseFloat(price) <= 0 || parseInt(quantity) <= 0) {
            showNotification('Price and Quantity must be positive numbers.', 'error');
            return;
        }
        if (isNaN(parseFloat(price)) || isNaN(parseInt(quantity))) {
            showNotification('Price and Quantity must be valid numbers.', 'error'); // Should be caught by previous check too
            return;
        }

        const newProduct = {
            id: Date.now(), // Simple unique ID
            name,
            description: descriptionInput.value.trim(),
            price: parseFloat(price),
            quantity: parseInt(quantity),
            imageUrl: imageUrlInput.value.trim()
        };

        products.push(newProduct);
        saveProductsToLocalStorage(); // Save after adding
        renderProducts();
        hideFormsAndShowList();
        showNotification('Product added successfully!', 'success');
    });

    // --- "DELETE PRODUCT" FUNCTIONALITY (Event Delegation) ---
    productListSection.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const productId = parseInt(event.target.dataset.id);
            products = products.filter(p => p.id !== productId);
            saveProductsToLocalStorage(); // Save after deleting
            renderProducts();
            showNotification('Product deleted successfully!', 'success');
        }
    });
            // ... (rest of the function remains largely the same)
        }
    });

    // --- "EDIT PRODUCT FORM" SUBMISSION ---
    editProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('editProductName');
        const descriptionInput = document.getElementById('editProductDescription');
        const priceInput = document.getElementById('editProductPrice');
        const quantityInput = document.getElementById('editProductQuantity');
        const imageUrlInput = document.getElementById('editProductImageUrl');

        const name = nameInput.value.trim();
        const price = priceInput.value;
        const quantity = quantityInput.value;

        // Basic Form Validation
        if (!name || !price || !quantity) {
            showNotification('Please fill all required fields (Name, Price, Quantity).', 'error');
            return;
        }
        if (parseFloat(price) <= 0 || parseInt(quantity) <= 0) {
            showNotification('Price and Quantity must be positive numbers.', 'error');
            return;
        }
        if (isNaN(parseFloat(price)) || isNaN(parseInt(quantity))) {
            showNotification('Price and Quantity must be valid numbers.', 'error');
            return;
        }

        const productIndex = products.findIndex(p => p.id === currentEditProductId);
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex], // Keep original ID
                name,
                description: descriptionInput.value.trim(),
                price: parseFloat(price),
                quantity: parseInt(quantity),
                imageUrl: imageUrlInput.value.trim()
            };
            saveProductsToLocalStorage(); // Save after editing
        }
        renderProducts();
        hideFormsAndShowList();
        showNotification('Product updated successfully!', 'success');
    });
    
    // Add event listeners for cancel buttons dynamically if they exist

    // --- "EDIT PRODUCT" FUNCTIONALITY (Show Form & Populate) ---
    productListSection.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const productId = parseInt(event.target.dataset.id);
            currentEditProductId = productId;
            const productToEdit = products.find(p => p.id === currentEditProductId);

            if (productToEdit) {
                document.getElementById('editProductName').value = productToEdit.name;
                document.getElementById('editProductDescription').value = productToEdit.description;
                document.getElementById('editProductPrice').value = productToEdit.price;
                document.getElementById('editProductQuantity').value = productToEdit.quantity;
                document.getElementById('editProductImageUrl').value = productToEdit.imageUrl;

                editProductFormSection.style.display = 'block';
                addProductFormSection.style.display = 'none';
                productListSection.style.display = 'none';
                showAddFormBtn.style.display = 'none';
            }
        }
    });

    // ... (rest of the script remains the same)
    // This is safer than assuming they are always present.
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find the parent form section and hide it
            let formSection = btn.closest('section');
            if (formSection) {
                formSection.style.display = 'none';
            }
            // Show the product list and the add button
            productListSection.style.display = 'block';
            showAddFormBtn.style.display = 'block';
            // Reset current edit ID if applicable
            if (formSection && formSection.id === 'edit-product-form-section') {
                currentEditProductId = null;
                editProductForm.reset();
            } else if (formSection && formSection.id === 'add-product-form-section') {
                addProductForm.reset();
            }
        });
    });


    // Initial Load and Render
    loadProductsFromLocalStorage(); // Load products from local storage
    renderProducts(); // Then render them
});
