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


