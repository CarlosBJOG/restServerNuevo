const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;
    try{

        const { nombre, img, correo } = await googleVerify( id_token );
        // cargar esquema de la BD
        let usuario = await Usuario.findOne({correo});
        //si no existe el usuario se crea
        if( !usuario ) {
            const data = {
                nombre,
                correo, 
                password: '|p',
                img, 
                rol: 'USER_ROLE',
                google: true, 
            }
            usuario = new Usuario(data);
            await usuario.save();
            
        }

        //verificar si el usuario esta activo
        if(!usuario.estado) return res.status(401).json({ msg: 'Usuario Bloqueado hable con el administrador'});
        //crear el token
        //generar el jwt
        const token = await generarJWT( usuario.id );
       
        res.status(200).json({
            usuario, 
            token, 
    
        })
    
    }catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn,
}