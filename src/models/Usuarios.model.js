const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const {Schema}=mongoose;
const UserSchema=new Schema({
    nombre: {type: String,required:true},
    username: {type: String, required: true, unique: true},
    password: {type: String,required:true},
    userType: {
        type: String,
        enum: ['Administrador', 'Empleado'],
        default: 'Empleado',
        required: true
      },   
});
UserSchema.methods.encryptPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};
module.exports=mongoose.model('usuarios',UserSchema);