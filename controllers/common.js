const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images/"),
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
cloudinary.config({
  cloud_name: "dw81gjw4x",
  api_key: "629925498322893",
  api_secret: "ScFwnPCMJOTQgqot2jnCOwhLsc4",
});

async function imageUpload(req, res) {
  try {
    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: path.parse(req.file.originalname).name,
    });

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      } else {
        console.log("Local file deleted successfully");
      }
    });

    res.json({ success: true, url: result?.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  imageUpload,
  upload,
};
