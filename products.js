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

const productsFromLocalStorage = getProductsFromLocalStorage().data.
 products;
// console.log(productsFromLocalStorage
//  , "productsFromLocalStorage");

const categories = new Set(productsFromLocalStorage.map(producto => producto.category));
const allCategoriesProducts = [...categories];
//map crea un nuevo array extrayendo solo las categorías de cada objeto del array original
//Set elimina los duplicados, asegurando que solo tengamos categorías únicas
//Convertimos el Set a un array usando el operador de propagación spread (...) para obtener un array con las categorías únicas
// console.log(allCategoriesProducts, "allCategoriesProducts");

const depurRating = productsFromLocalStorage.sort((a, b) => b.rating - a.rating);
const top6Rating = depurRating.slice(0, 6);
// sort es un método para ordenar
// (a, b) => b.rating - a.rating ordena de manera descendente, si el resultado de la resta es positivo + B va antes que A (descendete), si el resultado es negativo - A va antes que B (orden ascendente), si el resultado es cero los elementos mantienen su orden relativo
// slice(0, 6) crea un nuevo array con los primeros 6 elementos
// console.log(top6Rating, "top6Rating");

const depurdiscount = productsFromLocalStorage.sort((a, b) => b.discountPercentage - a.discountPercentage);
const top6DiscountPercentage = depurdiscount.slice(0, 6);
// sort es un método para ordenar
// (a, b) => b.rating - a.rating ordena de manera descendente, si el resultado de la resta es positivo + B va antes que A (descendete), si el resultado es negativo - A va antes que B (orden ascendente), si el resultado es cero los elementos mantienen su orden relativo
// slice(0, 6) crea un nuevo array con los primeros 6 elementos
console.log(top6DiscountPercentage, "top6DiscountPercentage");


