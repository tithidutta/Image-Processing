const sharp = require("sharp");

const resizeUploadedFile = async (file, maxSize) => {
  try {
    const originalBufferFile = file.buffer;

    let currentBufferFile = originalBufferFile;
    let currentSize = originalBufferFile.length;

    if (maxSize && currentSize > maxSize) {
      const TARGET_SIZE = maxSize - 1000;
      const MAX_SIZE = maxSize - 200;
      let decreaseFactor = 3;
      currentBufferFile = await calculateBufferSize(
        originalBufferFile,
        decreaseFactor,
      );
      currentSize = currentBufferFile.length;

      if (currentSize < TARGET_SIZE || currentSize > MAX_SIZE) {
        decreaseFactor = calculateDecreaseFactor(
          currentSize,
          TARGET_SIZE,
          decreaseFactor,
        );
        currentBufferFile = await calculateBufferSize(
          originalBufferFile,
          decreaseFactor,
        );

        currentSize = currentBufferFile.length;
      }
    }

    const resizedFinalFile = {
      ...file,
      buffer: currentBufferFile,
      size: currentSize,
    };

    return resizedFinalFile;
  } catch (e) {
    console.log("Error", e);
    throw e;
  }
};

const calculateDecreaseFactor = (currentSize, targetSize, decreaseFactor) => {
  const newFactor = decreaseFactor * Math.sqrt(currentSize / targetSize);
  return newFactor;
};

const calculateBufferSize = async (buffer, decreaseFactor) => {
  const metaData = await sharp(buffer).metadata();

  const resizedBuffer = await sharp(buffer)
    .resize({
      width: Math.ceil(metaData.width / decreaseFactor),
      height: Math.ceil(metaData.height / decreaseFactor),
    })
    .toBuffer();

  // console.log(
  //   "resizedBuffer",
  //   resizedBuffer.length,
  //   (resizedBuffer.length / (1024 * 1024)).toFixed(2) + "mb",
  // );

  return resizedBuffer;
};

module.exports = {
  resizeUploadedFile,
};
