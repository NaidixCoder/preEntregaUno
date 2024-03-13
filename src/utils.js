import multer from "multer";
import { fileURLToPath } from "url";


const imgPath = fileURLToPath(new URL('./public/img', import.meta.url));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgPath)
    },
    filename: function( req, file, cb ) {
        cb(null, file.originalname)
    }
});

export const uploader = multer({storage})