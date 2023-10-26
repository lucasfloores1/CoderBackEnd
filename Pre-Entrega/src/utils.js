const multer = require('multer');
const path = require('path');

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

const opts = {
    storage,
};

module.exports = {
    uploader : multer({ storage })
};