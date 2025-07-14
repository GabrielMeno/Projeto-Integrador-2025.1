function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const API_URL = 'http://localhost:3001/usuarios';

export async function getUsuarios() {
  const res = await fetch(API_URL, { headers: getAuthHeader() });
  return res.json();
}

export async function getUsuario(id) {
  if (!id || id === 'undefined' || id === 'null' || isNaN(Number(id))) {
    console.error('ID de usuário inválido fornecido:', id);
    return { error: 'ID de usuário inválido' };
  }
  
  try {
    const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return res.json();
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return { error: 'Erro ao buscar usuário' };
  }
}

export async function createUsuario(data) {
  const res = await fetch(`${API_URL}/criar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateUsuario(id, data) {
  if (!id || id === 'undefined' || id === 'null' || isNaN(Number(id))) {
    console.error('ID de usuário inválido fornecido para atualização:', id);
    return { error: 'ID de usuário inválido' };
  }
  
  try {
    const res = await fetch(`${API_URL}/atualizar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return { error: 'Erro ao atualizar usuário' };
  }
}

export async function deleteUsuario(id) {
  if (!id || id === 'undefined' || id === 'null' || isNaN(Number(id))) {
    console.error('ID de usuário inválido fornecido para exclusão:', id);
    return { error: 'ID de usuário inválido' };
  }
  
  try {
    const res = await fetch(`${API_URL}/excluir/${id}`, { 
      method: 'DELETE', 
      headers: getAuthHeader() 
    });
    return res.json();
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return { error: 'Erro ao excluir usuário' };
  }
}
