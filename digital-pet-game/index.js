var PetApp = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // index.tsx
  var index_exports = {};
  __export(index_exports, {
    PetGame: () => PetGame
  });
  var { useState, useEffect } = React;
  var MOOD_EMOJI = {
    [0 /* HAPPY */]: "\u{1F60A}",
    [1 /* EXCITED */]: "\u{1F929}",
    [2 /* CONTENT */]: "\u{1F642}",
    [3 /* SAD */]: "\u{1F622}",
    [4 /* TIRED */]: "\u{1F634}",
    [5 /* SICK */]: "\u{1F912}",
    [6 /* HUNGRY */]: "\u{1F356}"
  };
  var MOOD_LABEL = {
    [0 /* HAPPY */]: "Happy",
    [1 /* EXCITED */]: "Excited",
    [2 /* CONTENT */]: "Content",
    [3 /* SAD */]: "Sad",
    [4 /* TIRED */]: "Tired",
    [5 /* SICK */]: "Sick",
    [6 /* HUNGRY */]: "Hungry"
  };
  var IDLE_START_DELAY_MS = 2e3;
  var IDLE_TICK_MS = 250;
  var IDLE_STEP = 10;
  var clamp = (n) => Math.min(100, Math.max(0, n));
  function getMood(s) {
    if (s.hunger > 70) return 6 /* HUNGRY */;
    if (s.energy < 30) return 4 /* TIRED */;
    if (s.happiness < 30) return 3 /* SAD */;
    if (s.happiness > 80 && s.energy > 70) return 1 /* EXCITED */;
    if (s.happiness > 60) return 0 /* HAPPY */;
    return 2 /* CONTENT */;
  }
  var PetGame = () => {
    const [petName, setPetName] = useState("");
    const [started, setStarted] = useState(false);
    const [stats, setStats] = useState({
      hunger: 0,
      happiness: 100,
      energy: 100
    });
    const idleDone = stats.hunger >= 100 && stats.happiness <= 0;
    useEffect(() => {
      if (!started || idleDone) return;
      let timer;
      const delay = setTimeout(() => {
        timer = setInterval(() => {
          setStats((s) => {
            const hunger = clamp(s.hunger + IDLE_STEP);
            const happiness = clamp(s.happiness - IDLE_STEP);
            if (hunger === s.hunger && happiness === s.happiness) return s;
            return { ...s, hunger, happiness };
          });
        }, IDLE_TICK_MS);
      }, IDLE_START_DELAY_MS);
      return () => {
        clearTimeout(delay);
        if (timer) clearInterval(timer);
      };
    }, [started, idleDone]);
    function handleStart(e) {
      e.preventDefault();
      const input = e.currentTarget.elements.namedItem("pet-name");
      const trimmed = input.value.trim();
      setPetName(trimmed === "" ? "Pet" : trimmed);
      setStarted(true);
    }
    function perform(action) {
      setStats((s) => {
        switch (action) {
          case 0 /* EAT */:
            return { ...s, hunger: clamp(s.hunger - 20), energy: clamp(s.energy + 10) };
          case 1 /* PLAY */:
            return { ...s, energy: clamp(s.energy - 15), happiness: clamp(s.happiness + 20) };
          case 2 /* SLEEP */:
            return { ...s, hunger: clamp(s.hunger + 10), energy: clamp(s.energy + 30) };
          default:
            return s;
        }
      });
    }
    if (!started) {
      return /* @__PURE__ */ React.createElement("main", { className: "app" }, /* @__PURE__ */ React.createElement("form", { className: "card", onSubmit: handleStart }, /* @__PURE__ */ React.createElement("h1", null, "Adopt a pet"), /* @__PURE__ */ React.createElement("label", { htmlFor: "pet-name" }, "What will you name your pet?"), /* @__PURE__ */ React.createElement(
        "input",
        {
          id: "pet-name",
          name: "pet-name",
          type: "text",
          autoComplete: "off",
          defaultValue: ""
        }
      ), /* @__PURE__ */ React.createElement("button", { type: "submit" }, "Start game")));
    }
    const mood = getMood(stats);
    const rows = [
      { label: "Hunger", value: stats.hunger },
      { label: "Happiness", value: stats.happiness },
      { label: "Energy", value: stats.energy }
    ];
    return /* @__PURE__ */ React.createElement("main", { className: "app" }, /* @__PURE__ */ React.createElement("section", { className: "card" }, /* @__PURE__ */ React.createElement("h2", { className: "pet-name" }, petName), /* @__PURE__ */ React.createElement("div", { className: "pet-face" }, MOOD_EMOJI[mood]), /* @__PURE__ */ React.createElement("p", { className: "mood-label" }, MOOD_LABEL[mood]), /* @__PURE__ */ React.createElement("div", { className: "stats" }, rows.map((row) => /* @__PURE__ */ React.createElement("div", { className: "stat", key: row.label }, /* @__PURE__ */ React.createElement("span", { className: "stat-label" }, row.label), /* @__PURE__ */ React.createElement("span", { className: "stat-value" }, row.value), /* @__PURE__ */ React.createElement("div", { className: "bar" }, /* @__PURE__ */ React.createElement("div", { className: "fill", style: { width: row.value + "%" } }))))), /* @__PURE__ */ React.createElement("div", { className: "actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", id: "eat-action", onClick: () => perform(0 /* EAT */) }, "Eat"), /* @__PURE__ */ React.createElement("button", { type: "button", id: "play-action", onClick: () => perform(1 /* PLAY */) }, "Play"), /* @__PURE__ */ React.createElement("button", { type: "button", id: "sleep-action", onClick: () => perform(2 /* SLEEP */) }, "Sleep"))));
  };
  return __toCommonJS(index_exports);
})();
