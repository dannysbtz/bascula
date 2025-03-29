const Usuarios=require("../models/Usuarios.model");
const GenericModel=require("./shared/crud.class")
const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const secretKey = process.env.JWT_SECRET || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5';
class userClass extends GenericModel {
  constructor() {
   super(Usuarios,CreateUserDto);
  }
 async Login(data,res){
    try {
      const { username, password } = data ;
      const user =  await Usuarios.findOne({username});
      if(!user){
        return { status: 400, error: 'Usuario Incorrecto' };
      }else{
          const match = await bcrypt.compare(password, user.password);
            if(match){
              const userDataWithoutPassword = { ...user.toJSON(), password: undefined };
              const accessToken = jwt.sign(userDataWithoutPassword, secretKey, { expiresIn: '18h' });
              return {
                status: 200,
                data: userDataWithoutPassword,
                token: accessToken
              };
              
            }else{
              return { status: 400, error: 'Constraseña Incorrecta' };
            }
        }
    } catch (error) {
      return { status: 500, error: 'Error interno del servidor:' + error };
    }
  }

  async create(data) {
    try {
      const dto = new this.dtoClass(data);
      const valid = await dto.createValid()
      if (valid) {
        return { status: 400, error: valid };
      }
      const newUser = new this.model(dto);
      newUser.password = await newUser.encryptPassword(newUser.password);
      await newUser.save();
      return { status: 200, data: "Usuario Creado" };
    } catch (error) {
      console.error('Error al crear:', error);
      return { status: 500, error: 'Error interno del servidor:' + error };
    }
  }

  async update(req) {
    try {
      const dto = new this.dtoClass(req.body);
      if(!dto.createValid()){
        return { status: 400, error: 'Datos no válidos' };
      }
      const user = await this.model.findById(req.params.id);
      if (!user) {
        return { status: 404, error: 'Usuario no encontrado' };
      }
      if (dto.password !== user.password) {
        dto.password = await user.encryptPassword(dto.password);
      }
      const result = await this.model.findByIdAndUpdate(req.params.id, dto, {new: true});
       return { status: 200, data: result };
    } catch (error) {
      return { status: 500, error: 'Error interno del servidor:' + error };
    }
  }
  async delete(id) {
    try {
      const usuario = await this.model.findById(id);
      if (!usuario) {
          return { status: 404, error: 'Usuario no encontrado' };
      }
       await this.model.findByIdAndDelete(id);
      return { status: 200, data: 'OK' };
    } catch (error) {
      return { status: 500, error: 'Error interno del servidor:' + error };
    }
  }
}
// Se usa para Validaciones
class CreateUserDto {
  constructor({ nombre, username, password,userType }) {
    this.nombre = nombre;
    this.username = username;
    this.password = password;
    this.userType=userType;
  }

  async createValid() {
   if(!this.hasAllDAta())
    return "Llene todos los campos"
   if(await this.existUser())
    return "El nombre de usuario ya existe"
    return false
  }

  hasAllDAta(){
    return !!this.nombre && !!this.username && !!this.password && !!this.userType;
  }
  async  existUser(){
    try {
        if( await Usuarios.findOne({ username: this.username }))
          return true
      return false
    } catch (error) {
      console.error(error)
    }
  }
}
module.exports = userClass;
