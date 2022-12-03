const mongoose=require('mongoose')

const Schema=mongoose.Schema

const userSchema=new Schema({
    title:{type:String},
    author_name:{type:String},
    genre:{type:String},
    userRef: [{type: Schema.Types.ObjectId, ref: "User"}]
})

const book= mongoose.model("Books",userSchema);

module.exports=book