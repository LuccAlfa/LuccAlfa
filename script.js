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
          statusEl.textContent =
            "Messaggio inviato con successo! Ti risponderemo presto.";
          statusEl.className = "form-status success";
          form.reset();
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
  const detailsElements = document.querySelectorAll(".faq-item");

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
  detailsElements.forEach((targetDetail) => {
    targetDetail.addEventListener("click", () => {
      detailsElements.forEach((detail) => {
        if (detail !== targetDetail && detail.hasAttribute("open")) {
          detail.removeAttribute("open");
        }
      });
    });
  });
});
