const sphere = document.getElementById('sphere');
const resolution = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sphere-resolution'));
const radius = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sphere-radius'));
for (let lat = 0; lat <= resolution; lat++) {
    const theta = (lat * Math.PI) / resolution;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    for (let lon = 0; lon <= resolution; lon++) {
        const phi = (lon * 2 * Math.PI) / resolution;
        const x = radius * Math.sin(phi) * sinTheta;
        const y = radius * cosTheta;
        const z = radius * Math.cos(phi) * sinTheta;
        const dot = document.createElement('div');
        dot.style.transform = ` translate3d(${x}px, ${y}px, ${z}px) rotateY(${(-phi * 180) / Math.PI}deg) rotateX(${(-theta * 180) / Math.PI}deg)`;
        dot.style.animation = ` pulse 6s infinite ease-out`;
        dot.style.animationDelay = `${theta*1.2}s`;
        sphere.appendChild(dot);
    }
}

document.body.addEventListener('click', ()=>{
    document.body.classList.toggle('inversion');
})


// ------------------------------------------------------------------- //
// -----------------------  TEXT BACKGROUND  ------------------------- //


document.addEventListener("DOMContentLoaded", function () {
    CustomEase.create("customEase", "0.86, 0, 0.07, 1");
    CustomEase.create("mouseEase", "0.25, 0.1, 0.25, 1"); 
    gsap.registerPlugin(ScrambleTextPlugin,SplitText,CustomEase)
  
    document.fonts.ready.then(() => {
      initializeAnimation();
    });
  
    function initializeAnimation() {
      const backgroundTextItems = document.querySelectorAll(".text-item");
  
      backgroundTextItems.forEach((item) => {
        item.dataset.originalText = item.textContent;
        item.dataset.text = item.textContent;
  
        // Make background text fully opaque by default
        gsap.set(item, { opacity: 1 });
      });
  
      const typeLines = document.querySelectorAll(".type-line");
      typeLines.forEach((line, index) => {
        if (index % 2 === 0) {
          line.classList.add("odd");
        } else {
          line.classList.add("even");
        }
      });
  
      const textRows = document.querySelectorAll(".text-row");
      const splitTexts = {};
  
      textRows.forEach((row, index) => {
        const textElement = row.querySelector(".text-content");
        const rowId = row.dataset.rowId;
  
        splitTexts[rowId] = new SplitText(textElement, {
          type: "chars",
          charsClass: "char",
          mask: true,
          reduceWhiteSpace: false,
          propIndex: true
        });
  
        textElement.style.visibility = "visible";
      });
  
      function updateCharacterWidths() {
        const isMobile = window.innerWidth < 1024;
  
        textRows.forEach((row, index) => {
          const rowId = row.dataset.rowId;
          const textElement = row.querySelector(".text-content");
          const computedStyle = window.getComputedStyle(textElement);
          const currentFontSize = computedStyle.fontSize;
          const chars = splitTexts[rowId].chars;
  
          chars.forEach((char, i) => {
            const charText =
              char.textContent ||
              (char.querySelector(".char-inner")
                ? char.querySelector(".char-inner").textContent
                : "");
            if (!charText && i === 0) return;
  
            let charWidth;
  
            if (isMobile) {
              const fontSizeValue = parseFloat(currentFontSize);
              const standardCharWidth = fontSizeValue * 0.6;
              charWidth = standardCharWidth;
  
              if (!char.querySelector(".char-inner") && charText) {
                char.textContent = "";
                const innerSpan = document.createElement("span");
                innerSpan.className = "char-inner";
                innerSpan.textContent = charText;
                char.appendChild(innerSpan);
                innerSpan.style.transform = "translate3d(0, 0, 0)";
              }
  
              char.style.width = `${charWidth}px`;
              char.style.maxWidth = `${charWidth}px`;
              char.dataset.charWidth = charWidth;
              char.dataset.hoverWidth = charWidth;
            } else {
              const tempSpan = document.createElement("span");
              tempSpan.style.position = "absolute";
              tempSpan.style.visibility = "hidden";
              tempSpan.style.fontSize = currentFontSize;
              tempSpan.style.fontFamily = "Longsile, sans-serif";
              tempSpan.textContent = charText;
              document.body.appendChild(tempSpan);
  
              const actualWidth = tempSpan.offsetWidth;
              document.body.removeChild(tempSpan);
  
              const fontSizeValue = parseFloat(currentFontSize);
              const fontSizeRatio = fontSizeValue / 160;
              const padding = 10 * fontSizeRatio;
  
              charWidth = Math.max(actualWidth + padding, 30 * fontSizeRatio);
  
              if (!char.querySelector(".char-inner") && charText) {
                char.textContent = "";
                const innerSpan = document.createElement("span");
                innerSpan.className = "char-inner";
                innerSpan.textContent = charText;
                char.appendChild(innerSpan);
                innerSpan.style.transform = "translate3d(0, 0, 0)";
              }
  
              char.style.width = `${charWidth}px`;
              char.style.maxWidth = `${charWidth}px`;
              char.dataset.charWidth = charWidth;
  
              const hoverWidth = Math.max(charWidth * 1.8, 85 * fontSizeRatio);
              char.dataset.hoverWidth = hoverWidth;
            }
  
            char.style.setProperty("--char-index", i);
          });
        });
      }
  
      updateCharacterWidths();
  
      window.addEventListener("resize", function () {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function () {
          updateCharacterWidths();
        }, 250);
      });
  
      textRows.forEach((row, rowIndex) => {
        const rowId = row.dataset.rowId;
        const chars = splitTexts[rowId].chars;
  
        gsap.set(chars, {
          opacity: 0,
          filter: "blur(15px)"
        });
  
        gsap.to(chars, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.09,
          ease: "customEase",
          delay: 0.15 * rowIndex
        });
      });
  
      function scrambleRandomText() {
        const randomIndex = Math.floor(
          Math.random() * backgroundTextItems.length
        );
        const randomItem = backgroundTextItems[randomIndex];
        const originalText = randomItem.dataset.text;
  
        gsap.to(randomItem, {
          duration: 1,
          scrambleText: {
            text: originalText,
            chars: "■▪▌▐▬",
            revealDelay: 0.5,
            speed: 0.3
          },
          ease: "none"
        });
  
        const delay = 0.5 + Math.random() * 2;
        setTimeout(scrambleRandomText, delay * 1000);
      }
  
      setTimeout(scrambleRandomText, 1000);
  
      const simplicity = document.querySelector(
        '.text-item[data-text="IS THE KEY"]'
      );
      if (simplicity) {
        const splitSimplicity = new SplitText(simplicity, {
          type: "chars",
          charsClass: "simplicity-char"
        });
  
        gsap.from(splitSimplicity.chars, {
          opacity: 0,
          scale: 0.5,
          duration: 1,
          stagger: 0.015,
          ease: "customEase",
          delay: 1
        });
      }
  
      backgroundTextItems.forEach((item, index) => {
        const delay = index * 0.1;
        gsap.to(item, {
          opacity: 0.85,
          duration: 2 + (index % 3),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: delay
        });
      });
  
    }
  });
  


