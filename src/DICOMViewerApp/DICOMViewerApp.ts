// dicomViewerComponent.ts
import { DicomViewerEngine } from "./viewerEngine";
import "./controlsComponent";
import type { DICOMDataset } from "../types/DICOM";

export class DicomViewerApp extends HTMLElement {
  private engine!: DicomViewerEngine;

  connectedCallback(): void {
    // 1. Encapsulate HTML and CSS in Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: flex; flex-direction: column; width: 100%; height: 100%; }
        .workspace { display: flex; flex: 1; background: #121212; }
        .sidebar { width: 250px; background: #181818; padding: 1rem; color: #fff; }
        .viewport-container { flex: 1; display: flex; align-items: center; justify-content: center; }
      </style>

      <viewer-controls></viewer-controls>
      <div class="workspace">
        <aside class="sidebar">
          <h3>DICOM Tags</h3>
          <div id="patient-name"></div>
        </aside>
        <section class="viewport-container">
          <canvas id="viewport" width="512" height="512"></canvas>
        </section>
      </div>
    `;

    // 2. Initialize Engine using Shadow DOM selectors
    const canvas = shadow.querySelector("#viewport") as HTMLCanvasElement;
    this.engine = new DicomViewerEngine(canvas);

    const controls = shadow.querySelector("viewer-controls") as any;
    controls?.attachEngine(this.engine);
  }

  // Public API to load datasets from the parent host app
  public loadData(DICOM: DICOMDataset) {
    this.engine.loadDataset(DICOM);
  }
}

customElements.define("dicom-viewer", DicomViewerApp);