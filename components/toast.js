class Toast {
  constructor(message, type, index) {
    this.message = message;
    this.type = type;
    this.index = index;
    this.toastElement = document.createElement('div');
    this.toastElement.classList.add('toast', `${type}`);
    this.toastElement.id = `toast-${index}`;
    this.toastElement.innerHTML = `
      <div class="toast wrapper">
        <div class="icono">
          ${iconos[type]}
        </div>
          <p class="titulo">${message}</p>
          <div class="barrita"></div>
            </div>
    `;
  }
  hide() {
    this.toastElement.classList.add('cerrando');
  }
}

const contenedorToast = document.getElementById('toast-container');

const toastQueue = [];

// Iconos
const iconos = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
					<path
						d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"
					/>
				</svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
								/>
							</svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
								/>
							</svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
								/>
							</svg>`,
};

const showToast = ({ message, type, autoCierre = true }) => {
  const index = toastQueue.length;
  const toast = new Toast(message, type, index);
  contenedorToast.appendChild(toast.toastElement);
  toastQueue.push(toast);

  if (autoCierre) {
    setTimeout(() => toast.hide(), 5000);
  }

  toast.toastElement.addEventListener('animationend', (e) => {
    if (e.animationName === 'cierre') {
      toast.toastElement.remove();
      toastQueue.shift(); // Eliminar el toast de la cola
    }
  });
};


//* Forma de uso
// const addMessageButton = document.getElementById('addMessage');
// if (addMessageButton) {
//   addMessageButton.addEventListener('click', () => {
//     showToast({ message: 'Bienvenido a E-Smarthy, esperamos que disfrutes tu recorrido', type: 'info' });
//   })
// }


// const initializeLoremPage = () => {
//  const addMessageButton = document.getElementById('addMessage');
//  if (addMessageButton) {
//   addMessageButton.addEventListener('click', () => {
//    showToast({ message: 'Formulario enviado correctamente', type: 'success' });
//    console.log('Botón de mensaje agregado y evento de click funcionando');
//   });
//  } else {
//   console.log("Botón no encontrado en la página");
//  }
// };