// --- 1. INVENTARIO Y DATOS BASE ---
const inventario = {
    "ck-box": {
        titulo: "CK UNDERWEAR 1:1 BÁSICO",
        imagenes: ["articulos/ck_boxers.png"],
        tallas: ["M", "L"],
        observaciones: "Tallas reducidas. Pedir 1 más o usar en tu talla queda justo",
        precioBase: 400,
        precioDescuento: 299
    },
    "supreme-socks": {
        titulo: "SUPREME SOCKS 1:1",
        imagenes: ["articulos/supreme_socks_w.png", "articulos/supreme_socks_bl.png", "articulos/supreme_socks_rd.png"],
        tallas: ["UNITALLA"],
        observaciones: "Lavar de preferencia a mano para conservar la tela sin pelusas",
        precioBase: 199,
        precioDescuento: null
    },
    "alo-socks": {
        titulo: "alo YOGA SOCKS 1:1",
        imagenes: ["articulos/alo_socks_w.png", "articulos/alo_socks.png"],
        tallas: ["UNITALLA"],
        observaciones: "Lavar por el reverso",
        precioBase: 169,
        precioDescuento: null
    },
    "supreme-box": {
        titulo: "SUPREME BOXERS 1:1",
        imagenes: ["articulos/supreme_boxers_bl.png", "articulos/supreme_boxers_w.png"],
        tallas: ["M"],
        observaciones: "Vienen amplios a la medida, pedir una talla menos si te gusta usar los boxers entallado",
        precioBase: 499,
        precioDescuento: null
    }
};

// --- 2. ROTACIÓN DEL HERO COLLAGE ---
const fotosCollage = document.querySelectorAll('.hero-collage img');
const rutasFotos = [fotosCollage[0].src, fotosCollage[1].src, fotosCollage[2].src];

setInterval(() => {
    rutasFotos.unshift(rutasFotos.pop());
    fotosCollage.forEach((img, indice) => {
        img.style.opacity = 0; 
        setTimeout(() => {
            img.src = rutasFotos[indice];
            img.style.opacity = 1;
        }, 500); 
    });
}, 5500);

// --- 3. VARIABLES DEL MODAL ---
let imagenesActuales = [];
let indiceImagen = 0;
let tallaActual = ""; // Memoria táctica de la talla elegida

const modal = document.getElementById("ventana-modal");
const imgModal = document.getElementById("imagen-modal");
const tituloModal = document.getElementById("titulo-modal");
const obsModal = document.getElementById("obs-modal");
const precioModal = document.getElementById("contenedor-precio");

// --- 4. FUNCIÓN MAESTRA: ABRIR PRODUCTO ---
function abrirProducto(idProducto) {
    const datos = inventario[idProducto];
    
    // Reseteo de carrusel
    imagenesActuales = datos.imagenes;
    indiceImagen = 0;
    imgModal.src = imagenesActuales[indiceImagen];

    // Inyección de textos básicos
    tituloModal.innerText = datos.titulo;
    obsModal.innerText = datos.observaciones;
    
    // Lógica del precio
    if (datos.precioDescuento !== null) {
        precioModal.innerHTML = `<span style="text-decoration: line-through; color: #888;">$${datos.precioBase}</span> 
                                 <span id="precio-nuevo-modal" style="color: #00ff00; font-weight: bold; font-size: 1.2rem;">$${datos.precioDescuento} MXN</span>`;
    } else {
        precioModal.innerHTML = `<span id="precio-nuevo-modal" style="font-weight: bold; font-size: 1.2rem;">$${datos.precioBase} MXN</span>`;
    }

    // Motor de Escasez y Tallas
    const contenedorTallas = document.getElementById("contenedor-tallas");
    contenedorTallas.innerHTML = ""; 
    
    if (datos.tallas.includes("UNITALLA")) {
        contenedorTallas.innerHTML += `<button class="btn-talla" onclick="seleccionarTalla(this, 'UNITALLA')">UNITALLA</button>`;
    } else {
        const tallasEstandar = ["S", "M", "L"];
        tallasEstandar.forEach(talla => {
            if (datos.tallas.includes(talla)) {
                contenedorTallas.innerHTML += `<button class="btn-talla" onclick="seleccionarTalla(this, '${talla}')">${talla}</button>`;
            } else {
                contenedorTallas.innerHTML += `<button class="btn-talla btn-agotada" disabled>${talla}</button>`;
            }
        });
    }

    tallaActual = ""; 
    modal.classList.add("activo");
}

