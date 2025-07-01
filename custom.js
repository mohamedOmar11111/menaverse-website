
/* Custom JS for Menaverse Online */

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    if (lang === 'ar') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Set default language on load
    changeLanguage('en');

    // Initialize Slick Carousel
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        new Slick(testimonialSlider, {
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }

    // Initialize ScrollReveal
    ScrollReveal().reveal('.service-card', { delay: 200, origin: 'bottom', distance: '50px', interval: 200 });
    ScrollReveal().reveal('#about .row', { delay: 200, origin: 'left', distance: '50px' });
    ScrollReveal().reveal('.process-step', { delay: 200, origin: 'bottom', distance: '50px', interval: 200 });

    // Contact Form Validation
    const form = document.querySelector('#contact form');
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const messageInput = document.querySelector('textarea[name="message"]');

    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;

            // Name validation
            if (nameInput.value.trim() === '') {
                isValid = false;
                alert('Please enter your name.');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                alert('Please enter a valid email address.');
            }

            // Message validation
            if (messageInput.value.trim() === '') {
                isValid = false;
                alert('Please enter a message.');
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});
