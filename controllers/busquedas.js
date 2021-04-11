const { response } = require('express');

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const buscar = async (req,res=response)=>{
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

module.exports = {
    buscar
}