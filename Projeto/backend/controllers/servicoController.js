const Servico = require('../models/Servico');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

function validarCodigoUsuario(req, res) {
  const codigoUsuario = req.body.codigo_usuario;
  
  if (!codigoUsuario || codigoUsuario === 'undefined' || codigoUsuario === 'null') {
    if (req.usuario) {
      const userId = getUserId(req.usuario);
      if (userId) {
        req.body.codigo_usuario = Number(userId);
        return true;
      }
    }
    return false;
  }
  
  const codigo = Number(codigoUsuario);
  if (isNaN(codigo) || codigo <= 0) {
    return false;
  }

  req.body.codigo_usuario = codigo;
  return true;
}

function getUserId(usuario) {
  if (!usuario) return null;
  return usuario.codigo_usuario || usuario.id || null;
}

exports.getAll = async (req, res) => {
  try {
    if (!getUserId(req.usuario)) {
      return res.status(400).json({ error: 'ID de usuário inválido' });
    }

    const servicos = await Servico.findAll({
      include: [
        { model: Cliente, as: 'Cliente', required: false },
        { model: Usuario, as: 'Usuario', required: false }
      ]
    });

    res.json(servicos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços', message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    if (!validarCodigoUsuario(req, res)) {
      return res.status(400).json({ error: 'Código de usuário inválido' });
    }

    const servico = await Servico.create(req.body);
    res.status(201).json(servico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar serviço', message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    if (!validarCodigoUsuario(req, res)) {
      return res.status(400).json({ error: 'Código de usuário inválido' });
    }

    await Servico.update(req.body, { where: { codigo_servico: id } });
    const servico = await Servico.findByPk(id);
    res.json(servico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar serviço', message: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await Servico.destroy({ where: { codigo_servico: id } });
    res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover serviço', message: error.message });
  }
};
