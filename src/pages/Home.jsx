import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import "./Home.css";
import SpinningTitle3D from "../components/SpinningTitle3D";
import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows } from "@react-three/drei";

function Home() {
  const aboutRef = useRef(null);
  const topRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="hero-canvas">
        <div
          id="studio"
          className=" flex items-center justify-center"
          style={{ backgroundColor: "#000000" }}
        >
          <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }}>
            <color attach="background" args={["#000000"]} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[-5, 5, 5]} intensity={3} castShadow />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <Center>
              <SpinningTitle3D size={2.2} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                <planeGeometry args={[15, 5]} />
                <meshStandardMaterial color="#000000" />
              </mesh>
            </Center>
            <ContactShadows
              position={[0, -1, 0]} // slightly below text
              opacity={0.1} // make it darker/lighter
              scale={10} // how far the shadow spreads
              blur={2.5} // soft edges
              far={1.5} // distance from “ground” to shadow
            />
          </Canvas>
        </div>
      </div>

      <div className="home-container" ref={topRef}>
        <nav className={`center-nav ${isScrolled ? "visible" : ""}`}>
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
          <Link to="/gallery">gallery</Link>
          <Link to="/warranty">warranty</Link>
        </nav>
        <p className="about" ref={aboutRef} id="about">
          make your controller
        </p>
        <>
          <div>
            <button
              id="toggle-tournament"
              className="toggle-btn"
              data-hidden="false"
            >
              Toggle Tournament Prices
            </button>
            <div className="action-bar">
              <button id="toggle-all" className="toggle-btn">
                View All Mods
              </button>
              <button id="toggle-oem" className="toggle-btn">
                PHOB
              </button>
              <button id="toggle-install" className="toggle-btn">
                Conversion
              </button>
              <button id="toggle-motherboard" className="toggle-btn">
                Motherboard
              </button>
              <a href="/checkout/checkout.html" className="cart-button">
                Cart
              </a>
            </div>
            <div className="main-container">
              {/* Controller Image Container */}
              <div id="controllerContainer">
                <img
                  src="../img/gcc.png"
                  id="controllerImage"
                  alt="Controller"
                ></img>
                {/* Phob Overlay */}
                <div id="phob-overlay">
                  <img
                    id="phob-image"
                    src="../img/phob.png"
                    alt="Phob Overlay"
                  ></img>
                </div>
                {/* Dedicated Shell Button */}
                <button id="shell-button">Shell</button>
              </div>

              {/* Popup Mod Menu (for non-shell parts) */}
              <div id="mod-menu" className="modal"></div>

              {/* Popup Shell Menu */}
              <div
                id="shell-menu"
                className="modal"
                style={{ width: "180px" }}
              ></div>

              {/* Selected Mods Summary (Cart) */}
              <div className="mod-summary">
                <h3>Your Mods</h3>
                <div id="mod-groups"></div>
              </div>

              {/* Cart Button */}
              <a href="/checkout/checkout.html" className="cart-button">
                Cart
              </a>
            </div>     
          </div>
        </>
        <footer id="footer">2025 MQMods</footer>
      </div>
    </>
  );
}

export default Home;
