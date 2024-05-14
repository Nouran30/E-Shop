import multer from "multer";

const multerUpload = () => {
    const storage = multer.memoryStorage()

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept the file
        } else {
            cb(new ApiError('Only image files are allowed.', 404), false); // Reject the file
        }
    };

    const upload = multer({ storage, fileFilter });
    return upload;
}

export const uploadSingleImage = multerUpload().single('image');
export const uploadMixedImages = multerUpload().fields([
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    },
])