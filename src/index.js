//------------------------------ Cálculos ----------------------------//

function custoTotal(a, b, c, x) {
  return a * x ** 2 + b * x + c;
}

function custoTotal(a, b, c, x) {
  return a * x ** 2 + b * x + c;
}

function custoMedio(a, b, c, x) {
  return x === 0 ? 0 : custoTotal(a, b, c, x) / x;
}

function custoMarginal(a, b, x) {
  return 2 * a * x + b;
}

function pontoMinimo(a, b, c) {
  if (a === 0) return null; // Se não exister ponto mínimo
  const xV = -b / (2 * a);
  const yV = custoTotal(a, b, c, xV);
  return { xV, yV };
}

let chart = null;

//------------------------------ Gráfico ----------------------------//
function gerarGrafico(a, b, c) {
  const xs = Array.from({ length: 21 }, (_, i) => i);
  const ys = xs.map(x => custoTotal(a, b, c, x));

  if (chart) chart.destroy();

  const ctx = document.getElementById("graficoCusto").getContext("2d");
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xs,
      datasets: [{
        label: 'Custo Total (R$)',
        data: ys,
        borderColor: 'blue',
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

//------------------------------ Resultados ----------------------------//

document.getElementById("gerar").addEventListener("click", () => {

  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const c = parseFloat(document.getElementById("c").value);

  gerarGrafico(a, b, c);

  // Calcular resultados
  const minimo = pontoMinimo(a, b, c);
  const cm10 = custoMedio(a, b, c, 10);
  const cmg10 = custoMarginal(a, b, 10);

  // Exibir resultados
  if (minimo) {
    document.getElementById("resultado-minimo").innerText =
      `Ponto mínimo (quantidade ótima): x = ${minimo.xV.toFixed(2)}`;

    document.getElementById("resultado-custo-minimo").innerText =
      `Custo mínimo: R$ ${minimo.yV.toFixed(2)}`;
  } else {
    document.getElementById("resultado-minimo").innerText =
      "Ponto mínimo: não existe (a = 0)";
    document.getElementById("resultado-custo-minimo").innerText = "--";
  }

  document.getElementById("resultado-cm").innerText =
    `Custo Médio (x = 10): R$ ${cm10.toFixed(2)}`;

  document.getElementById("resultado-cmg").innerText =
    `Custo Marginal (x = 10): R$ ${cmg10.toFixed(2)}`;
});