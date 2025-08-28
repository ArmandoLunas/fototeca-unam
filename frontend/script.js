// Carrusel de imágenes
let currentIndex = 0;
const images = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');

// Mostrar el slide actual
function showSlide(index) {
    images.forEach((img, i) => {
        img.style.display = i === index ? 'block' : 'none';
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
}

// Cambiar imagen automáticamente
function changeImage() {
    let nextIndex = (currentIndex + 1) % images.length;
    showSlide(nextIndex);
}

// Evento para los dots
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
});

// Inicializar carrusel
showSlide(0);
setInterval(changeImage, 5000);

// Ampliar imagen en el modal
function expandImage(element) {
    const modal = document.getElementById('image-modal');
    const expandedImage = document.getElementById('expanded-img');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description p');

    // Si es imagen directa (carrusel), usarla; si es contenedor (galería), buscar el <img>
    let img = element.tagName === 'IMG' ? element : element.querySelector('img');

    expandedImage.src = img.src;
    modalTitle.textContent = img.getAttribute('data-title') || img.alt || 'Sin título';
    modalDescription.textContent = img.getAttribute('data-description') || 'Sin descripción';

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar el modal
function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Cerrar el modal al hacer click fuera de la imagen
window.onclick = function(event) {
    const modal = document.getElementById('image-modal');
    if (event.target === modal) {
        closeModal();
    }
};

// Cerrar con ESC
window.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
        closeModal();
    }
});