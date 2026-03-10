let names = ['MARI', 'MATI'];
let totalTime = 60;
let firstPlayer = 0;
let times = [60, 60];
let active = -1;
let interval = null;
let running = false;
let gameOver = false;
let onGameScreen = false;

const nameIn1 = document.getElementById('name1');
const nameIn2 = document.getElementById('name2');

nameIn1.addEventListener('input', () => {
  document.getElementById('sel1').textContent = nameIn1.value.toUpperCase() || 'MÄNGIJA 1';
});
nameIn2.addEventListener('input', () => {
  document.getElementById('sel2').textContent = nameIn2.value.toUpperCase() || 'MÄNGIJA 2';
});

function selectFirst(idx) {
  firstPlayer = idx;
  document.getElementById('sel1').classList.toggle('selected', idx === 0);
  document.getElementById('sel2').classList.toggle('selected', idx === 1);
}

function startGame() {
  names[0] = (nameIn1.value.trim() || 'MÄNGIJA 1').toUpperCase();
  names[1] = (nameIn2.value.trim() || 'MÄNGIJA 2').toUpperCase();
  totalTime = Math.max(5, parseInt(document.getElementById('timeInput').value) || 60);

  document.getElementById('gName1').textContent = names[0];
  document.getElementById('gName2').textContent = names[1];

  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  onGameScreen = true;

  resetTimers();
}

function resetTimers() {
  clearInterval(interval);
  interval = null;
  running = false;
  gameOver = false;
  active = -1;
  times = [totalTime, totalTime];
  updateDisplays();
  setBoxStyles();
}

function updateDisplays() {
  document.getElementById('tDisp1').textContent = times[0];
  document.getElementById('tDisp2').textContent = times[1];
}

function setBoxStyles() {
  document.getElementById('tBox1').className = 'timer-box ' + (active === 0 ? 'active' : 'inactive');
  document.getElementById('tBox2').className = 'timer-box ' + (active === 1 ? 'active' : 'inactive');
}

function tick() {
  if (active < 0) return;
  times[active]--;
  updateDisplays();
  if (times[active] <= 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(interval);
  interval = null;
  running = false;
  gameOver = true;
  times[active] = 0;
  updateDisplays();
  const winner = names[1 - active];
  document.getElementById('overlayMsg').textContent = winner + ' WINS!';
  document.getElementById('overlay').classList.add('show');
}

function pressStartStop() {
  if (gameOver) return;
  if (running) {
    clearInterval(interval);
    interval = null;
    running = false;
  } else {
    if (active < 0) active = firstPlayer;
    running = true;
    setBoxStyles();
    interval = setInterval(tick, 1000);
  }
}

function correctAnswer(playerIdx) {
  if (!running || active !== playerIdx || gameOver) return;
  clearInterval(interval);
  active = 1 - playerIdx;
  setBoxStyles();
  interval = setInterval(tick, 1000);
}

function skipAnswer(playerIdx) {
  if (!running || active !== playerIdx || gameOver) return;
  times[active] = Math.max(0, times[active] - 3);
  updateDisplays();
  if (times[active] <= 0) {
    endGame();
  }
}

function newGame() {
  document.getElementById('overlay').classList.remove('show');
  resetTimers();
}

function backToSetup() {
  clearInterval(interval);
  interval = null;
  running = false;
  gameOver = false;
  active = -1;
  onGameScreen = false;
  if (document.fullscreenElement) document.exitFullscreen();
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('game').style.display = 'none';
  document.getElementById('setup').style.display = 'block';
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener('keydown', (e) => {
  if (!onGameScreen) return;
  if (e.target.tagName === 'INPUT') return;

  const key = e.key.toLowerCase();

  if (key === ' ') {
    e.preventDefault();
    pressStartStop();
  } else if (key === 'f' && !e.shiftKey) {
    correctAnswer(0);
  } else if (key === 'f' && e.shiftKey) {
    toggleFullscreen();
  } else if (key === 's') {
    skipAnswer(0);
  } else if (key === 'j') {
    correctAnswer(1);
  } else if (key === 'l') {
    skipAnswer(1);
  } else if (key === 'n' && gameOver) {
    newGame();
  } else if (key === 'b') {
    backToSetup();
  }
});
