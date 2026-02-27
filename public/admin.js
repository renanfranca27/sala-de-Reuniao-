// Estado
let emailAdmin = localStorage.getItem('adminEmail');
let reservasAdmin = [];
let reservaParaExcluir = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  preencherHorarios();
  
  if (emailAdmin) {
    verificarAdmin();
  } else {
    mostrarLogin();
  }
});

// ========== AUTENTICAÇÃO ==========
async function fazerLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email-login').value;

  try {
    const response = await fetch('/api/admin/validar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const dados = await response.json();

    if (dados.isAdmin) {
      emailAdmin = email;
      localStorage.setItem('adminEmail', email);
      verificarAdmin();
    } else {
      mostrarAviso('Email não autorizado como administrador');
    }
  } catch (erro) {
    console.error('Erro ao validar admin:', erro);
    mostrarAviso('Erro ao validar email');
  }
}

function logout() {
  emailAdmin = null;
  localStorage.removeItem('adminEmail');
  mostrarLogin();
}

function mostrarLogin() {
  document.getElementById('login-section').style.display = 'flex';
  document.getElementById('admin-section').style.display = 'none';
}

function verificarAdmin() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('admin-section').style.display = 'block';
  document.getElementById('user-info').textContent = `👤 ${emailAdmin}`;
  
  carregarReservasAdmin();
  setInterval(carregarReservasAdmin, 30000);
}

// ========== CARREGAMENTO DE DADOS ==========
async function carregarReservasAdmin() {
  try {
    const response = await fetch('/api/reservas');
    reservasAdmin = await response.json();
    renderizarTabelaAdmin();
  } catch (erro) {
    console.error('Erro ao carregar reservas:', erro);
    mostrarAviso('Erro ao carregar reservas');
  }
}

