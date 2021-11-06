const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

    //limite de paginacion e inicio de la misma
    const { limite = 5, desde = 0 } = req.query;
    //query para que filtre los usuarios activos
    const query = {estado: true};
    //arreglo y desestructuracion de promesas para contar el numero de usuarios y filtrarlos 
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number( desde ) )
            .limit(Number( limite  ))
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {
 
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // hash de la contrase;a
    const salt = bcryptjs.genSaltSync(); //se pueden a;adir mas vueltas al password
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar registros 
    await usuario.save()

    res.json({
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const {_id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos 
    if ( password ) {
        // hash de la contrase;a
        const salt = bcryptjs.genSaltSync(); //se pueden a;adir mas vueltas al password
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {
    
    const { id } = req.params;
    //borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false} );

    res.json({
        id,
        usuario
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}