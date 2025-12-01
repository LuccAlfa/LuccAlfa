// script.js - invio form via fetch + invio evento GA4 + redirect a thanks.html
// Metti questo file nella root del repo e includilo in index.html prima di </body>:
// <script src="script.js"></script>

(function(){
  // aggiorna anno in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('contact-form');
  if (!form) return;

  // endpoint Formspree (già presente nel tuo action)
  const endpoint = form.getAttribute('action'); // https://formspree.io/f/xjknrvqv

  // helper per serializzare form in application/x-www-form-urlencoded
  function formToUrlEncoded(formEl) {
    const fm = new FormData(formEl);
    return new URLSearchParams(Array.from(fm.entries())).toString();
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const f = this;

    // rimuovere _next o non usarlo: stiamo gestendo redirect noi
    // invia i dati via fetch a Formspree
    try {
      const body = formToUrlEncoded(f);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
        // mode: 'cors' // default per fetch; Formspree permette CORS
      });

      // se vuoi, puoi controllare res.status: 200/201/302 => successo
      if (res.ok) {
        // invia evento GA4 alla TUA proprietà
        if (typeof gtag === 'function') {
          // manda evento e, tramite callback, redirect alla thanks.html
          gtag('event', 'contact_form_submit', {
            'send_to': 'G-0WRW6ZJJ88', // assicurati sia il tuo Measurement ID
            'event_category': 'engagement',
            'event_label': 'Contact form',
            'event_callback': function(){
              window.location = '/LuccAlfa/thanks.html'; // o '/thanks.html' se repo root
            }
          });
          // fallback: se callback non viene chiamata entro 1.5s, redirect comunque
          setTimeout(()=>{ window.location = '/LuccAlfa/thanks.html'; }, 1500);
        } else {
          // se gtag non definito per qualche motivo, redirect comunque
          window.location = '/LuccAlfa/thanks.html';
        }
      } else {
        // gestione errore: mostra messaggio utente e log
        console.error('Formspree response not ok', res.status, await res.text());
        alert('Si è verificato un errore nell\'invio. Riprova più tardi.');
      }
    } catch (err) {
      console.error('Errore invio form', err);
      // fallback classico: submit normale (non dovrebbe succedere di frequente)
      f.submit();
    }
  });
})();
