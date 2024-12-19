const { Worker } = require("bullmq");
const { redisSingleton } = require("../connection");
const generateImage = require("../../ideogram_gen");
const connection = redisSingleton.getInstance();
const uploadedImage = require("../../database/modals/Image.model");

const imageGenWorker = new Worker(
  "img_gen",
  async (job) => {
    console.log(">>> Generating image", job.data);
    const { arts, id } = job.data;
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
    console.log(">>> Image generated", img_urls)
  },
  { connection }
);

module.exports = imageGenWorker;
