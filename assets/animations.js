// Initialisation des animations au scroll
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser AOS
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    delay: 100,
  });

  // Initialiser les Swiper sliders
  const productSlider = new Swiper('.product-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });

  // Initialiser le slider de témoignages
  const testimonialSlider = new Swiper('.testimonial-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.testimonial-pagination',
      clickable: true,
    },
  });

  // Gestion des micro-interactions
  document.querySelectorAll('[data-interaction]').forEach(element => {
    const interaction = element.dataset.interaction;
    
    element.addEventListener('click', () => {
      switch(interaction) {
        case 'success':
          element.classList.add('success');
          setTimeout(() => element.classList.remove('success'), 1000);
          break;
        case 'error':
          element.classList.add('error');
          setTimeout(() => element.classList.remove('error'), 1000);
          break;
        case 'loading':
          element.classList.add('loading');
          // Simuler un chargement
          setTimeout(() => {
            element.classList.remove('loading');
            element.classList.add('success');
            setTimeout(() => element.classList.remove('success'), 1000);
          }, 2000);
          break;
      }
    });
  });

  // Gestion des états de hover avancés
  document.querySelectorAll('[data-hover]').forEach(element => {
    const hoverEffect = element.dataset.hover;
    
    element.addEventListener('mouseenter', () => {
      element.classList.add(`hover-${hoverEffect}`);
    });
    
    element.addEventListener('mouseleave', () => {
      element.classList.remove(`hover-${hoverEffect}`);
    });
  });

  // Observer d'intersection pour les animations au scroll personnalisées
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
  });
});

// Gestion du responsive
const handleResize = () => {
  const width = window.innerWidth;
  const html = document.documentElement;
  
  if (width <= 480) {
    html.setAttribute('data-device', 'mobile');
  } else if (width <= 768) {
    html.setAttribute('data-device', 'tablet');
  } else {
    html.setAttribute('data-device', 'desktop');
  }
};

window.addEventListener('resize', handleResize);
handleResize(); // Initial call
