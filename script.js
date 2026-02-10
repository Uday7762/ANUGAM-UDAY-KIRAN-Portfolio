// ================= Navigation and Scrolling =================
const navButtons = document.querySelectorAll(".nav-btn");
const scrollTargets = document.querySelectorAll("[data-scroll]");
const brand = document.querySelector(".brand");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

// Prevent browser from restoring previous scroll position
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// NO SCROLL PREVENTION - Let sections scroll naturally!

function goToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  // close mobile menu if open
  if (navMenu.classList.contains("mobile")) {
    navMenu.classList.remove("mobile");
  }

  // Hide all sections first
  const allSections = document.querySelectorAll(".section");
  allSections.forEach((section) => {
    section.style.display = "none";
  });

  // Show the target section
  el.style.display = "flex";

  // Reset scroll to the top for the newly shown section
  el.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  // Trigger animations for visible elements in the newly shown section
  setTimeout(() => {
    triggerVisibleAnimations(el);
  }, 50);

  setActiveSection(id);
}

function triggerVisibleAnimations(section) {
  // Add .show class to all reveal, exp-item, and timeline items in the section
  // so they animate in when they come into view as you scroll
  const revealElements = section.querySelectorAll(".reveal-up, .reveal-corner");
  const expItems = section.querySelectorAll(".exp-item");
  const timelineItems = section.querySelectorAll(".timeline-item");

  revealElements.forEach((el) => el.classList.add("show"));
  expItems.forEach((el) => el.classList.add("show"));
  timelineItems.forEach((el) => el.classList.add("show"));
}

// Menu click scroll
scrollTargets.forEach((el) => {
  el.addEventListener("click", () => {
    const id = el.dataset.scroll;
    if (id) goToSection(id);
  });
});

// Clicking brand always returns to Welcome
brand.addEventListener("click", () => {
  goToSection("welcome");
});

brand.addEventListener("keydown", (e) => {
  if (e.key === "Enter") goToSection("welcome");
});

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("mobile");
});

// ================= Set welcome as active by default =================
function setActiveSection(id) {
  navButtons.forEach((b) => b.classList.remove("active"));
  navButtons.forEach((b) => {
    if (b.dataset.scroll === id) b.classList.add("active");
  });
}

// Set welcome as active on page load
setActiveSection("welcome");

// Ensure we always start at Welcome when the page loads
window.addEventListener("DOMContentLoaded", () => {
  // Remove hash without causing a jump
  if (window.location.hash) {
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }

  // Hide all sections except welcome
  const allSections = document.querySelectorAll(".section");
  allSections.forEach((section) => {
    if (section.id !== "welcome") {
      section.style.display = "none";
    }
  });
});

// Only update active section when menu is clicked
scrollTargets.forEach((el) => {
  el.addEventListener("click", () => {
    setActiveSection(el.dataset.scroll);
  });
});

// ================= Reveal animations =================
function setupSectionObservers(section) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    },
    { threshold: 0.22, root: section },
  );

  const expObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    },
    { threshold: 0.3, root: section },
  );

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    },
    { threshold: 0.25, root: section },
  );

  const revealUp = section.querySelectorAll(".reveal-up");
  const revealCorner = section.querySelectorAll(".reveal-corner");
  const expItems = section.querySelectorAll(".exp-item");
  const eduTimeline = section.querySelector(".timeline.edu");
  const timelineItems = eduTimeline
    ? eduTimeline.querySelectorAll(".timeline-item")
    : [];

  revealUp.forEach((el) => revealObserver.observe(el));
  revealCorner.forEach((el) => revealObserver.observe(el));
  expItems.forEach((el) => expObserver.observe(el));
  timelineItems.forEach((el) => timelineObserver.observe(el));
}

const allSections = document.querySelectorAll(".section");
allSections.forEach((section) => setupSectionObservers(section));

// ================= Certifications: click logo -> show modal with images =================
const allLogoButtons = document.querySelectorAll(".logo-btn");
const certModal = document.getElementById("certModal");
const certModalOverlay = document.getElementById("certModalOverlay");
const certModalClose = document.getElementById("certModalClose");
const certModalTitle = document.getElementById("certModalTitle");
const certImagesContainer = document.getElementById("certImagesContainer");

// Certificate image placeholders (user will add actual images later)
const CERT_IMAGES = {
  udemy: [
    { name: "DSA Python", image: "DSA udemy.png" },
    { name: "Android App Development", image: "Android app udemy.png" },
    { name: "Excel", image: "Excel udemy.png" },
    { name: "Auto Cad 2D", image: "AutoCad udemy.png" },
    { name: "Java", image: "java udemy/java udemy.png" },
    { name: "Python", image: "python.png" },
  ],
  microsoft: [
    { name: "Microsoft Azure AI Fundamentals", image: "microsoft .png" },
  ],
  oracle: [
    {
      name: "Oracle Cloud Infrastructure Certified Generative AI Professional",
      image: "oracle generative ai.png",
    },
    {
      name: "Oracle Cloud Infrastructure Certified AI Foundations Associate",
      image: "oracle ai.png",
    },
  ],
};

