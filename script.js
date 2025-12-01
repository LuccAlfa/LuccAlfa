// script.js - send via fetch (Accept: application/json), remove _next, send GA event, redirect to local thanks
(function(){
  console.log('[script.js] script caricato');

  // rimuovi eventuale input _next nel DOM (fix difensivo)
  const initialNext = document.querySelector('input[name="_next"]');
  if (initialNext) {
    initialNext.remove();
    console.log('[script.js] _next rimosso dal DOM (init)');
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('contact-form');
  if (!form) {
    console.log('[script.js] contact-form non trovato');
    return;
  }
  console.log('[script.js] contact-form trovato, attacco submit listener');

  // usa data-endpoint se presente (fail-safe), altrimenti action
  const endpoint = form.getAttribute('data-endpoint') || form.getAttribute('action');

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const f = this;

    try {
      // rimuovi eventuale _next dal DOM prima di costruire i dati
      const domNext = f.querySelector('input[name="_next"]');
      if (domNext) {
        domNext.remove();
        console.log('[script.js] _next rimosso dal DOM (on submit)');
      }

      // costruisci FormData e assicurati che _next non ci sia
      const fm = new FormData(f);
      if (fm.has('_next')) {
        fm.delete('_next');
        console.log('[script.js] _next cancellato da FormData');
      }

      const entries = Array.from(fm.entries());
      console.log('[script.js] Form data inviata:', entries);

      const body = new URLSearchParams(entries).toString();

      // invia a Formspree richiedendo JSON: questo impedisce redirect HTML /thanks
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: body,
        mode: 'cors'
      });

      if (res.ok) {
        // prova a leggere JSON (se presente)
        let resJson = null;
        try { resJson = await res.json(); } catch(e){ /* non critico */ }
        console.log('[script.js] Formspree risposta OK', res.status, resJson);

        // invia evento GA4 alla TUA proprietà
        if (typeof gtag === 'function') {
          console.log('[script.js] invio evento GA');
          gtag('event', 'contact_form_submit', {
            'send_to': 'G-0WRW6ZJJ88',
            'event_category': 'engagement',
            'event_label': 'Contact form',
            'event_callback': function(){ window.location = '/LuccAlfa/thanks.html'; }
          });
          // fallback redirect dopo 1.5s
          setTimeout(()=>{ window.location = '/LuccAlfa/thanks.html'; }, 1500);
        } else {
          window.location = '/LuccAlfa/thanks.html';
        }
      } else {
        console.error('[script.js] Formspree errore', res.status, await res.text());
        alert('Si è verificato un errore nell\'invio. Riprova più tardi.');
      }
    } catch (err) {
      console.error('[script.js] Errore invio form', err);
      alert('Invio fallito a causa di un problema di rete. Riprova.');
      // Non eseguiamo f.submit() per evitare redirect esterni
    }
  });
})();
