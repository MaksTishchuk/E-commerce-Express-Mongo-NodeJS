const multer = require("multer")
const shortid = require("shortid")
const fs = require("fs")


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type!');
        if (isValid) {
            uploadError = null
        }
        callback(uploadError, 'uploads')
    },
    filename: (req, file, callback) => {
        callback(null, shortid.generate() + "-" + file.originalname)
    },
})
exports.upload = multer({storage})
