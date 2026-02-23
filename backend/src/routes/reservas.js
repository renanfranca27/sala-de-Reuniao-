import express from 'express';
import * as reservaService from '../services/reservaService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, setor, nome } = req.query;
    const reservas = await reservaService.getAllReservas(data, setor, nome);
    res.json(reservas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const reserva = await reservaService.getReservaById(req.params.id);
    if (!reserva) return res.status(404).json({ erro: 'Reserva não encontrada' });
    res.json(reserva);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, setor, data, hora_inicio, hora_fim, descricao, qtd_pessoas } = req.body;
    if (!nome || !setor || !data || !hora_inicio || !hora_fim || !qtd_pessoas) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    if (!validarFormatoHora(hora_inicio) || !validarFormatoHora(hora_fim)) {
      return res.status(400).json({ erro: 'Formato de hora inválido (HH:MM)' });
    }

    if (!reservaService.validarIntervalo30min(hora_inicio) || !reservaService.validarIntervalo30min(hora_fim)) {
      return res.status(400).json({ erro: 'Horários devem estar em intervalos de 30 minutos' });
    }

    if (!validarHorarioPermitido(hora_inicio) || !validarHorarioPermitido(hora_fim)) {
      return res.status(400).json({ erro: 'Horário deve estar entre 07:00 e 18:00' });
    }

    const reservaId = await reservaService.createReserva({ nome, setor, data, hora_inicio, hora_fim, descricao, qtd_pessoas });
    const reserva = await reservaService.getReservaById(reservaId);
    res.status(201).json(reserva);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, setor, data, hora_inicio, hora_fim, descricao, qtd_pessoas } = req.body;
    if (!nome || !setor || !data || !hora_inicio || !hora_fim || !qtd_pessoas) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    if (!reservaService.validarIntervalo30min(hora_inicio) || !reservaService.validarIntervalo30min(hora_fim)) {
      return res.status(400).json({ erro: 'Horários devem estar em intervalos de 30 minutos' });
    }

    if (!validarHorarioPermitido(hora_inicio) || !validarHorarioPermitido(hora_fim)) {
      return res.status(400).json({ erro: 'Horário deve estar entre 07:00 e 18:00' });
    }

    const reserva = await reservaService.updateReserva(req.params.id, { nome, setor, data, hora_inicio, hora_fim, descricao, qtd_pessoas });
    res.json(reserva);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await reservaService.deleteReserva(req.params.id);
    res.json({ mensagem: 'Reserva deletada com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

function validarFormatoHora(hora) {
  const regex = /^\d{2}:\d{2}$/;
  return regex.test(hora);
}

function validarHorarioPermitido(hora) {
  const minutos = reservaService.horaEmMinutos(hora);
  const minimo = 7 * 60;
  const maximo = 18 * 60;
  return minutos >= minimo && minutos <= maximo;
}

export default router;
