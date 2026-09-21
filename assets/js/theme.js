function getStoredTheme() {
  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  document.querySelectorAll("[data-theme-value]").forEach(function (button) {
    var isActive = button.getAttribute("data-theme-value") === theme;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

applyTheme(getStoredTheme());

document.querySelectorAll("[data-theme-value]").forEach(function (button) {
  button.addEventListener("click", function () {
    applyTheme(button.getAttribute("data-theme-value"));
  });
});
