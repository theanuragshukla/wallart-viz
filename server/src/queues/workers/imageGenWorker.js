const { Worker } = require("bullmq");
const { redisSingleton } = require("../connection");
const generateImage = require("../../ideogram_gen");
const connection = redisSingleton.getInstance();
const uploadedImage = require("../../database/modals/Image.model");

const startImageGenWorker = ({ io }) => {
  const imageGenWorker = new Worker(
    "img_gen",
    async (job) => {
      console.log(">>> Generating image", job.data);
      const { arts, id, uid } = job.data;
      try {
        await uploadedImage.default.findByIdAndUpdate(id, {
          status: "generating",
        });
        io.to(uid).emit("img_status", { id, status: "generating" });
        const img_urls = await Promise.all(
          arts.map((art) => generateImage(art.prompt))
        );
        await uploadedImage.default.findByIdAndUpdate(id, {
          arts: arts.map(
            (art, index) =>
              new uploadedImage.Art({
                ...art,
                url: img_urls[index],
              })
          ),
        });
        console.log(">>> Image generated", img_urls);
        io.to(uid).emit("img_status", { id, status: "completed" });
        await uploadedImage.default.findByIdAndUpdate(id, {
          status: "completed",
        });
      } catch (err) {
        console.error(">>> Error generating image", err);
        await uploadedImage.default.findByIdAndUpdate(id, {
          status: "failed",
        });
        io.to(uid).emit("img_status", { id, status: "failed" });
      }
    },
    { connection }
  );
  return imageGenWorker;
};

module.exports = startImageGenWorker;
