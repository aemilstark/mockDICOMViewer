export interface DICOMMetadata {
  patientName: string;
  modality: string;
  studyID: string;
  studyDate: Date;
  windowCenter: number;
  windowWidth: number;
  rows: number;
  cols: number;
}

export interface DICOMDataset {
  metadata: DICOMMetadata;
  pixelData: Uint16Array;
}