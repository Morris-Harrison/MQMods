import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import "./Home.css";
import SpinningTitle3D from "../components/SpinningTitle3D";
import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows } from "@react-three/drei";

//#region NAVBAR LOGIC & LEGACY VARIABLES
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

  const partDefinitions = {
    "grey-stick": {
      shape: "poly",
      coords:
        "159,198,205,193,245,199,272,207,294,220,310,234,322,249,332,265,337,284,337,309,331,331,324,343,311,357,296,370,271,384,253,392,224,398,202,400,177,399,154,394,137,389,120,383,107,374,94,363,84,353,74,337,65,320,60,298,64,276,71,261,83,243,97,229,111,219,125,209,137,203,149,200",
    },
    "face-buttons": {
      shape: "poly",
      coords:
        "709,282,710,313,714,348,728,377,753,390,784,402,823,413,859,419,915,421,959,412,993,397,1022,375,1036,354,1054,326,1059,303,1057,266,1040,231,1015,207,990,187,959,172,921,162,876,156,842,162,806,168,773,184,753,201,739,215,725,230,716,249,709,267",
    },
    "c-stick": {
      shape: "poly",
      coords: "660,432,631,483,657,530,727,555,791,531,819,482,791,432,724,412",
    },
    paracord: { shape: "rect", coords: "509,0,575,88" },
    "left-trigger": {
      shape: "poly",
      coords:
        "105,171,123,138,138,125,155,115,180,109,205,109,220,109,242,113,265,123",
    },
    "z-button": {
      shape: "poly",
      coords: "817,125,976,169,966,156,943,141,912,131,888,125,855,118,836,118",
    },
    "right-trigger": {
      shape: "poly",
      coords: "842,115,880,107,909,109,928,113,951,125,964,136,968,152,907,127",
    },
  };

  const partToCategory = {
    paracord: "Cable",
    "left-trigger": "Left Trigger",
    "right-trigger": "Right Trigger",
    "z-button": "z-button",
    "face-buttons": "Face Buttons",
    "grey-stick": "Grey Stick",
    "c-stick": "C Stick",
  };

  const modOptions = {
    Cable: [
      {
        id: "paracord_2m",
        name: "Paracord 2 Metres",
        standard: 55,
        tournament: 60,
        description: "Same as below but 2 metre old controller length.",
      },
      {
        id: "paracord_3m",
        name: "Paracord 3 Metres",
        standard: 65,
        tournament: 70,
        description:
          "Cord hand crimped and paracorded up. Length of new controller cable.",
      },
    ],
    Shell: [
      {
        id: "gccblack",
        name: "Black",
        filename: "/assets/img/gccblack.png",
        standard: 200,
        tournament: 250,
        description: "Black shell",
      },
      {
        id: "gccindigo",
        name: "Indigo",
        filename: "/assets/img/gcc.png",
        standard: 200,
        tournament: 250,
        description: "Indigo shell",
      },
    ],
  };

  const MODE_LABEL = {
    Conversion: "Install",
    Motherboard: "Board",
    OEM: "OEM",
  };

  const [tournamentMode, setTournamentMode] = useState(false);
  const [oemMode, setOemMode] = useState(false);
  const [installMode, setInstallMode] = useState(false);
  const [motherboardMode, setMotherboardMode] = useState(false);
  const [selectedMods, setSelectedMods] = useState({});
  const [selectedShell, setSelectedShell] = useState(modOptions.Shell[1]); // Indigo default
  const [activeMenu, setActiveMenu] = useState(null); // part or "shell"
  const [allHighlighted, setAllHighlighted] = useState(false);

  // Handlers
  const toggleTournament = () => {
    const newValue = !tournamentMode;
    setTournamentMode(newValue);
    localStorage.setItem("tournamentMode", newValue);
  };

  const toggleOEM = () => {
    setOemMode((prev) => !prev);
  };

  const toggleInstall = () => {
    setInstallMode((prev) => !prev);
    if (motherboardMode) setMotherboardMode(false);
  };

  const toggleMotherboard = () => {
    setMotherboardMode((prev) => !prev);
    if (installMode) setInstallMode(false);
  };

  const toggleMod = (category, mod) => {
    setSelectedMods((prev) => {
      const current = prev[category] || [];
      const exists = current.find((m) => m.id === mod.id);
      let updated;
      if (exists) {
        updated = current.filter((m) => m.id !== mod.id);
      } else {
        updated = [...current, mod];
      }
      return { ...prev, [category]: updated };
    });
  };

  const selectShell = (shell) => {
    setSelectedShell(shell);
    setSelectedMods((prev) => {
      const copy = { ...prev };
      ["Shell", "Conversion", "Motherboard", "OEM"].forEach(
        (k) => delete copy[k]
      );
      copy["Shell"] = [shell];
      return copy;
    });
  };

  // Persist to localStorage whenever selectedMods or tournamentMode changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(selectedMods));
    localStorage.setItem("tournamentMode", tournamentMode);
  }, [selectedMods, tournamentMode]);

  // Toggle all highlights
  const toggleAllHighlights = () => {
    setAllHighlighted((prev) => !prev);
  };

  //#endregion

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
            /*#region LEGACY STRUCTURE */
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
            //#endregion
          </div>
        </>
        <footer id="footer">2025 MQMods</footer>
      </div>
    </>
  );
}

//#endregion
export default Home;
