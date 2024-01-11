let cart = [];

function init() {
    loadCartFromStorage();
    displayCart();
    displayTotal();
}

function addToCart() {
    let selectedProduct = document.getElementById('productSelect').value;
    let quantity = parseInt(document.getElementById('quantityInput').value);

    if (validateQuantity(quantity)) {
        let item = createCartItem(selectedProduct, quantity);
        cart.push(item);
        updateCart();
        showNotification(`${quantity} ${selectedProduct}(s) añadido(s) al carrito.`);
    } else {
        showNotification("La cantidad debe ser mayor que 0.");
    }
}

function updateCart() {
    saveCartToStorage();
    displayCart();
    displayTotal();
}

function displayCart() {
    let cartListElement = document.getElementById('cartList');
    clearElement(cartListElement);

    if (cart.length === 0) {
        createEmptyCartMessage(cartListElement);
    } else {
        cart.forEach(item => {
            let listItem = createCartItemElement(item);
            cartListElement.appendChild(listItem);
        });
    }
}

function createCartItemElement(item) {
    let listItem = document.createElement('li');
    listItem.className = 'list-group-item';

    let text = `${item.product} x ${item.quantity} - Total: $${item.total.toFixed(2)}`;

    listItem.textContent = text;
    listItem.appendChild(createDeleteButton(item.id));

    return listItem;
}

function createDeleteButton(itemId) {
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'btn btn-danger btn-sm float-end';
    deleteButton.addEventListener('click', () => removeFromCart(itemId));

    return deleteButton;
}

function displayTotal() {
    let totalElement = document.getElementById('total');
    let totalAmount = calculateTotal();
    totalElement.textContent = Number.parseFloat(totalAmount).toFixed(2);
}

function calculateTotal() {
    return cart.reduce((acc, item) => acc + item.total, 0);
}

function createCartItem(product, quantity) {
    let price = calculateProductPrice(product);
    let total = price * quantity;

    return { id: generateUniqueId(), product, quantity, total };
}

function validateQuantity(quantity) {
    return quantity > 0;
}

function showNotification(message) {
    let notificationArea = document.getElementById('notificationArea');
    notificationArea.textContent = message;
    notificationArea.style.display = 'block';

    setTimeout(() => {
        notificationArea.style.display = 'none';
        notificationArea.textContent = '';
    }, 3000);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
    showNotification("Producto eliminado del carrito.");
}

function clearElement(element) {
    element.innerHTML = '';
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

document.getElementById('addToCartBtn').addEventListener('click', addToCart);

document.getElementById('cartList').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-danger')) {
        let itemId = event.target.parentElement.id;
        removeFromCart(itemId);
    }
});

window.addEventListener('load', init);
