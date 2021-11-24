const express = require('express');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            categoria: '/api/categorias',
            usuarios: '/api/usuarios',
        }
        //conecar a bd
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

    }

    async conectarDB() {
        await dbConnection()
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

    }

    routes() {
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.categoria, require('../routes/categorias'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));      

    }

    listen() {
        this.app.listen( this.port, () => {
            console.info('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
