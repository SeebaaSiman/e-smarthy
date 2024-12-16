function extraerNombreUsuario(email) {
 const partes = email.split('@');
 return partes[0] + '@';
}
const initializeLogin = () => {
 const loginContainer = document.getElementById("login-container");
 const registerBtn = document.getElementById("btn-toggle-register");
 const loginBtn = document.getElementById("btn-toggle-login");
 const btnSignIn = document.getElementById("btn-signIn");
 const inputLoginEmail = document.getElementById("login-email");
 const inputLoginPassword = document.getElementById("login-password");
 const createPassword = document.getElementById("create-password");
 const createEmail = document.getElementById("create-email");
 const createName = document.getElementById("create-name");
 const btnSignUp = document.getElementById("btn-signUp");

 if (!loginContainer || !registerBtn || !loginBtn || !btnSignIn || !inputLoginEmail || !inputLoginPassword || !createPassword || !createEmail || !createName) return;
 updateLanguageDisplay();
 registerBtn.addEventListener("click", () => {
  loginContainer.classList.add("active");
 });
 loginBtn.addEventListener("click", () => {
  loginContainer.classList.remove("active");
 });

 btnSignIn.addEventListener("click", (e) => {
  if (inputLoginEmail.checkValidity() && inputLoginPassword.checkValidity()) {
   e.preventDefault();
   let mail = extraerNombreUsuario(inputLoginEmail.value);
   localStorage.setItem("user", JSON.stringify(mail));
   showToast({ message: `Bienvenido ${mail}`, type: 'success' });
   setTimeout(() => {
    window.location.href = "#/";
    loginCheck();
   }, 4800);
  }
 });

 btnSignUp.addEventListener("click", (e) => {
  if (createPassword.checkValidity() && createEmail.checkValidity() && createName.checkVisibility()) {
   e.preventDefault();
   localStorage.setItem("user", JSON.stringify(createName.value));
   showToast({ message: `Bienvenido ${createName.value}`, type: 'success' });
   setTimeout(() => {
    window.location.href = "#/";
    loginCheck();
   }, 4800);
  }
 });
};
