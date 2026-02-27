import express from 'express';
import * as reservaService from '../services/reservaService.js';

const router = express.Router();

router.get('/info', async (req, res) => {
  try {
    const agora = reservaService.obterDataHoraBrasilia();
    const hoje = agora.data;
    const horaAtual = agora.hora;

    await reservaService.atualizarStatusReservas();

    const reservas = await reservaService.getAllReservas(hoje);

    let reuniaoAtual = null;
    let proximaReuniao = null;

    for (const reserva of reservas) {
      if (horaAtual >= reserva.hora_inicio && horaAtual < reserva.hora_fim) {
        reuniaoAtual = reserva;
      } else if (reserva.hora_inicio > horaAtual && !proximaReuniao) {
        proximaReuniao = reserva;
      }
    }

    const salaLivre = !reuniaoAtual;

    res.json({ horaAtual, salaLivre, reuniaoAtual, proximaReuniao, todasAsReservas: reservas });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

export default router;
