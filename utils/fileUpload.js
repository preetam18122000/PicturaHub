const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,file,callback) => {
        callback(null, "content") // first arg is error, second arg is file saving location
    },
    fileName: (req, file, callback) => { //giving fileName as two users may upload a file with the same name
        callback(null, Date.now() + path.extname(file.originalname));  //extname -> extension of file (.jpeg, .jpg, etc)
    }
});

const upload = multer ({
    storage,
    limits: { fileSize: 100000 * 100 }, //around 10 Mb, this is in bytes
    fileFilter: ( req, file, callback ) => {
        const fileTypes = /jpeg|jpg|png|mp4|gif/;
        const mimeType = fileTypes.test(file.mimetype); //file should be one of the above four extension
        const extname = fileTypes.test(path.extname(file.originalname));
        if(mimeType && extname) {
            return callback(null, true);
        }
        callback("Only images are supported");
    }
}).single("content"); //single -> we will only upload one pic at a time

module.exports = upload;