(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function o(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(t){if(t.ep)return;t.ep=!0;const i=o(t);fetch(t.href,i)}})();var p=class{canvas;ctx;offscreenCanvas;offscreenCtx;rawPixels=null;imageWidth=0;imageHeight=0;state={rotation:0,scale:1,panX:0,panY:0,windowCenter:2e3,windowWidth:3e3};constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.offscreenCanvas=document.createElement("canvas"),this.offscreenCtx=this.offscreenCanvas.getContext("2d")}loadDataset(e){this.rawPixels=e.pixelData,this.imageWidth=e.metadata.cols,this.imageHeight=e.metadata.rows,this.state.windowCenter=e.metadata.windowCenter,this.state.windowWidth=e.metadata.windowWidth,this.offscreenCanvas.width=e.metadata.cols,this.offscreenCanvas.height=e.metadata.rows,this.processPixels(),this.render()}processPixels(){if(!this.rawPixels)return;const e=this.offscreenCtx.createImageData(this.imageWidth,this.imageHeight),n=e.data,o=this.state.windowCenter-this.state.windowWidth/2,s=this.state.windowCenter+this.state.windowWidth/2;for(let t=0;t<this.rawPixels.length;t++){const i=this.rawPixels[t];let a=0;i<=o?a=0:i>=s?a=255:a=Math.floor((i-o)/this.state.windowWidth*255);const r=t*4;n[r]=a,n[r+1]=a,n[r+2]=a,n[r+3]=255}this.offscreenCtx.putImageData(e,0,0)}render(){const{width:e,height:n}=this.canvas;this.ctx.clearRect(0,0,e,n),this.ctx.save(),this.ctx.translate(e/2+this.state.panX,n/2+this.state.panY),this.ctx.rotate(this.state.rotation*Math.PI/180),this.ctx.scale(this.state.scale,this.state.scale),this.ctx.drawImage(this.offscreenCanvas,-this.imageWidth/2,-this.imageHeight/2),this.ctx.restore()}},w=class extends HTMLElement{engine=null;connectedCallback(){this.innerHTML=`
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
    `,this.bindEvents()}attachEngine(e){this.engine=e}bindEvents(){this.querySelector("#rot")?.addEventListener("input",e=>{this.engine&&(this.engine.state.rotation=parseFloat(e.target.value),this.engine.render())}),this.querySelector("#zoom")?.addEventListener("input",e=>{this.engine&&(this.engine.state.scale=parseFloat(e.target.value),this.engine.render())}),this.querySelector("#wc")?.addEventListener("input",e=>{this.engine&&(this.engine.state.windowCenter=parseFloat(e.target.value),this.engine.processPixels(),this.engine.render())}),this.querySelector("#ww")?.addEventListener("input",e=>{this.engine&&(this.engine.state.windowWidth=parseFloat(e.target.value),this.engine.processPixels(),this.engine.render())})}};customElements.define("viewer-controls",w);var u=class extends HTMLElement{engine;shadow;tagBlackList=["windowCenter","windowWidth","rows","cols"];isDragging=!1;startX=0;startY=0;connectedCallback(){this.shadow=this.attachShadow({mode:"open"}),this.shadow.innerHTML=`
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
    `;const e=this.shadow.querySelector("#viewport");this.engine=new p(e),this.shadow.querySelector("viewer-controls")?.attachEngine(this.engine),this.initPanHandler(e)}loadData(e){this.engine.loadDataset(e);const n=this.shadow.querySelector("#tag-list");for(const[o,s]of Object.entries(e.metadata))if(console.log(`DICOM Metadata - ${o}: ${s}`),!this.tagBlackList.includes(o)){const t=document.createElement("li"),i=document.createElement("span");i.className="tag-label",i.textContent=`${o}: `,t.appendChild(i);const a=document.createElement("span");a.className="tag-value",s instanceof Date?a.textContent=`${s.toISOString().split("T")[0]}`:a.textContent=`${s}`,t.appendChild(a),n?.appendChild(t)}}initPanHandler(e){e.addEventListener("mousedown",n=>{this.isDragging=!0,this.startX=n.clientX-this.engine.state.panX,this.startY=n.clientY-this.engine.state.panY}),window.addEventListener("mousemove",n=>{this.isDragging&&(this.engine.state.panX=n.clientX-this.startX,this.engine.state.panY=n.clientY-this.startY,this.engine.render())}),window.addEventListener("mouseup",()=>{this.isDragging=!1})}};customElements.define("dicom-viewer",u);function m(e=512,n=512){const o=new Uint16Array(e*n),s=e/2,t=n/2;for(let i=0;i<n;i++)for(let a=0;a<e;a++){const r=i*e+a;let l=200;const c=(a-s)/(e*.4),h=(i-t)/(n*.45);if(c*c+h*h<1){l=1800;const g=Math.pow((a-(s-90))/70,2)+Math.pow((i-(t-10))/140,2),f=Math.pow((a-(s+90))/70,2)+Math.pow((i-(t-10))/140,2);(g<1||f<1)&&(l=600),Math.pow((a-(s-20))/85,2)+Math.pow((i-(t+30))/95,2)<1&&(l=2900),Math.sin((i+Math.abs(a-s)*.2)*.08)>.65&&(g<1.1||f<1.1)&&(l+=800),Math.abs(a-s)<14&&(l=3300+Math.sin(i*.1)*300)}o[r]=Math.min(4095,Math.max(0,Math.floor(l)))}return{metadata:{patientName:`${d(["DOE","FOX","REED","SMITH"])}, ${d(["JOHN","JANE","ALICE","BOB"])}`,patientID:`PAT${Math.floor(Math.random()*1e6)}`,patientBirthDate:new Date(Math.random()*4e11+631152e6),studyID:`SIM${Math.floor(Math.random()*1e6)}`,studyDate:new Date,modality:`${d(["CT","US","XA","CR","MR","OT"])}`,windowCenter:2e3,windowWidth:3e3,rows:n,cols:e,photometricInterpretation:"MONOCHROME2"},pixelData:o}}function d(e){if(e.length!==0)return e[Math.floor(Math.random()*e.length)]}var v=m(512,512);document.getElementById("my-viewer").loadData(v);

//# sourceMappingURL=index-kRMc9SVL.js.map