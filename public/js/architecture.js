const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = window.gsap && window.ScrollTrigger && !prefersReducedMotion;

document.body.classList.add("is-loading");

function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle("active");
    nav.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", nav.classList.contains("active"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", false);
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-header")) {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", false);
    }
  });
}

function splitText() {
  document.querySelectorAll(".split-text").forEach((element) => {
    const text = element.textContent.trim();
    const words = text.split(" ");
    element.textContent = "";
    words.forEach((word, index) => {
      const line = document.createElement("span");
      const inner = document.createElement("span");
      line.className = "split-line";
      inner.textContent = word;
      line.appendChild(inner);
      element.appendChild(line);
    });
  });
}

function initFallback() {
  document.body.classList.remove("is-loading");
  document.querySelectorAll("[data-animate], .split-text").forEach((element) => {
    element.style.opacity = "1";
  });
}

function initGsap() {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap-ready");
  splitText();
  initMobileMenu();

  const loader = gsap.timeline({
    defaults: { ease: "power4.out" },
    onComplete: () => document.body.classList.remove("is-loading")
  });

  loader
    .from(".site-header", { y: -28, opacity: 0, duration: .9 })
    .from(".nav a", { y: -20, opacity: 0, duration: .85, stagger: .05, ease: "power3.out" }, .1)
    .from(".header-cta", { y: -16, opacity: 0, duration: .85, ease: "power3.out" }, .15)
    .from(".hero__media img", { scale: 1.24, yPercent: 12, duration: 1.95 }, 0)
    .from(".ticker__track span", { opacity: 0, y: 22, duration: 1.05, stagger: .05, ease: "power3.out" }, .15)
    .from(".hero .split-line > span", {
      yPercent: 112,
      duration: 1.2,
      stagger: .045
    }, .25)
    .from(".hero__bottom", { y: 36, opacity: 0, duration: .85 }, .75)
    .from(".hero__stats span", { y: 22, opacity: 0, duration: .75, stagger: .08 }, .95);

  gsap.to(".progress", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: .2
    }
  });

  document.querySelectorAll("[data-parallax]").forEach((element) => {
    gsap.to(element.querySelector("img") || element, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  gsap.to(".hero__media img", {
    scale: 1.16,
    yPercent: -8,
    duration: 16,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(".statement__image img", {
    scale: 1.14,
    yPercent: 8,
    duration: 18,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(".ticker__track", {
    skewX: 1.2,
    duration: 12,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  document.querySelectorAll(".split-text:not(.hero__title):not(.eyebrow)").forEach((element) => {
    gsap.from(element.querySelectorAll(".split-line > span"), {
      yPercent: 108,
      duration: .95,
      stagger: .025,
      ease: "power4.out",
      scrollTrigger: {
        trigger: element,
        start: "top 82%"
      }
    });
  });

  gsap.utils.toArray(".section__kicker").forEach((element) => {
    gsap.from(element, {
      x: -24,
      opacity: 0,
      duration: .9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 92%"
      }
    });
  });

  gsap.utils.toArray("[data-animate='fade-up']").forEach((element) => {
    gsap.from(element, {
      y: 38,
      opacity: 0,
      duration: .9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 86%"
      }
    });
  });

  gsap.utils.toArray("[data-animate='project']").forEach((card) => {
    gsap.from(card, {
      y: 74,
      scale: .98,
      rotateX: 3,
      opacity: 0,
      duration: 1.05,
      ease: "power4.out",
      scrollTrigger: {
        trigger: card,
        start: "top 86%"
      }
    });
  });

  gsap.to(".statement__copy", {
    yPercent: -8,
    ease: "none",
    scrollTrigger: {
      trigger: ".statement",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.utils.toArray(".footer span, .footer a").forEach((item) => {
    gsap.from(item, {
      y: 22,
      opacity: 0,
      duration: .75,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".footer",
        start: "top 98%"
      }
    });
  });

  gsap.utils.toArray(".service-list article").forEach((card) => {
    gsap.from(card, {
      y: 46,
      opacity: 0,
      duration: 1.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 92%"
      }
    });
  });

  gsap.utils.toArray(".timeline article").forEach((item) => {
    gsap.from(item, {
      y: 42,
      opacity: 0,
      duration: .95,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 92%"
      }
    });
  });

  gsap.from(".contact__panel", {
    y: 36,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".contact__panel",
      start: "top 92%"
    }
  });

  initCursor();
  initMagnetic();
  initTiltCards();
}

function initCursor() {
  const cursor = document.querySelector(".cursor");
  if (!cursor || window.innerWidth < 768) return;

  const quickX = gsap.quickTo(cursor, "x", { duration: .22, ease: "power3.out" });
  const quickY = gsap.quickTo(cursor, "y", { duration: .22, ease: "power3.out" });

  window.addEventListener("mousemove", (event) => {
    quickX(event.clientX);
    quickY(event.clientY);
  });

  document.querySelectorAll("a, .project-card").forEach((element) => {
    element.addEventListener("mouseenter", () => gsap.to(cursor, { scale: 2.2, duration: .25 }));
    element.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 1, duration: .25 }));
  });
}

function initMagnetic() {
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(element, { x: x * .18, y: y * .18, duration: .35, ease: "power3.out" });
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(element, { x: 0, y: 0, duration: .45, ease: "elastic.out(1, .42)" });
    });
  });
}

function initTiltCards() {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      gsap.to(card, {
        rotateY: x * 4,
        rotateX: y * -4,
        transformPerspective: 900,
        duration: .45,
        ease: "power3.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: .6, ease: "power3.out" });
    });
  });
}

window.addEventListener("load", () => {
  initMobileMenu();
  if (hasGsap) {
    initGsap();
  } else {
    initFallback();
  }
});