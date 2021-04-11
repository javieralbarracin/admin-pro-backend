const jwt = require('jsonwebtoken');

const validarJWT = (req,res,next)=>{
    // leer el token
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }
    else{
        token = req.header('x-token')
    }
    if(!token){
        return res.status(401).json({
            ok:false,
            msg:'No hay token en la solicitud'
        });
    }
    try {
        
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT
}