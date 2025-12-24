async function loadEducation() {
  const box = document.getElementById("edu-india");

  const res = await fetch(
    "https://api.openalex.org/works?filter=institutions.country_code:IN&per-page=10"
  );

  const data = await res.json();

  box.innerHTML = "";

  data.results.forEach(w => {
    box.innerHTML += `
      <p>
        <b>${w.title}</b><br>
        Year: ${w.publication_year}
      </p>
    `;
  });
}

loadEducation();
