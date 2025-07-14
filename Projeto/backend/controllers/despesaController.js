const Despesa = require('../models/Despesa');
const Usuario = require('../models/Usuario');

function getUserId(usuario) {
  if (!usuario) return null;
  return usuario.codigo_usuario || usuario.id || null;
}

exports.getAll = async (req, res) => {
  try {
    if (!getUserId(req.usuario)) {
      return res.status(400).json({ error: 'ID de usuário inválido' });
    }
    
    const despesas = await Despesa.findAll({
      include: [
        { model: Usuario, as: 'Usuario', required: false }
      ]
    });
    
    res.json(despesas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar despesas', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.codigo_usuario || req.body.codigo_usuario === 'undefined' || req.body.codigo_usuario === 'null') {
      const userId = getUserId(req.usuario);
      if (userId) {
        req.body.codigo_usuario = userId;
      } else {
        return res.status(400).json({ error: 'ID de usuário inválido' });
      }
    }
    
    req.body.codigo_usuario = Number(req.body.codigo_usuario);
    
    const despesa = await Despesa.create(req.body);
    res.status(201).json(despesa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar despesa', error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.body.codigo_usuario || req.body.codigo_usuario === 'undefined' || req.body.codigo_usuario === 'null') {
      const userId = getUserId(req.usuario);
      if (userId) {
        req.body.codigo_usuario = userId;
      } else {
        return res.status(400).json({ error: 'ID de usuário inválido' });
      }
    }
    
    req.body.codigo_usuario = Number(req.body.codigo_usuario);
    
    await Despesa.update(req.body, { where: { codigo_despesa: id } });
    const despesa = await Despesa.findByPk(id);
    res.json(despesa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar despesa', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Despesa.destroy({ where: { codigo_despesa: id } });
    res.json({ message: 'Despesa removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover despesa', error: error.message });
  }
};
