// Inicializar el carrito desde el localStorage o crear uno vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(cart, "cart items:");
const updateCartNumber = () => {
  const cartNumberElement = document.querySelector('.cart-number');
  if (cartNumberElement) {
    cartNumberElement.textContent = cart.length === 0 ? "" : cart.length; // Actualiza con la longitud del carrito
  }
};
const cartSubtitle = () => {
  let isEnglish = localStorage.getItem('isEnglish') === 'true';
  const subtitleContainer = document.getElementById("shipping-cart-title");
  const shipping = calculateShipping();

  const freeEN = "Free standard shipping available for your order.";
  const freeES = "Envío estándar gratuito disponible para su pedido.";
  const promoEN = "Free shipping for orders over €5,000";
  const promoES = "Envío gratuito para pedidos que superen los 5.000 €";

  if (!subtitleContainer) return;
  if (shipping === 0) {
    subtitleContainer.textContent = isEnglish ? freeEN : freeES;
    subtitleContainer.style.color = "#3ab65c"
  } else {
    subtitleContainer.textContent = isEnglish ? promoEN : promoES;
    subtitleContainer.style.color = "#bf333b"
  }
}
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
  cartSubtitle();
  updateCartUI();
  updateLanguageDisplay();

};
// Eliminar un producto del carrito
const removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToLocalStorage();
  updateCartNumber();
  cartSubtitle();
  updateCartUI();
  updateLanguageDisplay();

};
// Actualizar cantidad de un producto en el carrito
const updateQuantity = (productId, change) => {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity = Math.max(1, product.quantity + change); // Asegúrate de que la cantidad no sea menor a 1
    saveCartToLocalStorage();
    updateCartNumber();
    cartSubtitle();
    updateCartUI();
    updateLanguageDisplay();

  }
};

// Calcular el costo total del carrito
const calculateTotal = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
};
// Calcular costos de envío (puedes personalizar según peso, ubicación, etc.)
const calculateShipping = () => {
  const shippingRate = 3500; // Por ejemplo, 5€ por pedido
  const subTotal = calculateTotal();
  return subTotal < 5000 ? shippingRate : 0;
};
// Vaciar el carrito
const clearCart = () => {
  cart = [];
  saveCartToLocalStorage();
  updateCartNumber();
  cartSubtitle();
  updateCartUI();
};
// Actualizar la interfaz del carrito
const updateCartUI = () => {
  const cartContainer = document.getElementById("cart-container");
  const totalContainer = document.getElementById("total-container");

  if (!cartContainer || !totalContainer) {
    console.error("No se encontraron los contenedores del carrito en el DOM.");
    return;
  }

  if (cartContainer && totalContainer) {
    // Renderizar los productos del carrito
    cartContainer.innerHTML = cart.length
      ? cart.map(item => `
<div class="cart-product-container">
  <div class="cart-product-image">
    <img loading="lazy" src="${item.thumbnail}" alt="${item.title}">
  </div>
  <div class="cart-product-detail">
    <p class="cart-product-title">${item.title}</p>
    <div class="cart-product-quantity">
    <p class="language spanish">cantidad</p>
    <p class="language english">quantity</p>
      <button onclick="updateQuantity(${item.id},-1)">-</button>
      <p> ${item.quantity}</p>
      <button onclick="updateQuantity(${item.id},+1)">+</button>
    </div>
    <div class="cart-product-wrapper-bottom">
      <div class="cart-product-price"> total        <p>
        &#8364;
        ${item.price.toFixed(2)}
        </p>
      </div>
      <div class="cart-product-delete"
       onclick="removeFromCart(${item.id});
 showToast({ message: '${item.title} eliminado de tu carrito', type: 'warning' });"
       >
        <ion-icon name="trash-outline"></ion-icon>
      </div>
    </div>
  </div>
</div>
      `).join("")
      : `<div class='empty-cart'>
      <p class="language spanish"> El carrito está vacío.  </p>
      <p class="language english">The cart is empty.  </p>
        <a href="#/products" class="btn-division btn-cart-buy">
<p class="language spanish"> Ir a productos</p>
<p class="language english"> Go to products</p>

        </a>
      </div>
      `;

    // Renderizar la sección de precios
    const total = parseFloat(calculateTotal()) + parseFloat(calculateShipping());

    totalContainer.innerHTML = `
      ${cart.length > 0 ? `
        <button  onclick="clearCart();
          showToast({ message: 'Carrito vacío ', type: 'error' });"
          id="btn-delete-cart">Vaciar carrito <ion-icon name="cart-outline"></ion-icon>
        </button>
      ` : ""}
      <div class="cart-price-total">
        <p>Subtotal</p>
        <p>&#8364; ${calculateTotal()}</p>
      </div>
      <div class="cart-price-total">
        <p class="language spanish">Cupon <ion-icon name="ticket-outline"></ion-icon></p>
        <p class="language english">Coupon <ion-icon name="ticket-outline"></ion-icon></p>
        <input type="text" minlength="0" maxlength="8" class="ticket-cupon" placeholder="cupon number">
      </div>
      <div class="cart-price-total">
        <p class="language spanish">Envío</p>
        <p class="language english">Shipment</p>
        <p>&#8364;${calculateShipping()}</p>
      </div>
      <div class="cart-price-total">
        <p>Total</p>
        <p>&#8364; ${total.toFixed(2)}</p>
      </div>
      ${cart.length > 0 ? `
        <a href="#" class="btn-division btn-cart-buy">Comprar</a>
      ` : ""}
    `;
  }

};


document.addEventListener('DOMContentLoaded', () => {
  updateCartNumber(); // Actualiza el número al cargar la página
});

const initializeCartPage = () => {
  // Asegúrate de que el contenedor de la página del carrito esté listo.
  const cartContainer = document.getElementById('cart-container');
  const totalContainer = document.getElementById('total-container');


  if (!cartContainer || !totalContainer) {
    console.error('Los contenedores del carrito no están definidos en el DOM.');
    return;
  }
  // Actualizar la interfaz del carrito.
  updateCartUI();
  cartSubtitle();
  updateLanguageDisplay();
};

