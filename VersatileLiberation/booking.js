/* booking.js
   Adds validation and builds a WhatsApp booking URL from the form on book.html.
   Expected form field IDs: name, phone, service, message.
*/
(function () {
  const BUSINESS_NUMBER = "27812424113"; // without "+" or non-digits for wa.me

  function $(id) { return document.getElementById(id); }

  const form = $("bookingForm");
  if (!form) return; // only run on pages with the booking form

  const feedback = $("bookingFeedback");
  const submitBtn = $("submitBtn");

  function validateForm(name, phone, service) {
    if (!name || !phone || !service) {
      return "Please fill in your name, phone and select a service.";
    }
    const phonePattern = /^\+?\d{9,15}$/;
    if (!phonePattern.test(phone.replace(/\s+/g, ""))) {
      return "Please enter a valid phone number including country code (e.g. +27...).";
    }
    return "";
  }

  function buildWhatsAppUrl(name, phone, service, message) {
    const text = [
      "Booking Request",
      "Name: " + name,
      "Phone: " + phone,
      "Service: " + service,
      message ? ("Message: " + message) : ""
    ].filter(Boolean).join("\n");
    const encoded = encodeURIComponent(text);
    return "https://wa.me/" + BUSINESS_NUMBER + "?text=" + encoded;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!submitBtn) return;
    submitBtn.disabled = true;
    submitBtn.textContent = "Preparing...";

    const name = ($("name") && $("name").value || "").trim();
    const phone = ($("phone") && $("phone").value || "").trim();
    const service = ($("service") && $("service").value || "").trim();
    const message = ($("message") && $("message").value || "").trim();

    const err = validateForm(name, phone, service);
    if (err) {
      if (feedback) feedback.textContent = err;
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Booking via WhatsApp";
      return;
    }

    const url = buildWhatsAppUrl(name, phone, service, message);

    // Try to open WhatsApp in a new tab/window. If blocked, navigate in same tab.
    const newWindow = window.open(url, "_blank");
    if (!newWindow) {
      window.location.href = url;
    }

    if (feedback) feedback.textContent = "WhatsApp should open. If it didn't, copy this link: " + url;
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Booking via WhatsApp";
  });
})();