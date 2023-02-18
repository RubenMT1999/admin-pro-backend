const { response } = require('express')
const { validationResult } = require('express-validator')

const validarCampos = (req, resp = response, next) => {

    //En este punto ya hemos pasado los middlewares, validadores
    //establecidos en el usuario.js routes.
    //Ahora podemos capturar los errores que nos haya devuelto.
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return resp.status(400).json({
            ok:false,
            errors: errores.mapped()
        });
    }

    //si no hay errores se llama al next
    next();
}

module.exports = {
    validarCampos
}