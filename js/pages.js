/**
 * pages.js — Shared logic for all inner pages
 * Coyefreight Logistics Premium
 */

// ==========================================================================
// Sticky Header
// ==========================================================================
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
    // Inner pages start scrolled down, so force the class immediately
    if (window.scrollY > 50) header.classList.add('scrolled');
}

// ==========================================================================
// Mobile Menu Toggle
// ==========================================================================
const mobileBtn  = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMobileMenu(open) {
    if (!mobileMenu || !mobileBtn) return;
    const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileBtn.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    const icon = mobileBtn.querySelector('i');
    if (icon) icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}

if (mobileBtn)  mobileBtn.addEventListener('click', () => toggleMobileMenu());

document.querySelectorAll('.mobile-nav-link, .mobile-nav-actions .btn').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
});

document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open') && !header.contains(e.target)) {
        toggleMobileMenu(false);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
        if (mobileBtn) mobileBtn.focus();
    }
});

// ==========================================================================
// Scroll Reveal (Intersection Observer) + Staggered Children
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Reveal ---
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Stagger children that are grid/flex items (cards, steps, etc.)
                const staggerChildren = entry.target.querySelectorAll(
                    '.team-card, .process-card, .service-detail-card, .service-stat-card, ' +
                    '.tracking-info-card, .tracking-step, .next-step-card, .faq-item, ' +
                    '.stats-bar-item, .office-card, .feature-list li, .history-item'
                );
                staggerChildren.forEach((child, i) => {
                    child.style.opacity = '0';
                    child.style.transform = 'translateY(18px)';
                    child.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        });
                    });
                });

                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // --- Counter Animation ---
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el     = entry.target;
                const target = parseInt(el.dataset.count, 10);
                if (!isNaN(target)) {
                    const text      = el.textContent;
                    const isPlus    = text.includes('+');
                    const isPercent = text.includes('%');
                    const prefix    = text.match(/^[^0-9]*/)?.[0] || '';   // e.g. "$"
                    const start     = performance.now();
                    const duration  = 2000;
                    const tick = (now) => {
                        const p = Math.min((now - start) / duration, 1);
                        const e = 1 - Math.pow(1 - p, 3);  // Ease out cubic
                        let val = Math.round(e * target);
                        // Add comma formatting for large numbers
                        if (target >= 1000) val = val.toLocaleString();
                        el.textContent = prefix + val + (isPlus ? '+' : '') + (isPercent ? '%' : '');
                        if (p < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                    obs.unobserve(el);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

    // --- FAQ Accordion (smooth height transition) ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            // Close all open items with smooth transition
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- Industry quick-nav highlight on scroll ---
    const quickNav = document.querySelector('.industry-quick-nav');
    if (quickNav) {
        const navLinks = quickNav.querySelectorAll('a[href^="#"]');
        const sections = [];
        navLinks.forEach(link => {
            const id = link.getAttribute('href').replace('#', '');
            const sec = document.getElementById(id);
            if (sec) sections.push({ el: sec, link });
        });

        if (sections.length) {
            const highlightNav = () => {
                const scrollY = window.scrollY + 200;
                let active = null;
                sections.forEach(s => {
                    if (s.el.offsetTop <= scrollY) active = s;
                });
                navLinks.forEach(l => l.classList.remove('active'));
                if (active) active.link.classList.add('active');
            };
            window.addEventListener('scroll', highlightNav, { passive: true });
            highlightNav();
        }

        // Smooth scroll for quick-nav links
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const offset = (quickNav.offsetHeight || 60) + 20;
                    window.scrollTo({
                        top: target.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});

// ==========================================================================
// Parallax-lite for page hero background images
// ==========================================================================
(function() {
    const heroImg = document.querySelector('.page-hero-bg');
    if (heroImg) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY < 800) {
                        heroImg.style.transform = `translateY(${scrollY * 0.2}px) scale(1.02)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
})();

// ==========================================================================
// Back to Top
// ==========================================================================
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ==========================================================================
// Footer Year
// ==========================================================================
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
