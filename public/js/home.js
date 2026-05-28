/* ═══════════════════════════════════════════
   HOME PAGE JS — Extreme Premium Animations
   ═══════════════════════════════════════════ */

window.addEventListener('DOMContentLoaded', () => {
  populateHomeData();
});

window.addEventListener('loaderFinished', () => {
  if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
    initHomeGsap();
  }
});

function populateHomeData() {
  const projects = getProjects().slice(0, 4); // Get first 4
  const testimonials = getTestimonials().slice(0, 3); // Get first 3
  
  // Populate Projects
  const projContainer = document.getElementById('featuredProjects');
  if (projContainer && projects.length) {
    projContainer.innerHTML = projects.map((p, i) => `
      <article class="project-card ${i === 0 || i === 3 ? 'project-card--large' : ''}" onclick="window.location.href='./portfolio.html'" data-animate="project">
        <img src="${p.image}" alt="${p.title}">
        <div class="project-card__meta">
          <span>${formatCategory(p.category)}</span>
          <span>${p.location}, ${p.year}</span>
        </div>
        <h3>${p.title}</h3>
      </article>
    `).join('');
  }

  // Populate Testimonials
  const testContainer = document.getElementById('homeTestimonials');
  if (testContainer && testimonials.length) {
    testContainer.innerHTML = testimonials.map(t => `
      <article class="testimonial-card" data-animate="fade-up">
        <div class="testimonial-card__stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
        <p class="testimonial-card__text">"${t.text}"</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar">${t.name.charAt(0)}</div>
          <div>
            <div class="testimonial-card__name">${t.name}</div>
            <div class="testimonial-card__location">${t.location}</div>
          </div>
        </div>
      </article>
    `).join('');
  }
}

function initHomeGsap() {
  // ── Hero Entrance (Cinematic Motion) ──
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  
  tl.from(".hero__media img", { scale: 1.45, filter: "blur(15px)", duration: 2.8, ease: "power3.inOut" }, 0)
    .from(".hero__scrim", { opacity: 0, duration: 2.8, ease: "power2.inOut" }, 0)
    .from(".hero__eyebrow", { opacity: 0, x: -40, duration: 1.5 }, 0.8)
    .from(".hero__title .split-line > span", { 
      yPercent: 120, rotationZ: 5, opacity: 0, 
      duration: 1.8, stagger: 0.04, ease: "power4.out" 
    }, 1.0)
    .from(".hero__bottom p", { opacity: 0, y: 40, duration: 1.4 }, 1.4)
    .from(".circle-link", { opacity: 0, scale: 0.4, rotation: -120, duration: 1.8, ease: "back.out(1.8)" }, 1.6)
    .from(".hero__stats .stat", { 
      opacity: 0, y: 50, scale: 0.95, duration: 1.4, 
      stagger: 0.15, ease: "power3.out" 
    }, 1.8);

  // ── Stats Counters ──
  gsap.utils.toArray('.stat__number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    gsap.to(el, {
      innerHTML: target,
      duration: 2.5,
      ease: "power2.out",
      snap: { innerHTML: 1 },
      scrollTrigger: { trigger: ".hero__stats", start: "top 95%" },
      onUpdate: function() { el.innerHTML = Math.round(el.innerHTML) + '+'; }
    });
  });

  // ── Interactive Scroll Skew on Ticker ──
  let scrollSpeed = 0;
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollSpeed = Math.min(Math.abs(window.scrollY - (window.lastScrollY || 0)) * 0.12, 10);
    window.lastScrollY = window.scrollY;
    
    gsap.to(".ticker__track", {
      skewX: window.scrollY > (window.lastScrollY || 0) ? scrollSpeed : -scrollSpeed,
      duration: 0.3,
      ease: "power2.out"
    });
    
    scrollTimeout = setTimeout(() => {
      gsap.to(".ticker__track", { skewX: 0, duration: 0.4, ease: "power3.out" });
    }, 150);
  }, { passive: true });

  // ── Project Cards Entry & 3D Hover ──
  gsap.utils.toArray("[data-animate='project']").forEach((card, i) => {
    gsap.fromTo(card, 
      { y: 80, scale: 0.9, opacity: 0, clipPath: "inset(20% 0% 20% 0%)" },
      {
        y: 0, scale: 1, opacity: 1, clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2, ease: "power4.out",
        scrollTrigger: { 
          trigger: card, 
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
    
    if (window.innerWidth > 768) {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        gsap.to(card, { 
          rotateY: x * 10, rotateX: y * -10, 
          scale: 1.02,
          transformPerspective: 1000, 
          duration: 0.4, ease: "power2.out" 
        });
        gsap.to(card.querySelector("img"), {
          scale: 1.15,
          x: x * -15, y: y * -15,
          duration: 0.5, ease: "power2.out"
        });
      });
      
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: "power3.out" });
        gsap.to(card.querySelector("img"), { scale: 1.06, x: 0, y: 0, duration: 0.6, ease: "power3.out" });
      });
    }
  });

  // ── Service Cards Extreme Reveal ──
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card, i) => {
    gsap.fromTo(card,
      { y: 60, opacity: 0, rotationX: -15, scale: 0.95 },
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

  if (window.innerWidth > 768) {
    gsap.utils.toArray(".service-card").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { 
          rotateY: x * 8, rotateX: y * -8, 
          y: -5,
          transformPerspective: 800, 
          duration: 0.3, ease: "power2.out" 
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: "power3.out" });
      });
    });
  }

  // ── About Section Image Mask Zoom ──
  gsap.from(".about-preview__image", {
    clipPath: "inset(0% 100% 0% 0%)",
    duration: 1.6,
    ease: "power4.inOut",
    scrollTrigger: { trigger: ".about-preview", start: "top 80%" }
  });
  
  gsap.from(".about-preview__image img", {
    scale: 1.25,
    duration: 2.2,
    ease: "power3.out",
    scrollTrigger: { trigger: ".about-preview", start: "top 80%" }
  });

  // ── Statement Section Parallax ──
  gsap.to(".statement__copy", {
    yPercent: -20,
    ease: "none",
    scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: true }
  });
  
  gsap.from(".statement__image img", {
    scale: 1.2,
    ease: "none",
    scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: true }
  });

  // ── Testimonials Stagger ──
  gsap.from(".testimonial-card", {
    y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out",
    scrollTrigger: { trigger: ".testimonial-preview", start: "top 85%" }
  });
}
