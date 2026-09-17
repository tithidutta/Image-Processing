const { resizeUploadedFile } = require("./resize");
const { addWatermarkLogo, addWatermarkText } = require("./watermark");
const path = require("path");

const defaultLogoPath = path.join(__dirname, "../images/logo.png");
const defaultOptions = {
  enableWatermark: false,
  watermarkPath: defaultLogoPath,
  watermarkOpacity: 0.5,
  resize: true,
  requiredMaxSize: 1 * 1024 * 1024,

  watermarkText: "",
  watermarkColor: "red",
};

const processImages = async (file, fileOptions = {}) => {
  const options = {
    ...defaultOptions,
    ...fileOptions,
  };

  const {
    enableWatermark,
    watermarkPath,
    watermarkOpacity,
    resize,
    requiredMaxSize,
    watermarkText,
    watermarkFontSize,
    watermarkColor,
  } = options;

  let finalFile = file;
  if (enableWatermark && watermarkText) {
    finalFile = await addWatermarkText(
      finalFile,
      watermarkText,
      watermarkFontSize,
      watermarkColor,
    );
  }
  if (enableWatermark && !watermarkText && watermarkPath) {
    finalFile = await addWatermarkLogo(file, watermarkPath, watermarkOpacity);
  }
  if (resize && requiredMaxSize) {
    finalFile = await resizeUploadedFile(finalFile, requiredMaxSize);
  }
  return finalFile;
};

module.exports = {
  processImages,
};
