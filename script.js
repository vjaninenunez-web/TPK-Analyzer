{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Database stored in localStorage\
let db = JSON.parse(localStorage.getItem("tpk_db") || "\{\}");\
\
function saveDB() \{\
    localStorage.setItem("tpk_db", JSON.stringify(db));\
\}\
\
function record() \{\
    const suit = document.getElementById("suitInput").value.toUpperCase();\
    const rank = document.getElementById("rankInput").value;\
    const outcome = document.getElementById("outcomeInput").value;\
\
    if (!suit || !rank) return alert("Enter suit and rank");\
\
    const key = suit + rank;\
\
    if (!db[key]) db[key] = [];\
\
    db[key].push(outcome);\
    saveDB();\
\
    alert("Recorded!");\
\}\
\
function predict() \{\
    const suit = document.getElementById("predictSuit").value.toUpperCase();\
    const rank = document.getElementById("predictRank").value;\
\
    const key = suit + rank;\
\
    if (!db[key] || db[key].length === 0) \{\
        document.getElementById("result").innerText = "No data yet.";\
        return;\
    \}\
\
    const outcomes = db[key];\
    const total = outcomes.length;\
\
    const count = \{\
        HC: 0, "1P": 0, "2P": 0, 3K: 0, FH: 0\
    \};\
\
    outcomes.forEach(o => count[o]++);\
\
    let text = `Total Records: $\{total\}\\n\\n`;\
\
    Object.keys(count).forEach(k => \{\
        const pct = ((count[k] / total) * 100).toFixed(1);\
        text += `$\{k\}: $\{count[k]\} ($\{pct\}%)\\n`;\
    \});\
\
    document.getElementById("result").innerText = text;\
\}\
}