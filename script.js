// Set footer year
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

  // Close mobile nav when a link is clicked
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
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
const bookingStatus = document.getElementById("bookingStatus"); // optional element on page
let mailtoAttempted = false;

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const times = String(formData.get("times") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const to = "Luis@happy2helpcounseling.org";

    const subject = encodeURIComponent("Therapy booking request");

    // Keep the body reasonable length so mailto doesn't fail on some devices
    const safeMessage = (message || "(No message provided)").slice(0, 1200);

    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Preferred days/times: ${times || "N/A"}`,
      "",
      "Message:",
      safeMessage
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));

    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;

    mailtoAttempted = true;

    // Try to open the user's email client
    window.location.href = mailtoUrl;

    // Optional: show a gentle note on the page (no popups)
    if (bookingStatus) {
      bookingStatus.textContent =
        "An email draft should open in your email app. If it doesn’t, please email us directly at Luis@happy2helpcounseling.org.";
    }
  });
}

// Optional smarter fallback: if user comes back to the page after attempting mailto,
// remind them (without scaring them) how to contact.
document.addEventListener("visibilitychange", () => {
  if (!bookingStatus) return;
  if (document.visibilityState === "visible" && mailtoAttempted) {
    bookingStatus.textContent =
      "If your email app didn’t open, you can email us directly at Luis@happy2helpcounseling.org or call (404) 692-3539.";
  }
});


// Booking form submit (Formspree) - works on desktop + mobile
const bookingForm = document.getElementById("bookingForm");
const statusEl = document.getElementById("formStatus");

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    // Let normal submit happen if fetch fails
    e.preventDefault();

    if (statusEl) {
      statusEl.textContent = "Sending…";
    }

    try {
      const formData = new FormData(bookingForm);
      const response = await fetch(bookingForm.action, {
        method: bookingForm.method,
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        bookingForm.reset();
        if (statusEl) {
          statusEl.textContent = "✅ Sent! We’ll respond as soon as possible.";
        }
      } else {
        if (statusEl) {
          statusEl.textContent =
            "Something went wrong. Please email us directly at Luis@happy2helpcounseling.org.";
        }
      }
    } catch (err) {
      if (statusEl) {
        statusEl.textContent =
          "Network issue. Please email us directly at Luis@happy2helpcounseling.org.";
      }
    }
  });
}

