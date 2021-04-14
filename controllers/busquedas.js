const { response } = require('express');

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const getBuscarTodo = async (req,res=response)=>{
    const data = req.params.todo

    //console.log(data)
    const regexp     = new RegExp(data, 'i');

    // const usuarios   = await Usuario.find({ nombre: regexp });
    // const hospitales = await Hospital.find({ nombre: regexp });
    // const medicos    = await Medico.find({ nombre: regexp });

    const [usuarios, hospitales, medicos] = await Promise.all([
        await Usuario.find({ nombre: regexp }),
        await Hospital.find({ nombre: regexp }),
        await Medico.find({ nombre: regexp })
    ]);  

    res.json({
        ok:true,
        usuarios,
        hospitales,
        medicos
    });

}

const getDocumentoColeccion = async (req,res=response)=>{
    
    const tabla    = req.params.tabla
    const busqueda = req.params.busqueda
    const regexp   = new RegExp(busqueda, 'i');

    let data = []
    switch(tabla){
        case 'usuarios':
            data = await Usuario.find({ nombre: regexp });
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regexp })
                                 .populate('usuario', 'nombre img'); 
            break;
        case 'medicos':
            data = await Medico.find({ nombre: regexp })
                               .populate('usuario', 'nombre img')
                               .populate('hospital', 'nombre img');
            break;  
        default:
            return res.status(400).json({
                ok:false,
                msg:'la tabla tiene que ser usuarios/hospitales/medicos'
            });                  
    }
    res.json({
        ok:true,
        data:data
    });
}

module.exports = {
    getBuscarTodo, getDocumentoColeccion
}