const { response } = require('express');
const hospital = require('../models/hospital');

const Medico = require('../models/medico');

const obtenerMedicos = async (req,res=response)=>{
    
    //desestructurar campos a ocultar
    const medicos = await Medico.find()
                                .populate('usuario','nombre email')
                                .populate('hospital', 'nombre img')

    res.json({
        ok:true,
        data: medicos
    });

}

const crearMedico = async (req, res=response)=>{
    const { nombre, hospital } = req.body
    
    try {
        // Validacion de nombre de medico
        const existeMedico = await Medico.findOne({nombre});

        if(existeMedico) return res.status(400).json({
            ok:false,
            msg:'Médico ya registrado'
        })
        //console.log('id de usuario en el token medcos controller-->',req.uid)
        const uid = req.uid
        const hid = req.hospital
        const medico = new Medico( {
                                usuario:uid,  
                                hospital:hid,                              
                                ...req.body
                            });
        // Guardar medico
        const medicoRegistrado = await medico.save();
    
        res.json({
            ok:true,
            medico: medicoRegistrado
        });
    
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, revisar logs'
        })
    }
}
const actualizarMedico = async (req,res=response)=>{
    const mid = req.params.id; 
    try {
        //console.warn('el id enviado->',uid)
        const medicoDB = await Medico.findById(mid);
        if ( !medicoDB ) {
            return res.status(204).json({
                ok: false,
                msg: 'No existe un medico por ese id'
            });
        }

        // Actualizaciones
        const { nombre, hospital, ...campos } = req.body;

        if ( medicoDB.nombre !== nombre ) {

            const existeMedico = await Medico.findOne({ nombre });
            if ( existeMedico ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un médico con ese nombre'
                });
            }
        }
        
        campos.nombre = nombre;
        campos.hospital = hospital;
        campos.uid = req.uid
        const medicoActualizado = await Medico.findByIdAndUpdate( mid, campos, { new: true } );

        res.json({
            ok: true,
            medico: medicoActualizado
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, revisar logs'
        })
    }
}
const eliminarMedico = async(req,res=response)=>{
    const uid = req.params.id;
    try {
        //validacion del usuario a eliminar
        const medicoDB = await Medico.findById(uid);
        if ( !medicoDB ) {
            return res.status(204).json({
                ok: false,
                msg: 'No existe un médico por ese id'
            });
        }
        await Medico.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Médico eliminado'
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
    obtenerMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}