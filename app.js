// 🔗 CHANGE THIS TO YOUR WORKER URL
const NEWS_API = "https://YOUR_WORKER_URL/?country=";

// 🎓 OpenAlex (Education Hub – unlimited feel)
const OPENALEX_API =
  "https://api.openalex.org/works?per-page=20&sort=cited_by_count:desc";

loadCountry("india");

// ================= NEWS =================

async function loadCountry(country) {
  const res = await fetch(`${NEWS_API}${country}&page=1`);
  const data = await res.json();

  render("top", data.articles.top);
  render("business", data.articles.business);
  render("technology", data.articles.technology);

  loadEducation();
}

function render(id, items = []) {
  const box = document.getElementById(id);
  box.innerHTML = "";

  items.forEach(a => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${a.title}</h3>
      <p>${a.summary || ""}</p>
    `;
    box.appendChild(div);
  });
}

// ================= EDUCATION (OPENALEX) =================

async function loadEducation() {
  const r = await fetch(OPENALEX_API);
  const j = await r.json();

  const papers = j.results.map(p => ({
    title: p.title,
    summary: p.host_venue?.display_name || "Academic Research"
  }));

  render("education", papers);
}
