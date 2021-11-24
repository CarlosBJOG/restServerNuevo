const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto} = require('../controllers/productos');

const { esIdCategoriaValido } = require('../helpers/categoria-validator');
const { existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

//agregar productos
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('categoria', 'El id de la categoria es requerido').not().isEmpty(),
    check('categoria').isMongoId(),
    check('categoria').custom( esIdCategoriaValido ),
    validarCampos
], crearProducto );

//obtener productos 
router.get('/',obtenerProductos);

//obtener producto por id 
router.get('/:id', [
    check('id', 'El id no es valido por mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto)

//actualizar producto 
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], actualizarProducto);

//eliminar producto 
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'EL id tiene es invalido por mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], eliminarProducto);


module.exports = router;