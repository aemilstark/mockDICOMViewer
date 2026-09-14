export interface DICOMMetadata {
    // Patient Attribute Group (0010)
  patientName: string; // (0010,0010)
  patientID: string; // (0010,0020)
  patientBirthDate: Date; // (0010,0030)

  // Study & Series Attribute Groups (0020, 0008)
  studyID: string; // (0020,0010)
  studyDate: Date; // (0008,0020)
  modality: string; // (0008,0060) 

  // Image & Display Attribute Group (0028)
  rows: number; // (0028,0010)
  cols: number; // (0028,0011)
  windowCenter: number; // (0028,1050)
  windowWidth: number; // (0028,1051)
  photometricInterpretation: "MONOCHROME1" | "MONOCHROME2"; // (0028,0004)
}

export interface DICOMDataset {
  metadata: DICOMMetadata;
  pixelData: Uint16Array; // (7FE0,0010)
}