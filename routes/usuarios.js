const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campo');
const { getUsuarios, crearUsuario, actualizarUsuario,eliminarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', 
        validarJWT,
        getUsuarios
);
router.post('/', 
    [
     check('nombre','El nombre es obligatorio').notEmpty(),
     check('password','El password es obligatorio').notEmpty(),
     check('email','El email es obligatorio').isEmail(),
     validarCampos,
    ],
    crearUsuario
);
router.put('/:id', 
    [
     validarJWT,
     check('nombre','El nombre es obligatorio').notEmpty(),
     check('password','El password es obligatorio').notEmpty(),
     check('email','El email es obligatorio').isEmail(),
     validarCampos,
    ],
    actualizarUsuario
);
router.delete('/:id',
    validarJWT, 
    eliminarUsuario
);

module.exports = router;