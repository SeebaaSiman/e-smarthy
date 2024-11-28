document.addEventListener("DOMContentLoaded", function () {
 // Configuración inicial de idioma
 const navLanguage = document.querySelector('.nav-language');
 const navLanguageMenu = document.querySelector(".nav-language-menu");
 
 let isEnglish = localStorage.getItem('isEnglish') === 'true';
 let languageOption = isEnglish ? "en-EN" : "es-ES";

 const updateLanguageDisplay = () => {
  const languageElementsEnglish = document.querySelectorAll('.language.english');
  const languageElementsSpanish = document.querySelectorAll('.language.spanish');

  if (isEnglish) {
   languageElementsEnglish.forEach(element => element.style.display = 'block');
   languageElementsSpanish.forEach(element => element.style.display = 'none');
   languageOption = "en-EN";
  } else {
   languageElementsEnglish.forEach(element => element.style.display = 'none');
   languageElementsSpanish.forEach(element => element.style.display = 'block');
   languageOption = "es-ES";
  }
 };

 // Manejadores para cambiar idioma
 const toggleLanguage = () => {
  isEnglish = !isEnglish;
  localStorage.setItem('isEnglish', isEnglish);
  updateLanguageDisplay();
  updateCurrentDay(); // Actualiza el día de la semana al cambiar idioma
 };

 navLanguage?.addEventListener('click', toggleLanguage);
 navLanguageMenu?.addEventListener('click', toggleLanguage);

 // Función para actualizar el día actual
 const updateCurrentDay = () => {
  const today = new Date();
  const optionsDay = { weekday: 'long' };
  const day = today.toLocaleDateString(languageOption, optionsDay);

  const currentDayElements = document.getElementsByClassName('current-day');
  Array.from(currentDayElements).forEach(element => {
   element.textContent = day;
  });
 };

 // Asignar el año actual
 const currentYear = new Date().getFullYear();
 document.getElementById("current-year").textContent = currentYear;

 // Configuración inicial
 updateLanguageDisplay();
 updateCurrentDay();
});
