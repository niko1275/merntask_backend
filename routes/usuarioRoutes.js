import express from 'express';
import { crearUsuario,autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil} from '../controllers/usuarioControllers.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/login',autenticar);
router.post('/',crearUsuario); //crear Nuevo user
router.get("/confirmar/:token",confirmar);
router.post("/olvide-password",olvidePassword);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.get('/perfil',checkAuth,perfil);
export default router;