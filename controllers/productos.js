const { response } = require("express");
const { Producto, Categoria } = require('../models');

const crearProducto = async (req, res = response) => {
    
    const {estado, usuario, ...body} = req.body;
    const producto = await Producto.findOne({nombre:body.nombre});
    if(producto) {
        return res.status(400).json({
            msg: `Producto ${producto.nombre} ya existe en la bd`
        })
    }
    // preparamos la data
    const data = {
        nombre: body.nombre.toUpperCase(),
        categoria: req.body.categoria, 
        usuario: req.usuario._id,
    }

    const productoSave = new Producto(data);
    await productoSave.save();

    res.status(200).json(productoSave);
}

const obtenerProductos = async (req, res = response) => {

    const {limite = 5, desde = 0} = req.query;

    //productos activas
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number(desde) )
            .limit( Number( limite ) )
    ])

    res.json({
        total,
        productos
    })

}

const obtenerProducto = async (req, res) => {
    //comprobar si existe la categoria
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    if(!producto)return res.status(400).json({msg: 'No existe El producto en la bd'});
    //comprobar si esta activo el producto
    if (!producto.estado) return res.status(400).json({ msg: 'El producto esta desactivado' })
    
    res.json({
        producto
    })
}

//actualizar producto
const actualizarProducto = async (req, res) => {

    const { id } = req.params;
    const { estado, usuario, ...data} = req.body;
    
   if(data.nombre) data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, {new : true})

    res.json({
        producto
    })
}

const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true}).populate('usuario', 'nombre');

    res.status(200).json({
        productoBorrado
    })
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
}