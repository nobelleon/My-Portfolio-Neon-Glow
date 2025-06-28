const bars = document.querySelectorAll(".audiobar");
const audioContainer = document.querySelector(".audio--container");
const audio = document.querySelector("audio");
let interval = null;

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
   
});

audio.addEventListener("ended", ()=>{
  clearInterval(interval);
});











