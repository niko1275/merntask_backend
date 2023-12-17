import express from "express";
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from './routes/tareaRoutes.js'

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

// // Configurar Cors
// const corsOptions = {
//     origin: process.env.FRONTEND_URL
// };

// app.use(cors(corsOptions));


// Configurar CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors(corsOptions));

// Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor Corriendo En el puerto ${PORT}`);
});
