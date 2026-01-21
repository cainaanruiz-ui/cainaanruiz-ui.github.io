// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("site-nav");

function closeMenu() {
  if (!nav || !menuBtn) return;
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  if (!nav || !menuBtn) return;
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
}

if (menuBtn && nav) {
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Close menu when a link is clicked (mobile friendly)
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeMenu();
  });

  // Close menu if you tap outside of it (mobile friendly)
  document.addEventListener("click", (e) => {
    const clickedInsideHeader = e.target.closest(".site-header");
    if (!clickedInsideHeader) closeMenu();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

// Tabs (Services page)
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-content");

function activateTab(tab) {
  tabs.forEach(t => {
    t.classList.remove("active");
    t.setAttribute("aria-selected", "false");
  });
  panels.forEach(p => p.classList.remove("active"));

  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");

  const id = tab.dataset.tab;
  const panel = document.getElementById(id);
  if (panel) panel.classList.add("active");
}

if (tabs.length && panels.length) {
  tabs.forEach(tab => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (e) => {
      const index = Array.from(tabs).indexOf(tab);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = tabs[(index + 1) % tabs.length];
        next.focus();
        activateTab(next);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = tabs[(index - 1 + tabs.length) % tabs.length];
        prev.focus();
        activateTab(prev);
      }
    });
  });
}

