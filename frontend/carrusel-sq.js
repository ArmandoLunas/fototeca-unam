// Carrusel de imágenes para la página "¿Sabías qué?"
let currentIndexSQ = 0;
const imagesSQ = document.querySelectorAll('.carousel-item');
const dotsSQ = document.querySelectorAll('.dot');

// Mostrar el slide actual
function showSlideSQ(index){
    imagesSQ.forEach((img, i) =>{
        img.style.display = i === index ? 'block' : 'none';
    });
    dotsSQ.forEach((dot, i) =>{
        dot.classList.toggle('active', i === index);
    });
    
    // Actualizar dato curioso
    const currentImage = imagesSQ[index];
    const curiousFact = currentImage.getAttribute('data-curious');
    const curiousFactElement = document.getElementById('curious-fact');
    if(curiousFactElement && curiousFact){
        curiousFactElement.textContent = curiousFact;
    }
    
    currentIndexSQ = index;
}

// Funciones para las flechas de navegación
function nextSlide(){
    let nextIndex = (currentIndexSQ + 1) % imagesSQ.length;
    showSlideSQ(nextIndex);
}

function previousSlide(){
    let prevIndex = (currentIndexSQ - 1 + imagesSQ.length) % imagesSQ.length;
    showSlideSQ(prevIndex);
}

// Función para navegar a un slide específico (llamada desde los dots)
function currentSlide(index){
    showSlideSQ(index - 1);
}

// Cambiar imagen automáticamente
function changeImageSQ(){
    nextSlide();
}

// Inicializar carrusel cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function(){
    // Solo ejecutar si estamos en la página de sabías qué (verificar si existe el elemento curious-fact)
    if(document.getElementById('curious-fact')){
        showSlideSQ(0);
        setInterval(changeImageSQ, 5000);
    }
});

// Ampliar imagen en el modal (específico para esta página)
function expandImage(element){
    const modal = document.getElementById('image-modal');
    const expandedImage = document.getElementById('expanded-img');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description p');
    const seeMoreLink = document.getElementById('see-more-link');

    // Si es imagen directa (carrusel), usarla; si es contenedor (galería), buscar el <img>
    let img = element.tagName === 'IMG' ? element : element.querySelector('img');

    const src = img.src;
    const title = img.getAttribute('data-title') || img.alt || 'Sin título';
    const desc = img.getAttribute('data-description') || 'Sin descripción';

    expandedImage.src = src;
    modalTitle.textContent = title;
    modalDescription.textContent = desc;

    seeMoreLink.href = `pag-dest.html?src=${encodeURIComponent(src)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(desc)}`;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar el modal
function closeModal(){
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Cerrar el modal al hacer click fuera de la imagen
window.onclick = function(event){
    const modal = document.getElementById('image-modal');
    if(event.target === modal){
        closeModal();
    }
};

// Cerrar con ESC
window.addEventListener('keydown', function(e){
    if(e.key === "Escape"){
        closeModal();
    }
});