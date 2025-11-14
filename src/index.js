function custoTotal(a, b, c, x) {
  return a * x ** 2 + b * x + c;
}

/* function pontoMinimo(a, b, c) {
  const xV = -b / (2 * a);
  const yV = custoTotal(a, b, c, xV);
  return { xV, yV };
}
 */

const a = 0.5;  // Custo cresce com a produção
const b = -10;  // Custo variável reduz conforme aumenta a produção
const c = 200;  // Custo fixo

for (let x = 0; x <= 20; x++) {
  console.log(`Produção: ${x} unidades -> Custo Total: R$${custoTotal(a, b, c, x).toFixed(2)}`);
}

const xs = Array.from({ length: 21 }, (_, i) => i);
const ys = xs.map(x => custoTotal(a, b, c, x));

const ctx = document.getElementById("graficoCusto").getContext("2d");
new Chart(ctx, {
  type: 'line',
  data: {
    labels: xs,
    datasets: [{
      label: 'Custo Total (R$)',
      data: ys,
      borderColor: 'blue',
      tension: 0.2,
      fill: false
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Custo Total em função da Produção'
      }
    },
    scales: {
      x: { title: { display: true, text: 'Quantidade Produzida' } },
      y: { title: { display: true, text: 'Custo Total (R$)' } }
    }
  }
});

// DICA: Para alterar os parâmetros do custo, edite as variáveis a, b e c acima.
// O gráfico será atualizado automaticamente ao recarregar a página.