const burger = document.querySelector(".burger");
const DESKTOP_MIN_WIDTH = 769;

function setOpen(isOpen) {
  document.body.classList.toggle("is-open", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
  burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

burger.addEventListener("click", () => {
  setOpen(!document.body.classList.contains("is-open"));
});

document.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", () => setOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setOpen(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
    setOpen(false);
  }
});
