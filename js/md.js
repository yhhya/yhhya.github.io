/* A tiny, safe Markdown renderer (runs after ui.js). It builds real DOM elements and never uses
   innerHTML, so nothing a post contains can inject code into the page.
   Supports: # headings, paragraphs, **bold**, *italic*, `code`, ``` code blocks ```, - and 1. lists,
   > quotes, --- lines, [links](https://...) and ![images](assets/photo.jpg) (images must live in assets/). */

function mdInline(parent, text) {
  const re = /(`[^`]+`)|(!?\[[^\]]*\]\([^)\s]+\))|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) parent.append(document.createTextNode(text.slice(last, m.index)));
    const t = m[0];
    if (m[1]) {
      parent.append(el("code", "", t.slice(1, -1)));
    } else if (m[2]) {
      const p = t.match(/^(!?)\[([^\]]*)\]\(([^)\s]+)\)$/);
      if (p[1]) {                                           // image: only files from the assets folder
        if (/^assets\/[\w\-./]+$/.test(p[3]) && !p[3].includes("..")) {
          const img = el("img"); img.src = p[3]; img.alt = p[2]; img.loading = "lazy"; parent.append(img);
        } else { parent.append(document.createTextNode(t)); }
      } else {
        const a = el("a"); a.href = safeUrl(p[3]); a.rel = "noopener noreferrer";
        if (/^https?:/.test(p[3])) a.target = "_blank";
        mdInline(a, p[2] || p[3]); parent.append(a);
      }
    } else if (m[3]) {
      const s = el("strong"); mdInline(s, t.slice(2, -2)); parent.append(s);
    } else {
      const e = el("em"); mdInline(e, t.slice(1, -1)); parent.append(e);
    }
    last = re.lastIndex;
  }
  if (last < text.length) parent.append(document.createTextNode(text.slice(last)));
}

function renderMarkdown(src) {
  const frag = document.createDocumentFragment();
  const lines = String(src).replace(/\r\n?/g, "\n").split("\n");
  const blank = l => /^\s*$/.test(l);
  const listRe = /^\s*([-*]|\d+\.)\s+(.*)$/;
  const stopRe = /^(```|#{1,4}\s|>\s?|(-{3,}|\*{3,})\s*$|\s*([-*]|\d+\.)\s+)/;
  let i = 0, m;
  while (i < lines.length) {
    const line = lines[i];
    if (blank(line)) { i++; continue; }

    if (/^```/.test(line)) {                                 // code block
      const buf = []; i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++;
      const pre = el("pre"); pre.append(el("code", "", buf.join("\n"))); frag.append(pre); continue;
    }
    if ((m = line.match(/^(#{1,4})\s+(.*?)\s*#*\s*$/))) {     // headings: # becomes h2 because the post title is the h1
      const h = el("h" + Math.min(m[1].length + 1, 4)); mdInline(h, m[2]); frag.append(h); i++; continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) { frag.append(el("hr")); i++; continue; }
    if (/^>\s?/.test(line)) {                                // quote
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      const bq = el("blockquote"); bq.append(renderMarkdown(buf.join("\n"))); frag.append(bq); continue;
    }
    if ((m = line.match(listRe))) {                          // lists
      const ordered = /\d/.test(m[1]), list = el(ordered ? "ol" : "ul");
      while (i < lines.length && (m = lines[i].match(listRe)) && /\d/.test(m[1]) === ordered) {
        const li = el("li"); mdInline(li, m[2]); list.append(li); i++;
      }
      frag.append(list); continue;
    }
    const buf = [lines[i++]];                                // paragraph
    while (i < lines.length && !blank(lines[i]) && !stopRe.test(lines[i])) buf.push(lines[i++]);
    const p = el("p"); mdInline(p, buf.join(" ")); frag.append(p);
  }
  return frag;
}
