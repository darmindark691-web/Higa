async function loadChinaEducation() {
  const box = document.getElementById("china-education");
  box.innerHTML = "Loading China research...";

  try {
    const url =
      "https://api.crossref.org/works?filter=from-pub-date:2015,has-affiliation:true&rows=10";

    const res = await fetch(url);
    const data = await res.json();

    box.innerHTML = "";

    data.message.items.forEach(paper => {
      const title = paper.title?.[0] || "No title";
      const year = paper.published?.["date-parts"]?.[0]?.[0] || "";
      const link = paper.URL;

      const div = document.createElement("div");
      div.innerHTML = `
        <a href="${link}" target="_blank"><b>${title}</b></a>
        <p>Year: ${year}</p>
        <hr>
      `;
      box.appendChild(div);
    });

  } catch (e) {
    box.innerHTML = "<p style='color:red'>China hub error</p>";
  }
}

loadChinaEducation();
