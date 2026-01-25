// ===============================
// script.js (FULL REPLACE)
// Mobile menu toggle + close on click + year
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.getElementById("site-nav");

  if (menuBtn && nav) {
    const closeMenu = () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    };

    const openMenu = () => {
      nav.classList.add("open");
      menuBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
    };

    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = nav.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });

    // Close menu when a link is clicked
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    // Close menu if user taps outside nav (mobile)
    document.addEventListener("click", (e) => {
      const clickedInside = nav.contains(e.target) || menuBtn.contains(e.target);
      if (!clickedInside && nav.classList.contains("open")) closeMenu();
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Services page tabs (if present)
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-content");

  if (tabs.length && panels.length) {
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-tab");

        tabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });

        panels.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const panel = document.getElementById(targetId);
        if (panel) panel.classList.add("active");
      });
    });
  }
});