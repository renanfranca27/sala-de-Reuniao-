import { getCollection } from '../db.js';
import { ObjectId } from 'mongodb';

export async function isAdministrador(email) {
  const col = await getCollection('administradores');
  const admin = await col.findOne({ email });
  return !!admin;
}

export async function getAllAdmins() {
  const col = await getCollection('administradores');
  return await col.find({}).sort({ criado_em: -1 }).toArray();
}

export async function addAdmin(nome, email) {
  const col = await getCollection('administradores');
  const result = await col.insertOne({ nome, email, criado_em: new Date() });
  return result.insertedId.toString();
}

export async function deleteAdmin(id) {
  const col = await getCollection('administradores');
  await col.deleteOne({ _id: new ObjectId(id) });
}
