const multer = require("multer");

var storageProperties = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/../files/");
  },

  filename: function(req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    //reject file
    cb(
      {
        message: "Unsupported file format"
      },
      false
    );
  }
};

var upload = multer({
  storage: storageProperties,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter,
  dest: ""
});

module.exports = upload;