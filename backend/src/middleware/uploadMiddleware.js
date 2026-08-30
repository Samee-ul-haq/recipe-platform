import multer from "multer";
import path from 'path'
 
//Defining where to store files
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'src/uploads/')
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9)
        cb(null,uniqueSuffix+path.extname(file.originalname))
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image/'))
        cb(null,true)

    else cb(new Error("NOT AN IMAGE!"),false)
}

export const upload=multer({
    storage:storage,
    limits:{fieldSize:5*1024*1024},
    fileFilter:fileFilter
})