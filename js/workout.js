/* STRIV — Workout v2 */

let timerSec = 0, timerInt = null;
let currentFilter = 'all';
let libFilter = 'all';
let searchQuery = '';
let currentTab = 'routines';

const EXERCISE_LIBRARY = [
  { name:'Bench Press',      muscle:'chest',     icon:'🏋️', desc:'Barbell · compound', difficulty:'Intermediate' },
  { name:'Incline DB Press', muscle:'chest',     icon:'🏋️', desc:'Dumbbell · compound', difficulty:'Intermediate' },
  { name:'Push-up',          muscle:'chest',     icon:'💪', desc:'Bodyweight · compound', difficulty:'Beginner' },
  { name:'Cable Fly',        muscle:'chest',     icon:'🔗', desc:'Cable · isolation', difficulty:'Intermediate' },
  { name:'Pull-up',          muscle:'back',      icon:'🪢', desc:'Bodyweight · compound', difficulty:'Intermediate' },
  { name:'Barbell Row',      muscle:'back',      icon:'🏋️', desc:'Barbell · compound', difficulty:'Intermediate' },
  { name:'Lat Pulldown',     muscle:'back',      icon:'🔗', desc:'Cable · compound', difficulty:'Beginner' },
  { name:'Deadlift',         muscle:'back',      icon:'🏋️', desc:'Barbell · compound', difficulty:'Advanced' },
  { name:'Squat',            muscle:'legs',      icon:'🦵', desc:'Barbell · compound', difficulty:'Intermediate' },
  { name:'Leg Press',        muscle:'legs',      icon:'🦵', desc:'Machine · compound', difficulty:'Beginner' },
  { name:'Romanian DL',      muscle:'legs',      icon:'🏋️', desc:'Barbell · compound', difficulty:'Intermediate' },
  { name:'Calf Raises',      muscle:'legs',      icon:'🦵', desc:'Bodyweight · isolation', difficulty:'Beginner' },
  { name:'Military Press',   muscle:'shoulders', icon:'🏋️', desc:'Barbell · compound', difficulty:'Intermediate' },
  { name:'Lateral Raises',   muscle:'shoulders', icon:'💪', desc:'Dumbbell · isolation', difficulty:'Beginner' },
  { name:'Front Raises',     muscle:'shoulders', icon:'💪', desc:'Dumbbell · isolation', difficulty:'Beginner' },
  { name:'Barbell Curl',     muscle:'arms',      icon:'💪', desc:'Barbell · isolation', difficulty:'Beginner' },
  { name:'Tricep Dips',      muscle:'arms',      icon:'💪', desc:'Bodyweight · compound', difficulty:'Intermediate' },
  { name:'Skull Crusher',    muscle:'arms',      icon:'🏋️', desc:'Barbell · isolation', difficulty:'Intermediate' },
];

const ROUTINE_TAGS = { A:'upper', B:'upper', C:'lower', D:'full' };

const RANKING_DATA = {
  weekly: [
    { init:'AL', name:'Ana L.',     xp:3450, me:false },
    { init:'CR', name:'Carlos R.',  xp:2180, me:false },
    { init:'MB', name:'Marco B.',   xp:1970, me:false },
    { init:'JI', name:'Joaquin I.', xp:1840, me:true  },
    { init:'PV', name:'Paula V.',   xp:1620, me:false },
    { init:'DS', name:'Diego S.',   xp:1410, me:false },
    { init:'KM', name:'Kira M.',    xp:980,  me:false },
  ],
  monthly: [
    { init:'DS', name:'Diego S.',   xp:14200, me:false },
    { init:'AL', name:'Ana L.',     xp:12800, me:false },
    { init:'JI', name:'Joaquin I.', xp:11340, me:true  },
    { init:'CR', name:'Carlos R.',  xp:9870,  me:false },
    { init:'PV', name:'Paula V.',   xp:8620,  me:false },
  ],
  alltime: [
    { init:'DS', name:'Diego S.',   xp:98400, me:false },
    { init:'CR', name:'Carlos R.',  xp:74200, me:false },
    { init:'AL', name:'Ana L.',     xp:61800, me:false },
    { init:'PV', name:'Paula V.',   xp:48300, me:false },
    { init:'JI', name:'Joaquin I.', xp:34200, me:true  },
  ]
};

