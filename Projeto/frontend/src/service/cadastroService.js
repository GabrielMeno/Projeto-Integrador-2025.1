const API_URL = 'http://localhost:3001/usuarios';

export async function cadastrarUsuarioComum(data) {
  const usuario = {
    ...data,
    perfil: 'normal' 
  };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  return res.json();
}

