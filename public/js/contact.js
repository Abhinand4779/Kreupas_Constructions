/* ═══════════════════════════════════════════
   CONTACT PAGE JS — Extreme Interactive Brief & Motion
   ═══════════════════════════════════════════ */

window.addEventListener('DOMContentLoaded', () => {
  initBriefConfigurator();
});

window.addEventListener('loaderFinished', () => {
  if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
    initContactGsap();
  }
});

function initBriefConfigurator() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  
  if (!form) return;

  // ── Interactive Selector Cards ──
  const selectorCards = document.querySelectorAll('.selector-card');
  const hiddenSelect = document.getElementById('contactService');
  const canvasImages = document.querySelectorAll('.canvas-image');

  selectorCards.forEach(card => {
    // Hover effect to pre-view architectural visual
    card.addEventListener('mouseenter', () => {
      const val = card.getAttribute('data-value');
      switchCanvasImage(val);
    });

    // Reset to selected service when mouse leaves unless clicked
    card.addEventListener('mouseleave', () => {
      const activeCard = document.querySelector('.selector-card.active');
      if (activeCard) {
        switchCanvasImage(activeCard.getAttribute('data-value'));
      } else {
        switchCanvasImage('default');
      }
    });

    // Click handler to lock active state
    card.addEventListener('click', () => {
      selectorCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const val = card.getAttribute('data-value');
      if (hiddenSelect) {
        hiddenSelect.value = val;
      }
      switchCanvasImage(val);

      // Trigger micro-bounce scale on select
      gsap.fromTo(card, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
    });
  });

  function switchCanvasImage(serviceName) {
    if (!canvasImages.length) return;
    
    canvasImages.forEach(img => {
      if (img.getAttribute('data-canvas') === serviceName) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });
  }

  // ── Dynamic Budget Slider ──
  const slider = document.getElementById('contactBudget');
  const budgetValueDisplay = document.getElementById('budgetValue');
  const budgetHiddenInput = document.getElementById('budgetHidden');

  if (slider && budgetValueDisplay) {
    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      let text = '';
      if (val >= 100) {
        text = `₹${(val / 100).toFixed(2)} Crore`;
      } else {
        text = `₹${val} Lakhs`;
      }
      budgetValueDisplay.textContent = text;
      if (budgetHiddenInput) {
        budgetHiddenInput.value = text;
      }
      
      // Micro text scale bump
      gsap.killTweensOf(budgetValueDisplay);
      gsap.fromTo(budgetValueDisplay, { scale: 1.2, color: "var(--gold)" }, { scale: 1, color: "var(--gold)", duration: 0.3 });
    });
  }

  // ── Submission Handler ──
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('.commission-btn');
    const originalText = btn.innerHTML;
    
    // Extract form values
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;
    const district = document.getElementById('contactDistrict').value;
    const service = hiddenSelect ? hiddenSelect.value : 'building';
    const budget = budgetHiddenInput ? budgetHiddenInput.value : '';
    const message = document.getElementById('contactMessage').value;

    // Construct WhatsApp message
    const waText = `Hello Kreupas Construction,

I am interested in a new project. Here are my details:
*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*District:* ${district}
*Service:* ${service}
*Estimated Budget:* ${budget}

*Project Vision:*
${message}

Looking forward to hearing from you!`;

    const waNumber = "919388427373";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

    btn.innerHTML = '<span>Opening WhatsApp...</span>';
    btn.disabled = true;
    
    setTimeout(() => {
      // Navigate to WhatsApp directly (window.open gets blocked on mobile)
      window.location.href = waUrl;

      form.reset();
      // Restore defaults
      selectorCards.forEach(c => c.classList.remove('active'));
      if (selectorCards[0]) selectorCards[0].classList.add('active');
      if (hiddenSelect) hiddenSelect.value = 'building';
      if (budgetValueDisplay) budgetValueDisplay.textContent = '₹35 Lakhs';
      switchCanvasImage('building');

      btn.innerHTML = originalText;
      btn.disabled = false;
      
      successMsg.classList.add('show');
      gsap.fromTo(successMsg, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });

      setTimeout(() => {
        gsap.to(successMsg, { 
          opacity: 0, y: -10, duration: 0.5, 
          onComplete: () => successMsg.classList.remove('show') 
        });
      }, 5000);
    }, 800);
  });
}

function initContactGsap() {
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

  // ── Left Side Sticky Visual Entrance ──
  if (window.innerWidth > 990) {
    gsap.from(".contact-canvas", {
      clipPath: "inset(0% 100% 0% 0%)",
      duration: 1.8,
      ease: "power4.inOut",
      scrollTrigger: { trigger: ".contact-grid", start: "top 85%" }
    });
  }

  // ── Right Side Brief Form Staggered Entrance ──
  const formTl = gsap.timeline({
    scrollTrigger: { trigger: ".contact-form-container", start: "top 90%" }
  });

  formTl
    .from(".contact-form-container .section__kicker", { opacity: 0, x: -20, duration: 0.8 })
    .from(".contact-title", { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
    .from(".brief-step", { 
      y: 50, opacity: 0, duration: 0.8, 
      stagger: 0.2, ease: "power3.out" 
    }, "-=0.6")
    .from(".commission-btn", { scale: 0.95, opacity: 0, duration: 0.8, ease: "back.out(1.5)" }, "-=0.4")
    .from(".brief-footer-details", { opacity: 0, y: 20, duration: 0.8 }, "-=0.4");

  // ── Input Line Drawing Animation on Focus ──
  const inputs = document.querySelectorAll('.form-underline-group input, .form-underline-group textarea');
  inputs.forEach(input => {
    // Add underline spans dynamically for extreme micro-animation
    const line = document.createElement('span');
    line.style.position = 'absolute';
    line.style.bottom = '0';
    line.style.left = '0';
    line.style.width = '100%';
    line.style.height = '2px';
    line.style.backgroundColor = 'var(--gold)';
    line.style.transform = 'scaleX(0)';
    line.style.transformOrigin = 'left';
    line.style.transition = 'transform 0.4s ease';
    input.parentNode.appendChild(line);

    input.addEventListener('focus', () => {
      line.style.transform = 'scaleX(1)';
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        line.style.transform = 'scaleX(0)';
      }
    });
  });
}
