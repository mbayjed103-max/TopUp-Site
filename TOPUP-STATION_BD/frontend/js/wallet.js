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

// Load wallet page
async function loadWalletPage() {
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
      document.getElementById("currentBalance").textContent =
        walletData.balance;
    }

    // Load deposit history
    await loadDepositHistory();
  } catch (error) {
    console.error("Error loading wallet:", error);
    showNotification("Error loading wallet data", "error");
  }
}

// Handle deposit form submission
const depositForm = document.getElementById("depositForm");
if (depositForm) {
  depositForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const method = document.getElementById("paymentMethod").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const transactionId = document.getElementById("transactionId").value;
    const token = localStorage.getItem("token");
    const submitBtn = depositForm.querySelector(".btn-submit");

    // Validate amount
    if (amount < 50) {
      showNotification("Minimum deposit amount is ৳50", "error");
      return;
    }

    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 11) {
      showNotification("Please enter a valid phone number", "error");
      return;
    }

    // Validate transaction ID
    if (!transactionId || transactionId.length < 5) {
      showNotification("Please enter a valid transaction ID", "error");
      return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    try {
      const response = await fetch(`${API_URL}/wallet/deposit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          method,
          phoneNumber,
          transactionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification(
          "Deposit request submitted! Waiting for approval.",
          "success"
        );

        // Reset form
        depositForm.reset();

        // Reload data
        setTimeout(() => {
          loadWalletPage();
        }, 1500);
      } else {
        showNotification(data.message || "Deposit request failed", "error");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      showNotification("Connection error. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Deposit";
    }
  });
}

// Load deposit history
async function loadDepositHistory() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/wallet/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (data.success) {
      displayDepositHistory(data.deposits);
    }
  } catch (error) {
    console.error("Error loading deposit history:", error);
  }
}

// Display deposit history
function displayDepositHistory(deposits) {
  const container = document.getElementById("depositHistory");
  if (!container) return;

  if (deposits.length === 0) {
    container.innerHTML =
      '<p style="text-align:center; color:#aaa; padding:2rem;">No deposit history</p>';
    return;
  }

  container.innerHTML = deposits
    .map(
      (deposit) => `
        <div class="history-item">
            <div class="history-info">
                <div class="history-amount">৳${deposit.amount}</div>
                <div class="history-details">
                    <span>${deposit.method.toUpperCase()}</span>
                    <span>•</span>
                    <span>${deposit.phoneNumber}</span>
                    <span>•</span>
                    <span>${new Date(
                      deposit.createdAt
                    ).toLocaleDateString()}</span>
                </div>
                <div class="history-transaction">TxnID: ${
                  deposit.transactionId
                }</div>
            </div>
            <div class="history-status status-${deposit.status}">${
        deposit.status
      }</div>
        </div>
    `
    )
    .join("");
}

// Payment method instructions
const paymentMethodSelect = document.getElementById("paymentMethod");
if (paymentMethodSelect) {
  paymentMethodSelect.addEventListener("change", (e) => {
    const method = e.target.value;
    const instructionsDiv = document.getElementById("paymentInstructions");

    let instructions = "";

    if (method === "bkash") {
      instructions = `
                <div class="payment-instructions">
                    <h4>bKash Payment Instructions:</h4>
                    <ol>
                        <li>Send money to: <strong>01XXX-XXXXXX</strong></li>
                        <li>Use "Send Money" option (NOT cash out)</li>
                        <li>Enter the transaction ID below</li>
                        <li>Wait for admin approval</li>
                    </ol>
                </div>
            `;
    } else if (method === "nagad") {
      instructions = `
                <div class="payment-instructions">
                    <h4>Nagad Payment Instructions:</h4>
                    <ol>
                        <li>Send money to: <strong>01XXX-XXXXXX</strong></li>
                        <li>Use "Send Money" option</li>
                        <li>Enter the transaction ID below</li>
                        <li>Wait for admin approval</li>
                    </ol>
                </div>
            `;
    }

    instructionsDiv.innerHTML = instructions;
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
document.addEventListener("DOMContentLoaded", loadWalletPage);
