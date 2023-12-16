import Proyecto from "../models/Proyecto.js"
import Tareas from "../models/Tareas.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req,res)=>{
   const proyectos= await Proyecto.find({'$or' :[{'colaboradores':{$in: req.usuario}},{'creador': {$in: req.usuario}}],});
   res.json(proyectos);
}


const nuevoProyecto = async (req,res) =>{
    const proyecto= new Proyecto(req.body);
    proyecto.creador= req.usuario._id;

    try{
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    }catch(error){
        console.log(error);
    }
}


const obtenerProyecto= async (req,res)=>{
    const {id} = req.params;
   
    const proyecto =  await Proyecto.findById(id).populate({path:"tareas",populate:{path:"completado",select:'nombre'}}).populate('colaboradores',"nombre email");
    if(!proyecto) {
        const error= new Error("No encontrado")
        return res.status(400).json({msg:error.message});
    }
    if(proyecto.creador.toString()!==req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString()) ){
        const error= new Error("Accion No valida")
        return res.status(401).json({msg:error.message});
    };

    res.json(
        proyecto
    );

};


const editarProyecto = async(req,res)=>{
    const {id} = req.params;
   
    const proyecto =  await Proyecto.findById(id);
    if(!proyecto) {
        const error= new Error("No encontrado")
        return res.status(400).json({msg:error.message});
    }
    if(proyecto.creador.toString()!==req.usuario._id.toString()){
        const error= new Error("Accion No valida")
        return res.status(401).json({msg:error.message});
    };

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente= req.body.cliente || proyecto.cliente;

    try{
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    }catch(error){
        console.log(error);
    }
   

}


const eliminarProyecto= async(req,res)=>{
    const {id} = req.params;
   
    const proyecto =  await Proyecto.findById(id);
    if(!proyecto) {
        const error= new Error("No encontrado")
        return res.status(400).json({msg:error.message});
    }
    if(proyecto.creador.toString()!==req.usuario._id.toString()){
        const error= new Error("Accion No valida")
        return res.status(401).json({msg:error.message});
    };

    try{
        await proyecto.deleteOne();
        res.json({msg:"Proyecto eliminado"})
    }catch(error){
        console.log(error)
    }

}

const agregarColaborador = async (req, res) => {
    const {email} = req.body
    const proyecto = await Proyecto.findById(req.params.id);
    const usuario = await Usuario.findOne({email}).select('-password -confirmado -createdAt -token -updatedAt')

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.json({ msg: error.message });
    }

    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error('El creador del proyecto no puede ser colaborador');
        return res.json({ msg: error.message });
    }

    if (proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error('El usuario ya pertenece al proyecto');
        return res.status(404).json({ msg: error.message });
    }

    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    return res.json({ msg: 'Colaborador agregado correctamente' });
};

const eliminarColaborador = async(req,res)=>{
    
    const proyectoo = await Proyecto.findById(req.params.id)
    console.log(proyectoo)
    console.log(req.body.id)
    const colaboradorId = req.body.id;
    if(!proyectoo) {
        const error= new Error("No encontrado")
        return res.status(400).json({msg:error.message});
    }

    if(proyectoo.creador.toString()!==req.usuario.id.toString()){
        const error= new Error("Accion No valida")
        return res.status(401).json({msg:error.message});
    };


    proyectoo.colaboradores.pull(colaboradorId);
    await proyectoo.save();
    return res.json({ msg: 'Colaborador eliminado Correctamente' });

}

const buscarColaborador = async (req,res) => {
    const {email} = req.body;
    const usuario = await Usuario.findOne({email}).select('-password -confirmado -createdAt -token -updatedAt')
    if(!usuario){
        const error = new Error('Usuario no encontrado');
        return res.json({msg:error.message})
    }
    res.json(usuario)

}




export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador,
  
   
}