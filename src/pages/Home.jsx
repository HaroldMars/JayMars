import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png"; // Removed trailing slash
import Pet from "../assets/logodog.png"; // Removed trailing slash
import bus from "../assets/bus.png";
import ChatMessage from "../components/ChatMessage";
import ChatbotIcon from "../components/ChatbotIcon";
import ChatForm from "../components/ChatForm";
import Jaybot from "../components/Jaybot";
import { config } from "../utils/config";

export default function Home() {
   const [chatHistory, setChatHistory] = useState([]);
   const [showChatbot, setShowChatbot] = useState(false);
  // const [isExpanded, setIsExpanded] = useState(false);

  // const handleToggle = () => {
  //   setIsExpanded((prev) => !prev);
  // };


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
        },
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

  // removed manual DOM expansion logic; using React state instead

  return (
    <>
      {/* Immersive futuristic background */}
      <div className="background"></div>
      <div className="floating-shapes">
        <div className="shape orb s1"></div>
        <div className="shape s2"></div>
        <div className="shape ring s3"></div>
        <div className="shape orb s4"></div>
        <div className="shape ring s5"></div>
      </div>
      <div className="bg-vignette"></div>

      <div className="mx-auto rounded-lg w-full max-w-4xl h-auto p-4 sm:p-8">

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
                    src="https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-1/527724206_1978165126305131_7263521750765554623_n.jpg?stp=cp6_dst-jpg_s320x320_tt6&_nc_cat=103&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFeKqtcWGp1rZpFLxK_H9KcTsBK9TbdY2JOwEr1Nt1jYlwHF8o0b3ozjsC3Pek219aEIYTySB529jo-gBwWkrW9&_nc_ohc=tJEJwJYarpAQ7kNvwHdtDWR&_nc_oc=AdqNAtuJyChkdMvqoJq-4poRR_PuQoUvRvK5E9ZU7YfVSlVORwVko-fWyE1MjMEqqsg&_nc_zt=24&_nc_ht=scontent.fceb2-1.fna&_nc_gid=iWSIcihnOxZkFjp6ONbb2g&_nc_ss=7a3a8&oh=00_Af0A6a5WDOeYioi1Sks63_cDay0TGOHw7ELmsqHIEq4kjw&oe=69DA824C"
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
                <h2 className="logo-text">Diosdado</h2>
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
      <div
        id="home"
        className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 pt-28 pb-16"
      >
        <Jaybot />
        <div className="hero-copy text-center">
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tight">
            JAY HAROLD MARS ABEJAR
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-cyan-200/90 font-medium tracking-wide">
            BSIT Student · 1st Year College · Developer
          </p>
        </div>
      </div>
      <div id="about" className="about-section">
        <div className="about-inner">
          <h1 className="text-5xl md:text-6xl text-center font-bold text-white">
            ABOUT ME
          </h1>

          <p className="about-lead">
            I am an <span className="hl">entrepreneur</span> and a developer
            driven by a big vision. I believe in{" "}
            <span className="hl">innovation</span> and the courage to always
            explore more. Starting from scratch, I am a kind but deeply
            ambitious person determined to turn ideas into impact and to see
            how far I can go in the next five years.
          </p>

          {/* Trait cards */}
          <div className="trait-grid">
            <div className="trait-card">
              <span className="trait-icon">💡</span>
              <h3>Entrepreneur</h3>
              <p>Building ventures from the ground up with an owner's mindset.</p>
            </div>
            <div className="trait-card">
              <span className="trait-icon">🚀</span>
              <h3>Big Vision</h3>
              <p>Thinking long-term and aiming far beyond the ordinary.</p>
            </div>
            <div className="trait-card">
              <span className="trait-icon">⚙️</span>
              <h3>Innovation</h3>
              <p>Turning fresh ideas into real, working software.</p>
            </div>
            <div className="trait-card">
              <span className="trait-icon">🌍</span>
              <h3>Explore More</h3>
              <p>Endlessly curious — always learning, always pushing forward.</p>
            </div>
            <div className="trait-card">
              <span className="trait-icon">🤝</span>
              <h3>Kind</h3>
              <p>Leading with empathy and respect for the people around me.</p>
            </div>
            <div className="trait-card">
              <span className="trait-icon">🔥</span>
              <h3>Ambitious</h3>
              <p>Relentlessly driven to reach every goal I set.</p>
            </div>
          </div>

          {/* Company highlight */}
          <div className="company-card">
            <div className="company-badge">CEO &amp; Founder</div>
            <h2 className="company-name">ILLUMINARY PEAK</h2>
            <p className="company-tagline">Software as a Service · Innovation</p>
            <p className="company-desc">
              I founded and lead Illuminary Peak, a Software-as-a-Service
              company built on innovation. As CEO, I drive the vision, the
              products, and the mission to deliver software that makes a
              difference.
            </p>
          </div>
        </div>
      </div>
      <div id="projects" className="bg-white/10 h-[130vh]">
        <h1 className="text-6xl text-center pt-20 p-10 text-white font-bold">
          PROJECTS
        </h1>

        <div class="projects-section">
  <div class="projects-container">
    <div class="project-card">
      <img src={Pet} class="project-image" />
      <h3 class="project-title">Pet-Location</h3>
      <p class="project-description">Locate your companion, safety</p>
    </div>
    <div class="project-card">
      <img src={Logo}class="project-image" />
      <h3 class="project-title mt-20">RCJCIM</h3>
      <p class="project-description"></p>
    </div>
    <div class="project-card">
      <img src={bus}  class="project-image" />
      <h3 class="project-title">Wander Philippines</h3>
      <p class="project-description">Wander Philippines is dedicated to providing efficient software as a service to commuters, ensuring their satisfaction and delight with every ride.</p>
    </div>
    {/* <div class="project-card">
      <img src="project4.png" class="project-image" />
      <h3 class="project-title">Project Four</h3>
      <p class="project-description">A brief description of Project Four.</p>
    </div> */}
  </div>
</div>
</div>
      
       <div id="contact">
        <div class="contact-info">
            <h1 className="text-center text-white p-10 text-5xl">CONTACT</h1>
            <h2>Gmail: abejar199@gmail.com</h2>
            <h2>FB: Jay HaroldMars V. Abejar</h2>
            <h2>My Number: +63 927 386 5959</h2>
        </div>
    </div>

    </>
  );
}
