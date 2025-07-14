const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) return res.status(400).json({ error: 'Login e senha obrigatórios' });
  
  try {
    const usuario = await Usuario.findOne({ where: { login } });
    if (!usuario) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    
    const codigo_usuario = Number(usuario.codigo_usuario);
    
    const token = jwt.sign(
      { 
        id: codigo_usuario, 
        codigo_usuario: codigo_usuario, 
        perfil: usuario.perfil 
      }, 
      process.env.JWT_SECRET || 'segredo', 
      { expiresIn: '1h' }
    );
    
    res.json({
      codigo_usuario: codigo_usuario,
      nome: usuario.nome,
      login: usuario.login,
      perfil: usuario.perfil,
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar login' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários', message: error.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID de usuário inválido - deve ser um número' });
  }
  
  try {
    const usuario = await Usuario.findByPk(Number(id));
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário', message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome, login, senha } = req.body;
    if (!nome || !login || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }
    const hash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ ...req.body, senha: hash });
    res.json(usuario);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Login já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar usuário', message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  
  if (!id || id === 'undefined' || id === 'null' || !/^[0-9]+$/.test(id)) {
    return res.status(400).json({ error: 'ID de usuário inválido' });
  }
  
  try {
    const usuario = await Usuario.findByPk(Number(id));
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    if (req.body.senha) {
      req.body.senha = await bcrypt.hash(req.body.senha, 10);
    }
    
    await usuario.update(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário', message: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  
  if (!id || id === 'undefined' || id === 'null' || !/^[0-9]+$/.test(id)) {
    return res.status(400).json({ error: 'ID de usuário inválido' });
  }
  
  try {
    const usuario = await Usuario.findByPk(Number(id));
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    try {
      await usuario.destroy();
      res.json({ message: 'Usuário removido com sucesso' });
    } catch (err) {
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(400).json({ error: 'Não é possível excluir: existem despesas vinculadas a este usuário.' });
      } else {
        res.status(500).json({ error: 'Erro ao excluir usuário', message: err.message });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir usuário', message: error.message });
  }
};
