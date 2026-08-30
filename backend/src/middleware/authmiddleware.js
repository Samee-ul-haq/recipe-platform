import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const verifyToken=async(req,res,next)=>{
    try {
        const authHeader=req.header('Authorization')
        if(!authHeader)
            return res.status(401).json({message:"Access Denied"})

        //remove Bearer
       const token=authHeader.split(' ')[1]
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        
        req.user=decoded;
        next()
    } catch (error) {
        res.status(400).json({message:"Someting went wrong"})
    }
}