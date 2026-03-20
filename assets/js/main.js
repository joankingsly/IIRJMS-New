document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const scrollTopButton = document.querySelector(".scroll-top");
  const currentYearSpan = document.getElementById("current-year");

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear().toString();
  }

  const callForPapersOverlay = document.getElementById("call-for-papers-overlay");
  const callForPapersOpenBtn = document.getElementById("call-for-papers-open");
  const callForPapersCloseBtn = callForPapersOverlay
    ? callForPapersOverlay.querySelector(".modal-close")
    : null;

  function openCallForPapers() {
    if (!callForPapersOverlay) return;
    callForPapersOverlay.classList.add("is-open");
    callForPapersOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (callForPapersCloseBtn) callForPapersCloseBtn.focus();
  }

  function closeCallForPapers() {
    if (!callForPapersOverlay) return;
    callForPapersOverlay.classList.remove("is-open");
    callForPapersOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (callForPapersOverlay) {
    // Close when clicking outside the modal.
    callForPapersOverlay.addEventListener("click", (event) => {
      if (event.target === callForPapersOverlay) {
        closeCallForPapers();
      }
    });

    if (callForPapersCloseBtn) {
      callForPapersCloseBtn.addEventListener("click", closeCallForPapers);
    }

    if (callForPapersOpenBtn) {
      callForPapersOpenBtn.addEventListener("click", (event) => {
        event.preventDefault();
        openCallForPapers();
      });
    }

    // Open automatically on page load.
    openCallForPapers();
  }

  function closeMobileNav() {
    if (mainNav) {
      mainNav.classList.remove("open");
    }
  }

  function handleNavClick(event) {
    const target = event.currentTarget;
    const href = target.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const section = document.querySelector(href);
    if (!section) return;

    event.preventDefault();

    const headerHeight = header ? header.offsetHeight : 0;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const offsetTop = sectionTop - headerHeight + 1;

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });

    closeMobileNav();
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
  }

  const observerOptions = {
    root: null,
    threshold: 0.4,
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");
        if (!id) return;

        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      });
    },
    observerOptions
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  const animatedElements = Array.from(
    document.querySelectorAll(
      ".section, .hero-inner, .special-card, .info-card"
    )
  );

  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          animationObserver.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.15 }
  );

  animatedElements.forEach((el) => animationObserver.observe(el));

  const tabContainers = Array.from(document.querySelectorAll("[data-tabs]"));

  tabContainers.forEach((tabsEl) => {
    const buttons = Array.from(tabsEl.querySelectorAll(".tab-button"));
    const panels = Array.from(tabsEl.querySelectorAll(".tab-panel"));

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        panels.forEach((panel) => {
          panel.classList.remove("active");
          panel.hidden = true;
        });

        button.classList.add("active");
        const panel = panels[index];
        if (panel) {
          panel.classList.add("active");
          panel.hidden = false;
        }
      });
    });
  });

  function updateScrollTopVisibility() {
    if (!scrollTopButton) return;
    if (window.scrollY > 200) {
      scrollTopButton.classList.add("visible");
    } else {
      scrollTopButton.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", updateScrollTopVisibility, {
    passive: true,
  });

  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});

