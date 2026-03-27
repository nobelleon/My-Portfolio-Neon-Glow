// ---------------------------------------------------------------- //
// -----------------------   INTRO LOADING  ----------------------- //  

document.addEventListener("DOMContentLoaded", (event) => {
  // Split text using SplitType
const loadingText = new SplitType(".loading-text.initial", { types: "chars" });
const completeText = new SplitType(".loading-text.complete", {
types: "chars"
});
const titleText = new SplitType(".content h1", { types: "chars" });
const paragraphText = new SplitType(".content p", { types: "chars" });

// Initial states
gsap.set(".loading-text.complete", { y: "100%" });
gsap.set(loadingText.chars, { opacity: 0, y: 100 });
gsap.set(completeText.chars, { opacity: 0, y: 100 });

// Animate in loading text
gsap.to(loadingText.chars, {
opacity: 1,
y: 0,
duration: 0.5,
stagger: 0.05,
ease: "power2.out"
});

const colorStages = [
{ bg: "rgb(60, 66, 55)", text: "rgb(230, 225, 215)" },
{ bg: "rgb(200, 180, 160)", text: "rgb(60, 66, 55)" },
{ bg: "rgb(226, 146, 247)", text: "rgb(200, 32, 241)" },
{ bg: "#021027", text: "#0e3b85" },
];

function updateColors(progress) {
const stage = Math.floor(progress / 25);
if (stage < colorStages.length) {
  document.querySelector(".preloader").style.backgroundColor =
    colorStages[stage].bg;
  document.querySelector(".progress-bar").style.backgroundColor =
    colorStages[stage].text;
  document
    .querySelectorAll(".loading-text .char, .percentage")
    .forEach((el) => {
      el.style.color = colorStages[stage].text;
    });
}
}

const tl = gsap.timeline();

tl.to(".progress-bar", {
width: "100%",
duration: 5,
ease: "power1.inOut",
onUpdate: function () {
  const progress = Math.round(this.progress() * 100);
  document.querySelector(".percentage").textContent = progress;
  updateColors(progress);
}
})
.to(".loading-text.initial", {
  y: "-100%",
  duration: 0.5,
  ease: "power2.inOut"
})
.to(
  ".loading-text.complete",
  {
    y: "0%",
    duration: 0.5,
    ease: "power2.inOut"
  },
  "<"
)
.to(
  completeText.chars,
  {
    opacity: 1,
    y: 0,
    duration: 0.3,
    stagger: 0.03,
    ease: "power2.out"
  },
  "<0.2"
)
.to(".preloader", {
  y: "-100vh",
  duration: 1,
  ease: "power2.inOut",
  delay: 0.8
})
.set(
  ".content",
  {
    visibility: "visible"
  },
  "-=1"
)
.to(
  [titleText.chars, paragraphText.chars],
  {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.02,
    ease: "power4.out"
  },
  "-=0.5"
)
.set(".preloader", {
  display: "none"
});
});

    
// -------------------------------------------------------- //
// -----------------------   AUDIO  ----------------------- //  

const bars = document.querySelectorAll(".audiobar");
const audioContainer = document.querySelector(".audio--container");
const audio = document.querySelector("audio");
let interval = null;                             // this

bars.forEach(bar =>{
      let size = Math.random();
      bar.style.transform = `scaleY(${size})`;
    });

audioContainer.addEventListener("click", ()=>{
      
  if(interval){
    clearInterval(interval);
    audio.pause();
    interval = null;
    
    bars.forEach(bar =>{
              bar.style.background = `white`;
            });   
    return 
  }else{
    audio.play();
    interval = setInterval(()=>{

    bars.forEach(bar =>{
              let size = Math.random();
              let hue = Math.floor(Math.random()*360);
              bar.style.transform = `scaleY(${size})`;
              bar.style.background = `hsl(${hue}, 90%, 60%)`;
            });

        }, 150);   
  } 
  // interval = !interval;               // this
});

