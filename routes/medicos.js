const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campo');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    obtenerMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
} = require('../controllers/medicos')
/***
 * Medicos
 * Path: '/api/medicos'
 */
const router = Router();

router.get('/', 
        validarJWT,
        obtenerMedicos
);
router.post('/', 
    [
     validarJWT, 
     check('nombre','El nombre es obligatorio').notEmpty(),
     validarCampos,
    ],
    crearMedico
);
router.put('/:id', 
    [
     validarJWT,
     check('nombre','El nombre es obligatorio').notEmpty(),
     validarCampos,
    ],
    actualizarMedico
);
router.delete('/:id',
    validarJWT, 
    eliminarMedico
);

module.exports = router;