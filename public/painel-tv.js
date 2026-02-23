// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  atualizarRelogio();
  carregarInfoPainel();
  
  setInterval(atualizarRelogio, 1000);
  setInterval(carregarInfoPainel, 30000); // Atualizar a cada 30 segundos
});

async function carregarInfoPainel() {
  try {
    const response = await fetch('/api/painel-tv/info');
    const dados = await response.json();

    const statusCirculo = document.getElementById('status-circulo');
    const statusTexto = document.getElementById('status-texto');

    if (dados.salaLivre) {
      statusCirculo.className = 'status-circulo livre';
      statusTexto.textContent = 'SALA LIVRE';
    } else {
      statusCirculo.className = 'status-circulo ocupada';
      statusTexto.textContent = 'SALA OCUPADA';
    }

    // Reunião Atual
    const reuniaoAtualContainer = document.getElementById('reuniao-atual-container');
    if (dados.reuniaoAtual) {
      reuniaoAtualContainer.style.display = 'block';
      document.getElementById('reuniao-atual-nome').textContent = dados.reuniaoAtual.nome;
      document.getElementById('reuniao-atual-setor').textContent = dados.reuniaoAtual.setor;
      document.getElementById('reuniao-atual-pessoas').textContent = `${dados.reuniaoAtual.qtd_pessoas} pessoa${dados.reuniaoAtual.qtd_pessoas > 1 ? 's' : ''}`;
      document.getElementById('reuniao-atual-horario').textContent = `${dados.reuniaoAtual.hora_inicio} às ${dados.reuniaoAtual.hora_fim}`;
      document.getElementById('reuniao-atual-descricao').textContent = dados.reuniaoAtual.descricao || '';
    } else {
      reuniaoAtualContainer.style.display = 'none';
    }

    // Próxima Reunião
    const proximaContainer = document.getElementById('proxima-reuniao-container');
    if (dados.proximaReuniао) {
      proximaContainer.style.display = 'block';
      document.getElementById('proxima-reuniao-nome').textContent = dados.proximaReuniао.nome;
      document.getElementById('proxima-reuniao-hora').textContent = dados.proximaReuniао.hora_inicio;
      document.getElementById('proxima-reuniao-setor').textContent = dados.proximaReuniао.setor;
    } else {
      proximaContainer.style.display = 'none';
    }
  } catch (erro) {
    console.error('Erro ao carregar informações do painel:', erro);
  }
}

function atualizarRelogio() {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  const segundos = String(agora.getSeconds()).padStart(2, '0');

  document.getElementById('relogio-grande').textContent = `${horas}:${minutos}:${segundos}`;
}
