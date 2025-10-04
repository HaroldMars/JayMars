import React from "react";
import Logo from "../assets/logo.png";
import Pet from "../assets/logodog.png";

export default function Home() {
  return (
    <div className="homie p-8  mx-auto bg-gray-50 rounded-lg shadow-lg">
      {/* Intro Section */}
      <div className="text-center mb-8">
        <h1 className="font-bold text-3xl md:text-4xl mb-4">
          Welcome of my New born Website
        </h1>
        <p className="pt-4 text-lg text-white">
          <span className="">
            Hello There! I'm{" "}
            <span className="underline underline-offset-4 decoration-blue-500">
              Jay Harold Mars V. Abejar
            </span>
          </span>
        </p>
      </div>
      <div className="ml-4 md:ml-6 px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 pl-2 md:pl-4 text-white">
          Still a Student
        </h2>
        <p className="text-gray-200 text-sm md:text-base mb-2">
          Currently, 1st-year Student BSIT at UC Main.
        </p>
        <p className="pt-2 pl-1 md:pt-4 md:pl-4 text-sm md:text-base">
          I am a student with a vision of success, an entrepreneurial mindset,
          and the drive to achieve my goals. Starting from scratch, I am
          determined to reach them. I am currently working as a freelancer, and
          I am excited to see how far I will go in the next five years.
        </p>
      </div>

      <div>
        <h1 className="text-2xl pt-10 pb-5">Experience</h1>
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
      </div>
    </div>
  );
}
