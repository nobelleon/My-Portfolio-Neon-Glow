// ------------------------------------------------------------ //
// -----------------------  SPLIT TEXT  ----------------------- //

document.addEventListener("DOMContentLoaded", (event)=>{

    const st = SplitText.create(".splt");
  
    const tl = gsap
      .timeline()
      .from(st.chars, {
        duration: 1.2,
        opacity: 0,
        ease: "power1.inOut",
        stagger: { from: "center", each: 0.04 }
      })
      .from(
        st.words,
        {
          duration: 3,
          y: (i) => i * 100 - 50,
          ease: "expo"
        },
        0
      );
  
    window.onclick = () => tl.play(0); // click to replay
  });