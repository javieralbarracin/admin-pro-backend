const { Router } = require('express');

const { validarCampos } = require('../middlewares/validar-campo');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getBuscarTodo, getDocumentoColeccion } = require('../controllers/busquedas');


const router = Router();

router.get('/:todo', validarJWT, getBuscarTodo );

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentoColeccion);

module.exports = router;