const { response } = require('express');
const bcrypt  = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const obtenerUsuarios = async (req,res=response)=>{

    const desde = Number(req.query.desde) || 0;

    // const usuarios = await Usuario.find({},'nombre email role')
    //                                 .skip(desde)
    //                                 .limit(10)

    // const total = await Usuario.count();

    const [ usuarios, total ] = await Promise.all([
        Usuario.find({},'nombre email role google img')
                                    .skip(desde)
                                    .limit(10),
        Usuario.count()                           

    ]);

    res.json({
        ok:true,
        usuarios,
        total
    });

}

const crearUsuario = async (req,res=response)=>{
    const { email, password } = req.body
    
    try {
        // Validacion de email
        const existeEmail = await Usuario.findOne({email});

        if(existeEmail) return res.status(400).json({
            ok:false,
            msg:'Email ya registrado'
        })
        
        const usuario = new Usuario( req.body );
    
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
    
        // Guardar usuario
        await usuario.save();
    
        // Generar el TOKEN - JWT
        //console.log(usuario._id +' || '+usuario.id)
        const token = await generarJWT( usuario.id );

        res.json({
            ok:true,
            usuario,
            token
        });
    
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, revisar logs'
        })
    }
}
const actualizarUsuario = async (req,res=response)=>{
    const uid = req.params.id; 
    try {
        //console.warn('el id enviado->',uid)
        const usuarioDB = await Usuario.findById(uid);
        if ( !usuarioDB ) {
            return res.status(204).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        
        if( !usuarioDB.google ){
            campos.email = email;
        }else if(usuarioDB.email!==email){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no puede ser cambiado el email'
            });
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, revisar logs'
        })
    }
}
const eliminarUsuario = async(req,res=response)=>{
    const uid = req.params.id;
    try {
        //validacion del usuario a eliminar
        const usuarioDB = await Usuario.findById(uid);
        if ( !usuarioDB ) {
            return res.status(204).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, revisar logs'
        })
    }
}
module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}