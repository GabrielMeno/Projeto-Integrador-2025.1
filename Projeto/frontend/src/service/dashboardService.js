const API_URL = 'http://localhost:3001/dashboard';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

export async function getDashboardData() {
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
    console.error('Erro ao buscar dados do dashboard:', error);
    return { error: 'Erro ao buscar dados do dashboard: ' + error.message };
  }
}
