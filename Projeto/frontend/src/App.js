import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import './App.css';
import { autenticarUsuario } from './service/loginService';


function App() {
  const [logado, setLogado] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogin = async (credenciais) => {
    const usuario = await autenticarUsuario(credenciais);
    if (usuario && usuario.codigo_usuario) {
      setLogado(true);
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      localStorage.setItem('token', usuario.token); 
      navigate('/dashboard');
    } else {
      alert('Usuário ou senha inválidos!');
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route
        path="/dashboard"
        element={logado ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/servicos"
        element={logado ? <Dashboard conteudoInicial="servicos" /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/despesas"
        element={logado ? <Dashboard conteudoInicial="despesas" /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/clientes"
        element={logado ? <Dashboard conteudoInicial="clientes" /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/usuarios"
        element={logado ? <Dashboard conteudoInicial="usuarios" /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;