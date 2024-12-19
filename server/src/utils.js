const fs = require("fs");
const path = require("path");

const fileToBase64 = (filePath) => {
  const file = fs.readFileSync(filePath);
  const mimeType = path.extname(filePath).slice(1);
  const prefix = `data:image/${mimeType};base64,`;
  return `${prefix}${file.toString("base64")}`;
};

module.exports = {
  fileToBase64,
};
