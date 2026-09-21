# Image Processor

Node.js image processing utility for resizing and watermarking images.

## Installation

```bash
npm install @smart-development/image-processing-package
```

## Usage

```javascript
const {
  processImages,
} = require("@smart-development/image-processing-package");

// Process an image with default options
const processedImage = await processImages(file);

// Process an image with custom options
const customProcessedImage = await processImages(file, {
  enableWatermark: true,
  watermarkText: "My Watermark",
  resize: false,
});
```

## API Reference

### `processImages(file, fileOptions)`

Process an image with specified options.

- `file`: The image file to process.
- `fileOptions`: Optional configuration object.

### Options

| Option              | Type    | Default         | Description                         |
| ------------------- | ------- | --------------- | ----------------------------------- |
| `enableWatermark`   | boolean | false           | Enable watermarking                 |
| `watermarkPath`     | string  | ""              | Path to watermark image             |
| `watermarkOpacity`  | number  | 0.5             | Opacity of watermark                |
| `resize`            | boolean | true            | Enable resizing                     |
| `requiredMaxSize`   | number  | 1 _ 1024 _ 1024 | Required maximum file size in bytes |
| `watermarkText`     | string  | ""              | Text to use as watermark            |
| `watermarkColor`    | string  | "red"           | Color of text watermark             |
| `watermarkFontSize` | number  | ""              | Font size of text watermark         |

Returns a promise that resolves to the processed image.
