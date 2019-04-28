const mongoose= require('mongoose')
const Schema=mongoose.Schema

const schemaStudent= new Schema({
    name:{type:String,required:true},
    userName:{type:String,required:true},
    passWord:{type:String,required:true},
    school:{type:String,required:true},
    college:{type:String,required:true},
    class:{type:String,required:true},
    studentId:{type:Number,required:true},
    gender:{type:String,required:true},
    phoneNum:{type:Number,required:true},
    email:{type:String,required:true},
    dob:{type:String,required:true},
    avatar:{type:String},
    role:{type:String,default:'student'}
})



module.exports=mongoose.model('schemaStudent',schemaStudent)
