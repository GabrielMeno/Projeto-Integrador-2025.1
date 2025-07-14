require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const Servico = require('./models/Servico');
const Despesa = require('./models/Despesa');
const Cliente = require('./models/Cliente');
const Usuario = require('./models/Usuario');

const usuarioRoutes = require('./routes/usuarioRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const despesaRoutes = require('./routes/despesaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

Servico.belongsTo(Cliente, { foreignKey: 'codigo_cliente', as: 'Cliente' });
Cliente.hasMany(Servico, { foreignKey: 'codigo_cliente', as: 'Servicos' });

Servico.belongsTo(Usuario, { foreignKey: 'codigo_usuario', as: 'Usuario' });
Usuario.hasMany(Servico, { foreignKey: 'codigo_usuario', as: 'Servicos' });

Despesa.belongsTo(Usuario, { foreignKey: 'codigo_usuario', as: 'Usuario' });
Usuario.hasMany(Despesa, { foreignKey: 'codigo_usuario', as: 'Despesas' });

sequelize.authenticate()
  .then(() => console.log('Conectado ao banco!'))
  .catch(err => console.error('Erro ao conectar:', err));

sequelize.sync();

app.use('/login', usuarioRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/servicos', servicoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/despesas', despesaRoutes);
app.use('/dashboard', require('./routes/dashboardRoutes'));

const autenticarToken = require('./middlewares/autenticarToken');
const somenteAdmin = require('./middlewares/somenteAdmin');

const path = require('path');

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get(/^\/(?!api|servicos|despesas|clientes|usuarios).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));