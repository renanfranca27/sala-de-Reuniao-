import express from 'express';
import * as adminService from '../services/adminService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.json(admins);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
    if (!validarEmail(email)) return res.status(400).json({ erro: 'Email inválido' });

    const adminId = await adminService.addAdmin(nome, email);
    res.status(201).json({ id: adminId, nome, email });
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await adminService.deleteAdmin(req.params.id);
    res.json({ mensagem: 'Administrador removido com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/validar', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ erro: 'Email é obrigatório' });
    const isAdmin = await adminService.isAdministrador(email);
    res.json({ isAdmin });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export default router;
