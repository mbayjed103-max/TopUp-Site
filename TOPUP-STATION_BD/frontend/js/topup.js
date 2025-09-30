// API Base URL
const API_URL = "http://localhost:5000/api";

// Check authentication
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Load user info and packages
async function loadTopUpPage() {
  if (!checkAuth()) return;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  document.getElementById("userName").textContent = user.username || "User";

  try {
    // Load wallet balance
    const walletRes = await fetch(`${API_URL}/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const walletData = await walletRes.json();
    if (walletData.success) {
      document.getElementById("walletBalance").textContent = walletData.balance;
    }

    // Load packages
    const packagesRes = await fetch(`${API_URL}/topup/packages`);
    const packagesData = await packagesRes.json();
    if (packagesData.success) {
      displayPackages(packagesData.packages);
    }
  } catch (error) {
    console.error("Error loading page:", error);
    showNotification("Error loading data", "error");
  }
}

// Display packages
function displayPackages(packages) {
  const grid = document.getElementById("packagesGrid");
  if (!grid) return;

  grid.innerHTML = packages
    .map(
      (pkg) => `
        <div class="package-card" data-package='${JSON.stringify(pkg)}'>
            <div class="package-icon">💎</div>
            <div class="package-diamonds">${pkg.diamonds} Diamonds</div>
            ${
              pkg.bonus > 0
                ? `<div class="package-bonus">+${pkg.bonus} Bonus</div>`
                : ""
            }
            <div class="package-price">৳${pkg.price}</div>
            <button class="btn btn-primary" onclick='selectPackage(${JSON.stringify(
              pkg
            )})'>Select Package</button>
        </div>
    `
    )
    .join("");
}

// Global variable for selected package
let selectedPackage = null;

// Select package
function selectPackage(pkg) {
  selectedPackage = pkg;
  document.getElementById(
    "selectedPackage"
  ).textContent = `${pkg.diamonds} Diamonds - ৳${pkg.price}`;
  document.getElementById("orderSummary").style.display = "block";

  // Scroll to order form
  document.getElementById("orderForm").scrollIntoView({ behavior: "smooth" });
}

// Handle order form submission
const topupForm = document.getElementById("topupForm");
if (topupForm) {
  topupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!selectedPackage) {
      showNotification("Please select a package first", "error");
      return;
    }

    const freeFireUID = document.getElementById("freeFireUID").value;
    const token = localStorage.getItem("token");
    const submitBtn = topupForm.querySelector(".btn-submit");

    // Validate UID
    if (!freeFireUID || freeFireUID.length < 8) {
      showNotification("Please enter a valid Free Fire UID", "error");
      return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    try {
      const response = await fetch(`${API_URL}/topup/purchase`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: selectedPackage._id,
          freeFireUID: freeFireUID,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification("Order placed successfully!", "success");

        // Reset form
        topupForm.reset();
        document.getElementById("orderSummary").style.display = "none";
        selectedPackage = null;

        // Reload balance
        setTimeout(() => {
          loadTopUpPage();
        }, 1500);
      } else {
        showNotification(data.message || "Order failed", "error");
      }
    } catch (error) {
      console.error("Order error:", error);
      showNotification("Connection error. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Place Order";
    }
  });
}

// Notification Helper
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
          type === "success"
            ? "#28a745"
            : type === "error"
            ? "#dc3545"
            : "#ffc107"
        };
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        font-weight: 600;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", loadTopUpPage);
