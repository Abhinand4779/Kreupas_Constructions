/* ═══════════════════════════════════════════
   GLOBAL JS
   Handles loader, menu, cursor, and GSAP
   ═══════════════════════════════════════════ */

const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

// Initialize layout setup early before loader finishes
window.addEventListener('DOMContentLoaded', () => {
  splitText();
});

// Fallback to ensure loader doesn't hang if load event fails or takes too long
let loaderFinished = false;
function removeLoader() {
  if (loaderFinished) return;
  loaderFinished = true;
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      document.body.classList.add('loader-hiding');
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('is-loading');
        document.body.classList.remove('loader-hiding');
        window.scrollTo(0, 0);
        
        initGlobal();
        window.dispatchEvent(new Event('loaderFinished'));
      }, 1000);
    }, 100); // reduced delay for snappier entry
  } else {
    initGlobal();
    window.dispatchEvent(new Event('loaderFinished'));
  }
}
window.addEventListener('load', removeLoader);
setTimeout(removeLoader, 2500);

function initGlobal() {
  initMobileMenu();
  
  if (hasGsap) {
    initGsapGlobal();
    initCursor();
    initMagnetic();
  } else {
    initFallback();
  }
  
  // Header scroll effect
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const opening = !nav.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", opening);

    if (opening) {
      nav.classList.add("active");
      menuToggle.classList.add("active");
      document.body.style.overflow = "hidden";

      if (typeof gsap !== "undefined") {
        const overlay = nav.querySelector(".mobile-nav-overlay");
        const drawer  = nav.querySelector(".mobile-nav-content");
        const links   = nav.querySelectorAll(".mobile-nav-links a");
        const footer  = nav.querySelector(".mobile-nav-footer");

        gsap.killTweensOf([overlay, drawer, links, footer]);

        gsap.fromTo(overlay, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.5, ease: "power2.out" }
        );

        gsap.fromTo(drawer,
          { x: "100%" },
          { x: "0%", duration: 0.6, ease: "power4.out" }
        );

        gsap.fromTo(links,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out", delay: 0.2 }
        );

        if (footer) {
          gsap.fromTo(footer,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.4 }
          );
        }
      }
    } else {
      menuToggle.classList.remove("active");
      if (typeof gsap !== "undefined") {
        const overlay = nav.querySelector(".mobile-nav-overlay");
        const drawer  = nav.querySelector(".mobile-nav-content");
        const links   = nav.querySelectorAll(".mobile-nav-links a");
        const footer  = nav.querySelector(".mobile-nav-footer");

        gsap.to(links, { opacity: 0, x: 20, duration: 0.2 });
        if (footer) gsap.to(footer, { opacity: 0, duration: 0.2 });
        
        gsap.to(drawer, {
          x: "100%",
          duration: 0.5,
          ease: "power3.inOut",
          delay: 0.1
        });
        
        gsap.to(overlay, { 
          opacity: 0, 
          duration: 0.5, 
          ease: "power2.inOut", 
          delay: 0.2,
          onComplete: () => {
            nav.classList.remove("active");
            document.body.style.overflow = "";
          }
        });
      } else {
        nav.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });

  // Close on link click
  nav.querySelectorAll(".mobile-nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("active")) menuToggle.click();
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("active") && !e.target.closest(".site-header") && !e.target.closest(".nav")) {
      menuToggle.click();
    }
  });
}


function splitText() {
  document.querySelectorAll(".split-text").forEach((element) => {
    // Only split if not already split
    if (element.querySelector('.split-line')) return;
    
    const text = element.textContent.trim();
    const words = text.split(" ");
    element.textContent = "";
    words.forEach((word) => {
      const line = document.createElement("span");
      const inner = document.createElement("span");
      line.className = "split-line";
      inner.textContent = word + "\u00A0"; // Add non-breaking space
      line.appendChild(inner);
      element.appendChild(line);
    });
  });
}

function initFallback() {
  document.querySelectorAll("[data-animate], .split-text").forEach((element) => {
    element.style.opacity = "1";
    if (element.classList.contains('split-text')) {
      const spans = element.querySelectorAll('.split-line > span');
      if(spans.length) {
        spans.forEach(s => s.style.transform = 'translateY(0)');
      } else {
        element.style.transform = 'translateY(0)';
      }
    }
  });
}

function initGsapGlobal() {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap-ready");
  // splitText() is already called in DOMContentLoaded

  // Scroll Progress Bar
  const progress = document.querySelector('.progress');
  if (progress) {
    gsap.to(progress, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2
      }
    });
  }

  // Header Entry
  gsap.from(".site-header", { y: -60, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.1 });
  
  // Parallax Images
  document.querySelectorAll("[data-parallax]").forEach((element) => {
    gsap.to(element.querySelector("img") || element, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // Ticker animation
  if (document.querySelector(".ticker__track")) {
    gsap.to(".ticker__track", {
      skewX: 1.5,
      duration: 10,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  }

  // Generic fade-up elements
  gsap.utils.toArray("[data-animate='fade-up']").forEach((element) => {
    gsap.from(element, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%"
      }
    });
  });

  // Split text scroll animations (excluding hero)
  document.querySelectorAll(".split-text:not(.hero__title)").forEach((element) => {
    gsap.from(element.querySelectorAll(".split-line > span"), {
      yPercent: 110,
      duration: 1,
      stagger: 0.03,
      ease: "power4.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%"
      }
    });
  });
  
  // Footer animation
  gsap.from(".footer__inner > div", {
    y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: ".footer", start: "top 90%" }
  });
}

function initCursor() {
  const cursor = document.querySelector(".cursor");
  if (!cursor || window.innerWidth < 768) return;

  const quickX = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
  const quickY = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });

  window.addEventListener("mousemove", (e) => {
    quickX(e.clientX);
    quickY(e.clientY);
  });

  // Add hover effects for all interactive elements
  const interactives = document.querySelectorAll("a, button, .project-card, .portfolio-item");
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(cursor, { scale: 1.8, borderColor: "var(--gold)", backgroundColor: "rgba(212,167,106,0.1)", duration: 0.3 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(cursor, { scale: 1, borderColor: "rgba(244, 240, 232, 0.6)", backgroundColor: "transparent", duration: 0.3 });
    });
  });
}

function initMagnetic() {
  if (window.innerWidth < 768) return;
  
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(element, { x: x * 0.2, y: y * 0.2, duration: 0.4, ease: "power3.out" });
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });
}
