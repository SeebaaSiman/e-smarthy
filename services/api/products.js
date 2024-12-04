const API_URL = 'https://dummyjson.com/products?limit=200';
const STORAGE_KEY = 'productos';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

async function fetchAndStoreProducts() {
  const cachedProducts = getProductsFromLocalStorage();
  // Verificar si los productos en caché están vencidos
  if (cachedProducts && cachedProducts.expiration && cachedProducts.expiration > Date.now()) {
    return cachedProducts.data;
  }
  // Si los productos están vencidos o no existen, hacer la petición a la API
  const response = await fetch(API_URL);
  const data = await response.json();
  // Agregar la fecha de expiración y guardar en localStorage
  const productsWithExpiration = {
    data,
    expiration: Date.now() + EXPIRATION_TIME
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productsWithExpiration));
  return data;
}

function getProductsFromLocalStorage() {
  const productsString = localStorage.getItem(STORAGE_KEY);
  return productsString ? JSON.parse(productsString) : null;
}
document.addEventListener("DOMContentLoaded", fetchAndStoreProducts);


//* Depur
const productsFromLocalStorage = getProductsFromLocalStorage()?.data?.products;
console.log(productsFromLocalStorage, "productos en mi localStorage");


const categories = new Set(productsFromLocalStorage.map(producto => producto.category));
const allCategoriesProducts = [...categories];
//map crea un nuevo array extrayendo solo las categorías de cada objeto del array original
//Set elimina los duplicados, asegurando que solo tengamos categorías únicas
//Convertimos el Set a un array usando el operador de propagación spread (...) para obtener un array con las categorías únicas

//* Según estén en stock o no

const availabilityStatus = new Set(productsFromLocalStorage.map(producto => producto.availabilityStatus));
const allavailabilityStatus = [...availabilityStatus];
//map crea un nuevo array extrayendo solo las categorías de cada objeto del array original
//Set elimina los duplicados, asegurando que solo tengamos categorías únicas
//Convertimos el Set a un array usando el operador de propagación spread (...) para obtener un array con las categorías únicas


const depurRating = productsFromLocalStorage.sort((a, b) => b.rating - a.rating);
const top6Rating = depurRating.slice(0, 6);
// sort es un método para ordenar
// (a, b) => b.rating - a.rating ordena de manera descendente, si el resultado de la resta es positivo + B va antes que A (descendete), si el resultado es negativo - A va antes que B (orden ascendente), si el resultado es cero los elementos mantienen su orden relativo
// slice(0, 6) crea un nuevo array con los primeros 6 elementos

const depurdiscount = productsFromLocalStorage.sort((a, b) => b.discountPercentage - a.discountPercentage);
const top6DiscountPercentage = depurdiscount.slice(0, 6);
// sort es un método para ordenar
// (a, b) => b.rating - a.rating ordena de manera descendente, si el resultado de la resta es positivo + B va antes que A (descendete), si el resultado es negativo - A va antes que B (orden ascendente), si el resultado es cero los elementos mantienen su orden relativo
// slice(0, 6) crea un nuevo array con los primeros 6 elementos


//*Fx que se encarga de renderizar cada card product dentro de un div contenedor
const renderProducts = (products, productsContainer) => {
  productsContainer.innerHTML = products
    .map(product => `
        <div class="card-product">
        <a href="#/products/product-detail-${product.id}" class="product-link" data-id="${product.id}">
            <ion-icon name="eye-outline" class="icon-eye"></ion-icon>
            <ion-icon name="arrow-forward-circle-outline" class="icon-arrow-circle"></ion-icon>
          </a>
          <img loading="lazy" src="${product.thumbnail}" alt="${product.title}">
          <p class="title-card-product">${product.title}</p>
          <abbr class="description-card-product">${product.description}</abbr>
          <p class="price-card-product">&#8364; ${product.price.toFixed(2)}</p>
   <button
  onclick="addToCart({
                      id: ${product.id},
                      title: '${product.title}',
                      price: ${product.price},
                      thumbnail: '${product.thumbnail}'
                    });
                               showToast({ message: 'Agregaste ${product.title} a tu carrito', type: 'success' });"
  class="btn-division">
  Agregar al carrito
</button>
        </div>
      `)
    .join('');
};

//* filtros de búsqueda
const filters = {
  category: "",
  rating: null,
  priceMin: null,
  priceMax: null,
  availability: "",
};

