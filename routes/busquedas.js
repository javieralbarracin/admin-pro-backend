const { Router } = require('express');

const { validarCampos } = require('../middlewares/validar-campo');
const { validarJWT } = require('../middlewares/validar-jwt');

const { buscar } = require('../controllers/busquedas');


const router = Router();

router.get('/:todo', 
        validarJWT,
        // [
        //   check('nombre','El nombre es obligatorio').notEmpty(),
        //   validarCampos,
        // ],
        buscar
);

module.exports = router;