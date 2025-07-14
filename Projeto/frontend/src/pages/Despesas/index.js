import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import '../../pages/Despesas/styles.css';
import { getDespesas, createDespesa, updateDespesa, deleteDespesa } from '../../service/despesaService';
import Table from '../../components/Table';

function Despesas() {
  const [visualizando, setVisualizando] = useState(false);
  const [despesaSelecionada, setDespesaSelecionada] = useState(null);
  const [despesas, setDespesas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaDespesa, setNovaDespesa] = useState({
    descricao: '',
    data: '',
    valor: '',
    categoria: '',
    observacoes: ''
  });
  const [menuAbertoId, setMenuAbertoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoriaFiltro] = useState('');

  useEffect(() => {
    async function fetchDespesas() {
      setLoading(true);
      try {
        const data = await getDespesas();
        
        if (data && data.error) {
          console.error('Erro ao buscar despesas:', data.error);
          
          if (data.error.includes('Token') || data.error.includes('autenticação')) {
            alert('Sessão expirada. Faça login novamente.');
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioLogado');
            window.location.href = '/login';
            return;
          }
          
          alert(`Erro ao buscar despesas: ${data.error}`);
          setDespesas([]);
          return;
        }
        
        let lista = Array.isArray(data) ? data : [];
        if (categoriaFiltro) {
          lista = lista.filter(d => (d.categoria || d.tipo || '').toLowerCase() === categoriaFiltro.toLowerCase());
        }
        setDespesas(lista);
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
        alert(`Erro ao carregar despesas: ${error.message || 'Erro desconhecido'}`);
        setDespesas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDespesas();
  }, [categoriaFiltro]);

  const handleNovo = () => setModalAberto(true);
  const handleFecharModal = () => {
    setModalAberto(false);
    setVisualizando(false);
    setDespesaSelecionada(null);
    setNovaDespesa({
      descricao: '',
      data: '',
      valor: '',
      categoria: '',
      observacoes: ''
    });
  };

  const handleChange = (e) => {
    setNovaDespesa({
      ...novaDespesa,
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
      
      const dataFormatada = novaDespesa.data && novaDespesa.data.length > 10 ? novaDespesa.data.substring(0, 10) : novaDespesa.data;
      
      let response;
      if (despesaSelecionada) {
        response = await updateDespesa(despesaSelecionada.codigo_despesa, {
          valor: novaDespesa.valor,
          data: dataFormatada,
          observacoes: novaDespesa.observacoes,
          descricao: novaDespesa.descricao,
          tipo: novaDespesa.categoria,
          codigo_usuario
        });
      } else {
        response = await createDespesa({
          valor: novaDespesa.valor,
          data: dataFormatada,
          observacoes: novaDespesa.observacoes,
          descricao: novaDespesa.descricao,
          tipo: novaDespesa.categoria,
          codigo_usuario
        });
      }
      
      if (response && response.error) {
        console.error('Erro ao salvar despesa:', response.error);
        alert(`Erro ao salvar despesa: ${response.error}`);
        return;
      }
      
      const data = await getDespesas();
      setDespesas(Array.isArray(data) ? data : []);
      handleFecharModal();
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
      alert(`Erro ao salvar despesa: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVisualizar = (codigo_despesa) => {
    const despesa = despesas.find(d => d.codigo_despesa === codigo_despesa);
    setDespesaSelecionada(despesa);
    setVisualizando(true);
    setModalAberto(true);
    setNovaDespesa({
      descricao: despesa.descricao,
      data: despesa.data,
      valor: despesa.valor,
      categoria: despesa.categoria || despesa.tipo || '',
      observacoes: despesa.observacoes
    });
  };

  const handleEditar = (codigo_despesa) => {
    const despesa = despesas.find(d => d.codigo_despesa === codigo_despesa);
    setDespesaSelecionada(despesa);
    setVisualizando(false);
    setModalAberto(true);
    setNovaDespesa({
      descricao: despesa.descricao,
      data: despesa.data,
      valor: despesa.valor,
      categoria: despesa.categoria || despesa.tipo || '',
      observacoes: despesa.observacoes
    });
  };

  const handleApagar = async (codigo_despesa) => {
    if (window.confirm('Deseja apagar esta despesa?')) {
      setLoading(true);
      try {
        const res = await deleteDespesa(codigo_despesa);
        if (res && res.message) {
          setDespesas(despesas.filter(d => d.codigo_despesa !== codigo_despesa));
        } else if (res && res.error) {
          alert(res.error);
        } else {
          alert('Erro ao excluir despesa.');
        }
      } catch (err) {
        alert('Erro ao excluir despesa.');
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
    { label: 'Descrição', accessor: 'descricao', render: d => d.descricao && d.descricao.trim() !== '' ? d.descricao : '-----' },
    { label: 'Categoria', accessor: 'categoria', render: d => (d.categoria && d.categoria.trim() !== '' ? d.categoria : (d.tipo && d.tipo.trim() !== '' ? d.tipo : '-----')) },
    { label: 'Valor', accessor: 'valor', render: d => d.valor && d.valor !== '' && d.valor !== null ? d.valor : '-----' },
    { label: 'Data', accessor: 'data', render: d => d.data && d.data !== '' ? (() => {
      const dataStr = d.data.length > 10 ? d.data.substring(0, 10) : d.data;
      const [ano, mes, dia] = dataStr.split('-');
      if (!ano || !mes || !dia) return d.data;
      return `${dia}/${mes}/${ano}`;
    })() : '-----' },
  ];

  const renderActions = (despesa) => (
    <div className="acoes-menu">
      <button
        className="acoes-btn"
        onClick={() => setMenuAbertoId(menuAbertoId === despesa.codigo_despesa ? null : despesa.codigo_despesa)}
        type="button"
      >
        <span className="acoes-pontos">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </button>
      {menuAbertoId === despesa.codigo_despesa && (
        <div className="acoes-dropdown">
          <button type="button" onClick={() => { handleVisualizar(despesa.codigo_despesa); setMenuAbertoId(null); }}>Visualizar</button>
          <button type="button" onClick={() => { handleEditar(despesa.codigo_despesa); setMenuAbertoId(null); }}>Editar</button>
          <button type="button" onClick={() => { handleApagar(despesa.codigo_despesa); setMenuAbertoId(null); }}>Apagar</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="servicos-container">
      {loading && <LoadingSpinner />}
      <div className="servicos-header">
        <h2>Despesas</h2>
        <button className="novo-servico-btn" onClick={handleNovo}>Nova</button>
      </div>
      <Table columns={columns} data={despesas} actions={renderActions} loading={loading} />
      {modalAberto && (
        <div className="modal-servico-backdrop">
          <div className="modal-servico">
            <h3>{visualizando ? 'Visualizar Despesa' : despesaSelecionada ? 'Editar Despesa' : 'Nova Despesa'}</h3>
            <form onSubmit={handleSalvar}>
              <label>
                Descrição:
                <input
                  type="text"
                  name="descricao"
                  value={visualizando && despesaSelecionada ? despesaSelecionada.descricao : novaDespesa.descricao}
                  onChange={handleChange}
                  disabled={visualizando}
                />
              </label>
              <label>
                Data da despesa:
                <input
                  type="date"
                  name="data"
                  value={
                    visualizando && despesaSelecionada
                      ? (despesaSelecionada.data
                          ? (despesaSelecionada.data.length > 10
                              ? despesaSelecionada.data.substring(0, 10)
                              : despesaSelecionada.data)
                          : '')
                      : (novaDespesa.data.length > 10
                          ? novaDespesa.data.substring(0, 10)
                          : novaDespesa.data)
                  }
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                />
              </label>
              <label>
                Valor:
                <input
                  type="number"
                  name="valor"
                  value={visualizando && despesaSelecionada ? despesaSelecionada.valor : novaDespesa.valor}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  disabled={visualizando}
                />
              </label>
              <label>
                Categoria:
                <select
                  name="categoria"
                  value={visualizando && despesaSelecionada 
                    ? (despesaSelecionada.categoria || despesaSelecionada.tipo || '') 
                    : novaDespesa.categoria}
                  onChange={handleChange}
                  required
                  disabled={visualizando}
                >
                  <option value="">Selecione</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Combustível">Combustível</option>
                  <option value="Pedágio">Pedágio</option>
                  <option value="Impostos">Impostos</option>
                  <option value="Salários">Salários</option>
                  <option value="Outros">Outros</option>
                </select>
              </label>
              <label style={{ gridColumn: '1 / span 2' }}>
                Observações:
                <textarea
                  name="observacoes"
                  value={visualizando && despesaSelecionada ? despesaSelecionada.observacoes : novaDespesa.observacoes}
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

export default Despesas;
