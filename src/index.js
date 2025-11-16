//------------------------------ Cálculos ----------------------------//

// Calcula o custo total para um dado x
function custoTotal(a, b, c, x) {
  // Calcula o custo total para um dado x
  // a: coeficiente quadrático
  // b: coeficiente linear
  // c: custo fixo
  // x: quantidade produzida
  // Retorna o custo total calculado
  return a * x * x + b * x + c;
}

// Calcula o custo médio para um dado x
function custoMedio(a, b, c, x) {
  // Calcula o custo médio para um dado x
  // Retorna 0 se x for 0 para evitar divisão por zero
  // Retorna o custo médio calculado
  return x === 0 ? 0 : custoTotal(a, b, c, x) / x;
}

// Calcula o custo marginal para um dado x
function custoMarginal(a, b, x) {
  // Calcula o custo marginal para um dado x
  // Derivada da função de custo total em relação a x
  // Retorna o custo marginal calculado
  return 2 * a * x + b;
}

// Calcula o ponto mínimo da função de custo (vértice da parábola)
function pontoMinimo(a, b, c) {
  // Calcula o ponto mínimo da função de custo (vértice da parábola)
  // Retorna null se a = 0 (função não é quadrática)
  // Retorna um objeto com x e y do mínimo
  if (a === 0) return null; // Se não existir ponto mínimo
  const xV = -b / (2 * a);
  const yV = custoTotal(a, b, c, xV);
  return { xV, yV };
}

// Calcula a receita para um dado x e preço p
function receita(x, p) {
  return p * x;
}

// Calcula o lucro para um dado x, preço p e custos a, b, c
function lucro(a, b, c, p, x) {
  const custo = custoTotal(a, b, c, x);
  return receita(x, p) - custo;
}

// Para break-even: resolver ax^2 + (b - p)x + c = 0
function calcularBreakEven(a, b, c, p) {
  const A = a;
  const B = b - p;
  const C = c;

  const delta = B * B - 4 * A * C;
  if (delta < 0) {
    return []; // sem raízes reais
  } else if (delta === 0) {
    const x = -B / (2 * A);
    return [x];
  } else {
    const x1 = (-B + Math.sqrt(delta)) / (2 * A);
    const x2 = (-B - Math.sqrt(delta)) / (2 * A);
    return [x1, x2];
  }
}

// Calcula o ponto de lucro máximo para um dado preço p
function pontoLucroMaximo(a, b, c, p) {
  // L(x) = p*x - (a x^2 + b x + c) = -a x^2 + (p - b)x - c
  // Coeficiente de x^2 é -a, de x é (p - b)
  const A = -a;
  const B = p - b;
  if (A === 0) {
    return null;
  }
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
  atualizarListaCenarios();
  gerarGrafico();
}


//------------------------------ Gráfico ----------------------------//
let chart = null; // Referência ao gráfico Chart.js

function gerarGrafico() {
  const ctx = document.getElementById("graficoPrincipal").getContext("2d");

  const datasets = [];

  // Para cada cenário, criar curvas
  cenarios.forEach(cen => {
    const { a, b, c, p, cor, nome } = cen;
    const xs = Array.from({ length: 101 }, (_, i) => i); // de 0 a 100 unidades
    const custoYs = xs.map(x => custoTotal(a, b, c, x));
    const receitaYs = xs.map(x => receita(x, p));
    const lucroYs = xs.map(x => lucro(a, b, c, p, x));

    datasets.push({
      label: `Custo — ${nome}`,
      data: custoYs,
      borderColor: cor,
      fill: false,
      tension: 0.2
    });
    datasets.push({
      label: `Receita — ${nome}`,
      data: receitaYs,
      borderColor: cor,
      borderDash: [5, 5], // linha tracejada
      fill: false,
      tension: 0.2
    });
    datasets.push({
      label: `Lucro — ${nome}`,
      data: lucroYs,
      borderColor: cor,
      borderDash: [10, 5],
      fill: false,
      tension: 0.2
    });

    // Break-even (se existir)
    const bEs = calcularBreakEven(a, b, c, p);
    bEs.forEach((xBE) => {
      if (xBE >= 0 && xBE <= xs[xs.length - 1]) {
        datasets.push({
          label: `BE ${nome} (x=${xBE.toFixed(2)})`,
          data: xs.map(x => (x === Math.round(xBE) ? receita(x, p) : null)),
          borderColor: cor,
          pointRadius: 5,
          showLine: false
        });
      }
    });

    // Lucro máximo
    const pontoL = pontoLucroMaximo(a, b, c, p);
    if (pontoL && pontoL.xV >= 0 && pontoL.xV <= xs[xs.length - 1]) {
      datasets.push({
        label: `Lucro máximo ${nome} (x=${pontoL.xV.toFixed(2)})`,
        data: xs.map(x => (x === Math.round(pontoL.xV) ? pontoL.yV : null)),
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
    data: { labels: Array.from({ length: 101 }, (_, i) => i), datasets },
    options: {
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        tooltip: { mode: 'index', intersect: false }
      }
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
  atualizarListaCenarios();
  gerarGrafico();
}

//------------------------------ Resultados ----------------------------//
document.getElementById("gerar").addEventListener("click", () => {
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const c = parseFloat(document.getElementById("c").value);
  const p = parseFloat(document.getElementById("preco").value);

  // Se ainda não tem cenário “principal”, substitui ou adiciona
  if (cenarios.length === 0) {
    adicionarCenario("Principal", a, b, c, p);
  } else {
    // Atualiza primeiro cenário
    cenarios[0] = { ...cenarios[0], a, b, c, p };
  }

  atualizarListaCenarios();
  gerarGrafico();
});

document.getElementById("adicionar-cenario").addEventListener("click", () => {
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const c = parseFloat(document.getElementById("c").value);
  const p = parseFloat(document.getElementById("preco").value);

  const nome = prompt("Nome do cenário:");
  adicionarCenario(nome || `Cenário ${cenarios.length + 1}`, a, b, c, p);
  atualizarListaCenarios();
  gerarGrafico();
});

document.getElementById("limpar-cenarios").addEventListener("click", () => {
  limparCenarios();
});
