const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer-Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "others";
    let resource_type = "auto";

    if (file.fieldname === "cvUrl") {
      folder = "cv";
      resource_type = "raw"; // for PDF, DOC, etc.
    } else if (file.fieldname === "profile") {
      folder = "profiles";
      resource_type = "image";
    }

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${file.fieldname}`,
    };
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    cvUrl: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    profile: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  };

  const valid = allowedTypes[file.fieldname]?.includes(file.mimetype);
  if (valid) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}`));
  }
};

// Multer upload middleware
const upload = multer({ storage, fileFilter });

module.exports = upload;
