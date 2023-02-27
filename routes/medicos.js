/*
ruta: '/api/hospitales' 
 */

/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require('../controllers/medicos');

const router = Router();

router.get( '/', getMedicos);

//el segundo parametro son los middlewares, serán los validadores
//primero hacemos los checks y luego el middleware personalizado, pue sen el
//necesitamos que se hayan ejecutado antes los checks
router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del medico es necesario').not().isEmpty(),
        check('hospital','El hospital id es necesario').isMongoId(),
        validarCampos
    ], 
    crearMedico );


router.put( '/:id',
    [

    ],
    actualizarMedico);


router.delete( '/:uid', validarJWT, borrarMedico);




module.exports = router;