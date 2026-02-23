import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import reservasRouter from './src/routes/reservas.js';
import adminRouter from './src/routes/admin.js';
import painelTvRouter from './src/routes/painel-tv.js';
import * as reservaService from './src/services/reservaService.js';
import { connectDB } from './src/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/reservas', reservasRouter);
app.use('/api/admin', adminRouter);
app.use('/api/painel-tv', painelTvRouter);

const inicializar = async () => {
  try {
    await connectDB();
    console.log('✓ Conectado ao MongoDB');

    setInterval(async () => {
      await reservaService.atualizarStatusReservas();
    }, 60000);
  } catch (erro) {
    console.error('Erro ao inicializar backend:', erro);
    process.exit(1);
  }
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/admin-reserva-sala', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('/painel-tv', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'painel-tv.html'));
});

const PORT = process.env.PORT || 3000;

inicializar().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
  });
});

export default app;
