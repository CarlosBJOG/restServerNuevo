

const { Router } = require('express');
const { check } = require('express-validator');
const { buscarProductoPorCategoria } = require('../controllers/buscar');
const { esIdCategoriaValido } = require('../helpers/categoria-validator');
const { validarCampos } = require('../middlewares');

const router = Router();
router.get('/:coleccion/:id', [
    check('id', 'Tiene que ser un mongo id valid').isMongoId(),
    check('id').custom( esIdCategoriaValido ),
    validarCampos,
],buscarProductoPorCategoria);


module.exports = router;
