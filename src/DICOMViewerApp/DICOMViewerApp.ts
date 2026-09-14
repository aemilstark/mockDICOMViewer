// dicomViewerComponent.ts
import { DicomViewerEngine } from "./viewerEngine";
import "./controlsComponent";
import type { DICOMDataset } from "@/types/DICOM";

export class DicomViewerApp extends HTMLElement {
  private engine!: DicomViewerEngine;
  private shadow!: ShadowRoot;

  connectedCallback(): void {
    // Encapsulate HTML and CSS in Shadow DOM
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
      <style>
        :host { display: flex; flex-direction: column; width: 100%; height: 100%; }
        .workspace { display: flex; flex: 1; background: #121212; }
        .sidebar { width: 250px; background: #181818; padding: 1rem; color: #fff; }
        .viewport-container { flex: 1; display: flex; align-items: center; justify-content: center; }
        .tag-list { list-style: none; padding: 0; }
        .tag-label { font-weight: bold; }
        .tag-value { margin-left: 0.5rem; }
      </style>

      <viewer-controls></viewer-controls>
      <div class="workspace">
        <aside class="sidebar">
          <h3>DICOM Tags</h3>
          <ul class="tag-list">
            <li>
              <span class="tag-label">Patient Name: </span>
              <span id="patient-name" class="tag-value">none</span>
            </li>
            <li>
              <span class="tag-label">Modality: </span>
              <span id="modality" class="tag-value">none</span>
            </li>
          </ul>
        </aside>
        <section class="viewport-container">
          <canvas id="viewport" width="512" height="512"></canvas>
        </section>
      </div>
    `;

    // Initialize Engine using Shadow DOM selectors
    const canvas = this.shadow.querySelector("#viewport") as HTMLCanvasElement;
    this.engine = new DicomViewerEngine(canvas);

    const controls = this.shadow.querySelector("viewer-controls") as any;
    controls?.attachEngine(this.engine);
  }

  // Public API to load datasets from the parent host app
  public loadData(dicom: DICOMDataset) {
    this.engine.loadDataset(dicom);

    const patientNameEl = this.shadow.querySelector("#patient-name");
    if (patientNameEl) {
      patientNameEl.textContent = dicom.metadata.patientName;
    }
    const modalityEl = this.shadow.querySelector("#modality");
    if (modalityEl) {
      modalityEl.textContent = dicom.metadata.modality;
    }
  }
}

customElements.define("dicom-viewer", DicomViewerApp);