
document.addEventListener("DOMContentLoaded", function () {
 // Selecciona el botón para cambiar el idioma
 const navLanguage = document.querySelector('.nav-language');
 const navLanguageMenu = document.querySelector(".nav-language-menu");
 let isEnglish = localStorage.getItem('isEnglish') === 'true'; // Obtener el estado del idioma del localStorage (por defecto español)

 const updateLanguageDisplay = () => {
  const languageElementsEnglish = document.querySelectorAll('.language.english'); // Selecciona los elementos en inglés
  const languageElementsSpanish = document.querySelectorAll('.language.spanish'); // Selecciona los elementos en español
 
  if (isEnglish) {
   // Si el idioma es inglés, mostrar el contenido en inglés y ocultar el español
   languageElementsEnglish.forEach(element => {
    element.style.display = 'block'; // Mostrar elementos en inglés
   });
   languageElementsSpanish.forEach(element => {
    element.style.display = 'none'; // Ocultar elementos en español
   });
  } else {
   // Si el idioma es español, mostrar el contenido en español y ocultar el inglés
   languageElementsEnglish.forEach(element => {
    element.style.display = 'none'; // Ocultar elementos en inglés
   });
   languageElementsSpanish.forEach(element => {
    element.style.display = 'block'; // Mostrar elementos en español
   });
  }
 };

 // Al hacer clic en el botón de cambio de idioma
 navLanguage.addEventListener('click', function () {
  isEnglish = !isEnglish; // Alternar el estado del idioma
  localStorage.setItem('isEnglish', isEnglish); // Guardar el estado en localStorage
  updateLanguageDisplay(); // Actualizar la visibilidad de los elementos
 });
 navLanguageMenu.addEventListener('click', function () {
  isEnglish = !isEnglish; // Alternar el estado del idioma
  localStorage.setItem('isEnglish', isEnglish); // Guardar el estado en localStorage
  updateLanguageDisplay(); // Actualizar la visibilidad de los elementos
 });


 // Actualizar la visibilidad cuando se carga la página
 updateLanguageDisplay();
});

//* Forma de uso  class="language english" | "language spanish"