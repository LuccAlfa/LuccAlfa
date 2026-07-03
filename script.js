document.addEventListener("DOMContentLoaded", () => {
  // --- NAVBAR SCROLL EFFECT ---
  const siteNav = document.getElementById("siteNav");
  if (siteNav) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        siteNav.classList.add("scrolled");
      } else {
        siteNav.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialize state
  }

  // --- MOBILE MENU TOGGLE & AUTO-CLOSE ---
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primary-navigation");
  const navLinks = document.querySelectorAll(".nav-menu a");

  if (navToggle && primaryNav) {
    const toggleMenu = () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      primaryNav.classList.toggle("open");
    };

    navToggle.addEventListener("click", toggleMenu);

    // Chiudi il menu quando si clicca un link su mobile
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (primaryNav.classList.contains("open")) {
          toggleMenu();
        }
      });
    });
  }

  // --- SMOOTH SCROLL & OFFSET ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = siteNav ? siteNav.offsetHeight : 68;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // --- STATS COUNTER ANIMATION ---
  const statNumbers = document.querySelectorAll(".stat-number");
  const statsOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.textContent.replace(/\D/g, ""), 10);
        const suffix = target.textContent.replace(/[0-9]/g, "");
        const duration = 2000; // ms
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const counter = setInterval(() => {
          frame++;
          const progress = frame / totalFrames;
          const currentCount = Math.round(finalValue * progress);
          target.textContent = currentCount + suffix;

          if (frame === totalFrames) {
            clearInterval(counter);
            target.textContent = finalValue + suffix;
          }
        }, frameDuration);

        observer.unobserve(target); // Esegui una sola volta
      }
    });
  }, statsOptions);

  statNumbers.forEach((stat) => {
    statsObserver.observe(stat);
  });

  // --- SCROLL REVEAL ANIMATIONS ---
  const reveals = document.querySelectorAll(".reveal");
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  reveals.forEach((reveal) => {
    revealOnScroll.observe(reveal);
  });

  // --- CURRENT YEAR IN FOOTER ---
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- FORM HANDLING ---
  const form = document.querySelector("#contact-form");
  const statusEl = document.querySelector("#form-status");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (statusEl) {
        statusEl.textContent = "Invio in corso...";
        statusEl.className = "form-status";
      }

      const formData = new FormData(form);
      const endpoint = form.getAttribute("data-endpoint") || form.action;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });
        if (response.ok) {
          // Reindirizza l'utente alla pagina di ringraziamento
          window.location.href = "thanks.html"; 
        } else {
          statusEl.textContent = "Oops! Si è verificato un errore. Riprova.";
          statusEl.className = "form-status error";
        }
      } catch (err) {
        statusEl.textContent = "Errore di connessione. Riprova più tardi.";
        statusEl.className = "form-status error";
      }
    });
  }

  // --- FAQ TOGGLE CON LOGICA ACCORDION ---
  const faqToggleBtn = document.getElementById("faqToggleBtn");
  const faqListContainer = document.getElementById("faq-list-container");

  if (faqToggleBtn && faqListContainer) {
    faqToggleBtn.addEventListener("click", () => {
      const isExpanded = faqToggleBtn.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        faqListContainer.classList.remove("is-open");
        faqToggleBtn.setAttribute("aria-expanded", "false");
        faqToggleBtn.innerHTML = "Mostra le risposte &rarr;";
        setTimeout(() => {
          faqListContainer.style.display = "none";
        }, 500);
      } else {
        faqListContainer.style.display = "block";
        requestAnimationFrame(() => {
          faqListContainer.classList.add("is-open");
        });
        faqToggleBtn.setAttribute("aria-expanded", "true");
        faqToggleBtn.innerHTML = "Nascondi le risposte &uarr;";
      }
    });
  }

  // Auto-chiusura di una FAQ se ne viene aperta un'altra
  const categoryDetails = document.querySelectorAll(".faq-category-item");
  const faqDetails = document.querySelectorAll(".faq-item");

  categoryDetails.forEach((targetDetail) => {
    const summary = targetDetail.querySelector("summary");
    if (summary) {
      summary.addEventListener("click", () => {
        categoryDetails.forEach((detail) => {
          if (detail !== targetDetail && detail.hasAttribute("open")) {
            detail.removeAttribute("open");
          }
        });
      });
    }
  });

  faqDetails.forEach((targetDetail) => {
    const summary = targetDetail.querySelector("summary");
    if (summary) {
      summary.addEventListener("click", () => {
        const parentCategory = targetDetail.closest(".faq-category-item__body");
        const siblings = parentCategory 
          ? parentCategory.querySelectorAll(".faq-item") 
          : faqDetails;
          
        siblings.forEach((detail) => {
          if (detail !== targetDetail && detail.hasAttribute("open")) {
            detail.removeAttribute("open");
          }
        });
      });
    }
  });

  // --- MOBILE TOUCH LOGIC PER CARD SERVIZI (VERSIONE AGGIORNATA) ---
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    // 1. TRASFORMAZIONE DINAMICA CARD PULIZIE
    const pulizieCard = document.querySelector('.scard--link-card');
    
    if (pulizieCard) {
      // Recuperiamo l'URL originale dal link desktop
      const fullLink = pulizieCard.querySelector('.scard__full-link');
      const linkHref = fullLink ? fullLink.getAttribute('href') : 'ditta-pulizie-lucca.html';

      // Nascondiamo gli elementi della versione desktop
      if (fullLink) fullLink.style.display = 'none';
      const badge = pulizieCard.querySelector('.scard__cta-badge');
      if (badge) badge.style.display = 'none';

      // Iniettiamo il pannello identico a Giardinaggio con l'etichetta richiesta
      const panelHTML = `
        <div class="scard__hover-panel" aria-hidden="true">
          <span class="scard__hover-label">Scopri di più</span>
          <div class="scard__hover-links">
            <a href="${linkHref}">
              🧼 Pulizie
              <span class="link-arrow">→</span>
            </a>
          </div>
        </div>
      `;
      pulizieCard.insertAdjacentHTML('beforeend', panelHTML);

      // Cambiamo la classe per farle ereditare lo stile "Giardinaggio"
      pulizieCard.classList.remove('scard--link-card');
      pulizieCard.classList.add('scard--multi');
    }

    // 2. GESTIONE TOCCO (Valida per entrambe le card ora)
    const expandableCards = document.querySelectorAll('.scard--multi');

    const closeAllCards = () => {
      expandableCards.forEach(card => card.classList.remove('is-active'));
    };

    expandableCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Se tocca il link interno quando la card è già aperta, naviga
        if (card.classList.contains('is-active') && e.target.closest('a')) {
          return; 
        }

        // Primo tap: apri questa card e chiudi le altre
        if (!card.classList.contains('is-active')) {
          e.preventDefault(); 
          closeAllCards();
          card.classList.add('is-active');
        }
      });
    });

    // 3. Chiudi se si tocca fuori dalle card
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.scard--multi')) {
        closeAllCards();
      }
    });
  }

  // --- GESTIONE DIDASCALIE SU MOBILE ---
  const figures = document.querySelectorAll('figure');

  figures.forEach(fig => {
    fig.addEventListener('click', (e) => {
      // Impedisce la chiusura immediata se si clicca sulla figura stessa
      e.stopPropagation();
      
      // Se è già aperta, la chiudiamo, altrimenti chiudiamo le altre e apriamo questa
      const isAlreadyOpen = fig.classList.contains('is-tapped');
      
      figures.forEach(f => f.classList.remove('is-tapped'));
      
      if (!isAlreadyOpen) {
        fig.classList.add('is-tapped');
      }
    });
  });

  // Chiude la didascalia se si clicca in qualsiasi altra parte dello schermo
  document.addEventListener('click', () => {
    figures.forEach(f => f.classList.remove('is-tapped'));
  });

  // --- CONTEGGIO AUTOMATICO FOTO EXTRA ---
  const expandBtn = document.getElementById("galleryExpandBtn");
  const countSpan = expandBtn ? expandBtn.querySelector(".expand-count") : null;
  const expandWrap = document.querySelector(".gallery-expand-wrap");

  // Funzione che calcola e aggiorna il numero
  function aggiornaContatoreExtra(categoria = 'tutti') {
    if (!countSpan) return;

    // Trova tutte le foto extra reali (escludendo i placeholder "Prossimamente")
    const extraPhotos = document.querySelectorAll('.gallery-item[data-extra]:not(.gallery-item--placeholder)');
    let count = 0;

    // Conta quante foto extra corrispondono alla categoria attiva
    extraPhotos.forEach(photo => {
      const cat = photo.getAttribute('data-cat');
      if (categoria === 'tutti' || categoria === 'all' || cat === categoria) {
        count++;
      }
    });

    // Aggiorna il numerino nel pulsante HTML
    countSpan.textContent = count;

    // Nasconde l'intero pulsante se per questa categoria non ci sono foto extra
    if (expandWrap) {
      expandWrap.style.display = count > 0 ? 'flex' : 'none'; 
    }
  }

  // 1. Inizializza il contatore al primo caricamento della pagina
  aggiornaContatoreExtra('tutti');

  // 2. Sincronizzazione con i pulsanti di filtro
  // Assumiamo che i tuoi pulsanti di filtro usino un attributo "data-filter" 
  // es: <button data-filter="giardinaggio">Giardinaggio</button>
  const filterButtons = document.querySelectorAll('[data-filter]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.currentTarget.getAttribute('data-filter');
      aggiornaContatoreExtra(cat); // Aggiorna il numero in base al filtro scelto
    });
  });
});
