const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL )

const { response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const { Producto, Usuario } = require('../models');

const cargarArchivo = async (req, res = response) => {
    
    try{
        const nombre = await subirArchivo(req.files, undefined, 'imgs' );
        res.json({nombre})
    }catch(msg){
        res.status(404).json({msg})
    }  
}

const actualizarImagen = async ( req, res = response ) => {
        
    const { id, coleccion} = req.params;

    let modelo;

    switch( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ) return res.status(400).json({ msg: `No existe el usuario con id: ${id}` })
            
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ) return res.status(400).json({ msg: `No existe eun producto con id: ${id}` })
            
        break;
        
        default: 
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    //limpiar imagenes previas
    try{
        if( modelo.img ){
            //hay que borrar la imagen del servidor 
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if( fs.existsSync( pathImagen ) ){
                fs.unlinkSync( pathImagen ); 
            }
        }
    }catch(e){
        return res.status(500).json({msg: "Olvide validar esto - path imagen"})
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion );
    modelo.img = nombre;
    
    await modelo.save();
    res.json( modelo )
}

const mostrarImagen = async (req, res =response) => {

    const { id, coleccion} = req.params;

    let modelo;

    switch( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ) return res.status(400).json({ msg: `No existe el usuario con id: ${id}` })
            
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ) return res.status(400).json({ msg: `No existe eun producto con id: ${id}` })
            
        break;
        
        default: 
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    //mostrar imagen
    try{
        if( modelo.img ){
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if( fs.existsSync( pathImagen ) ){
                return res.sendFile( pathImagen );
            }
        }
    }catch(e){
        return res.status(500).json({msg: "Error al cargar la imagen - path imagen"})
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg' );
    res.sendFile( pathImagen );

    // res.json({ msg: "falta place holder"})
}

const actualizarImagenCloudinary = async ( req, res = response ) => {
        
    const { id, coleccion} = req.params;

    let modelo;

    switch( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ) return res.status(400).json({ msg: `No existe el usuario con id: ${id}` })
            
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ) return res.status(400).json({ msg: `No existe un producto con id: ${id}` })
            
        break;
        
        default: 
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    //limpiar imagenes previas
    // try{
    if( modelo.img ){
        const nombreArr = modelo.img.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1];
        const [ public_id ]       = nombre.split('.');
        await cloudinary.uploader.destroy( public_id );
    }
    // }catch(e){

    // }
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )
    //hay que borrar la imagen del servidor 

    modelo.img = secure_url;
    await modelo.save();
    res.json( modelo )
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}