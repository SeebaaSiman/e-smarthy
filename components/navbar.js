const navIconHamburguer = document.getElementById('nav-icon-hamburguer');
const mainNav = document.getElementById('nav-links-container');

const btnScrollTop = document.getElementById("btn-scrollTop");

let scrollValue = 0;

const handleScroll = () => {
 scrollValue = window.scrollY;
 if (scrollValue > 150) {
  btnScrollTop.classList.add("active")
 } else {
  btnScrollTop.classList.remove("active")
 }
};

function onCloseMenu() {
 if (window.innerWidth < 992) {
  navIconHamburguer.classList.remove('open');
  mainNav.classList.remove('open');
 }
};

document.addEventListener("DOMContentLoaded", function () {
 navIconHamburguer.addEventListener('click', function () {
  navIconHamburguer.classList.toggle('open');
  mainNav.classList.toggle('open');
 });
 btnScrollTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
 });
 window.addEventListener('scroll', handleScroll);
});
const loginIcon = {
 login: '<ion-icon name="person-circle-outline"></ion-icon>',
 logout: '<ion-icon name="log-out-outline"></ion-icon>'
}
const loginTagP = document.querySelectorAll(".login-text");
const loginIconContainer = document.querySelectorAll(".nav-login-icon");

const loginCheck = () => {
 let user = JSON.parse(localStorage.getItem("user"));
 console.log(user, "user name");
 console.log(loginTagP, "login tag p");
 console.log(loginIconContainer, "loginIconContainer ");
 if (loginTagP && loginIconContainer) {
  if (user) {
   loginTagP.forEach((p) => {
    p.textContent = user;
   });
   loginIconContainer.forEach((wrapper) => {
    wrapper.innerHTML = loginIcon.logout;
    wrapper.addEventListener("click", () => {
     localStorage.removeItem("user");
     loginCheck()
    })
   });
  } else {
   loginTagP.forEach((p) => {
    if (p.classList.contains('english')) {
     p.textContent = "Login";
    } else if (p.classList.contains('spanish')) {
     p.textContent = "Iniciar sesión";
    }
    p.onclick = onCloseMenu; // Asigna el manejador de eventos directamente
   });
   loginIconContainer.forEach((wrapper) => {
    wrapper.innerHTML = loginIcon.login;
    wrapper.addEventListener("click", () => {
     window.location.href = "#/login";
    })
   });
  }
 }
}

document.addEventListener("DOMContentLoaded", loginCheck());
