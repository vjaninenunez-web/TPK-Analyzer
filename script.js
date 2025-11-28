// TPK Analyzer - script.js
// Casino theme, mobile-first

const RANKS = ["A","2","3","4","5","6","7","8","9","T","J","Q","K"];
const SUITS = ["C","D","H","S"]; // Clover, Diamond, Heart, Spade
const OUTCOME_MAP = {HC: 'High Card', '2P': 'Two Pair', '3K': 'Trips/Straight/Flush', 'FH': 'Full House'};
const DB_KEY = 'tpk_db_v1';

function loadDB(){ try { return JSON.parse(localStorage.getItem(DB_KEY) || '{}') } catch(e){ return {} } }
function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }

function normCard(code){ if(!code) return null; code = String(code).toUpperCase().replace(/♣|CLUB|CLOVER/g,'C').replace(/♠|SPADE/g,'S').replace(/♥|HEART/g,'H').replace(/♦|DIAMOND/g,'D').replace('10','T'); code = code.replace(/[^A-Z0-9]/g,''); return code; }

// UI builders
function buildCardButtons(){ const wrap = document.getElementById('cardButtons'); let html = ''; SUITS.forEach(s => { RANKS.forEach(r=>{ const label = r + s; const symbol = (s==='C'?'♣':s==='D'?'♦':s==='H'?'♥':'♠'); html += `<button data-card="${r+s}" class="card-btn">${r}${symbol}</button>`; }); html += '<br/>'; }); wrap.innerHTML = html; attachCardListeners(); }

function attachCardListeners(){ document.querySelectorAll('.card-btn').forEach(btn=>{ btn.addEventListener('click', ()=>{ document.querySelectorAll('.card-btn').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); window.selectedCard = btn.dataset.card; showSelected(); }); }); }

function showSelected(){ const res = document.getElementById('predictResult'); res.textContent = window.selectedCard ? `Selected: ${window.selectedCard}` : 'No card selected'; }

function addRecord(cardCode, shortOutcome){ const code = normCard(cardCode); if(!code) return alert('Invalid card'); const ocKey = (shortOutcome || '').toUpperCase(); const full = OUTCOME_MAP[ocKey] || OUTCOME_MAP[ocKey.replace(/[^A-Z]/g,'')]; if(!full){ return alert('Invalid outcome code. Use HC, 2P, 3K, FH.'); }
  const db = loadDB(); if(!db[code]) db[code] = {'High Card':0,'Two Pair':0,'Trips/Straight/Flush':0,'Full House':0}; db[code][full] = (db[code][full]||0)+1; saveDB(db); renderDataList(); showMessage(`Recorded ${code} → ${full}`);
}

function predictCard(cardCode){ const code = normCard(cardCode); if(!code) return alert('Invalid card'); const db = loadDB(); const res = document.getElementById('predictResult'); if(!db[code]){ res.textContent = `No data for ${code}`; return; } const counts = db[code]; const total = Object.values(counts).reduce((a,b)=>a+b,0); let out = `Prediction for ${code}\nTotal: ${total}\n\n`; for(const k in counts){ out += `${k.padEnd(28)} : ${(counts[k]/total*100).toFixed(2)}%\n`; } res.textContent = out; }

function renderDataList(){ const wrap = document.getElementById('dataList'); const db = loadDB(); const keys = Object.keys(db).sort(); if(!keys.length){ wrap.innerHTML = '<div style="color:#bbb">No stored data yet.</div>'; return; } wrap.innerHTML = keys.map(k=>{ const counts = db[k]; const total = Object.values(counts).reduce((a,b)=>a+b,0); return `<div class="data-item"><div><strong>${k}</strong><div style="font-size:12px;color:#ccc">${total} obs</div></div><div style="text-align:right">${Object.entries(counts).map(([name,c])=>`${name.split(' ')[0]}:${c}`).join('<br/>')}</div></div>` }).join(''); }

function showMessage(txt){ const res = document.getElementById('predictResult'); res.textContent = txt; setTimeout(()=>{ if(window.selectedCard) res.textContent = `Selected: ${window.selectedCard}` },1200); }

function quickAdd(){ const c = document.getElementById('quickCard').value; const o = document.getElementById('quickOutcome').value; if(!c||!o) return alert('Enter card and outcome'); addRecord(c,o); document.getElementById('quickCard').value=''; document.getElementById('quickOutcome').value=''; }

function setupQuickControls(){ document.getElementById('quickAdd').addEventListener('click', quickAdd); document.getElementById('doPredict').addEventListener('click', ()=>{ const v = document.getElementById('predictCard').value; predictCard(v); }); document.getElementById('predictCard').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('doPredict').click(); }); document.getElementById('quickOutcome').addEventListener('keydown', e=>{ if(e.key==='Enter') quickAdd(); });
  document.getElementById('resetDB').addEventListener('click', ()=>{ if(confirm('Reset all recorded data? This cannot be undone.')){ localStorage.removeItem(DB_KEY); renderDataList(); showMessage('Database cleared'); } });

  // outcome buttons record to currently selected card
  document.querySelectorAll('.outcome-btn').forEach(b=>{ b.addEventListener('click', ()=>{ if(!window.selectedCard){ alert('Select a card first'); return; } addRecord(window.selectedCard, b.dataset.code || b.textContent.trim()); }); });
}

// Service worker registration (optional)
if('serviceWorker' in navigator){ window.addEventListener('load', ()=>{ navigator.serviceWorker.register('service-worker.js').catch(e=>console.log('SW failed',e)); }); }

// init
buildCardButtons(); setupQuickControls(); renderDataList(); showSelected();

// expose functions for console/testing
window.addRecord = addRecord; window.predictCard = predictCard;
