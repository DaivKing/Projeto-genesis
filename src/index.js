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

  // Cores fixas para cada tipo de linha
  const corCusto = '#6366f1';      // azul violeta
  const corReceita = '#22c55e';    // verde
  const corLucro = '#f59e42';      // laranja
  const corBreakEven = '#ef4444';  // vermelho
  const corLucroMax = '#facc15';   // amarelo

  cenarios.forEach(cen => {
    const { a, b, c, p, nome } = cen;

    const custoYs = XS.map(x => custoTotal(a, b, c, x));
    const receitaYs = XS.map(x => receita(x, p));
    const lucroYs = XS.map(x => lucro(a, b, c, p, x));

    datasets.push({
      label: `Custo — ${nome}`,
      data: custoYs,
      borderColor: corCusto,
      backgroundColor: corCusto + '22',
      borderWidth: 3,
      fill: false,
      tension: 0.25,
      pointRadius: 2.5,
      pointHoverRadius: 6
    });
    datasets.push({
      label: `Receita — ${nome}`,
      data: receitaYs,
      borderColor: corReceita,
      backgroundColor: corReceita + '22',
      borderDash: [8, 6],
      borderWidth: 3,
      fill: false,
      tension: 0.18,
      pointRadius: 2.5,
      pointHoverRadius: 6
    });
    datasets.push({
      label: `Lucro — ${nome}`,
      data: lucroYs,
      borderColor: corLucro,
      backgroundColor: corLucro + '22',
      borderDash: [2, 6],
      borderWidth: 3,
      fill: false,
      tension: 0.18,
      pointRadius: 2.5,
      pointHoverRadius: 6
    });

    const breakEvens = calcularBreakEven(a, b, c, p);
    breakEvens.forEach(xBE => {
      if (dentroDoRange(xBE, XS)) {
        datasets.push({
          label: `Break-even ${nome} (x=${xBE.toFixed(2)})`,
          data: XS.map(x => (x === Math.round(xBE) ? receita(x, p) : null)),
          borderColor: corBreakEven,
          backgroundColor: corBreakEven,
          pointRadius: 8,
          pointStyle: 'rectRounded',
          borderWidth: 0,
          showLine: false
        });
      }
    });

    const pontoL = pontoLucroMaximo(a, b, c, p);
    if (pontoL && dentroDoRange(pontoL.xV, XS)) {
      datasets.push({
        label: `Lucro máximo ${nome} (x=${pontoL.xV.toFixed(2)})`,
        data: XS.map(x => (x === Math.round(pontoL.xV) ? pontoL.yV : null)),
        borderColor: corLucroMax,
        backgroundColor: corLucroMax,
        pointRadius: 11,
        pointStyle: 'triangle',
        borderWidth: 0,
        showLine: false
      });
    }
  });

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: { labels: XS, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: { size: 15, weight: 'bold' },
            boxWidth: 28,
            padding: 18,
            usePointStyle: true
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#2563eb',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#1e293b',
          borderWidth: 1.5,
          padding: 12
        }
      },
      layout: {
        padding: 20
      },
      scales: {
        x: {
          grid: {
            color: '#e0e7ff',
            lineWidth: 1.5
          },
          ticks: {
            color: '#334155',
            font: { size: 13 }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#e0e7ff',
            lineWidth: 1.5
          },
          ticks: {
            color: '#334155',
            font: { size: 13 }
          }
        }
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
  atualizarUI();
}

function atualizarUI() {
  atualizarListaCenarios();
  gerarGrafico();
  atualizarResultados();
}

function atualizarResultados() {
  if (cenarios.length === 0) {
    document.getElementById("resultado-minimo").textContent = "Ponto mínimo: --";
    document.getElementById("resultado-custo-minimo").textContent = "Custo mínimo: --";
    document.getElementById("resultado-cm").textContent = "Custo médio (x=10): --";
    document.getElementById("resultado-cmg").textContent = "Custo marginal (x=10): --";
    document.getElementById("resultado-break-even").textContent = "Break-even: --";
    document.getElementById("resultado-lucro-max").textContent = "Lucro máximo: --";
    return;
  }
  const { a, b, c, p } = cenarios[0];
  // Ponto mínimo
  const min = pontoMinimo(a, b, c);
  if (min) {
    document.getElementById("resultado-minimo").textContent = `Ponto mínimo: x = ${min.xV.toFixed(2)}`;
    document.getElementById("resultado-custo-minimo").textContent = `Custo mínimo: R$ ${min.yV.toFixed(2)}`;
  } else {
    document.getElementById("resultado-minimo").textContent = "Ponto mínimo: --";
    document.getElementById("resultado-custo-minimo").textContent = "Custo mínimo: --";
  }
  // Custo médio e marginal para x=10
  document.getElementById("resultado-cm").textContent = `Custo médio (x=10): R$ ${custoMedio(a, b, c, 10).toFixed(2)}`;
  document.getElementById("resultado-cmg").textContent = `Custo marginal (x=10): R$ ${custoMarginal(a, b, 10).toFixed(2)}`;
  // Break-even
  const bes = calcularBreakEven(a, b, c, p).filter(x => x >= 0);
  if (bes.length > 0) {
    document.getElementById("resultado-break-even").textContent = `Break-even: x = ${bes.map(x => x.toFixed(2)).join(" ou x = ")}`;
  } else {
    document.getElementById("resultado-break-even").textContent = "Break-even: --";
  }
  // Lucro máximo
  const pl = pontoLucroMaximo(a, b, c, p);
  if (pl && pl.xV >= 0) {
    document.getElementById("resultado-lucro-max").textContent = `Lucro máximo: x = ${pl.xV.toFixed(2)}, lucro = R$ ${pl.yV.toFixed(2)}`;
  } else {
    document.getElementById("resultado-lucro-max").textContent = "Lucro máximo: --";
  }
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