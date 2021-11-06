const {Schema, model } = require('mongoose');


const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'Correo es obligatorio'],
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }    
});

usuarioSchema.methods.toJSON = function () {
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
}


module.exports = model( 'Usuario', usuarioSchema );