audio.addEventListener("ended", ()=>{
  clearInterval(interval);
});



// --------------------------------- CIRCLE LOADING ------------------------------------------- //
//--------------------------------------------------------------------------------------------- //

// Initialize gallery with preloader
let gallery;

document.addEventListener("DOMContentLoaded", (event) => {
 // Register GSAP plugins
 gsap.registerPlugin(Draggable,Flip,InertiaPlugin,CustomEase)

 // gsap code here!
 const preloader = new PreloaderManager();

 // Wait for preloader to complete, then initialize gallery
 setTimeout(() => {
   preloader.complete(() => {
     // Initialize gallery after preloader fades out
     gallery = new FashionGallery();
     gallery.init();
   });
 }, 2000);
});

class PreloaderManager {
 constructor() {
   this.overlay = null;
   this.canvas = null;
   this.ctx = null;
   this.animationId = null;
   this.startTime = null;
   this.duration = 2000; // 2 seconds
   this.createLoadingScreen();
 }

 createLoadingScreen() {
   this.overlay = document.getElementById("preloader-overlay");
   this.overlay.style.cssText = `
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: white;
     display: flex;
     justify-content: center;
     align-items: center;
     z-index: 100000;
   `;

   this.canvas = document.createElement("canvas");
   this.canvas.width = 300;
   this.canvas.height = 300;

   this.ctx = this.canvas.getContext("2d");
   this.overlay.appendChild(this.canvas);

   this.startAnimation();
 }

