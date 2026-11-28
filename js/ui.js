/* Shared by every page: small helpers, theme toggle, mobile menu, footer year.
   Visitor-facing text always goes through textContent, which keeps the site safe from injected HTML. */

/* Tiny helper: el("div", "class", "text") creates an element */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}
/* Only allow normal web links (blocks javascript: links) */
function safeUrl(u) { return /^(https?:\/\/|mailto:|assets\/|#)/.test(u) ? u : "#"; }

/* ---------- Theme toggle ---------- */
const root = document.documentElement, themeBtn = document.getElementById("themeBtn");
function paintBtn() { themeBtn.textContent = root.dataset.theme === "dark" ? "Light" : "Dark"; }
themeBtn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  paintBtn();
});
paintBtn();

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById("menuBtn"), nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", () => { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); });

document.getElementById("year").textContent = new Date().getFullYear();
