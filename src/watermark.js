const sharp = require("sharp");

const addWatermarkText = async (
  file,
  watermarkText,
  watermarkFontSize,
  watermarkColor,
) => {
  const mainImage = sharp(file.buffer || file.path);
  const mainMetadata = await mainImage.metadata();

  const imageWidth = mainMetadata.width;
  const imageHeight = mainMetadata.height;

  // Watermark area relative to image size
  const watermarkTextWidth = Math.ceil(imageWidth / 4);
  const watermarkTextHeight = Math.ceil(imageHeight / 7);

  // If font size is provided, use it.
  // Otherwise calculate it based on image width.
  const calculatedFontSize = Math.ceil(imageWidth / 30);

  const fontSize = watermarkFontSize || calculatedFontSize;

  const svgText = `
    <svg
      width="${watermarkTextWidth}"
      height="${watermarkTextHeight}"
    >
      <style>
        .title {
          fill: ${watermarkColor};
          font-size: ${fontSize}px;
          font-family: Arial, sans-serif;
        }
      </style>

      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        class="title"
      >
        ${watermarkText}
      </text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svgText);

  const left = imageWidth - watermarkTextWidth - 20;
  const top = imageHeight - watermarkTextHeight - 30;

  const finalCompositeImage = await mainImage
    .composite([
      {
        input: svgBuffer,
        left,
        top,
      },
    ])
    .toBuffer();

  return {
    ...file,
    buffer: finalCompositeImage,
  };
};

const addWatermarkLogo = async (reqFile, watermarkPath, watermarkOpacity) => {
  try {
    const mainImage = sharp(reqFile.buffer || reqFile.path); // Get the background image

    const logoImage = sharp(watermarkPath); // Ensure the logo has an alpha channel for transparency
    const mainMetadata = await mainImage.metadata();

    const finalLogoWidth = Math.ceil(mainMetadata.width / 7);
    let finalLogoImage;

    finalLogoImage = await logoImage
      .resize({ width: finalLogoWidth })
      .ensureAlpha(watermarkOpacity || 0.2)
      .toBuffer();

    // Get resized logo dimensions
    const finalLogoMetadata = await sharp(finalLogoImage).metadata();

    const left = Number(mainMetadata.width - finalLogoMetadata.width - 20);
    const top = Number(mainMetadata.height - finalLogoMetadata.height - 50);

    const finalCompositeImage = await mainImage
      .composite([{ input: finalLogoImage, left: left, top: top }])
      .toBuffer();

    return { ...reqFile, buffer: finalCompositeImage };
  } catch (err) {
    console.error("Error in compositeImage:", err);
    throw err;
  }
};

module.exports = {
  addWatermarkText,
  addWatermarkLogo,
};