const TITLE_MAP = {
  udemy: "Udemy Certifications",
  microsoft: "Microsoft Certifications",
  oracle: "Oracle Certifications",
};

function openCertModal(provider) {
  // Set title
  certModalTitle.textContent = TITLE_MAP[provider] || "Certifications";

  // Clear and populate images
  certImagesContainer.innerHTML = "";
  const certs = CERT_IMAGES[provider] || [];

  certs.forEach((cert) => {
    const certDiv = document.createElement("div");
    certDiv.className = "cert-image";

    if (cert.image) {
      const img = document.createElement("img");
      img.src = cert.image;
      img.alt = cert.name;
      certDiv.appendChild(img);
    } else {
      // Placeholder text
      certDiv.innerHTML = `<div style="text-align: center;"><p>${cert.name}</p><p style="color: var(--blue); margin-top: 10px; font-size: 12px;">📸 Certificate image to be added</p></div>`;
    }

    certImagesContainer.appendChild(certDiv);
  });

  // Show modal
  certModal.classList.remove("hidden");
}

function closeCertModal() {
  certModal.classList.add("hidden");
}

// Event listeners
allLogoButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    openCertModal(btn.dataset.provider);
  });
});

certModalClose.addEventListener("click", closeCertModal);
certModalOverlay.addEventListener("click", closeCertModal);

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !certModal.classList.contains("hidden")) {
    closeCertModal();
  }
});

// ================= Contact Form Validation and Submission =================
const contactForm = document.querySelector(".contact-form");
const sendButton = document.querySelector(".btn-send-message");

if (contactForm && sendButton) {
  sendButton.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get form inputs
    const nameInput = contactForm.querySelector('input[type="text"]');
    const emailInput = contactForm.querySelector('input[type="email"]');
    const phoneInput = contactForm.querySelector('input[type="tel"]');
    const messageInput = contactForm.querySelector("textarea");

    // Get values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // Remove previous error messages
    document.querySelectorAll(".form-error").forEach((el) => el.remove());

    let isValid = true;

    // Validate Name
    if (!name) {
      showError(nameInput, "Please fill in your name");
      isValid = false;
    }

    // Validate Email
    if (!email) {
      showError(emailInput, "Please fill in your email");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError(emailInput, "Please enter a valid email");
      isValid = false;
    }

    // Validate Phone
    if (!phone) {
      showError(phoneInput, "Please fill in your mobile number");
      isValid = false;
    }

    // Validate Message
    if (!message) {
      showError(messageInput, "Please write your message");
      isValid = false;
    }

    // If all valid, send email
    if (isValid) {
      sendEmail(name, email, phone, message);
    }
  });

  function showError(inputElement, errorMessage) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "form-error";
    errorDiv.textContent = errorMessage;
    errorDiv.style.cssText = `
      color: #ff6b6b;
      font-size: 13px;
      margin-top: -12px;
      margin-bottom: 8px;
      font-weight: 500;
    `;
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
    inputElement.style.borderColor = "#ff6b6b";
    inputElement.style.boxShadow = "0 0 0 2px rgba(255, 107, 107, 0.2)";
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function sendEmail(name, email, phone, message) {
    try {
      // Using FormSubmit.co service (free and no backend needed)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("message", message);

      const response = await fetch(
        "https://formsubmit.co/anugamudaykiran@gmail.com",
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        // Show success message
        showSuccessMessage();
        // Clear form
        contactForm.reset();
      } else {
        showNotification("Error sending message. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error sending message. Please try again.", "error");
    }
  }

  function showSuccessMessage() {
    const successDiv = document.createElement("div");
    successDiv.className = "form-success";
    successDiv.textContent =
      "✓ Message sent successfully! Thank you for contacting me.";
    successDiv.style.cssText = `
      background: #10b981;
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-weight: 600;
      animation: slideDown 0.3s ease;
    `;
    contactForm.insertBefore(successDiv, contactForm.firstChild);

    // Remove success message after 5 seconds
    setTimeout(() => {
      successDiv.style.animation = "slideUp 0.3s ease";
      setTimeout(() => successDiv.remove(), 300);
    }, 5000);
  }

  function showNotification(message, type) {
    const notificationDiv = document.createElement("div");
    notificationDiv.className = `form-notification form-${type}`;
    notificationDiv.textContent = message;
    const bgColor = type === "error" ? "#ef4444" : "#3b82f6";
    notificationDiv.style.cssText = `
      background: ${bgColor};
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-weight: 600;
    `;
    contactForm.insertBefore(notificationDiv, contactForm.firstChild);

    setTimeout(() => notificationDiv.remove(), 5000);
  }
}
