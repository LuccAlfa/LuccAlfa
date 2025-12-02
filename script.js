// script.js
// - smooth scroll for anchor links
// - toggle navbar background on scroll
// - inject current year into footer
// - Calendly popup init for booking button
// - optional Formspree submit handler (uses data-endpoint attribute on the form)

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      // ignore links that only reference '#'
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Navbar background toggle on scroll
  var nav = document.getElementById('siteNav');
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Inject current year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Calendly popup (booking)
  var bookBtn = document.getElementById('bookBtn');
  if (bookBtn) {
    var calendlyUrl = 'https://calendly.com/luccalfa-srl/incontro-telefonico';
    bookBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.Calendly && typeof Calendly.initPopupWidget === 'function') {
        Calendly.initPopupWidget({ url: calendlyUrl });
      } else {
        // If Calendly script hasn't loaded yet, try loading and retry after a short delay
        var script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = function() {
          if (window.Calendly && Calendly.initPopupWidget) Calendly.initPopupWidget({ url: calendlyUrl });
        };
        document.head.appendChild(script);
      }
    });
  }

  // Formspree submit handler (progressive enhancement)
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      var endpoint = contactForm.getAttribute('data-endpoint');
      if (!endpoint || endpoint === '#') {
        // allow default submit (or no-op)
        return;
      }

      e.preventDefault();
      var formData = new FormData(contactForm);
      // Basic UX: disable submit button if present
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Invio...';
      }

      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(function(response) {
        if (response.ok) {
          // successo
          if (submitBtn) submitBtn.textContent = 'Inviato';
          contactForm.reset();
          setTimeout(function() {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Invia';
            }
          }, 2000);
        } else {
          // errore
          response.json().then(function(data) {
            console.warn('Formspree error', data);
            alert('Si è verificato un errore durante l\'invio. Riprova più tardi.');
            if (submitBtn) submitBtn.disabled = false;
            if (submitBtn) submitBtn.textContent = 'Invia';
          }).catch(function() {
            alert('Si è verificato un errore durante l\'invio. Riprova più tardi.');
            if (submitBtn) submitBtn.disabled = false;
            if (submitBtn) submitBtn.textContent = 'Invia';
          });
        }
      }).catch(function(err) {
        console.error('Network error', err);
        alert('Errore di rete. Controlla la connessione.');
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtn) submitBtn.textContent = 'Invia';
      });
    });
  }
});
