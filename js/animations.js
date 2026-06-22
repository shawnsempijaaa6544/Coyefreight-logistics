/**
 * animations.js — Intersection Observer for scroll animations
 * Coyefreight Logistics Premium
 */
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // Scroll Reveal via IntersectionObserver
    // ==========================================================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px', // trigger slightly before element enters view
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve after animation fires — prevents re-triggering & fixes memory leak
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animation candidates
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // ==========================================================================
    // Animated Number Counter (for stat items)
    // ==========================================================================
    function animateCounter(el, target, duration = 1800) {
        const start = performance.now();
        const isPercent = el.textContent.includes('%');
        const isPlus    = el.textContent.includes('+');

        const tick = (now) => {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(ease * target);

            el.textContent = value + (isPlus ? '+' : '') + (isPercent ? '%' : '');

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);

                if (!isNaN(target)) {
                    animateCounter(el, target);
                    obs.unobserve(el);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

});
