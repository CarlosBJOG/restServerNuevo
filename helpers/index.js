const dbValidators       = require('./db-validators');
const genenerarJWT       = require('./generar-jwt');
const googleVerify       = require('./google-verify');
const subirArchivo       = require('./subir-archivo');
const categoriaValidator = require('./categoria-validator');

module.exports = {
    ...dbValidators,
    ...genenerarJWT,
    ...subirArchivo,
    ...categoriaValidator,
    ...googleVerify
}