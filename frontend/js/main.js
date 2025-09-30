// API Base URL
const API_URL = "http://localhost:5000/api";

// Load packages on homepage
async function loadPackages() {
  try {
    const response = await fetch(`${API_URL}/topup/packages`);
    const data = await response.json();

    if (data.success) {
      displayPackages(data.packages);
    }
  } catch (error) {
    console.error("Error loading packages:", error);
  }
}

function displayPackages(packages) {
  const grid = document.getElementById("packagesGrid");
  if (!grid) return;

  grid.innerHTML = packages
    .map(
      (pkg, index) => `
    <div class="package-card">
      <div class="package-icon">💎</div>
      <div class="package-diamonds">${pkg.diamonds} Diamonds</div>
      ${
        pkg.bonus > 0
          ? `<div class="package-bonus">+${pkg.bonus} Bonus</div>`
          : ""
      }
      <div class="package-price">৳${pkg.price}</div>
      <a href="pages/login.html" class="btn btn-primary">Buy Now</a>
    </div>
  `
    )
    .join("");
}

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Load packages if on homepage
  loadPackages();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});

// Utility functions
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    background: ${
      type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#ffc107"
    };
    color: white;
    border-radius: 5px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function getToken() {
  return localStorage.getItem("token");
}

function isAuthenticated() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}
