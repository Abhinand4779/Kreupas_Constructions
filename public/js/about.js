/* ═══════════════════════════════════════════
   ABOUT PAGE JS — Animations
   ═══════════════════════════════════════════ */

window.addEventListener('loaderFinished', () => {
  if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
    initAboutGsap();
  }
});

function initAboutGsap() {
  // ── Hero Entrance ──
  const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
  
  heroTl
    .from(".page-hero__bg img", { scale: 1.2, duration: 2.5, ease: "power3.inOut" }, 0)
    .from(".page-hero__kicker", { opacity: 0, x: -30, duration: 1 }, 0.3)
    .from(".page-hero__title .split-line > span", { 
      yPercent: 120, rotationZ: 3, opacity: 0, 
      duration: 1.4, stagger: 0.06 
    }, 0.5)
    .from(".page-hero__subtitle", { opacity: 0, y: 20, duration: 1 }, 1.2);

  // ── Story Section ──
  gsap.from(".about-story__image", {
    x: -60, opacity: 0, duration: 1.2, ease: "power3.out",
    scrollTrigger: { trigger: ".about-story", start: "top 80%" }
  });

  gsap.from(".about-story__image img", {
    scale: 1.15, duration: 1.5, ease: "power2.out",
    scrollTrigger: { trigger: ".about-story", start: "top 80%" }
  });

  gsap.from(".about-story__content", {
    x: 60, opacity: 0, duration: 1.2, ease: "power3.out",
    scrollTrigger: { trigger: ".about-story", start: "top 80%" }
  });

  // ── Stats Counter Animation ──
  const stats = document.querySelectorAll('.stats-grid__item');
  stats.forEach((item, i) => {
    gsap.from(item, {
      y: 60, opacity: 0, scale: 0.9, duration: 0.8, ease: "power4.out",
      scrollTrigger: { trigger: item, start: "top 90%" }
    });
    
    const numEl = item.querySelector('.stats-grid__num');
    if (numEl) {
      const target = parseInt(numEl.getAttribute('data-count'));
      gsap.from(numEl, {
        textContent: 0,
        duration: 2.5,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: { trigger: item, start: "top 90%" },
        onUpdate: function() {
          numEl.textContent = Math.round(parseFloat(numEl.textContent)) + '+';
        }
      });
    }
  });

  // ── Founder Section ──
  gsap.from(".founder-card__image", {
    y: 80, opacity: 0, scale: 0.95, duration: 1.4, ease: "power3.out",
    clipPath: "inset(20% 0% 20% 0%)",
    scrollTrigger: { trigger: ".founder-card", start: "top 85%" }
  });

  gsap.from(".founder-card__content", {
    y: 50, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".founder-card", start: "top 85%" }
  });

  // ── Extreme Values Section ──
  const values = document.querySelectorAll('.value-card');
  values.forEach((card, i) => {
    gsap.fromTo(card, 
      { y: 80, opacity: 0, rotationX: -15, scale: 0.95 },
      {
        y: 0, opacity: 1, rotationX: 0, scale: 1,
        duration: 1.2, 
        ease: "power4.out",
        transformPerspective: 1000,
        scrollTrigger: { 
          trigger: card, 
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}
