import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png"; // Removed trailing slash
import Pet from "../assets/logodog.png"; // Removed trailing slash
import ChatMessage from "../components/ChatMessage";
import ChatbotIcon from "../components/ChatbotIcon";
import ChatForm from "../components/ChatForm";
import { config } from "../utils/config";

export default function Home() {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const generateBotResponse = async (history) => {
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: {
        "x-goog-api-key": `${config.Gemini_ApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(config.Gemini_ApiUrl, requestOptions);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");

      data.candidates.forEach((candidate) => {
        setChatHistory((history) => [
          ...history.filter((msg) => msg.text !== "Thinking..."),
          {
            role: "model",
            text: candidate.content.parts.map((part) => part.text).join(""),
          },
        ]);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Generate particles on component mount
  useEffect(() => {
    const container = document.getElementById("particles-container");
    if (!container) return;

    const particlesCount = 50;
    const particles = [];

    for (let i = 0; i < particlesCount; i++) {
      const size = Math.random() * 8 + 2; // 2px to 10px
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.width = size + "px";
      particle.style.height = size + "px";

      // Random initial position
      particle.style.position = "absolute";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.left = Math.random() * 100 + "%";

      // Random animation delay
      particle.style.animationDelay = Math.random() * 20 + "s";

      // Animate with drift
      const driftX = (Math.random() - 0.5) * 100; // -50 to +50 px
      const animation = particle.animate(
        [
          { transform: `translateY(0) translateX(0)` },
          { transform: `translateY(-100vh) translateX(${driftX}px)` },
        ],
        {
          duration: 20000 + Math.random() * 10000, // 20-30 sec
          iterations: Infinity,
          easing: "linear",
        }
      );

      // Save reference for cleanup if needed
      particles.push({ element: particle, animation });
      container.appendChild(particle);
    }

    // Optional cleanup on unmount
    return () => {
      particles.forEach(({ element, animation }) => {
        animation.cancel();
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  return (
    <>
      <div className="mx-auto rounded-lg w-full max-w-4xl h-auto p-4 sm:p-8">
        <div className="background"></div>

        {/* Navigation */}
        {/* <div>
        <nav className="mynav">
          <div className="navigation">
            <img className="profile" src="https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-6/527724206_1978165126305131_7263521750765554623_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFeKqtcWGp1rZpFLxK_H9KcTsBK9TbdY2JOwEr1Nt1jYlwHF8o0b3ozjsC3Pek219aEIYTySB529jo-gBwWkrW9&_nc_ohc=GbbBye5kUwsQ7kNvwHISCHe&_nc_oc=Adn-WKjLcungT8dKobjl_pzO3TXlowTw-NuSuOaq4oiicC6vUlTxBCtHCy9EunIBMjw&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&_nc_gid=HzpWvqJlWp9ttOdC071OjQ&oh=00_AflqloP4NJVYeUHpXKHN1JCR3JSjBRmoRyq7Wsr8V7ZITg&oe=693943CA" alt="" />
          </div>
          <h1 className="profile_name">Jay Harold Mars V. Abejar</h1>
          <div className="menu flex gap-6 font-bold">
          <div className="cursor-pointer">Home</div>
          <a href="#about"><div className="cursor-pointer">About</div></a>
          <a href="#projects"><div className="cursor-pointer">Projects</div></a>
          <a href="#contact"><div className="cursor-pointer">Contact</div></a>
          </div>
        </nav>
      </div> */}
        <div>
          <nav className="mynav">
            <div className="nav-container">
              <div className="profile-section">
                <div>
                  <img
                    className="profile"
                    src="https://scontent.fmnl25-1.fna.fbcdn.net/v/t39.30808-6/527724206_1978165126305131_7263521750765554623_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFeKqtcWGp1rZpFLxK_H9KcTsBK9TbdY2JOwEr1Nt1jYlwHF8o0b3ozjsC3Pek219aEIYTySB529jo-gBwWkrW9&_nc_ohc=X8Oi7Kl9jt4Q7kNvwHaU82w&_nc_oc=AdlzVI3ApCtMVXxw7A8ZiR8MscWJEnxkuWCgWt0nD22QfTTPyRPb2wVHuvwibt1Oyfg&_nc_zt=23&_nc_ht=scontent.fmnl25-1.fna&_nc_gid=fGt3xFs_uaKhFyxQcGj8Wg&oh=00_AfpEBFN4Cbp8uAnexvzIA9Z8GqJoqSOBzIUQctKdqI3Jhw&oe=6966BF8A"
                    alt=""
                  />
                </div>
                <div className="hide-on-smallscreen">
                  <p className="profile_name">Jay Harold Mars V. Abejar</p>
                </div>
              </div>
              <div>
                <a href="#home ">Home</a>
              </div>
              <div>
                <a href="#about" className="cursor-pointer">
                  About
                </a>
              </div>
              <div>
                <a href="#projects" className="cursor-pointer">
                  Projects
                </a>
              </div>
              <div>
                <a href="#contact" className="cursor-pointer">
                  Contact
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Particles container */}
        <div id="particles-container"></div>

        {/* ChatBot Section */}
        <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
          <button
            onClick={() => setShowChatbot((prev) => !prev)}
            id="chatbot-toggler"
          >
            <span className="material-symbols-rounded">mode_comment</span>
            <span className="material-symbols-rounded">close</span>
          </button>
          <div className="chatbot-popup">
            <div className="chat-header">
              <div className="header-info">
                <ChatbotIcon />
                <h2 className="logo-text">JayHarold_Bot</h2>
              </div>
              <button className="material-symbols-rounded">
                keyboard_arrow_down
              </button>
            </div>

            {/* Chat Body */}
            <div className="chat-body">
              <div className="message bot-message">
                <ChatbotIcon />
                <p className="message-text">
                  hey there, How Can I help you today?
                </p>
              </div>

              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>

            {/* Chat Footer */}
            <div className="chat-footer">
              <ChatForm
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                generateBotResponse={generateBotResponse}
              />
            </div>
          </div>
        </div>
      </div>
      <div id="home" className="h-[100vh]">
        <h1 className="text-6xl md:text-8xl text-center font-bold pt-40 text-white">JAY HAROLD MARS ABEJAR</h1>
        <p className="text-center text-white">BSIT Student, 1st year college Developer </p>
      </div>
      <div id="about" className="bg-black/50 h-[100vh]">
        <h1 className="text-5xl text-center font-bold pt-20  text-white">ABOUT ME</h1>
        <div> 
          <p className="text-left max-w-xl mx-4 md:mx-10 mt-10 text-2xl md:text-3xl text-white">
  I am a student with a vision of success, an entrepreneurial mindset, and the drive to achieve my goals. Starting from scratch, I am determined to reach them. I am currently working as a freelancer, and I am excited to see how far I will go in the next five years.
</p></div>
       </div>
      <div id="projects" className="bg-white/10 h-[100vh]">
        <h1 className="text-6xl text-center p-10 text-white font-bold">PROJECTS</h1>
      </div>
      <div id="contact" className="bg-purple-500 h-[100vh]">
        CONTACT
      </div>
    </>
  );
}
