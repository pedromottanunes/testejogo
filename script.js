/* ========= CONFIGURAÇÕES INICIAIS ========= */
const slopeInput     = document.getElementById("slope");
const interceptInput = document.getElementById("intercept");
const slopeVal       = document.getElementById("slopeVal");
const interceptVal   = document.getElementById("interceptVal");
const messageEl      = document.getElementById("message");
const scoreEl        = document.getElementById("scoreVal");
const checkBtn       = document.getElementById("checkBtn");
const newTargetBtn   = document.getElementById("newTargetBtn");

let chart, target, score = 0;

/* ========= FUNÇÕES UTILITÁRIAS ========= */
function randomInRange(min, max, step = 1) {
  const nSteps = Math.floor((max - min) / step);
  return (min + step * Math.floor(Math.random() * (nSteps + 1)));
}

function generateTarget() {
  // x entre -5 e 5 | y entre -10 e 10
  return { x: randomInRange(-5, 5, 1), y: randomInRange(-10, 10, 1) };
}

function lineData(m, b) {
  // Dois pontos para traçar a reta
  const xMin = -5, xMax = 5;
  return [
    { x: xMin, y: m * xMin + b },
    { x: xMax, y: m * xMax + b }
  ];
}

function updateChart(m, b) {
  const line = lineData(m, b);
  chart.data.datasets[0].data = line;
  chart.data.datasets[1].data = [target];
  chart.update();
}

/* ========= INICIALIZAÇÃO DO CHART ========= */
function initChart() {
  const ctx = document.getElementById("chart").getContext("2d");

  chart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Sua reta",
          data: lineData(1, 0),
          showLine: true,
          borderWidth: 2,
          borderColor: "#2563eb",
          pointRadius: 0
        },
        {
          label: "Ponto-alvo",
          data: [target],
          backgroundColor: "#e11d48",
          pointRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { min: -6, max: 6, grid: { color: "#94a3b8" } },
        y: { min: -12, max: 12, grid: { color: "#94a3b8" } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

/* ========= LÓGICA DO JOGO ========= */
function resetGame() {
  target = generateTarget();
  updateChart(Number(slopeInput.value), Number(interceptInput.value));
  messageEl.textContent = `Ajuste m e b para que a reta passe por (${target.x}, ${target.y}).`;
}

function checkAnswer() {
  const m = Number(slopeInput.value);
  const b = Number(interceptInput.value);
  const yLine = m * target.x + b;

  // tolerância de ±0.5
  if (Math.abs(yLine - target.y) <= 0.5) {
    score++;
    messageEl.textContent = "🎉 Parabéns! Acertou.";
    resetGame();
  } else {
    messageEl.textContent = "❌ Ainda não. Tente ajustar melhor.";
  }
  scoreEl.textContent = score;
}

/* ========= EVENTOS ========= */
slopeInput.addEventListener("input", () => {
  slopeVal.textContent = slopeInput.value;
  updateChart(Number(slopeInput.value), Number(interceptInput.value));
});
interceptInput.addEventListener("input", () => {
  interceptVal.textContent = interceptInput.value;
  updateChart(Number(slopeInput.value), Number(interceptInput.value));
});
checkBtn.addEventListener("click", checkAnswer);
newTargetBtn.addEventListener("click", resetGame);

/* ========= START ========= */
window.addEventListener("DOMContentLoaded", () => {
  target = generateTarget();
  initChart();
  updateChart(1, 0);
  messageEl.textContent = `Ajuste m e b para que a reta passe por (${target.x}, ${target.y}).`;
});
