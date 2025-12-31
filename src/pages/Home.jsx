import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import "./Home.css";
import {
  partDefinitions,
  partToCategory,
  modOptions,
  shellOptions,
  MODE_LABEL,
  shellNameById,
} from "./controllerLogic";

//#region Mod Menu
function ModMenu({
  part,
  category,
  activeMenu,
  menuPosition,
  selectedMods,
  tournamentMode,
  oemMode,
  toggleMod,
}) {
  if (activeMenu !== part) return null;

  const categoryMods = modOptions[category] || [];
  const selectedCable = selectedMods["Cable"] || [];
  const selectedZ = selectedMods["z-button"] || [];
  const zSelected = selectedZ.find(
    (m) => m.id === "tactile_z" || m.id === "mouseclick_z"
  );

  return (
    <div
      className="modal active"
      style={{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }}
    >
      <h4>{category} Mods</h4>
      {categoryMods.map((mod) => {
        let basePrice = tournamentMode ? mod.tournament : mod.standard;
        if (category === "Grey Stick" && mod.id === "wavedash_notches") {
          const greySelected = selectedMods["Grey Stick"] || [];
          if (greySelected.find((m) => m.id === "firefox_notches")) {
            basePrice = 0;
          }
        }

        let isDisabled = false;
        if (
          category === "Cable" &&
          selectedCable.length > 0 &&
          !selectedCable.find((m) => m.id === mod.id)
        ) {
          isDisabled = true;
        }
        if (
          category === "z-button" &&
          zSelected &&
          zSelected.id !== mod.id &&
          mod.id !== "bald_z"
        ) {
          isDisabled = true;
        }
        if (
          oemMode &&
          (mod.id === "mouseclick_z" || mod.id === "mouseclick_abxy")
        ) {
          isDisabled = true;
        }
        if (category === "Grey Stick" && mod.id === "oem_notches" && !oemMode) {
          isDisabled = true;
        }

        return (
          <div
            key={mod.id}
            className="tooltip"
            onClick={() =>
              !isDisabled &&
              toggleMod(
                part,
                mod.id,
                mod.name,
                mod.standard,
                mod.tournament,
                mod.description
              )
            }
            style={{
              cursor: isDisabled ? "default" : "pointer",
              color: isDisabled ? "#aaa" : "inherit",
              pointerEvents: isDisabled ? "none" : "auto",
              margin: "4px 0",
            }}
          >
            <span>
              {mod.name} (${basePrice})
            </span>
            <span
              className="tooltiptext"
              dangerouslySetInnerHTML={{ __html: mod.description }}
            ></span>
          </div>
        );
      })}
    </div>
  );
}

// Shell Menu Component
function ShellMenu({
  activeMenu,
  menuPosition,
  selectShell,
  tournamentMode,
  installMode,
  motherboardMode,
  oemMode,
}) {
  if (activeMenu !== "shell") return null;

  let modeName = "Shell";
  let overrideStd = null;
  let overrideTour = null;

  if (installMode) {
    modeName = "Conversion";
    overrideStd = 100;
    overrideTour = 130;
  } else if (motherboardMode) {
    modeName = "Motherboard";
    overrideStd = 150;
    overrideTour = 200;
  } else if (oemMode) {
    modeName = "OEM";
    overrideStd = 150;
    overrideTour = 200;
  }

  return (
    <div
      className="modal active"
      style={{
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
        width: "180px",
      }}
    >
      <h4>{modeName} Mods</h4>
      {shellOptions.map((opt) => {
        let price =
          overrideStd !== null
            ? tournamentMode
              ? overrideTour
              : overrideStd
            : tournamentMode
            ? opt.tournament
            : opt.standard;
        return (
          <div
            key={opt.id}
            className="tooltip"
            onClick={() => selectShell(opt.id, opt.filename, modeName)}
            style={{ cursor: "pointer", margin: "4px 0" }}
          >
            <span>
              {opt.name} (${price})
            </span>
            <span className="tooltiptext">{opt.description}</span>
          </div>
        );
      })}
    </div>
  );
}

