const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {

    const { correo, password } = req.body;
    try{
        const usuario = await Usuario.findOne({correo});
        //verificar si existe el email
        if( !usuario ) return res.status(400).json({msg: "Usuario / Password Incorrectos - correo"})

        //verificar si el usuario esta activo
        if( !usuario.estado ) return res.status(400).json({msg: "Usuario / Password Incorrectos - estado:false"})
        
        //verificar password 
        const validPassword = bcryptjs.compareSync( password, usuario.password);
        if( !validPassword ) return res.status(400).json({msg: "Usuario / Password Incorrectos - password"})

        //generar el jwt
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token,
        })

    }catch(error){
        console.error(error);
        return res.status(500).json({
            msg: 'hable con el administrador'
        })
    }

   
}

module.exports = {
    login
}