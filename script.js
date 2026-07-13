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

  // --- DINAMICA GALLERY ESPANSIONE E FILTRI AUTOMATICI (max 6 foto) ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item:not(.gallery-item--placeholder)');
  const expandBtn = document.querySelector('.gallery-expand-btn');
  const galleryExpandWrap = document.querySelector('.gallery-expand-wrap');

  // 6 è il numero perfetto per formare un blocco rettangolare sia a 3 che a 2 colonne
  const VISIBLE_LIMIT = 6; 

  const applyFilter = (filterValue) => {
    let visibleCount = 0;

    galleryItems.forEach(item => {
      // Resetta gli stati precedenti
      item.removeAttribute('data-extra');
      item.classList.remove('extra-visible', 'hidden-item');

      // Verifica se l'elemento corrisponde al filtro
      const isMatch = filterValue === 'all' || item.getAttribute('data-cat') === filterValue;

      if (isMatch) {
        visibleCount++;
        if (visibleCount > VISIBLE_LIMIT) {
          // Oltre la sesta foto, l'elemento viene contrassegnato per essere nascosto
          item.setAttribute('data-extra', 'true');
        }
      } else {
        // Nasconde completamente gli elementi che non c'entrano con la categoria
        item.classList.add('hidden-item');
      }
    });

    // Gestione visibilità del pulsante Espandi
    if (expandBtn && galleryExpandWrap) {
      const hiddenExtras = document.querySelectorAll('.gallery-item[data-extra="true"]');
      if (hiddenExtras.length > 0) {
        galleryExpandWrap.style.display = 'block';
        expandBtn.classList.remove('expanded');
        // Aggiorna il numerino nel pulsante (se presente)
        const countBadge = expandBtn.querySelector('.expand-count');
        if(countBadge) countBadge.textContent = hiddenExtras.length;
      } else {
        // Nascondi il pulsante se le foto sono 6 o meno
        galleryExpandWrap.style.display = 'none';
      }
    }
  };

  // Inizializza gli eventi per i bottoni dei filtri
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  // Inizializza l'evento per il pulsante Espandi / Riduci
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      const isExpanded = expandBtn.classList.contains('expanded');
      const extras = document.querySelectorAll('.gallery-item[data-extra="true"]');

      if (!isExpanded) {
        // Mostra le foto extra
        extras.forEach(item => item.classList.add('extra-visible'));
        expandBtn.classList.add('expanded');
      } else {
        // Nascondi le foto extra
        extras.forEach(item => item.classList.remove('extra-visible'));
        expandBtn.classList.remove('expanded');
        
        // Riporta l'utente all'inizio della galleria per non lasciarlo nel vuoto
        const gallerySection = document.querySelector('.gallery-section');
        if (gallerySection) {
          const navHeight = siteNav ? siteNav.offsetHeight : 68;
          window.scrollTo({
            top: gallerySection.offsetTop - navHeight - 20,
            behavior: 'smooth'
          });
        }
      }
    });
  }

  // Esegue il calcolo all'avvio usando il filtro attualmente attivo ("Tutti")
  const activeFilterBtn = document.querySelector('.filter-btn.active') || filterBtns[0];
  if (activeFilterBtn) applyFilter(activeFilterBtn.getAttribute('data-filter'));
});
