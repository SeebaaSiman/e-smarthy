document.addEventListener("DOMContentLoaded", function () {
 // Saber el nombre del día actual (lunes,martes,miércoles...)
 const today = new Date();
 const optionsDay = { weekday: 'long' };
 const day = today.toLocaleDateString('es-ES', optionsDay);
 // Opciones para obtener el mes en español
 const optionsMonth = { month: 'long' };
 const month = today.toLocaleDateString('es-ES', optionsMonth);

 
 // Asignar el día de la semana
 const currentDay = document.getElementsByClassName('current-day');
 for (let i = 0; i < currentDay.length; i++) {
  currentDay[i].textContent = `${day}`;
 }
 // Asignar el mes en elementos con clase 'current-month'
 const currentMonth = document.getElementsByClassName('current-month');
 for (let i = 0; i < currentMonth.length; i++) {
  currentMonth[i].textContent = `${month}`;
 }
 const currentYear = new Date().getFullYear();
 document.getElementById("current-year").textContent = currentYear;
});

//* <span class="current-day"></span>