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
      if (window.matchMedia("(max-width: 820px)").matches) closeMenu();
    });

    // Close menu if you resize to desktop
    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 820px)").matches) closeMenu();
    });

    // Close menu if clicking outside (mobile)
    document.addEventListener("click", (e) => {
      if (!window.matchMedia("(max-width: 820px)").matches) return;
      const clickedInsideHeader = e.target.closest(".site-header");
      if (!clickedInsideHeader) closeMenu();
    });
  }

  // ===== Tabs (Services page) =====
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".tab-content"));

  if (tabs.length && panels.length) {
    const setActiveTab = (tabBtn) => {
      const targetId = tabBtn.getAttribute("data-tab");
      if (!targetId) return;

      tabs.forEach((t) => {
        const isActive = t === tabBtn;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", String(isActive));
        t.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      panels.forEach((p) => {
        const isActive = p.id === targetId;
        p.classList.toggle("active", isActive);
        p.hidden = !isActive;
      });
    };

    // Normalize on load
    panels.forEach((p) => (p.hidden = !p.classList.contains("active")));

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => setActiveTab(tab));

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

    const activeTab = tabs.find((t) => t.classList.contains("active")) || tabs[0];
    setActiveTab(activeTab);
  }

  // ===== Booking form submit -> Cloud Run =====
  const bookingForm = document.getElementById("bookingForm");
  const bookingStatus = document.getElementById("bookingStatus");

  // IMPORTANT:
  // Replace this URL AFTER you deploy Cloud Run.
  // It will look like: https://your-service-xxxxx-uc.a.run.app/booking
  const BOOKING_ENDPOINT = "https://REPLACE-WITH-YOUR-CLOUD-RUN-URL/booking";

  if (bookingForm && bookingStatus) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      bookingStatus.textContent = "Sending…";

      const formData = new FormData(bookingForm);
      const payload = Object.fromEntries(formData.entries());

      // Basic validation
      if (!payload.name || !payload.email || !payload.message) {
        bookingStatus.textContent = "Please fill in your name, email, and message.";
        return;
      }

      try {
        const res = await fetch(BOOKING_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(msg || "Request failed.");
        }

        bookingForm.reset();
        bookingStatus.textContent = "Sent! We’ll be in touch soon.";
      } catch (err) {
        console.error(err);
        bookingStatus.textContent =
          "Something went wrong sending the request. Please call (404) 692-3539 or email Luis@happy2helpcounseling.org.";
      }
    });
  }
})();

