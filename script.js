// script.js - rimuove _next dal DOM, invia via fetch, manda evento GA e redirect
(function(){
  // debug: indicazione esecuzione script
  console.log('[script.js] script caricato');

  // rimuovi eventuale input _next nel DOM (fix difensivo)
  const nextInp = document.querySelector('input[name="_next"]');
  if (nextInp) {
    nextInp.remove();
    console.log('[script.js] _next rimosso dal DOM');
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('contact-form');
  if (!form) {
    console.log('[script.js] contact-form non trovato');
    return;
  }
  console.log('[script.js] contact-form trovato, attacco submit listener');

  const endpoint = form.getAttribute('action');

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const f = this;
    try {
      // costruisci FormData e assicurati che _next non ci sia
      const fm = new FormData(f);
      if (fm.has('_next')) {
        fm.delete('_next');
        console.log('[script.js] _next cancellato da FormData');
      }

      const entries = Array.from(fm.entries());
      console.log('[script.js] Form data inviata:', entries);

      const body = new URLSearchParams(entries).toString();

      // invia a Formspree
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
        credentials: 'include'
      });

      if (res.ok) {
        console.log('[script.js] Formspree OK, invio evento GA');
        if (typeof gtag === 'function') {
          gtag('event', 'contact_form_submit', {
            'send_to': 'G-0WRW6ZJJ88',
            'event_category': 'engagement',
            'event_label': 'Contact form',
            'event_callback': function(){ window.location = '/LuccAlfa/thanks.html'; }
          });
          // fallback redirect
          setTimeout(()=>{ window.location = '/LuccAlfa/thanks.html'; }, 1500);
        } else {
          window.location = '/LuccAlfa/thanks.html';
        }
      } else {
        console.error('[script.js] Formspree errore', res.status, await res.text());
        alert('Errore invio, riprova più tardi.');
      }
    } catch (err) {
      console.error('[script.js] Errore invio form', err);
      f.submit();
    }
  });
})();
