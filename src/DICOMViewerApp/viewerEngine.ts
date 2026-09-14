export interface TransformState {
  rotation: number; // in degrees
  scale: number;
  panX: number;
  panY: number;
  windowCenter: number;
  windowWidth: number;
}

export class DicomViewerEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;

  private rawPixels: Uint16Array | null = null;
  private imageWidth = 0;
  private imageHeight = 0;

  public state: TransformState = {
    rotation: 0,
    scale: 1,
    panX: 0,
    panY: 0,
    windowCenter: 2000,
    windowWidth: 3000,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    
    // Offscreen buffer for rendered pixel mapping
    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCtx = this.offscreenCanvas.getContext("2d")!;
  }

  public loadDataset(pixels: Uint16Array, width: number, height: number, wc: number, ww: number): void {
    this.rawPixels = pixels;
    this.imageWidth = width;
    this.imageHeight = height;
    this.state.windowCenter = wc;
    this.state.windowWidth = ww;

    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;

    this.processPixels();
    this.render();
  }

  // Maps high-bit pixels to 8-bit visual levels based on Window Center/Width
  public processPixels(): void {
    if (!this.rawPixels) return;

    const imgData = this.offscreenCtx.createImageData(this.imageWidth, this.imageHeight);
    const data = imgData.data;

    const minVisible = this.state.windowCenter - this.state.windowWidth / 2;
    const maxVisible = this.state.windowCenter + this.state.windowWidth / 2;

    for (let i = 0; i < this.rawPixels.length; i++) {
      const val = this.rawPixels[i]!;
      let intensity = 0;

      if (val <= minVisible) {
        intensity = 0;
      } else if (val >= maxVisible) {
        intensity = 255;
      } else {
        intensity = Math.floor(((val - minVisible) / this.state.windowWidth) * 255);
      }

      const pixelIdx = i * 4;
      data[pixelIdx] = intensity;     // Red
      data[pixelIdx + 1] = intensity; // Green
      data[pixelIdx + 2] = intensity; // Blue
      data[pixelIdx + 3] = 255;       // Alpha
    }

    this.offscreenCtx.putImageData(imgData, 0, 0);
  }

  // Render transformed offscreen buffer using Matrix Transformations
  public render(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.save();

    // Move to viewport center for matrix transformation origin
    this.ctx.translate(width / 2 + this.state.panX, height / 2 + this.state.panY);
    this.ctx.rotate((this.state.rotation * Math.PI) / 180);
    this.ctx.scale(this.state.scale, this.state.scale);

    // Draw offscreen image centered at origin
    this.ctx.drawImage(
      this.offscreenCanvas,
      -this.imageWidth / 2,
      -this.imageHeight / 2
    );

    this.ctx.restore();
  }
}