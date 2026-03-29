/**
 * This will be the starting file of the project
 */

const express = require("express")
const mongoose = require("mongoose")
const app = express()
const server_config = require("./configs/server.config")
const db_config = require("./configs/db.config")
const user_model = require("./models/user.model")
const bcrypt = require("bcryptjs")



/**
 * create an admin user at the starting of the application
 * if not already present
 */

//connection with mongodb

mongoose.connect(db_config.DB_URL)

const db = mongoose.connection

db.on("error",()=>{
    console.log("error while connecting to mongodb")
})

db.once("open",()=>{
    console.log("conneted to mongodb")
    init()
})

 async function init(){
    let user = await user_model.findOne({userId : "admin"})

    if(user){
        console.log("Admin is already present")
        return
    }
    try{
        user = await user_model.create({
            name : "Akanksha",
            userId : "Anna",
            email : "akanksha987@gmail.com",
            usertype : "ADMIN",
            password : bcrypt.hashSync("Anna29",8)
            
        })

         console.log("Admin created",user)

    }catch(err){
            console.log("Error while creating admin",err)
    }
}
/**
 * start the server
 * port no. is customisable which means it might change so create configs folder
 */

//app.listen(8080, ()=>{
app.listen(server_config.PORT, ()=>{
    console.log("server started at port no : ",server_config.PORT)
})