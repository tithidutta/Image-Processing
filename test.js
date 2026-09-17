const fs = require("fs");
const { processImages } = require("./src");
const imagePath = "./images/photo.jpg";

async function test() {
  console.log("test file calling");
  const file = {
    buffer: fs.readFileSync(imagePath),
    mimetype: "image/jpg",
    size: fs.statSync(imagePath).size,
  };

  const processedImage = await processImages(file, {
    enableWatermark: true,
  });

  fs.writeFileSync("./images/processed_photo.jpeg", processedImage.buffer);
}

test();
