const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');
const autenticarToken = require('../middlewares/autenticarToken');

router.use(autenticarToken);

router.get('/', servicoController.getAll);
router.post('/', servicoController.create);
router.put('/:id', servicoController.update);
router.delete('/:id', servicoController.delete);

module.exports = router;
