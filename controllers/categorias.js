const { response } = require("express");
const { Categoria } = require('../models');

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});
    if( categoriaDB ) return res.status(400).json({ 
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
    })
    //generar la data a guardar  
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria( data );

    //guardar eb db
    await categoria.save();

    res.status(201).json(categoria);

}

const obtenerCategorias = async (req, res = response) => {
    const {limite = 5, desde = 0} = req.query;

    //categorias activas
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
            .populate('usuario', 'nombre')
            .skip( Number(desde) )
            .limit( Number( limite ) )
    ])

    res.json({
        total,
        categorias
    })

}

const obtenerCategoriaPorId = async (req, res) => {

    //comprobar si existe la categoria
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    if(!categoria){
        return res.status(400).json({
            msg: 'No existe la categoria en la bd'
        })
    }
    //comprobar si esta activa la categoria
    if (!categoria.estado){
        return res.status(400).json({
            msg: 'La categoria esta desactivada'
        })
    }

    res.json({
        categoria
    })
}

//actualizar categoria 
const actualizarCategoria = async ( req, res) => {

    const { id } = req.params;
    const { estado, usuario, ...data} = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate( id, data, {new : true})

    res.json({
        categoria
    })
    
}

//borrar categoria  
const borrarCategoria = async (req, res) => {
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true}).populate('usuario', 'nombre');

    res.status(200).json({
        categoriaBorrada
    })
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    borrarCategoria,
}