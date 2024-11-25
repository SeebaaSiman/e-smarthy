function time() {
 let date = new Date();
 let h = date.getHours();
 let m = date.getMinutes();
 let s = date.getSeconds();
 let text = "hs.";

 // Formatear para que siempre tengan dos dígitos
 h = (h < 10) ? "0" + h : h;
 m = (m < 10) ? "0" + m : m;
 s = (s < 10) ? "0" + s : s;

 var digitaltime = h + ":" + m + ":" + s + " " + text;
 document.getElementById("my-clock").innerHTML = digitaltime;
}

// Llamar a la función cada segundo
setInterval(time, 1000);





