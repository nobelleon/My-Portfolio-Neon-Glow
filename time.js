/* Canvas Clock */ 

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "#00ffff";
ctx.lineWidth = 17;
ctx.shadowBlur = 15;
ctx.shadowColor = "#00ffff";

function degToRad(degree) {
  var factor = Math.PI / 180;
  return degree * factor;
}

function renderTime() {
  var now = new Date();
  var today = now.toDateString();
  var time = now.toLocaleTimeString();
  var hrs = now.getHours();
  var min = now.getMinutes();
  var sec = now.getSeconds();
  var mil = now.getMilliseconds();
  var smoothsec = sec + mil / 1000;
  var smoothmin = min + smoothsec / 60;

  //Background
  gradient = ctx.createRadialGradient(250, 250, 5, 250, 250, 300);
  gradient.addColorStop(0, "#021027");
  gradient.addColorStop(1, "#021027");
  ctx.fillStyle = gradient;
  //ctx.fillStyle = 'rgba(00 ,00 , 00, 1)';
  ctx.fillRect(0, 0, 500, 500);
  //Hours
  ctx.beginPath();
  ctx.arc(260, 330, 130, degToRad(270), degToRad(hrs * 30 - 90));
  ctx.stroke();
  //Minutes
  ctx.beginPath();
  ctx.arc(260, 330, 100, degToRad(270), degToRad(smoothmin * 6 - 90));
  ctx.stroke();
  //Seconds
  ctx.beginPath();
  ctx.arc(260, 330, 70, degToRad(270), degToRad(smoothsec * 6 - 90));
  ctx.stroke();
  //Date
  ctx.font = "13px Helvetica";
  ctx.fillStyle = "rgba(00, 255, 255, 1)";
  ctx.fillText(today, 210, 320);
  //Time
  ctx.font = "13px Helvetica Bold";
  ctx.fillStyle = "rgba(00, 255, 255, 1)";
  ctx.fillText(time + ":" + mil, 210, 350);
}
setInterval(renderTime, 40);


// ------------------------------------------------------------------- //
// -----------------------   Audio Visualizer  ----------------------- //

(() => {
  class Visualizer {
    constructor(canvasId, analyser, options = {}) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.analyser = analyser;
      this.options = options;
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }

    resize() {
      this.width = this.canvas.clientWidth;
      this.height = this.canvas.clientHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height); // Canvas vollst ndig l schen
    }


    animate() {
      this.clear(); // Canvas bei jedem Frame l schen
      this.draw();
      requestAnimationFrame(() => this.animate());
    }

    start() {
      this.animate();
    }
  }

  class OscilloscopeVisualizer extends Visualizer {
    constructor(canvasId, analyser) {
      super(canvasId, analyser);
      this.bufferLength = analyser.fftSize;
      this.dataArray = new Uint8Array(this.bufferLength);
    }

    draw() {
      this.analyser.getByteTimeDomainData(this.dataArray);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "rgba(255,255,255,.8)";
      this.ctx.beginPath();
      const sliceWidth = this.width / this.bufferLength;
      let x = 0;
      this.dataArray.forEach((value, i) => {
        const v = value / 128;
        const y = (v * this.height) / 2;
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
        x += sliceWidth;
      });
      this.ctx.lineTo(this.width, this.height / 2);
      this.ctx.stroke();
    }
  }

  class FrequencyVisualizer extends Visualizer {
    constructor(canvasId, analyser) {
      super(canvasId, analyser);
      this.bufferLength = analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
    }

    draw() {
      this.analyser.getByteFrequencyData(this.dataArray);
      const barWidth = (this.width / this.bufferLength) * 2.5;
      let x = 0;
      this.dataArray.forEach((value) => {
        const barHeight = (value / 255) * this.height;
        this.ctx.fillStyle = `rgba(255,255,255,.8)`;
        this.ctx.fillRect(x, this.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      });
    }
  }

  class CircularVisualizer extends Visualizer {
    constructor(canvasId, analyser) {
      super(canvasId, analyser);
      this.bufferLength = analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
    }

    draw() {
      this.analyser.getByteFrequencyData(this.dataArray);
      const radius = Math.min(this.width, this.height) / 4;
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      const bars = this.bufferLength;
      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const barLength = (this.dataArray[i] / 255) * radius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const xEnd = centerX + Math.cos(angle) * (radius + barLength);
        const yEnd = centerY + Math.sin(angle) * (radius + barLength);
        const gradient = this.ctx.createLinearGradient(x, y, xEnd, yEnd);
        gradient.addColorStop(0, "rgba(16,24,32,0.2)");
        gradient.addColorStop(1, `hsl(${(i / bars) * 360}, 100%, 50%)`);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(xEnd, yEnd);
        this.ctx.stroke();
      }
    }
  }

  const initializeVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);

      // Erstelle Analyser f r jede Visualisierung mit unterschiedlichen FFT-Gr  en
      const oscAnalyser = audioCtx.createAnalyser();
      oscAnalyser.fftSize = 2048;

      const freqAnalyser = audioCtx.createAnalyser();
      freqAnalyser.fftSize = 256;

      const circAnalyser = audioCtx.createAnalyser();
      circAnalyser.fftSize = 512;

      // Verbinde die Quelle mit allen Analysern
      source.connect(oscAnalyser);
      source.connect(freqAnalyser);
      source.connect(circAnalyser);

      // Initialisiere jede Visualisierung
      const oscVisualizer = new OscilloscopeVisualizer("oscilloscopeCanvas", oscAnalyser);
      const freqVisualizer = new FrequencyVisualizer("frequencyCanvas", freqAnalyser);
      const circVisualizer = new CircularVisualizer("circularCanvas", circAnalyser);

      // Starte die Animationen
      oscVisualizer.start();
      freqVisualizer.start();
      circVisualizer.start();
    } catch (err) {
      console.error("Fehler beim Zugriff auf das Mikrofon:", err);
    }
  };

  // Starte die Initialisierung, sobald das DOM geladen ist
  window.addEventListener("DOMContentLoaded", initializeVisualizer);
})();

