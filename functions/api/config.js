import { BANK } from '../lib/config.js';

export async function onRequestGet() {
  return Response.json({ bank: BANK });
}
