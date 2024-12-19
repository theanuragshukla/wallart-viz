const path = require("path");
const { Worker } = require("bullmq");
const { redisSingleton } = require("../connection");
const imgGenQueue = require("../imgGenQueue");
const imgVisionDescribe = require("../../chatgpt_describe");
const { fileToBase64 } = require("../../utils");
const uploadedImage = require("../../database/modals/Image.model");

const connection = redisSingleton.getInstance();

const visionWorker = new Worker(
  "img_vision",
  async (job) => {
    try {
      console.log(">>> Processing image with vision API", job.data);
      const { prompt, img_path, id } = job.data;
      const img_data_url = fileToBase64(
        path.join(__dirname, "../../uploads/", img_path)
      );
      let visionResp = await imgVisionDescribe(img_data_url, prompt);
      if (!visionResp) {
        throw new Error(">>> Error processing image with vision API");
      }
      if (visionResp.startsWith("```json")) {
        visionResp = JSON.parse(
          visionResp.replace("```json", "").replace("```", "")
        );
      } else {
        visionResp = JSON.parse(visionResp);
      }
      await uploadedImage.default.findByIdAndUpdate(id, {
        vision_description: visionResp.description,
        arts: visionResp.art_sets.map(
          (art) =>
            new uploadedImage.Art({
              ...art,
              pos: art.pos || "",
            })
        ),
      });
      await imgGenQueue.add("img_gen", {
        arts: visionResp.art_sets || [],
        id,
      });
    } catch (err) {
      console.error(">>> Error processing image with vision API", err);
    }
  },
  { connection }
);

module.exports = visionWorker;
