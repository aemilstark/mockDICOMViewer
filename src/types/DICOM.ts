export interface DICOMMetadata {
  patientName: string;
  modality: string;
  windowCenter: number;
  windowWidth: number;
  rows: number;
  cols: number;
}

export interface DICOMDataset {
  metadata: DICOMMetadata;
  pixelData: Uint16Array;
}