// Select DOM elements
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// // Function to toggle between login and register forms
// function toggleForms() {
//   document.getElementById("loginBox").classList.toggle("d-none");
//   document.getElementById("registerBox").classList.toggle("d-none");
// }

// from login to home 

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (email === "" || password === "") {
      return;
    }

    window.location.href = "../pages/home.html";
  });
}

// from register to home
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const role = document.getElementById("regRole").value;
    const company = document.getElementById("regCompany").value.trim();
    if (email === "" || password === "" || role === "" || company === "" || !validatePassword(password)) {
      return;
    }
    window.location.href = "../pages/home.html";
  });
}
// Function to show toast messages
function showToast(message, type = "danger") {
  const toastContainer = document.getElementById("toastContainer");

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  // Append toast and remove after 3 seconds
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Password validation function
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

// Handle Register Form Submission
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;
  const company = document.getElementById("regCompany").value;

  if (!validatePassword(password)) {
    showToast("Password must contain at least 1 uppercase, 1 lowercase, 1 special character and be at least 8 characters long.", "danger");
    return;
  }

  // Example: success message (replace with real backend request later)
  showToast("Account created successfully!", "success");

  // Clear form fields
  registerForm.reset();
  toggleForms();
});

// Handle Login Form Submission
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showToast("Please enter email and password.", "danger");
    return;
  }

  // Example: success login (replace with real backend request later)
  showToast("Login successful!", "success");
});