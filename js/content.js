/* ==========================================================
   YOUR CONTENT. Edit this file only to update the website.
   To add a skill, post or link: copy one block, paste it
   below the others, change the text. Keep the commas!
   ========================================================== */

const site = {
  email: "yhhya@proton.me",
  // Free form service: create a form at formspree.io or web3forms.com and paste its URL here.
  // Leave "" to make the form open the visitor's email app instead.
  formAction: "",
  // Your CV: export it as a PDF, upload it to the assets folder, then put its path here,
  // for example "assets/Yahya-Hossain-CV.pdf". While this is "", the Download CV button stays hidden.
  cvFile: "",
  // Used by the writing page (write.html) to open the right GitHub repository.
  githubRepo: "yhhya/yhhya.github.io",
  branch: "main"
};

/* Social and other links (shown in the Contact section) */
const links = [
  { label: "GitHub", url: "https://github.com/yhhya" }
  // Add more once the profiles exist, for example:
  // , { label: "Behance", url: "https://behance.net/your-real-username" }
];

/* Projects: the section is hidden for now (see index.html). Keep this list empty until you bring it back.
   Example: { type: "Team project", title: "Name", description: "One or two sentences.", tags: ["PHP", "MySQL"], url: "https://..." } */
const projects = [];

/* Skills grouped by area */
const skills = [
  { group: "Computer science", items: ["Python", "C / C++", "Java", "HTML & CSS", "JavaScript", "Git", "Data structures"] },
  { group: "Design",           items: ["Photoshop", "Illustrator", "Figma"] },
  { group: "Teaching",         items: ["International English Medium Curriculum", "Mathematics", "Science", "Exam preparation", "Clear explanations"] }
];

/* Experience, newest first */
const experience = [
  { role: "Private Tutor", place: "Self-employed", when: "October 2026",
    text: "Teach middle and high school students one-on-one and in small groups. Focus on understanding over memorising." },
  { role: "Graphic Designer", place: "Hobbyist", when: "2022",
    text: "Created many university posters and social media posts." },
  { role: "BSc, Computer Science and Engineering", place: "United International University", when: "November 2024" }
];

/* Writing. Newest posts first or last, it sorts itself.
   The easy way to add one: open write.html on your site, write the post, and follow the three steps.
   Each entry needs a slug that matches a file in the posts folder (posts/my-first-post.md).
   Example:
   { date: "2026-12-01", title: "My first post", summary: "One sentence about it.", slug: "my-first-post" },
   An entry can also have a "url" instead of a slug to link to a post hosted elsewhere (Medium, dev.to...). */
const posts = [

];
