import db from '../config/db.js'

export const uploadRecipe=async(req,res)=>{
    // console.log("----------------UPLOAD DEBUG----------------")
    // console.log("1. Req.file:", req.file) 
    // console.log("2. Req.body:", req.body)
    // console.log("--------------------------------------------")
    const connection=await db.getConnection()
    try {
     await connection.beginTransaction()
     const imagePath = req.file ? req.file.path : null
        const {title,description}=req.body
        let ingredients=req.body

        if(typeof ingredients==='string'){
        ingredients=[ingredients]
        }
        if(!title)
            return res.status(400).json({message:"title can't be empty"})


        const sql1="INSERT INTO ingredients (name) VALUES (?)"
        const sql2="SELECT id FROM ingredients WHERE name=?"
        const sql3="INSERT INTO recipes (title,description,image_url,user_id) VALUES (?,?,?,?)"
        const sql4="INSERT INTO recipe_ingredients (recipe_id, ingredients_id, quantity) VALUES (?, ?, ?)"

       // console.log("Test 1",req.user.id)

        const [result]=await connection.query(sql3,[title,description,imagePath,req.user.id])
        const recipeID=result.insertId

        if(Array.isArray(ingredients) && ingredients.length>0){
           for (const ingredient of ingredients){
                let ingredientID=0;

                //check if the ingredient alredy exists..
                const [existing]=await connection.query(sql2,[ingredient])
               
                if(existing.length>0){
                    ingredientID=existing[0].id
                }
                 
                else {
                    const [rows]=await connection.query(sql1,[ingredient])
                     ingredientID=rows.insertId
                }
                const quantity="1 Unit"
              await connection.query(sql4,[recipeID,ingredientID,quantity])
              //  console.log("recipeID",recipeID)
        }
    }
    // Save everything
        await connection.commit()
        res.status(201).json({
            message:"Recipe uploaded successfully",
            recipe_id:recipeID
        })
    } catch (error) {
        await connection.rollback()

        return res.status(500).json("Something went wrong")
    }finally{
        connection.release()
    }
}

export const getRecipeById=async(req,res)=>{
    try {
        const recipeId=req.params.id
        const [recipeRows]=await db.query("SELECT id,title,description,user_id FROM recipes WHERE id=?",[recipeId])

        if(recipeRows.length===0)
            return res.status(404).json({message:"Recipe not avaliable"})

        const recipe=recipeRows[0]

        const sql="SELECT i.name,ri.quantity FROM ingredients i JOIN recipe_ingredients ri ON i.id=ri.ingredients_id WHERE ri.recipe_id=?"

        const [ingredientRows]=await db.query(sql,[recipeId])

            //atach the ingredients array to recipe object
            res.json({
                ...recipe, 
            ingredients: ingredientRows
            })
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAllRecipes=async(req,res)=>{
    try {
        const {search,chef,sort}=req.query
        let sql="SELECT recipes.*,users.email as chef_email FROM recipes JOIN users ON recipes.user_id=users.id WHERE 1=1"
        const params=[]

        if(search){
            sql+=" AND (recipes.title LIKE ? OR recipes.description LIKE ?)"
            params.push(`%${search}%`,`%${search}%`)
        }

        if(chef){
            sql+=" AND recipes.user_id=?"
            params.push(chef)
        }
       if(sort==='oldest'){
        sql+=" ORDER BY created_at ASC"
       }
       else{
        sql+=" ORDER BY created_at DESC"
       }
       const connection=await db.getConnection()
       const [rows]=await connection.query(sql,params)
       connection.release()
        
       res.json(rows)
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}