const { response } = require('express');

const Hospital = require('../models/hospital');

const obtenerHospitales = async (req,res=response)=>{

    const hospitales = await Hospital.find({},'nombre img')

    res.json({
        ok:true,
        hospitales
    });

}

const crearHospital = async (req,res=response)=>{
    const { nombre, img } = req.body
    
    try {
        // Validacion de nombre de hospital
        const existeHospital = await Hospital.findOne({nombre});

        if(existeHospital) return res.status(400).json({
            ok:false,
            msg:'Hospital ya registrado'
        })
        
        const uid = req.uid
        const hospital = new Hospital( {
                                usuario:uid,
                                ...req.body
                            });
        
        // Guardar hospital
        const hospitalRegistrado = await hospital.save();
    
        res.json({
            ok:true,
            hospital: hospitalRegistrado
        });
    
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, revisar logs'
        })
    }
}
const actualizarHospital = async (req,res=response)=>{
    const uid = req.params.id; 
    try {
        //console.warn('el id enviado->',uid)
        const hospitalDB = await Hospital.findById(uid);
        if ( !hospitalDB ) {
            return res.status(204).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }

        // Actualizaciones
        const { nombre, img, ...campos } = req.body;

        if ( hospitalDB.nombre !== nombre ) {

            const existeHospital = await Hospital.findOne({ email });
            if ( existeHospital ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un hospital con ese nombre'
                });
            }
        }
        
        campos.nombre = nombre;
        const hospitalActualizado = await Hospital.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, revisar logs'
        })
    }
}
const eliminarHospital = async(req,res=response)=>{
    const uid = req.params.id;
    try {
        //validacion del usuario a eliminar
        const hospitalDB = await Hospital.findById(uid);
        if ( !hospitalDB ) {
            return res.status(204).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }
        await Hospital.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
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
    obtenerHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}