// --- 5. INTERACTORES DEL CARRUSEL Y TALLAS ---
document.getElementById("flecha-sig").addEventListener("click", () => {
    indiceImagen++;
    if (indiceImagen >= imagenesActuales.length) indiceImagen = 0;
    imgModal.src = imagenesActuales[indiceImagen];
});

document.getElementById("flecha-ant").addEventListener("click", () => {
    indiceImagen--;
    if (indiceImagen < 0) indiceImagen = imagenesActuales.length - 1;
    imgModal.src = imagenesActuales[indiceImagen];
});

function seleccionarTalla(boton, talla) {
    const botones = document.querySelectorAll('.btn-talla');
    botones.forEach(b => b.classList.remove('seleccionada'));
    boton.classList.add('seleccionada');
    tallaActual = talla; 
}

// --- 6. MECÁNICAS DE CIERRE DE VENTANAS ---
document.getElementById("cerrar-modal").addEventListener("click", () => {
    modal.classList.remove("activo");
});

window.addEventListener("click", (evento) => {
    if (evento.target === modal) {
        modal.classList.remove("activo");
    }
});

// --- 7. LUPA (ZOOM) ---
const marcoZoom = document.getElementById("marco-zoom");
if(marcoZoom && imgModal) {
    marcoZoom.addEventListener("mousemove", (evento) => {
        const rect = marcoZoom.getBoundingClientRect();
        const x = ((evento.clientX - rect.left) / rect.width) * 100;
        const y = ((evento.clientY - rect.top) / rect.height) * 100;
        imgModal.style.transformOrigin = `${x}% ${y}%`;
    });

    marcoZoom.addEventListener("mouseenter", () => {
        imgModal.classList.add("zoom-activo");
    });

    marcoZoom.addEventListener("mouseleave", () => {
        imgModal.classList.remove("zoom-activo");
        setTimeout(() => {
            imgModal.style.transformOrigin = "center center";
        }, 200); 
    });
}

// --- 8. FLUJO DE COMPRA Y TUTORIAL ---
function asegurarDrop() {
    if(tallaActual === "") {
        alert("SELECCIONA UNA TALLA ANTES DE CONTINUAR.");
        return;
    }
    document.getElementById("modal-tutorial").classList.add("activo");
}

function ejecutarCompraWhatsApp() {
    const titulo = document.getElementById("titulo-modal").innerText;
    const precio = document.getElementById("precio-nuevo-modal").innerText;
    const numeroWhatsApp = "5951253999"; // INYECTA TU NÚMERO AQUÍ
    
    const mensaje = `¡Qué onda! Quiero asegurar un drop de 1:1.%0A%0A🔥 Pieza: ${titulo}%0A📏 Talla: ${tallaActual}%0A💵 Precio: ${precio}%0A%0A¿Dónde armamos la entrega, en Chapingo o algún punto de Texcoco? Llevo el pago a contraentrega.`;
    
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
    
    cerrarTutorial();
    modal.classList.remove("activo");
}

function cerrarTutorial() {
    document.getElementById("modal-tutorial").classList.remove("activo");
}

// --- 9. MOTOR DE ESCASEZ (RELOJ) ---
const fechaDrop = new Date(2026, 8, 15, 12, 0, 0).getTime();
const motorCronometro = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaDrop - ahora;

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    document.getElementById("dias").innerText = dias.toString().padStart(2, '0');
    document.getElementById("horas").innerText = horas.toString().padStart(2, '0');
    document.getElementById("minutos").innerText = minutos.toString().padStart(2, '0');
    document.getElementById("segundos").innerText = segundos.toString().padStart(2, '0');

    if (distancia < 0) {
        clearInterval(motorCronometro);
        document.getElementById("reloj-digital").innerHTML = "<span style='color:#fff;'>DROP ACTIVO</span>";
    }
}, 1000);