const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_config = require("../configs/auth.config")

/**
 * Create a mw will check if the request body is proper and correct
 */

const verifysignUpBody = async(req,res,next)=>{
    try{
        //check for the name
        if(!req.body.name){
            return res.status(400).send({
                message : "Failed ! Name was not provided in the request body"
            })
        }
        //check for the email
        if(!req.body.email){
            return res.status(400).send({
                message : "Failed ! Email was not provided in the request body"
            })
        }
        //check for the userId
        if(!req.body.userId){
            return res.status(400).send({
                message : "Failed ! UserId was not provided in the request body"
            })
        }
        //check if user with the same userId is already present
        const user = await user_model.findOne({userId : req.body.userId})
        if(user){
           return res.status(400).send({
                message : "Failed ! User with the same userId is already present"
            }) 
        }
        next()

    }catch(err){
        console.log("Error while validating the request object",err)
        res.status(500).send({
            message : "Error while validating the request body"
        })  
    }
}

const verifysignInBody = async(req,res,next)=>{
      if(!req.body.userId){
        return res.status(400).send({
            message : "UserId is not provided"
        })
      }
      if(!req.body.password){
        return res.status(400).send({
            message : "Password is not provided"
        })
      }
    next()
}

const verifytoken = (req,res,next)=>{
    //check if the token is present in the header
    const token = req.headers['x-access-token']

    if(!token){
        return res.status(403).send({
            message : "No token found : Unauthorised"
        })
    }

    //If the token is valid
    jwt.verify(token,auth_config.secret, async(err,decoded)=>{
        if(err){
            return res.status(401).send({
                message: "UnAuthorised"
            })
        }
        const user = await user_model.findOne({userId : decoded.id})
        if(!user){
            return res.status(400).send({
                message : "UnAuthorised, the user for this token doesn't exist"
            })
        }
        //set the user info in the req body
        req.user = user

        //then move to the next step
        next()
    })
    
}

const isAdmin = (req,res,next)=>{
    const user = req.user
    if(user && user.usertype=="ADMIN"){
        next()
    }else{
        res.status(403).send({
            message : "Only ADMIN users are allowed to access this endpoint"
        })
    }
}

module.exports = {
        verifysignUpBody : verifysignUpBody,
        verifysignInBody : verifysignInBody,
        verifytoken : verifytoken,
        isAdmin : isAdmin
    }