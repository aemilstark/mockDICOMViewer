import { DicomViewerEngine } from "./viewerEngine";

export class ViewerControls extends HTMLElement {
  private engine: DicomViewerEngine | null = null;

  connectedCallback(): void {
    this.innerHTML = `
      <div style="display: flex; gap: 15px; padding: 10px; background: #222; color: #fff;">
        <label>Rotation: 
          <input type="range" id="rot" min="0" max="360" value="0">
        </label>
        <label>Zoom: 
          <input type="range" id="zoom" min="0.5" max="3" step="0.1" value="1">
        </label>
        <label>Window Center: 
          <input type="range" id="wc" min="0" max="4000" value="2000">
        </label>
        <label>Window Width: 
          <input type="range" id="ww" min="100" max="4000" value="3000">
        </label>
        <span>Click/drag to pan</span>
      </div>
    `;

    this.bindEvents();
  }

  public attachEngine(engine: DicomViewerEngine): void {
    this.engine = engine;
  }

  private bindEvents(): void {
    this.querySelector("#rot")?.addEventListener("input", (e) => {
      if (!this.engine) return;
      this.engine.state.rotation = parseFloat((e.target as HTMLInputElement).value);
      this.engine.render();
    });

    this.querySelector("#zoom")?.addEventListener("input", (e) => {
      if (!this.engine) return;
      this.engine.state.scale = parseFloat((e.target as HTMLInputElement).value);
      this.engine.render();
    });

    this.querySelector("#wc")?.addEventListener("input", (e) => {
      if (!this.engine) return;
      this.engine.state.windowCenter = parseFloat((e.target as HTMLInputElement).value);
      this.engine.processPixels();
      this.engine.render();
    });

    this.querySelector("#ww")?.addEventListener("input", (e) => {
      if (!this.engine) return;
      this.engine.state.windowWidth = parseFloat((e.target as HTMLInputElement).value);
      this.engine.processPixels();
      this.engine.render();
    });
  }
}

customElements.define("viewer-controls", ViewerControls);