// ========== RENDERIZAÇÃO ==========
function renderizarTabelaAdmin() {
  const tbody = document.getElementById('tabela-corpo');
  tbody.innerHTML = '';

  if (reservasAdmin.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="tabela-vazia">Nenhuma reserva encontrada</td></tr>';
    return;
  }

  reservasAdmin.forEach(reserva => {
    const tr = document.createElement('tr');
    const statusBadge = obterStatusBadge(reserva.status);
    const reservaId = reserva._id || reserva.id;
    
    tr.innerHTML = `
      <td>${reserva.nome}</td>
      <td>${reserva.setor}</td>
      <td>${formatarData(reserva.data)}</td>
      <td>${reserva.hora_inicio} - ${reserva.hora_fim}</td>
      <td>${reserva.qtd_pessoas}</td>
      <td>${statusBadge}</td>
      <td class="tabela-acoes">
        <button class="btn btn-pequeno btn-editar" onclick="abrirModalEditar('${reservaId}')">✏️</button>
        <button class="btn btn-pequeno btn-excluir" onclick="abrirModalExcluir('${reservaId}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function obterStatusBadge(status) {
  const statusMap = {
    'agendada': '<span class="badge badge-azul">Agendada</span>',
    'em_andamento': '<span class="badge badge-verde">Em andamento</span>',
    'finalizada': '<span class="badge badge-cinza">Finalizada</span>',
    'comecando_em_breve': '<span class="badge badge-vermelho">⏰ Começando</span>'
  };
  return statusMap[status] || status;
}

// ========== FILTROS ==========
function filtrarReservas() {
  const data = document.getElementById('admin-filtro-data').value;
  const setor = document.getElementById('admin-filtro-setor').value;

  const reservasFiltradas = reservasAdmin.filter(reserva => {
    if (data && reserva.data !== data) return false;
    if (setor && !reserva.setor.toLowerCase().includes(setor.toLowerCase())) return false;
    return true;
  });

  const tbody = document.getElementById('tabela-corpo');
  tbody.innerHTML = '';

  if (reservasFiltradas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="tabela-vazia">Nenhuma reserva encontrada</td></tr>';
    return;
  }

  reservasFiltradas.forEach(reserva => {
    const tr = document.createElement('tr');
    const statusBadge = obterStatusBadge(reserva.status);
    const reservaId = reserva._id || reserva.id;
    
    tr.innerHTML = `
      <td>${reserva.nome}</td>
      <td>${reserva.setor}</td>
      <td>${formatarData(reserva.data)}</td>
      <td>${reserva.hora_inicio} - ${reserva.hora_fim}</td>
      <td>${reserva.qtd_pessoas}</td>
      <td>${statusBadge}</td>
      <td class="tabela-acoes">
        <button class="btn btn-pequeno btn-editar" onclick="abrirModalEditar('${reservaId}')">✏️</button>
        <button class="btn btn-pequeno btn-excluir" onclick="abrirModalExcluir('${reservaId}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ========== MODAL EDITAR ==========
function abrirModalEditar(id) {
  const reserva = reservasAdmin.find(r => (r._id || r.id) === id);
  if (!reserva) return;

  document.getElementById('editar-id').value = id;
  document.getElementById('editar-nome').value = reserva.nome;
  document.getElementById('editar-setor').value = reserva.setor;
  document.getElementById('editar-data').value = reserva.data;
  document.getElementById('editar-hora-inicio').value = reserva.hora_inicio;
  document.getElementById('editar-hora-fim').value = reserva.hora_fim;
  document.getElementById('editar-pessoas').value = reserva.qtd_pessoas;
  document.getElementById('editar-descricao').value = reserva.descricao || '';

  document.getElementById('modal-editar').style.display = 'flex';
}

function fecharModalEditar() {
  document.getElementById('modal-editar').style.display = 'none';
}

async function salvarEdicao(event) {
  event.preventDefault();

  const id = document.getElementById('editar-id').value;
  const dados = {
    nome: document.getElementById('editar-nome').value,
    setor: document.getElementById('editar-setor').value,
    data: document.getElementById('editar-data').value,
    hora_inicio: document.getElementById('editar-hora-inicio').value,
    hora_fim: document.getElementById('editar-hora-fim').value,
    descricao: document.getElementById('editar-descricao').value,
    qtd_pessoas: parseInt(document.getElementById('editar-pessoas').value)
  };

  try {
    const response = await fetch(`/api/reservas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      mostrarSucesso('Reserva atualizada com sucesso!');
      fecharModalEditar();
      carregarReservasAdmin();
    } else {
      const erro = await response.json();
      mostrarAviso(erro.erro || 'Erro ao atualizar reserva');
    }
  } catch (erro) {
    console.error('Erro:', erro);
    mostrarAviso('Erro ao atualizar reserva');
  }
}

// ========== MODAL EXCLUSÃO ==========
function abrirModalExcluir(id) {
  reservaParaExcluir = id;
  document.getElementById('modal-confirmar-exclusao').style.display = 'flex';
}

function fecharModalConfirmacao() {
  document.getElementById('modal-confirmar-exclusao').style.display = 'none';
  reservaParaExcluir = null;
}

async function confirmarExclusao() {
  try {
    const response = await fetch(`/api/reservas/${reservaParaExcluir}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      mostrarSucesso('Reserva deletada com sucesso!');
      fecharModalConfirmacao();
      carregarReservasAdmin();
    } else {
      mostrarAviso('Erro ao deletar reserva');
    }
  } catch (erro) {
    console.error('Erro:', erro);
    mostrarAviso('Erro ao deletar reserva');
  }
}

// ========== EXPORTAR CSV ==========
function exportarCSV() {
  const data = document.getElementById('admin-filtro-data').value;
  const setor = document.getElementById('admin-filtro-setor').value;

  const reservasFiltradas = reservasAdmin.filter(reserva => {
    if (data && reserva.data !== data) return false;
    if (setor && !reserva.setor.toLowerCase().includes(setor.toLowerCase())) return false;
    return true;
  });

  if (reservasFiltradas.length === 0) {
    mostrarAviso('Nenhuma reserva para exportar');
    return;
  }

  // Cabeçalhos
  const headers = ['Nome', 'Setor', 'Data', 'Hora Início', 'Hora Fim', 'Pessoas', 'Descrição', 'Status'];
  const rows = [];

  // Dados
  reservasFiltradas.forEach(reserva => {
    rows.push([
      reserva.nome,
      reserva.setor,
      formatarData(reserva.data),
      reserva.hora_inicio,
      reserva.hora_fim,
      reserva.qtd_pessoas,
      reserva.descricao || '',
      obterStatusTexto(reserva.status)
    ]);
  });

  // Criar CSV
  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reservas-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  mostrarSucesso('CSV exportado com sucesso!');
}

// ========== FUNÇÕES AUXILIARES ==========
function preencherHorarios() {
  const selectInicio = document.getElementById('editar-hora-inicio');
  const selectFim = document.getElementById('editar-hora-fim');

  [selectInicio, selectFim].forEach(select => {
    for (let h = 7; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hora = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = hora;
        select.appendChild(option);
      }
    }
  });
}

// ========== ATUALIZAR STATUS DINÂMICO ==========

function atualizarHoraFimEdicao() {
  const horaInicio = document.getElementById('editar-hora-inicio').value;
  const selectFim = document.getElementById('editar-hora-fim');

  if (horaInicio) {
    const [h, m] = horaInicio.split(':').map(Number);
    const proximaHora = `${String(h).padStart(2, '0')}:${String(m + 30).padStart(2, '0')}`;
    selectFim.value = proximaHora;
  }
}

function obterStatusTexto(status) {
  const statusMap = {
    'agendada': 'Agendada',
    'em_andamento': 'Em andamento',
    'finalizada': 'Finalizada',
    'comecando_em_breve': 'Começando em breve'
  };
  return statusMap[status] || status;
}

function formatarData(data) {
  const date = new Date(data + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
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
  const modalEditar = document.getElementById('modal-editar');
  const modalConfirmar = document.getElementById('modal-confirmar-exclusao');

  if (event.target === modalEditar) {
    fecharModalEditar();
  }
  if (event.target === modalConfirmar) {
    fecharModalConfirmacao();
  }
};
