/**
 * main.js — Core UI interactions
 * Coyefreight Logistics Premium
 */

// ==========================================================================
// Preloader
// ==========================================================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Minimum display time for branding impact
    setTimeout(() => {
        preloader.classList.add('fade-out');
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
        }, { once: true });
    }, 1400);
});

// ==========================================================================
// Sticky Header
// ==========================================================================
const header = document.querySelector('.header');

function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });

// ==========================================================================
// Mobile Menu Toggle — proper drawer, no alert()
// ==========================================================================
const mobileBtn  = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMobileMenu(open) {
    if (!mobileMenu || !mobileBtn) return;
    const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');

    mobileMenu.classList.toggle('open', isOpen);
    mobileBtn.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));

    // Swap icon
    const icon = mobileBtn.querySelector('i');
    if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
}

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => toggleMobileMenu());
}

// Close mobile menu when a nav link is clicked
document.querySelectorAll('.mobile-nav-link, .mobile-nav-actions .btn').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
        if (!header.contains(e.target)) {
            toggleMobileMenu(false);
        }
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
        mobileBtn.focus();
    }
});

// ==========================================================================
// Active Nav Link on Scroll (Spy)
// ==========================================================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

function updateActiveNav() {
    let currentSection = '';
    const scrollY = window.scrollY + 120; // Offset for fixed header

    sections.forEach(section => {
        if (scrollY >= section.offsetTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ==========================================================================
// Back to Top Button
// ==========================================================================
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================================================
// Auto-update Footer Year
// ==========================================================================
const yearEl = document.getElementById('footer-year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ==========================================================================
// Quote Form — client-side submission simulation
// ==========================================================================
const quoteForm    = document.getElementById('quote-form');
const quoteSuccess = document.getElementById('quote-success');
const quoteSubmit  = document.getElementById('quote-submit-btn');

if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic HTML5 validation
        if (!quoteForm.checkValidity()) {
            quoteForm.reportValidity();
            return;
        }

        // Simulate async send
        const original = quoteSubmit.innerHTML;
        quoteSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
        quoteSubmit.disabled = true;

        setTimeout(() => {
            quoteSubmit.innerHTML = original;
            quoteSubmit.disabled = false;

            if (quoteSuccess) {
                quoteSuccess.style.display = 'block';
                quoteSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            quoteForm.reset();

            // Hide success message after 6s
            setTimeout(() => {
                if (quoteSuccess) quoteSuccess.style.display = 'none';
            }, 6000);
        }, 1800);
    });
}
