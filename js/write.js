/* Writing page: write a post, preview it, then save it to GitHub in three steps.
   Nothing here can change your site by itself: it only prepares text and opens GitHub,
   where you press "Commit changes" yourself. */
(function () {
  const $ = id => document.getElementById(id);
  const f = { title: $("title"), date: $("date"), summary: $("summary"), slug: $("slug"), body: $("body") };
  const preview = $("preview"), msg = $("msg"), DRAFT = "yh-draft";
  let slugTouched = false;

  const slugify = s => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  const say = t => { msg.textContent = t; };
  const clean = () => ({ title: f.title.value.trim(), date: f.date.value, summary: f.summary.value.trim(),
                         slug: f.slug.value.trim(), body: f.body.value });
  const entry = p => '  { date: ' + JSON.stringify(p.date) + ', title: ' + JSON.stringify(p.title) +
                     ', summary: ' + JSON.stringify(p.summary) + ', slug: ' + JSON.stringify(p.slug) + ' },';

  /* Returns "" when ready, otherwise what is missing */
  function problem(p) {
    if (!p.title) return "Add a title.";
    if (!p.summary) return "Add a one-sentence summary.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) return "Pick a date.";
    if (!/^[a-z0-9-]+$/.test(p.slug)) return "The web name can only use lowercase letters, numbers and hyphens.";
    if (posts.some(x => x.slug === p.slug)) return "A post with this web name already exists. Change the web name.";
    if (!p.body.trim()) return "Write something in the post.";
    return "";
  }

  function paint() {
    preview.replaceChildren(renderMarkdown(f.body.value));
    const p = clean();
    try { localStorage.setItem(DRAFT, JSON.stringify(p)); } catch (e) {}
  }

  f.title.addEventListener("input", () => { if (!slugTouched) f.slug.value = slugify(f.title.value); });
  f.slug.addEventListener("input", () => { slugTouched = true; });
  Object.values(f).forEach(n => n.addEventListener("input", paint));

  /* Load a saved draft, otherwise start with today's date */
  f.date.value = new Date().toISOString().slice(0, 10);
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT) || "null");
    if (d) { Object.keys(f).forEach(k => { if (d[k]) f[k].value = d[k]; }); slugTouched = !!d.slug; say("Draft restored from this browser."); }
  } catch (e) {}
  paint();

  /* Open an existing .md file from your computer */
  $("openFile").addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => { f.body.value = String(r.result); paint(); say("Loaded " + file.name + "."); };
    r.readAsText(file);
  });

  /* Step 1: new file on GitHub with the post already filled in */
  $("ghLink").addEventListener("click", e => {
    const p = clean(), why = problem(p);
    if (why) { e.preventDefault(); say(why); return; }
    const url = "https://github.com/" + site.githubRepo + "/new/" + site.branch +
      "?filename=" + encodeURIComponent("posts/" + p.slug + ".md") + "&value=" + encodeURIComponent(p.body);
    if (url.length > 7000) {
      e.preventDefault();
      say("This post is too long to send in a link. Use \"Download post file\", then upload it to the posts folder on GitHub (Add file > Upload files).");
      return;
    }
    e.currentTarget.href = url; say("GitHub opened. Press Commit changes there, then come back for step 2.");
  });

  /* Download the post file instead (works for any length) */
  $("download").addEventListener("click", () => {
    const p = clean(); if (!p.slug) { say("Add a title first."); return; }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([p.body], { type: "text/markdown" }));
    a.download = p.slug + ".md"; a.click(); URL.revokeObjectURL(a.href);
  });

  /* Step 2: copy the list entry, then open content.js on GitHub */
  $("copyEntry").addEventListener("click", async () => {
    const p = clean(), why = problem(p);
    if (why) { say(why); return; }
    try { await navigator.clipboard.writeText(entry(p)); say("Copied. Now open content.js and paste it inside the posts list."); }
    catch (e) { say("Could not copy automatically. Select the text in the box below and copy it."); }
    $("entryBox").value = entry(p); $("entryWrap").hidden = false;
  });
  $("editContent").href = "https://github.com/" + site.githubRepo + "/edit/" + site.branch + "/js/content.js";

  $("clearDraft").addEventListener("click", () => {
    try { localStorage.removeItem(DRAFT); } catch (e) {}
    Object.values(f).forEach(n => { n.value = ""; }); f.date.value = new Date().toISOString().slice(0, 10);
    slugTouched = false; paint(); say("Draft cleared.");
  });
})();
