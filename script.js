// script.js

(function () {
  "use strict";

  // ===== Footer year =====
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===== Mobile menu toggle =====
  const menuBtn = document.querySelector(".menu-btn");
  const siteNav = document.getElementById("site-nav");

  if (menuBtn && siteNav) {
    const closeMenu = () => {
      siteNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking a nav link (mobile)
    siteNav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      // Only close on small screens
      if (window.matchMedia("(max-width: 820px)").matches) closeMenu();
    });

    // Close menu if you resize to desktop
    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 820px)").matches) {
        closeMenu();
      }
    });

    // Close menu if clicking outside (mobile)
    document.addEventListener("click", (e) => {
      if (!window.matchMedia("(max-width: 820px)").matches) return;
      const clickedInsideHeader = e.target.closest(".site-header");
      if (!clickedInsideHeader) closeMenu();
    });
  }

  // ===== Tabs (Services page) =====
  // Expected:
  // - buttons: .tab with data-tab="panel-id"
  // - panels:  .tab-content#panel-id
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".tab-content"));

  if (tabs.length && panels.length) {
    const setActiveTab = (tabBtn) => {
      const targetId = tabBtn.getAttribute("data-tab");
      if (!targetId) return;

      // Update tabs
      tabs.forEach((t) => {
        const isActive = t === tabBtn;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", String(isActive));
        t.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      // Update panels
      panels.forEach((p) => {
        const isActive = p.id === targetId;
        p.classList.toggle("active", isActive);
        p.hidden = !isActive;
      });
    };

    // Ensure panels are hidden properly on load
    panels.forEach((p) => {
      p.hidden = !p.classList.contains("active");
    });

    // Click activation
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => setActiveTab(tab));

      // Keyboard support: ArrowLeft/ArrowRight/Home/End
      tab.addEventListener("keydown", (e) => {
        const i = tabs.indexOf(tab);
        if (i === -1) return;

        let nextIndex = null;

        if (e.key === "ArrowRight") nextIndex = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") nextIndex = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") nextIndex = 0;
        if (e.key === "End") nextIndex = tabs.length - 1;

        if (nextIndex !== null) {
          e.preventDefault();
          tabs[nextIndex].focus();
          setActiveTab(tabs[nextIndex]);
        }
      });
    });

    // If no active tab is marked, force the first
    const activeTab = tabs.find((t) => t.classList.contains("active")) || tabs[0];
    setActiveTab(activeTab);
  }
})();
