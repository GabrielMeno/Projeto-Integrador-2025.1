import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Table from '../../components/Table';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../../service/usuarioService';
import './styles.css';

function Usuarios() {
  const [visualizando, setVisualizando] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    login: '',
    perfil: '',
    senha: '',
    confirmarSenha: ''
  });
  const [menuAbertoId, setMenuAbertoId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      try {
        const data = await getUsuarios();
        if (!Array.isArray(data)) {
          if (data && data.error && (data.error === 'Token inválido' || data.error === 'Token não fornecido')) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioLogado');
            window.location.href = '/login';
            return;
          }
          setUsuarios([]);
        } else {
          setUsuarios(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  const handleNovo = () => setModalAberto(true);
  const handleFecharModal = () => {
    setModalAberto(false);
    setVisualizando(false);
    setUsuarioSelecionado(null);
    setNovoUsuario({
      nome: '',
      login: '',
      perfil: '',
      senha: '',
      confirmarSenha: ''
    });
  };

  const handleChange = (e) => {
    setNovoUsuario({
      ...novoUsuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (novoUsuario.senha !== novoUsuario.confirmarSenha) {
        alert('As senhas não coincidem!');
        setLoading(false);
        return;
      }
      
      let response;
      if (usuarioSelecionado && usuarioSelecionado.codigo_usuario) {
        response = await updateUsuario(usuarioSelecionado.codigo_usuario, {
          nome: novoUsuario.nome,
          login: novoUsuario.login,
          senha: novoUsuario.senha,
          perfil: novoUsuario.perfil
        });
      } else {
        response = await createUsuario({
          nome: novoUsuario.nome,
          login: novoUsuario.login,
          senha: novoUsuario.senha,
          perfil: novoUsuario.perfil
        });
      }
      
      if (response && response.error) {
        alert(`Erro: ${response.error}`);
        setLoading(false);
        return;
      }
      
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
      handleFecharModal();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleVisualizar = (codigo_usuario) => {
    if (!codigo_usuario) {
      console.error('Tentativa de visualizar usuário com código inválido:', codigo_usuario);
      alert('Erro: ID de usuário inválido');
      return;
    }
    
    const usuario = usuarios.find(u => u.codigo_usuario === codigo_usuario);
    if (!usuario) {
      console.error('Usuário não encontrado com o código:', codigo_usuario);
      alert('Erro: Usuário não encontrado');
      return;
    }
    
    setUsuarioSelecionado(usuario);
    setVisualizando(true);
    setModalAberto(true);
  };

  const handleEditar = (codigo_usuario) => {
    if (!codigo_usuario) {
      console.error('Tentativa de editar usuário com código inválido:', codigo_usuario);
      alert('Erro: ID de usuário inválido');
      return;
    }
    
    const usuario = usuarios.find(u => u.codigo_usuario === codigo_usuario);
    if (!usuario) {
      console.error('Usuário não encontrado com o código:', codigo_usuario);
      alert('Erro: Usuário não encontrado');
      return;
    }
    
    setUsuarioSelecionado(usuario);
    setVisualizando(false);
    setModalAberto(true);
    setNovoUsuario({
      nome: usuario.nome || '',
      login: usuario.login || usuario.usuario || '',
      perfil: usuario.perfil || '',
      senha: '',
      confirmarSenha: ''
    });
  };

  const handleApagar = async (codigo_usuario) => {
    if (!codigo_usuario) {
      console.error('Tentativa de apagar usuário com código inválido:', codigo_usuario);
      alert('Erro: ID de usuário inválido');
      return;
    }
    
    if (window.confirm('Deseja apagar este usuário?')) {
      setLoading(true);
      try {
        const res = await deleteUsuario(codigo_usuario);
        if (res && res.message) {
          setUsuarios(usuarios.filter(u => u.codigo_usuario !== codigo_usuario));
        } else if (res && res.error) {
          alert(`Erro: ${res.error}`);
        } else {
          alert('Erro ao excluir usuário.');
        }
      } catch (err) {
        console.error('Erro ao excluir usuário:', err);
        alert('Erro ao excluir usuário: ' + (err.message || 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.acoes-menu')) setMenuAbertoId(null);
  };

  useEffect(() => {
    if (menuAbertoId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuAbertoId]);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const isAdmin = usuarioLogado?.perfil === 'admin';

  const columns = [
    { label: 'Nome Completo', accessor: 'nome', render: u => u.nome && u.nome.trim() !== '' ? u.nome : '-----' },
    { label: 'Usuário', accessor: 'login', render: u => (u.login && u.login.trim() !== '' ? u.login : (u.usuario && u.usuario.trim() !== '' ? u.usuario : '-----')) },
    { label: 'Tipo', accessor: 'perfil', render: u => u.perfil === 'admin' ? 'Administrador' : (u.perfil === 'normal' ? 'Normal' : '-----') },
  ];

  const renderActions = (usuario) => (
    <div className="acoes-menu">
      <button
        className="acoes-btn"
        onClick={() => setMenuAbertoId(menuAbertoId === usuario.codigo_usuario ? null : usuario.codigo_usuario)}
        type="button"
      >
        <span className="acoes-pontos">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </button>
      {menuAbertoId === usuario.codigo_usuario && (
        <div className="acoes-dropdown">
          <button type="button" onClick={() => { handleVisualizar(usuario.codigo_usuario); setMenuAbertoId(null); }}>Visualizar</button>
          {isAdmin && <button type="button" onClick={() => { handleEditar(usuario.codigo_usuario); setMenuAbertoId(null); }}>Editar</button>}
          {isAdmin && <button type="button" onClick={() => { handleApagar(usuario.codigo_usuario); setMenuAbertoId(null); }}>Apagar</button>}
        </div>
      )}
    </div>
  );

  return (
    <div className="servicos-container usuarios-container">
      {loading && <LoadingSpinner />}
      <div className="servicos-header">
        <h2>Usuários</h2>
        {isAdmin && <button className="novo-servico-btn" onClick={handleNovo}>Novo</button>}
      </div>
      <Table columns={columns} data={usuarios} actions={renderActions} loading={loading} />
      {modalAberto && (
        <div className="modal-servico-backdrop">
          <div className="modal-servico">
            <h3>{visualizando ? 'Visualizar Usuário' : usuarioSelecionado ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <form onSubmit={handleSalvar}>
              <label>
                Nome Completo:
                <input
                  type="text"
                  name="nome"
                  value={visualizando && usuarioSelecionado ? usuarioSelecionado.nome : novoUsuario.nome}
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                />
              </label>
              <label>
                Usuário:
                <input
                  type="text"
                  name="login"
                  value={visualizando && usuarioSelecionado ? (usuarioSelecionado.login || usuarioSelecionado.usuario) : novoUsuario.login}
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                />
              </label>
              <label>
                Perfil:
                <select
                  name="perfil"
                  value={visualizando && usuarioSelecionado ? usuarioSelecionado.perfil : novoUsuario.perfil}
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                >
                  <option value="">Selecione</option>
                  <option value="admin">Administrador</option>
                  <option value="normal">Normal</option>
                </select>
              </label>
              {!visualizando && isAdmin && <>
                <label>
                  Senha:
                  <input
                    type="password"
                    name="senha"
                    value={novoUsuario.senha}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Confirmar Senha:
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={novoUsuario.confirmarSenha}
                    onChange={handleChange}
                    required
                  />
                </label>
              </>}
              <div className="modal-servico-actions">
                <button type="button" onClick={handleFecharModal}>Fechar</button>
                {!visualizando && isAdmin && <button type="submit">Salvar</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
