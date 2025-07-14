const express = require('express');
const router = express.Router();
const despesaController = require('../controllers/despesaController');
const autenticarToken = require('../middlewares/autenticarToken');

router.use(autenticarToken);

router.get('/', despesaController.getAll);
router.post('/', despesaController.create);
router.put('/:id', despesaController.update);
router.delete('/:id', despesaController.delete);

module.exports = router;
