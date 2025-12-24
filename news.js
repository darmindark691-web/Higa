const NEWS_WORKER = "https://sajan.darmindark691.workers.dev";

async function loadNews() {
  const box = document.getElementById("news-india");

  box.innerHTML = "Loading news...";

  const res = await fetch(`${NEWS_WORKER}?country=india`);
  const data = await res.json();

  box.innerHTML = "";

  data.results.slice(0, 10).forEach(n => {
    box.innerHTML += `
      <p>
        <a href="${n.url}" target="_blank">${n.title}</a>
      </p>
    `;
  });
}

loadNews();
