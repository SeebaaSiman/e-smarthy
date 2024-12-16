class BannerSwipe {
  constructor(containerSelector, data, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.data = data;
    this.currentSlide = 0;
    this.slideWidth = this.container.offsetWidth;
    this.autoPlayInterval = null;

    this.options = {
      autoPlay: true,
      autoPlayInterval: 2500,
      ...options,
    };

    this.generateBannerSwipe();
    this.createIndicators();
    this.startAutoPlay();
  }
  generateBannerSwipe() {
    const slidesHTML = this.data.map(slideData => {
      let additionalContent = '';
      // Agrega contenido adicional basado en containerSelector
      if (this.container.id === "top-descount") {
        additionalContent = `
      <div class="banner-discountPercentage">
        <ion-icon name="caret-down-outline"></ion-icon>
        - ${slideData.discountPercentage} % off
      </div>
      `;
      } else if (this.container.id === "top-rating") {
        // Generar dinámicamente las estrellas
        const stars = Array.from({ length: slideData.rating }, () =>
          `<ion-icon name="star-outline"></ion-icon>`
        ).join('');

        additionalContent = `
      <div class="banner-rating">
        ${stars}
        (${slideData.rating})
      </div>
    `;
      }
      return `
      <div class="banner-slide" style="background-image: url('${slideData.thumbnail}');">
        <div class="banner-overlay">
          <div class="banner-overlay-left">
            <p class="banner-titulo">${slideData.title}</p>
            <p class="banner-description">${slideData.description}</p>
            <span class="banner-category">
              <p>Category:</p>
              <span>${slideData.category}</span>
            </span>
          </div>
          <div class="banner-overlay-right">
             ${additionalContent}
            <p class="banner-price"> &#8364;${slideData.price}</p>
            <a href="#/products/product-detail-${slideData.id}"class="btn-division">Ver <ion-icon name="eye-outline" class="icon-eye"></ion-icon></ion-icon></a>
          </div>
        </div>
      </div>
    `;
    }).join('');

    this.container.innerHTML = slidesHTML;
  }

  createIndicators() {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.classList.add('indicators');
    this.data.forEach(() => {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      indicatorsContainer.appendChild(indicator);
    });

    const indicators = indicatorsContainer.querySelectorAll('.indicator');
     indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {

        this.goToSlide(index);
      });
    });
    this.container.parentNode.appendChild(indicatorsContainer);
    this.updateIndicators();
  }
  updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
  }
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.options.autoPlayInterval);
  }
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.data.length;
    this.container.style.transform = `translateX(-${this.currentSlide * this.slideWidth}px)`;
    this.updateIndicators();
  }
  goToSlide(index) {
    this.currentSlide = index;
    this.container.style.transform = `translateX(-${this.currentSlide * this.slideWidth}px)`;
    this.updateIndicators();
  }
};

const navigateToProductsAndFilter = async (category) => {

  window.location.href = "#/products";

  // Esperar a que el contenedor de productos exista
  const cardProducts = await waitForElement('#card-products-list');

  // Aplicar el filtro
  filters.category = category;
  const inputCategory = document.querySelector("[list='category']");
  if (inputCategory) {
    inputCategory.value = category;
  }
  updateFilteredProducts();
};

//* Función auxiliar para esperar a que un elemento exista
const waitForElement = async (selector) => {
  //creo una promesa con resolve para resolver la promesa cuando se encuentra el elemento.
  return new Promise(resolve => {
    //si el elemento ya existe en el DOM se resuelve la promesa inmediatamente con el elemento encontrado.
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    //Se crea un observador de mutaciones que permite monitorear cambios en el DOM, como la adición o eliminación de elementos.
    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });
    //El observador se configura para observar todo el cuerpo del documento (document.body) en busca de cambios en la lista de hijos y en todos los subárboles
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
};

const initializeHomePage = () => {
  const banner = document.querySelector('.banner-container');
  const kitchen = document.querySelector('.kitchen');
  const smartphones = document.querySelector('.smartphones');
  const mensShoes = document.querySelector('.mens-shoes');
  const women = document.querySelector('.women');


  if (banner && top6DiscountPercentage && top6Rating) {
    new BannerSwipe('#top-descount', top6DiscountPercentage, {
      autoPlayInterval: 3000
    });
    new BannerSwipe('#top-rating', top6Rating, {
      autoPlayInterval: 3000
    });
  } else {
    console.error("No se creó el banner");
  }
  if (!smartphones || !kitchen || !mensShoes || !women) return;
  kitchen.addEventListener("click", () => {
    navigateToProductsAndFilter("kitchen-accessories");
  });
  smartphones.addEventListener("click", () => {
    navigateToProductsAndFilter("smartphones");
  });
  mensShoes.addEventListener("click", () => {
    navigateToProductsAndFilter("mens-shoes");
  });
  women.addEventListener("click", () => {
    navigateToProductsAndFilter("womens-bags");
  });
};
