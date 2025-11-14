// Função que calcula o custo total baseado na produção
// Parâmetros:
//   a: coeficiente do termo quadrático (custo que cresce com a produção)
//   b: coeficiente do termo linear (custo variável por unidade)
//   c: custo fixo (independente da produção)
//   x: quantidade produzida
function custoTotal(a, b, c, x) {
  return a * x ** 2 + b * x + c; // Fórmula do custo total
}

// Parâmetros do modelo de custo
const a = 0.5;   // Custo que cresce com a produção (quadrático)
const b = -10;   // Custo variável (negativo: economia de escala)
const c = 200;   // Custo fixo

// Gera um array de quantidades produzidas de 0 a 20
// xs = [0, 1, 2, ..., 20]
const xs = Array.from({ length: 21 }, (_, i) => i);

// Calcula o custo total para cada quantidade produzida
// ys[i] = custoTotal(a, b, c, xs[i])
const ys = xs.map(x => custoTotal(a, b, c, x));

// Seleciona o elemento canvas pelo id e obtém o contexto 2D para desenhar o gráfico
const canvas = document.getElementById("graficoCusto");
const ctx = canvas.getContext("2d");

// Cria o gráfico de linha usando Chart.js
new Chart(ctx, {
  type: 'line', // Tipo de gráfico: linha
  data: {
    labels: xs, // Eixo X: quantidades produzidas
    datasets: [{
      label: 'Custo Total (R$)', // Legenda do gráfico
      data: ys, // Eixo Y: custos totais
      borderColor: '#3b82f6', // Cor da linha
      backgroundColor: 'rgba(59, 130, 246, 0.1)', // Cor de preenchimento abaixo da linha
      pointBackgroundColor: '#2563eb', // Cor dos pontos
      pointRadius: 4, // Tamanho dos pontos
      tension: 0.25, // Suavização da curva
      fill: true // Preencher área sob a linha
    }]
  },
  options: {
    responsive: false, // Desativa responsividade para manter proporção fixa
    plugins: {
      title: {
        display: true, // Exibe o título
        text: 'Custo Total em função da Produção', // Texto do título
        color: '#222', // Cor do título
        font: { size: 20, weight: 'bold' } // Estilo do título
      },
      legend: {
        labels: { color: '#222', font: { size: 14 } } // Estilo da legenda
      },
      tooltip: {
        callbacks: {
          // Formata o texto do tooltip ao passar o mouse
          label: ctx => `Custo Total: R$${ctx.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true, // Exibe o título do eixo X
          text: 'Quantidade Produzida', // Texto do eixo X
          color: '#2563eb', // Cor do texto
          font: { size: 16 }
        },
        ticks: { color: '#222' } // Cor dos valores do eixo X
      },
      y: {
        title: {
          display: true, // Exibe o título do eixo Y
          text: 'Custo Total (R$)', // Texto do eixo Y
          color: '#2563eb', // Cor do texto
          font: { size: 16 }
        },
          ticks: {
          color: '#222', // Cor dos valores do eixo Y
          stepSize: 40, // Intervalo de 40 em 40
        },
        beginAtZero: true // Começa o eixo Y em zero
      }
    }
  }
});

// DICA: Para alterar os parâmetros do custo, edite as variáveis a, b e c acima.
// O gráfico será atualizado automaticamente ao recarregar a página.