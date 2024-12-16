
const mainRouter = document.getElementById("main-router");
const header = document.getElementById("header");
const footer = document.getElementById("footer");

const errorPage = () => "/views/error.html";
const homePage = () => "/views/navbar/home.html";
const usPage = () => "/views/navbar/us.html";
const cartPage = () => "/views/navbar/cart.html";
const loginPage = () => "/views/navbar/login.html";
const productsPage = () => "/views/navbar/product.html";
const productDetailPage = () => "/views/navbar/product.html";
const privacyPage = () => "/views/footer/terms/privacy-and-cookie-policy.html"
const termsPage = () => "/views/footer/terms/terms-and-conditions.html"
const withdrawalPage = () => "/views/footer/terms/withdrawal.html"
const FAQPage = () => "/views/footer/support/FAQ.html"
const shippingPage = () => "/views/footer/support/shipping.html"
const trackingPage = () => "/views/footer/support/tracking.html"
const warrantyPage = () => "/views/footer/support/warranty.html"
const contactPage = () => "/views/footer/explore/contact.html"
const giftCardPage = () => "/views/footer/explore/gift-card.html"
const teamPage = () => "/views/footer/explore/team.html"

//path route
const routes = {
 "error": errorPage,
 //navbar
 "/": homePage,
 "/us": usPage,
 "/cart": cartPage,
 "/login": loginPage,
 "/products": productsPage,
 "/products/product-detail": productDetailPage,
 //footer/terms
 "/privacy-and-cookies-policy": privacyPage,
 "/terms-and-conditions": termsPage,
 "/withdrawal": withdrawalPage,
 //footer/support
 "/FAQ": FAQPage,
 "/shipping": shippingPage,
 "/tracking": trackingPage,
 "/warranty": warrantyPage,
 //footer/explore
 "/contact": contactPage,
 "/gift-card": giftCardPage,
 "/team": teamPage,
};

const routesCSS = {
 '/': 'banner-and-logos-style.css',
 "/cart": "cart-style.css",
 "/login": "login-style.css",
 "/products": "product-style.css",
 "/products/product-detail": "product-detail-style.css",
 "/us": "us-style.css",
 "/team": "us-style.css",
 "/error": "page-error-style.css",
 "/contact": "form-style.css",
 "/warranty": "form-style.css",
 "/tracking": "form-style.css",
 "/shipping": "shipping-style.css",
 "/gift-card": "gift-card-style.css",
};

const loadCSS = (path) => {
 const cssFile = routesCSS[path];

 const existingLink = document.getElementById('dynamic-css');

 // Eliminar el CSS actual solo si existe
 if (existingLink) existingLink.remove();

 // Cargar el nuevo CSS solo si hay uno especificado
 if (cssFile) {
  const link = document.createElement('link');
  link.id = 'dynamic-css';
  link.rel = 'stylesheet';
  link.href = `/style/${cssFile}`;
  document.head.appendChild(link);
 }
};
const handleHashLocation = async () => {
 const path = window.location.hash.replace("#", "") || "/";
 const isProductDetail = path.startsWith("/products/product-detail-");
 const dynamicSegment = isProductDetail ? path.split("/product-detail-")[1] : null;
 const basePath = isProductDetail ? "/products/product-detail" : path;

 // Verificar si la ruta base existe en `routes`
 const routeHandler = routes[basePath];
 window.scrollTo({ top: 0, behavior: "smooth" });

 if (!routeHandler) {
  // Mostrar página de error si la ruta no existe
  try {
   const errorResponse = await fetch(routes["error"]());
   const errorHtml = await errorResponse.text();
   mainRouter.innerHTML = errorHtml;
   loadCSS("/error");
   header.style.display = "none";
   footer.style.display = "none";
   showToast({ message: "Página no encontrada, vuelve a inicio para seguir en E-Smarthy", type: 'error' });

  } catch (error) {
   console.error("Error al cargar la página de error:", error);
  }
  return;
 }

 try {
  let html;

  if (isProductDetail) {
   // Cargar página de detalle de producto si es una ruta dinámica
   html = await fetch("/views/navbar/product-detail.html").then(response => {
    if (!response.ok) {

     throw new Error("Error al cargar la página de detalle de producto");
    }
    return response.text();
   });
  } else {
   // Cargar otras páginas normales
   html = await fetch(routeHandler()).then(response => {
    if (!response.ok) {
     throw new Error("Error al cargar la página");
    }
    return response.text();
   });
  }

  // Insertar el HTML en el <main id="main-router"></main>
  mainRouter.classList.add("hidden");
  mainRouter.innerHTML = html;
  setTimeout(() => {
   mainRouter.classList.remove("hidden");
  }, 600); // Tiempo para la animación

  // Cargar dinámicamente CSS según la ruta
  loadCSS(isProductDetail ? "/products/product-detail" : path);

  // Configurar visibilidad de header y footer
  const hideHeaderFooter = path === "/cart" || path === "/login";
  header.style.display = hideHeaderFooter ? "none" : "block";
  footer.style.display = hideHeaderFooter ? "none" : "block";

  // Inicializar contenido dinámico
  if (isProductDetail && initializeHomePage && initializeProductDetailPage && initializeSliderProductDetail && initializeCartPage && initializeProductsPage && updateLanguageDisplay && initializeWarrantyUploadFile && initializePayments && initializeLogin) {
   initializeProductDetailPage(dynamicSegment); // Inicializar con el ID del producto
   initializeSliderProductDetail();
  } else if (path === "/") {
   updateLanguageDisplay();
   initializeHomePage();
  } else if (path === "/products") {
   initializeProductsPage();
  } else if (path === "/login") {
   updateLanguageDisplay();
   initializeLogin();
  } else if (path === "/cart") {
   initializeCartPage();
   initializeUserInfo();
   initializePayments();
   initializeScrollHorizontal();
  } else if (path === "/warranty") {
   initializeWarrantyUploadFile();
   updateLanguageDisplay();

  } else {
   updateLanguageDisplay();
  }
 } catch (error) {
  // Manejo de errores
  try {
   const errorResponse = await fetch(routes["error"]());
   const errorHtml = await errorResponse.text();
   mainRouter.innerHTML = errorHtml;
   loadCSS("/error");
   header.style.display = "none";
   footer.style.display = "none";

  } catch (error) {
   console.error("Error al cargar la página de error:", error);
  }
  console.error("Error al cargar la página:", error);
 }
};


window.addEventListener("hashchange", handleHashLocation);
handleHashLocation(); // Inicializar la carga en la primera visita