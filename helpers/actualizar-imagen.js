const Usuario  = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico   = require('../models/medico');

const fs = require('fs');
const borrarImagen = (path) =>{
    if (fs.existsSync(path)){
        fs.unlinkSync(path) //borrar la imagen anterior
    }
}
const actualizarImagen = async (tipo, id, nombreArchivo)=>{
    let pathViejo='';
    switch( tipo ){
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if(!usuario){
                return false
            }
            //validar si tiene imagen previamente asignada
            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathViejo)
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if(!hospital){
                return false
            }
             //validar si tiene imagen previamente asignada
             pathViejo = `./uploads/hospitales/${ hospital.img }`;
             borrarImagen(pathViejo)
            hospital.img = nombreArchivo;
            await medico.save();
            return true;
            break;
        case 'medicos':
            const medico = await Medico.findById(id);
            if(!medico){
                return false
            }
            //validar si tiene imagen previamente asignada
            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen(pathViejo)
            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;
        default:
            return false;
    }

}

module.exports = {
    actualizarImagen
}