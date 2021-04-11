const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campo');
const { obtenerHospitales, crearHospital, actualizarHospital,eliminarHospital } = require('../controllers/hospitales');
const { validarJWT } = require('../middlewares/validar-jwt');
/***
 * Hospitales
 * Path: '/api/hospitales'
 */
const router = Router();

router.get('/', 
        validarJWT,
        obtenerHospitales
);
router.post('/', 
    [
     check('nombre','El nombre es obligatorio').notEmpty(),
     validarCampos,
    ],
    validarJWT, 
    crearHospital
);
router.put('/:id', 
    [
     validarJWT,
     check('nombre','El nombre es obligatorio').notEmpty(),
     validarCampos,
    ],
    actualizarHospital
);
router.delete('/:id',
    validarJWT, 
    eliminarHospital
);

module.exports = router;