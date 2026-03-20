// ===================== APP SCREENS =====================
let currentScreen = 0;
function setScreen(idx, btn) {
  document.querySelectorAll('.screen-view').forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });
  document.querySelectorAll('.app-step-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.phone-dot').forEach((d, i) => {
    d.style.background = i === idx ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)';
  });
  currentScreen = idx;
  if (idx === 1) startCalibration();
  if (idx === 3) buildTimeline();
  if (idx === 5) startMeditation();
  if (idx === 6) animateSleepBars();
  if (idx === 7) buildWeekChart();
}
function setScreenByDot(idx) {
  const btns = document.querySelectorAll('.app-step-btn');
  setScreen(idx, btns[idx]);
}

// Connect Device button handler
function connectDevice(btn) {
  btn.textContent = 'Connecting…';
  btn.style.opacity = '0.7';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Connect Device';
    btn.style.opacity = '1';
    btn.disabled = false;
    const btns = document.querySelectorAll('.app-step-btn');
    setScreen(1, btns[1]);
  }, 800);
}

// Sound chip toggle
function toggleSound(el) {
  el.parentElement.querySelectorAll('.sound-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// Duration chip toggle (Meditation)
function toggleDur(el) {
  el.parentElement.querySelectorAll('.dur-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function startCalibration() {
  const fill = document.getElementById('cal-fill');
  const pct = document.getElementById('cal-pct');
  if (!fill || !pct) return;
  let p = 0;
  fill.style.width = '0%';
  const iv = setInterval(() => {
    p += 2;
    if (p > 100) {
      clearInterval(iv);
      setTimeout(() => {
        const btns = document.querySelectorAll('.app-step-btn');
        setScreen(2, btns[2]);
      }, 600);
      return;
    }
    fill.style.width = p + '%';
    pct.textContent = p + '%';
  }, 60);
  const aEl = document.getElementById('cal-a'), bEl = document.getElementById('cal-b'), tEl = document.getElementById('cal-t');
  const vIv = setInterval(() => {
    if (aEl) aEl.textContent = Math.round(30 + Math.random() * 15);
    if (bEl) bEl.textContent = Math.round(45 + Math.random() * 15);
    if (tEl) tEl.textContent = Math.round(22 + Math.random() * 12);
  }, 400);
  setTimeout(() => clearInterval(vIv), 3500);
}

function buildTimeline() {
  const chart = document.getElementById('ft-chart');
  if (!chart) return;
  chart.innerHTML = '';
  const heights = [40, 60, 75, 85, 72, 80, 90, 68, 45, 70, 88, 92, 78, 65, 80, 85, 72, 60, 82, 88, 75, 90, 85, 68, 72, 80, 76, 88, 92, 85];
  heights.forEach(h => {
    const bar = document.createElement('div');
    bar.className = 'ft-bar';
    bar.style.height = '0%';
    bar.style.background = h > 75 ? 'rgba(46,134,255,0.7)' : h > 55 ? 'rgba(46,134,255,0.4)' : 'rgba(255,100,100,0.4)';
    chart.appendChild(bar);
    setTimeout(() => { bar.style.height = h + '%'; bar.style.transition = 'height .4s ease'; }, 50 + Math.random() * 300);
  });
}

// ===================== MEDITATION =====================
let medInterval = null;
function startMeditation() {
  if (medInterval) clearInterval(medInterval);
  const phase = document.getElementById('breathe-phase');
  const zenEl = document.getElementById('zen-val');
  const stressEl = document.getElementById('stress-val');
  if (!phase) return;
  const phases = ['Inhale…', 'Hold…', 'Exhale…', 'Hold…'];
  let pi = 0;
  phase.textContent = phases[0];
  medInterval = setInterval(() => {
    if (currentScreen !== 5) { clearInterval(medInterval); medInterval = null; return; }
    pi = (pi + 1) % phases.length;
    phase.textContent = phases[pi];
    if (zenEl) zenEl.textContent = Math.round(68 + Math.random() * 22);
    const stressLevels = ['Low', 'Low', 'Low', 'Med', 'Low'];
    if (stressEl) stressEl.textContent = stressLevels[Math.floor(Math.random() * stressLevels.length)];
  }, 2000);
}

// ===================== SLEEP BARS =====================
function animateSleepBars() {
  const stages = document.getElementById('sleep-stages');
  if (!stages) return;
  stages.querySelectorAll('.ss-bar-fill').forEach(bar => {
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = bar.dataset.w; }, 100);
  });
}

// ===================== WEEKLY CHART =====================
function buildWeekChart() {
  const wrap = document.getElementById('wc-bars');
  if (!wrap) return;
  wrap.innerHTML = '';
  const data = [
    { day: 'Mon', score: 68 }, { day: 'Tue', score: 74 }, { day: 'Wed', score: 82 },
    { day: 'Thu', score: 71 }, { day: 'Fri', score: 88 }, { day: 'Sat', score: 65 }, { day: 'Sun', score: 79 }
  ];
  data.forEach((d, i) => {
    const col = document.createElement('div');
    col.className = 'wc-bar-col';
    const bar = document.createElement('div');
    bar.className = 'wc-bar';
    bar.style.height = '0%';
    bar.style.background = d.score > 75 ? 'rgba(46,134,255,0.8)' : d.score > 60 ? 'rgba(46,134,255,0.45)' : 'rgba(255,100,100,0.5)';
    const label = document.createElement('div');
    label.className = 'wc-day';
    label.textContent = d.day;
    col.appendChild(bar);
    col.appendChild(label);
    wrap.appendChild(col);
    setTimeout(() => { bar.style.height = d.score + '%'; }, 80 + i * 80);
  });
}

// Session timer
let sec = 872;
setInterval(() => {
  if (currentScreen !== 3) return;
  const el = document.getElementById('sess-timer');
  if (!el) return;
  sec++;
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  el.textContent = `00:${m}:${s}`;
}, 1000);

// ===================== SCROLL REVEAL =====================
document.addEventListener('DOMContentLoaded', () => {
  // Init dots
  const pd0 = document.getElementById('pd-0');
  if (pd0) pd0.style.background = 'rgba(255,255,255,0.8)';

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});

// ===================== 3D FULLSCREEN =====================
function toggle3DFullscreen() {
  const wrap = document.getElementById('canvas-wrap');
  if (!wrap) return;
  const btn = wrap.querySelector('.canvas-maximize-btn');
  wrap.classList.toggle('fullscreen');
  if (wrap.classList.contains('fullscreen')) {
    btn.textContent = '✕';
    btn.title = 'Exit Fullscreen';
    document.body.style.overflow = 'hidden';
  } else {
    btn.textContent = '⛶';
    btn.title = 'Maximize 3D View';
    document.body.style.overflow = '';
  }
  // Trigger resize for Three.js
  window.dispatchEvent(new Event('resize'));
}
// ESC key to exit fullscreen
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const wrap = document.getElementById('canvas-wrap');
    if (wrap && wrap.classList.contains('fullscreen')) {
      toggle3DFullscreen();
    }
  }
});

