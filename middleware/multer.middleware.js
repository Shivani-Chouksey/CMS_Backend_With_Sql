import multer from 'multer';


// save files inside existing project directory
const storage = multer.diskStorage(
    {
        destination: function (req, file, callback) {
            const filePath = req.baseUrl.split("/api/v1/")?.[1]
            console.log("filePath", req.baseUrl, req.baseUrl.split("/api/v1/")?.[1]);

            callback(null, `./public/${filePath}`)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + req.body?.title
            // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            console.log("File Details ---> Multer Middleware -->", file);
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    }
)


export const upload = multer({ storage: storage });

