// Carrusel de imágenes
let currentIndex = 0;
const images = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');

function changeImage() {
    images.forEach((image, index) => {
        image.style.display = index === currentIndex ? 'block' : 'none';
    });
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
    currentIndex = (currentIndex + 1) % images.length;
}

setInterval(changeImage, 5000); // Cambiar imagen cada 5 segundos
changeImage(); // Inicializar el carrusel

// Ampliar imagen en el modal
function expandImage(imageElement) {
    const modal = document.getElementById('image-modal');
    const expandedImage = document.getElementById('expanded-img');
    const description = document.getElementById('modal-description');
    
    expandedImage.src = imageElement.querySelector('img').src;
    description.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
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
