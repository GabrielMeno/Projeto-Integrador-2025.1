const Cliente = require('../models/Cliente');

exports.getAll = async (req, res) => {
  const clientes = await Cliente.findAll();
  res.json(clientes);
};

exports.create = async (req, res) => {
  const cliente = await Cliente.create(req.body);
  res.status(201).json(cliente);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await Cliente.update(req.body, { where: { codigo_cliente: id } });
  const cliente = await Cliente.findByPk(id);
  res.json(cliente);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Cliente.destroy({ where: { codigo_cliente: id } });
  res.json({ message: 'Cliente removido' });
};
