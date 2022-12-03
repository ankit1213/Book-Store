const express=require("express");
const cors=require('cors')
const bodyParser=require('body-parser')
const {body,validationResult}=require('express-validator')
const bcrypt=require('bcrypt')
const jwt =require("jsonwebtoken")
const mongoose=require('mongoose')
const User=require('./models/register')
const Book=require("./models/book")

const app=express();
const PORT=process.env.PORT || 5000;
app.use(cors());
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/books").then(
    console.log("Server successfully connected to the database")
).catch(e=>{
    console.log(e.message)
})
   


app.post("/register",

    async(req,res)=>{
        // body(email).isEmail(),
        // body(password),
        // body(confirmPassword)

        // const errors=validationResult(req)

        // if(!errors.isEmpty()){
        //    return res.status(400).json({
        //         status:"Registration Unsuccessful",
        //         errors:errors.array()
        //     })
        // }
        const {email,password,confirmPassword}=req.body;
        
        const repeatedEmail=await User.findOne({email:email})

        if(repeatedEmail){
            return res.status(400).json({
                status:"regsitration unsuccessful",
                message:"Email already exists.Please register with another Email"
            })
        }

        if(password!=confirmPassword){
           return res.status(400).json({
                status:"registration unsuccessful",
                message:"Passwords do not match"
            })
        }
        
        const hash= bcrypt.hash(password,10,async(err,hash)=>{
            if(err){
                res.status(400).json({
                    message:"Registration Unsuccessful"
                })
            }
            else{
                const newUser= await User.create({
                    email:email,
                    password:hash

                })

                res.status(200).json({
                    status:"Registration Successful",
                    message:"New user created"
                })
            }
        })
            console.log(req.body)
    })

    // ---------------------------------------------------------

    
const secret = "my-secret"




app.post("/login", async(req,res)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    const userData=await User.findOne({email})

    if(userData){
        bcrypt.compare(password, userData.password, async (err, result) => {
            if(err) {
                return res.status(400).json({
                    status: "Failed",
                    message: err.message
                })
            }
            if(result){
                const token=jwt.sign(
                    {
                        exp: Math.floor(Date.now()/1000) + 60*60,
                        data: userData._id
                    },
                    secret
                );
                
                return res.status(200).json({
                    status:"Login Successful",
                    token
                });
            }
        
    })
    }else{
        return res.status(400).json({
            status: "Failed",
            message: "Invalid credentials! Please provide valid email/password"
        })
    }
} catch(e) {
    res.status(500).json({
        status: "Failed",
        message: e.message
    })
}
    
})


app.listen(PORT,(err)=>{
    if(!err){
        console.log("Server is up at 5000 port.")
    }
})
