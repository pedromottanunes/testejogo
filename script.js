/* ======== utilidades ======== */

// Arredonda para 2 casas
const round2 = n => Math.round(n * 100) / 100;

// Cria input numérico com rótulo
function makeInput(id, label) {
  const wrapper = document.createElement("div");

  const lbl = document.createElement("label");
  lbl.htmlFor = id;
  lbl.textContent = label;

  const inp = document.createElement("input");
  inp.type = "number";
  inp.id = id;
  inp.min = "0";
  inp.step = "any";
  inp.required = true;

  wrapper.append(lbl, inp);
  return wrapper;
}

/* ======== dados das formas ======== */

const shapes = {
  square: {
    fields: [() => makeInput("side", "Lado (cm)")],
    area: d => d.side ** 2,
    svg: `
      <svg viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="#f3f6ff" stroke="#4564f2" stroke-width="4"/>
      </svg>`
  },

  rectangle: {
    fields: [
      () => makeInput("base", "Base (cm)"),
      () => makeInput("height", "Altura (cm)")
    ],
    area: d => d.base * d.height,
    svg: `
      <svg viewBox="0 0 120 80">
        <rect x="5" y="5" width="110" height="70" fill="#f3f6ff" stroke="#4564f2" stroke-width="4"/>
      </svg>`
  },

  triangle: {
    fields: [
      () => makeInput("base", "Base (cm)"),
      () => makeInput("height", "Altura (cm)")
    ],
    area: d => (d.base * d.height) / 2,
    svg: `
      <svg viewBox="0 0 100 86">
        <polygon points="10,80 90,80 50,10" fill="#f3f6ff" stroke="#4564f2" stroke-width="4"/>
      </svg>`
  },

  circle: {
    fields: [() => makeInput("radius", "Raio (cm)")],
    area: d => Math.PI * d.radius ** 2,
    svg: `
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#f3f6ff" stroke="#4564f2" stroke-width="4"/>
      </svg>`
  },

  trapezoid: {
    fields: [
      () => makeInput("base1", "Base maior (cm)"),
      () => makeInput("base2", "Base menor (cm)"),
      () => makeInput("height", "Altura (cm)")
    ],
    area: d => ((d.base1 + d.base2) * d.height) / 2,
    svg: `
      <svg viewBox="0 0 120 80">
        <polygon points="15,75 105,75 90,15 30,15" fill="#f3f6ff" stroke="#4564f2" stroke-width="4"/>
      </svg>`
  }
};

/* ======== elementos do DOM ======== */

const shapeSelect = document.getElementById("shapeSelect");
const inputsContainer = document.getElementById("inputsContainer");
const shapeIllustration = document.getElementById("shapeIllustration");
const calcBtn = document.getElementById("calcBtn");
const resultDiv = document.getElementById("result");

/* ======== interatividade ======== */

// Sempre que muda a forma, redesenha campos + ilustração
shapeSelect.addEventListener("change", () => {
  const key = shapeSelect.value;
  inputsContainer.innerHTML = "";
  shapeIllustration.innerHTML = "";
  resultDiv.textContent = "";
  calcBtn.disabled = !key;

  if (!key) return;

  // Campos
  shapes[key].fields.forEach(addField => inputsContainer.append(addField()));

  // Desenho (SVG)
  shapeIllustration.innerHTML = shapes[key].svg;
});

// Cálculo ao clicar
calcBtn.addEventListener("click", () => {
  const key = shapeSelect.value;
  if (!key) return;

  // Coletar dados
  const data = {};
  inputsContainer.querySelectorAll("input").forEach(i => {
    data[i.id] = parseFloat(i.value);
  });

  // Validar
  const invalid = Object.values(data).some(v => isNaN(v) || v <= 0);
  if (invalid) {
    resultDiv.textContent = "Preencha todos os valores corretamente 🙂";
    return;
  }

  // Calcular
  const area = shapes[key].area(data);
  resultDiv.textContent = `Área: ${round2(area)} cm²`;
});
