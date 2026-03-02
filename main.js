const root = document.documentElement;

window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--mx", `${event.clientX}px`);
  root.style.setProperty("--my", `${event.clientY}px`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const el = entry.target;
      const end = Number(el.dataset.count || "0");
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const value = Math.floor(end * eased);
        el.textContent = value >= 1000 ? value.toLocaleString() : String(value);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count]").forEach((counter) => statObserver.observe(counter));

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(opened));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const signupForm = document.getElementById("signup-form");
const signupMessage = document.getElementById("form-message");
const submitPopup = document.getElementById("submit-popup");
let popupTimer;

if (signupForm && signupMessage && submitPopup) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!signupForm.checkValidity()) {
      signupForm.reportValidity();
      return;
    }

    signupMessage.textContent = "Submitting...";

    try {
      const response = await fetch(signupForm.action, {
        method: "POST",
        body: new FormData(signupForm),
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        signupMessage.textContent = "";
        signupForm.reset();
        submitPopup.classList.add("show");
        clearTimeout(popupTimer);
        popupTimer = setTimeout(() => {
          submitPopup.classList.remove("show");
        }, 2600);
      } else {
        signupMessage.textContent = "Submission failed. Please try again.";
      }
    } catch (_error) {
      signupMessage.textContent = "Submission failed. Please try again.";
    }
  });
}

const magnets = document.querySelectorAll(".magnet");

magnets.forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "translate(0, 0)";
  });
});

const modal = document.getElementById("login-modal");
const loginTrigger = document.querySelector(".login-trigger");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const loginEmail = document.getElementById("login-email");

const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  loginTrigger.focus();
};

const openModal = () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  loginEmail.focus();
};

if (modal && loginTrigger && loginForm && loginMessage && loginEmail) {
  loginTrigger.addEventListener("click", openModal);

  modal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!loginForm.checkValidity()) {
      loginMessage.textContent = "Please enter a valid email and password.";
      return;
    }

    loginMessage.textContent = "Login successful. Redirecting to dashboard...";
  });
}
