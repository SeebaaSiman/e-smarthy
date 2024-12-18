//* efecto horizontal-scroll
let currentIndex = 0;
const updateView = (index, container) => {
  const offset = index * -100; // Calcula el desplazamiento en porcentaje
  container.style.transform = `translateX(${offset}vw)`;
};

//* Inicializar el carrito desde el localStorage o crear uno vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(cart, "cart items:");
const updateCartNumber = () => {
  const cartNumberElement = document.querySelector('.cart-number');
  if (cartNumberElement) {
    cartNumberElement.textContent = cart.length === 0 ? "" : cart.length;
  }
};
const order = {
  cartItems: cart,
  totalBuy: null,
  userInfo: null,
  ticket: null,
  date: new Date()
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
  if (product.stock <= 0) {
    showToast({ message: 'Lo sentimos, este producto está agotado.', type: 'error' });
    return;
  }

  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    // Verificar si la cantidad en el carrito supera el stock disponible
    if (existingProduct.quantity >= product.stock) {
      showToast({ message: 'La cantidad solicitada supera el stock disponible.', type: 'error' });
      existingProduct.quantity = product.stock; // Ajustar la cantidad al stock máximo
    } else {
      existingProduct.quantity += 1; // Incrementar cantidad si ya está en el carrito
      showToast({ message: `Agregaste ${product.title} a tu carrito`, type: 'success' });
    }
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
    if (product.quantity >= product.stock && change == "1") {
      showToast({ message: 'La cantidad solicitada supera el stock disponible.', type: 'error' })
      existingProduct.quantity = product.stock; // Ajustar la cantidad al stock máximo
    } else if (product.quantity >= product.stock && change === "-1") {
      product.quantity = Math.max(1, product.quantity + change);
    }
    else {
      product.quantity = Math.max(1, product.quantity + change);
    }
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
// Calcular costos de envío
const calculateShipping = () => {
  const shippingRate = 3500;
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

  if (!cartContainer || !totalContainer) return;

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
      <div class="cart-product-price"> total<p>
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
    order.totalBuy = total.toFixed(2);
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
        <input type="text" name="cupon" minlength="0" maxlength="8" class="ticket-cupon" placeholder="cupon number">
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
    `;
  }
  const btnCartBuy = document.getElementById("btn-cart-buy");

  if (cart.length > 0) {
    btnCartBuy.style.scale = 1;
    btnCartBuy.style.opacity = 1;
    btnCartBuy.style.position = "relative";
  } else {
    btnCartBuy.style.scale = 0;
    btnCartBuy.style.opacity = 0;
    btnCartBuy.style.position = "absolute";

  }
  updateLanguageDisplay();
};

document.addEventListener('DOMContentLoaded', () => {
  updateCartNumber(); // Actualiza el número al cargar la página
  updateLanguageDisplay();
});

const initializeScrollHorizontal = () => {
  const horizontalScrollContainer = document.getElementById("horizontal-scroll-container");

  const firstBtnScroll = document.querySelectorAll(".first-horizontal-scroll");
  const secondBtnScroll = document.querySelectorAll(".second-horizontal-scroll");


  if (!horizontalScrollContainer) return;

  if (secondBtnScroll && firstBtnScroll) {
    secondBtnScroll.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentIndex = 1;
        updateView(currentIndex, horizontalScrollContainer);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
    firstBtnScroll.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentIndex = 0;
        updateView(currentIndex, horizontalScrollContainer);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
}
const initializeCartPage = () => {
  const cartContainer = document.getElementById('cart-container');
  const totalContainer = document.getElementById('total-container');


  if (!cartContainer || !totalContainer) return;
  // Actualizar la interfaz del carrito.
  updateCartUI();
  cartSubtitle();
  updateLanguageDisplay();

};

const initializeUserInfo = () => {
  const horizontalScrollContainer = document.getElementById("horizontal-scroll-container");
  const thirdBtnScroll = document.getElementById("third-horizontal-scroll");

  const formContainer = document.querySelector(".user-form")
  const userName = document.getElementById("user-name");
  const userMail = document.getElementById("user-mail");
  const userAddress = document.getElementById("user-address");
  const userPhone = document.getElementById("user-phone");
  const userComents = document.getElementById("user-other");

  if (!horizontalScrollContainer || !formContainer || !userName || !userAddress || !userMail || !userPhone || !thirdBtnScroll || !userComents) return;

  const allInputsValid = () => {
    return (
      userAddress.checkValidity() &&
      userMail.checkValidity() &&
      userPhone.checkValidity() &&
      userName.checkValidity()
    );
  }

  thirdBtnScroll.addEventListener("click", (e) => {
    if (allInputsValid()) {
      e.preventDefault();
      order.userInfo = {
        name: userName.value,
        email: userMail.value,
        address: userAddress.value,
        phone: userPhone.value,
        coments: userComents.value || ""
      };
      currentIndex = 2;
      updateView(currentIndex, horizontalScrollContainer);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast({ message: 'Completa toda la información de envío', type: 'warning' });
    }
  });
}

const cardLogo = {
  visa: `<svg width="36px" height="36px" viewBox="0 0 141.732 141.732"
    xmlns="http://www.w3.org/2000/svg">
    <g fill="#2566af">
      <path
        d="M62.935 89.571h-9.733l6.083-37.384h9.734zM45.014 52.187L35.735 77.9l-1.098-5.537.001.002-3.275-16.812s-.396-3.366-4.617-3.366h-15.34l-.18.633s4.691.976 10.181 4.273l8.456 32.479h10.141l15.485-37.385H45.014zM121.569 89.571h8.937l-7.792-37.385h-7.824c-3.613 0-4.493 2.786-4.493 2.786L95.881 89.571h10.146l2.029-5.553h12.373l1.14 5.553zm-10.71-13.224l5.114-13.99 2.877 13.99h-7.991zM96.642 61.177l1.389-8.028s-4.286-1.63-8.754-1.63c-4.83 0-16.3 2.111-16.3 12.376 0 9.658 13.462 9.778 13.462 14.851s-12.075 4.164-16.06.965l-1.447 8.394s4.346 2.111 10.986 2.111c6.642 0 16.662-3.439 16.662-12.799 0-9.72-13.583-10.625-13.583-14.851.001-4.227 9.48-3.684 13.645-1.389z" />
    </g>
    <path
      d="M34.638 72.364l-3.275-16.812s-.396-3.366-4.617-3.366h-15.34l-.18.633s7.373 1.528 14.445 7.253c6.762 5.472 8.967 12.292 8.967 12.292z"
      fill="#e6a540" />
    <path fill="none" d="M0 0h141.732v141.732H0z" />
  </svg>`,
  mastercard: `  <svg class="logo" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36"
                viewBox="0 0 48 48">
                <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path>
                <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path>
                <path fill="#ff3d00"
                  d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z">
                </path>
              </svg>`,
  amex: `<svg version="1.1" id="Layer_1" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
	 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="52" height="36"
	 viewBox="0 0 750 471" enable-background="new 0 0 752 471" xml:space="preserve">
<g>
	<g>
		<path fill="#2557D6" d="M554.594,130.608l-14.521,35.039h29.121L554.594,130.608z M387.03,152.321
			c2.738-1.422,4.349-4.515,4.349-8.356c0-3.764-1.693-6.49-4.431-7.771c-2.492-1.42-6.328-1.584-10.006-1.584h-25.978v19.523h25.63
			C380.7,154.134,384.131,154.074,387.03,152.321z M54.142,130.608l-14.357,35.039h28.8L54.142,130.608z M722.565,355.08h-40.742
			v-18.852h40.578c4.023,0,6.84-0.525,8.537-2.177c1.471-1.358,2.494-3.336,2.494-5.733c0-2.562-1.023-4.596-2.578-5.813
			c-1.529-1.342-3.76-1.953-7.434-1.953c-19.81-0.67-44.523,0.609-44.523-27.211c0-12.75,8.131-26.172,30.27-26.172h42.025v-17.492
			h-39.045c-11.783,0-20.344,2.81-26.406,7.181v-7.181h-57.752c-9.233,0-20.074,2.279-25.201,7.181v-7.181H499.655v7.181
			c-8.207-5.898-22.057-7.181-28.447-7.181H403.18v7.181c-6.492-6.262-20.935-7.181-29.734-7.181h-76.134l-17.42,18.775
			l-16.318-18.775H149.847v122.675h111.586l17.95-19.076l16.91,19.076l68.78,0.059v-28.859h6.764
			c9.125,0.145,19.889-0.223,29.387-4.311v33.107h56.731v-31.976h2.736c3.492,0,3.838,0.146,3.838,3.621v28.348h172.344
			c10.941,0,22.38-2.786,28.712-7.853v7.853h54.668c11.375,0,22.485-1.588,30.938-5.653v-22.853
			C746.069,351.297,736.079,355.08,722.565,355.08z M372.734,326.113h-26.325v29.488h-41.006L279.425,326.5l-26.997,29.102h-83.569
			v-87.914h84.855l25.955,28.818l26.835-28.818h67.414c16.743,0,35.555,4.617,35.555,28.963
			C409.473,321.072,391.176,326.113,372.734,326.113z M499.323,322.127c2.98,4.291,3.41,8.297,3.496,16.047v17.428h-21.182v-10.998
			c0-5.289,0.512-13.121-3.41-17.209c-3.08-3.149-7.781-3.901-15.48-3.901h-22.545v32.108h-21.198v-87.914h48.706
			c10.685,0,18.462,0.472,25.386,4.148c6.658,4.006,10.848,9.494,10.848,19.523c-0.002,14.031-9.399,21.19-14.953,23.389
			C493.684,316.473,497.522,319.566,499.323,322.127z M586.473,285.869h-49.404v15.982h48.197v17.938h-48.197v17.492l49.404,0.078
			v18.242h-70.414v-87.914h70.414V285.869z M640.686,355.6h-41.09v-18.852h40.926c4.002,0,6.84-0.527,8.619-2.178
			c1.449-1.359,2.492-3.336,2.492-5.73c0-2.564-1.129-4.598-2.574-5.818c-1.615-1.34-3.842-1.948-7.514-1.948
			c-19.73-0.673-44.439,0.606-44.439-27.212c0-12.752,8.047-26.174,30.164-26.174h42.297v18.709h-38.703
			c-3.836,0-6.33,0.146-8.451,1.592c-2.313,1.423-3.17,3.535-3.17,6.322c0,3.316,1.963,5.574,4.615,6.549
			c2.228,0.771,4.617,0.996,8.211,0.996l11.359,0.308c11.449,0.274,19.313,2.25,24.092,7.069c4.105,4.232,6.311,9.578,6.311,18.625
			C673.829,346.771,661.963,355.6,640.686,355.6z M751.192,343.838L751.192,343.838L751.192,343.838L751.192,343.838z
			 M477.061,287.287c-2.549-1.508-6.311-1.588-10.066-1.588h-25.979v19.744h25.631c4.104,0,7.594-0.144,10.414-1.812
			c2.734-1.646,4.371-4.678,4.371-8.438C481.432,291.434,479.795,288.711,477.061,287.287z M712.784,285.697
			c-3.838,0-6.389,0.145-8.537,1.588c-2.227,1.426-3.081,3.537-3.081,6.326c0,3.315,1.879,5.572,4.612,6.549
			c2.228,0.771,4.615,0.996,8.129,0.996l11.437,0.303c11.537,0.285,19.242,2.262,23.938,7.08c0.855,0.668,1.369,1.42,1.957,2.174
			v-25.014h-38.453L712.784,285.697L712.784,285.697z M373.47,285.697h-27.509v22.391h27.265c8.105,0,13.146-4.006,13.149-11.611
			C386.372,288.789,381.086,285.697,373.47,285.697z M189.872,285.697v15.984h46.315v17.938h-46.315v17.49h51.87l24.1-25.791
			l-23.076-25.621H189.872L189.872,285.697z M325.321,347.176v-70.482l-32.391,34.673L325.321,347.176z M191.649,206.025v15.148
			h176.263l-0.082-32.046h3.411c2.39,0.083,3.084,0.302,3.084,4.229v27.818h91.164v-7.461c7.353,3.924,18.789,7.461,33.838,7.461
			h38.353l8.209-19.522h18.197l8.026,19.522h73.906V202.63l11.189,18.543h59.227V98.59h-58.611v14.477l-8.207-14.477h-60.143v14.477
			l-7.537-14.477h-81.24c-13.6,0-25.551,1.89-35.207,7.158V98.59h-56.063v7.158c-6.146-5.43-14.519-7.158-23.826-7.158H180.784
			l-13.742,31.662L152.928,98.59H88.417v14.477L81.329,98.59H26.312L0.763,156.874v46.621l37.779-87.894h31.346l35.88,83.217
			v-83.217h34.435l27.61,59.625l25.365-59.625h35.126v87.894h-21.625l-0.079-68.837l-30.593,68.837h-18.524l-30.671-68.898v68.898
			H83.899l-8.106-19.605H31.865l-8.19,19.605H0.762v17.682h36.049l8.128-19.523h18.198l8.106,19.523h70.925V206.25l6.33,14.989
			h36.819L191.649,206.025z M469.401,125.849c6.818-7.015,17.5-10.25,32.039-10.25h20.424v18.833h-19.996
			c-7.696,0-12.047,1.14-16.233,5.208c-3.599,3.7-6.066,10.696-6.066,19.908c0,9.417,1.881,16.206,5.801,20.641
			c3.248,3.478,9.152,4.533,14.705,4.533h9.478l29.733-69.12h31.611l35.719,83.134v-83.133h32.123l37.086,61.213v-61.213h21.611
			v87.891h-29.898l-39.989-65.968v65.968h-42.968l-8.209-19.605h-43.827l-7.966,19.605h-24.688c-10.254,0-23.238-2.258-30.59-9.722
			c-7.416-7.462-11.271-17.571-11.271-33.553C458.026,147.182,460.329,135.266,469.401,125.849z M426.006,115.6h21.526v87.894
			h-21.526V115.6z M328.951,115.6h48.525c10.779,0,18.727,0.285,25.547,4.21c6.674,3.926,10.676,9.658,10.676,19.46
			c0,14.015-9.393,21.254-14.864,23.429c4.614,1.75,8.559,4.841,10.438,7.401c2.979,4.372,3.492,8.277,3.492,16.126v17.267h-21.279
			l-0.08-11.084c0-5.29,0.508-12.896-3.33-17.122c-3.082-3.09-7.782-3.763-15.379-3.763H350.05v31.97h-21.098L328.951,115.6
			L328.951,115.6z M243.902,115.6h70.479v18.303h-49.379v15.843h48.193v18.017h-48.193v17.553h49.379v18.177h-70.479V115.6
			L243.902,115.6z"/>
	</g>
</g>
</svg>`
};
function generarTicket() {
  // Array con las letras del alfabeto
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Función para obtener un número aleatorio entre un rango
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generar dos letras aleatorias
  const letra1 = letras[getRandomInt(0, letras.length - 1)];
  const letra2 = letras[getRandomInt(0, letras.length - 1)];

  // Generar tres números aleatorios entre 0 y 9
  const numero1 = getRandomInt(0, 9);
  const numero2 = getRandomInt(0, 9);
  const numero3 = getRandomInt(0, 9);

  // Concatenar las letras y los números para formar el ticket
  const ticket = letra1 + letra2 + '-' + numero1 + numero2 + numero3;

  return ticket;
}
const initializePayments = () => {
  const formContainer = document.querySelector(".payments-form")
  const creditCardType = document.getElementById("credit-card-type");
  const creditCardLogo = document.getElementById("credit-card-logo");
  const creditCardDate = document.getElementById("credit-card-date");
  const creditCardName = document.getElementById("credit-card-name");
  const creditCardCode = document.getElementById("credit-card-code");
  const creditCardNumber = document.getElementById("credit-card-number");
  const innerContainer = document.querySelector(".credit-card-inner")

  const inputCreditCard = document.getElementById("select-card");
  const inputCreditName = document.getElementById("credit-name");
  const inputCreditNumber = document.getElementById("credit-number");
  const inputCreditDate = document.getElementById("expiry-date");
  const inputCreditMonth = document.getElementById("expiry-month");
  const inputCreditCode = document.getElementById("cvv");

  const btnSubmit = document.querySelector(".purchase--btn");

  if (!formContainer || !inputCreditCard || !creditCardType || !creditCardLogo || !creditCardDate || !creditCardName || !creditCardCode || !inputCreditName || !inputCreditName || !inputCreditDate || !inputCreditMonth || !innerContainer) return;

  inputCreditCard.addEventListener("input", (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "visa") {
      creditCardType.textContent = "VISA";
      creditCardLogo.innerHTML = cardLogo[selectedValue];
    } else if (selectedValue === "mastercard") {
      creditCardType.textContent = "MASTERCARD";
      creditCardLogo.innerHTML = cardLogo[selectedValue];
    } else if (selectedValue === "amex") {
      creditCardType.textContent = "AMEX";
      creditCardLogo.innerHTML = cardLogo[selectedValue];
    } else return;
  });
  inputCreditName.addEventListener("input", (e) => {
    const inputValue = e.target.value;
    creditCardName.textContent = inputValue;
  })
  inputCreditNumber.addEventListener("input", (e) => {
    const inputValue = e.target.value;
    if (inputValue.length > 16) {
      e.target.value = inputValue.slice(0, 16);
    }
    creditCardNumber.textContent = inputValue;
  })
  let dateValue = "01";
  let monthValue = "29";
  function updateCreditCardDate() {
    creditCardDate.textContent = `${dateValue} / ${monthValue}`;
  }
  inputCreditDate.addEventListener("input", (e) => {
    dateValue = e.target.value;
    updateCreditCardDate();
  });
  inputCreditMonth.addEventListener("input", (e) => {
    monthValue = e.target.value;
    updateCreditCardDate();
  });

  const flipForInputsValid = () => {
    return (
      inputCreditCard.checkValidity() &&
      inputCreditName.checkValidity() &&
      inputCreditNumber.checkValidity() &&
      inputCreditDate.checkValidity() &&
      inputCreditMonth.checkValidity()
    );
  };
  formContainer.addEventListener("change", () => {
    if (flipForInputsValid()) {
      // Si todos los inputs son válidos, rotar el contenedor
      innerContainer.style.transform = "rotateY(-180deg)";
    } else {
      // Si no son válidos, restablecer la rotación
      innerContainer.style.transform = "rotateY(0deg)";
    }
  })

  inputCreditCode.addEventListener("input", (e) => {
    const inputValue = e.target.value;
    if (inputValue.length > 3) {
      e.target.value = inputValue.slice(0, 3);
    }
    creditCardCode.textContent = inputValue;
  })
  const allInputsValid = () => {
    return (
      inputCreditCard.checkValidity() &&
      inputCreditName.checkValidity() &&
      inputCreditNumber.checkValidity() &&
      inputCreditDate.checkValidity() &&
      inputCreditMonth.checkValidity() &&
      inputCreditCode.checkValidity()
    );
  };

  // Evento para el botón de validación
  btnSubmit.addEventListener("click", (e) => {
    if (allInputsValid()) {
      e.preventDefault();
      const miTicket = generarTicket();
      order.ticket = miTicket;
      showToast({ message: 'Nos vemos pronto 🥂', type: 'success' });
      showToast({ message: `Te enviamos un mail. Tu orden es ${miTicket}`, type: 'info' });
      showToast({ message: 'Felicitaciones por tu compra!!🎉', type: 'success' });
      console.log(order, "Envío de orden");
      setTimeout(() => {
        window.location.href = "#/";
        clearCart();
      }, 4800);
    } else {
      showToast({ message: 'Completa toda la información para terminar el pago', type: 'warning' });
    }
  });
}



const GiftCardProduct = {
  id: 999,
  title: "Gift card premium",
  price: null,
  stock: 999,
  thumbnail: "../assets/gift-card/gift-card-logo.jpg"
};
// id= btn-buy-giftcard
// getALl () saber valor de los hijos
// / square
//id="btn-buy-giftcard" evento click sabe el valor y lo agrega, al id le suma el price, entonces puede haber nada más que 6 opciones
const initializeGiftCard = () => {
  const inputsRadio = document.getElementsByName("square");
  const btnBuyGiftcard = document.getElementById("btn-buy-giftcard");
  if (!inputsRadio || !btnBuyGiftcard) return;
  // creo un array ya que inputsRadio es un node list y únicamente tiene la función forEach
  const inputsRadioArray = Array.from(inputsRadio);

  btnBuyGiftcard.addEventListener("click", () => {
    const selectedRadio = inputsRadioArray.find(input => input.checked);

    if (selectedRadio) {
      // accedo al hijo <p> y extraigo su contenido
      const contentTagP = selectedRadio.nextElementSibling.textContent;
      // content sin el símbolo euro, será el value del carrito
      const price = parseFloat(contentTagP.replace('€', ''));
      console.log(price, "price");
      addToCart({
        id: 999 + price,
        title: `Gift card premium ${price}`,
        price: price,
        stock: 999,
        thumbnail: "../assets/gift-card/gift-card-logo.jpg"
      });
      showToast({ message: `Gift card premium de ${price} agregada al carrito`, type: 'success' });
    } else {
      showToast({ message: 'Selecciona primero una gift card', type: 'warning' });
    };
  })
}