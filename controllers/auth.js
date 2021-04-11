
const { response } = require('express')
const bcryptjs  = require('bcryptjs');

const  Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async(req,res=response) => {

    const { email,password }=req.body
    try {
        //veificar email
        const usuarioDB = await Usuario.findOne({email:email})
        if(!usuarioDB){
            res.status(400).json({
                ok:false,
                msg:'Email no encontrado'    
            })
        }
        //verificar contraseña
        const validPass=bcryptjs.compareSync(password, usuarioDB.password)
        if(!validPass){
            res.status(400).json({
                ok:false,
                msg:'Password no encontrada'    
            })
        }
        //Generar el Token - JWT        
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
}

module.exports = {
    login
}