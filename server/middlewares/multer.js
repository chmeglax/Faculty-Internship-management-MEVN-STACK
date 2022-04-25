const multer = require('multer')


const fileStorageEngine= multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename: (req,file,cb)=> {
        cb(null,Date.now()+'--'+file.originalname);
    },
})
//Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /pdf|docx|doc|pptx|ppt|xlsx|xlsm|xlsb|xltx|jpeg|jpg|png|zip/;
  
    // Check mime
    const mimeType = filetypes.test(file.mimetype);
  
    if(mimeType) {
      return cb(null,true);
    } else {
      cb(new Error('Les formats valides sont : Pdf, Word, PowerPoint, Excel, Image ou Zip'));
    }
  }
  
  //Middleware Multer for files uploading
  const upload = multer({
      storage: fileStorageEngine,
      fileFilter: function(req, file, cb){
         checkFileType(file, cb)
      }
  })

module.exports = upload;