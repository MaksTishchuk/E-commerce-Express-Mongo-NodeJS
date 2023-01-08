const multer = require("multer")
const shortid = require("shortid")
const fs = require("fs")
const multerS3 = require("multer-s3")
const aws = require("aws-sdk")


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


const accessKeyId = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;

const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey,
});

exports.uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: "online-store-maks",
        acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname})
        },
        key: function (req, file, cb) {
            cb(null, shortid.generate() + "-" + file.originalname)
        },
    }),
})
