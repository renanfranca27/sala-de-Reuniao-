#!/usr/bin/env node
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DBNAME || 'sala_reuniao';

async function initDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  console.log('Inicializando banco MongoDB...');

  const administradores = db.collection('administradores');
  const reservas = db.collection('reservas');

  // Índices úteis
  await administradores.createIndex({ email: 1 }, { unique: true });
  await reservas.createIndex({ data: 1, hora_inicio: 1 });

  // Inserir admin de exemplo
  await administradores.updateOne(
    { email: 'renan.silva@alumasa.com.br' },
    { $setOnInsert: { nome: 'Renan Silva', email: 'renan.silva@alumasa.com.br', criado_em: new Date() } },
    { upsert: true }
  );

  console.log('Banco MongoDB inicializado com sucesso:', MONGODB_URI, DB_NAME);
  await client.close();
}

initDB().catch(err => { console.error(err); process.exit(1); });
