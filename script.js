/* ========= CONFIG ========= */
/* Your Cloud Run base URL */
const BOOKING_API_BASE = "https://h2h-booking-api-198737903207.us-east1.run.app";

/* This endpoint path must match your backend route.
   If your backend uses a different path, change it here. */
const BOOKING_API_PATH = "/send"; // common choice
const BOOKING_API_URL = `${BOOKING_API_BASE}${BOOKING_API_PATH}`;

/* If your backend requires an API key header, put it here.
   NOTE: Any API key in frontend code is visible to the public.
   If possible, remove API key requirement and rely on CORS + rate limits instead. */
// const PUBLIC_API_KEY = ""; // example: "h2h_...."


/* ========= HEADER: mobile menu ========= */
function setupMobileMenu() {
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("site-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after clicking a link (mobile convenience)
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    if (window.matchMedia("(max-width: 820px)").matches) {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}


/* ========= SERVICES: tabs ========= */
function setupTabs() {
  const tablist = document.querySelector(".tabs[role='tablist']");
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll(".tab[role='tab']"));
  const panels = tabs
    .map((t) => document.getElementById(t.getAttribute("aria-controls")))
    .filter(Boolean);

  function activateTab(nextTab) {
    tabs.forEach((t) => {
      const selected = t === nextTab;
      t.classList.toggle("active", selected);
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((p) => p.classList.remove("active"));
    const nextPanel = document.getElementById(nextTab.getAttribute("aria-controls"));
    if (nextPanel) nextPanel.classList.add("active");
  }

  // Click to activate
  tablist.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab[role='tab']");
    if (!btn) return;
    activateTab(btn);
  });

  // Keyboard support (arrow keys)
  tablist.addEventListener("keydown", (e) => {
    const currentIndex = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    if (currentIndex < 0) return;

    let nextIndex = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;

    if (nextIndex !== null) {
      e.preventDefault();
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    }
  });
}


/* ========= CONTACT: booking form submit ========= */
function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const statusEl = document.getElementById("bookingStatus");
  const submitBtn = document.getElementById("bookingSubmitBtn");

  function setStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.fontWeight = "700";
    statusEl.style.color = ok ? "inherit" : "crimson";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      times: String(fd.get("times") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      page: window.location.href,
      userAgent: navigator.userAgent
    };

    // Basic validation
    if (!payload.name) return setStatus("Please enter your full name.", false);
    if (!payload.email || !payload.email.includes("@")) return setStatus("Please enter a valid email.", false);

    // UI lock
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.85";
    }
    setStatus("Sending your request…");

    try {
      const headers = { "Content-Type": "application/json" };
      // If you're using a PUBLIC key header (not ideal), uncomment:
      // if (PUBLIC_API_KEY) headers["x-api-key"] = PUBLIC_API_KEY;

      const res = await fetch(BOOKING_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      // Helpful error text
      let text = "";
      try { text = await res.text(); } catch {}

      if (!res.ok) {
        // Common issue: backend path mismatch or CORS blocked
        setStatus(
          `Could not send right now (${res.status}). ${text ? text : "Please try again or email us directly."}`,
          false
        );
        return;
      }

      setStatus("Sent! We received your booking request.");
      form.reset();
    } catch (err) {
      setStatus("Network error sending request. Please try again or email us directly.", false);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    }
  });
}


/* ========= FOOTER YEAR ========= */
function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}


/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupTabs();
  setupBookingForm();
  setYear();
});


