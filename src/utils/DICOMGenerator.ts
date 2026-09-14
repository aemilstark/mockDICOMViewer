import type { DICOMDataset } from "@/types/DICOM";

export function generateSimulatedDICOM(width = 512, height = 512): DICOMDataset {
  const pixelData = new Uint16Array(width * height);
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 3;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const distance = Math.hypot(x - centerX, y - centerY);
      // Simulate high 12-bit dynamic range (0 to 4095 intensity values)
      const value = distance < maxRadius 
        ? Math.floor((1 - distance / maxRadius) * 3500) + 500 
        : 200;
      pixelData[y * width + x] = value;
    }
  }

  return {
    metadata: {
      patientName: "DOE JOHN",
      modality: "CR",
      windowCenter: 2000,
      windowWidth: 3000,
      rows: height,
      cols: width,
    },
    pixelData,
  };
}
