const mongoose = require('mongoose');
const {Schema}=mongoose;
const ProductosSchema=new Schema({
    nombre: {type: String,required:true},
    codigo: {type: String,required:true},
    description: {type: String,required:false},
    precioStandar: {type:Number,required:true},
    costo: {type:Number,required:true},
    precioVip: {type:Number,required:true},
    imagen: {type: String,required:false,default: '' },
    categoria: {
        type: String,
        enum: ['Jabones', 'Dulces','Vinos y Licores', 'Bebidas','Frutas y Verduras', 'Abarrotes', 'Linea Blanca', 'Accesorios', 'Medicamentos', 'Lacteos', 'Bimbo','Sabritas','Salchichoneria'],
        default: 'Abarrotes',
        required: false
      },  
});

module.exports=mongoose.model('productos',ProductosSchema);