const mongoose = require("mongoose");

class Art {
  pos = "";
  title = "";
  theme = "";
  prompt = "";
  url = "";
  constructor({title, theme, prompt, pos, url}) {
    this.title = title;
    this.theme = theme;
    this.prompt = prompt;
    this.pos = pos;
    this.url = url
  }
}

const ImagesSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  masterPrompt: {
    type: String,
    required: true,
  },
  img_path: {
    type: String,
    required: true,
  },
  pos_csv: {
    type: String,
    required: true,
  },
  art_count: {
    type: Number,
    default: 1,
  },
  vision_description: {
    type: String,
    default: "",
  },
  arts: {
    type: [{
      pos: String,
      title: String,
      theme: String,
      prompt: String,
      url: String,
    }],
    default : []
  },
}, {
    timestamps: true,
  });

const uploadedImages = mongoose.model("uploadedImages", ImagesSchema);

module.exports = {
  default : uploadedImages,
  Art
}

