/* ═══════════════════════════════════════════
   TESTIMONIALS PAGE JS — Premium Motion
   ═══════════════════════════════════════════ */

window.addEventListener('DOMContentLoaded', () => {
  renderTestimonials();
});

window.addEventListener('loaderFinished', () => {
  if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
    initTestimonialsGsap();
  }
});

function renderTestimonials() {
  const container = document.getElementById('testimonialsGrid');
  if (!container) return;
  
  const testimonials = getTestimonials();
  
  if (testimonials.length === 0) {
    container.innerHTML = '<p>No testimonials available yet.</p>';
    return;
  }

  container.innerHTML = testimonials.map((t, i) => `
    <article class="testimonial-card ${i % 3 === 0 ? 'testimonial-card--large' : ''}" style="opacity:0; transform:translateY(50px);">
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

  // ── Extreme Cinematic Staggered Reveal ──
  if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const cards = document.querySelectorAll(".testimonial-card");
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 80, opacity: 0, scale: 0.95, rotationX: -10 },
        { 
          y: 0, opacity: 1, scale: 1, rotationX: 0,
          duration: 1.2, 
          ease: "power4.out", 
          scrollTrigger: { 
            trigger: card, 
            start: "top 90%",
            toggleActions: "play none none reverse"
          },
          onComplete: function() {
            if (i === cards.length - 1) initTestimonialHoverEffects();
          }
        }
      );
    });
  } else {
    document.querySelectorAll(".testimonial-card").forEach(el => { 
      el.style.opacity = 1; 
      el.style.transform = "none"; 
    });
  }
}

function initTestimonialsGsap() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  
  tl.from(".page-hero__bg img", { scale: 1.25, duration: 2.5, ease: "power3.inOut" }, 0)
    .from(".page-hero__kicker", { opacity: 0, x: -30, duration: 1 }, 0.3)
    .from(".page-hero__title .split-line > span", { 
      yPercent: 120, rotationZ: 3, opacity: 0, 
      duration: 1.5, stagger: 0.05 
    }, 0.5)
    .from(".page-hero__subtitle", { opacity: 0, y: 20, duration: 1 }, 1.1);
}

// ── Interactive Card Hover Effects ──
function initTestimonialHoverEffects() {
  if (window.innerWidth <= 768) return;
  
  gsap.utils.toArray(".testimonial-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -10,
        scale: 1.01,
        borderColor: "var(--clay)",
        boxShadow: "0 20px 40px rgba(13,17,20,0.06)",
        duration: 0.4,
        ease: "power3.out"
      });
      gsap.to(card.querySelector(".testimonial-card__avatar"), {
        backgroundColor: "var(--gold)",
        scale: 1.1,
        duration: 0.4,
        ease: "power3.out"
      });
    });
    
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        borderColor: "rgba(23,21,18,0.08)",
        boxShadow: "none",
        duration: 0.5,
        ease: "power3.out"
      });
      gsap.to(card.querySelector(".testimonial-card__avatar"), {
        backgroundColor: "transparent",
        scale: 1,
        duration: 0.5,
        ease: "power3.out"
      });
    });
  });
}
