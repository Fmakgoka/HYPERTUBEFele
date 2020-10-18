var multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/^(.*?)((?:\.\w+)+)$/, `$1-${Date.now()}$2`));
    }
});

//CHECK FILE TYPE
const fileFilter = (req, file, cb) => {
    const filetypes = ['image/png', 'image/jpeg', 'image/gif'];

    if (filetypes.indexOf(file.mimetype) === -1)
        return cb(null, false);
    cb(null, true);
};

// init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: fileFilter,
}).single('image');

module.exports = upload;