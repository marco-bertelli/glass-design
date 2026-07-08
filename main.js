/* Manuela Durizzi — comportamenti condivisi (Respiro) */

function toggleMenu() {
    var nav = document.getElementById('navLinks');
    if (!nav) return;
    var open = nav.classList.toggle('active');
    var btn = document.querySelector('.mobile-menu-btn');
    if (btn) btn.setAttribute('aria-expanded', open);
}

function toggleFAQ(el) {
    var item = el.parentElement;
    document.querySelectorAll('.faq-item').forEach(function (i) {
        if (i !== item) {
            i.classList.remove('active');
            var q = i.querySelector('.faq-question');
            if (q) q.setAttribute('aria-expanded', 'false');
        }
    });
    var open = item.classList.toggle('active');
    el.setAttribute('aria-expanded', open);
}

document.addEventListener('DOMContentLoaded', function () {
    // Header: sfondo al primo scroll
    var header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // Smooth scroll per ancore interne + chiudi menu mobile
    var navLinks = document.getElementById('navLinks');
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });

    // FAQ: accessibilità da tastiera (l'onclick nell'HTML gestisce il click)
    document.querySelectorAll('.faq-question').forEach(function (q) {
        q.setAttribute('tabindex', '0');
        q.setAttribute('role', 'button');
        q.setAttribute('aria-expanded', 'false');
        q.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(q);
            }
        });
    });

    // Fade-in delle card allo scroll
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (en.isIntersecting) {
                en.target.style.opacity = '1';
                en.target.style.transform = 'translateY(0)';
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.skill-card, .timeline-item, .project-card, .location-card, .contact-card, .service-card, .faq-item')
        .forEach(function (el, i) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity .6s ease ' + ((i % 4) * 0.08) + 's, transform .6s ease ' + ((i % 4) * 0.08) + 's';
            io.observe(el);
        });

    // Percorso (home): la linea cresce con lo scroll, i puntini si accendono
    var timeline = document.querySelector('.timeline');
    var fill = document.querySelector('.timeline-fill');
    if (timeline && fill) {
        var dots = [].slice.call(timeline.querySelectorAll('.timeline-dot'));
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            fill.style.height = '100%';
            dots.forEach(function (d) { d.classList.add('reached'); });
        } else {
            var ticking = false;
            var update = function () {
                ticking = false;
                var rect = timeline.getBoundingClientRect();
                var trigger = window.innerHeight * 0.62;
                var progress = Math.min(Math.max(trigger - rect.top, 0), rect.height);
                fill.style.height = progress + 'px';
                dots.forEach(function (d) {
                    var y = d.getBoundingClientRect().top - rect.top;
                    d.classList.toggle('reached', y <= progress);
                });
            };
            var onScroll = function () {
                if (!ticking) { ticking = true; requestAnimationFrame(update); }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
            update();
        }
    }
});
