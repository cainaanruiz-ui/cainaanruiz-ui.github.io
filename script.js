// Year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.querySelector(".menu-btn");
const siteNav = document.getElementById("site-nav");

if (menuBtn && siteNav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

// Tabs (Services page)
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-content");

if (tabs.length && panels.length) {
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;

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
