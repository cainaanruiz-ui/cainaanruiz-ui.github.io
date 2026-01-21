// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("site-nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after clicking a nav link (mobile)
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
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
  });
}