// Mod Summary Component
function ModSummary({ selectedMods, removeMod, getEffectivePrice }) {
  return (
    <div className="mod-summary">
      <h3>Your Mods</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          justifyContent: "flex-start",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(selectedMods).map(([category, mods]) => {
          if (mods.length === 0) return null;
          return (
            <div key={category} className="mod-group">
              <h4>{category}</h4>
              <ul
                style={{
                  display: "grid",
                  gridAutoFlow: "column",
                  gridTemplateRows: "repeat(2, auto)",
                  gap: "4px",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {mods.map((mod) => (
                  <li
                    key={mod.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 4px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flex: 1,
                      }}
                    >
                      <span>
                        {shellNameById[mod.id]
                          ? shellNameById[mod.id]
                          : mod.name}{" "}
                        (${getEffectivePrice(mod, category)})
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        className="remove-mod"
                        onClick={() => removeMod(category, mod.id)}
                        style={{
                          color: "#e74c3c",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        x
                      </span>
                      <span
                        className="tooltip"
                        style={{
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        i
                        <span
                          className="tooltiptext"
                          dangerouslySetInnerHTML={{ __html: mod.description }}
                        ></span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Home() {
  const aboutRef = useRef(null);
  const topRef = useRef(null);
  const navRef = useRef(null);

  // Controller Builder State
  const [selectedMods, setSelectedMods] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    }
    return {
      Shell: [
        {
          id: "gccindigo",
          name: "Indigo",
          standard: 200,
          tournament: 250,
          description: "Indigo Shell",
        },
      ],
    };
  });

  const [controllerImage, setControllerImage] = useState("/img/gcc.png");
  const [oemMode, setOemMode] = useState(() => {
    const saved = localStorage.getItem("oemMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [installMode, setInstallMode] = useState(() => {
    const saved = localStorage.getItem("installMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [motherboardMode, setMotherboardMode] = useState(() => {
    const saved = localStorage.getItem("motherboardMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [tournamentMode] = useState(() => {
    const saved = localStorage.getItem("tournamentMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [allHighlighted, setAllHighlighted] = useState(false);
  const [phobOpacity, setPhobOpacity] = useState(1);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Helper function to get effective price
  const getEffectivePrice = useCallback(
    (mod, category) => {
      let basePrice = tournamentMode ? mod.tournament : mod.standard;
      if (category === "Grey Stick" && mod.id === "wavedash_notches") {
        const greySelected = selectedMods["Grey Stick"] || [];
        if (greySelected.find((m) => m.id === "firefox_notches")) {
          basePrice = 0;
        }
      }
      if (category === "Shell" && oemMode) {
        basePrice -= 50;
      }
      return basePrice;
    },
    [tournamentMode, oemMode, selectedMods]
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    const cartToSave = {};
    for (const category in selectedMods) {
      cartToSave[category] = selectedMods[category].map((mod) => ({
        ...mod,
        effectivePrice: getEffectivePrice(mod, category),
      }));
    }
    localStorage.setItem("cart", JSON.stringify(cartToSave));
  }, [selectedMods, tournamentMode, oemMode, getEffectivePrice]);

  useEffect(() => {
    localStorage.setItem("tournamentMode", JSON.stringify(tournamentMode));
  }, [tournamentMode]);

  useEffect(() => {
    localStorage.setItem("oemMode", JSON.stringify(oemMode));
  }, [oemMode]);

  useEffect(() => {
    localStorage.setItem("installMode", JSON.stringify(installMode));
  }, [installMode]);

  useEffect(() => {
    localStorage.setItem("motherboardMode", JSON.stringify(motherboardMode));
  }, [motherboardMode]);

  // Toggle OEM mode (PHOB)
  const handleToggleOem = () => {
    setOemMode(!oemMode);
    setPhobOpacity(0);
    setTimeout(() => {
      setPhobOpacity(1);
    }, 100);
  };

  // Toggle Install mode
  const handleToggleInstall = () => {
    setInstallMode(!installMode);
    if (!installMode) setMotherboardMode(false);
    if (!installMode && !motherboardMode) resetToIndigo();
  };

  // Toggle Motherboard mode
  const handleToggleMotherboard = () => {
    setMotherboardMode(!motherboardMode);
    if (!motherboardMode) setInstallMode(false);
    if (!installMode && !motherboardMode) resetToIndigo();
  };

  // Reset to Indigo shell
  const resetToIndigo = () => {
    setControllerImage("/img/gcc.png");
    setSelectedMods({
      Shell: [
        {
          id: "gccindigo",
          name: "Indigo",
          standard: 200,
          tournament: 250,
          description: "Indigo Shell",
        },
      ],
    });
  };

  // Select shell
  const selectShell = (shellId, filename, shellName) => {
    setControllerImage(filename);
    const opt = shellOptions.find((s) => s.id === shellId);

    setSelectedMods((prev) => {
      const newMods = { ...prev };
      // Clear old shell entries
      ["Shell", "Conversion", "Motherboard", "OEM"].forEach(
        (k) => delete newMods[k]
      );

      // Add new shell entry
      newMods[shellName] = [
        {
          id: shellId,
          name: shellName === "Shell" ? opt.name : MODE_LABEL[shellName],
          standard:
            shellName === "Conversion"
              ? 100
              : shellName === "Motherboard"
              ? 150
              : shellName === "OEM"
              ? 150
              : opt.standard,
          tournament:
            shellName === "Conversion"
              ? 130
              : shellName === "Motherboard"
              ? 200
              : shellName === "OEM"
              ? 200
              : opt.tournament,
          description: opt.description,
        },
      ];

      return newMods;
    });
  };

  // Toggle mod selection
  const toggleMod = (
    part,
    modId,
    modName,
    standardPrice,
    tournamentPrice,
    description
  ) => {
    const category = partToCategory[part];
    setSelectedMods((prev) => {
      const newMods = { ...prev };
      if (!newMods[category]) newMods[category] = [];

      const index = newMods[category].findIndex((m) => m.id === modId);
      if (index > -1) {
        // Remove the mod - create new array without this mod
        newMods[category] = newMods[category].filter((m) => m.id !== modId);
      } else {
        // Add the mod - create new array with new mod
        newMods[category] = [
          ...newMods[category],
          {
            id: modId,
            name: modName,
            standard: standardPrice,
            tournament: tournamentPrice,
            description,
          },
        ];
      }

      return newMods;
    });
  };

  // Remove mod
  const removeMod = (category, modId) => {
    setSelectedMods((prev) => ({
      ...prev,
      [category]: prev[category].filter((m) => m.id !== modId),
    }));
  };

  // Toggle all highlights
  const handleToggleAll = () => {
    setAllHighlighted(!allHighlighted);
  };

  // Create overlays on image load
  const createOverlays = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return;

    const img = imgRef.current;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Remove old overlays
    const oldOverlays = containerRef.current.querySelectorAll(".part-overlay");
    oldOverlays.forEach((o) => o.remove());

    for (const part in partToCategory) {
      const def = partDefinitions[part];
      if (!def) continue;

      const shape = def.shape;
      const coords = def.coords.split(",").map(Number);
      let overlay = document.createElement("div");
      overlay.className = `part-overlay initial-pulse ${
        allHighlighted ? "always-highlight" : ""
      }`;
      overlay.setAttribute("data-part", part);

      if (shape === "poly") {
        let xs = [],
          ys = [];
        for (let i = 0; i < coords.length; i += 2) {
          xs.push(coords[i]);
          ys.push(coords[i + 1]);
        }
        const minX = Math.min(...xs),
          maxX = Math.max(...xs);
        const minY = Math.min(...ys),
          maxY = Math.max(...ys);
        overlay.style.left = (minX / naturalWidth) * 100 + "%";
        overlay.style.top = (minY / naturalHeight) * 100 + "%";
        overlay.style.width = ((maxX - minX) / naturalWidth) * 100 + "%";
        overlay.style.height = ((maxY - minY) / naturalHeight) * 100 + "%";

        let points = [];
        for (let i = 0; i < coords.length; i += 2) {
          let xPercent = ((coords[i] - minX) / (maxX - minX)) * 100;
          let yPercent = ((coords[i + 1] - minY) / (maxY - minY)) * 100;
          points.push(`${xPercent}% ${yPercent}%`);
        }
        overlay.style.clipPath = `polygon(${points.join(", ")})`;
      } else if (shape === "rect") {
        let x1 = coords[0],
          y1 = coords[1],
          x2 = coords[2],
          y2 = coords[3];
        overlay.style.left = (x1 / naturalWidth) * 100 + "%";
        overlay.style.top = (y1 / naturalHeight) * 100 + "%";
        overlay.style.width = ((x2 - x1) / naturalWidth) * 100 + "%";
        overlay.style.height = ((y2 - y1) / naturalHeight) * 100 + "%";
      }

      overlay.addEventListener("click", (e) => {
        e.stopPropagation();
        setActiveMenu(part);
        setMenuPosition({ x: e.pageX, y: e.pageY + 10 });
      });

      containerRef.current.appendChild(overlay);

      // Remove pulse after 5 seconds
      setTimeout(() => {
        overlay.classList.remove("initial-pulse");
      }, 5000);
    }
  }, [allHighlighted]);

  useEffect(() => {
    if (imgRef.current?.naturalWidth > 0) {
      createOverlays();
    }
  }, [createOverlays]);

  // Update overlay highlights when allHighlighted changes
  useEffect(() => {
    const overlays =
      containerRef.current?.querySelectorAll(".part-overlay") || [];
    overlays.forEach((overlay) => {
      if (allHighlighted) {
        overlay.classList.add("always-highlight");
      } else {
        overlay.classList.remove("always-highlight");
      }
    });
  }, [allHighlighted]);

  // Close menu on outside click
  useEffect(() => {
    const handleDocClick = () => {
      setActiveMenu(null);
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  //#endregion
  return (
    <>
      {/* Logo HUD */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: "20px",
          left: "100px",
          zIndex: 2000,
          textDecoration: "none",
        }}
      >
        <img
          src="/img/Logo.png"
          alt="Logo"
          style={{ height: "160px", width: "auto" }}
        />
      </Link>

      <nav
        style={{
          position: "static",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
          padding: "20px",
          backgroundColor: "transparent",
          zIndex: 100,
          fontSize: "1.2rem",
        }}
      >
        <Link to="/" style={{ color: "#ffffff", textDecoration: "none" }}>
          home
        </Link>
        <Link to="/about" style={{ color: "#ffffff", textDecoration: "none" }}>
          about
        </Link>
        <Link
          to="/gallery"
          style={{ color: "#ffffff", textDecoration: "none" }}
        >
          gallery
        </Link>
        <Link
          to="/warranty"
          style={{ color: "#ffffff", textDecoration: "none" }}
        >
          warranty
        </Link>
      </nav>

      <div className="hero-canvas">
        <img
          src="/img/mqmods.png"
          alt="mqmods"
          id="mqtext"
          style={{ height: "auto", width: "120%", marginLeft: "-75px" }}
        />
      </div>

      <div className="home-container" ref={topRef}>
        <p className="about" ref={aboutRef} id="about">
          make your controller
        </p>

        <div>
          <div className="action-bar">
            <button onClick={handleToggleAll} className="toggle-btn">
              View All Mods
            </button>
            <button
              onClick={handleToggleOem}
              className="toggle-btn"
              style={{ background: "#faa61a" }}
            >
              {oemMode ? "OEM" : "PHOB"}
            </button>
            <button
              onClick={handleToggleInstall}
              className="toggle-btn"
              style={{ background: "#7274cc" }}
            >
              Conversion
            </button>
            <button
              onClick={handleToggleMotherboard}
              className="toggle-btn"
              style={{ background: "#72cc86" }}
            >
              Motherboard
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === "shell" ? null : "shell");
                setMenuPosition({ x: e.pageX, y: e.pageY + 10 });
              }}
              className="toggle-btn"
              style={{ background: "#5A4FCF" }}
            >
              Shell
            </button>
            <a href="/checkout/checkout.html" className="cart-button">
              Cart
            </a>
          </div>

          <div className="main-container">
            {/* Controller Image Container with Dynamic Overlays */}
            <div
              ref={containerRef}
              style={{
                position: "relative",
                display: "inline-block",
                width: "100%",
                marginBottom: "16px",
                borderRadius: "4px",
                overflow: "visible",
              }}
            >
              <img
                ref={imgRef}
                src={controllerImage}
                alt="Controller"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "4px",
                }}
                onLoad={createOverlays}
              />

              {/* PHOB Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "65%",
                  width: "40%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  opacity: phobOpacity,
                  transition: "opacity 0.5s",
                }}
              >
                <img
                  src={oemMode ? "/img/phobfrown.png" : "/img/phob.png"}
                  alt="Phob Overlay"
                  style={{ width: "25%", height: "auto", display: "block" }}
                />
              </div>
            </div>

            {/* All Mod Menus */}
            {Object.entries(partToCategory).map(([part, category]) => (
              <ModMenu
                key={part}
                part={part}
                category={category}
                activeMenu={activeMenu}
                menuPosition={menuPosition}
                selectedMods={selectedMods}
                tournamentMode={tournamentMode}
                oemMode={oemMode}
                toggleMod={toggleMod}
              />
            ))}

            {/* Shell Menu */}
            <ShellMenu
              activeMenu={activeMenu}
              menuPosition={menuPosition}
              selectShell={selectShell}
              tournamentMode={tournamentMode}
              installMode={installMode}
              motherboardMode={motherboardMode}
              oemMode={oemMode}
            />

            {/* Selected Mods Summary */}
            <ModSummary
              selectedMods={selectedMods}
              removeMod={removeMod}
              tournamentMode={tournamentMode}
              oemMode={oemMode}
              getEffectivePrice={getEffectivePrice}
            />

            <a href="/checkout/checkout.html" className="cart-button">
              Cart
            </a>
          </div>
        </div>

        <footer
          style={{
            marginTop: "40px",
            textAlign: "center",
            fontSize: "40px",
            color: "#ffffffff",
            paddingBottom: "20px",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>2025 MQMods</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              marginTop: "16px",
              alignItems: "center",
            }}
          >
            <a
              href="https://discord.com/users/139913959087013888"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                transition: "opacity 0.3s",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
              title="Discord"
            >
              <img
                src="/img/discord.png"
                alt="Discord"
                style={{ height: "48px", width: "48px", display: "block" }}
              />
            </a>
            <a
              href="https://x.com/mqmods"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                transition: "opacity 0.3s",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
              title="Twitter"
            >
              <img
                src="/img/x.png"
                alt="Twitter"
                style={{ height: "48px", width: "48px", display: "block" }}
              />
            </a>
            <a
              href="mailto:mqphobgcc@gmail.com"
              style={{
                transition: "opacity 0.3s",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
              title="Email"
            >
              <img
                src="/img/mail.png"
                alt="Email"
                style={{ height: "48px", width: "48px", display: "block" }}
              />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