 startAnimation() {
   const centerX = this.canvas.width / 2;
   const centerY = this.canvas.height / 2;
   let time = 0;
   let lastTime = 0;

   const dotRings = [
     { radius: 20, count: 8 },
     { radius: 35, count: 12 },
     { radius: 50, count: 16 },
     { radius: 65, count: 20 },
     { radius: 80, count: 24 }
   ];

   const colors = {
     primary: "#5ec0d1",
     accent: "#2367a6"
   };

   const hexToRgb = (hex) => {
     return [
       parseInt(hex.slice(1, 3), 16),
       parseInt(hex.slice(3, 5), 16),
       parseInt(hex.slice(5, 7), 16)
     ];
   };

   const animate = (timestamp) => {
     if (!this.startTime) this.startTime = timestamp;

     if (!lastTime) lastTime = timestamp;
     const deltaTime = timestamp - lastTime;
     lastTime = timestamp;
     time += deltaTime * 0.001;

     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

     // Draw center dot
     this.ctx.beginPath();
     this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
     const rgb = hexToRgb(colors.primary);
     this.ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.9)`;
     this.ctx.fill();

     // Draw Line Pulse Wave animation
     dotRings.forEach((ring, ringIndex) => {
       for (let i = 0; i < ring.count; i++) {
         const angle = (i / ring.count) * Math.PI * 2;
         const radiusPulse = Math.sin(time * 2 - ringIndex * 0.4) * 3;
         const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
         const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);

         const opacityWave =
           0.4 + Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) * 0.6;
         const isActive = Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) > 0.6;

         // Draw line from center to point
         this.ctx.beginPath();
         this.ctx.moveTo(centerX, centerY);
         this.ctx.lineTo(x, y);
         this.ctx.lineWidth = 0.8;

         if (isActive) {
           const accentRgb = hexToRgb(colors.accent);
           this.ctx.strokeStyle = `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${
             accentRgb[2]
           }, ${opacityWave * 0.7})`;
         } else {
           const primaryRgb = hexToRgb(colors.primary);
           this.ctx.strokeStyle = `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${
             primaryRgb[2]
           }, ${opacityWave * 0.5})`;
         }
         this.ctx.stroke();

         // Draw dot at the end of the line
         this.ctx.beginPath();
         this.ctx.arc(x, y, 2.5, 0, Math.PI * 2);
         if (isActive) {
           const accentRgb = hexToRgb(colors.accent);
           this.ctx.fillStyle = `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, ${opacityWave})`;
         } else {
           const primaryRgb = hexToRgb(colors.primary);
           this.ctx.fillStyle = `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, ${opacityWave})`;
         }
         this.ctx.fill();
       }
     });

     // Check if we should complete the loading
     if (timestamp - this.startTime >= this.duration) {
       this.complete();
       return;
     }

     this.animationId = requestAnimationFrame(animate);
   };

   this.animationId = requestAnimationFrame(animate);
 }

 complete(onComplete) {
   if (this.animationId) {
     cancelAnimationFrame(this.animationId);
   }

   if (this.overlay) {
     this.overlay.style.opacity = "0";
     this.overlay.style.transition = "opacity 0.8s ease";
     setTimeout(() => {
       this.overlay?.remove();
       if (onComplete) onComplete();
     }, 800);
   }
 }
}

class FashionGallery {
 constructor() {
   // DOM elements
   this.viewport = document.getElementById("viewport");
   this.canvasWrapper = document.getElementById("canvasWrapper");
   this.imageTitleOverlay = document.getElementById("imageTitleOverlay");  
   this.controlsContainer = document.getElementById("controlsContainer");
   
   // Create custom eases
   this.customEase = CustomEase.create("smooth", ".87,0,.13,1");
   this.centerEase = CustomEase.create("center", ".25,.46,.45,.94");
   // Configuration
   this.config = {
     itemSize: 320,
     baseGap: 16,
     rows: 8,
     cols: 12,
     currentGap: 32
   };
   // State
   this.lastValidPosition = {
     x: 0,
     y: 0
   };
   this.viewportObserver = null;
   
 }
 
 playIntroAnimation() {
   const vw = window.innerWidth;
   const vh = window.innerHeight;
   const canvasStyle = getComputedStyle(this.canvasWrapper);
   const canvasMatrix = new DOMMatrix(canvasStyle.transform);
   const canvasX = canvasMatrix.m41;
   const canvasY = canvasMatrix.m42;
   const canvasScale = canvasMatrix.a;
   const centerX =
     (screenCenterX - canvasX) / canvasScale - this.config.itemSize / 2;
   const centerY =
     (screenCenterY - canvasY) / canvasScale - this.config.itemSize / 2;

   // Animate from center to grid positions with fade in
   gsap.to(
     this.gridItems.map((item) => item.element),
     {
       duration: 0.2,
       left: (index) => this.gridItems[index].baseX,
       top: (index) => this.gridItems[index].baseY,
       scale: 1,
       opacity: 1, // Add fade in
       ease: "power2.out",
       stagger: {
         amount: 1.5,
         from: "start",
         grid: [this.config.rows, this.config.cols]
       },
       onComplete: () => {
         this.gridItems.forEach((itemData) => {
           gsap.set(itemData.element, {
             zIndex: 1
           });
         });
         // Show controls with staggered animation
         const percentageIndicator = this.controlsContainer.querySelector(
           ".percentage-indicator"
         );
         const switchElement = this.controlsContainer.querySelector(".switch");
         gsap.set(this.controlsContainer, {
           opacity: 0
         });
         gsap.set(percentageIndicator, {
           x: "-3em"
         });
         gsap.set(switchElement, {
           y: "2em"
         });
         const navTimeline = gsap.timeline();
         navTimeline.to(
           this.controlsContainer,
           {
             opacity: 1,
             duration: 0.5,
             ease: "power2.out"
           },
           0
         );
         navTimeline.to(
           percentageIndicator,
           {
             x: 0,
             duration: 0.2,
             ease: "power2.out"
           },
           0.25
         );
         navTimeline.to(
           switchElement,
           {
             y: 0,
             duration: 0.2,
             ease: "power2.out"
           },
           0.3
         );
         this.controlsContainer.classList.add("visible");
       }
     }
   );
 }
}
