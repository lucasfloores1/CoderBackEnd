import multer from 'multer';
import path from 'path';
import url from 'url';

// const multer = require('multer');
// const path = require('path');

//dirname
const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//multer
const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        const folderPath = path.join(__dirname, '../public/img');
        callback(null, folderPath);
    },
    filename : (req, file, callback) => {
        const fileName = Date.now() + '-' + file.originalname;
        callback(null, fileName);
    },
});

export const uploader = multer({ storage });
// module.exports = {
//     uploader : multer({ storage })
// };