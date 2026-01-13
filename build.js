const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

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
  return {
    title: item.title,
    kab: item.pubDate || new Date().toDateString(),
    kisne: source.org,
    kya: item.title,
    kyon: "Official administrative / policy decision",
    kaise: [
      "Official notification issued",
      "Concerned authority action",
      "Public release via website"
    ],
    summary: [
      "Government / constitutional body announcement",
      "Relevant for governance and polity",
      "Important for UPSC current affairs",
      "Institutional role involved",
      "Policy or administrative impact",
      "Public information release",
      "National relevance"
    ],
    source: item.link
  };
}

(async () => {
  let results = [];

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);

      if (feed.items && feed.items.length > 0) {
        feed.items.slice(0, 5).forEach(item => {
          results.push(buildInsight(item, source));
        });
      }
    } catch (err) {
      console.error("RSS failed:", source.name);
    }
  }

  fs.writeFileSync("data.json", JSON.stringify(results, null, 2));
  console.log("Total items:", results.length);
})();
