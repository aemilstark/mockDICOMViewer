import type { DICOMDataset } from "@/types/DICOM";

export function generateSimulatedDICOM(width = 512, height = 512): DICOMDataset {
  const pixelData = new Uint16Array(width * height);
  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      
      // Base background intensity (dark outside space)
      let val = 200;

      // Thoracic Cavity Outer Contour (Soft tissue boundary)
      const dx = (x - cx) / (width * 0.4);
      const dy = (y - cy) / (height * 0.45);
      if (dx * dx + dy * dy < 1.0) {
        val = 1800; // Base tissue density

        // Left & Right Lung Fields (Radiolucent - darker, lower density)
        const leftLung = Math.pow((x - (cx - 90)) / 70, 2) + Math.pow((y - (cy - 10)) / 140, 2);
        const rightLung = Math.pow((x - (cx + 90)) / 70, 2) + Math.pow((y - (cy - 10)) / 140, 2);

        if (leftLung < 1.0 || rightLung < 1.0) {
          val = 600; // Low density air pockets
        }

        // Mediastinum & Cardiac Silhouette (Radio-opaque - bright center)
        const heart = Math.pow((x - (cx - 20)) / 85, 2) + Math.pow((y - (cy + 30)) / 95, 2);
        if (heart < 1.0) {
          val = 2900; // High density muscle tissue
        }

        // Rib Structure Overlays (Simulated sinusoidal high-density bone bands)
        const ribPattern = Math.sin((y + Math.abs(x - cx) * 0.2) * 0.08);
        if (ribPattern > 0.65 && (leftLung < 1.1 || rightLung < 1.1)) {
          val += 800; // Bone overlay boost
        }

        // Spine Column (Vertical dense central line)
        if (Math.abs(x - cx) < 14) {
          val = 3300 + Math.sin(y * 0.1) * 300;
        }
      }

      // Clamp max 12-bit intensity value (0 - 4095)
      pixelData[idx] = Math.min(4095, Math.max(0, Math.floor(val)));
    }
  }

  return {
    metadata: {
      patientName: `${pickRandom(["DOE", "FOX", "REED", "SMITH"])}, ${pickRandom(["JOHN", "JANE", "ALICE", "BOB"])}`,
      patientID: `PAT${Math.floor(Math.random() * 1000000)}`,
      patientBirthDate: new Date(Math.random() * 400000000000 + 631152000000),
      studyID: `SIM${Math.floor(Math.random() * 1000000)}`,
      studyDate: new Date(),
      modality: `${pickRandom(["CT", "US", "XA", "CR", "MR", "OT"])}`,
      windowCenter: 2000,
      windowWidth: 3000,
      rows: height,
      cols: width,
        photometricInterpretation: "MONOCHROME2",
    },
    pixelData,
  };
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
