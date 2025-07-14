function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
const API_URL = 'http://localhost:3001/clientes';

export async function getClientes() {
  const res = await fetch(API_URL, { headers: getAuthHeader() });
  return res.json();
}

export async function getCliente(id) {
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.json();
}

export async function createCliente(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateCliente(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteCliente(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getAuthHeader() });
  return res.json();
}
