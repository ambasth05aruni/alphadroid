import { useEffect, useRef, useState } from "react";
import "./ScrollAnimation.scss";

function ScrollAnimation() {
  const canvasRef = useRef(null);

  // for Keeping track of the canvas dimensions so that it adjusts with the screen size.
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    //For cycling through frames for the animation
    let frameIndex = 0;

// Total number of frames in the animation
    const frameCount = 27;


//CurrentFrame function helps us get the right image for a specific frame index
    const currentFrame = (index) => {
      try {
        if (index < 26) {
          return `/frames/Frame${index + 1}.png`;
        } else {
          return `/frames/Mask Group.png`;
        }
      } catch (error) {
        console.error('Error loading frame:', error);
        return null;
      }
    };

    // If the window resizes, handleResize function updates the canvas size.
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateImage(Math.floor(frameIndex));
      }
    };

//Preload all the frames so the animation is smooth when scrolling
    const preloadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
      }
    };

//For Picking up the right frame.
    const updateImage = (index) => {
      const img = new Image();
      img.src = currentFrame(index);
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };

// Handle scrolling to figure out which frame to display

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
// The maximum scrollable distance on the page.
      const maxScroll = document.body.scrollHeight - window.innerHeight;
// Get a fraction (0 to 1) of how much we've scrolled.
      const scrollFraction = Math.min(scrollTop / maxScroll, 1);
// Figure out which frame we should show based on the scroll fraction
      frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      
      requestAnimationFrame(() => updateImage(frameIndex));
    };
// Load all the frames before doing anything else.
    preloadImages();
   
    updateImage(0);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="scroll-animation-wrapper">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="scroll-animation__canvas"
        />
      </div>
      <div className="scroll-animation-spacer"></div>
    </>
  );
}

export default ScrollAnimation;