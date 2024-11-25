// Inicializar el carrito desde el localStorage o crear uno vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(cart, "cart");
const updateCartNumber = () => {
  const cartNumberElement = document.querySelector('.cart-number');
  if (cartNumberElement) {
    cartNumberElement.textContent = cart.length; // Actualiza con la longitud del carrito
  }
};

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
  updateCartNumber();
  updateCartUI();
};
// Eliminar un producto del carrito
const removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToLocalStorage();
  updateCartNumber();
  updateCartUI();
};
// Actualizar cantidad de un producto en el carrito
const updateQuantity = (productId, quantity) => {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity = quantity > 0 ? quantity : 1; // Evitar cantidades menores a 1
    saveCartToLocalStorage();
    updateCartNumber();
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
  updateCartNumber();
  updateCartUI();
};
// Actualizar la interfaz del carrito
const updateCartUI = () => {
  const cartContainer = document.getElementById("cart-container");
  const totalContainer = document.getElementById("total-container");
  if (cartContainer && totalContainer) {
    cartContainer.innerHTML = cart.length
      ? cart.map(item => `
<div class="cart-product-container">
  <div class="cart-product-image">
    <img loading="lazy" src="${item.thumbnail}" alt="${item.title}">
  </div>
  <div class="cart-product-detail">
    <p class="cart-product-title">${item.title}</p>
    <div class="cart-product-quantity"> cantidad
      <button onclick="updateQuantity(${item.id},-1)">-</button>
      <p>${quantity}</p>
      <button onclick="updateQuantity(${item.id},+1)">+</button>
    </div>
    <div class="cart-product-wrapper-bottom">
      <div class="cart-product-price"> Precio
        &#8364; ${item.price.toFixed(2)}
      </div>
      <div class="cart-product-delete"  >
        <ion-icon name="trash-outline"></ion-icon>
      </div>
    </div>
  </div>
</div>
      `).join("")
      : "<p>El carrito está vacío.</p>";
    const total = parseFloat(calculateTotal()) + parseFloat(calculateShipping());
    totalContainer.innerHTML = `
   <div class="cart-price-total">
<button onclick="clearCart()">Vaciar carrito</button>
  <p>Subtotal</p>
  <p> &#8364; ${calculateTotal()}</p>
</div>
<div class="cart-price-total">
  <p>Cupon <ion-icon name="ticket-outline"></ion-icon></p>
  <input type="text" minlength="0" maxlength="8" class="ticket-cupon" placeholder="cupon number">
</div>
<div class="cart-price-total">
  <p>Envío</p>
  <p>&#8364;${calculateShipping()}</p>
</div>
<div class="cart-price-total">
  <p>Total</p>
  <p>&#8364; ${total.toFixed(2)}</p>
</div>
    <a href="#" class="btn-division btn-cart-buy">Comprar</a>

    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  updateCartNumber(); // Actualiza el número al cargar la página
});

const initializeCartPage = () => {

  document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
  });
};
