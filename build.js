const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser({
  timeout: 20000,
  headers: { "User-Agent": "Mozilla/5.0" }
});

process.on("unhandledRejection", err => {
  console.error(err);
  process.exit(0);
});

const SOURCES = [
  {
    name: "PIB",
    url: "https://pib.gov.in/rssfeed.aspx?Feed=Eng",
    org: "Press Information Bureau"
  },
  {
    name: "RBI",
    url: "https://www.rbi.org.in/Scripts/Rss.aspx",
    org: "Reserve Bank of India"
  },
  {
    name: "ECI",
    url: "https://eci.gov.in/rss.xml",
    org: "Election Commission of India"
  }
];

function buildInsight(item, source) {
  const text = (item.title + " " + (item.contentSnippet || "")).toLowerCase();

  let kya = item.title;
  let kyon = "Administrative / policy decision";
  let kaise = [];

  if (text.includes("repo")) {
    kyon = "Inflation control and monetary stability";
    kaise.push("MPC meeting");
    kaise.push("Policy review");
  }

  if (text.includes("cabinet")) {
    kaise.push("Union Cabinet approval");
  }

  if (kaise.length === 0) {
    kaise.push("Official notification");
  }

  return {
    title: item.title,
    kab: item.pubDate || new Date().toDateString(),
    kisne: source.org,
    kya,
    kyon,
    kaise,
    summary: [
      "Official announcement by constitutional authority",
      "Relevant for governance and policy",
      "Important for UPSC Prelims & Mains",
      "Institutional role involved",
      "Possible long-term impact",
      "Linked with public administration",
      "Current affairs relevance"
    ],
    source: item.link
  };
}

(async () => {
  let results = [];

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);

      feed.items.slice(0, 5).forEach(item => {
        results.push(buildInsight(item, source));
      });

    } catch (e) {
      console.error("Failed:", source.name);
    }
  }

  fs.writeFileSync("data.json", JSON.stringify(results, null, 2));
  console.log("Saved", results.length, "items");
})();
