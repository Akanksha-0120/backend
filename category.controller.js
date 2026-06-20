const category_model = require("../models/category.model")

/**
 * controller fo creating the category
 * POST http://localhost:8888/ecomm/api/v1/auth/categories
 * 
 * {
 *   "name" : "Household",
     "description" : "This will have all the household items"
   }
 */ 

exports.createNewCategory = async (req,res)=>{
    //Read the req body
   //Create the category object
   const cat_data ={
    name : req.body.name,
    description : req.body.description
   }
   
   try{
     //Insert into Mongodb
     const category = await category_model.create(cat_data)
     return res.status(201).send(category)
   }catch(err){
     console.log("Error while creating the category")
     return res.status(500).send({
        message : "Error while creating the category"
     })
   }
}
