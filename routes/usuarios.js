
const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validarCampos');
const { esRoleValido, emailValido, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check( 'rol' ).custom( esRoleValido ),
    validarCampos 
], usuariosPut );

router.post('/', [
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'password', 'El password debe de ser mas de 6 letras' ).isLength( {min: 6} ),
    check( 'correo', 'El correo no es valido' ).isEmail(),
    check('correo').custom( emailValido ),
    check( 'rol' ).custom( esRoleValido ),
    validarCampos
], usuariosPost );

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
],usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;