form.addEventListener('submit', async function(e){
  e.preventDefault();
  const f = this;
  try {
    // crea body ma escludi _next per evitare redirect di Formspree
    const fm = new FormData(f);
    if (fm.has('_next')) fm.delete('_next');
    const body = new URLSearchParams(Array.from(fm.entries())).toString();

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    });

    if (res.ok) {
      // invia evento alla TUA proprietà (G-0WRW6ZJJ88)
      if (typeof gtag === 'function') {
        console.log('Invio evento GA a G-0WRW6ZJJ88');
        gtag('event', 'contact_form_submit', {
          'send_to': 'G-0WRW6ZJJ88',
          'event_category': 'engagement',
          'event_label': 'Contact form',
          'event_callback': function(){ window.location = '/LuccAlfa/thanks.html'; }
        });
        setTimeout(()=>{ window.location = '/LuccAlfa/thanks.html'; }, 1500);
      } else {
        window.location = '/LuccAlfa/thanks.html';
      }
    } else {
      console.error('Formspree response not ok', res.status, await res.text());
      alert('Si è verificato un errore nell\'invio. Riprova più tardi.');
    }
  } catch (err) {
    console.error('Errore invio form', err);
    f.submit();
  }
});
