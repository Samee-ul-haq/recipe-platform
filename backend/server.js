import express from 'express'
import pool from './src/config/db.js'
import 'dotenv/config'
import userRouter from './src/routes/userRouter.js'
import recipeRouter from './src/routes/recipeRouter.js'
import cors from 'cors'
import path from 'path'

const app=express()

//Allowing react to talk to backend
app.use(cors({
    origin:'*',
    credentials:true
}))
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("recipe API is running! 📚")
})

app.use('/api/recipes',recipeRouter)
app.use('/api/auth',userRouter)
app.use('/uploads', express.static(path.join(process.cwd(),'src','uploads')));

const port=process.env.DB_PORT || 3000
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})