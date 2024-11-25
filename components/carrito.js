// Inicializar el carrito desde el localStorage o crear uno vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para guardar el carrito en el localStorage
const saveCartToLocalStorage = () => {
 localStorage.setItem("cart", JSON.stringify(cart));
};

// Agregar un producto al carrito
const addToCart = (product) => {
 const existingProduct = cart.find((item) => item.id === product.id);
 if (existingProduct) {
  existingProduct.quantity += 1; // Incrementar cantidad si ya está en el carrito
 } else {
  cart.push({ ...product, quantity: 1 });
 }
 saveCartToLocalStorage();
 updateCartUI();
};

// Eliminar un producto del carrito
const removeFromCart = (productId) => {
 cart = cart.filter((item) => item.id !== productId);
 saveCartToLocalStorage();
 updateCartUI();
};

// Actualizar cantidad de un producto en el carrito
const updateQuantity = (productId, quantity) => {
 const product = cart.find((item) => item.id === productId);
 if (product) {
  product.quantity = quantity > 0 ? quantity : 1; // Evitar cantidades menores a 1
  saveCartToLocalStorage();
  updateCartUI();
 }
};

// Calcular el costo total del carrito
const calculateTotal = () => {
 return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
};

// Calcular costos de envío (puedes personalizar según peso, ubicación, etc.)
const calculateShipping = () => {
 const shippingRate = 5; // Por ejemplo, 5€ por pedido
 return cart.length > 0 ? shippingRate : 0;
};

// Vaciar el carrito
const clearCart = () => {
 cart = [];
 saveCartToLocalStorage();
 updateCartUI();
};

// Actualizar la interfaz del carrito
const updateCartUI = () => {
 const cartContainer = document.getElementById("cart-container");
 const totalContainer = document.getElementById("total-container");

 if (cartContainer && totalContainer) {
  cartContainer.innerHTML = cart.length
   ? cart.map(item => `
        <div class="cart-item">
          <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-thumbnail">
          <div>
            <p>${item.title}</p>
            <p>Precio: €${item.price.toFixed(2)}</p>
            <p>Cantidad:
              <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="update-quantity">
            </p>
            <button class="remove-item" data-id="${item.id}">Eliminar</button>
          </div>
        </div>
      `).join("")
   : "<p>El carrito está vacío.</p>";

  const total = parseFloat(calculateTotal()) + parseFloat(calculateShipping());
  totalContainer.innerHTML = `
      <p>Subtotal: €${calculateTotal()}</p>
      <p>Envío: €${calculateShipping()}</p>
      <p>Total: €${total.toFixed(2)}</p>
    `;
 }
};

// Event listeners para botones e inputs
document.addEventListener("click", (event) => {
 if (event.target.classList.contains("remove-item")) {
  const productId = parseInt(event.target.dataset.id);
  removeFromCart(productId);
 }
});

document.addEventListener("input", (event) => {
 if (event.target.classList.contains("update-quantity")) {
  const productId = parseInt(event.target.dataset.id);
  const newQuantity = parseInt(event.target.value);
  updateQuantity(productId, newQuantity);
 }
});

// Exportar funciones para usar en otros archivos
export { addToCart, removeFromCart, clearCart, calculateTotal, calculateShipping };
