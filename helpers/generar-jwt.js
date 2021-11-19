const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {
    return new Promise((resolve, reject) => {

        const payLoad = { uid };

        jwt.sign( payLoad, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err) {
                console.error(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }
        })

    });
}

module.exports = {
    generarJWT,
}