// ------------------------------------------------------------------- //
// -----------------------  CUSTOM DOT CURSOR  ----------------------- //

var cursor = {
    delay: 8,
    _x: 0,
    _y: 0,
    endX: (window.innerWidth / 2),
    endY: (window.innerHeight / 2),
    cursorVisible: true,
    cursorEnlarged: false,
    $dot: document.querySelector('.cursor-dot'),
    $outline: document.querySelector('.cursor-dot-outline'),
    
    init: function() {
        // Set up element sizes
        this.dotSize = this.$dot.offsetWidth;
        this.outlineSize = this.$outline.offsetWidth;
        
        this.setupEventListeners();
        this.animateDotOutline();
    },
    
    setupEventListeners: function() {
        var self = this;
        
        // Anchor hovering
        document.querySelectorAll('a').forEach(function(el) {
            el.addEventListener('mouseover', function() {
                self.cursorEnlarged = true;
                self.toggleCursorSize();
            });
            el.addEventListener('mouseout', function() {
                self.cursorEnlarged = false;
                self.toggleCursorSize();
            });
        });
        
        // Click events
        document.addEventListener('mousedown', function() {
            self.cursorEnlarged = true;
            self.toggleCursorSize();
        });
        document.addEventListener('mouseup', function() {
            self.cursorEnlarged = false;
            self.toggleCursorSize();
        });
  
  
        document.addEventListener('mousemove', function(e) {
            // Show the cursor
            self.cursorVisible = true;
            self.toggleCursorVisibility();

            // Position the dot
            self.endX = e.pageX;
            self.endY = e.pageY;
            self.$dot.style.top = self.endY + 'px';
            self.$dot.style.left = self.endX + 'px';
        });
        
        // Hide/show cursor
        document.addEventListener('mouseenter', function(e) {
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        });
        
        document.addEventListener('mouseleave', function(e) {
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            self.$dot.style.opacity = 0;
            self.$outline.style.opacity = 0;
        });
    },
    
    animateDotOutline: function() {
        var self = this;
        
        self._x += (self.endX - self._x) / self.delay;
        self._y += (self.endY - self._y) / self.delay;
        self.$outline.style.top = self._y + 'px';
        self.$outline.style.left = self._x + 'px';
        
        requestAnimationFrame(this.animateDotOutline.bind(self));
    },
    
    toggleCursorSize: function() {
        var self = this;
        
        if (self.cursorEnlarged) {
            self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        } else {
            self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    },
    
    toggleCursorVisibility: function() {
        var self = this;
        
        if (self.cursorVisible) {
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        } else {
            self.$dot.style.opacity = 0;
            self.$outline.style.opacity = 0;
        }
    }
}

cursor.init();


// ------------------------------------------------------- //
// -----------------------  SOUND  ----------------------- //  


const sounds = ["sound"];

sounds.forEach((sound) => {
  const btn = document.createElement("button");
  btn.classList.add("btn");

  btn.innerText = sound;

  btn.addEventListener("click", () => {
    stopSounds();
    document.getElementById(sound).play();
  });

  document.getElementById("buttons").appendChild(btn);
});

function stopSounds() {
  sounds.forEach((sound) => {
    const s = document.getElementById(sound);
    s.pause();
    s.currentTime = 0;
  });
}
