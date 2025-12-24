const WORKER_URL = "https://morning-mouse-d6dc.darmindark691.workers.dev";

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
      showError("No news found");
      console.log(data);
      return;
    }

    data.results.forEach(a => {
      addArticle("top-news", a);

      // simple keyword based split
      if (isBusiness(a.title)) addArticle("business", a);
      else if (isTech(a.title)) addArticle("technology", a);
      else addArticle("education", a);
    });

  } catch (e) {
    console.error(e);
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
      <small>${a.source || ""}</small>
    </a>
  `;

  box.appendChild(div);
}

function clearSections() {
  ["top-news", "business", "technology", "education"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
}

function showError(msg) {
  document.getElementById("top-news").innerHTML =
    `<p style="color:red">${msg}</p>`;
}

// 🔹 simple classifiers
function isBusiness(t) {
  t = t.toLowerCase();
  return t.includes("market") || t.includes("economy") || t.includes("stock");
}

function isTech(t) {
  t = t.toLowerCase();
  return t.includes("tech") || t.includes("ai") || t.includes("software");
}
