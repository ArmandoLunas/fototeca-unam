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
    const seeMoreLink = document.getElementById('see-more-link');

    // Si es imagen directa (carrusel), usarla; si es contenedor (galería), buscar el <img>
    let img = element.tagName === 'IMG' ? element : element.querySelector('img');

    const src = img.src;
    const title = img.getAttribute('data-title') || img.alt || 'Sin título';
    const desc = img.getAttribute('data-description') || 'Sin descripción';

    expandedImage.src = src;
    modalTitle.textContent = title;
    modalDescription.textContent = desc;

    /*expandedImage.src = img.src;
    modalTitle.textContent = img.getAttribute('data-title') || img.alt || 'Sin título';
    modalDescription.textContent = img.getAttribute('data-description') || 'Sin descripción';
    */

    seeMoreLink.href = `pag-dest.html?src=${encodeURIComponent(src)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(desc)}`;

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

// Generar información en pag-dest
function loadImageDetails() {
  const imgDetail = document.getElementById("img-detail");
  const imgTitle = document.getElementById("img-title");
  const imgDesc = document.getElementById("img-desc");

  if (!imgDetail || !imgTitle || !imgDesc) return;

  const params = new URLSearchParams(window.location.search);
  const src = params.get("src");
  const title = params.get("title");
  const desc = params.get("desc");

  if (src) imgDetail.src = src;
  else imgDetail.style.display = "none";

  imgTitle.textContent = title || "No image selected";
  imgDesc.textContent = desc || "No description available";
}

window.addEventListener("DOMContentLoaded", loadImageDetails);