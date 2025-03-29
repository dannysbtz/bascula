const fs = require("fs");

Validations={}
Validations.validAllData=(body)=>{
  for(let i =0;i<body.length;i++){
    if (!body[i]) {
      return false
    }
  }
  return true
}

Validations.Validfiles = (files) => {
    if(files){
    const maxSize = 1024 * 1024;
      if (files.mimetype.split("/")[0] != "image") {
          fs.unlinkSync(`${process.env.IMG_FOLDER}/${files.filename}`);  
        return("No es una imagen");
      } else if (files.size > maxSize) {
          fs.unlinkSync(`${process.env.IMG_FOLDER}/${files.filename}`); 
        return("La imagen es muy grande");
      } 
  }else{
    return undefined;
  }
    return false;
  };

  Validations.DeleteFile = (link) => {
    fs.unlinkSync(link);  
  }
  module.exports = Validations;
