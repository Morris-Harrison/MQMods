import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import "./Home.css";
import gccImg from "../assets/img/gcc.png";

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

  const handleAboutClick = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", "/");
    setTimeout(() => {
      if (aboutRef.current) {
        const y =
          aboutRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
  };

  //#endregion

  return (
    <div className="home-container" ref={topRef}>
      <header>mqmods</header>
      
      <nav className={`center-nav ${isScrolled ? "visible" : ""}`}>
        <Link to="/">home</Link>
        <a href="#about" onClick={handleAboutClick}>
          about
        </a>
        <Link to="/gallery">legal</Link>
      </nav>
      <p className="about" ref={aboutRef} id="about">
        make your controller
      </p>
      <>
      <div>
        <img src={gccImg} alt="gcc" style={{maxWidth: '320px', width: '100%'}} />
      </div>
      </>
      <footer>
        2025 mqmods.
      </footer>
    </div>
  );
}

export default Home;
