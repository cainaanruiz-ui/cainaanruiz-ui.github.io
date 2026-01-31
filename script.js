// ===== Helpers =====
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

// ===== Footer year =====
(function setYear() {
  const y = qs("#year");
  if (y) y.textContent = new Date().getFullYear();
})();

// ===== Mobile menu toggle =====
(function mobileMenu() {
  const btn = qs(".menu-btn");
  const nav = qs("#site-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after clicking a link (mobile)
  qsa("#site-nav a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 820px)").matches) {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });
})();

// ===== Tabs (Services page) =====
(function tabs() {
  const tabs = qsa(".tab");
  const panels = qsa(".tab-content");
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");
      if (!targetId) return;

      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });

      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const panel = qs("#" + targetId);
      if (panel) panel.classList.add("active");
    });
  });
})();

// ===== Booking form (Contact page) =====
(function bookingForm() {
  const form = qs("#bookingForm");
  const statusEl = qs("#formStatus");
  if (!form) return;

  const CLOUD_RUN_SEND_URL = "https://h2h-booking-api-198737903207.us-east1.run.app/send";
  const API_KEY = "h2h_9f3k2mQp8xD1";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (statusEl) statusEl.textContent = "Sending…";

    const formData = new FormData(form);
    const payload = {
      name: (formData.get("name") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      times: (formData.get("times") || "").toString().trim(),
      message: (formData.get("message") || "").toString().trim(),
    };

    try {
      const res = await fetch(CLOUD_RUN_SEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || `Request failed (${res.status})`);
      }

      if (statusEl) statusEl.textContent = "Sent! We’ll follow up as soon as possible.";
      form.reset();
    } catch (err) {
      console.error(err);
      if (statusEl) statusEl.textContent =
        "Something blocked the request. If it keeps happening, please email Luis@happy2helpcounseling.org.";
    }
  });
})();



