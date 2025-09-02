import multer from 'multer';


// save files inside existing project directory
const storage = multer.diskStorage(
    {
        destination: function (req, file, callback) {
            callback(null, "./public/news")
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + req.body?.title
            // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
              console.log("File Details ---> Multer Middleware -->", file);
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    }
)


export const upload = multer({storage: storage });
