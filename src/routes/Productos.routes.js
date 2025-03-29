 const express=require('express');
 const router=express.Router();
 const {Upload}=require('../config/files.config');
 const upload=Upload();

 const productosClass=require('../controllers/productos.controller');
  const Controller = new productosClass();
 //productos
 router.route("/")
   .get( async (req,res)=>{
          res.send(await Controller.getAll());
   })

   .post(upload.single("imagen"), async (req,res)=>{
      res.send(await Controller.create(req));    
   });

  router.route("/:id")
    .patch(upload.single("imagen"), async ( req, res ) => {
      res.send(await Controller.update(req.params.id, req))
    })
    .delete(async (req, res) => {
      res.send(await Controller.delete(req.params.id))
    });
   


 module.exports=router