import { useState } from 'react';
import { cadastrarUsuarioComum } from '../../service/cadastroService';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import logo from '../../assets/logo.png';
import guincho from '../../assets/Guincho-e-reboque.png';
import user from '../../assets/user.png';
import olho from '../../assets/olho.png';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !login || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      setSucesso('');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      setSucesso('');
      return;
    }
    try {
      const usuario = await cadastrarUsuarioComum({ nome, login, senha });
      if (usuario && usuario.codigo_usuario) {
        setErro('');
        setSucesso('Cadastro realizado com sucesso!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErro('Nome de usuário já em uso. Por favor, escolha outro.');
        setSucesso('');
      }
    } catch (err) {
      setErro('Erro ao cadastrar.');
      setSucesso('');
    }
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
            <h2>Cadastro de Usuário</h2>
            <div className="input-container">
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                name="login"
                placeholder="Usuário"
                value={login}
                onChange={e => setLogin(e.target.value)}
              />
            </div>
            <div className="password-container">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                name="senha"
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
            <div className="password-container">
              <input
                type={mostrarConfirmarSenha ? 'text' : 'password'}
                name="confirmarSenha"
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                title="Mostrar/ocultar senha"
              >
                <img src={olho} alt="Mostrar senha" style={{ width: 20, height: 20, cursor: 'pointer' }} />
              </span>
            </div>
            <div className="links">
              <button type="button" className="cadastrar-btn" onClick={() => navigate('/')}>Já possuo uma conta</button>
            </div>
            <button type="submit" className="login-btn">
              Cadastre-se
            </button>
            {erro && <div className="login-erro">{erro}</div>}
            {sucesso && <div className="login-sucesso">{sucesso}</div>}
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

export default Cadastro;
