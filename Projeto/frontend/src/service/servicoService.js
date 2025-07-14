const API_URL = 'http://localhost:3001/servicos';


function getAuthHeader() {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}


export async function getServicos() {
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
    console.error('Erro ao buscar serviços:', error);
    return { error: 'Erro ao buscar serviços: ' + error.message };
  }
}

export async function getServico(id) {
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.json();
}

export async function createServico(data) {
  try {
    if (!data.codigo_usuario || isNaN(Number(data.codigo_usuario)) || Number(data.codigo_usuario) <= 0) {
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
    console.error('Erro ao criar serviço:', error);
    return { error: 'Erro ao criar serviço: ' + error.message };
  }
}

export async function updateServico(id, data) {
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
    console.error('Erro ao atualizar serviço:', error);
    return { error: 'Erro ao atualizar serviço: ' + error.message };
  }
}

export async function deleteServico(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getAuthHeader() });
  return res.json();
}
