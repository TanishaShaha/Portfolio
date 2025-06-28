document.addEventListener("DOMContentLoaded", function () {
  // --- Nav active link update on scroll ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a.nav-link");

  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 60;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });

    // Toggle scroll-to-top button visibility
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
      scrollTopBtn.style.display = scrollY > 400 ? "block" : "none";

      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });

  // Contact form submission to open Gmail compose
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("emailAddress").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=shaha.tanisha@gmail.com&su=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent("From: " + email + "\n\n" + message)}`;

      window.open(mailtoLink, "_blank");
    });
  }
});
