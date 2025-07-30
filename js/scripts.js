document.addEventListener('DOMContentLoaded', () => {
  cargarNavbar();
  cargarFooter();
  configurarBotonBackToTop();
  cambiarFondoHeader();
  inicializarSeccionesObserver();
  configurarGradientBottom();
  activarSombraSegunCursor();
  activarLuzSegunCursor();
});

function cargarNavbar() {
  fetch('/od/components/nav.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar-placeholder').innerHTML = html;
      inicializarNavbar();
      controlarNavbarConHeader();
    })
    .catch(e => console.error('Error cargando navbar:', e));
}

function cargarFooter() {
  fetch('/od/components/footer.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch(e => console.error('Error cargando footer:', e));
}

function configurarBotonBackToTop() {
  const btnTop = document.getElementById('btn-back-to-top');
  const floatingButtons = document.querySelector('.floating-buttons');
  if (!btnTop || !floatingButtons) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
      if (!btnTop.classList.contains('visible')) {
        btnTop.classList.add('visible');
        floatingButtons.style.bottom = '60px';
      }
    } else {
      if (btnTop.classList.contains('visible')) {
        btnTop.classList.remove('visible');
        floatingButtons.style.bottom = '0px';
      }
    }
  });

  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', configurarBotonBackToTop);

function inicializarNavbar() {
  const navbar = document.body.querySelector('#mainNav');
  const logo = document.getElementById('navbar-logo');
  const navbarResponsive = document.getElementById('navbarResponsive');
  const navbarTogglerBtn = document.getElementById('navbar-toggler');

  if (!navbar || !logo) return;

  // ScrollSpy de Bootstrap
  if (navbar) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      rootMargin: '0px 0px -40%',
    });
  }

  // Dropdowns responsive auto ajuste a pantalla
  document.querySelectorAll('.nav-item.dropdown').forEach(dropdown => {
    let locked = false;

    dropdown.addEventListener('shown.bs.dropdown', function () {
      if (locked) return;
      const menu = this.querySelector('.dropdown-menu');
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      if (rect.right > viewportWidth && !menu.classList.contains('dropdown-menu-end')) {
        locked = true;
        menu.classList.add('dropdown-menu-end');
        const toggle = this.querySelector('.dropdown-toggle');
        const dropdownInstance = bootstrap.Dropdown.getInstance(toggle);
        dropdownInstance.hide();

        setTimeout(() => {
          dropdownInstance.show();
          locked = false;
        }, 0);
      }
    });
  });

  // Toggle manual del navbar responsive
  if (navbarTogglerBtn && navbarResponsive) {
    navbarTogglerBtn.addEventListener('click', () => {
      const isVisible = window.getComputedStyle(navbarResponsive).display !== 'none';
      navbarResponsive.style.setProperty('display', isVisible ? 'none' : 'block', 'important');
    });
  }

  // Cambiar icono + / - en colapsables
  document.querySelectorAll('.toggle-plus').forEach(button => {
    const targetSelector = button.getAttribute('data-bs-target');
    const targetElement = document.querySelector(targetSelector);
    const icon = button.querySelector('i');

    if (!targetElement || !icon) return;

    targetElement.addEventListener('shown.bs.collapse', () => {
      icon.classList.replace('fa-plus', 'fa-minus');
    });

    targetElement.addEventListener('hidden.bs.collapse', () => {
      icon.classList.replace('fa-minus', 'fa-plus');
    });
  });

  // Reset display navbar responsive al redimensionar pantalla grande
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991.98 && navbarResponsive) {
      navbarResponsive.style.removeProperty('display');
    }
  });
}

function cambiarFondoHeader() {
  const bgLayers = [
    document.querySelector('.bg-layer1'),
    document.querySelector('.bg-layer2'),
  ];
  if (!bgLayers[0] || !bgLayers[1]) return;

  const headerImages = [
    '/od/assets/img/header/1.jpg',
    '/od/assets/img/header/2.jpg',
    '/od/assets/img/header/3.jpg',
    '/od/assets/img/header/4.jpg',
  ];

  let index = 0;
  let visibleLayer = 0;

  bgLayers[0].style.backgroundImage = `url(${headerImages[0]})`;
  bgLayers[0].classList.add('visible');

  setInterval(() => {
    const nextIndex = (index + 1) % headerImages.length;
    const nextLayer = 1 - visibleLayer;

    bgLayers[nextLayer].style.backgroundImage = `url(${headerImages[nextIndex]})`;
    bgLayers[visibleLayer].classList.remove('visible');
    bgLayers[nextLayer].classList.add('visible');

    visibleLayer = nextLayer;
    index = nextIndex;
  }, 5000);
}

function inicializarSeccionesObserver() {
  const sections = document.querySelectorAll('.page-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }
  );

  sections.forEach(section => observer.observe(section));
}

function configurarGradientBottom() {
  const gradient = document.querySelector('.main-bottom-gradient');
  if (!gradient) return;

  const thresholdPx = 150;

  function checkScroll() {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (pageHeight - scrollPosition < thresholdPx) {
      gradient.classList.add('hide');
    } else {
      gradient.classList.remove('hide');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

function controlarNavbarConHeader() {
  const masthead = document.querySelector('header.masthead');
  const navbar = document.querySelector('#mainNav');
  const logo = document.getElementById('navbar-logo');

  if (!masthead || !navbar || !logo) return;

  function checkNavbarPosition() {
    const navbarBottom = navbar.getBoundingClientRect().bottom;
    const mastheadBottom = masthead.getBoundingClientRect().bottom;

    if (navbarBottom > mastheadBottom) {
      navbar.classList.add('navbar-shrink');
      logo.src = '/od/assets/img/OneDev.png'; // Logo shrink
    } else {
      navbar.classList.remove('navbar-shrink');
      logo.src = '/od/assets/img/OneDevWhite.png'; // Logo normal
    }
  }

  window.addEventListener('scroll', checkNavbarPosition);
  window.addEventListener('resize', checkNavbarPosition);
  checkNavbarPosition(); // llamada inicial
}

function activarSombraSegunCursor() {
  document.querySelectorAll('.follow-shadow').forEach(img => {
    img.addEventListener('mousemove', e => {
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const offsetX = (x - centerX) / 10;
      const offsetY = (y - centerY) / 10;

      img.style.filter = `drop-shadow(${offsetX}px ${offsetY}px 12px rgba(0, 195, 255, 0.35))`;
    });

    img.addEventListener('mouseleave', () => {
      img.style.filter = 'drop-shadow(0px 8px 12px rgba(0, 195, 255, 0))';
    });
  });
}

function activarLuzSegunCursor() {
  document.querySelectorAll('.custom-card-wrapper, .benefit-card-wrapper').forEach(wrapper => {
    const light = wrapper.querySelector('.card-light');
    if (!light) return;

    wrapper.addEventListener('mousemove', e => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      light.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 195, 255, 0.6), transparent 60%)`;
      light.style.opacity = '1';
    });

    wrapper.addEventListener('mouseleave', () => {
      light.style.opacity = '0';
      light.style.background = `radial-gradient(circle at center, rgba(0, 195, 255, 0), transparent 60%)`;
    });
  });
}
