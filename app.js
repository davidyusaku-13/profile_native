/**
 * Elegant Portfolio - Enhanced Interactions
 * Smooth animations and polished micro-interactions
 */

document.addEventListener("DOMContentLoaded", function() {

  // ============================================
  // Scroll-triggered Fade Animations
  // ============================================
  const fadeConfig = [
    { selector: ".fade-hidden", hiddenClass: "fade-hidden", visibleClass: "fade-in-left" },
    { selector: ".fade-hidden-up", hiddenClass: "fade-hidden-up", visibleClass: "fade-up" },
    { selector: ".fade-hidden-opa", hiddenClass: "fade-hidden-opa", visibleClass: "fade-opa" },
    { selector: ".fade-hidden-portfo", hiddenClass: "fade-hidden-portfo", visibleClass: "fade-in-portfo" }
  ];

  const scrollContainer = document.getElementById('scroll-container');

  const observerOptions = {
    root: scrollContainer,
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px"
  };

  const fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      const config = fadeConfig.find(c =>
        entry.target.classList.contains(c.hiddenClass) ||
        entry.target.classList.contains(c.visibleClass)
      );
      if (!config) return;

      if (entry.isIntersecting) {
        // Add a small delay based on element's animation-delay style if present
        const delay = entry.target.style.animationDelay || '0s';
        const delayMs = parseFloat(delay) * 1000;

        setTimeout(() => {
          entry.target.classList.remove(config.hiddenClass);
          entry.target.classList.add(config.visibleClass);
        }, delayMs);
      } else {
        entry.target.classList.remove(config.visibleClass);
        entry.target.classList.add(config.hiddenClass);
      }
    });
  }, observerOptions);

  fadeConfig.forEach(function(config) {
    document.querySelectorAll(config.selector).forEach(function(element) {
      fadeObserver.observe(element);
    });
  });

  // ============================================
  // Navigation Scroll Effect
  // ============================================
  const navbar = document.getElementById('nav-bar');

  if (scrollContainer && navbar) {
    let lastScrollTop = 0;

    scrollContainer.addEventListener('scroll', function() {
      const scrollTop = scrollContainer.scrollTop;

      // Add scrolled class when scrolled down
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScrollTop = scrollTop;
    }, { passive: true });
  }

  // ============================================
  // Floating CTA Button
  // ============================================
  const btnHover = document.getElementById('btn-call-hover');
  const btnShow = document.getElementById('btn-call-show');

  if (btnHover && btnShow) {
    // No need for JS toggle - CSS handles the hover effect
    // But we can add touch support for mobile
    btnHover.addEventListener('touchstart', function(e) {
      btnHover.classList.toggle('touched');
    });
  }

  // ============================================
  // Offcanvas Mobile Menu
  // ============================================
  const offcanvasToggle = document.getElementById('offcanvas-toggle');
  const offcanvasClose = document.getElementById('offcanvas-close');
  const offcanvas = document.getElementById('offcanvasExample');
  const backdrop = document.getElementById('offcanvas-backdrop');

  function openOffcanvas() {
    if (offcanvas && backdrop) {
      offcanvas.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeOffcanvas() {
    if (offcanvas && backdrop) {
      offcanvas.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (offcanvasToggle) {
    offcanvasToggle.addEventListener('click', openOffcanvas);
  }

  if (offcanvasClose) {
    offcanvasClose.addEventListener('click', closeOffcanvas);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeOffcanvas);
  }

  // Close offcanvas when clicking nav links
  const offcanvasLinks = offcanvas ? offcanvas.querySelectorAll('a[href^="#"]') : [];
  offcanvasLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeOffcanvas();
    });
  });

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && offcanvas && offcanvas.classList.contains('active')) {
      closeOffcanvas();
    }
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement && scrollContainer) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // Active Navigation Link Highlighting
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .offcanvas-link');

  if (scrollContainer && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      root: scrollContainer,
      threshold: 0.5
    });

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // ============================================
  // Parallax Effect on Hero Image (subtle)
  // ============================================
  const heroImage = document.querySelector('.hero-image-photo');
  const heroGlow = document.querySelector('.hero-image-glow');

  if (heroImage && scrollContainer) {
    scrollContainer.addEventListener('scroll', function() {
      const scrollTop = scrollContainer.scrollTop;
      const heroSection = document.querySelector('.section-hero');

      if (heroSection && scrollTop < heroSection.offsetHeight) {
        const parallaxOffset = scrollTop * 0.15;
        heroImage.style.transform = `translateY(${parallaxOffset}px)`;

        if (heroGlow) {
          heroGlow.style.transform = `translateY(${parallaxOffset * 0.5}px)`;
        }
      }
    }, { passive: true });
  }

  // ============================================
  // Portfolio Image Tilt Effect (subtle)
  // ============================================
  const portfolioImages = document.querySelectorAll('.portfolio-image');

  portfolioImages.forEach(container => {
    const img = container.querySelector('img');
    if (!img) return;

    container.addEventListener('mousemove', function(e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = y * 5; // degrees
      const tiltY = -x * 5;

      img.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    container.addEventListener('mouseleave', function() {
      img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  // ============================================
  // Stagger Animation Delays for Experience Items
  // ============================================
  const experienceItems = document.querySelectorAll('.experience-item');
  experienceItems.forEach((item, index) => {
    if (!item.style.animationDelay) {
      item.style.transitionDelay = `${index * 0.1}s`;
    }
  });

});
