import { useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import guincho from '../../assets/Guincho-e-reboque.png';
import user from '../../assets/user.png';
import olho from '../../assets/olho.png';

function Login({ onLogin }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setErro('');
    onLogin && onLogin({ login, senha });
  };

  const handleCadastrar = () => {
    navigate('/cadastro');
  };

  return (
  <div className="container-login">
    <div className="left-side">
      <div className="login-content">
        <img
          src={user}
          alt="Usuário"
          className="user-icon"
        />
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="input-container">
            <input
              type="text"
              placeholder="Usuário"
              value={login}
              onChange={e => setLogin(e.target.value)}
            />
          </div>
          <div className="password-container">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              title="Mostrar/ocultar senha"
            >
              <img src={olho} alt="Mostrar senha" style={{ width: 20, height: 20, cursor: 'pointer' }} />
            </span>
          </div>
          <div className="links">
            <button type="button" className="cadastrar-btn" onClick={handleCadastrar}>
              Cadastre-se
            </button>
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {erro && <div className="login-erro">{erro}</div>}
        </form>
      </div>
    </div>
    <div className="right-side">
      <img
        className="background-image"
        src={guincho}
        alt="Guincho"
      />
      <img
        className="logo"
        src={logo}
        alt="Logo Auto Socorro"
      />
    </div>
  </div>
  );
}

export default Login;
