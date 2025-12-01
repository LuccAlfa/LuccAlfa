// script.js - gestione submit form + anno dinamico
// Inserisci questo file nella root del repo e includilo in index.html prima di </body>:
// <script src="script.js"></script>

document.getElementById('year')?.textContent = new Date().getFullYear();

(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    // invia evento GA4 prima di sottomettere il form a Formspree
    if (typeof gtag === 'function') {
      gtag('event', 'contact_form_submit', {
        'send_to': 'G-0WRW6ZJJ88', // Measurement ID già presente nel tuo index.html
        'event_category': 'engagement',
        'event_label': 'Contact form',
        'event_callback': function(){ form.submit(); }
      });
      // fallback per sicurezza: submit dopo 1.5s se callback non parte
      setTimeout(()=>form.submit(), 1500);
    } else {
      form.submit();
    }
  });
})();
