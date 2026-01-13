const fs = require("fs");
const Parser = require("rss-parser");
const fetch = require("node-fetch");

process.on("unhandledRejection", err => {
  console.error("Unhandled:", err);
  process.exit(0);
});

const parser = new Parser({
  customFetch: async (url) => {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 20000
    });
    return res.text();
  }
});

// 🔹 India Govt RSS sources
const SOURCES = [
  {
    name: "PIB",
    url: "https://pib.gov.in/rssfeed.aspx"
  },
  {
    name: "RBI",
    url: "https://rbi.org.in/Scripts/Rss.aspx"
  },
  {
    name: "ECI",
    url: "https://eci.gov.in/rss/press-releases.xml"
  }
];

async function run() {
  let output = [];

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);

      feed.items.slice(0, 5).forEach(item => {
        output.push({
          title: item.title || "",
          kab: item.pubDate || new Date().toDateString(),
          kisne: source.name,
          kya: item.title || "",
          kyon: "Sarkari / prashasnik decision",
          kaise: [
            "Official notification",
            "Press release / policy update"
          ],
          summary: [
            "Government announcement",
            "Policy relevance",
            "UPSC GS importance",
            "Administrative implication",
            "Public impact"
          ],
          key_points: [
            "Authority involved",
            "Decision type",
            "Governance relevance",
            "Exam oriented",
            "Static–current linkage"
          ],
          source: item.link || source.url
        });
      });

    } catch (e) {
      console.error("Failed source:", source.name, e.message);
    }
  }

  fs.writeFileSync("data.json", JSON.stringify(output, null, 2));
  console.log("data.json updated with", output.length, "items");
}

run();
