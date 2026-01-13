/**
 * India Current Affairs Engine
 * Fetches RSS → builds structured insights → saves data.json
 */

process.on("unhandledRejection", err => {
  console.error("Unhandled:", err);
  process.exit(0);
});

const fs = require("fs");
const fetch = require("node-fetch");
const xml2js = require("xml2js");

const RSS_SOURCES = [
  {
    name: "PIB",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1"
  },
  {
    name: "RBI",
    url: "https://www.rbi.org.in/Scripts/Rss.aspx"
  },
  {
    name: "Election Commission of India",
    url: "https://eci.gov.in/rss.xml"
  }
];

// 🔹 Insight builder (LEVEL-2 logic)
function buildInsight(title, description, source) {
  const text = (title + " " + description).toLowerCase();

  let kya = "";
  let kyon = "";
  let kaise = [];

  if (text.includes("repo")) {
    kya = "Repo rate par decision liya gaya";
    kyon = "Inflation control aur economic stability ke liye";
    kaise = [
      "Monetary Policy Committee meeting",
      "Members ke vote ke baad faisla",
      "Policy statement publish hui"
    ];
  }

  if (text.includes("cabinet")) {
    kya = "Union Cabinet ne policy decision liya";
    kyon = "Governance aur reform implementation ke liye";
    kaise = [
      "Cabinet meeting hui",
      "Ministerial inputs liye gaye",
      "Official approval diya gaya"
    ];
  }

  if (text.includes("election")) {
    kya = "Election related official announcement";
    kyon = "Constitutional mandate ke tahat";
    kaise = [
      "Election Commission meeting",
      "Schedule finalize hua",
      "Press release jari hui"
    ];
  }

  return {
    title,
    source,
    kab: new Date().toDateString(),
    kisne: source,
    kya: kya || "Official announcement",
    kyon: kyon || "Administrative / constitutional process",
    kaise: kaise.length ? kaise : ["Official procedure follow hua"],
    summary: [
      "Sarkari ya constitutional body ka official decision",
      "Governance aur public policy se sambandhit",
      "UPSC Prelims & Mains ke liye relevant",
      "Long term institutional impact",
      "Policy making process ko samjhata hai",
      "Static + current affairs linkage",
      "Exam oriented factual clarity"
    ],
    key_points: [
      "Official notification",
      "Institutional role",
      "Policy implication",
      "Constitutional relevance",
      "Exam importance"
    ]
  };
}

// 🔹 Fetch + parse RSS
async function fetchRSS(source) {
  const res = await fetch(source.url, { timeout: 20000 });
  const xml = await res.text();
  const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });

  const items =
    parsed?.rss?.channel?.item ||
    parsed?.feed?.entry ||
    [];

  if (!items || items.length === 0) return [];

  const list = Array.isArray(items) ? items : [items];

  return list.slice(0, 5).map(item => {
    const title =
      item.title?._ || item.title || "No title";

    const description =
      item.description?._ ||
      item.summary?._ ||
      item.description ||
      "";

    return buildInsight(title, description, source.name);
  });
}

// 🔹 MAIN
async function main() {
  let allData = [];

  for (const src of RSS_SOURCES) {
    try {
      const data = await fetchRSS(src);
      allData.push(...data);
    } catch (e) {
      console.error("Source failed:", src.name);
    }
  }

  fs.writeFileSync(
    "data.json",
    JSON.stringify(allData, null, 2),
    "utf-8"
  );

  console.log("✅ data.json updated with", allData.length, "items");
}

main();
