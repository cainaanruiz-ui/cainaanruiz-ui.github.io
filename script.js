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

// Close mobile nav when a link is clicked
if (nav) {
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}


// Tabs (Services page)
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-content");

function activateTab(tab) {
  tabs.forEach((t) => {
    t.classList.remove("active");
    t.setAttribute("aria-selected", "false");
  });
  panels.forEach((p) => p.classList.remove("active"));

  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");

  const id = tab.dataset.tab;
  const panel = document.getElementById(id);
  if (panel) panel.classList.add("active");
}

if (tabs.length && panels.length) {
  tabs.forEach((tab) => {
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
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const times = String(formData.get("times") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const to = "Luis@happy2helpcounseling.org";

    // Keep it short to avoid mailto URL length issues
    const subject = encodeURIComponent("Therapy booking request");
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Preferred days/times: ${times || "N/A"}`,
      "",
      "Message:",
      (message || "(No message provided)").slice(0, 1200) // prevent super long drafts from breaking
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));

    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;

    // Try to open the email draft
    window.location.href = mailtoUrl;

    // Fallback: if device blocks mailto, show a helpful message
    setTimeout(() => {
      // If nothing happened, user will still be on the page
      alert(
        "If your email app didn’t open, please email us directly at Luis@happy2helpcounseling.org or call (404) 692-3539."
      );
    }, 800);
  });
}


