// Womboo - Main JavaScript File

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Womboo cargado correctamente');
    initializeEventListeners();
});

// Inicializar event listeners
function initializeEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer clic en un link
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            handleFormSubmit(e);
        });
    }
}

// Manejar submit del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Mostrar mensaje de confirmación
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = `¡Gracias ${name}! Tu mensaje ha sido enviado. Nos pondremos en contacto pronto.`;
    formMessage.classList.add('show');
    
    // Limpiar formulario
    form.reset();
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(function() {
        formMessage.classList.remove('show');
    }, 5000);
}
