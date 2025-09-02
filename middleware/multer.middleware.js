import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

// Create storage dynamically
const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join("public", folderName);

      // Ensure folder exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + (req.body?.title || "file");
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};

// Reusable middleware generator
export const createUpload = (folderName, options = {}) => {
  const limits = {
    fileSize: options.fileSize || 5 * 1024 * 1024, // default 5MB
  };

  const fileFilter = (req, file, cb) => {
    if (options.allowedTypes) {
      if (!options.allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"), false);
      }
    }
    cb(null, true);
  };

  return multer({
    storage: createStorage(folderName),
    limits,
    fileFilter,
  });
};