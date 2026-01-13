const fs = require("fs");
const fetch = require("node-fetch");
const xml2js = require("xml2js");

const SOURCES = [
  {
    name: "PIB",
    rss: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1"
  },
  {
    name: "RBI",
    rss: "https://www.rbi.org.in/Scripts/Rss.aspx"
  },
  {
    name: "ECI",
    rss: "https://eci.gov.in/rss.xml"
  }
];

function analyze(title, description, source) {
  const text = (title + " " + description).toLowerCase();

  let kya = title;
  let kyon = "Sarkari / prashasanik faisla";
  let kaise = [];

  if (text.includes("repo")) {
    kyon = "Inflation control aur monetary stability";
    kaise.push("MPC meeting");
    kaise.push("Policy decision");
  }

  if (text.includes("cabinet")) {
    kaise.push("Union Cabinet approval");
  }

  if (text.includes("election")) {
    kaise.push("Constitutional authority decision");
  }

  return {
    title,
    kab: new Date().toDateString(),
    kisne: source,
    kya,
    kyon,
    kaise,
    summary: [
      `${source} ne ek mahatvapurn ghoshna ki.`,
      `Is faisle ke tahat: ${kya}.`,
      `Iska mukhya uddeshya ${kyon} hai.`,
      `Faisla is prakriya se liya gaya: ${kaise.join(", ")}.`,
      `Yeh prashasanik roop se mahatvapurn hai.`,
      `Iska prabhav rashtriya star par padega.`,
      `UPSC aur sarkari parikshaon ke liye upyogi.`
    ],
    key_points: [
      source,
      "Official announcement",
      "Governance relevance",
      "Policy decision",
      "Exam importance"
    ],
    questions: [
      "Yeh ghoshna kisne ki?",
      "Is faisle ka uddeshya kya hai?",
      "Kaun si sanstha zimmedar hai?",
      "Iska prabhav kin kshetron par padega?",
      "UPSC ke kis paper se sambandhit hai?"
    ]
  };
}

async function run() {
  let all = [];

  for (const src of SOURCES) {
    const res = await fetch(src.rss);
    const xml = await res.text();
    const parsed = await xml2js.parseStringPromise(xml);

    const items =
      parsed.rss?.channel[0]?.item ||
      parsed.feed?.entry ||
      [];

    items.slice(0, 3).forEach(i => {
      const title = i.title[0]._ || i.title[0];
      const desc = i.description ? i.description[0] : "";
      all.push(analyze(title, desc, src.name));
    });
  }

  fs.writeFileSync("data.json", JSON.stringify(all, null, 2));
}

run();
