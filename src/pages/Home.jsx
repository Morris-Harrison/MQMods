import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import "./Home.css";
import gccImg from "../assets/img/gcc.png";
import SpinningTitle3D from "../components/SpinningTitle3D";
import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows } from "@react-three/drei";

//#region NAVBAR LOGIC
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

  //#endregion

  return (
  <>
    <div className="hero-canvas">
      <Canvas shadows camera={{ position: [-7, 0, 6], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={5} castShadow />
        <Center>
          <SpinningTitle3D />
        </Center>
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.45}
          scale={1}
          blur={2.8}
          far={2.2}
        />
      </Canvas>
    </div>


    <div className="home-container" ref={topRef}>
     

      <header>mqmods</header>

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
          <img
            src={gccImg}
            alt="gcc"
            style={{ maxWidth: "320px", width: "100%" }}
          />
        </div>
      </>
      <footer>2025 mqmods.</footer>
    </div>
    </>
  );
}

export default Home;
