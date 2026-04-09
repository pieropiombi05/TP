// Womboo - Main JavaScript File

// ========================================
// OJOS ANIMADOS - Función principal
// ========================================

/**
 * Inicializa los ojos animados que siguen el cursor del mouse
 * Los ojos están dentro de elementos SVG y se animan suavemente
 */
function initializeAnimatedEyes() {
    const eyeElements = document.querySelectorAll('.eye-pupil');
    
    // Si no hay ojos en la página, salir
    if (eyeElements.length === 0) {
        return;
    }
    
    /**
     * Actualiza la posición de las pupilas cuando el mouse se mueve
     * @param {MouseEvent} e - Evento del mouse
     */
    document.addEventListener('mousemove', function(e) {
        // Obtener la posición actual del cursor
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Actualizar cada uno de los ojos
        eyeElements.forEach(pupil => {
            // Obtener el SVG padre del ojo
            const svg = pupil.closest('svg.animated-eyes');
            if (!svg) return;
            
            // Obtener la posición y dimensiones del SVG en la pantalla
            const svgRect = svg.getBoundingClientRect();
            const svgCenterX = svgRect.left + svgRect.width / 2;
            const svgCenterY = svgRect.top + svgRect.height / 2;
            
            // Calcular el ángulo entre el centro del ojo y el cursor
            const angle = Math.atan2(mouseY - svgCenterY, mouseX - svgCenterX);
            
            // Distancia máxima que puede moverse la pupila (radio del ojo - radio de la pupila)
            // En el SVG: radio del ojo = 8, radio de la pupila = 4, entonces distancia máx = 4
            const maxDistance = 4;
            
            // Calcular la nueva posición de la pupila
            const pupilX = parseFloat(pupil.getAttribute('data-eye') === 'left' ? 15 : 45);
            const pupilY = 15;
            
            // Aplicar el movimiento: cantidad de píxeles que se mueve la pupila
            const newX = pupilX + Math.cos(angle) * maxDistance;
            const newY = pupilY + Math.sin(angle) * maxDistance;
            
            // Actualizar la posición en el SVG
            pupil.setAttribute('cx', newX);
            pupil.setAttribute('cy', newY);
        });
    });
}

// ========================================
// THEME TOGGLE - Light/Dark Mode
// ========================================

/**
 * Inicializa el sistema de tema (light/dark mode)
 * Lee la preferencia guardada en localStorage y la aplica
 * Los ojos del logo se adaptan al tema
 */
function initializeTheme() {
    // Obtener la preferencia guardada o usar 'dark' por defecto
    const savedTheme = localStorage.getItem('womboo-theme') || 'dark';
    
    // Aplicar el tema al documento
    setTheme(savedTheme);
    
    // Configurar el botón de toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        updateThemeButton(savedTheme);
        themeToggle.addEventListener('click', toggleTheme);
    }
}

/**
 * Aplica un tema específico al documento
 * @param {string} theme - 'light' o 'dark'
 */
function setTheme(theme) {
    const htmlElement = document.documentElement;
    
    if (theme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
    } else {
        htmlElement.removeAttribute('data-theme');
    }
    
    // Guardar la preferencia
    localStorage.setItem('womboo-theme', theme);
}

/**
 * Alterna entre light mode y dark mode
 */
function toggleTheme() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
    updateThemeButton(newTheme);
}

/**
 * Actualiza la apariencia del botón según el tema
 * @param {string} theme - 'light' o 'dark'
 */
function updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.setAttribute('data-mode', theme);
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            // 🌙 para dark mode, ☀️ para light mode
            icon.textContent = theme === 'light' ? '☀️' : '🌙';
        }
    }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Womboo cargado correctamente');
    initializeTheme();
    initializeAnimatedEyes();
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
