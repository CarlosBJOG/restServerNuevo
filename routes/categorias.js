const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, 
        obtenerCategorias,
        obtenerCategoriaPorId, 
        actualizarCategoria,
        borrarCategoria} = require('../controllers/categorias');

const { esIdCategoriaValido } = require('../helpers/categoria-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

//obtener todas las categorias paginadas
router.get('/', obtenerCategorias);

//obtener categoria por id
router.get('/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( esIdCategoriaValido ),
    validarCampos
], obtenerCategoriaPorId);


router.post('/', [
 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );


router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('id').custom( esIdCategoriaValido ),
    validarCampos,
],actualizarCategoria);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( esIdCategoriaValido ),
    validarCampos,
], borrarCategoria);



module.exports = router;