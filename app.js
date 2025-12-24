const WORKER_URL = "https://morning-mouse-d6dc.darmindark691.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  loadCountry("india");
});

async function loadCountry(country) {
  clearSections();

  try {
    const res = await fetch(`${WORKER_URL}?country=${country}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      showError("No data found");
      return;
    }

    data.results.forEach(article => {
      if (article.type === "news") {
        addArticle("top-news", article);
      }

      if (article.type === "education") {
        addArticle("education", article);
      }
    });

  } catch (e) {
    showError("Worker not responding");
  }
}

function addArticle(sectionId, a) {
  const box = document.getElementById(sectionId);
  if (!box) return;

  const div = document.createElement("div");
  div.className = "news-card";

  div.innerHTML = `
    <a href="${a.url}" target="_blank">
      <h4>${a.title}</h4>
      <p>${a.summary || ""}</p>
    </a>
  `;

  box.appendChild(div);
}

function clearSections() {
  ["top-news", "education"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
}

function showError(msg) {
  document.getElementById("top-news").innerHTML =
    `<p style="color:red">${msg}</p>`;
}
