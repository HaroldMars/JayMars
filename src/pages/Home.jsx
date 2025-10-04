import React, { useRef } from "react";
import Logo from '../assets/logo.png/';
import Pet from '../assets/logodog.png/';

export default function Home() {
  // Create a ref for the target section
  const targetRef = useRef(null);

  const handleMoreBelowClick = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto rounded-lg text-center w-full max-w-4xl h-auto p-4 sm:p-8">
      {/* Melting Text Section */}
      <div className="melting-text-container h-280 p-4 sm:p-8 flex items-center justify-center relative">
        <h1 className="melting-text text-2xl sm:text-4xl font-bold">
          Welcome to my Website
        </h1>

        
        {/* Button to scroll down */}
        <div className="absolute justify-center mt-180 w-full flex">
          <button
            onClick={handleMoreBelowClick}
            className="pislit text-center text-black px-4 p-5 py-2 rounded text-2xl"
          >
            More
          </button>
        </div>
      </div>

        
      {/* Content below to scroll to */}
      <div ref={targetRef} className="h-250 absolute text-center">
        <div class="wave-container pt-5">
    <h1 class="wave-text">
        <span>A</span><span>B</span><span>O</span><span>U</span><span>T</span>
    </h1>
</div>

          <div className="responsive-container">
            
  <h1 className="pt-2">Hello There! <span className="text-gray-700">I'm Jay Harold Mars V. Abejar</span></h1>
  <h2 className="pt-5">Currently, 1st-year Student BSIT at UC Main.</h2>
  <p className="pt-2">I am a student with a vision of success, an entrepreneurial mindset, and the drive to achieve my goals. Starting from scratch, I am determined to reach them. I am currently working as a freelancer, and I am excited to see how far I will go in the next five years.</p>
</div>

        <div>
        <h1 className="text-2xl pt-10 pb-5 pl-5">Experience</h1>
        <div className="flex flex-row flex-wrap gap-5">
          <div className="glass">
            <a
              href="https://rcjcim.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className=" cursor-pointer flex flex-col items-center p-4 h-20 w-85 absolute"
            ></a>
            <img src={Logo} alt="Church Logo" className="w-20 h-20" />
            <h1 className="pl-2">Currently working as Deveploper of RCJCIM</h1>
          </div>
          <div className="glass ">
            <a
              href="https://pet-location-eight.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className=" cursor-pointer flex flex-col items-center p-4 h-20 w-85 absolute"
            ></a>
            <img src={Pet} alt="Church Logo" className="w-20 h-20" />
            <h1 className="pl-2">
              Pet-Location, Grade 12 Capstone, This Research, aim for the safety
              of our pet.
            </h1>
          </div>
        </div>

        <div className="pt-10">
          <h1 className="glas ml-10 mr-0">COMING...</h1>
        </div>
      </div>
        
      </div>
    </div>
  );
}