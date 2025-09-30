// API Base URL
const API_URL = "http://localhost:5000/api";

// Check admin authentication
function checkAdminAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token || user.role !== "admin") {
    window.location.href = "../index.html";
    return false;
  }
  return true;
}

// Load Admin Dashboard Data
async function loadAdminDashboard() {
  if (!checkAdminAuth()) return;

  const token = localStorage.getItem("token");

  try {
    // Load statistics
    const statsRes = await fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statsData = await statsRes.json();

    if (statsData.success) {
      document.getElementById("totalUsers").textContent =
        statsData.stats.totalUsers;
      document.getElementById("totalOrders").textContent =
        statsData.stats.totalOrders;
      document.getElementById("totalRevenue").textContent =
        statsData.stats.totalRevenue;
      document.getElementById("pendingOrders").textContent =
        statsData.stats.pendingOrders;
    }
  } catch (error) {
    console.error("Error loading admin stats:", error);
    showNotification("Error loading statistics", "error");
  }
}

// Tab Switching
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      // Remove active class from all
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked
      btn.classList.add("active");
      document.getElementById(target).classList.add("active");

      // Load data for the tab
      loadTabData(target);
    });
  });

  // Load first tab data
  if (tabBtns.length > 0) {
    loadTabData(tabBtns[0].dataset.tab);
  }
}

// Load data based on active tab
async function loadTabData(tab) {
  const token = localStorage.getItem("token");

  switch (tab) {
    case "orders":
      await loadOrders();
      break;
    case "users":
      await loadUsers();
      break;
    case "packages":
      await loadPackages();
      break;
    case "deposits":
      await loadDeposits();
      break;
  }
}

// Load Orders
async function loadOrders() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (data.success) {
      displayOrders(data.orders);
    }
  } catch (error) {
    console.error("Error loading orders:", error);
  }
}

function displayOrders(orders) {
  const tbody = document.querySelector("#orders tbody");
  if (!tbody) return;

  tbody.innerHTML = orders
    .map(
      (order) => `
        <tr>
            <td>${order._id.substring(0, 8)}</td>
            <td>${order.user.username}</td>
            <td>${order.freeFireUID}</td>
            <td>${order.package.diamonds} 💎</td>
            <td>৳${order.package.price}</td>
            <td><span class="badge badge-${order.status}">${
        order.status
      }</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                ${
                  order.status === "pending"
                    ? `
                    <button class="table-btn btn-approve" onclick="updateOrderStatus('${order._id}', 'completed')">Approve</button>
                    <button class="table-btn btn-reject" onclick="updateOrderStatus('${order._id}', 'failed')">Reject</button>
                `
                    : "-"
                }
            </td>
        </tr>
    `
    )
    .join("");
}

// Update Order Status
async function updateOrderStatus(orderId, status) {
  const token = localStorage.getItem("token");

  if (!confirm(`Are you sure you want to mark this order as ${status}?`))
    return;

  try {
    const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (data.success) {
      showNotification("Order updated successfully", "success");
      loadOrders();
    } else {
      showNotification(data.message || "Failed to update order", "error");
    }
  } catch (error) {
    console.error("Error updating order:", error);
    showNotification("Error updating order", "error");
  }
}

// Load Users
async function loadUsers() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (data.success) {
      displayUsers(data.users);
    }
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

function displayUsers(users) {
  const tbody = document.querySelector("#users tbody");
  if (!tbody) return;

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td>${user._id.substring(0, 8)}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role}">${user.role}</span></td>
            <td>৳${user.wallet.balance}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="table-btn btn-edit" onclick="editUser('${
                  user._id
                }')">Edit</button>
            </td>
        </tr>
    `
    )
    .join("");
}

// Load Packages
async function loadPackages() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/topup/packages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (data.success) {
      displayPackagesAdmin(data.packages);
    }
  } catch (error) {
    console.error("Error loading packages:", error);
  }
}

function displayPackagesAdmin(packages) {
  const tbody = document.querySelector("#packages tbody");
  if (!tbody) return;

  tbody.innerHTML = packages
    .map(
      (pkg) => `
        <tr>
            <td>${pkg.diamonds} 💎</td>
            <td>+${pkg.bonus}</td>
            <td>৳${pkg.price}</td>
            <td>${pkg.popular ? "Yes" : "No"}</td>
            <td>
                <button class="table-btn btn-edit" onclick="editPackage('${
                  pkg._id
                }')">Edit</button>
                <button class="table-btn btn-delete" onclick="deletePackage('${
                  pkg._id
                }')">Delete</button>
            </td>
        </tr>
    `
    )
    .join("");
}

// Load Deposits
async function loadDeposits() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/admin/deposits`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (data.success) {
      displayDeposits(data.deposits);
    }
  } catch (error) {
    console.error("Error loading deposits:", error);
  }
}

function displayDeposits(deposits) {
  const tbody = document.querySelector("#deposits tbody");
  if (!tbody) return;

  tbody.innerHTML = deposits
    .map(
      (deposit) => `
        <tr>
            <td>${deposit._id.substring(0, 8)}</td>
            <td>${deposit.user.username}</td>
            <td>৳${deposit.amount}</td>
            <td>${deposit.method}</td>
            <td>${deposit.phoneNumber || "-"}</td>
            <td><span class="badge badge-${deposit.status}">${
        deposit.status
      }</span></td>
            <td>${new Date(deposit.createdAt).toLocaleDateString()}</td>
            <td>
                ${
                  deposit.status === "pending"
                    ? `
                    <button class="table-btn btn-approve" onclick="updateDepositStatus('${deposit._id}', 'completed')">Approve</button>
                    <button class="table-btn btn-reject" onclick="updateDepositStatus('${deposit._id}', 'failed')">Reject</button>
                `
                    : "-"
                }
            </td>
        </tr>
    `
    )
    .join("");
}

// Update Deposit Status
async function updateDepositStatus(depositId, status) {
  const token = localStorage.getItem("token");

  if (!confirm(`Are you sure you want to mark this deposit as ${status}?`))
    return;

  try {
    const response = await fetch(`${API_URL}/admin/deposits/${depositId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (data.success) {
      showNotification("Deposit updated successfully", "success");
      loadDeposits();
      loadAdminDashboard();
    } else {
      showNotification(data.message || "Failed to update deposit", "error");
    }
  } catch (error) {
    console.error("Error updating deposit:", error);
    showNotification("Error updating deposit", "error");
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

// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadAdminDashboard();
  initTabs();
});
