const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const bookingForm = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const bookingEmail = "djnightwolfawoo@aol.com";

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });
}

if (bookingForm && formStatus) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const name = String(formData.get("name") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const eventType = String(formData.get("event") || "").trim();
    const details = String(formData.get("details") || "").trim();
    const subject = `Booking request from ${name || "DJ Nightwolfawoo website"}`;
    const body = [
      "New DJ Nightwolfawoo booking request",
      "",
      `Name: ${name || "Not provided"}`,
      `Event date: ${date || "Not provided"}`,
      `Event type: ${eventType || "Not provided"}`,
      "",
      "Details:",
      details || "Not provided",
    ].join("\n");
    const mailto = `mailto:${bookingEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.textContent = `Opening an email to ${bookingEmail}.`;
    window.location.href = mailto;
    bookingForm.reset();
  });
}
