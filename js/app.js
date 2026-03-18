/* STRIV — App Core v3 */

/* ── Shared state ── */
const AppState = {
  steps: 7248, stepsGoal: 10000,
  calories: 384, streak: 5,
  waterMl: 1400, waterGoal: 2500,

  waterLog: [
    { label:'Morning glass', container:'Glass',  time:'08:15', ml:250 },
    { label:'Protein shake',  container:'Bottle', time:'10:40', ml:500 },
    { label:'Lunch water',    container:'Glass',  time:'13:00', ml:250 },
    { label:'Post-workout',   container:'Bottle', time:'15:30', ml:400 },
  ],

  nutrition: [
    { name:'Oatmeal with banana', type:'Breakfast', time:'08:00', kcal:380, p:12, c:65, f:8,  icon:'🥣' },
    { name:'Chicken & rice',      type:'Lunch',     time:'13:00', kcal:620, p:48, c:72, f:12, icon:'🍗' },
    { name:'Greek yogurt',        type:'Snacks',    time:'16:00', kcal:140, p:17, c:10, f:3,  icon:'🫙' },
  ],

  routines: [
    {
      id:'A', name:'Upper Body A', desc:'Chest & biceps · 4 exercises', _open:false,
      exercises: [
        { name:'Bench Press',     desc:'4 × 10 reps · 60 kg', sets:4, done:false },
        { name:'Incline DB Press',desc:'3 × 12 reps · 24 kg', sets:3, done:false },
        { name:'Barbell Curl',    desc:'3 × 12 reps · 30 kg', sets:3, done:false },
        { name:'Hammer Curl',     desc:'3 × 15 reps · 14 kg', sets:3, done:false },
      ]
    },
    {
      id:'B', name:'Upper Body B', desc:'Shoulders & triceps · 4 exercises', _open:false,
      exercises: [
        { name:'Military Press',  desc:'4 × 10 reps · 40 kg', sets:4, done:false },
        { name:'Lateral Raises',  desc:'3 × 15 reps · 8 kg',  sets:3, done:false },
        { name:'Tricep Dips',     desc:'3 × 15 reps · BW',    sets:3, done:false },
        { name:'Skull Crusher',   desc:'3 × 12 reps · 25 kg', sets:3, done:false },
      ]
    },
    {
      id:'C', name:'Lower Body', desc:'Legs & glutes · 4 exercises', _open:false,
      exercises: [
        { name:'Squat',           desc:'4 × 8 reps · 80 kg',   sets:4, done:false },
        { name:'Romanian DL',     desc:'3 × 10 reps · 70 kg',  sets:3, done:false },
        { name:'Leg Press',       desc:'3 × 12 reps · 120 kg', sets:3, done:false },
        { name:'Calf Raises',     desc:'4 × 20 reps · BW',     sets:4, done:false },
      ]
    },
  ],
};

/* ── Theme engine ── */
const ThemeEngine = {
  COLORS: {
    yellow: { dark:'#F5C518', light:'#9A7A08' },
    green:  { dark:'#3DD68C', light:'#1A9E5C' },
    blue:   { dark:'#3BA6F0', light:'#0077CC' },
    orange: { dark:'#FF5E3A', light:'#CC3311' },
    purple: { dark:'#9E78F5', light:'#6B3FCC' },
  },

  init() {
    const theme = localStorage.getItem('sv_theme') || 'dark';
    const color = localStorage.getItem('sv_color') || 'yellow';
    this.applyTheme(theme, false);
    this.applyColor(color);
  },

  applyTheme(mode, save=true) {
    document.documentElement.setAttribute('data-theme', mode);
    if (save) localStorage.setItem('sv_theme', mode);
    // Reapply color because --energy can differ by theme
    this.applyColor(localStorage.getItem('sv_color') || 'yellow');
    // Sync buttons
    document.querySelectorAll('[data-theme-pill]').forEach(b => {
      b.classList.toggle('active', b.dataset.themePill === mode);
    });
    document.querySelectorAll('.theme-toggle-icon').forEach(el => {
      el.textContent = mode === 'dark' ? '☀️' : mode === 'mineral' ? '🔵' : '🌙';
    });
  },

  toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = { dark:'light', light:'mineral', mineral:'dark' }[cur] || 'dark';
    this.applyTheme(next);
  },

  applyColor(key) {
    const c = this.COLORS[key];
    if (!c) return;
    const isDark = ['dark','mineral'].includes(document.documentElement.getAttribute('data-theme'));
    document.documentElement.style.setProperty('--energy', isDark ? c.dark : c.light);
    localStorage.setItem('sv_color', key);
    document.querySelectorAll('.swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === key);
    });
  },
};

/* ── Nav ── */
const NAV = [
  { page:'dashboard', label:'Home',    icon:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { page:'hydration', label:'Hydration',icon:'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' },
  { page:'nutrition', label:'Nutrition',icon:'M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3' },
  { page:'workout',   label:'Workout',  icon:'M6.5 6.5h11 M6.5 17.5h11 M3 10h4 M17 10h4 M3 14h4 M17 14h4' },
  { page:'settings',  label:'Settings', icon:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
];

function renderNav(active) {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;
  nav.innerHTML = NAV.map(it => `
    <a href="${it.page}.html" class="nav-item ${it.page === active ? 'active' : ''}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
        ${it.icon.split(' M').map((p,i) => `<path d="${i===0?p:'M'+p}"/>`).join('')}
      </svg>
      <span>${it.label}</span>
    </a>`).join('');
}

/* ── Toast ── */
function showToast(msg, ms=2200) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), ms);
}

/* ── Helpers ── */
function formatTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}
function formatDate() {
  const d = new Date();
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

/* ── Init on every page ── */
document.addEventListener('DOMContentLoaded', () => ThemeEngine.init());