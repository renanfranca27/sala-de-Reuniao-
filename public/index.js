// Estado da aplicação
let reservasGlobais = [];
let dataAtualFiltro = new Date().toISOString().split('T')[0];

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  preencherHorarios();
  document.getElementById('filtro-data').valueAsDate = new Date();
  carregarReservas();
  setInterval(carregarReservas, 30000); // Atualizar a cada 30 segundos
});

// ========== CARREGAMENTO DE DADOS ==========
async function carregarReservas() {
  try {
    const data = document.getElementById('filtro-data').value;
    const busca = document.getElementById('filtro-busca').value;
    
    let url = '/api/reservas?data=' + data;
    if (busca) {
      url += '&nome=' + encodeURIComponent(busca);
    }

    const response = await fetch(url);
    const dados = await response.json();
    reservasGlobais = dados;
    renderizarKanban();
  } catch (erro) {
    console.error('Erro ao carregar reservas:', erro);
    mostrarAviso('Erro ao carregar reservas');
  }
}

// ========== RENDERIZAÇÃO KANBAN ==========
function renderizarKanban() {
  const colunaManha = document.getElementById('coluna-manha');
  const colunaTarde = document.getElementById('coluna-tarde');

  colunaManha.innerHTML = '';
  colunaTarde.innerHTML = '';

  const reservasManha = [];
  const reservasTarde = [];

  reservasGlobais.forEach(reserva => {
    const horaInicio = parseInt(reserva.hora_inicio.split(':')[0]);
    
    if (horaInicio < 12) {
      reservasManha.push(reserva);
    } else {
      reservasTarde.push(reserva);
    }
  });

  // Ordenar por hora
  reservasManha.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  reservasTarde.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  // Renderizar cards
  reservasManha.forEach(reserva => {
    colunaManha.appendChild(criarCard(reserva));
  });

  reservasTarde.forEach(reserva => {
    colunaTarde.appendChild(criarCard(reserva));
  });

  // Mostrar mensagem se vazio
  if (reservasManha.length === 0) {
    colunaManha.innerHTML = '<div class="card-vazio">Nenhuma reserva</div>';
  }
  if (reservasTarde.length === 0) {
    colunaTarde.innerHTML = '<div class="card-vazio">Nenhuma reserva</div>';
  }
}

function criarCard(reserva) {
  const card = document.createElement('div');
  card.className = `kanban-card status-${reserva.status}`;
  card.onclick = () => abrirDetalhesReserva(reserva);

  const statusTexto = obterStatusTexto(reserva.status);
  const horaInicioFormatada = formatarHora(reserva.hora_inicio);
  const horaFimFormatada = formatarHora(reserva.hora_fim);

  card.innerHTML = `
    <div class="card-status-badge">${statusTexto}</div>
    <div class="card-horario">
      <span class="card-hora-destaque">${horaInicioFormatada}</span>
      <span class="card-hora-pequena">até ${horaFimFormatada}</span>
    </div>
    <div class="card-nome">${reserva.nome}</div>
    <div class="card-setor">${reserva.setor}</div>
    <div class="card-pessoas">👥 ${reserva.qtd_pessoas} pessoa${reserva.qtd_pessoas > 1 ? 's' : ''}</div>
    ${reserva.descricao ? `<div class="card-descricao">${reserva.descricao}</div>` : ''}
  `;

  return card;
}

function obterStatusTexto(status) {
  const statusMap = {
    'agendada': 'Agendada',
    'em_andamento': 'Em andamento',
    'finalizada': 'Finalizada',
    'comecando_em_breve': '🔔 Começando'
  };
  return statusMap[status] || status;
}

// ========== FILTROS ==========
function aplicarFiltros() {
  carregarReservas();
}

function limparFiltros() {
  document.getElementById('filtro-busca').value = '';
  document.getElementById('filtro-data').valueAsDate = new Date();
  carregarReservas();
}

// ========== MODAL NOVA RESERVA ==========
function abrirFormularioNovaReserva() {
  document.getElementById('form-nova-reserva').reset();
  document.getElementById('input-data').valueAsDate = new Date();
  document.getElementById('input-hora-inicio').value = '';
  document.getElementById('input-hora-fim').value = '';
  document.getElementById('modal-nova-reserva').style.display = 'flex';
}

function fecharModalNovaReserva() {
  document.getElementById('modal-nova-reserva').style.display = 'none';
}

