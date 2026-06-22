/**
 * tracking.js — Shipment Tracking logic
 * Coyefreight Logistics Premium
 */
document.addEventListener('DOMContentLoaded', () => {

    const trackForm    = document.getElementById('tracking-form');
    const trackInput   = document.getElementById('tracking-number');
    const trackResult  = document.getElementById('tracking-result');
    const trackError   = document.getElementById('tracking-error');
    const resultId     = document.getElementById('result-shipment-id');
    const resultEta    = document.getElementById('result-eta');

    if (!trackForm) return;

    // Mock shipment database
    const mockShipments = {
        'CYF-123456789': {
            status: 'In Transit',
            statusColor: '#22c55e',
            origin: 'Shanghai, CN',
            destination: 'New York, US',
            etaDays: 2,
            milestones: [
                { label: 'Order Received & Confirmed', location: 'Shanghai, CN', done: true },
                { label: 'Customs Cleared — Port of Origin', location: 'Shanghai, CN', done: true },
                { label: 'Departed Facility', location: 'Shanghai, CN', done: true },
                { label: 'Arrived at Regional Hub', location: 'Los Angeles, US', done: true, active: true },
                { label: 'Out for Delivery', location: 'New York, US', done: false },
            ]
        },
        'CYF-987654321': {
            status: 'Delivered',
            statusColor: '#2596be',
            origin: 'Rotterdam, NL',
            destination: 'Chicago, US',
            etaDays: 0,
            milestones: [
                { label: 'Order Received & Confirmed', location: 'Rotterdam, NL', done: true },
                { label: 'Customs Cleared — Port of Origin', location: 'Rotterdam, NL', done: true },
                { label: 'Departed Facility', location: 'Rotterdam, NL', done: true },
                { label: 'Arrived at Destination', location: 'Chicago, US', done: true },
                { label: 'Delivered Successfully', location: 'Chicago, US', done: true, active: true },
            ]
        }
    };

    function getEtaLabel(daysFromNow) {
        if (daysFromNow === 0) return 'Delivered';
        const eta = new Date();
        eta.setDate(eta.getDate() + daysFromNow);
        return eta.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function buildTimeline(milestones) {
        const timeline = trackResult.querySelector('.timeline');
        if (!timeline) return;

        timeline.innerHTML = milestones.map(m => `
            <div class="timeline-item ${m.done ? 'completed' : ''}" role="listitem">
                <div class="timeline-icon ${m.active ? 'active-dot' : ''}" 
                     ${m.active ? 'style="background:var(--color-primary); box-shadow:var(--shadow-glow);"' : ''}
                     aria-hidden="true">
                </div>
                <div class="timeline-content">
                    <h4 ${m.active ? 'style="color:var(--color-primary);"' : ''}>${m.label}</h4>
                    <p>${m.location}</p>
                </div>
            </div>
        `).join('');
    }

    function showError(message) {
        if (!trackError) return;
        trackError.textContent = '⚠ ' + message;
        trackError.style.display = 'block';
        if (trackResult) trackResult.classList.remove('active');
    }

    function clearError() {
        if (trackError) trackError.style.display = 'none';
    }

    trackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearError();

        const rawInput  = trackInput.value.trim().toUpperCase();
        const submitBtn = trackForm.querySelector('button[type="submit"]');

        if (!rawInput) {
            showError('Please enter a tracking number.');
            trackInput.focus();
            return;
        }

        // Show loading state
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Tracking…';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;

            const shipment = mockShipments[rawInput];

            if (!shipment) {
                showError(`No shipment found for "${rawInput}". Try CYF-123456789 or CYF-987654321 as demo.`);
                return;
            }

            // Populate result
            if (resultId) {
                resultId.innerHTML = `Shipment: <span style="color:var(--color-navy)">${rawInput}</span>`;
            }

            // Update status badge
            const statusEl = trackResult.querySelector('p span');
            if (statusEl) {
                statusEl.style.color = shipment.statusColor;
                statusEl.textContent = shipment.status;
            }

            // Update ETA
            if (resultEta) {
                resultEta.textContent = getEtaLabel(shipment.etaDays);
            }

            // Build timeline
            buildTimeline(shipment.milestones);

            // Show result with animation
            trackResult.classList.add('active');
            trackResult.scrollIntoView({ behavior: 'smooth', block: 'start' });

        }, 1200);
    });

    // Allow re-tracking — hide result when input changes
    if (trackInput) {
        trackInput.addEventListener('input', () => {
            if (trackResult.classList.contains('active')) {
                trackResult.classList.remove('active');
            }
            clearError();
        });
    }

});
