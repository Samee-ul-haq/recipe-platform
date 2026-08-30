import express from 'express'
import { uploadRecipe,
    getRecipeById,
    getAllRecipes
 } from '../controllers/recipecontroller.js'
import { verifyToken } from '../middleware/authmiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'

const router=express.Router()

router.get('/:id',getRecipeById)
router.get('/',getAllRecipes)
router.post('/',verifyToken,upload.single('image'),uploadRecipe)

export default router