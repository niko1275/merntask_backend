
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

app.listen(4000,()=>{
    console.log(`Servidor Corriendo En el puerto ${PORT}`);
    
})

