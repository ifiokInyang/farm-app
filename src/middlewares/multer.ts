import { join, extname as _extname } from "path";
import multer, { diskStorage } from "multer";

const fileSizeLimitErrorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: any
) => {
	if (err) {
		console.log(err);
		next(err);
	} else {
		next();
	}
};

//Set The Storage Engine
const storage = diskStorage({
	destination: function (req, file, cb) {
		cb(null, join(__dirname, "../../public/uploads"));
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname +
				"-" +
				new Date().toISOString().replace(/:/g, "-") +
				_extname(file.originalname)
		);
	},
});

//Check File Type
function checkFileType(file: any, cb: any) {
	//Allowed ext
	const filetypes = /jpeg|jpeg|jpg|png|gif/;

	//Check ext
	const extname = filetypes.test(_extname(file.originalname).toLowerCase());
	//Check mine
	const mimetype = filetypes.test(file.mimetype);
	console.log(file);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb({ message: "Error: Images Only!" });
	}
}

//Init Upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 100000000000 },
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});

export { upload, fileSizeLimitErrorHandler };
