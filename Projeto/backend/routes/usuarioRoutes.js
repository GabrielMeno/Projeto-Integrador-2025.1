const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middlewares/autenticarToken');
const somenteAdmin = require('../middlewares/somenteAdmin');

router.post('/', usuarioController.login);
router.post('/login', usuarioController.login);

router.get('/', autenticarToken, usuarioController.getAll);
router.get('/:id([0-9]+)', autenticarToken, usuarioController.getById);
router.post('/criar', usuarioController.create);
router.put('/:id([0-9]+)', autenticarToken, somenteAdmin, usuarioController.update); 
router.delete('/:id([0-9]+)', autenticarToken, somenteAdmin, usuarioController.delete); 

module.exports = router;
