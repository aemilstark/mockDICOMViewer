(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function s(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(t){if(t.ep)return;t.ep=!0;const i=s(t);fetch(t.href,i)}})();var h=class{canvas;ctx;offscreenCanvas;offscreenCtx;rawPixels=null;imageWidth=0;imageHeight=0;state={rotation:0,scale:1,panX:0,panY:0,windowCenter:2e3,windowWidth:3e3};constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.offscreenCanvas=document.createElement("canvas"),this.offscreenCtx=this.offscreenCanvas.getContext("2d")}loadDataset(e){this.rawPixels=e.pixelData,this.imageWidth=e.metadata.cols,this.imageHeight=e.metadata.rows,this.state.windowCenter=e.metadata.windowCenter,this.state.windowWidth=e.metadata.windowWidth,this.offscreenCanvas.width=e.metadata.cols,this.offscreenCanvas.height=e.metadata.rows,this.processPixels(),this.render()}processPixels(){if(!this.rawPixels)return;const e=this.offscreenCtx.createImageData(this.imageWidth,this.imageHeight),n=e.data,s=this.state.windowCenter-this.state.windowWidth/2,o=this.state.windowCenter+this.state.windowWidth/2;for(let t=0;t<this.rawPixels.length;t++){const i=this.rawPixels[t];let a=0;i<=s?a=0:i>=o?a=255:a=Math.floor((i-s)/this.state.windowWidth*255);const r=t*4;n[r]=a,n[r+1]=a,n[r+2]=a,n[r+3]=255}this.offscreenCtx.putImageData(e,0,0)}render(){const{width:e,height:n}=this.canvas;this.ctx.clearRect(0,0,e,n),this.ctx.save(),this.ctx.translate(e/2+this.state.panX,n/2+this.state.panY),this.ctx.rotate(this.state.rotation*Math.PI/180),this.ctx.scale(this.state.scale,this.state.scale),this.ctx.drawImage(this.offscreenCanvas,-this.imageWidth/2,-this.imageHeight/2),this.ctx.restore()}},f=class extends HTMLElement{engine=null;connectedCallback(){this.innerHTML=`
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
      </div>
    `,this.bindEvents()}attachEngine(e){this.engine=e}bindEvents(){this.querySelector("#rot")?.addEventListener("input",e=>{this.engine&&(this.engine.state.rotation=parseFloat(e.target.value),this.engine.render())}),this.querySelector("#zoom")?.addEventListener("input",e=>{this.engine&&(this.engine.state.scale=parseFloat(e.target.value),this.engine.render())}),this.querySelector("#wc")?.addEventListener("input",e=>{this.engine&&(this.engine.state.windowCenter=parseFloat(e.target.value),this.engine.processPixels(),this.engine.render())}),this.querySelector("#ww")?.addEventListener("input",e=>{this.engine&&(this.engine.state.windowWidth=parseFloat(e.target.value),this.engine.processPixels(),this.engine.render())})}};customElements.define("viewer-controls",f);var u=class extends HTMLElement{engine;shadow;tagBlackList=["windowCenter","windowWidth","rows","cols"];connectedCallback(){this.shadow=this.attachShadow({mode:"open"}),this.shadow.innerHTML=`
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
    `;const e=this.shadow.querySelector("#viewport");this.engine=new h(e),this.shadow.querySelector("viewer-controls")?.attachEngine(this.engine)}loadData(e){this.engine.loadDataset(e);const n=this.shadow.querySelector("#tag-list");for(const[s,o]of Object.entries(e.metadata))if(console.log(`DICOM Metadata - ${s}: ${o}`),!this.tagBlackList.includes(s)){const t=document.createElement("li"),i=document.createElement("span");i.className="tag-label",i.textContent=`${s}: `,t.appendChild(i);const a=document.createElement("span");a.className="tag-value",a.textContent=`${o}`,t.appendChild(a),n?.appendChild(t)}}};customElements.define("dicom-viewer",u);function g(e=512,n=512){const s=new Uint16Array(e*n),o=e/2,t=n/2,i=Math.min(e,n)/3;for(let a=0;a<n;a++)for(let r=0;r<e;r++){const l=Math.hypot(r-o,a-t),d=l<i?Math.floor((1-l/i)*3500)+500:200;s[a*e+r]=d}return{metadata:{patientName:`${c(["DOE","FOX","REED","SMITH"])}, ${c(["JOHN","JANE","ALICE","BOB"])}`,modality:"CR",studyID:`SIM${Math.floor(Math.random()*1e6)}`,studyDate:new Date,windowCenter:2e3,windowWidth:3e3,rows:n,cols:e},pixelData:s}}function c(e){if(e.length!==0)return e[Math.floor(Math.random()*e.length)]}var m=g(512,512);document.getElementById("my-viewer").loadData(m);

//# sourceMappingURL=index-BD-NdxaE.js.map