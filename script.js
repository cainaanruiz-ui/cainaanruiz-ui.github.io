// Set footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("site-nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
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

// Email booking (Contact page) - opens an email draft
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const times = (formData.get("times") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    // IMPORTANT: change this to your real booking email
    const to = "Luis@happy2helpcounseling.org";

    const subject = encodeURIComponent("Therapy booking request");
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Preferred times: ${times || "N/A"}`,
      "",
      "Message:",
      message || "(No message provided)"
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