async function salvarNovaReserva(event) {
  event.preventDefault();

  const dados = {
    nome: document.getElementById('input-nome').value,
    setor: document.getElementById('input-setor').value,
    data: document.getElementById('input-data').value,
    hora_inicio: document.getElementById('input-hora-inicio').value,
    hora_fim: document.getElementById('input-hora-fim').value,
    descricao: document.getElementById('input-descricao').value,
    qtd_pessoas: parseInt(document.getElementById('input-pessoas').value)
  };

  try {
    const response = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      mostrarSucesso('Reserva criada com sucesso!');
      fecharModalNovaReserva();
      carregarReservas();
    } else {
      const erro = await response.json();
      mostrarAviso(erro.erro || 'Erro ao criar reserva');
    }
  } catch (erro) {
    console.error('Erro:', erro);
    mostrarAviso('Erro ao criar reserva');
  }
}

// ========== MODAL DETALHES ==========
function abrirDetalhesReserva(reserva) {
  const conteudo = document.getElementById('detalhes-conteudo');
  conteudo.innerHTML = `
    <div class="detalhes-grid">
      <div class="detalhe-item">
        <strong>Nome:</strong> ${reserva.nome}
      </div>
      <div class="detalhe-item">
        <strong>Setor:</strong> ${reserva.setor}
      </div>
      <div class="detalhe-item">
        <strong>Data:</strong> ${formatarData(reserva.data)}
      </div>
      <div class="detalhe-item">
        <strong>Horário:</strong> ${formatarHora(reserva.hora_inicio)} às ${formatarHora(reserva.hora_fim)}
      </div>
      <div class="detalhe-item">
        <strong>Pessoas:</strong> ${reserva.qtd_pessoas}
      </div>
      <div class="detalhe-item">
        <strong>Status:</strong> ${obterStatusTexto(reserva.status)}
      </div>
      ${reserva.descricao ? `<div class="detalhe-item detalhe-descricao"><strong>Descrição:</strong> ${reserva.descricao}</div>` : ''}
    </div>
  `;
  document.getElementById('modal-detalhes').style.display = 'flex';
}

function fecharModalDetalhes() {
  document.getElementById('modal-detalhes').style.display = 'none';
}

// ========== FUNÇÕES AUXILIARES ==========
function preencherHorarios() {
  const selectInicio = document.getElementById('input-hora-inicio');
  const selectFim = document.getElementById('input-hora-fim');

  for (let h = 7; h < 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hora = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      
      const optionInicio = document.createElement('option');
      optionInicio.value = hora;
      optionInicio.textContent = hora;
      selectInicio.appendChild(optionInicio);

      const optionFim = document.createElement('option');
      optionFim.value = hora;
      optionFim.textContent = hora;
      selectFim.appendChild(optionFim);
    }
  }
}

function atualizarHoraFim() {
  const horaInicio = document.getElementById('input-hora-inicio').value;
  const selectFim = document.getElementById('input-hora-fim');

  if (horaInicio) {
    const [h, m] = horaInicio.split(':').map(Number);
    const proximaHora = `${String(h).padStart(2, '0')}:${String(m + 30).padStart(2, '0')}`;
    selectFim.value = proximaHora;
  }
}

function formatarHora(hora) {
  return hora.substring(0, 5);
}

function formatarData(data) {
  const date = new Date(data + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function mostrarSucesso(mensagem) {
  const notificacao = document.createElement('div');
  notificacao.className = 'notificacao notificacao-sucesso';
  notificacao.textContent = mensagem;
  document.body.appendChild(notificacao);

  setTimeout(() => notificacao.remove(), 3000);
}

function mostrarAviso(mensagem) {
  const notificacao = document.createElement('div');
  notificacao.className = 'notificacao notificacao-erro';
  notificacao.textContent = mensagem;
  document.body.appendChild(notificacao);

  setTimeout(() => notificacao.remove(), 3000);
}

// Fechar modais ao clicar fora
window.onclick = (event) => {
  const modalNovaReserva = document.getElementById('modal-nova-reserva');
  const modalDetalhes = document.getElementById('modal-detalhes');

  if (event.target === modalNovaReserva) {
    fecharModalNovaReserva();
  }
  if (event.target === modalDetalhes) {
    fecharModalDetalhes();
  }
};
