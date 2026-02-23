import { getCollection } from '../db.js';
import { ObjectId } from 'mongodb';

export async function getAllReservas(data = null, setor = null, nome = null) {
  const col = await getCollection('reservas');
  const filter = {};

  if (data) filter.data = data;
  if (setor) filter.setor = { $regex: setor, $options: 'i' };
  if (nome) filter.nome = { $regex: nome, $options: 'i' };

  const cursor = col.find(filter).sort({ data: -1, hora_inicio: 1 });
  return await cursor.toArray();
}

export async function getReservaById(id) {
  const col = await getCollection('reservas');
  const _id = new ObjectId(id);
  return await col.findOne({ _id });
}

export async function createReserva(dados) {
  const col = await getCollection('reservas');
  const { nome, setor, data, hora_inicio, hora_fim, descricao, qtd_pessoas } = dados;

  if (!validarHorario(hora_inicio, hora_fim)) {
    throw new Error('Hora fim deve ser maior que hora início');
  }

  const conflito = await verificarConflito(data, hora_inicio, hora_fim);
  if (conflito) throw new Error('Existe um conflito de horário com outra reserva');

  const agora = new Date().toISOString().split('T')[0];
  if (data < agora) throw new Error('Não é permitido agendar em datas passadas');

  const documento = {
    nome,
    setor,
    data,
    hora_inicio,
    hora_fim,
    descricao: descricao || '',
    qtd_pessoas,
    status: 'agendada',
    criado_em: new Date(),
    atualizado_em: new Date()
  };

  const result = await col.insertOne(documento);
  return result.insertedId.toString();
}

export async function updateReserva(id, dados) {
  const col = await getCollection('reservas');
  const { nome, setor, data, hora_inicio, hora_fim, descricao, qtd_pessoas } = dados;

  if (!validarHorario(hora_inicio, hora_fim)) throw new Error('Hora fim deve ser maior que hora início');

  const conflito = await verificarConflito(data, hora_inicio, hora_fim, id);
  if (conflito) throw new Error('Existe um conflito de horário com outra reserva');

  const _id = new ObjectId(id);
  await col.updateOne({ _id }, { $set: {
    nome, setor, data, hora_inicio, hora_fim, descricao, qtd_pessoas, atualizado_em: new Date()
  }});

  return await getReservaById(id);
}

export async function deleteReserva(id) {
  const col = await getCollection('reservas');
  const _id = new ObjectId(id);
  await col.deleteOne({ _id });
}

export async function atualizarStatusReservas() {
  const col = await getCollection('reservas');
  const agora = new Date();
  const dataAtual = agora.toISOString().split('T')[0];
  const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

  const reservas = await col.find({ data: dataAtual }).toArray();

  for (const reserva of reservas) {
    let novoStatus = reserva.status;

    if (horaAtual >= reserva.hora_inicio && horaAtual < reserva.hora_fim) {
      novoStatus = 'em_andamento';
    } else if (horaAtual >= reserva.hora_fim) {
      novoStatus = 'finalizada';
    } else if (horaAtual < reserva.hora_inicio) {
      const [hAtual, mAtual] = horaAtual.split(':').map(Number);
      const [hInicio, mInicio] = reserva.hora_inicio.split(':').map(Number);
      const minutosAte = (hInicio - hAtual) * 60 + (mInicio - mAtual);

      if (minutosAte > 0 && minutosAte <= 30) novoStatus = 'comecando_em_breve';
      else novoStatus = 'agendada';
    }

    if (novoStatus !== reserva.status) {
      await col.updateOne({ _id: reserva._id }, { $set: { status: novoStatus } });
    }
  }
}

function validarHorario(horaInicio, horaFim) {
  return horaFim > horaInicio;
}

function validarIntervalo30min(hora) {
  const [h, m] = hora.split(':').map(Number);
  return m === 0 || m === 30;
}

function horaEmMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

async function verificarConflito(data, hora_inicio, hora_fim, excluirId = null) {
  const col = await getCollection('reservas');
  const filter = {
    data,
    hora_inicio: { $lt: hora_fim },
    hora_fim: { $gt: hora_inicio }
  };
  if (excluirId) filter._id = { $ne: new ObjectId(excluirId) };

  const resultado = await col.findOne(filter);
  return !!resultado;
}

export { validarIntervalo30min, horaEmMinutos };
