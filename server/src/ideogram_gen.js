const axios = require('axios');

const generateImage = async (prompt) => {
  const url = 'https://api.ideogram.ai/generate';
  const options = {
    method: 'POST',
    headers: {
      'Api-Key': process.env.IDEOGRAM_API_KEY,
      'Content-Type': 'application/json'
    },
    data: {
      image_request: {
        prompt:prompt,
        model: "V_2",
        magic_prompt_option: "AUTO"
      }
    }
  };

  try {
    const response = await axios(url, options);
    return response.data.data[0].url
  } catch (error) {
    console.error('>>>', error);
  }
};

module.exports = generateImage;
