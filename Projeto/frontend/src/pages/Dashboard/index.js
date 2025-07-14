import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import Servicos from '../Servicos';
import Despesas from '../Despesas';
import Clientes from '../Clientes';
import Usuarios from '../Usuarios';
import logo from '../../assets/logo.png';
import './styles.css';

import { getDashboardData } from '../../service/dashboardService';

function Dashboard({ conteudoInicial }) {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const nomeUsuario = usuarioLogado?.nome || 'Usuário';
  const [conteudo, setConteudo] = useState(conteudoInicial || 'dashboard');
  const [modalAviso, setModalAviso] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [metricas, setMetricas] = useState({
    totalServicosRealizados: 0,
    receitaTotal: 0,
    totalDespesas: 0,
    saldoFinanceiro: 0,
    despesasPorCategoria: {}
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const dashboardData = await getDashboardData();
        
        if (dashboardData.error) {
          if (dashboardData.error.includes('Token') || dashboardData.error.includes('Sessão')) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioLogado');
            setTimeout(() => { window.location.href = '/login'; }, 1000);
            return;
          }
        } else {
          setMetricas(dashboardData.metricas || {
            totalServicosRealizados: 0,
            receitaTotal: 0,
            totalDespesas: 0,
            saldoFinanceiro: 0,
            despesasPorCategoria: {}
          });
        }
      } catch (e) {
        console.error('Erro ao buscar dados do dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [conteudo]);

  const { totalServicosRealizados, receitaTotal, totalDespesas, saldoFinanceiro, despesasPorCategoria } = metricas;

  const handleMenuClick = (item) => {
    if (item === 'relatorios' || item === 'pagamentos') {
      setConteudo(item);
      setModalAviso(true);
    } else {
      setConteudo(item);
      navigate(`/${item}`);
    }
  };

  return (
    <div className="dashboard-container">
      {loading && <LoadingSpinner />}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li className={conteudo === 'dashboard' ? 'active' : ''} onClick={() => { setConteudo('dashboard'); navigate('/dashboard'); }}>Dashboard</li>
            <li className={conteudo === 'servicos' ? 'active' : ''} onClick={() => handleMenuClick('servicos')}>Serviços</li>
            <li className={conteudo === 'despesas' ? 'active' : ''} onClick={() => handleMenuClick('despesas')}>Despesas</li>
            <li className={conteudo === 'relatorios' ? 'active' : ''} onClick={() => handleMenuClick('relatorios')}>Relatórios</li>
            <li className={conteudo === 'pagamentos' ? 'active' : ''} onClick={() => handleMenuClick('pagamentos')}>Pagamentos</li>
            <li className={conteudo === 'clientes' ? 'active' : ''} onClick={() => handleMenuClick('clientes')}>Clientes</li>
            <li className={conteudo === 'usuarios' ? 'active' : ''} onClick={() => handleMenuClick('usuarios')}>Usuários</li>
          </ul>
        </nav>
        <div className="sidebar-user-menu">
          <button
            className="user-icon-btn"
            onClick={() => setShowUserMenu((v) => !v)}
            tabIndex={0}
            aria-label="Abrir menu do usuário"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="12" r="6" fill="#229645"/>
              <ellipse cx="16" cy="24" rx="10" ry="6" fill="#229645"/>
            </svg>
          </button>
          {showUserMenu && (
            <div className="user-menu-balloon">
              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
        <img src={logo} alt='Logo Auto Socorro' className="sidebar-logo-bottom" />
      </aside>
      <main className="dashboard-main">
        {conteudo === 'dashboard' && (
          <div>
            <h1>Bem-vindo {nomeUsuario}!</h1>
            <div className="dashboard-cards" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', margin: '32px 0' }}>
              <div className="dashboard-card">
                <h4>Total de Serviços Realizados</h4>
                <span>{totalServicosRealizados}</span>
              </div>
              <div className="dashboard-card">
                <h4>Receita Total</h4>
                <span>R$ {receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="dashboard-card">
                <h4>Total de Despesas</h4>
                <span>R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="dashboard-card">
                <h4>Saldo Financeiro</h4>
                <span style={{ color: saldoFinanceiro >= 0 ? '#229645' : '#c0392b' }}>
                  R$ {saldoFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 32 }}>
              <h4 style={{ marginBottom: 12 }}>Despesas por Categoria</h4>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {Object.entries(despesasPorCategoria).map(([cat, val]) => (
                  <div key={cat} className="dashboard-card" style={{ minWidth: 160 }}>
                    <strong>{cat}</strong>
                    <div>R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                ))}
                {Object.keys(despesasPorCategoria).length === 0 && (
                  <span style={{ color: '#888' }}>Nenhuma despesa cadastrada.</span>
                )}
              </div>
            </div>
          </div>
        )}
        {conteudo === 'servicos' && <Servicos />}
        {conteudo === 'despesas' && <Despesas />}
        {(conteudo === 'relatorios' || conteudo === 'pagamentos') && null}
        {conteudo === 'clientes' && <Clientes />}
        {conteudo === 'usuarios' && <Usuarios />}
      </main>
      {modalAviso && (
        <div className="modal-servico-backdrop">
          <div className="modal-servico" style={{ maxWidth: 340, textAlign: 'center' }}>
            <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>🚧</span>
            <h3 style={{ marginBottom: 8 }}>Funcionalidade em desenvolvimento!</h3>
            <button
              className="novo-servico-btn"
              style={{ marginTop: 16 }}
              onClick={() => setModalAviso(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
