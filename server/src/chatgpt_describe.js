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
        content: `You are an interior designer working with a client to choose art for their home.
For the wall photo attached:  
**Vision:**  
- Develop a detailed vision about what kind of art would fit on this wall.  
- Take into consideration the room's colors.  
- Take into consideration style, organization, furniture, anything you can learn about the space or the people living there.  

**Based on the vision, give me:**  
- A short, one-sentence user-facing summary about what kind of art would fit on this wall. Use simple, conversational language, like you would talk to a friend. Assume I know nothing about art.  
- **Art Sets:**  
  - Define three specific art-sets of three art pieces each that fit your vision.  
  - Depending on the wall space and frame size, sometimes we will want to use only one or two pieces out of the set of three. Therefore:  
    - The first two should also work together as a standalone set.  
    - The 1st piece should be the main or best piece of the set that can be hanged alone on the wall.  
  - Give each set a short one-word title.  
  - For each art piece, write a full, descriptive prompt that I can feed to Ideogram to create the piece you envision.

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
