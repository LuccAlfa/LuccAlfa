// script.js - updated
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for internal anchors (also closes mobile nav when used)
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // close mobile nav if open
        var nav = document.getElementById('primary-navigation');
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          var t = document.getElementById('navToggle');
          if (t) t.setAttribute('aria-expanded','false');
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Navbar background toggle on scroll
  var navBar = document.getElementById('siteNav');
  function onScroll() {
    if (!navBar) return;
    if (window.scrollY > 40) {
      navBar.classList.add('scrolled');
    } else {
      navBar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Inject current year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primary-navigation');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function() {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      primaryNav.classList.toggle('open');
    });
  }

  // Calendly popup (booking)
  var bookBtn = document.getElementById('bookBtn');
  if (bookBtn) {
    var calendlyUrl = 'https://calendly.com/luccalfa-srl/incontro-telefonico';
    bookBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.Calendly && typeof Calendly.initPopupWidget === 'function') {
        Calendly.initPopupWidget({ url: calendlyUrl });
      } else {
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

  // Formspree submit handler with status messages and aria-live updates
  var contactForm = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      var endpoint = contactForm.getAttribute('data-endpoint');
      if (!endpoint || endpoint === '#') {
        // allow default submit if no endpoint
        return;
      }

      e.preventDefault();
      if (formStatus) { formStatus.textContent = 'Invio in corso...'; }

      var formData = new FormData(contactForm);
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; }

      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function(response) {
        if (response.ok) {
          if (formStatus) { formStatus.textContent = 'Messaggio inviato, reindirizzamento...'; }
          // small delay so user sees status, then redirect
          setTimeout(function(){ window.location.href = './thanks.html'; }, 600);
        } else {
          response.json().then(function(data) {
            if (formStatus) formStatus.textContent = 'Errore durante l\'invio. Riprova.';
            alert('Si è verificato un errore durante l\'invio. Riprova più tardi.');
            if (submitBtn) { submitBtn.disabled = false; }
          }).catch(function() {
            if (formStatus) formStatus.textContent = 'Errore durante l\'invio. Riprova.';
            if (submitBtn) { submitBtn.disabled = false; }
          });
        }
      }).catch(function(err) {
        console.error('Network error', err);
        if (formStatus) formStatus.textContent = 'Errore di rete. Controlla la connessione.';
        if (submitBtn) { submitBtn.disabled = false; }
      });
    });
  }
});
