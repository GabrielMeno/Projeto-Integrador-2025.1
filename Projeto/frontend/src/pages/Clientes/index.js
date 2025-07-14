import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Table from '../../components/Table';
import '../../pages/Clientes/styles.css';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../../service/clienteService';

function Clientes() {
  const [visualizando, setVisualizando] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    cpf_cnpj: '',
    telefone: '',
    email: ''
  });
  const [menuAbertoId, setMenuAbertoId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchClientes() {
      setLoading(true);
      try {
        const data = await getClientes({});
        if (!Array.isArray(data)) {
          if (data && data.error && (data.error === 'Token inválido' || data.error === 'Token não fornecido')) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioLogado');
            window.location.href = '/login';
            return;
          }
          setClientes([]);
        } else {
          setClientes(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, []);

  const handleNovo = () => setModalAberto(true);
  const handleFecharModal = () => {
    setModalAberto(false);
    setVisualizando(false);
    setClienteSelecionado(null);
    setNovoCliente({
      nome: '',
      cpf_cnpj: '',
      telefone: '',
      email: ''
    });
  };

  const handleChange = (e) => {
    setNovoCliente({
      ...novoCliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (clienteSelecionado) {
        await updateCliente(clienteSelecionado.codigo_cliente, {
          nome: novoCliente.nome,
          cpf_cnpj: novoCliente.cpf_cnpj,
          telefone: novoCliente.telefone,
          email: novoCliente.email
        });
      } else {
        await createCliente({
          nome: novoCliente.nome,
          cpf_cnpj: novoCliente.cpf_cnpj,
          telefone: novoCliente.telefone,
          email: novoCliente.email
        });
      }
      const data = await getClientes({});
      setClientes(Array.isArray(data) ? data : []);
      handleFecharModal();
    } finally {
      setLoading(false);
    }
  };

  const handleVisualizar = (codigo_cliente) => {
    const cliente = clientes.find(c => c.codigo_cliente === codigo_cliente);
    setClienteSelecionado(cliente);
    setVisualizando(true);
    setModalAberto(true);
  };

  const handleEditar = (codigo_cliente) => {
    const cliente = clientes.find(c => c.codigo_cliente === codigo_cliente);
    setClienteSelecionado(cliente);
    setVisualizando(false);
    setModalAberto(true);
    setNovoCliente({
      nome: cliente.nome,
      cpf_cnpj: cliente.cpf_cnpj,
      telefone: cliente.telefone,
      email: cliente.email
    });
  };

  const handleApagar = async (codigo_cliente) => {
    if (window.confirm('Deseja apagar este cliente?')) {
      setLoading(true);
      try {
        const res = await deleteCliente(codigo_cliente);
        if (res && res.message) {
          setClientes(clientes.filter(c => c.codigo_cliente !== codigo_cliente));
        } else if (res && res.error) {
          alert(res.error);
        } else {
          alert('Erro ao excluir cliente.');
        }
      } catch (err) {
        alert('Erro ao excluir cliente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.acoes-menu')) setMenuAbertoId(null);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && menuAbertoId !== null) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => window.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuAbertoId]);

  const columns = [
    { label: 'Nome/Razão Social', accessor: 'nome', render: c => c.nome && c.nome.trim() !== '' ? c.nome : '-----' },
    { label: 'CPF/CNPJ', accessor: 'cpf_cnpj', render: c => (c.cpf_cnpj && c.cpf_cnpj.trim() !== '' ? c.cpf_cnpj : (c.documento && c.documento.trim() !== '' ? c.documento : '-----')) },
    { label: 'Telefone', accessor: 'telefone', render: c => c.telefone && c.telefone.trim() !== '' ? c.telefone : '-----' },
    { label: 'Email', accessor: 'email', render: c => c.email && c.email.trim() !== '' ? c.email : '-----' },
  ];

  const renderActions = (cliente) => (
    <div className="acoes-menu">
      <button
        className="acoes-btn"
        onClick={() => setMenuAbertoId(menuAbertoId === cliente.codigo_cliente ? null : cliente.codigo_cliente)}
        type="button"
      >
        <span className="acoes-pontos">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </button>
      {menuAbertoId === cliente.codigo_cliente && (
        <div className="acoes-dropdown">
          <button type="button" onClick={() => { handleVisualizar(cliente.codigo_cliente); setMenuAbertoId(null); }}>Visualizar</button>
          <button type="button" onClick={() => { handleEditar(cliente.codigo_cliente); setMenuAbertoId(null); }}>Editar</button>
          <button type="button" onClick={() => { handleApagar(cliente.codigo_cliente); setMenuAbertoId(null); }}>Apagar</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="servicos-container">
      {loading && <LoadingSpinner />}
      <div className="servicos-header">
        <h2>Clientes</h2>
        <button className="novo-servico-btn" onClick={handleNovo}>Novo</button>
      </div>
      <Table columns={columns} data={clientes} actions={renderActions} loading={loading} />
      {modalAberto && (
        <div className="modal-servico-backdrop">
          <div className="modal-servico">
            <h3>{visualizando ? 'Visualizar Cliente' : clienteSelecionado ? 'Editar Cliente' : 'Novo Cliente'}</h3>
            <form onSubmit={handleSalvar}>
              <label>
                Nome/Razão Social:
                <input
                  type="text"
                  name="nome"
                  value={visualizando && clienteSelecionado ? clienteSelecionado.nome : novoCliente.nome}
                  onChange={handleChange}
                  required
                  minLength={3}
                  style={{ marginLeft: 0, width: '100%' }}
                  disabled={visualizando}
                />
              </label>
              <label>
                CPF/CNPJ:
                <input
                  type="text"
                  name="cpf_cnpj"
                  value={visualizando && clienteSelecionado ? clienteSelecionado.cpf_cnpj : novoCliente.cpf_cnpj || ''}
                  onChange={handleChange}
                  disabled={visualizando}
                />
              </label>
              <label>
                Telefone:
                <input
                  type="text"
                  name="telefone"
                  value={visualizando && clienteSelecionado ? clienteSelecionado.telefone : novoCliente.telefone || ''}
                  onChange={handleChange}
                  disabled={visualizando}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={visualizando && clienteSelecionado ? clienteSelecionado.email : novoCliente.email || ''}
                  onChange={handleChange}
                  disabled={visualizando}
                />
              </label>
              <div className="modal-servico-actions">
                <button type="button" onClick={handleFecharModal}>Fechar</button>
                {!visualizando && <button type="submit">Salvar</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;
