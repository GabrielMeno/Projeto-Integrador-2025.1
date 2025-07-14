const API_URL = 'http://localhost:3001/login';

export async function autenticarUsuario({ login, senha }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, senha })
  });
  if (!res.ok) return null;
  return res.json();
}
