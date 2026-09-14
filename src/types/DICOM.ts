export interface DICOMMetadata {
  patientName: string; // (0010,0010)
  modality: string; // (0008,0060) 
  studyID: string; // (0020,0010)
  studyDate: Date; // (0008,0020)
  windowCenter: number; // (0028,1050)
  windowWidth: number; // (0028,1051)
  rows: number; // (0028,0010)
  cols: number; // (0028,0011)
}

export interface DICOMDataset {
  metadata: DICOMMetadata;
  pixelData: Uint16Array; // (7FE0,0010)
}