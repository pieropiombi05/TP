// Womboo - Main JavaScript File

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Womboo cargado correctamente');
    initializeEventListeners();
});

// Inicializar event listeners
function initializeEventListeners() {
    // Event listener para el botón CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            handleCtaClick();
        });
    }

    // Event listeners para los links de navegación
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            handleNavClick(e);
        });
    });

    // Event listeners para las tarjetas de productos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            handleProductClick(card);
        });
    });
}

// Manejar clic del botón CTA
function handleCtaClick() {
    console.log('Usuario hizo clic en el botón CTA');
    // Scroll suave a la sección de colección
    const collectionSection = document.getElementById('collection');
    if (collectionSection) {
        collectionSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Manejar clic en links de navegación
function handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    const targetSection = document.querySelector(href);
    
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Manejar clic en tarjetas de productos
function handleProductClick(card) {
    const productName = card.querySelector('h3').textContent;
    const productPrice = card.querySelector('.price').textContent;
    console.log(`Producto seleccionado: ${productName} - ${productPrice}`);
    
    // Aquí puedes agregar lógica para mostrar detalles del producto
    // o agregar al carrito
}

// Función auxiliar para obtener todos los productos
function getProducts() {
    return document.querySelectorAll('.product-card');
}

// Función auxiliar para scroll suave personalizado
function smoothScroll(target, duration = 300) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const startPosition = window.scrollY;
    const endPosition = targetElement.offsetTop;
    const distance = endPosition - startPosition;
    let start = null;
    
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const run = ease(progress, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (progress < duration) window.requestAnimationFrame(step);
    });
}

// Función de easing para animaciones suaves
function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}
