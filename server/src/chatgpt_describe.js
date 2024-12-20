const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function imgVisionDescribe(imgUrl, prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `
${prompt}.
Only Generate 3 art pieces, with unique titles, themes, and prompts, fitting the wall and the room's aesthetic.
Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation.
{
vision: "detailed vision",
  "description": "",
  "art_sets": [{
    "title": "one line summary of the art set",
    "theme": "the theme of the art set",
    "prompt": "descriptive prompt for the first art piece",
  },{
    "title": "one line summary of the art set",
    "theme": "the theme of the art set",
    "prompt": "descriptive prompt for the second art piece",
  },
{
    "title": "one line summary of the art set",
    "theme": "the theme of the art set",
    "prompt": "dscriptive prompt for the third art piece",
  },

]
}`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "The JSON respone is: " },
          {
            type: "image_url",
            image_url: {
              url: imgUrl,
            },
          },
        ],
      },
    ],
  });
  return response.choices[0].message.content;
}
module.exports = imgVisionDescribe;
