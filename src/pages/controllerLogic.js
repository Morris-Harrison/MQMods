// Controller Builder Logic - Pure JavaScript (no DOM manipulation)

export const partDefinitions = {
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

export const partToCategory = {
  paracord: "Cable",
  "left-trigger": "Left Trigger",
  "right-trigger": "Right Trigger",
  "z-button": "z-button",
  "face-buttons": "Face Buttons",
  "grey-stick": "Grey Stick",
  "c-stick": "C Stick",
};

export const modOptions = {
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
    {
      id: "oem_3m",
      name: "OEM 3 Metres",
      standard: 10,
      tournament: 15,
      description: "OEM 3 Metres (if applicable).",
    },
    {
      id: "white_oem",
      name: "White OEM",
      standard: 35,
      tournament: 45,
      description: "Subject to stock. OEM white cable.",
    },
  ],
  "z-button": [
    {
      id: "tactile_z",
      name: "Tactile Z",
      standard: 10,
      tournament: 15,
      description:
        "Replace mushy OEM z with tactile clicky z. <strong>Recommend</strong>.",
    },
    {
      id: "bald_z",
      name: "Bald Z",
      standard: 20,
      tournament: 30,
      description: "Rounded out z. Very nice with mouseclick z.",
    },
    {
      id: "mouseclick_z",
      name: "Mouseclick Z",
      standard: 35,
      tournament: 50,
      description:
        "Replace z button with a mouseclick button. Reliable and very nice. <strong>Recommend</strong>.",
    },
  ],
  "Face Buttons": [
    {
      id: "mouseclick_abxy",
      name: "Mouseclick ABXY",
      standard: 60,
      tournament: 80,
      description:
        "Put mouseclick on the abxy. Pairs well with bald buttons. Recommend if you like the feel.",
    },
    {
      id: "perforated_pads",
      name: "Perforated Pads",
      standard: 10,
      tournament: 10,
      description: "OEM pads with lower force press.",
    },
    {
      id: "bald_buttons",
      name: "Bald Buttons",
      standard: 70,
      tournament: 80,
      description:
        "OEM buttons sanded down to be easy to slide on. Good improvement on instant nair etc.",
    },
  ],
  "Left Trigger": [
    {
      id: "ergo_trigger",
      name: "Ergo Trigger",
      standard: 30,
      tournament: 40,
      description:
        "Shaved down triggers, like a modern controller. Controller feels natural.",
    },
    {
      id: "full_plug",
      name: "Full Plug",
      standard: 3,
      tournament: 5,
      description:
        "Full Plug. Select if you want full digital for mouseclick trigger",
    },
    {
      id: "half_plug",
      name: "Half Plug",
      standard: 3,
      tournament: 5,
      description:
        "Half Plug. Select if you want analog (lightshield) for mouseclick trigger",
    },
    {
      id: "low_force",
      name: "Low Force",
      standard: 15,
      tournament: 20,
      description:
        "Custom spring and lube makes the trigger feel weightless. Almost 100g force difference. <strong>Recommend</strong>.",
    },
    {
      id: "mouseclick_trigger",
      name: "Mouseclick",
      standard: 20,
      tournament: 25,
      description:
        "Puts a mouseclick on there. Lowest press force possible. Can keep analog.",
    },
    {
      id: "potentiometer_lt",
      name: "Potentiometer Replacement",
      standard: 20,
      tournament: 10,
      description:
        "Swap the left-trigger slider pot for crisp, reliable analog.",
    },
  ],
  "Right Trigger": [
    {
      id: "ergo_trigger",
      name: "Ergo Trigger",
      standard: 30,
      tournament: 40,
      description:
        "Shaved down triggers, like a modern controller. Controller feels natural.",
    },
    {
      id: "full_plug",
      name: "Full Plug",
      standard: 3,
      tournament: 3,
      description:
        "Full Plug. Select if you want full digital for mouseclick trigger",
    },
    {
      id: "half_plug",
      name: "Half Plug",
      standard: 3,
      tournament: 3,
      description:
        "Half Plug. Select if you want analog (lightshield) for mouseclick trigger",
    },
    {
      id: "low_force",
      name: "Low Force",
      standard: 15,
      tournament: 20,
      description:
        "Custom spring and lube makes the trigger feel weightless. Almost 100g force difference. <strong>Recommend</strong>.",
    },
    {
      id: "mouseclick_trigger",
      name: "Mouseclick",
      standard: 20,
      tournament: 25,
      description:
        "Puts a mouseclick on there. Lowest press force possible. Can keep analog.",
    },
    {
      id: "potentiometer_rt",
      name: "Potentiometer Replacement",
      standard: 20,
      tournament: 10,
      description:
        "Swap the right-trigger slider pot for crisp, reliable analog.",
    },
  ],
  "Grey Stick": [
    {
      id: "slickbox",
      name: "Slickbox",
      standard: 20,
      tournament: 25,
      description:
        "Make the stickbox feel worn in and loose but not wobbly. Free flying.",
    },
    {
      id: "wavespring",
      name: "Wavespring",
      standard: 20,
      tournament: 25,
      description:
        "Normalize the resistance on the X and Y axis of the stick. OEM is tighter on one. <strong>Recommend</strong>.",
    },
    {
      id: "replacement",
      name: "Replacement",
      standard: 20,
      tournament: 20,
      description: "Replacement.",
    },
    {
      id: "lubrication",
      name: "Lubrication",
      standard: 10,
      tournament: 10,
      description: "Lubricate the sticks for longer lifetime.",
    },
    {
      id: "firefox_notches",
      name: "Firefox Notches",
      standard: 100,
      tournament: 120,
      description: "Precise angle notches on the left up and right gates.",
    },
    {
      id: "wavedash_notches",
      name: "Wavedash Notches",
      standard: 45,
      tournament: 50,
      description:
        "Notches for perfect wavedash angle, comes with Firefox notches.",
    },
    {
      id: "bottom_notch",
      name: "Bottom Notch",
      standard: 25,
      tournament: 40,
      description: "Notches for the bottom gate.",
    },
    {
      id: "oem_notches",
      name: "OEM Notches",
      standard: 30,
      tournament: 30,
      description: "OEM Notches.",
    },
    {
      id: "potentiometer_grey",
      name: "Potentiometer Replacement",
      standard: 60,
      tournament: 10,
      description: "Replace both X- and Y-axis pots",
    },
  ],
  "C Stick": [
    {
      id: "slickbox",
      name: "Slickbox",
      standard: 20,
      tournament: 25,
      description:
        "Make the stickbox feel worn in and loose but not wobbly. Free flying.",
    },
    {
      id: "wavespring",
      name: "Wavespring",
      standard: 20,
      tournament: 25,
      description:
        "Normalize the resistance on the X and Y axis of the stick. OEM is tighter on one. <strong>Recommend</strong>.",
    },
    {
      id: "replacement",
      name: "Replacement",
      standard: 20,
      tournament: 20,
      description: "Replacement.",
    },
    {
      id: "lubrication",
      name: "Lubrication",
      standard: 10,
      tournament: 10,
      description: "Lubricate the C Stick for smooth movement.",
    },
    {
      id: "potentiometer_c",
      name: "Potentiometer Replacement",
      standard: 60,
      tournament: 10,
      description: "Renew both C-Stick potentiometers for a like-new feel.",
    },
  ],
  Shell: [
    {
      id: "gccblack",
      name: "Black",
      filename: "../img/gccblack.png",
      standard: 200,
      tournament: 250,
      description: "Black shell",
    },
    {
      id: "gccindigo",
      name: "Indigo",
      filename: "../img/gcc.png",
      standard: 200,
      tournament: 250,
      description: "Indigo shell",
    },
    {
      id: "gccorange",
      name: "Orange",
      filename: "../img/gccorange.png",
      standard: 200,
      tournament: 250,
      description: "Orange shell",
    },
    {
      id: "gccwhite",
      name: "White",
      filename: "../img/gccwhite.png",
      standard: 250,
      tournament: 290,
      description: "White shell",
    },
    {
      id: "gccemerald",
      name: "Emerald",
      filename: "../img/gccemerald.png",
      standard: 250,
      tournament: 290,
      description: "Emerald shell",
    },
  ],
};

export const shellOptions = modOptions["Shell"];

export const MODE_LABEL = {
  Conversion: "Install",
  Motherboard: "Board",
  OEM: "OEM",
};

export const shellNameById = {};
shellOptions.forEach((s) => {
  shellNameById[s.id] = s.name;
});

export const getEffectivePrice = (
  mod,
  category,
  tournamentMode,
  shellIdForChecking = null
) => {
  let basePrice = tournamentMode ? mod.tournament : mod.standard;

  if (
    category === "Grey Stick" &&
    mod.id === "wavedash_notches" &&
    shellIdForChecking === "firefox_notches"
  ) {
    basePrice = 0;
  }

  return basePrice;
};
