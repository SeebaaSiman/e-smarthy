// Obtener o inicializar el contador desde localStorage
let clickCount = parseInt(localStorage.getItem("clickCount")) || 0;

// Actualizar el contador en la página
const updateCounterDisplay = () => {
 document.getElementById("click-counter").textContent = `${clickCount}`;
};

const incrementCounter = () => {
 clickCount++;
 localStorage.setItem("clickCount", clickCount);
 updateCounterDisplay();
};


const resetCounter = (event) => {
 event.stopPropagation(); // Detener la propagación del clic
 clickCount = 0;
 localStorage.removeItem("clickCount");
 updateCounterDisplay();
 showToast({ message: 'Se reinició a cero su historial de clicks en E-Smarthy', type: 'error' });
};


document.body.addEventListener("click", incrementCounter);
document.getElementById("reset-counter").addEventListener("click", resetCounter);

updateCounterDisplay();
