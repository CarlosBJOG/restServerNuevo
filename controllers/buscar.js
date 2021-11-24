const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Producto, Usuario, Categoria } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias', 
    'productos', 
    'roles'
];

const buscarUsuarios = async ( termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );
    if( esMongoId ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario ) ? [ usuario ] : [],
        })
    }
    //busqueda insensible 
    const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    
    const resultados = await Usuario.count({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        results: usuarios,
        resultados
        
    })
}

const buscarCategorias = async ( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );
    if( esMongoId ) {
        const categoria = await Categoria.findById( termino );
        return res.json({
            results: ( categoria ) ? [ categoria ] : [],
        })
    }
    const regex = new RegExp( termino, 'i');
    const categorias = await Categoria.find({ nombre: regex, estado: true })
        .populate('usuario', 'nombre');
    const resultados = await Categoria.count({ nombre: regex })

    res.json({
        results: categorias,
        resultados   
    })
}

const buscarProductos = async ( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );
    if( esMongoId ) {
        const producto = await Producto.findById( termino );
        return res.json({
            results: ( producto ) ? [ producto ] : [],
        })
    }
    const regex = new RegExp( termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado:true })
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');


    res.json({
        results: productos,  
    })
}

const buscar = async (req, res = response) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({ 
            msg:`Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){

        case 'usuarios':
            buscarUsuarios( termino, res );
        break;

        case 'categorias':
            buscarCategorias( termino, res );
        break; 

        case 'productos':
            buscarProductos( termino, res );
        break;

        default:
            res.status(500).json({
                msg:'Se le olvido hacer esta busqueda'
            })
    }
}
const buscarProductoPorCategoria = async (req, res = response) => {
    const { coleccion, id } = req.params;
    const coleccionPermitida = ['productos'];
    if( !coleccionPermitida.includes( coleccion ) ) {
        return res.status(400).json({ 
            msg:`Las coleccion permitida es ${coleccionPermitida}`
        })
    }
    const productos = await Producto.find( {categoria: ObjectId(id), estado: true})
                                    .populate('categoria', 'nombre')
                                    .populate('usuario', 'nombre')

    res.json({
        productos
    })
}

module.exports = {
    buscar,
    buscarProductoPorCategoria
}