
const { response } = require('express')
const bcryptjs  = require('bcryptjs');

const  Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { verify }= require('../helpers/google-verify');

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

const googleSignIn = async (req, res=response) =>{

    const googleToken = req.body.token;
    try {
        
        const { name, email, picture} = await verify(googleToken);      
        let usuario;
        // verificar si ya existe el usuario en la BD
        const usuarioDB = await Usuario.findOne({ email });
        // si no existe el usuario en la BD
        if( !usuarioDB ){
            usuario = new Usuario({
                 nombre:name,
                 email,
                 password:'@@@',   
                 img:picture,
                 google:true
            });
        }else{
            usuario= usuarioDB;
            usuario.google=true;
        }
        // Guardar en la BD
        await usuario.save();

        // Generar el Token - JWT        
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            token
        })
    } catch (error) {
      res.status(401).json({
        ok:true,
        token:'El token no es correcto'
      })
    }
    
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT( uid );
            
    const usuario = await Usuario.findById( uid );
    res.json({
        ok: true,
        token,
        usuario
    });

}
module.exports = {
    login, googleSignIn, renewToken
}