/* Post page: reads ?p=slug, finds the post in js/content.js, loads posts/<slug>.md and shows it. */
(function () {
  const box = document.getElementById("article");
  const slug = new URLSearchParams(location.search).get("p") || "";
  const post = /^[a-z0-9-]+$/.test(slug) ? posts.find(p => p.slug === slug) : null;

  function notFound() {
    box.replaceChildren(el("h1", "", "Post not found"),
      el("p", "", "This post does not exist or was moved."));
    const back = el("a", "", "Back to all writing"); back.href = "index.html#blog"; box.append(back);
  }
  if (!post) { notFound(); return; }

  document.title = post.title + " | Yahya Hossain";
  const date = new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  fetch("posts/" + slug + ".md")
    .then(r => { if (!r.ok) throw new Error(); return r.text(); })
    .then(text => {
      const back = el("a", "back", "All writing"); back.href = "index.html#blog";
      box.replaceChildren(back, el("p", "meta", date), el("h1", "", post.title), renderMarkdown(text));
    })
    .catch(notFound);
})();
