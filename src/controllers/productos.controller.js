const Productos=require("../models/Productos.model");
const { validAllData,Validfiles, DeleteFile } = require("../helpers/files");
const GenericModel=require("./shared/crud.class")
const s3Client = require("../libs/s3Client");
const {PutObjectCommand} = require("@aws-sdk/client-s3")
const fs = require("fs");

class productosClass extends GenericModel {
  constructor() {
   super(Productos,CreateProductosDto);
  }
  async create(req){
    try {
      let fileValidation=Validfiles(req.file);
       if(fileValidation){
       return { status: 400, error: fileValidation };
     }else if(fileValidation===false){

      const photo = fs.readFileSync(`images/${req.file.filename}`);
      try {
        fs.unlinkSync(`images/${req.file.filename}`);  

      } catch (error) {
        console.log(error)
      }

      const bucketParams = {
        Bucket: 'minsuper',
        Key: req.file.filename,
        Body: photo,
        ACL: 'public-read'
      }

      await s3Client.send(new PutObjectCommand(bucketParams))

      req.body.imagen = `${process.env.SERVER_IMG_S3}${req.file.filename}`
    }
      const dto = new this.dtoClass(req.body);
      const valid = await dto.createValid()

      if (valid) {
        return { status: 400, error: valid};
      }
        const result = await this.model.create(dto);
        return { status: 200, data: result };
      } catch (error) {
        console.error('Error al crear:', error);
        return { status: 500, error: 'Error interno del servidor:' + error };
      }
  }

  async update(id, req) {
    try {
      let fileValidation
      if(req.file){
        fileValidation=Validfiles(req.file);
        if(fileValidation){
        return { status: 400, error: fileValidation };
        }else if(fileValidation===false){
          const photo = fs.readFileSync(`images/${req.file.filename}`);
          try {
            fs.unlinkSync(`images/${req.file.filename}`);  
    
          } catch (error) {
            console.log(error)
          }
    
          const bucketParams = {
            Bucket: 'abarroterasf',
            Key: req.file.filename,
            Body: photo,
            ACL: 'public-read'
          }
    
          await s3Client.send(new PutObjectCommand(bucketParams))
         req.body.imagen=`${process.env.SERVER_IMG_S3}${req.file.filename}`
        }
      }
      const dto = new this.dtoClass(req.body);
      const valid = await dto.createValid()
      if (valid) {
        return { status: 400, error: valid };
      }

       const result = await this.model.findByIdAndUpdate(id, req.body, {new: true});
       return { status: 200, data: result };
    } catch (error) {
      return { status: 500, error: 'Error interno del servidor:' + error };
    }
  }

  async delete(id) {
    try {

      const producto = await this.model.findById(id);
      if (!producto) {
          return { status: 404, error: 'Producto no encontrado' };
      }

       await this.model.findByIdAndDelete(id);
      return { status: 200, data: 'OK' };
    } catch (error) {
      return { status: 500, error: 'Error interno del servidor:' + error };
    }
  }
}
class CreateProductosDto {
  constructor(
    {
    nombre,
    codigo,
    description,
    precioStandar,
    costo,
    categoria,
    precioVip,
    imagen
    }
    ) {
      this.nombre =nombre;
      this.codigo =codigo;
      this.description=description
      this.precioStandar=precioStandar;
      this.categoria = categoria;
      this.costo=costo;
      this.precioVip=precioVip;
      this.imagen =imagen;
      
  }

  async createValid() {
   if(!this.hasAllDAta())
    return "Llene todos los campos"
    return false
  }

  hasAllDAta(){
    let dataToValid = [
      this.nombre,
      this.codigo,
      this.description,
      this.precioStandar,
      this.categoria,
      this.costo,
      this.precioVip,
      this.imagen
    ]
    return validAllData(dataToValid)
  }
}
module.exports = productosClass;