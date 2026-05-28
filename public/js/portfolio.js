/* ═══════════════════════════════════════════
   PORTFOLIO PAGE JS — Cinematic Animations
   ═══════════════════════════════════════════ */

let allProjects = [];

window.addEventListener('DOMContentLoaded', () => {
  allProjects = getProjects();
  renderPortfolio(allProjects);
  initFilters();
});

window.addEventListener('loaderFinished', () => {
  if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
    initPortfolioGsap();
  }
});

function renderPortfolio(projectsToRender) {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;
  
  if (projectsToRender.length === 0) {
    container.innerHTML = '<p style="color:rgba(23,21,18,.6);grid-column:1/-1;padding:40px 0;">No projects found in this category.</p>';
    return;
  }

  container.innerHTML = projectsToRender.map((p, i) => `
    <article class="portfolio-item" onclick="openLightbox('${p.id}')">
      <img src="${p.image}" alt="${p.title}">
      <div class="portfolio-item__overlay">
        <div class="portfolio-item__category">${formatCategory(p.category)}</div>
        <h3 class="portfolio-item__title">${p.title}</h3>
        <div class="portfolio-item__desc">${p.location}, ${p.year}</div>
      </div>
    </article>
  `).join('');

  // ── Cinematic Scroll Reveal ──
  if (window.gsap && window.ScrollTrigger) {
    const items = document.querySelectorAll(".portfolio-item");
    items.forEach((item, index) => {
      gsap.set(item, { opacity: 0, y: 60 });
      gsap.to(item, {
        opacity: 1, y: 0,
        duration: 0.8,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 95%",
          toggleActions: "play none none none"
        },
        onComplete: () => {
          if (index === items.length - 1) initPortfolioItemHover();
        }
      });
    });

    // Safety fallback: if items are still hidden after 3s, force show them
    setTimeout(() => {
      document.querySelectorAll(".portfolio-item").forEach(el => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 3000);
  } else {
    // No GSAP — show everything immediately
    document.querySelectorAll(".portfolio-item").forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      const filtered = filterValue === 'all' 
        ? allProjects 
        : allProjects.filter(p => p.category === filterValue);
      
      // Animate old items out before rendering new ones
      if (window.gsap) {
        gsap.to(".portfolio-item", {
          opacity: 0, y: -20, duration: 0.4, stagger: 0.03, ease: "power2.in",
          onComplete: () => {
            renderPortfolio(filtered);
          }
        });
      } else {
        renderPortfolio(filtered);
      }
    });
  });
}

function initPortfolioGsap() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  
  tl.from(".page-hero__bg img", { scale: 1.25, duration: 2.5, ease: "power3.inOut" }, 0)
    .from(".page-hero__kicker", { opacity: 0, x: -30, duration: 1 }, 0.3)
    .from(".page-hero__title .split-line > span", { 
      yPercent: 120, rotationZ: 3, opacity: 0, 
      duration: 1.5, stagger: 0.05 
    }, 0.5)
    .from(".page-hero__subtitle", { opacity: 0, y: 20, duration: 1 }, 1.1)
    .from(".portfolio-filters", { opacity: 0, y: 20, duration: 1 }, 1.3);
}

// ── 3D Magnetic Interactive Hover ──
function initPortfolioItemHover() {
  if (window.innerWidth <= 768) return;
  
  gsap.utils.toArray(".portfolio-item").forEach(item => {
    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(item, {
        rotateY: x * 12, rotateX: y * -12,
        scale: 1.02,
        transformPerspective: 1000,
        duration: 0.4, ease: "power2.out"
      });
      
      gsap.to(item.querySelector("img"), {
        scale: 1.15,
        x: x * -10, y: y * -10,
        duration: 0.5, ease: "power2.out"
      });
    });
    
    item.addEventListener("mouseleave", () => {
      gsap.to(item, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: "power3.out" });
      gsap.to(item.querySelector("img"), { scale: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out" });
    });
  });
}

// ── Premium Cinematic Lightbox ──
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(id) {
  const proj = allProjects.find(p => p.id === id);
  if (!proj || !lightbox) return;
  
  lightboxImg.src = proj.image;
  lightboxTitle.textContent = proj.title;
  lightboxDesc.textContent = proj.description;
  
  // Open with GSAP cinematic animation
  lightbox.style.display = 'grid';
  document.body.style.overflow = 'hidden';
  
  gsap.killTweensOf([lightbox, ".lightbox__content", ".lightbox__close"]);
  
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.6 })
    .fromTo(".lightbox__content", { scale: 0.8, y: 60, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.8 }, 0.1)
    .fromTo(".lightbox__close", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, 0.3);
}

function closeLightbox() {
  if (!lightbox) return;
  
  gsap.killTweensOf([lightbox, ".lightbox__content", ".lightbox__close"]);
  
  gsap.timeline({ 
    defaults: { ease: "power3.inOut" },
    onComplete: () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  })
    .to(".lightbox__content", { scale: 0.85, y: 40, opacity: 0, duration: 0.4 })
    .to(".lightbox__close", { scale: 0.5, opacity: 0, duration: 0.3 }, 0)
    .to(lightbox, { opacity: 0, duration: 0.5 }, 0.1);
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}
