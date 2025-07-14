const Servico = require('../models/Servico');
const Despesa = require('../models/Despesa');
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const { Op } = require('sequelize');

function getUserId(usuario) {
  if (!usuario) return null;
  return usuario.codigo_usuario || usuario.id || null;
}

exports.getDashboardData = async (req, res) => {
  try {
    if (!req.usuario || (typeof req.usuario.id === 'undefined' && typeof req.usuario.codigo_usuario === 'undefined')) {
      return res.status(400).json({ error: 'ID de usuário inválido' });
    }

    const servicos = await Servico.findAll({
      include: [
        { model: Cliente, as: 'Cliente', required: false },
        { model: Usuario, as: 'Usuario', required: false }
      ]
    });

    const despesas = await Despesa.findAll({
      include: [
        { model: Usuario, as: 'Usuario', required: false }
      ]
    });

    const totalServicosRealizados = servicos.filter(s => s.status === 'Concluído').length;
    
    const receitaTotal = servicos
      .filter(s => s.status === 'Concluído')
      .reduce((acc, s) => acc + Number(s.valor || 0), 0);
    
    const totalDespesas = despesas.reduce((acc, d) => acc + Number(d.valor || 0), 0);
    
    const saldoFinanceiro = receitaTotal - totalDespesas;

    const despesasPorCategoria = {};
    despesas.forEach(d => {
      const categoria = d.categoria && d.categoria.trim() !== '' 
        ? d.categoria 
        : (d.tipo && d.tipo.trim() !== '' ? d.tipo : '-----');
      
      despesasPorCategoria[categoria] = (despesasPorCategoria[categoria] || 0) + Number(d.valor || 0);
    });

    res.json({
      metricas: {
        totalServicosRealizados,
        receitaTotal,
        totalDespesas,
        saldoFinanceiro,
        despesasPorCategoria
      },
      servicos,
      despesas
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
};
