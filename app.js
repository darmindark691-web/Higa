const countries = {
  india: "IN",
  usa: "US"
};

async function loadEducation(country) {
  const code = countries[country];
  const url =
    `https://api.openalex.org/works?filter=institutions.country_code:${code}&per-page=10`;

  const res = await fetch(url);
  const data = await res.json();

  const box = document.getElementById(country);

  data.results.forEach(w => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${w.title}</h4>
      <p>Year: ${w.publication_year}</p>
      <hr>
    `;
    box.appendChild(div);
  });
}

Object.keys(countries).forEach(loadEducation);
