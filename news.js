// 🔵 NEWS WORKER URL
const NEWS_WORKER = "https://sajan.darmindark691.workers.dev";

// Countries jinke news chahiye
const newsCountries = ["india", "china", "japan", "usa", "uk"];

document.addEventListener("DOMContentLoaded", () => {
  newsCountries.forEach(loadNews);
});

async function loadNews(country) {
  try {
    const res = await fetch(`${NEWS_WORKER}?country=${country}`);
    const data = await res.json();

    const box = document.getElementById(`news-${country}`);
    if (!box) return;

    if (!data || data.length === 0) {
      box.innerHTML = "<p>No news found</p>";
      return;
    }

    data.forEach(n => {
      const div = document.createElement("div");
      div.className = "news-card";

      div.innerHTML = `
        <h4>${n.title}</h4>
        <a href="${n.url}" target="_blank">Read full news</a>
        <hr>
      `;

      box.appendChild(div);
    });

  } catch (e) {
    console.error("News error:", e);
  }
}
