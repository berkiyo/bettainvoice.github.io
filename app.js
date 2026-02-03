const toggle = document.querySelector(".theme-toggle");
const label = document.querySelector(".toggle-label");
const storageKey = "bettaTheme";

const setTheme = (mode) => {
  document.documentElement.setAttribute("data-theme", mode);
  label.textContent = mode === "dark" ? "Light" : "Dark";
  localStorage.setItem(storageKey, mode);
};

const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const stored = localStorage.getItem(storageKey) || preferred;
setTheme(stored);

toggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});
