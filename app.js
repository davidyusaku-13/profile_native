document.addEventListener("DOMContentLoaded", function() {
    // Unified fade animation observer
    const fadeConfig = [
        { selector: ".fade-hidden", hiddenClass: "fade-hidden", visibleClass: "fade-in-left" },
        { selector: ".fade-hidden-up", hiddenClass: "fade-hidden-up", visibleClass: "fade-up" },
        { selector: ".fade-hidden-opa", hiddenClass: "fade-hidden-opa", visibleClass: "fade-opa" },
        { selector: ".fade-hidden-portfo", hiddenClass: "fade-hidden-portfo", visibleClass: "fade-in-portfo" }
    ];

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            const config = fadeConfig.find(c => entry.target.classList.contains(c.hiddenClass) || entry.target.classList.contains(c.visibleClass));
            if (!config) return;

            if (entry.isIntersecting) {
                entry.target.classList.remove(config.hiddenClass);
                entry.target.classList.add(config.visibleClass);
            } else {
                entry.target.classList.remove(config.visibleClass);
                entry.target.classList.add(config.hiddenClass);
            }
        });
    }, { threshold: 0.7 });

    fadeConfig.forEach(function(config) {
        document.querySelectorAll(config.selector).forEach(function(element) {
            observer.observe(element);
        });
    });

    // CTA button hover
    const btnHover = document.getElementById('btn-call-hover');
    const btnShow = document.getElementById('btn-call-show');

    if (btnHover && btnShow) {
        btnHover.addEventListener("mouseenter", function() {
            btnShow.classList.remove('btn-hidden');
        });

        btnHover.addEventListener("mouseleave", function() {
            btnShow.classList.add('btn-hidden');
        });
    }

    // Offcanvas toggle (replaces Bootstrap JS)
    const offcanvasToggle = document.getElementById('offcanvas-toggle');
    const offcanvasClose = document.getElementById('offcanvas-close');
    const offcanvas = document.getElementById('offcanvasExample');
    const backdrop = document.getElementById('offcanvas-backdrop');

    function openOffcanvas() {
        offcanvas.classList.remove('-translate-x-full');
        offcanvas.classList.add('translate-x-0');
        backdrop.classList.remove('hidden');
    }

    function closeOffcanvas() {
        offcanvas.classList.add('-translate-x-full');
        offcanvas.classList.remove('translate-x-0');
        backdrop.classList.add('hidden');
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
        link.addEventListener('click', closeOffcanvas);
    });
});
