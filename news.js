// 🔴 TUMHARA NEWS WORKER URL
const NEWS_WORKER = "https://sajan.darmindark691.workers.dev";

const countries = ["india", "usa", "china", "japan", "uk"];

document.addEventListener("DOMContentLoaded", () => {
  countries.forEach(loadNews);
});

async function loadNews(country) {
  const box = document.getElementById(`news-${country}`);
  if (!box) return;

  box.innerHTML = "Loading...";

  try {
    const res = await fetch(`${NEWS_WORKER}?country=${country}`);
    const data = await res.json();

    box.innerHTML = "";

    const items = data.results || data.articles || [];

    if (items.length === 0) {
      box.innerHTML = "<p>No news found</p>";
      return;
    }

    items.slice(0, 10).forEach(n => {
      const div = document.createElement("div");
      div.innerHTML = `
        <a href="${n.url}" target="_blank">
          <b>${n.title}</b>
        </a>
        <hr>
      `;
      box.appendChild(div);
    });

  } catch (e) {
    box.innerHTML = "<p style='color:red'>News error</p>";
  }
}
