const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//en las validaciones custom es necesario utilizar el throw new Error

const esRoleValido = async (rol= '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}

const emailValido = async ( correo ='' ) => {
    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if( existeEmail ) {
        throw new Error(`El correo ${correo} ya esta registrado en la BD`);
    }      
}

const existeUsuarioPorId = async ( id ='' ) => {
    //verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ) {
        throw new Error(`El id: ${id}, no existe`);
    }      
}

//existe producto 
const existeProductoPorId = async ( id = '') => {
    const existeProducto = await Producto.findById(id);
    if( !existeProducto ) {
        throw new Error(`El producto con id: ${id}, no existe`);
    }
}

const coleccionesPermitidas = (coleccion ='', colecciones = []) => {
    // const incluida = colecciones.includes(coleccion);
    if( !colecciones.includes(coleccion) ) throw new Error(`La coleccion ${coleccion} no esta permitida, ${ colecciones }`)
    return true;
}



module.exports = {
     esRoleValido,
     emailValido,
     existeUsuarioPorId,
     existeProductoPorId,
     coleccionesPermitidas,
}