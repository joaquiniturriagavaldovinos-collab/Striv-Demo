/* STRIV — Hydration v3 */
const WATER_GOAL = 2500;

function initHydration() { renderLog(); updateWaterUI(); }

function addWater(ml, label, btn) {
  AppState.waterMl += ml;
  AppState.waterLog.push({ label, container: label, time: formatTime(), ml });
  updateWaterUI();
  renderLog();
  if (btn) { btn.style.borderColor='var(--water)'; setTimeout(()=>btn.style.borderColor='',600); }
  if (AppState.waterMl >= WATER_GOAL) showToast('🎉 Daily hydration goal reached!', 3000);
  else showToast(`💧 +${ml} ml added`);
}

function openCustom()  { document.getElementById('custom-section').style.display='block'; document.getElementById('custom-ml').focus(); }
function closeCustom() { document.getElementById('custom-section').style.display='none'; document.getElementById('custom-ml').value=''; }

function addCustomWater() {
  const val = parseInt(document.getElementById('custom-ml').value);
  if (!val || val < 1 || val > 3000) { showToast('⚠️ Enter 1–3000 ml'); return; }
  addWater(val, 'Custom');
  closeCustom();
}

function updateWaterUI() {
  const L   = (AppState.waterMl / 1000).toFixed(1);
  const pct = Math.min(Math.round(AppState.waterMl / WATER_GOAL * 100), 100);
  const rem = Math.max(WATER_GOAL - AppState.waterMl, 0);
  document.getElementById('water-display').innerHTML = `${L}<span class="unit">L</span>`;
  document.getElementById('water-bar').style.width   = `${pct}%`;
  document.getElementById('water-pct').textContent   = `${pct}% complete`;
  document.getElementById('water-rem').textContent   = rem > 0 ? `${rem.toLocaleString()} ML REMAINING` : 'GOAL ACHIEVED 🎉';
}

function renderLog() {
  const container = document.getElementById('water-log');
  const countEl   = document.getElementById('log-count');
  if (!container) return;
  if (countEl) countEl.textContent = `${AppState.waterLog.length} entries`;
  container.innerHTML = AppState.waterLog.length
    ? AppState.waterLog.slice().reverse().map(e => `
        <div class="log-row">
          <div><div class="log-name">${e.label}</div><div class="log-meta">${e.container} · ${e.time}</div></div>
          <span class="log-ml num">+${e.ml}</span>
        </div>`).join('')
    : '<p style="padding:16px;text-align:center;color:var(--t3);font-size:13px;">No entries yet today</p>';
}