const AVATAR_COLORS = ['rgba(245,197,24,0.12)','rgba(59,166,240,0.12)','rgba(61,214,140,0.12)','rgba(158,120,245,0.12)','rgba(240,82,82,0.12)'];

function initWorkout() {
  renderRoutines();
  renderLibrary();
  renderRanking('weekly');
  startTimer();
  updateStats();
}

function startTimer() {
  timerInt = setInterval(() => {
    timerSec++;
    const m = Math.floor(timerSec/60).toString().padStart(2,'0');
    const s = (timerSec%60).toString().padStart(2,'0');
    const el = document.getElementById('timer');
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
}

/* ── Tabs ── */
function switchTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const panel = document.getElementById('tab-' + tab);
  if (panel) panel.classList.add('active');
}

/* ── Search ── */
function handleSearch(q) {
  searchQuery = q.toLowerCase().trim();
  const results = document.getElementById('search-results');
  const list    = document.getElementById('search-list');
  if (!searchQuery) { results.style.display = 'none'; return; }
  results.style.display = 'block';

  const matches = EXERCISE_LIBRARY.filter(e =>
    e.name.toLowerCase().includes(searchQuery) ||
    e.muscle.toLowerCase().includes(searchQuery) ||
    e.desc.toLowerCase().includes(searchQuery)
  );

  list.innerHTML = matches.length
    ? matches.map(e => `
      <div class="lib-item">
        <div class="lib-icon" style="background:var(--${e.muscle === 'chest' ? 'accent' : e.muscle === 'back' ? 'water' : e.muscle === 'legs' ? 'purple' : e.muscle === 'shoulders' ? 'green' : 'red'}-bg);">${e.icon}</div>
        <div style="flex:1;">
          <strong style="font-size:13px;font-weight:500;">${e.name}</strong>
          <span style="font-size:11px;color:var(--text-3);display:block;">${e.desc}</span>
        </div>
        <span class="muscle-chip ${e.muscle}" style="padding:3px 8px;">${e.muscle}</span>
      </div>`).join('')
    : '<p style="padding:16px;text-align:center;font-size:13px;color:var(--text-3);">No results found</p>';
}

/* ── Filter routines ── */
function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('#filter-chips .muscle-chip').forEach(b => {
    b.className = 'muscle-chip'; b.style.padding = '5px 12px';
  });
  if (btn) { btn.className = 'muscle-chip chest'; btn.style.padding = '5px 12px'; }
  renderRoutines();
}

function renderRoutines() {
  const container = document.getElementById('routine-list');
  if (!container) return;
  const visible = AppState.routines.filter(r => {
    const tag = ROUTINE_TAGS[r.id] || 'full';
    return currentFilter === 'all' || tag === currentFilter;
  });

  if (!visible.length) {
    container.innerHTML = '<p style="padding:24px;text-align:center;font-size:13px;color:var(--text-3);">No routines match this filter</p>';
    return;
  }

  container.innerHTML = visible.map(r => {
    const doneCount = r.exercises.filter(e => e.done).length;
    const pct = Math.round(doneCount / r.exercises.length * 100);
    const isOpen = r._open;
    const exercises = r.exercises.map((ex, i) =>
      `<div class="ex-row ${ex.done ? 'done' : ''}" onclick="toggleExercise('${r.id}',${i})">
        <div class="ex-circle">${ex.done ? '✓' : i+1}</div>
        <div class="ex-info">
          <strong>${ex.name}</strong>
          <span>${ex.desc}</span>
        </div>
        <div class="ex-dots">${Array.from({length:ex.sets},()=>`<div class="sdot"></div>`).join('')}</div>
      </div>`
    ).join('');

    return `
      <div class="routine-card ${isOpen ? 'open' : ''}" id="rc-${r.id}">
        <div class="routine-head" onclick="toggleRoutine('${r.id}')">
          <div style="flex:1;">
            <div class="routine-title">${r.name}</div>
            <div class="routine-sub">${r.desc}</div>
            ${doneCount > 0 ? `<div style="margin-top:8px;height:3px;background:var(--bg-elevated);border-radius:100px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:var(--green);border-radius:100px;"></div></div>` : ''}
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;margin-left:12px;">
            ${doneCount > 0 ? `<span class="badge badge-green">${doneCount}/${r.exercises.length}</span>` : `<span style="font-size:11px;color:var(--text-3);">${r.exercises.length} exercises</span>`}
            <span class="chevron">▾</span>
          </div>
        </div>
        <div class="ex-body" style="display:${isOpen ? 'block' : 'none'};">${exercises}</div>
      </div>`;
  }).join('');
}

