
import  express, { json }  from "express";
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from './routes/tareaRoutes.js'
const app =  express();
app.use(express.json());
dotenv.config();
connectDB();

//Configurar Cors
const whilelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin,callback){
        console.log(origin)
        if(whilelist.includes(origin)){
            callback(null,true);
        }else{
            callback(new Error("Error de Cors"));

        }
    }
}

app.use(cors(corsOptions));

//Routing 
app.use("/api/usuarios",usuarioRoutes);
app.use("/api/proyectos",proyectoRoutes);
app.use("/api/tareas",tareaRoutes);
const PORT = process.env.PORT || 4000;

const servidor = app.listen(4000,()=>{
    console.log(`Servidor Corriendo En el puerto ${PORT}`);
    
})

import {Server, Socket} from 'socket.io';

const io = new Server(servidor,{
    pingTimeout:60000,cors:{
        origin:process.env.FRONTEND_URL,
    },
})

io.on('connection',(socket)=>{
   
    socket.on('proyecto',(proyecto)=>{
        socket.join(proyecto)
    })


    socket.on('nueva tarea',(tarea)=>{
        const proyecto = tarea.proyecto
        socket.on(proyecto).emit('tarea agregada',tarea);
    })
})