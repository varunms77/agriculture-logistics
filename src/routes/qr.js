const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadFileToPinata } = require("../pinata");
const generateQR = require("../qr");

const upload = multer({ dest: path.join(__dirname, "../uploads/") });
const router = express.Router();

/**
 * POST /qr/upload-file
 * form-data: file
 */
router.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "file required" });

    const filePath = req.file.path;
    const { ipfsHash, url } = await uploadFileToPinata(filePath);

    // create QR for gateway url
    const qrDataUrl = await generateQR(url);

    // (Optional) remove local file
    // fs.unlinkSync(filePath);

    res.json({ ipfsHash, ipfsUrl: url, qrDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;