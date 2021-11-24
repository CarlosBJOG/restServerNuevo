const Categoria = require('../models/categoria');

//en las validaciones custom es necesario utilizar el throw new Error

const esIdCategoriaValido = async (id= '') => {
    const existeCategoria = await Categoria.findById( id );
    if( !existeCategoria ){
        throw new Error(`La categoria no esta registrada en la BD`);
    }
}



module.exports = {
    esIdCategoriaValido
}