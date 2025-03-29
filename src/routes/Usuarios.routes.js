 const express=require('express');
 const router=express.Router();
 const userClass=require('../controllers/usuarios.controller');
 const Controller = new userClass();
 //usuarios
    router.post("/",async (req,res)=>{
       res.send(await Controller.create(req.body,req));
    });
    router.post("/login",async (req,res)=>{
       res.send(await Controller.Login(req.body,res))
    });
    router.get("/",async (req,res)=>{
      res.send(await Controller.getAll(req))
   });
   router.route("/:id")
    .put(async ( req, res ) => {
      res.send(await Controller.update(req))
    })
    .delete(async (req, res) => {
      res.send(await Controller.delete(req.params.id,req))
    });
 module.exports=router