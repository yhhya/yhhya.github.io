# Yahya Hossain: Portfolio

Plain HTML, CSS and JavaScript. No build tools. Double-click index.html to preview.

## Update your content
Open `js/content.js`. Change your email, links, skills, experience and writing there.

## Add your CV
1. Export your CV as a PDF (without the marriage biodata details: this file is public).
2. Upload it to the `assets` folder, for example `assets/Yahya-Hossain-CV.pdf`.
3. Put that path in `site.cvFile` in `js/content.js`. Until then the Download CV button stays hidden.

## Write a blog post
Open `write.html` on your live site (bookmark it; nothing links to it). Write, check the preview, then follow the three steps on the page.
By hand, it is the same two things:
1. Create `posts/my-post-name.md` with your text (Markdown).
2. Add one line to the `posts` list in `js/content.js` with the same name as `slug`.

Pictures: upload them to `assets/` and use `![description](assets/photo.jpg)` in the post.
Sections with nothing in them hide themselves, so Writing appears once you publish your first post.

## Projects
The Projects section is switched off for now. To bring it back, remove the comment markers around the Projects section and the Projects nav link in `index.html`, then add items to `projects` in `js/content.js`.

## Hosting: GitHub Pages
The repository is named `yhhya.github.io`, so the site lives at https://yhhya.github.io/.
GitHub Pages ignores `_headers`, but the same Content-Security-Policy is also set inside each page with a `<meta>` tag.
(Cloudflare Pages and Netlify do use `_headers`, which adds clickjacking protection too.)
