// =========================
// Utilidades de almacenamiento
// =========================
const LS = {
  get: (k, d = null) => JSON.parse(localStorage.getItem(k) ?? JSON.stringify(d)),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem(k)
};

const USERS = "eco_users";   // lista de usuarios
const CUR   = "eco_current"; // usuario actual

function users() { return LS.get(USERS, {}); }
function saveUsers(u) { LS.set(USERS, u); }
function current() { return LS.get(CUR, null); }
function setCurrent(a) { LS.set(CUR, a); }

// =========================
// LOGIN / REGISTRO
// =========================
if (document.getElementById("loginForm")) {
  // Si ya hay sesión, saltar a index.html
  if (current()) {
    location.href = "index.html";
  }

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const msgBox = document.getElementById("loginMsg");

  // Cambiar entre login y registro
  document.getElementById("registerLink").onclick = () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    msgBox.textContent = "";
  };
  document.getElementById("loginLink").onclick = () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    msgBox.textContent = "";
  };

  // LOGIN
  loginForm.onsubmit = e => {
    e.preventDefault();
    const alias = document.getElementById("loginAlias").value.trim();
    const pass = document.getElementById("loginPass").value;
    const u = users();

    if (!u[alias] || u[alias].pass !== pass) {
      msgBox.textContent = "❌ Alias o contraseña incorrectos";
      msgBox.className = "msg error";
      return;
    }

    setCurrent(alias);
    location.href = "index.html";
  };

  // REGISTRO
  registerForm.onsubmit = e => {
    e.preventDefault();
    const alias = document.getElementById("regAlias").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value;

    const u = users();
    if (u[alias]) {
      msgBox.textContent = "⚠️ Ese alias ya está en uso";
      msgBox.className = "msg error";
      return;
    }
    if (pass.length < 4) {
      msgBox.textContent = "⚠️ La contraseña debe tener al menos 4 caracteres";
      msgBox.className = "msg error";
      return;
    }

    u[alias] = { email, pass };
    saveUsers(u);
    setCurrent(alias);

    msgBox.textContent = "✅ Cuenta creada con éxito";
    msgBox.className = "msg success";

    setTimeout(() => location.href = "index.html", 800);
  };

} else {
  // =========================
  // INDEX (después del login)
  // =========================
  const alias = current();
  if (!alias) location.href = "login.html";

  document.getElementById("welcomeMsg").textContent = "Hola, " + alias + " 👋";

  // Logout
  document.getElementById("logoutBtn").onclick = () => {
    LS.del(CUR);
    location.href = "login.html";
  };

  // Navegación entre secciones
  const sections = document.querySelectorAll(".section");
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.onclick = () => {
      sections.forEach(s => s.classList.remove("active"));
      document.getElementById(btn.dataset.section).classList.add("active");
    };
  });
}

// =========================
// MODO OSCURO / CLARO
// =========================
const body = document.body;
const themeBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

if (themeBtn) {
  // cargar tema guardado
  let theme = localStorage.getItem("eco_theme") || "light";
  setTheme(theme);

  themeBtn.onclick = () => {
    theme = (theme === "light") ? "dark" : "light";
    setTheme(theme);
    localStorage.setItem("eco_theme", theme);
  };
}

function setTheme(mode) {
  if (mode === "dark") {
    body.classList.add("dark");
    if (themeIcon) themeIcon.textContent = "☀️";
  } else {
    body.classList.remove("dark");
    if (themeIcon) themeIcon.textContent = "🌙";
  }
}
