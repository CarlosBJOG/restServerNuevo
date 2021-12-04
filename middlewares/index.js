const validaCampos = require('../middlewares/validarCampos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarArchivoSubir = require('../middlewares/validarArchivo');


module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivoSubir

}