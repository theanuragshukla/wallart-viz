require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

require("./queues/workers/visionWorker");
require("./queues/workers/imageGenWorker");
const ConnectMongo = require("./database/connection");
const imgVisionQueue = require("./queues/ImgVisionQueue");
const { default: uploadedImages } = require("./database/modals/Image.model");
const { default: mongoose } = require("mongoose");

const PORT = process.env.PORT || 5000;
const UID = "admin";

const app = express();
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));
new ConnectMongo();

const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

app.post("/upload", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ status: false, message: "No files were uploaded." });
  }

  const fileData = req.files.map((file) => ({
    uid: path.basename(file.filename, path.extname(file.filename)),
    url: `${file.filename}`,
  }));

  res.json({
    status: true,
    message: "Files uploaded successfully.",
    data: fileData,
  });
});

app.post("/process", async (req, res) => {
  const { images, masterPrompt, pos_strs } = req.body;
  const imgQueueData = await Promise.all(
    pos_strs.map(async (pos_str, index) => {
      const [img_name, ...xy_pos] = pos_str
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e !== "null");

      //NOTE: assuming the csv data is valid
      const count = xy_pos.length / 2;
      const imgObj = await uploadedImages.create({
        uid: UID,
        masterPrompt,
        img_path: images[index],
        pos_csv: pos_str,
        art_count: count,
      });
      return imgObj;
    })
  );
  await Promise.all(
    imgQueueData.map(async (imgObj) => {
      await imgVisionQueue.add("img_vision", {
        prompt: imgObj.masterPrompt,
        img_path: imgObj.img_path,
        id: imgObj._id,
      });
    })
  );
  return res.json({
    status: true,
    message: "Images are being processed.",
  });
});

app.post('/filter', async (req, res) => {
  try {
    const { id, page = 1, limit = 10 } = req.body;
    const filter = {
      uid: UID,
      ...(id ? { _id: mongoose.Types.ObjectId.createFromHexString(id)} : {}),
    }
    const results = await uploadedImages.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.json({
      status: true,
      data: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('>>> Error:', error);
    res.status(500).json({
      status: false,
      data: 'An error occurred while fetching data.',
      timestamp: new Date().toISOString(),
    });
  }
});

app.listen(PORT, () => {
  console.log(`>>> Server is running on http://localhost:${PORT}`);
});