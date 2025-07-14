const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const autenticarToken = require('../middlewares/autenticarToken');

router.use(autenticarToken);

router.get('/', clienteController.getAll);
router.post('/', clienteController.create);
router.put('/:id', clienteController.update);
router.delete('/:id', clienteController.delete);

module.exports = router;