function toggleRoutine(id) {
  const r = AppState.routines.find(r => r.id === id);
  if (r) r._open = !r._open;
  renderRoutines();
}

function toggleExercise(routineId, idx) {
  const r = AppState.routines.find(r => r.id === routineId);
  if (!r) return;
  r.exercises[idx].done = !r.exercises[idx].done;
  if (r.exercises[idx].done) showToast(`✅ ${r.exercises[idx].name} done!`);
  updateStats();
  renderRoutines();
}

function updateStats() {
  let total = 0;
  AppState.routines.forEach(r => r.exercises.forEach(e => { if (e.done) total++; }));
  const el1 = document.getElementById('stat-done');
  const el2 = document.getElementById('stat-kcal');
  if (el1) el1.textContent = total;
  if (el2) el2.textContent = `~${total * 42}`;
}

/* ── Library ── */
function filterLib(muscle, btn) {
  libFilter = muscle;
  renderLibrary();
}

function renderLibrary() {
  const container = document.getElementById('exercise-library');
  if (!container) return;
  const list = libFilter === 'all' ? EXERCISE_LIBRARY : EXERCISE_LIBRARY.filter(e => e.muscle === libFilter);
  const colorMap = { chest:'accent', back:'water', legs:'purple', shoulders:'green', arms:'red' };

  container.innerHTML = list.map(e => `
    <div class="lib-item" onclick="showToast('📋 ${e.name} added to today')">
      <div class="lib-icon" style="background:var(--${colorMap[e.muscle]}-bg);">${e.icon}</div>
      <div style="flex:1;">
        <strong style="font-size:13px;font-weight:500;">${e.name}</strong>
        <span style="font-size:11px;color:var(--text-3);display:block;">${e.desc}</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
        <span class="muscle-chip ${e.muscle}" style="padding:3px 8px;">${e.muscle}</span>
        <span style="font-size:10px;color:var(--text-3);">${e.difficulty}</span>
      </div>
    </div>`).join('');
}

/* ── Ranking ── */
function switchRank(period, btn) {
  renderRanking(period);
}

function renderRanking(period) {
  const container = document.getElementById('rank-list');
  if (!container) return;
  const data = RANKING_DATA[period] || RANKING_DATA.weekly;
  const medals = ['gold','silver','bronze'];
  const colors = AVATAR_COLORS;

  container.innerHTML = data.map((u, i) => `
    <div class="rank-item ${u.me ? 'me' : ''}">
      <span class="rank-num ${medals[i] || ''}">${i < 3 ? ['🥇','🥈','🥉'][i] : i+1}</span>
      <div class="rank-avatar" style="background:${colors[i % colors.length]};${u.me ? 'border-color:var(--accent);' : ''}">${u.init}</div>
      <div class="rank-info">
        <strong>${u.name} ${u.me ? '(you)' : ''}</strong>
        <span>${u.xp.toLocaleString()} XP</span>
      </div>
      <span class="rank-score num">${u.xp.toLocaleString()}</span>
    </div>`).join('');
}