// ✅ YOUR WORKER URL
const WORKER_URL = "https://morning-mouse-d6dc.darmindark691.workers.dev";

const countries = ["india", "china", "japan", "usa", "uk"];

document.addEventListener("DOMContentLoaded", () => {
  loadCountry("india");

  document.querySelectorAll(".country-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      loadCountry(btn.dataset.country);
    });
  });
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

    data.results.forEach(item => {
      if (item.type === "news") {
        addArticle("top-news", item);
      }

      if (item.type === "education") {
        addArticle("education", item);
      }
    });

  } catch (e) {
    showError("Worker not responding");
  }
}

// ================= UI HELPERS =================

function addArticle(sectionId, a) {
  const box = document.getElementById(sectionId);
  if (!box) return;

  const div = document.createElement("div");
  div.className = "news-card";

  div.innerHTML = `
    <a href="${a.url}" target="_blank" rel="noopener">
      <h4>${a.title}</h4>
      <p>${a.summary || ""}</p>
      <small>${a.source || ""}</small>
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
  const el = document.getElementById("top-news");
  if (el) el.innerHTML = `<p style="color:red">${msg}</p>`;
}
