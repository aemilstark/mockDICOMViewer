// dicomViewerComponent.ts
import { DicomViewerEngine } from "./viewerEngine";
import "./controlsComponent";
import type { DICOMDataset } from "@/types/DICOM";

export class DicomViewerApp extends HTMLElement {
  private engine!: DicomViewerEngine;
  private shadow!: ShadowRoot;
  private tagBlackList: string[] = ["windowCenter", "windowWidth", "rows", "cols"];

  // Drag state trackers
  private isDragging = false;
  private startX = 0;
  private startY = 0;

  connectedCallback(): void {
    // Encapsulate HTML and CSS in Shadow DOM
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
      <style>
        :host { display: flex; flex-direction: row; width: 100%; height: 100%; font-family: Arial, sans-serif;}
        .workspace { display: flex; flex: 1; flex-direction: column; background: #121212; }
        .sidebar { width: 250px; background: #181818; padding: 1rem; color: #fff; }
        .viewport-container { flex: 1; display: flex; align-items: center; justify-content: center; }
        #tag-list { list-style: none; padding: 0; }
        .tag-label { font-weight: bold; }
        .tag-value { margin-left: 0.5rem; }
      </style>
      <aside class="sidebar">
        <h2>JellyView</h2>
        <h3>DICOM Tags</h3>
        <ul id="tag-list">
        </ul>
      </aside>
      <div class="workspace">
        <viewer-controls></viewer-controls>
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

    // Bind interactive mouse drag handlers
    this.initPanHandler(canvas);
  }

  // Public API to load datasets from the parent host app
  public loadData(dicom: DICOMDataset) {
    this.engine.loadDataset(dicom);

    const tagListEl = this.shadow.querySelector("#tag-list");
    for (const [key, value] of Object.entries(dicom.metadata)) {
      console.log(`DICOM Metadata - ${key}: ${value}`);
      if (!this.tagBlackList.includes(key)) {
        const li = document.createElement("li");
        const label = document.createElement("span");
        label.className = "tag-label";
        label.textContent = `${key}: `;
        li.appendChild(label);

        const valueEl = document.createElement("span");
        valueEl.className = "tag-value";
        if (value instanceof Date) {
          valueEl.textContent = `${value.toISOString().split("T")[0]}`; // Format date as YYYY-MM-DD
        } else {
          valueEl.textContent = `${value}`;
        }
        li.appendChild(valueEl);

        tagListEl?.appendChild(li);
      }
    }
  }
  
  private initPanHandler(canvas: HTMLCanvasElement): void {
    canvas.addEventListener("mousedown", (e: MouseEvent) => {
      this.isDragging = true;
      // Capture relative starting offset against current pan coordinates
      this.startX = e.clientX - this.engine.state.panX;
      this.startY = e.clientY - this.engine.state.panY;
    });

    // Attach mousemove/mouseup to window so pan continues if cursor leaves canvas area
    window.addEventListener("mousemove", (e: MouseEvent) => {
      if (!this.isDragging) return;
      this.engine.state.panX = e.clientX - this.startX;
      this.engine.state.panY = e.clientY - this.startY;
      this.engine.render();
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });
  }
}



customElements.define("dicom-viewer", DicomViewerApp);