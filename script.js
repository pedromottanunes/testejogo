/*  ========  utilidades  ========  */

// Arredondamento para duas casas decimais
const round2 = n => Math.round(n * 100) / 100;

// Cria um input numérico com rótulo
function makeNumberInput(id, label, placeholder = "") {
  const wrapper = document.createElement("div");

  const lbl = document.createElement("label");
  lbl.htmlFor = id;
  lbl.textContent = label;

  const inp = document.createElement("input");
  inp.type = "number";
  inp.id = id;
  inp.min = "0";
  inp.step = "any";
  inp.placeholder = placeholder;
  inp.required = true;

  wrapper.append(lbl, inp);
  return wrapper;
}

/*  ========  lógica principal  ========  */

const shapeSelect = document.getElementById("shapeSelect");
const inputsContainer = document.getElementById("inputsContainer");
const calcBtn = document.getElementById("calcBtn");
const resultDiv = document.getElementById("result");

// Mapeia cada forma aos campos necessários e à fórmula de área
const shapes = {
  square: {
    fields: [
      () => makeNumberInput("side", "Lado (cm)")
    ],
    area: data => data.side ** 2,
    label: "cm²"
  },

  rectangle: {
    fields: [
      () => makeNumberInput("base", "Base (cm)"),
      () => makeNumberInput("height", "Altura (cm)")
    ],
    area: data => data.base * data.height,
    label: "cm²"
  },

  triangle: {
    fields: [
      () => makeNumberInput("base", "Base (cm)"),
      () => makeNumberInput("height", "Altura (cm)")
    ],
    area: data => (data.base * data.height) / 2,
    label: "cm²"
  },

  circle: {
    fields: [
      () => makeNumberInput("radius", "Raio (cm)")
    ],
    area: data => Math.PI * data.radius ** 2,
    label: "cm²"
  },

  trapezoid: {
    fields: [
      () => makeNumberInput("base1", "Base maior (cm)"),
      () => makeNumberInput("base2", "Base menor (cm)"),
      () => makeNumberInput("height", "Altura (cm)")
    ],
    area: data => ((data.base1 + data.base2) * data.height) / 2,
    label: "cm²"
  }
};

// Sempre que mudar a forma, recria o formulário correspondente
shapeSelect.addEventListener("change", () => {
  const key = shapeSelect.value;
  inputsContainer.innerHTML = ""; // limpa

  if (!key) return;

  shapes[key].fields.forEach(fn => inputsContainer.append(fn()));
  calcBtn.disabled = false;
  resultDiv.textContent = "";
});

// Executa o cálculo quando o usuário clicar
calcBtn.addEventListener("click", () => {
  const key = shapeSelect.value;
  if (!key) return;

  // Coleta valores numéricos
  const data = {};
  inputsContainer.querySelectorAll("input").forEach(inp => {
    data[inp.id] = parseFloat(inp.value);
  });

  // Validação simples
  const invalid = Object.values(data).some(v => isNaN(v) || v <= 0);
  if (invalid) {
    resultDiv.textContent = "Preencha todos os valores corretamente 😉";
    return;
  }

  // Calcula e exibe
  const area = shapes[key].area(data);
  resultDiv.textContent = `Área: ${round2(area)} ${shapes[key].label}`;
});
