import express from 'express';
import * as reservaService from '../services/reservaService.js';

const router = express.Router();

router.get('/info', async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const agora = new Date();
    const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

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
