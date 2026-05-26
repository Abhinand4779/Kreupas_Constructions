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
    .from(".site-header", { y: -24, opacity: 0, duration: .9 })
    .from(".hero__media", { scale: 1.18, duration: 1.8 }, 0)
    .from(".hero .split-line > span", {
      yPercent: 112,
      duration: 1.25,
      stagger: .045
    }, .2)
    .from(".hero__bottom", { y: 28, opacity: 0, duration: .9 }, .85)
    .from(".hero__stats span", { y: 22, opacity: 0, duration: .8, stagger: .08 }, 1);

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
      clipPath: "inset(14% 0% 14% 0%)",
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