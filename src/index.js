//------------------------------ Cálculos ----------------------------//

// Calcula o custo total para um dado x
function custoTotal(a, b, c, x) {
  // Calcula o custo total para um dado x
  // a: coeficiente quadrático
  // b: coeficiente linear
  // c: custo fixo
  // x: quantidade produzida
  // Retorna o custo total calculado
  return a * x ** 2 + b * x + c;
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

let chart = null; // Referência ao gráfico Chart.js

//------------------------------ Gráfico ----------------------------//
// Gera o gráfico de custo total usando Chart.js
function gerarGrafico(a, b, c) {
  // Gera o gráfico de custo total usando Chart.js
  // a, b, c: parâmetros da função de custo
  // Gera valores de x de 0 a 20
  const xs = Array.from({ length: 21 }, (_, i) => i);
  // Calcula o custo total para cada x
  const ys = xs.map(x => custoTotal(a, b, c, x));

  // Destroi o gráfico anterior, se existir
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

// Evento do botão para gerar análise e atualizar resultados
document.getElementById("gerar").addEventListener("click", () => {
  // Exibe o gráfico ao clicar no botão (remove a classe oculto)
  const graficoContainer = document.getElementById("grafico-container");
  if (graficoContainer.classList.contains("oculto")) {
    graficoContainer.classList.remove("oculto");
  }
  // Evento do botão para gerar análise e atualizar resultados
  // Obtém valores dos parâmetros do formulário
  // Atualiza o gráfico
  // Calcula o ponto mínimo
  // Calcula o custo médio para x = 10
  // Calcula o custo marginal para x = 10
  // Exibe resultados na tela
  // Obtém valores dos parâmetros
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const c = parseFloat(document.getElementById("c").value);

  gerarGrafico(a, b, c);

  // Calcular resultados
  const minimo = pontoMinimo(a, b, c);
  const cm10 = custoMedio(a, b, c, 10);
  const cmg10 = custoMarginal(a, b, 10);

  // Exibir resultados na tela
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