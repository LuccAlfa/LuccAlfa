
(function(){
  // anno dinamico
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('contact-form');
  if (!form) return;

  // utility: prova a invocare una funzione quando gtag diventa disponibile
  function waitForGtag(maxWait = 1500, interval = 100) {
    return new Promise((resolve) => {
      const start = Date.now();
      if (typeof gtag === 'function') return resolve(true);
      const id = setInterval(() => {
        if (typeof gtag === 'function') {
          clearInterval(id);
          return resolve(true);
        }
        if (Date.now() - start > maxWait) {
          clearInterval(id);
          return resolve(false);
        }
      }, interval);
    });
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const f = this;

    // aspetta brevemente che gtag sia pronto
    const gtagReady = await waitForGtag(1500, 100);

    if (gtagReady) {
      try {
        // manda evento e usa callback per submit
        gtag('event', 'contact_form_submit', {
          'send_to': 'G-0WRW6ZJJ88', // Measurement ID presente nel tuo index.html
          'event_category': 'engagement',
          'event_label': 'Contact form',
          'event_callback': function(){ f.submit(); }
        });
        // fallback: se callback non arriva, submit comunque dopo timeout
        setTimeout(()=>{ if (!f.__submitted) { f.__submitted = true; f.submit(); } }, 1500);
      } catch (err) {
        // se qualcosa va storto con gtag, invia comunque il form
        f.submit();
      }
    } else {
      // gtag non pronto: invia il form direttamente (fallback)
      f.submit();
    }
  });
})();
