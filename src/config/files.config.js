
const multer  = require('multer');
const configFiles={};

configFiles.Upload = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, process.env.IMG_FOLDER);
        },
        filename: function (req, file, cb) {
          const fileExt = file.originalname.split('.').pop(); // Obtener la extensión original
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          const fileNameWithoutExt = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
          const safeFileName = fileNameWithoutExt.replace(/\s+/g, '_').toLowerCase(); // Reemplazar espacios con guiones bajos y convertir a minúsculas
          cb(null, safeFileName + '-' + uniqueSuffix + '.' + fileExt);
        }
      })
    return multer({ storage });
  }  
module.exports=configFiles;
