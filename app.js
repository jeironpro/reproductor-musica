const canciones = [     
    {titulo: "Gabito Ballesteros - A Puro Dolor", src: "canciones/APuroDolor.mp3"},
    {titulo: "Gabito Ballesteros - Chiquitita", src: "canciones/Chiquitita.mp3"},
    {titulo: "Fuerza Regida - Disculpe Usted", src: "canciones/DisculpeUsted.mp3"},
    {titulo: "Fuerza Regida - Los Sufrimientos", src: "canciones/LosSufrimientos.mp3"},
    {titulo: "Natanael Cano - Mi Bello Angel", src: "canciones/MiBelloAngel.mp3"},
    {titulo: "Fuerza Regida - Navidad Sin Ti", src: "canciones/NavidadSinTi.mp3"},
    {titulo: "Fuerza Regida - No Me Dejes Nunca", src: "canciones/NoMeDejesNunca.mp3"},
    {titulo: "Fuerza Regida - No Volvere", src: "canciones/NoVolvere.mp3"},
    {titulo: "Natanael Cano - O Me Voy O Te Vas", src: "canciones/OMeVoyOTeVas.mp3"},
    {titulo: "Gabito Ballesteros - Que Lloro", src: "canciones/QueLloro.mp3"},
    {titulo: "Fuerza Regida - Que Tal Se Siente", src: "canciones/QueTalSeSiente.mp3"},
    {titulo: "Fuerza Regida - Quien Es Usted", src: "canciones/QuienEsUsted.mp3"},
    {titulo: "Gabito Ballesteros - Te He Prometido", src: "canciones/TeHePrometido.mp3"},
    {titulo: "Fuerza Regida - Te Hubieras Ido Antes", src: "canciones/TeHubierasIdoAntes.mp3"},
    {titulo: "Fuerza Regida - Te Voy A Olvidar", src: "canciones/TeVoyAOlvidar.mp3"},
    {titulo: "Fuerza Regida - Tu Ventana", src: "canciones/TuVentana.mp3"},
    {titulo: "Fuerza Regida - Un Idiota", src: "canciones/UnIdiota.mp3"},
    {titulo: "Fuerza Regida - Vete Ya", src: "canciones/VeteYa.mp3"},
]; 

let audioPlayer = new Audio(); 
let cancionActual = 0; 

function cargarCancion() {     
    audioPlayer.src = canciones[cancionActual].src;     
    document.getElementById("titulo-cancion").innerText = canciones[cancionActual].titulo; 
} 

var contenedorReproductor = document.getElementById("contenedor-reproductor");
var contenedorLetra = document.getElementById("letra-cancion");
var contenedorListado = document.getElementById("listado-canciones");

function obtenerLetra(artista, titulo) {
    var url = "https://api.lyrics.ovh/v1/" + encodeURIComponent(artista) + "/" + encodeURIComponent(titulo);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.lyrics) {
                var letraLimpia = limpiarLetra(data.lyrics);
                contenedorLetra.innerHTML = "<pre class='letra-cancion'>" + letraLimpia + "</pre>";
            } else {
                contenedorLetra.innerHTML = "<pre class='letra-cancion'>Letra no encontrada</pre>";
            }
        })
        .catch(error => {
            console.log("Error al obtener la letra:", error);
            contenedorLetra.innerHTML = "<pre class='letra-cancion'>Error al obtener la letra de la cancion</pre>";
        })
}

var iconoLetra = document.querySelector(".icono-letra");
var reproductor = document.getElementById("reproductor");
var iconoVolver = document.querySelector(".volver");

iconoLetra.addEventListener('click', function() {
    var artirtaTitulo = canciones[cancionActual].titulo.split(" - ");
    var artista = artirtaTitulo[0];
    var titulo = artirtaTitulo[1];
    obtenerLetra(artista, titulo);
    reproductor.style.display = 'none';
    iconoVolver.style.display = 'block';
    contenedorReproductor.style.overflowY = 'scroll';
    contenedorLetra.style.display = 'block';
});

iconoVolver.addEventListener('click', function() {
    reproductor.style.display = 'block';
    contenedorLetra.style.display = 'none';
    iconoVolver.style.display = 'none';
    contenedorReproductor.style.overflowY = 'hidden';
    contenedorListado.style.display = 'none';
});

var iconoListado = document.querySelector(".icono-listado");

iconoListado.addEventListener('click', function() {
    reproductor.style.display = 'none';
    iconoVolver.style.display = 'block';
    contenedorReproductor.style.overflowY = 'auto';
    contenedorListado.style.display = 'block';

    var listadoCanciones = "<ul class='listado_canciones'>";
    canciones.forEach(function(cancion, index) {
        listadoCanciones += "<li onclick='seleccionarCancion(" + index + ")'>" + cancion.titulo + "</li>";
    });
    listadoCanciones += "</ul>";

    contenedorListado.innerHTML = listadoCanciones;
});

function seleccionarCancion(index) {
    cancionActual = index;
    cargarCancion();
    reproducirCancion();
    contenedorListado.style.display = 'none';
    reproductor.style.display = 'block';
    iconoVolver.style.display = 'none';
    contenedorReproductor.style.overflowY = 'hidden';
    contenedorLetra.style.display = 'none';
}

function limpiarLetra(letra) {
    const parteEliminar = letra.indexOf('par');
    if (parteEliminar !== -1) {
        letra = letra.slice(parteEliminar).trim();
    }
    return letra;
}

function reproducirCancion() {     
    audioPlayer.play(); 
    document.getElementById("imagen-cancion").classList.add("reproduciendo");

    document.getElementById("reproducir").style.display = 'none';
    document.getElementById("pausar").style.display = 'block';
} 

function pausarCancion() {  
    audioPlayer.pause(); 
    document.getElementById("imagen-cancion").classList.remove("reproduciendo");
    document.getElementById("pausar").style.display = 'none';
    document.getElementById("reproducir").style.display = 'block';
} 

function siguienteCancion() {     
    cancionActual = (cancionActual + 1) % canciones.length;     
    cargarCancion();     
    reproducirCancion(); 
} 

function anteriorCancion() {     
    cancionActual = (cancionActual - 1 + canciones.length) % canciones.length;     
    cargarCancion();     
    reproducirCancion(); 
}

document.getElementById("reproducir").addEventListener("click", reproducirCancion);
document.getElementById("pausar").addEventListener("click", pausarCancion); 
document.getElementById("siguiente").addEventListener("click", siguienteCancion); 
document.getElementById("anterior").addEventListener("click", anteriorCancion); 

document.getElementById("progreso").addEventListener("input", function() {     
    audioPlayer.currentTime = (this.value * audioPlayer.duration) / 100; 
}); 

var progreso = document.getElementById("progreso");

audioPlayer.addEventListener("timeupdate", function() {  
    var porcentaje = (audioPlayer.currentTime / audioPlayer.duration) * 100;

    progreso.style.background = "linear-gradient(to right, #fe8d94 " + porcentaje + "%, #ffffff " + porcentaje + "%, #ffffff " + porcentaje + "%)";
    progreso.value = porcentaje;

    if (audioPlayer.currentTime === audioPlayer.duration) {
        siguienteCancion();
    }
}); 

cargarCancion();