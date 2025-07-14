function getAuthHeader() {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    console.error('Token não encontrado para autenticação');
    return {};
  }
}
const API_URL = 'http://localhost:3001/despesas';

export async function getDespesas() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Não autenticado. Faça login novamente.' };
    }
    
    
    const res = await fetch(API_URL, { headers: getAuthHeader() });
    
    if (!res.ok) {
      let errorMessage;
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || `${res.status} ${res.statusText}`;
      } catch {
        errorMessage = `${res.status} ${res.statusText}`;
      }
      
      
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        return { error: 'Sessão expirada. Faça login novamente.' };
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return { error: 'Erro ao buscar despesas: ' + error.message };
  }
}

export async function getDespesa(id) {
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.json();
}

export async function createDespesa(data) {
  try {
    if (!data.codigo_usuario || isNaN(Number(data.codigo_usuario)) || Number(data.codigo_usuario) <= 0) {
      console.error('Tentativa de criar despesa com ID de usuário inválido:', data.codigo_usuario);
      return { error: `ID de usuário inválido: ${data.codigo_usuario}` };
    }

    data.codigo_usuario = Number(data.codigo_usuario);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Erro ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    return { error: 'Erro ao criar despesa: ' + error.message };
  }
}

export async function updateDespesa(id, data) {
  try {
    if (!data.codigo_usuario || isNaN(Number(data.codigo_usuario)) || Number(data.codigo_usuario) <= 0) {
      return { error: `ID de usuário inválido: ${data.codigo_usuario}` };
    }

    data.codigo_usuario = Number(data.codigo_usuario);

    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Erro ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    return { error: 'Erro ao atualizar despesa: ' + error.message };
  }
}

export async function deleteDespesa(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getAuthHeader() });
  return res.json();
}
