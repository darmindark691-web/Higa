// 🇨🇳 CHINA EDUCATION – FREE RESEARCH HUB (CROSSREF)

async function loadChinaEducation() {
  const box = document.getElementById("china-education");
  if (!box) return;

  box.innerHTML = "Loading China research...";

  try {
    const url =
      "https://api.crossref.org/works?filter=from-pub-date:2018,until-pub-date:2025&rows=10";

    const res = await fetch(url);
    const data = await res.json();

    box.innerHTML = "";

    const items = data.message.items || [];

    if (items.length === 0) {
      box.innerHTML = "<p>No China research found</p>";
      return;
    }

    items.forEach(w => {
      const title = w.title ? w.title[0] : "No title";
      const year = w.published?.["date-parts"]?.[0]?.[0] || "N/A";
      const link = w.URL || "#";

      const div = document.createElement("div");
      div.innerHTML = `
        <a href="${link}" target="_blank">
          <b>${title}</b>
        </a>
        <p>Year: ${year}</p>
        <hr>
      `;
      box.appendChild(div);
    });

  } catch (e) {
    box.innerHTML = "<p style='color:red'>China education error</p>";
  }
}

// AUTO LOAD
loadChinaEducation();
