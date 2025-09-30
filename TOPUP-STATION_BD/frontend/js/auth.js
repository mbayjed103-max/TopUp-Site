// API Base URL
const API_URL = "http://localhost:5000/api";

// Login Form Handler
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const submitBtn = loginForm.querySelector(".btn-submit");

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showNotification("Login successful! Redirecting...", "success");

        // Redirect based on user role
        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "dashboard.html";
          }
        }, 1000);
      } else {
        showNotification(data.message || "Login failed", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Login";
      }
    } catch (error) {
      console.error("Login error:", error);
      showNotification("Connection error. Please try again.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  });
}

// Register Form Handler
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  const phoneInput = document.getElementById("phoneNumber");
  const phoneError = document.getElementById("phoneError");

  // Real-time phone number validation
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      const value = e.target.value;
      const phoneRegex = /^01[3-9][0-9]{8}$/;

      if (value && !phoneRegex.test(value)) {
        phoneInput.classList.add("invalid");
        phoneError.style.display = "block";
      } else {
        phoneInput.classList.remove("invalid");
        phoneError.style.display = "none";
      }
    });
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const submitBtn = registerForm.querySelector(".btn-submit");

    // Validate passwords match
    if (password !== confirmPassword) {
      showNotification("Passwords do not match!", "error");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      showNotification("Password must be at least 6 characters long", "error");
      return;
    }

    // Validate phone number
    const phoneRegex = /^01[3-9][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showNotification(
        "Please enter a valid BD phone number (e.g., 01712345678)",
        "error"
      );
      phoneInput.classList.add("invalid");
      phoneError.style.display = "block";
      return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating Account...";

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification("Registration successful! Please login.", "success");

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        showNotification(data.message || "Registration failed", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Register";
      }
    } catch (error) {
      console.error("Registration error:", error);
      showNotification("Connection error. Please try again.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  });
}

// Check if user is already logged in
function checkAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (token && user.id) {
    // Redirect to appropriate dashboard
    if (
      window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("register.html")
    ) {
      if (user.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }
    }
  }
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

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Check auth on page load
checkAuth();
