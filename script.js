let level = 0;
let timeLimit = 1600;
let correctAnswer = "";
let startTime;
let timer;
let hardMode = false;
let gameActive = false;
let pendingNext = false;

const rules = [
  "Click the COLOR you see",
  "Click RED if text is BLUE",
  "Click BLUE if text is RED"
];

const startBtn = document.getElementById("startBtn");
const redBtn = document.getElementById("redBtn");
const blueBtn = document.getElementById("blueBtn");
const ruleBox = document.getElementById("rule");
const signalBox = document.getElementById("signal");
const statusBox = document.getElementById("status");
const bar = document.getElementById("bar");
const leaderboard = document.getElementById("leaderboard");
const nameInput = document.getElementById("playerName");

const normalBtn = document.getElementById("normalMode");
const hardBtn = document.getElementById("hardMode");
const decisionBox = document.getElementById("decisionBox");
const continueBtn = document.getElementById("continueBtn");
const restartBtn = document.getElementById("restartBtn");

/* MODE */
normalBtn.onclick = () => setMode(false);
hardBtn.onclick = () => setMode(true);

function setMode(isHard) {
  hardMode = isHard;
  normalBtn.classList.toggle("active", !isHard);
  hardBtn.classList.toggle("active", isHard);
}

/* BUTTONS */
startBtn.onclick = startGame;
redBtn.onclick = () => check("RED");
blueBtn.onclick = () => check("BLUE");

continueBtn.onclick = () => {
  decisionBox.classList.add("hidden");
  pendingNext = false;

  timeLimit -= hardMode ? 70 : 50;
  timeLimit = Math.max(timeLimit, hardMode ? 550 : 700);

  nextRound();
};

restartBtn.onclick = () => {
  decisionBox.classList.add("hidden");
  pendingNext = false;
  startGame();
};

/* GAME FLOW */
loadLeaderboard();

function startGame() {
  if (!nameInput.value.trim()) {
    alert("Enter your name");
    return;
  }
  level = 0;
  timeLimit = hardMode ? 1100 : 1600;
  statusBox.innerHTML = "";
  nextRound();
}

function nextRound() {
  gameActive = false;
  level++;
  ruleBox.innerHTML = "Get Ready...";
  signalBox.innerHTML = "";
  redBtn.disabled = blueBtn.disabled = true;
  bar.style.width = "100%";

  setTimeout(showChallenge, Math.random() * 1200 + 800);
}

function showChallenge() {
  const ruleIndex = Math.floor(Math.random() * rules.length);
  const color = Math.random() > 0.5 ? "RED" : "BLUE";

  ruleBox.innerHTML = rules[ruleIndex];
  signalBox.innerHTML =
    `<span style="color:${color === "RED" ? "#ef4444" : "#3b82f6"}">${color}</span>`;

  if (ruleIndex === 0) correctAnswer = color;
  if (ruleIndex === 1) correctAnswer = color === "BLUE" ? "RED" : "BLUE";
  if (ruleIndex === 2) correctAnswer = color === "RED" ? "BLUE" : "RED";

  gameActive = true;
  startTime = Date.now();
  redBtn.disabled = blueBtn.disabled = false;

  bar.style.transition = "none";
  bar.style.width = "100%";
  setTimeout(() => {
    bar.style.transition = `width ${timeLimit}ms linear`;
    bar.style.width = "0%";
  }, 50);

  timer = setTimeout(() => {
    if (gameActive) gameOver("Too Slow ⏱️");
  }, timeLimit);
}

function check(choice) {
  if (!gameActive || pendingNext) return;

  gameActive = false;
  clearTimeout(timer);

  const reaction = Date.now() - startTime;

  if (choice === correctAnswer && reaction <= timeLimit) {
    statusBox.innerHTML = `✅ Level ${level} cleared (${reaction} ms)`;
    pendingNext = true;
    decisionBox.classList.remove("hidden");
    redBtn.disabled = blueBtn.disabled = true;
  } else {
    gameOver("Wrong ❌");
  }
}

function gameOver(reason) {
  clearTimeout(timer);
  redBtn.disabled = blueBtn.disabled = true;
  statusBox.innerHTML = `💀 GAME OVER<br>${reason}<br>Level ${level}`;
  saveBestScore(nameInput.value.trim(), level);
  loadLeaderboard();
}

/* LEADERBOARD */
function saveBestScore(name, score) {
  let board = JSON.parse(localStorage.getItem("btm_board")) || [];
  const existing = board.find(p => p.name === name);

  if (existing) {
    if (score > existing.score) existing.score = score;
  } else {
    board.push({ name, score });
  }

  board.sort((a, b) => b.score - a.score);
  board = board.slice(0, 5);

  localStorage.setItem("btm_board", JSON.stringify(board));
}

function loadLeaderboard() {
  const board = JSON.parse(localStorage.getItem("btm_board")) || [];
  leaderboard.innerHTML = "";

  board.forEach((p, i) => {
    leaderboard.innerHTML += `
      <tr>
        <td>${i === 0 ? "👑" : i + 1}</td>
        <td>${p.name}</td>
        <td>${p.score}</td>
      </tr>
    `;
  });
}