// ===================== MANUAL ENTRY (APP2) =====================
function updateSliderValue(sliderId, displayId) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  if (slider && display) {
    display.textContent = slider.value + 'μV';
  }
}
function calculateFocusScore() {
  const alpha = parseFloat(document.getElementById('alpha-slider')?.value || 0);
  const beta = parseFloat(document.getElementById('beta-slider')?.value || 0);
  const theta = parseFloat(document.getElementById('theta-slider')?.value || 0);

  // Focus Score = β ÷ (α + θ) × 100
  const denominator = alpha + theta;
  const focusScore = denominator > 0 ? Math.min(100, Math.round((beta / denominator) * 100)) : 0;

  // Classify state
  let state, stateClass, icon, desc;
  if (focusScore >= 75) {
    state = 'Deep Focus'; stateClass = 'focused'; icon = '🟢';
    desc = 'Beta dominance detected. Your brain is in a highly focused state — ideal for deep work.';
  } else if (focusScore >= 50) {
    state = 'Moderate Focus'; stateClass = 'moderate'; icon = '🔵';
    desc = 'Balanced wave activity. You\'re engaged but could improve with fewer distractions.';
  } else if (focusScore >= 30) {
    state = 'Distracted'; stateClass = 'distracted'; icon = '🟡';
    desc = 'Low beta relative to alpha+theta. Your mind is wandering — try narrowing your task scope.';
  } else {
    state = 'Relaxed / Drowsy'; stateClass = 'relaxed'; icon = '🟣';
    desc = 'Alpha and theta dominance suggests a relaxed or drowsy state. Great for rest, not for work.';
  }

  // Update gauge
  const gaugeCircle = document.getElementById('gauge-circle');
  const gaugeText = document.getElementById('gauge-score');
  const gaugeState = document.getElementById('gauge-state');
  if (gaugeCircle) {
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (focusScore / 100) * circumference;
    gaugeCircle.style.strokeDashoffset = offset;
    const colors = { focused: '#00C48C', moderate: '#2E86FF', distracted: '#FF9800', relaxed: '#7C4DFF' };
    gaugeCircle.style.stroke = colors[stateClass];
  }
  if (gaugeText) gaugeText.textContent = focusScore;
  if (gaugeState) gaugeState.textContent = state;

  // Update state indicator
  const si = document.getElementById('state-indicator');
  if (si) {
    si.className = 'state-indicator ' + stateClass;
    si.querySelector('.si-icon').textContent = icon;
    si.querySelector('h4').textContent = state;
    si.querySelector('p').textContent = desc;
  }

  // Update detail cards
  const ratio = denominator > 0 ? (beta / denominator).toFixed(2) : '0.00';
  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('rd-alpha', alpha + 'μV');
  el('rd-beta', beta + 'μV');
  el('rd-theta', theta + 'μV');
  el('rd-ratio', ratio);
}