const filterProducts = (products) => {
  return products.filter((product) => {
    // Filtro por categoría
    if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    // Filtro por rating
    if (filters.rating && Math.floor(product.rating) !== parseInt(filters.rating)) {
      return false;
    }
    // Filtro por precio mínimo
    if (filters.priceMin && product.price < filters.priceMin) {
      return false;
    }
    // Filtro por precio máximo
    if (filters.priceMax && product.price > filters.priceMax) {
      return false;
    }
    // Filtrar por disponibilidad
    if (filters.availability && product.availabilityStatus !== filters.availability) {
      return false;
    }
    return true; // Si pasa todos los filtros, incluir en los resultados
  });
};

const initializeProductsPage = () => {
  updateLanguageDisplay();
  const filteredCountElement = document.getElementById("filtered-count");

  const availabilityDatalist = document.getElementById('availability');
  const categoriesDataList = document.getElementById('category');

  // Comprueba si el contenedor existe
  const cardProducts = document.getElementById('card-products-list');
  if (!cardProducts || !filteredCountElement || !availabilityDatalist || !categoriesDataList) {
    console.error("Faltan contenedores necesarios en el DOM");
  }
  else {
    // Agregar las opciones dinámicamente
    availabilityStatus.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      availabilityDatalist.appendChild(optionElement);
    });
    allCategoriesProducts.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      categoriesDataList.appendChild(optionElement);
    });

    // Renderiza los productos
    renderProducts(productsFromLocalStorage, cardProducts);
    filteredCountElement.textContent = `${productsFromLocalStorage.length}`;

    // Asignar eventos a los filtros
    document.querySelector("[list='category']").addEventListener("input", (e) => {
      filters.category = e.target.value;
      updateFilteredProducts();
    });
    // Asignar evento para capturar el filtro de disponibilidad
    document.querySelector("[list='availability']").addEventListener("input", (e) => {
      filters.availability = e.target.value; // Capturar el valor seleccionado
      updateFilteredProducts();
    });
    document.querySelectorAll(".filter-rating input").forEach((radio) => {
      radio.addEventListener("change", (e) => {
        filters.rating = e.target.value.split("-")[1];
        updateFilteredProducts();
      });
    });
    document.querySelectorAll(".filter-price-container input[type='number']").forEach((input, index) => {
      input.addEventListener("input", (e) => {
        if (index === 0) filters.priceMin = parseFloat(e.target.value) || null;
        if (index === 1) filters.priceMax = parseFloat(e.target.value) || null;
        updateFilteredProducts();
      });
    });
    // Función para actualizar los productos filtrados
    const updateFilteredProducts = () => {

      const filteredProducts = filterProducts(productsFromLocalStorage);
      renderProducts(filteredProducts, cardProducts);
      // Actualizar el número de productos filtrados
      filteredCountElement.textContent = `${filteredProducts.length}`;

      console.log(filteredProducts, "productos filtrados")
    };
  }
}

