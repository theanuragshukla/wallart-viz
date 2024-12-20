const path = require("path");
const { Worker } = require("bullmq");
const { redisSingleton } = require("../connection");
const imgGenQueue = require("../imgGenQueue");
const imgVisionDescribe = require("../../chatgpt_describe");
const { fileToBase64 } = require("../../utils");
const uploadedImage = require("../../database/modals/Image.model");

const connection = redisSingleton.getInstance();

const startVisionWorker = ({ io }) => {
  const visionWorker = new Worker(
    "img_vision",
    async (job) => {
        console.log(">>> Processing image with vision API", job.data);
        const {uid, prompt, img_path, id } = job.data;
      try {
        await uploadedImage.default.findByIdAndUpdate(id, {
          status: "analyzing",
        });
        io.to(uid).emit("img_status", {
          id,
          status: "analyzing",
        });
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
        io.to(uid).emit("img_status", {
          id,
          status: "analyzed",
        });
        await uploadedImage.default.findByIdAndUpdate(id, {
          description: visionResp.description,
          vision: visionResp.vision,
          status: "analyzed",
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
          uid
        });
      } catch (err) {
        console.error(">>> Error processing image with vision API", err);
        await uploadedImage.default.findByIdAndUpdate(id, {
          status: "failed",
        });
        io.to(uid).emit("img_status", {
          id,
          status: "failed",
        });
      }
    },
    { connection }
  );
  return visionWorker;
};

module.exports = startVisionWorker;
