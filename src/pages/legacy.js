 document.addEventListener("DOMContentLoaded", () => {
	/* hamburger toggle */
	const mobileToggle = document.getElementById("mobile-menu-toggle");
	mobileToggle.addEventListener("click", () =>
    document.getElementById("mobile-menu").classList.toggle("active"));
    /* --- Global Toggles --- */ 
    localStorage.removeItem("tournamentMode");
    localStorage.removeItem("oemMode");
    localStorage.removeItem("installMode");
    localStorage.removeItem("motherboardMode");
    let oemNotchesManuallyRemoved = false;
    let installMode = false;
    let motherboardMode = false;
    localStorage.setItem("tournamentMode","false");
    let tournamentMode = JSON.parse(localStorage.getItem("tournamentMode") || "false");
    let oemMode = false; // false = PHOB; true = OEM (reduces shell prices by $100)
    const shellBtn = document.getElementById("shell-button");
    const installBtn    = document.getElementById("toggle-install");
    const motherboardBtn= document.getElementById("toggle-motherboard");
    document.getElementById("mobile-menu-toggle").addEventListener("click", () => {
    	document.getElementById("mobile-menu").classList.toggle("active");
    });
    document.getElementById("toggle-tournament").addEventListener("click", () => {
      tournamentMode = !tournamentMode;
      updateModMenus();
      updateModSummary();
      saveCartToLocalStorage();
      if (tournamentMode) {
        localStorage.setItem("tournamentMode", tournamentMode);
      } else { 
        localStorage.removeItem("tournamentMode");
      }
    });
    document.addEventListener("DOMContentLoaded", () => {
      const tournamentButton = document.getElementById("toggle-tournament");
      if (tournamentButton.dataset.hidden === "true") {
        tournamentButton.style.display = "none";
        tournamentMode = true;
        updateModMenus();
        updateModSummary();
        saveCartToLocalStorage();  
      }
    });
    document.getElementById("toggle-oem").addEventListener("click", () => {
      oemMode = !oemMode;
      const phobOverlay = document.getElementById("phob-overlay");
      const phobImage = document.getElementById("phob-image");
      const toggleOemButton = document.getElementById("toggle-oem");
    
      // Update button text and background for OEM toggle
      toggleOemButton.textContent = oemMode ? "OEM" : "PHOB";
      toggleOemButton.style.background = oemMode ? "#FAA61A" : "#FAA61A";
	  
	  document.body.style.backgroundColor = oemMode ? "#d6992f" : "white";
    
      // Immediately hide the overlay
      phobOverlay.style.opacity = 0;
    
      // Update mod menus and summary if needed
      updateModMenus();
      updateModSummary();
    
      // Wait briefly before changing the image source
      setTimeout(() => {
        if (oemMode) {
          phobImage.src = "/assets/img/phobfrown.png";
          localStorage.setItem("oemMode", oemMode);
        } else {
          phobImage.src = "/assets/img/phob.png";
          localStorage.removeItem("oemMode");
        }
        saveCartToLocalStorage();
        let opacity = 0;
        const fadeDuration = 500;
        const intervalTime = 20;
        const increment = intervalTime / fadeDuration;
        const fadeInInterval = setInterval(() => {
          opacity += increment;
          if (opacity >= 1) {
            opacity = 1;
            clearInterval(fadeInInterval);
          }
          phobOverlay.style.opacity = opacity;
        }, intervalTime);
      }, 100);
    });
	/* —— Conversion toggle —— */
installBtn.addEventListener("click", () => {
  installMode = !installMode;
  if (installMode) motherboardMode = false;
  if (!installMode && !motherboardMode) resetToIndigo();
  shellBtn.style.display = (installMode || motherboardMode) ? "none" : "";
  document.body.style.backgroundColor = installMode ? "#7274cc" : "#fafafa";
  syncShellEntry();                // ← ★ NEW ★
  updateModSummary();
  saveCartToLocalStorage();

  installMode
    ? localStorage.setItem("installMode", true)
    : localStorage.removeItem("installMode");
});

/* —— Motherboard toggle —— */
motherboardBtn.addEventListener("click", () => {
  motherboardMode = !motherboardMode;
  if (motherboardMode) installMode = false;
  if (!installMode && !motherboardMode) resetToIndigo();
  shellBtn.style.display = (installMode || motherboardMode) ? "none" : "";
  document.body.style.backgroundColor = motherboardMode ? "#72cc86" : "#fafafa";

  syncShellEntry();                // ← ★ NEW ★
  updateModSummary();
  saveCartToLocalStorage();

  motherboardMode
    ? localStorage.setItem("motherboardMode", true)
    : localStorage.removeItem("motherboardMode");
});
    
    /* --- Part Definitions --- */
    const partDefinitions = {
      "grey-stick": { shape: "poly", coords: "159,198,205,193,245,199,272,207,294,220,310,234,322,249,332,265,337,284,337,309,331,331,324,343,311,357,296,370,271,384,253,392,224,398,202,400,177,399,154,394,137,389,120,383,107,374,94,363,84,353,74,337,65,320,60,298,64,276,71,261,83,243,97,229,111,219,125,209,137,203,149,200" },
      "face-buttons": { shape: "poly", coords: "709,282,710,313,714,348,728,377,753,390,784,402,823,413,859,419,915,421,959,412,993,397,1022,375,1036,354,1054,326,1059,303,1057,266,1040,231,1015,207,990,187,959,172,921,162,876,156,842,162,806,168,773,184,753,201,739,215,725,230,716,249,709,267" },
      "c-stick": { shape: "poly", coords: "660,432,631,483,657,530,727,555,791,531,819,482,791,432,724,412" },
      "paracord": { shape: "rect", coords: "509,0,575,88" },
      "left-trigger": { shape: "poly", coords: "105,171,123,138,138,125,155,115,180,109,205,109,220,109,242,113,265,123" },
      "z-button": { shape: "poly", coords: "817,125,976,169,966,156,943,141,912,131,888,125,855,118,836,118" },
      "right-trigger": { shape: "poly", coords: "842,115,880,107,909,109,928,113,951,125,964,136,968,152,907,127" }
    };
    
    /* --- Mapping from Part to Mod Category --- */
    const partToCategory = {
      "paracord": "Cable",
      "left-trigger": "Left Trigger",
      "right-trigger": "Right Trigger",
      "z-button": "z-button",
      "face-buttons": "Face Buttons",
      "grey-stick": "Grey Stick",
      "c-stick": "C Stick"
    };
    
    /* --- Mod Options for each Category --- */
    const modOptions = {
      "Cable": [
        { id: 'paracord_2m', name: 'Paracord 2 Metres', standard: 55, tournament: 60, description: "Same as below but 2 metre old controller length." },
        { id: 'paracord_3m', name: 'Paracord 3 Metres', standard: 65, tournament: 70, description: "Cord hand crimped and paracorded up. Length of new controller cable." },
        { id: 'oem_3m', name: 'OEM 3 Metres', standard: 10, tournament: 15, description: "OEM 3 Metres (if applicable)." },
        { id: 'white_oem', name: 'White OEM', standard: 35, tournament: 45, description: "Subject to stock. OEM white cable." }
      ],
      "z-button": [
        { id: 'tactile_z', name: 'Tactile Z', standard: 10, tournament: 15, description: "Replace mushy OEM z with tactile clicky z. <strong>Recommend</strong>." },
        { id: 'bald_z', name: 'Bald Z', standard: 20, tournament: 30, description: "Rounded out z. Very nice with mouseclick z." },
        { id: 'mouseclick_z', name: 'Mouseclick Z', standard: 35, tournament: 50, description: "Replace z button with a mouseclick button. Reliable and very nice. <strong>Recommend</strong>." }
      ],
      "Face Buttons": [
        { id: 'mouseclick_abxy', name: 'Mouseclick ABXY', standard: 60, tournament: 80, description: "Put mouseclick on the abxy. Pairs well with bald buttons. Recommend if you like the feel." },
        { id: 'perforated_pads', name: 'Perforated Pads', standard: 10, tournament: 10, description: "OEM pads with lower force press." },
        { id: 'bald_buttons', name: 'Bald Buttons', standard: 70, tournament: 80, description: "OEM buttons sanded down to be easy to slide on. Good improvement on instant nair etc." }
      ],
      "Left Trigger": [
        { id: 'ergo_trigger', name: 'Ergo Trigger', standard: 30, tournament: 40, description: "Shaved down triggers, like a modern controller. Controller feels natural." },
        { id: 'full_plug', name: 'Full Plug', standard: 3, tournament: 5, description: "Full Plug. Select if you want full digital for mouseclick trigger" },
        { id: 'half_plug', name: 'Half Plug', standard: 3, tournament: 5, description: "Half Plug. Select if you want analog (lightshield) for mouseclick trigger" },
        { id: 'low_force', name: 'Low Force', standard: 15, tournament: 20, description: "Custom spring and lube makes the trigger feel weightless. Almost 100g force difference. <strong>Recommend</strong>." },
        { id: 'mouseclick_trigger', name: 'Mouseclick', standard: 20, tournament: 25, description: "Puts a mouseclick on there. Lowest press force possible. Can keep analog." },
      	{
  id:          'potentiometer_lt',
  name:        'Potentiometer Replacement',
  standard:    20,
  tournament:  10,
  description: 'Swap the left-trigger slider pot for crisp, reliable analog.'
}
      ],
      "Right Trigger": [
        { id: 'ergo_trigger', name: 'Ergo Trigger', standard: 30, tournament: 40, description: "Shaved down triggers, like a modern controller. Controller feels natural." },
        { id: 'full_plug', name: 'Full Plug', standard: 3, tournament: 3, description: "Full Plug. Select if you want full digital for mouseclick trigger" },
        { id: 'half_plug', name: 'Half Plug', standard: 3, tournament: 3, description: "Half Plug. Select if you want analog (lightshield) for mouseclick trigger" },
        { id: 'low_force', name: 'Low Force', standard: 15, tournament: 20, description: "Custom spring and lube makes the trigger feel weightless. Almost 100g force difference. <strong>Recommend</strong>." },
        { id: 'mouseclick_trigger', name: 'Mouseclick', standard: 20, tournament: 25, description: "Puts a mouseclick on there. Lowest press force possible. Can keep analog." },
    {
  id:          'potentiometer_rt',
  name:        'Potentiometer Replacement',
  standard:    20,
  tournament:  10,
  description: 'Swap the right-trigger slider pot for crisp, reliable analog.'
}  
    ],
      "Grey Stick": [
        { id: 'slickbox', name: 'Slickbox', standard: 20, tournament: 25, description: "Make the stickbox feel worn in and loose but not wobbly. Free flying." },
        { id: 'wavespring', name: 'Wavespring', standard: 20, tournament: 25, description: "Normalize the resistance on the X and Y axis of the stick. OEM is tighter on one. <strong>Recommend</strong>." },
        { id: 'replacement', name: 'Replacement', standard: 20, tournament: 20, description: "Replacement." },
        { id: 'lubrication', name: 'Lubrication', standard: 10, tournament: 10, description: "Lubricate the sticks for longer lifetime." },
        { id: 'firefox_notches', name: 'Firefox Notches', standard: 100, tournament: 120, description: "Precise angle notches on the left up and right gates." },
        { id: 'wavedash_notches', name: 'Wavedash Notches', standard: 45, tournament: 50, description: "Notches for perfect wavedash angle, comes with Firefox notches." },
        { id: 'bottom_notch', name: 'Bottom Notch', standard: 25, tournament: 40, description: "Notches for the bottom gate." },
        { id: 'oem_notches', name: 'OEM Notches', standard: 30, tournament: 30, description: "OEM Notches." },
	{ id: 'potentiometer_grey',name: 'Potentiometer Replacement',standard: 60,tournament: 10,description: 'Replace both X- and Y-axis pots'}],
      "C Stick": [
        { id: 'slickbox', name: 'Slickbox', standard: 20, tournament: 25, description: "Make the stickbox feel worn in and loose but not wobbly. Free flying." },
        { id: 'wavespring', name: 'Wavespring', standard: 20, tournament: 25, description: "Normalize the resistance on the X and Y axis of the stick. OEM is tighter on one. <strong>Recommend</strong>." },
        { id: 'replacement', name: 'Replacement', standard: 20, tournament: 20, description: "Replacement." },
        { id: 'lubrication', name: 'Lubrication', standard: 10, tournament: 10, description: "Lubricate the C Stick for smooth movement." },
    	  
    	{
  id:          'potentiometer_c',
  name:        'Potentiometer Replacement',
  standard:    60,
  tournament:  10,
  description: 'Renew both C-Stick potentiometers for a like-new feel.'
},  
    ],
      "Shell": [
        { id: 'gccblack', name: 'Black', filename: '/assets/img/gccblack.png', standard: 200, tournament: 250, description: 'Black shell' },
        { id: 'gccindigo', name: 'Indigo', filename: '/assets/img/gcc.png', standard: 200, tournament: 250, description: 'Indigo shell' },
        { id: 'gccorange', name: 'Orange', filename: '/assets/img/gccorange.png', standard: 200, tournament: 250, description: 'Orange shell' },
        { id: 'gccwhite', name: 'White', filename: '/assets/img/gccwhite.png', standard: 250, tournament: 290, description: 'White shell' },
        { id: 'gccemerald', name: 'Emerald', filename: '/assets/img/gccemerald.png', standard: 250, tournament: 290, description: 'Emerald shell' }
      ]
    };
    const shellOptions   = modOptions["Shell"];
    const shellNameById = {}; shellOptions.forEach(s => { shellNameById[s.id] = s.name; });
    
    /* --- Selected Mods Storage (Keyed by Category) --- */
    let selectedMods = {};
    let selectedShell = null;
    
    let touchTimer;
    let allHighlighted = false;
    
    /* --- Set Default Shell (Indigo) on Load --- */
    if (!installMode && !motherboardMode) {
	    window.addEventListener("load", () => {
	      selectedMods["Shell"] = [{ id: 'gccindigo', name: 'Indigo', standard: 200, tournament: 250, description: "Indigo Shell" }];
	      updateModSummary();
	      saveCartToLocalStorage();
	    });
    };
    /* --- Create Dynamic Overlays for Non-Shell Parts --- */
    window.addEventListener("load", () => {
      const container = document.getElementById("controllerContainer");
      const img = document.getElementById("controllerImage");
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      
      for (const part in partToCategory) {
        const def = partDefinitions[part];
        if (!def) continue;
        const shape = def.shape;
        const coords = def.coords.split(",").map(Number);
        let overlay = document.createElement("div");
        overlay.className = "part-overlay initial-pulse";
        overlay.setAttribute("data-part", part);
        
        if (shape === "poly") {
          let xs = [], ys = [];
          for (let i = 0; i < coords.length; i += 2) {
            xs.push(coords[i]);
            ys.push(coords[i+1]);
          }
          const minX = Math.min(...xs), maxX = Math.max(...xs);
          const minY = Math.min(...ys), maxY = Math.max(...ys);
          overlay.style.left = (minX / naturalWidth * 100) + "%";
          overlay.style.top = (minY / naturalHeight * 100) + "%";
          overlay.style.width = ((maxX - minX) / naturalWidth * 100) + "%";
          overlay.style.height = ((maxY - minY) / naturalHeight * 100) + "%";
          let points = [];
          for (let i = 0; i < coords.length; i += 2) {
            let xPercent = ((coords[i] - minX) / (maxX - minX)) * 100;
            let yPercent = ((coords[i+1] - minY) / (maxY - minY)) * 100;
            points.push(`${xPercent}% ${yPercent}%`);
          }
          overlay.style.clipPath = `polygon(${points.join(", ")})`;
          if (part === "face-buttons") {
            overlay.style.borderRadius = "50%";
          }
        } else if (shape === "circle") {
          const cx = coords[0], cy = coords[1], r = coords[2];
          overlay.style.left = (((cx - r) / naturalWidth) * 100) + "%";
          overlay.style.top = (((cy - r) / naturalHeight) * 100) + "%";
          overlay.style.width = (((2 * r) / naturalWidth) * 100) + "%";
          overlay.style.height = (((2 * r) / naturalWidth) * 100) + "%";
          overlay.style.borderRadius = "50%";
        } else if (shape === "rect") {
          let x1 = coords[0], y1 = coords[1], x2 = coords[2], y2 = coords[3];
          overlay.style.left = ((x1 / naturalWidth) * 100) + "%";
          overlay.style.top = ((y1 / naturalHeight) * 100) + "%";
          let widthPercent = ((x2 - x1) / naturalWidth * 100);
          let heightPercent = ((y2 - y1) / naturalHeight * 100);
          if (heightPercent <= 0) heightPercent = 2;
          overlay.style.width = widthPercent + "%";
          overlay.style.height = heightPercent + "%";
        }
        
        // Remove initial pulse after 5 seconds
        setTimeout(() => {
          overlay.classList.remove("initial-pulse");
        }, 5000);
        
        // Touch long-press support
        overlay.addEventListener("touchstart", (e) => {
          touchTimer = setTimeout(() => {
            overlay.classList.add("hovered");
          }, 500);
        });
        overlay.addEventListener("touchend", (e) => {
          clearTimeout(touchTimer);
          overlay.classList.remove("hovered");
        });
        overlay.addEventListener("touchcancel", (e) => {
          clearTimeout(touchTimer);
          overlay.classList.remove("hovered");
        });
        
        // Open mod menu on click/tap
        overlay.addEventListener("click", (e) => {
          showModMenu(e, part);
          e.stopPropagation();
        });
        container.appendChild(overlay);
      }
    });
    
    /* --- Shell Button & Menu --- */
    document.getElementById("shell-button").addEventListener("click", (e) => {
      e.stopPropagation();
      showShellMenu(e);
    });
    
	function showShellMenu (event) {
  event.stopPropagation();
  event.preventDefault();

  const menu = document.getElementById("shell-menu");
  menu.style.left = `${event.pageX}px`;
  menu.style.top  = `${event.pageY + 10}px`;

  // work out which mode we’re in ­and the correct override prices
  let modeName       = "Shell";
  let titleLabel     = "Shell";
  let overrideStd    = null;
  let overrideTour   = null;

  if (installMode) {
    modeName     = "Conversion";
    overrideStd  = 100;
    overrideTour = 130;
    titleLabel   = MODE_LABEL[modeName];  
  } else if (motherboardMode) {
    modeName     = "Motherboard";
    overrideStd  = 150;
    overrideTour = 200;
    titleLabel   = MODE_LABEL[modeName];   
  } else if (oemMode) {
	modeName     = "OEM";
    overrideStd  = 150;
    overrideTour = 200;
    titleLabel   = MODE_LABEL[modeName];   
  }
  let html = `<h4>${modeName} Mods</h4>`;

  shellOptions.forEach(opt => {
    let price = (overrideStd !== null)
      ? (tournamentMode ? overrideTour : overrideStd)      // use override
      : (tournamentMode ? opt.tournament : opt.standard);  // regular Shell

    //if (oemMode) price = price - 50;         // OEM discount

    html += `
      <div class="tooltip"
           onclick="selectShell('${opt.id}',
                                '${opt.filename}',
                                '${modeName}')">
        <span>${opt.name} ($${price})</span>
        <span class="tooltiptext">${opt.description}</span>
      </div><br>`;
  });

  menu.innerHTML = html;
  menu.classList.add("active");
}
const MODE_LABEL = {
  Conversion  : "Install",
  Motherboard : "Board",
  OEM: "OEM"
};

function syncShellEntry () {
  // ① grab whichever flavour of the entry is currently saved
  const current = selectedMods.Shell ||
                  selectedMods.Conversion ||
                  selectedMods.Motherboard;
  if (!current) return;                            // nothing picked yet

  // ② look up this shell’s real MSRP so we can always restore it
  const base = shellOptions.find(s => s.id === current[0].id) || {};

  let newKey = "Shell";
  let std  = (base.standard !== undefined ? base.standard: current[0].standard);
  let tour = (base.tournament !== undefined ? base.tournament : current[0].tournament);

  if (installMode) {                   // —— Conversion mode —— 
    newKey = "Conversion";
    std  = 100;                        // user-defined base
    tour = 130;                        // user-defined tournament
  } else if (motherboardMode) {        // —— Motherboard mode ——
    newKey = "Motherboard";
    std  = 150;
    tour = 200;
  } else if (oemMode) {
	  newKey = "OEM";
	  std = 150;
	  tour = 200;
   }

  // ③ rebuild the entry under the right key
  ["Shell","Conversion","Motherboard","OEM"].forEach(k => delete selectedMods[k]);

  selectedMods[newKey] = [{
    ...current[0],
    name:  newKey === "Shell" ? current[0].name
                              : MODE_LABEL[newKey],  // Install / Board
    standard:   std,
    tournament: tour
  }];
}
    function resetToIndigo () {
  // set the cart entry …
  selectedMods.Shell = [{
    id:          'gccindigo',
    name:        'Indigo',
    standard:    200,
    tournament:  250,
    description: 'Indigo shell'
  }];

  // …and reset the picture
  document.getElementById("controllerImage").src = "/assets/img/gcc.png";
}
    function hideShellMenu() {
      document.getElementById("shell-menu").classList.remove("active");
    }
    
function selectShell(shellId, filename, shellName) {
  const img = document.getElementById("controllerImage");
  img.src = filename;

  // 1. Clear out any old Shell/Conversion/Motherboard entries
  ["Shell","Conversion","Motherboard", "OEM"].forEach(k => delete selectedMods[k]);

  // 2. Get the option we just clicked
  const opt = shellOptions.find(s => s.id === shellId);

  // 3. Record it under the correct key
  selectedMods[shellName] = [{
    id:          shellId,
    name:        shellName === "Shell"
                   ? opt.name
                   : MODE_LABEL[shellName],
    standard:    shellName === "Conversion"   ? 100
               : shellName === "Motherboard"  ? 150
               : shellName === "OEM" ? 150 
			   : opt.standard,
    tournament:  shellName === "Conversion"   ? 130
               : shellName === "Motherboard"  ? 200
			   : shellName === "OEM" ? 200 
               : opt.tournament,
    description: opt.description
  }];

  updateModSummary();
  saveCartToLocalStorage();
  hideShellMenu();
}

    
    /* --- Mod Menu Functions for Non-Shell Mods --- */
    function showModMenu(event, part) {
      event.stopPropagation();
      event.preventDefault();
      const category = partToCategory[part];
      const menu = document.getElementById("mod-menu");
      menu.style.left = event.pageX + "px";
      menu.style.top = (event.pageY + 10) + "px";
      let html = `<h4>${category} Mods</h4>`;
      
      if (category === "Cable") {
        var selectedCable = selectedMods["Cable"] || [];
      }
      if (category === "z-button") {
        var selectedZ = selectedMods["z-button"] || [];
        var zSelected = selectedZ.find(m => m.id === "tactile_z" || m.id === "mouseclick_z");
      }
      
      (modOptions[category] || []).forEach(mod => {
        let basePrice = tournamentMode ? mod.tournament : mod.standard;
        if (category === "Grey Stick" && mod.id === "wavedash_notches") {
          const greySelected = selectedMods["Grey Stick"] || [];
          if (greySelected.find(m => m.id === "firefox_notches")) {
            basePrice = 0;
          }
        }
        
        let disabledStyle = "";
        if (category === "Cable" && selectedCable.length > 0 && !selectedCable.find(m => m.id === mod.id)) {
          disabledStyle = 'style="pointer-events: none; color: #aaa;"';
        }
        if (category === "z-button" && zSelected && zSelected.id !== mod.id && mod.id !== "bald_z") {
          disabledStyle = 'style="pointer-events: none; color: #aaa;"';
        }
        if (oemMode && (mod.id === "mouseclick_z" || mod.id === "mouseclick_abxy")) {
          disabledStyle = 'style="pointer-events: none; color: #aaa;"';
        }
        if (category === "Grey Stick" && mod.id === "oem_notches" && !oemMode) {
          disabledStyle = 'style="pointer-events: none; color: #aaa;"';
        }
        html += `<div class="tooltip" ${disabledStyle} onclick="toggleMod('${part}', '${mod.id}', '${mod.name}', ${mod.standard}, ${mod.tournament}, '${mod.description}')">
                   <span>${mod.name} ($${basePrice})</span>
                   <span class="tooltiptext">${mod.description}</span>
                 </div><br>`;
      });
      menu.innerHTML = html;
      menu.classList.add("active");
    }
    
    function hideModMenu() {
      document.getElementById("mod-menu").classList.remove("active");
    }
    function saveCartToLocalStorage() {
      const cartToSave = {};
      for (const category in selectedMods) {
        cartToSave[category] = selectedMods[category].map(mod => {
          let effectivePrice = tournamentMode ? mod.tournament : mod.standard;
          if (category === "Grey Stick" && mod.id === "wavedash_notches") {
            if (selectedMods["Grey Stick"].some(m => m.id === "firefox_notches")) {
              effectivePrice = 0;
            }
          }
          if (category === "Shell" && oemMode) {
            effectivePrice -= 50;
          }
          return { ...mod, effectivePrice };
        });
      }
      localStorage.setItem("cart", JSON.stringify(cartToSave));
      localStorage.setItem("tournamentMode", tournamentMode);
    }
    function toggleMod(part, modId, modName, standardPrice, tournamentPrice, description) {
      const category = partToCategory[part];
      if (!selectedMods[category]) selectedMods[category] = [];
      const index = selectedMods[category].findIndex(m => m.id === modId);
      if (index > -1) {
        selectedMods[category].splice(index, 1);
      } else {
        selectedMods[category].push({ id: modId, name: modName, standard: standardPrice, tournament: tournamentPrice, description: description });
      }
      updateModSummary();
      saveCartToLocalStorage();
      hideModMenu();
    }
    
    function removeMod(category, modId) {
      if (selectedMods[category]) {
        selectedMods[category] = selectedMods[category].filter(m => m.id !== modId);
        updateModSummary();
        saveCartToLocalStorage();
      }
    }
    
    /* --- Update Mod Summary --- */
    function updateModSummary() {
      syncShellEntry();          
      const container = document.getElementById("mod-groups");
      container.innerHTML = "";
      for (const category in selectedMods) {
        if (selectedMods[category].length > 0) {
          const groupDiv = document.createElement("div");
          groupDiv.className = "mod-group";
          const header = document.createElement("h4");
          header.textContent = category;
          groupDiv.appendChild(header);
          
          const ul = document.createElement("ul");
          ul.style.display = "grid";
          ul.style.gridAutoFlow = "column";
          ul.style.gridTemplateRows = "repeat(2, auto)";
          ul.style.gap = "4px";
          ul.style.listStyle = "none";
          ul.style.padding = "0";
          ul.style.margin = "0";
          
          selectedMods[category].forEach(mod => {
            let basePrice = tournamentMode ? mod.tournament : mod.standard;
            if (category === "Grey Stick" && mod.id === "wavedash_notches") {
              const greySelected = selectedMods["Grey Stick"] || [];
              if (greySelected.find(m => m.id === "firefox_notches")) {
                basePrice = 0;
              }
            }
            if (category === "Shell" && oemMode) {
              basePrice -= 50;
            }
            
            const li = document.createElement("li");
            li.innerHTML = `<div class="mod-info">
                             <span>${shellNameById[mod.id] ? shellNameById[mod.id] : mod.name} ($${basePrice})</span>
                            </div>
                            <div>
                              <span class="remove-mod" onclick="removeMod('${category}', '${mod.id}')">x</span>
                              <span class="tooltip">i
                                <span class="tooltiptext">${mod.description}</span>
                              </span>
                            </div>`;
            ul.appendChild(li);
          });
		  
		  if (oemMode) {
			  const notchIDs = ["firefox_notches", "wavedash_notches", "bottom_notch"];
			  const greyStickMods = selectedMods["Grey Stick"] || [];
			  const selectedNotches = greyStickMods.filter(mod => notchIDs.includes(mod.id)).map(mod => mod.id);
			  selectedMods["Grey Stick"] = greyStickMods.filter(mod => mod.id !== "oem_notches");
			  if (selectedNotches.length > 0) {
				let oemNotchesPrice = 30;
				if (selectedNotches.length === 1 && 
					(selectedNotches.includes("wavedash_notches") || selectedNotches.includes("bottom_notch")) &&
					!selectedNotches.includes("firefox_notches")) {
				  oemNotchesPrice = 15;
				}
				selectedMods["Grey Stick"].push({
				  id: "oem_notches",
				  name: "OEM Notches",
				  standard: oemNotchesPrice,
				  tournament: oemNotchesPrice,
				  description: "Only if you are making notches for an OEM non-phob controller"
				});
			  }
			} else {
			  if (selectedMods["Grey Stick"]) {
				selectedMods["Grey Stick"] = selectedMods["Grey Stick"].filter(mod => mod.id !== "oem_notches");
			  }
			}
          groupDiv.appendChild(ul);
          container.appendChild(groupDiv);
        }
      }
    }
    
    /* --- Toggle All Highlights --- */
    document.getElementById("toggle-all").addEventListener("click", () => {
      const overlays = document.querySelectorAll(".part-overlay");
      allHighlighted = !allHighlighted;
      overlays.forEach(overlay => {
        if (allHighlighted) {
          overlay.classList.add("always-highlight");
        } else {
          overlay.classList.remove("always-highlight");
        }
      });
    });
    
    /* --- Hide Menus on Document Click --- */
    document.addEventListener("click", (e) => {
      if (!document.getElementById("mod-menu").contains(e.target))
        hideModMenu();
      if (!document.getElementById("shell-menu").contains(e.target))
        hideShellMenu();
    });
    
    /* --- Checkout --- */
    document.querySelector(".cart-button").addEventListener("click", () => {
      saveCartToLocalStorage();
    });
    function checkout() {
      window.location.href = "checkout.html";
    }
    
    /* --- Helper: Update mod menus if tournament mode changes --- */
    function updateModMenus() {
      updateModSummary();
      saveCartToLocalStorage();
    }
	  window.showModMenu   = showModMenu;
window.showShellMenu = showShellMenu;
window.toggleMod     = toggleMod;
window.selectShell   = selectShell;
window.removeMod     = removeMod;
window.syncShellEntry = syncShellEntry; 
});
