import { Link, useNavigate } from "react-router-dom";
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
  allHighlighted,
  motherboardMode,
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
          (mod.id === "mouseclick_z" || mod.id === "mouseclick_abxy") &&
          !motherboardMode
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
              !allHighlighted &&
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
              cursor:
                isDisabled || allHighlighted
                  ? "default"
                  : "pointer",
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

// Mod Summary Component
function ModSummary({
  selectedMods,
  removeMod,
  getEffectivePrice,
  installMode,
  motherboardMode,
  oemPhobActive,
  oemMode,
}) {
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
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const topRef = useRef(null);
  const navRef = useRef(null);

  // Controller Builder State
  const [selectedMods, setSelectedMods] = useState({});

  const [controllerImage, setControllerImage] = useState("/img/gcc.png");
  const [shellColor, setShellColor] = useState("indigo");
  const [oemMode, setOemMode] = useState(() => {
    const saved = localStorage.getItem("oemMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [oemPhobActive, setOemPhobActive] = useState(() => {
    const saved = localStorage.getItem("oemPhobActive");
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
    localStorage.setItem("oemPhobActive", JSON.stringify(oemPhobActive));
  }, [oemPhobActive]);

  useEffect(() => {
    localStorage.setItem("installMode", JSON.stringify(installMode));
  }, [installMode]);

  useEffect(() => {
    localStorage.setItem("motherboardMode", JSON.stringify(motherboardMode));
  }, [motherboardMode]);

  // Update selectedMods when OEM/PHOB mode changes
  useEffect(() => {
    setSelectedMods((prev) => {
      const newMods = { ...prev };
      if (oemPhobActive) {
        // Get shell color name
        const shellData = [
          { id: "black", name: "Black", oemPrice: 150, phobPrice: 200 },
          { id: "indigo", name: "Indigo", oemPrice: 150, phobPrice: 200 },
          { id: "orange", name: "Orange", oemPrice: 150, phobPrice: 200 },
          { id: "white", name: "White", oemPrice: 150, phobPrice: 250 },
          { id: "emerald", name: "Emerald", oemPrice: 150, phobPrice: 250 },
        ];
        const selectedShell = shellData.find((s) => s.id === shellColor);
        const shellName = selectedShell ? selectedShell.name : "Indigo";
        const shellPrice = selectedShell
          ? oemMode
            ? selectedShell.oemPrice
            : selectedShell.phobPrice
          : oemMode
          ? 150
          : 200;

        newMods["OEM/PHOB"] = [
          {
            id: oemMode ? "oem_mode" : "phob_mode",
            name: `${oemMode ? "OEM" : "PHOB"} - ${shellName}`,
            standard: shellPrice,
            tournament: shellPrice,
            description: `${
              oemMode ? "OEM" : "PHOB"
            } controller with ${shellName} shell`,
          },
        ];
      } else {
        delete newMods["OEM/PHOB"];
      }
      return newMods;
    });
  }, [oemPhobActive, oemMode, shellColor]);

  // Update selectedMods when Phob Send in mode changes
  useEffect(() => {
    setSelectedMods((prev) => {
      const newMods = { ...prev };
      if (installMode) {
        newMods["Phob Send in"] = [
          {
            id: "phob_send_in",
            name: "Phob Send in",
            standard: 100,
            tournament: 100,
            description: "Phob send in service",
          },
        ];
      } else {
        delete newMods["Phob Send in"];
      }
      return newMods;
    });
  }, [installMode]);

  // Update selectedMods when OEM to Phob Send In mode changes
  useEffect(() => {
    setSelectedMods((prev) => {
      const newMods = { ...prev };
      if (motherboardMode) {
        newMods["OEM to Phob Send In"] = [
          {
            id: "phob_motherboard",
            name: "OEM to Phob Send In",
            standard: 150,
            tournament: 150,
            description: "Phob motherboard service",
          },
        ];
      } else {
        delete newMods["OEM to Phob Send In"];
      }
      return newMods;
    });
  }, [motherboardMode]);

  // Toggle OEM mode (PHOB)
  const handleToggleOem = () => {
    setOemMode(!oemMode);
    setOemPhobActive(true);
    setPhobOpacity(0);
    setTimeout(() => {
      setPhobOpacity(1);
    }, 100);
  };

  // Toggle Install mode
  const handleToggleInstall = () => {
    if (!installMode) {
      // Entering install mode - clear Shell entries
      setSelectedMods((prev) => {
        const newMods = { ...prev };
        delete newMods["Shell"];
        delete newMods["OEM"];
        return newMods;
      });
      setMotherboardMode(false);
    }
    setInstallMode(!installMode);
    if (!installMode && !motherboardMode) resetToIndigo();
  };

  // Toggle Motherboard mode
  const handleToggleMotherboard = () => {
    if (!motherboardMode) {
      // Entering motherboard mode - clear Shell entries
      setSelectedMods((prev) => {
        const newMods = { ...prev };
        delete newMods["Shell"];
        delete newMods["OEM"];
        return newMods;
      });
      setInstallMode(false);
    }
    setMotherboardMode(!motherboardMode);
    if (!installMode && !motherboardMode) resetToIndigo();
  };

  // Reset to Indigo shell
  const resetToIndigo = () => {
    setControllerImage("/img/gcc.png");
    setSelectedMods({});
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

      // Only add shell entry for OEM or default Shell
      if (shellName === "Shell" || shellName === "OEM") {
        newMods[shellName] = [
          {
            id: shellId,
            name: shellName === "Shell" ? opt.name : MODE_LABEL[shellName],
            standard: shellName === "OEM" ? 150 : opt.standard,
            tournament: shellName === "OEM" ? 200 : opt.tournament,
            description: opt.description,
          },
        ];
      }

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
    setOemPhobActive(false);
  };

  // Reset all mods
  const handleResetMods = () => {
    setSelectedMods({});
    setOemMode(false);
    setOemPhobActive(false);
    setAllHighlighted(false);
    setInstallMode(false);
    setMotherboardMode(false);
    setShellColor("indigo");
    setControllerImage("/img/gcc.png");
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
            <button
              onClick={handleToggleAll}
              className="toggle-btn"
              style={{
                background: "#000000",
                border: "2px solid #ffffff",
                color: "white",
                boxShadow: allHighlighted ? "0 0 25px #ffff00" : "none",
              }}
            >
              View All Mods
            </button>
            <button
              onClick={handleToggleOem}
              className="toggle-btn"
              disabled={allHighlighted || installMode || motherboardMode}
              style={{
                background: "#000000",
                border: "2px solid #ffffff",
                color: "white",
                boxShadow: oemPhobActive ? "0 0 25px #ffff00" : "none",
                opacity:
                  allHighlighted || installMode || motherboardMode ? 0.5 : 1,
                cursor:
                  allHighlighted || installMode || motherboardMode
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {oemMode ? "OEM" : "PHOB"}
            </button>
            <button
              onClick={handleToggleInstall}
              className="toggle-btn"
              disabled={oemPhobActive || allHighlighted || motherboardMode}
              style={{
                background: "#000000",
                border: "2px solid #ffffff",
                color: "white",
                boxShadow: installMode ? "0 0 25px #ffff00" : "none",
                opacity:
                  oemPhobActive || allHighlighted || motherboardMode ? 0.5 : 1,
                cursor:
                  oemPhobActive || allHighlighted || motherboardMode
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Phob Send in
            </button>
            <button
              onClick={handleToggleMotherboard}
              className="toggle-btn"
              disabled={oemPhobActive || allHighlighted || installMode}
              style={{
                background: "#000000",
                border: "2px solid #ffffff",
                color: "white",
                boxShadow: motherboardMode ? "0 0 25px #ffff00" : "none",
                opacity:
                  oemPhobActive || allHighlighted || installMode ? 0.5 : 1,
                cursor:
                  oemPhobActive || allHighlighted || installMode
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              OEM to Phob Send In
            </button>{" "}
            <button
              onClick={handleResetMods}
              className="toggle-btn"
              style={{
                background: "#000000",
                border: "2px solid #ffffff",
                color: "white",
                boxShadow: "none",
              }}
            >
              Reset All Mods
            </button>{" "}
            <button
              onClick={() => navigate("/checkout")}
              className="cart-button"
              style={{
                background: "#ffff00",
                border: "none",
                cursor: "pointer",
                padding: "12px 24px",
                color: "#000000",
                fontWeight: "bold",
                borderRadius: "4px",
              }}
            >
              Cart
            </button>
          </div>

          {/* Shell Color Selection */}
          {(oemMode || (!installMode && !motherboardMode)) && (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <h4 style={{ marginBottom: "12px", color: "#fff" }}>
                Shell Mods
              </h4>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { id: "black", name: "Black", oemPrice: 150, phobPrice: 200 },
                  {
                    id: "indigo",
                    name: "Indigo",
                    oemPrice: 150,
                    phobPrice: 200,
                  },
                  {
                    id: "orange",
                    name: "Orange",
                    oemPrice: 150,
                    phobPrice: 200,
                  },
                  { id: "white", name: "White", oemPrice: 150, phobPrice: 250 },
                  {
                    id: "emerald",
                    name: "Emerald",
                    oemPrice: 150,
                    phobPrice: 250,
                  },
                ].map((shell) => (
                  <button
                    key={shell.id}
                    onClick={() => {
                      setShellColor(shell.id);
                      setControllerImage(
                        `/img/gcc${shell.id === "indigo" ? "" : shell.id}.png`
                      );
                    }}
                    style={{
                      padding: "8px 16px",
                      background: "#000000",
                      color: "white",
                      border: "2px solid #ffffff",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "all 0.3s",
                      boxShadow:
                        shellColor === shell.id ? "0 0 25px #ffff00" : "none",
                    }}
                  >
                    {shell.name} (${oemMode ? shell.oemPrice : shell.phobPrice})
                  </button>
                ))}
              </div>
            </div>
          )}

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
                allHighlighted={allHighlighted}
                motherboardMode={motherboardMode}
                toggleMod={toggleMod}
              />
            ))}

            {/* Selected Mods Summary */}
            <ModSummary
              selectedMods={selectedMods}
              removeMod={removeMod}
              tournamentMode={tournamentMode}
              oemMode={oemMode}
              getEffectivePrice={getEffectivePrice}
              installMode={installMode}
              motherboardMode={motherboardMode}
              oemPhobActive={oemPhobActive}
            />

            <button
              onClick={() => navigate("/checkout")}
              className="cart-button"
              style={{
                background: "#ffff00",
                border: "none",
                cursor: "pointer",
                padding: "12px 24px",
                color: "#000000",
                fontWeight: "bold",
                borderRadius: "4px",
              }}
            >
              Cart
            </button>
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
