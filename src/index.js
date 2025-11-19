//------------------------------ Utilidades ----------------------------//

function lerParametros() {
  return {
    a: parseFloat(a.value),
    b: parseFloat(b.value),
    c: parseFloat(c.value),
    p: parseFloat(preco.value)
  };
}

function dentroDoRange(x, xs) {
  return x >= 0 && x <= xs[xs.length - 1];
}

const XS = Array.from({ length: 101 }, (_, i) => i);

//------------------------------ Cálculos ----------------------------//

function custoTotal(a, b, c, x) {
  return a * x * x + b * x + c;
}

function custoMedio(a, b, c, x) {
  return x === 0 ? 0 : custoTotal(a, b, c, x) / x;
}

function custoMarginal(a, b, x) {
  return 2 * a * x + b;
}

function pontoMinimo(a, b, c) {
  if (a === 0) return null;
  const xV = -b / (2 * a);
  const yV = custoTotal(a, b, c, xV);
  return { xV, yV };
}

function receita(x, p) {
  return p * x;
}

function lucro(a, b, c, p, x) {
  return receita(x, p) - custoTotal(a, b, c, x);
}

function calcularBreakEven(a, b, c, p) {
  const A = a;
  const B = b - p;
  const C = c;

  const delta = B * B - 4 * A * C;
  if (delta < 0) return []; // sem raízes reais
  if (delta === 0) return [-B / (2 * A)]; // uma raiz real

  const raiz = Math.sqrt(delta);
  return [(-B + raiz) / (2 * A), (-B - raiz) / (2 * A)];
}

function pontoLucroMaximo(a, b, c, p) {
  const A = -a;
  const B = p - b;
  if (A === 0) return null;

  const xV = -B / (2 * A);
  const yV = lucro(a, b, c, p, xV);
  return { xV, yV };
}

//------------------------------ Cenários ----------------------------//

const cenarios = [];

function adicionarCenario(nome, a, b, c, p) {
  const cor = `hsl(${Math.random() * 360}, 70%, 50%)`;
  cenarios.push({ nome, a, b, c, p, cor });
}

function limparCenarios() {
  cenarios.length = 0;
  atualizarUI();
}

//------------------------------ Gráfico ----------------------------//

let chart = null;

function gerarGrafico() {
  const ctx = document.getElementById("graficoPrincipal").getContext("2d");
  const datasets = [];

  cenarios.forEach(cen => {
    const { a, b, c, p, cor, nome } = cen;

    const custoYs = XS.map(x => custoTotal(a, b, c, x));
    const receitaYs = XS.map(x => receita(x, p));
    const lucroYs = XS.map(x => lucro(a, b, c, p, x));

    datasets.push({ label: `Custo — ${nome}`, data: custoYs, borderColor: cor, fill: false, tension: 0.2 });
    datasets.push({ label: `Receita — ${nome}`, data: receitaYs, borderColor: cor, borderDash: [5, 5], fill: false, tension: 0.2 });
    datasets.push({ label: `Lucro — ${nome}`, data: lucroYs, borderColor: cor, borderDash: [10, 5], fill: false, tension: 0.2 });

    const breakEvens = calcularBreakEven(a, b, c, p);
    breakEvens.forEach(xBE => {
      if (dentroDoRange(xBE, XS)) {
        datasets.push({
          label: `BE ${nome} (x=${xBE.toFixed(2)})`,
          data: XS.map(x => (x === Math.round(xBE) ? receita(x, p) : null)),
          borderColor: cor,
          pointRadius: 5,
          showLine: false
        });
      }
    });

    const pontoL = pontoLucroMaximo(a, b, c, p);
    if (pontoL && dentroDoRange(pontoL.xV, XS)) {
      datasets.push({
        label: `Lucro máximo ${nome} (x=${pontoL.xV.toFixed(2)})`,
        data: XS.map(x => (x === Math.round(pontoL.xV) ? pontoL.yV : null)),
        borderColor: cor,
        pointRadius: 6,
        pointStyle: 'triangle',
        showLine: false
      });
    }
  });

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: { labels: XS, datasets },
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: { tooltip: { mode: 'index', intersect: false } }
    }
  });
}

//------------------------------ Interface ----------------------------//

function atualizarListaCenarios() {
  const container = document.getElementById("listaCenarios");
  container.innerHTML = '';

  cenarios.forEach((cen, i) => {
    const div = document.createElement("div");
    div.className = "cenario";
    div.innerHTML = `
      <strong>${cen.nome}</strong><br>
      a = ${cen.a}, b = ${cen.b}, c = ${cen.c}, p = ${cen.p}<br>
      <button onclick="removerCenario(${i})">Remover</button>
    `;
    container.appendChild(div);
  });
}

function removerCenario(index) {
  cenarios.splice(index, 1);
  atualizarUI();
}

function atualizarUI() {
  atualizarListaCenarios();
  gerarGrafico();
}

//------------------------------ Eventos ----------------------------//

document.getElementById("gerar").addEventListener("click", () => {
  const { a, b, c, p } = lerParametros();

  if (cenarios.length === 0) {
    adicionarCenario("Principal", a, b, c, p);
  } else {
    cenarios[0] = { ...cenarios[0], a, b, c, p };
  }

  atualizarUI();
});

document.getElementById("adicionar-cenario").addEventListener("click", () => {
  const { a, b, c, p } = lerParametros();
  const nome = prompt("Nome do cenário:");

  adicionarCenario(nome || `Cenário ${cenarios.length + 1}`, a, b, c, p);
  atualizarUI();
});

document.getElementById("limpar-cenarios").addEventListener("click", () => {
  limparCenarios();
});