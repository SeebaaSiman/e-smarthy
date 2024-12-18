# E-Smarthy

Es un e-commerce como trabajo final para el curso Talento Tech 2.024, comisión 24225, profesores Nicolás Fernandez y Paz Aliaga.

E-Smarthy funciona como ejemplo de un emprendimiento que engloba varios productos de diversas marcas que se encarga de la distribución y garantía de diversos productos a lo largo y ancho del mundo.

Le guardo un cariño especial a este e-commerce ya que fue mi primer proyecto con Javascript puro, siempre utilizaba frameworks. Fue un viaje muy lindo porque me sirvió para entender algunas "magias" que hacía React y para entender mejor Javascript. La idea inicial fue aprovar la cursada y a la vez dejar algo funcional un futuro. Espero que les guste

## Tech Stack

**Client / front:**

- html
- css
- javascript vanilla

**Server / back:** -----

## Funcionamiento de la página

- **Navegación SPA** La aplicación utiliza un enfoque de página única (SPA) para una experiencia de usuario más fluida. El contenido dinámico dentro de la etiqueta <main> se genera a partir de las rutas definidas en router.js. Al cambiar el hash (#) en la URL, el enrutador detecta este cambio y actualiza el contenido de <main> en consecuencia, mostrando la vista correspondiente sin realizar una recarga completa de la página.También se carga de manera dinámica las hojas de estilos css según el path.
- **Efecto y animación del contenido dentro del <main> al navegar**
- **Banner dinámico automático según rating y descuento del mes**
- **Contador de clicks en la página** Se almacenan en el local storage todos los clicks que se efectuaron en la página con la opción de setear a cero nuevamente.
- **Reloj en tiempo real**
- **Login / logout** El usuario puede logearse, se guarda su información en localStorage. Al estar logeado aparecerá su nombre en el navbar. Podrá deslogearse desde el navbar.
- **Cambio del título de la pestaña del navegador cuando el usuario deja de interactuar con la página** aprovechando los eventos blur y focus de la ventana.
- **Lenguaje inglés - español** gracias al uso de las className manejados por language.js que oculta el idioma no seleccionado por el usuario. La selección del idioma se guarda en localStorage
- **Adjuntar uno o varios archivos de imágen para solicitud de garantía** permite a los usuarios seleccionar uno o varios archivos de imagen haciendo clic en el botón "Seleccionar archivos" o arrastrando y soltándolos (drag and drop) en el área designada. Se establece un límite de tamaño máximo para los archivos (25MB en este caso) para evitar sobrecargar el servidor. Los archivos seleccionados se muestran en una lista con su nombre y tamaño, lo que permite al usuario verificar su selección antes de enviar la solicitud.
- **Creación de mensajes emergentes breves para brindar información al usuario** cada mensaje tiene su icono, color y tipo. Pueden ser de información, warning, éxito (success) o error.
- **Los productos de la API son almacenados en el localStorage** Al actualizarse la página consulta si hay productos en el localstorage sino hace una petición fetch(). Luego se usarán para renderizar los productos, filtrarlos, ver cuáles son los que tienen mayor descuento y rating, etc.
- **Navbar y footer responsive**
- **Filtros para los productos por categoría, rating, precios máximo y mínimo y stock**
- **Carrito y uso:** El carrito en navbar visualiza el total de tipos de productos. En el path="/cart" se ven el total de productos, total subtotal y costo de envío (superados los 5.000 es gratis). Los productos en el carrito se pueden eliminar, agregar y vaciar. No se pueden agregar más productos del stock que se disponga. Si hay productos en el carrito aparece el <button>Comprar</button>
- **Gift-cards** Cada giftcard tiene su id para que aparezca en el carrito de compra de manera individual.
- **Formularios de compra** Al estar lleno el carrito se puede comprar, primero un formulario con los datos del usuario luego los datos de la tarjeta. Debe elegir la tarjeta (visa, master o amex) y llenar con los datos de la tarjeta. Visualmente se va llenando la tarjeta a medida que el usuario completa el formulario. También aparecen las formas de pago digitales como paypal, google pay y applepay que no fueron implementadas. En un futuro al hacer click redireccionan a una página externa para utilizar esas apps de pago.
- **Al terminar la compra en _console_ sale la orden** La orden dispone de la info del usuario (como mail, nombre, dirección y teléfono), array de productos, un número de ticket generado de panera random, la fecha de la compra y el total abonado.
- **Search bar del Navbar funcional** Si no se encuentra en el path ="products" al escribir redireccionará allí (/products), estando en "/products" se puede buscar y filtrar por título en tiempo real. Aparecen sugerencias por 1,5 segundos para mejora de experiencia de navegación.

## Estructura del Proyecto

Esquema básico de la estructura del proyecto

```bash
├── assets
│   └── cards
│        └── amex.png
│        └── apple-pay.png
│        └── google-pay.png
│   └── flag-language
│        └── eeuu.png
│        └── spain.png
├── components
│   ├── banner-swipe.js
│   ├── language.js
│   ├── navbar.js
│   └── toast.js
├── services
│   └── api
│        └── products.js
│   └── router
│        └── index.js
├── styles
│   └── font
│        └── GT-Walsheim-Pro-Bold.ttf
│        └── GT-Walsheim-Pro-Ultra-Light.ttf
│   └── cart-style.css
│   └── footer-style.css
│   └── global-style.css
├── views
│   ├── cart.html
│   ├── products.html
│   ├── contact.html
│   └── error.html
├── index.html
└── README.md

```

## Herramientas externas

- **API:** [dummy JSON](https://dummyjson.com/)
- **Iconos:** [ionic](https://ionic.io/ionicons)

## Colores del proyecto

| Color       | Hex                                                         |
| ----------- | ----------------------------------------------------------- |
| Body bg     | ![#e6e4e2](https://fakeimg.pl/10x10/e6e4e2/e6e4e2) #e6e4e2  |
| Card bg     | ![#e2dfdd](https://fakeimg.pl/10x10/e2dfdd/e2dfdd) #e2dfdd  |
| Navbar bg   | ![#ffffff](https://fakeimg.pl/10x10/ffffff/ffffff) #ffffff |
| Text shadow | ![#4a5c6a](https://fakeimg.pl/10x10/4a5c6a/4a5c6a) #4a5c6a  |
| Black       | ![#040404](https://fakeimg.pl/10x10/040404/040404) #040404  |
