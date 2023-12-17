import Usuario from "../models/Usuario.js";
import jwt from 'jsonwebtoken';


const checkAuth = async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
   
        try{
           
            token=req.headers.authorization.split(" ")[1];
        
            if(!token || token === 'null') {
                const error = new Error("Token No valido");
                return res.status(401).json({msg:error.message});
            }
            

         
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.usuario= await Usuario.findById(decoded.id).select("-password -confirmado -token");
            
        }catch(error){
            console.log(error);
        }
    };

    if(!token) {
        const error = new Error("Token No valido");
        return res.status(401).json({msg:error.message});
    }
    next();
   
}
export default checkAuth;