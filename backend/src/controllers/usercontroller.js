import db from '../config/db.js'
import bycrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'

export const registerUser=async(req,res)=>{
    try {
        const {email,password}=req.body

        // check if user exists
        const sql="SELECT email FROM users WHERE email=?"
        const [rows]=await db.query(sql,[email])

        if(rows.length)
           return res.status(409).json({message:"User already exists"})

        const sql2="INSERT INTO users (email,password) VALUES (?,?)"

        //hash password..
        const hashedPassword=await bycrypt.hash(password,10)

        const [result]=await db.query(sql2,[email,hashedPassword])
        
        res.json({
            message:"User Created successfully",
            id:result.insertId  // ID just created
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body

        const sql="SELECT id,email,password FROM users WHERE email=?"
        const [rows]=await db.query(sql,[email])

        if(rows.length===0)
            return res.status(400).json({message:"User not found,Create Account"})

        const user=rows[0]
        const isPasswordValid=await bycrypt.compare(password,user.password)

        if(isPasswordValid){
            const token=jwt.sign(
                {id:user.id},
                process.env.JWT_SECRET,
                {expiresIn:'1h'}
            )
           return res.status(200).json({
            message:"logged in successfully",
            token,
            user:{
                id:user.id,
                email:user.email,
                avatar:user.avatar
            }
            })
        }
          return res.status(400).json({message:"Wrong password"})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const uploadAvatar=async(req,res)=>{
    try {
        if(!req.file)
            return res.status(400).json({message:"No file uploaded"})

        const imagePath=req.file.path
        const userId=req.user.id

        const sql="UPDATE users SET avatar=? WHERE id=?"
        const [result]=await db.query(sql,[imagePath,userId])

        res.json({
            message:"Profile picture updated!",
            avatar:imagePath
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}