const initializeProductDetailPage = (productId) => {
  const selectedProduct = productsFromLocalStorage.find(product => product.id == productId);
  console.log(selectedProduct, "producto seleccionado para product-detail-page");

  if (!selectedProduct) {
    console.error("Producto no encontrado");
    return;
  }

  // Mapeo dinámico de las imágenes
  const imagesAside = selectedProduct.images.map((img, index) => `
    <img loading="lazy" src="${img}" class="${index === 0 ? "active" : ""}" alt="${selectedProduct.title}">
  `).join("");

  // Mapeo dinámico de las reseñas
  const reviewsContent = selectedProduct.reviews.map(review => `
    <div class="review-user-product-detail">
      <div class="review-user-user-container">
        <ion-icon name="person-outline"></ion-icon>
        <span>
          <p>${review.reviewerName}</p>
          <p>${review.reviewerEmail}</p>
        </span>
      </div>
      <div class="review-comment-container">
        <span>
          <div class="banner-rating">
            ${Array(5).fill().map((_, i) => `
              <ion-icon name="${i < review.rating ? "star" : "star-outline"}"></ion-icon>
            `).join("")}
            (${review.rating})
          </div>
          <p>${review.date}</p>
        </span>
        <p>${review.comment}</p>
      </div>
    </div>
  `).join("");
  console.log(selectedProduct.availabilityStatus.toLowerCase(), "stock de product selected");

  // Renderizar los detalles en el contenedor
  const productDetailContainer = document.getElementById("product-detail");
  if (productDetailContainer) {
    productDetailContainer.innerHTML = `
     <a href="#/products" class="icon-arrow-product-detail"><ion-icon name="arrow-back-circle-outline"></ion-icon></a>
      <section class="first-section-product-detail">
        <div class="image-product-container">
          <div class="aside-image-container">
            ${imagesAside}
          </div>
          <div class="image-product-show">
            <img loading="lazy" src="${selectedProduct.thumbnail}" alt="${selectedProduct.title}">
          </div>
        </div>
        <div class="details-product-container">
          <h1>${selectedProduct.title}</h1>
          <p>${selectedProduct.description}</p>
          <div class="details-product-price">
            <span>
              <ion-icon name="caret-down-outline"></ion-icon>
              ${selectedProduct.discountPercentage} % off
            </span>
            <p class="price-card-product">&#8364; ${selectedProduct.price.toFixed(2)}</p>
          </div>
           <button
  onclick="addToCart({
                      id: ${selectedProduct.id},
                      title: '${selectedProduct.title}',
                      price: ${selectedProduct.price},
                      thumbnail: '${selectedProduct.thumbnail}'
                    });
 showToast({ message: 'Agregaste ${selectedProduct.title} a tu carrito', type: 'success' });"  class="btn-division">
 <p class="language spanish">Agregar al carrito</p>
 <p class="language english">Add to cart</p>
</button>
       <div class="footer-pay">
            <img loading="lazy" src="assets/cards/amex.png" alt="card amex image">
            <img loading="lazy" src="assets/cards/apple-pay.png" alt="card apple pay image">
            <img loading="lazy" src="assets/cards/google-pay.jpg" alt="card google pay image">
            <img loading="lazy" src="assets/cards/mastercard.png" alt="card mastercard image">
            <img loading="lazy" src="assets/cards/paypal.jpg" alt="paypal image">
            <img loading="lazy" src="assets/cards/shop-pay.webp" alt="card shop pay image">
            <img loading="lazy" src="assets/cards/visa.png" alt="card visa image">
          </div>
        </div>
      </section>
      <section class="information-section-product-detail">
        <div class="product-detail-tags">
          ${selectedProduct.tags.map(tag => `
            <span>
              <p>${tag}</p><ion-icon name="pricetags-outline"></ion-icon>
            </span>
          `).join("")}
        </div>
        <div class="product-detail-info">
          <span><p>Stock:</p><p>${selectedProduct.stock}</p></span>
          <span><p class="language spanish">Peso (libras):</p><p class="language english">Weight:</p><p>${selectedProduct.weight}</p></span>
          <span><p class="language spanish">Ancho:</p><p class="language english">Width:</p><p>${selectedProduct.dimensions.width}</p></span>
          <span><p class="language spanish">Altura:</p><p class="language english">Height:</p><p>${selectedProduct.dimensions.height}</p></span>
          <span><p class="language spanish">Profundidad:</p> <p class="language english">Depth:</p><p>${selectedProduct.dimensions.depth}</p></span>
        </div>
        <p>${selectedProduct.warrantyInformation}</p>
        <p>${selectedProduct.shippingInformation}</p>
        <div class="product-detail-stock ${selectedProduct.availabilityStatus.toLowerCase()}">
          <p>${selectedProduct.availabilityStatus}</p>
        </div>
        <p>${selectedProduct.returnPolicy}</p>
        <p class="language spanish">Orden mínima de ${selectedProduct.minimumOrderQuantity} productos</p>
        <p class="language english">Minimum order of ${selectedProduct.minimumOrderQuantity} products</p>
      </section>
      <section class="reviews-section-product-detail">
        <div class="reviews-rating-product-detail">
          <h3 class="language english">Rating</h3>
          <h3 class="language spanish">Calificación</h3>
          <div class="banner-rating">
            ${Array(5).fill().map((_, i) => `
              <ion-icon name="${i < Math.round(selectedProduct.rating) ? "star" : "star-outline"}"></ion-icon>
            `).join("")} (${selectedProduct.rating})
          </div>
        </div>
        ${reviewsContent}
      </section>
    `;
  } else {
    console.error("El contenedor para el detalle del producto no existe en el DOM");
  }
  updateLanguageDisplay();

};

const initializeSliderProductDetail = () => {

  const asideImageContainer = document.querySelector('.aside-image-container');
  const imageProductShow = document.querySelector('.image-product-show img');

  const handleImageClick = (event) => {
    // Verificar si el elemento clicado es una imagen
    if (event.target.tagName === 'IMG') {
      // Remover la clase 'active' de todas las imágenes
      const images = asideImageContainer.querySelectorAll('img');
      images.forEach((img) => img.classList.remove('active'));

      // Agregar la clase 'active' a la imagen clicada
      event.target.classList.add('active');

      // Cambiar la imagen principal en el contenedor "image-product-show"
      const newImageSrc = event.target.src;
      imageProductShow.src = newImageSrc;
      imageProductShow.alt = event.target.alt;
    }
  };

  asideImageContainer.addEventListener('click', handleImageClick);
}
