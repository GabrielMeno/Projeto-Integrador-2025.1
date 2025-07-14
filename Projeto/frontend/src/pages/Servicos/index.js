import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Table from '../../components/Table';
import './styles.css';
import { getServicos, createServico, updateServico, deleteServico } from '../../service/servicoService';
import { getClientes } from '../../service/clienteService';

function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoServico, setNovoServico] = useState({
    codigo_cliente: '',
    cidade: '',
    data: '',
    valor: '',
    formaPagamento: '',
    status: '',
    observacoes: ''
  });
  const [menuAbertoId, setMenuAbertoId] = useState(null);
  const [visualizando, setVisualizando] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const servicosData = await getServicos();
        
        if (servicosData && servicosData.error) {
          console.error('Erro ao buscar serviços:', servicosData.error);
          
          if (servicosData.error.includes('Token') || servicosData.error.includes('autenticação')) {
            alert('Sessão expirada. Faça login novamente.');
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioLogado');
            window.location.href = '/login';
            return;
          }
          
          alert(`Erro ao buscar serviços: ${servicosData.error}`);
          setServicos([]);
          return;
        }
        
        let lista = Array.isArray(servicosData) ? servicosData : [];
        if (statusFiltro) {
          lista = lista.filter(s => s.status === statusFiltro);
        }
        setServicos(lista);
        
        const clientesData = await getClientes();
        
        if (clientesData && clientesData.error) {
          console.error('Erro ao buscar clientes:', clientesData.error);
          setClientes([]);
        } else {
          setClientes(Array.isArray(clientesData) ? clientesData : []);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert(`Erro ao carregar dados: ${error.message || 'Erro desconhecido'}`);
        setServicos([]);
        setClientes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [statusFiltro]);

  const handleNovo = () => setModalAberto(true);
  const handleFecharModal = () => {
    setModalAberto(false);
    setVisualizando(false);
    setServicoSelecionado(null);
    setNovoServico({
      codigo_cliente: '',
      cidade: '',
      data: '',
      valor: '',
      formaPagamento: '',
      status: '',
      observacoes: ''
    });
  };

  const handleChange = (e) => {
    setNovoServico({
      ...novoServico,
      [e.target.name]: e.target.value,
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const usuarioLogadoStr = localStorage.getItem('usuarioLogado');
      if (!usuarioLogadoStr) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = '/login';
        return;
      }
      
      let usuarioLogado;
      try {
        usuarioLogado = JSON.parse(usuarioLogadoStr);
      } catch (error) {
        console.error('Erro ao analisar dados do usuário logado:', error);
        alert('Erro ao obter dados do usuário. Faça login novamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        window.location.href = '/login';
        return;
      }
      
      if (!usuarioLogado || !usuarioLogado.codigo_usuario || 
          usuarioLogado.codigo_usuario === 'undefined' || 
          usuarioLogado.codigo_usuario === 'null') {
        console.error('ID de usuário inválido:', usuarioLogado?.codigo_usuario);
        alert('ID de usuário inválido. Faça login novamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        window.location.href = '/login';
        return;
      }
      
      const codigo_usuario = Number(usuarioLogado.codigo_usuario);
      
      let response;
      if (servicoSelecionado) {
        response = await updateServico(servicoSelecionado.codigo_servico, {
          codigo_cliente: Number(novoServico.codigo_cliente),
          local: novoServico.cidade,
          data_hora: novoServico.data,
          valor: novoServico.valor,
          forma_pagamento: novoServico.formaPagamento,
          status: novoServico.status,
          codigo_usuario,
          observacoes: novoServico.observacoes
        });
      } else {
        response = await createServico({
          codigo_cliente: Number(novoServico.codigo_cliente),
          local: novoServico.cidade,
          data_hora: novoServico.data,
          valor: novoServico.valor,
          forma_pagamento: novoServico.formaPagamento,
          status: novoServico.status,
          codigo_usuario,
          observacoes: novoServico.observacoes
        });
      }
      
      if (response && response.error) {
        console.error('Erro ao salvar serviço:', response.error);
        alert(`Erro ao salvar serviço: ${response.error}`);
        return;
      }
      
      const servicosData = await getServicos();
      setServicos(Array.isArray(servicosData) ? servicosData : []);
      handleFecharModal();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert(`Erro ao salvar serviço: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVisualizar = (codigo_servico) => {
    const servico = servicos.find(s => s.codigo_servico === codigo_servico);
    setServicoSelecionado(servico);
    setVisualizando(true);
    setModalAberto(true);
  };

  const handleEditar = (codigo_servico) => {
    const servico = servicos.find(s => s.codigo_servico === codigo_servico);
    setServicoSelecionado(servico);
    setVisualizando(false);
    setModalAberto(true);
    setNovoServico({
      codigo_cliente: servico.codigo_cliente,
      cidade: servico.local,
      data: servico.data_hora ? servico.data_hora.substring(0,10) : '',
      valor: servico.valor,
      formaPagamento: servico.forma_pagamento,
      status: servico.status,
      observacoes: servico.observacoes
    });
  };

  const handleApagar = async (codigo_servico) => {
    if (window.confirm('Deseja apagar este serviço?')) {
      setLoading(true);
      try {
        const res = await deleteServico(codigo_servico);
        if (res && res.message) {
          setServicos(servicos.filter(s => s.codigo_servico !== codigo_servico));
        } else if (res && res.error) {
          alert(res.error);
        } else {
          alert('Erro ao excluir serviço.');
        }
      } catch (err) {
        alert('Erro ao excluir serviço.');
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

  const columns = [
    { label: 'Cliente', accessor: 'Cliente', render: s => s.Cliente && s.Cliente.nome ? s.Cliente.nome : '-----' },
    { label: 'Cidade', accessor: 'local', render: s => s.local && s.local.trim() !== '' ? s.local : '-----' },
    { label: 'Data', accessor: 'data_hora', render: s => s.data_hora && s.data_hora !== '' ? (() => {
      const dataStr = s.data_hora.length > 10 ? s.data_hora.substring(0, 10) : s.data_hora;
      const [ano, mes, dia] = dataStr.split('-');
      if (!ano || !mes || !dia) return s.data_hora;
      return `${dia}/${mes}/${ano}`;
    })() : '-----' },
    { label: 'Valor', accessor: 'valor', render: s => s.valor && s.valor !== '' && s.valor !== null ? s.valor : '-----' },
    { label: 'Status', accessor: 'status', render: s => s.status && s.status.trim() !== '' ? s.status : '-----' },
  ];

  const renderActions = (servico) => (
    <div className="acoes-menu">
      <button
        className="acoes-btn"
        onClick={() => setMenuAbertoId(menuAbertoId === servico.codigo_servico ? null : servico.codigo_servico)}
        type="button"
      >
        <span className="acoes-pontos">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </button>
      {menuAbertoId === servico.codigo_servico && (
        <div className="acoes-dropdown">
          <button type="button" onClick={() => { handleVisualizar(servico.codigo_servico); setMenuAbertoId(null); }}>Visualizar</button>
          <button type="button" onClick={() => { handleEditar(servico.codigo_servico); setMenuAbertoId(null); }}>Editar</button>
          <button type="button" onClick={() => { handleApagar(servico.codigo_servico); setMenuAbertoId(null); }}>Apagar</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="servicos-container">
      {loading && <LoadingSpinner />}
      <div className="servicos-header">
        <h2>Serviços</h2>
        <button className="novo-servico-btn" onClick={handleNovo}>Novo</button>
      </div>
      <div className="filtro-status-container">
        <select
          value={statusFiltro}
          onChange={e => setStatusFiltro(e.target.value)}
          className="filtro-status-select"
        >
          <option value="">Todos os Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
      <Table columns={columns} data={servicos} actions={renderActions} loading={loading} />
      {modalAberto && (
        <div className="modal-servico-backdrop">
          <div className="modal-servico">
            <h3>Novo Serviço</h3>
            <form onSubmit={handleSalvar}>
              <label>
                Cliente:
                <select
                  name="codigo_cliente"
                  value={visualizando && servicoSelecionado ? servicoSelecionado.codigo_cliente : novoServico.codigo_cliente}
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                >
                  <option value="">Selecione</option>
                  {clientes.map(cliente => (
                    <option key={cliente.codigo_cliente} value={cliente.codigo_cliente}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Valor:
                <input
                  type="number"
                  name="valor"
                  value={visualizando && servicoSelecionado ? servicoSelecionado.valor : novoServico.valor}
                  onChange={handleChange}
                  required
                  step="1"
                  min="0"
                  disabled={visualizando}
                />
              </label>
              <label>
                Forma de Pagamento:
                <select
                  name="formaPagamento"
                  value={visualizando && servicoSelecionado ? servicoSelecionado.forma_pagamento : novoServico.formaPagamento}
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                >
                  <option value="">Selecione</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Pix">Pix</option>
                  <option value="Cartão">Cartão</option>
                </select>
              </label>
              <label>
                Cidade:
                <input
                  type="text"
                  name="cidade"
                  value={visualizando && servicoSelecionado ? servicoSelecionado.local : novoServico.cidade}
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                />
              </label>
              <label>
                Data:
                <input
                  type="date"
                  name="data"
                  value={visualizando && servicoSelecionado ? (servicoSelecionado.data_hora ? servicoSelecionado.data_hora.substring(0,10) : '') : novoServico.data}
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                />
              </label>
              <label>
                Status do Serviço:
                <select
                  name="status"
                  value={visualizando && servicoSelecionado ? servicoSelecionado.status : novoServico.status}
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                >
                  <option value="">Selecione</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </label>
              <label style={{ gridColumn: '1 / span 2' }}>
                Observações:
                <textarea
                  name="observacoes"
                  value={visualizando && servicoSelecionado ? servicoSelecionado.observacoes : novoServico.observacoes}
                  onChange={handleChange}
                  rows={3}
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

export default Servicos;
