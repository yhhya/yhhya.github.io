/* Builds the home page from js/content.js (runs after ui.js).
   Sections with nothing to show stay hidden, so visitors never see an empty heading. */

/* Show or hide an element by id */
function showIf(id, condition) { const n = document.getElementById(id); if (n) n.hidden = !condition; }

/* ---------- CV button ---------- */
const cvBtn = document.getElementById("cvBtn");
if (site.cvFile) { cvBtn.href = safeUrl(site.cvFile); cvBtn.hidden = false; }

/* ---------- Projects (only if the Projects section is switched on in index.html) ---------- */
const projectList = document.getElementById("projectList");
if (projectList) {
  projects.forEach(p => {
    const card = el("article", "card");
    if (p.image) { const img = el("img"); img.src = safeUrl(p.image); img.alt = p.title; img.loading = "lazy"; card.append(img); }
    card.append(el("p", "meta", p.type), el("h3", "", p.title), el("p", "", p.description));
    const tags = el("ul", "tags");
    (p.tags || []).forEach(t => tags.append(el("li", "", t)));
    card.append(tags);
    if (p.url && p.url !== "#") {
      const a = el("a", "more", "View project");
      a.href = safeUrl(p.url); a.target = "_blank"; a.rel = "noopener noreferrer";
      card.append(a);
    }
    projectList.append(card);
  });
  showIf("projects", projects.length > 0);
  showIf("navProjects", projects.length > 0);
}

/* ---------- Skills ---------- */
const skillList = document.getElementById("skillList");
skills.forEach(g => {
  const box = el("div", "skill-group");
  box.append(el("h3", "", g.group));
  const ul = el("ul", "tags");
  g.items.forEach(i => ul.append(el("li", "", i)));
  box.append(ul); skillList.append(box);
});

/* ---------- Experience ---------- */
const expList = document.getElementById("expList");
experience.forEach(x => {
  const li = el("li");
  li.append(el("h3", "", x.role), el("p", "meta", x.place + ", " + x.when));
  if (x.text) li.append(el("p", "", x.text));
  expList.append(li);
});

/* ---------- Writing ---------- */
const postList = document.getElementById("postList");
const shownPosts = posts
  .filter(p => p.url || /^[a-z0-9-]+$/.test(p.slug || ""))
  .sort((a, b) => b.date.localeCompare(a.date));          // newest first
shownPosts.forEach(p => {
  const a = el("a", "post");
  a.href = p.url ? safeUrl(p.url) : "post.html?p=" + p.slug;
  const date = new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  a.append(el("p", "meta", date), el("h3", "", p.title), el("p", "", p.summary));
  postList.append(a);
});
showIf("blog", shownPosts.length > 0);
showIf("navBlog", shownPosts.length > 0);
showIf("writingBtn", shownPosts.length > 0);

/* ---------- Links ---------- */
const linkList = document.getElementById("linkList");
const mail = el("li"); const m = el("a", "", site.email); m.href = "mailto:" + site.email; mail.append(m); linkList.append(mail);
links.forEach(l => {
  const li = el("li"); const a = el("a", "", l.label);
  a.href = safeUrl(l.url); a.target = "_blank"; a.rel = "noopener noreferrer";
  li.append(a); linkList.append(li);
});

/* ---------- Contact form ---------- */
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (form.website.value) return;                       // spam trap filled = a bot, so stop
  if (!form.checkValidity()) { status.textContent = "Please fill in your name, a valid email and a message."; return; }
  if (!site.formAction) {                               // no form service set: fall back to email app
    const body = encodeURIComponent(form.message.value + "\n\n" + form.name.value + " (" + form.email.value + ")");
    location.href = "mailto:" + site.email + "?subject=Portfolio%20message&body=" + body;
    return;
  }
  status.textContent = "Sending...";
  try {
    const r = await fetch(site.formAction, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error();
    form.reset(); status.textContent = "Message sent. Thank you!";
  } catch (err) { status.textContent = "Could not send. Please email me directly at " + site.email + "."; }
});
