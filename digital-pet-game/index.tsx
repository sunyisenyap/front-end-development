const { useState, useEffect } = React;

enum PetMood {
  HAPPY,
  EXCITED,
  CONTENT,
  SAD,
  TIRED,
  SICK,
  HUNGRY,
}

enum PetAction {
  EAT,
  PLAY,
  SLEEP,
}

const MOOD_EMOJI: Record<PetMood, string> = {
  [PetMood.HAPPY]: "😊",
  [PetMood.EXCITED]: "🤩",
  [PetMood.CONTENT]: "🙂",
  [PetMood.SAD]: "😢",
  [PetMood.TIRED]: "😴",
  [PetMood.SICK]: "🤒",
  [PetMood.HUNGRY]: "🍖",
};

const MOOD_LABEL: Record<PetMood, string> = {
  [PetMood.HAPPY]: "Happy",
  [PetMood.EXCITED]: "Excited",
  [PetMood.CONTENT]: "Content",
  [PetMood.SAD]: "Sad",
  [PetMood.TIRED]: "Tired",
  [PetMood.SICK]: "Sick",
  [PetMood.HUNGRY]: "Hungry",
};

interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
}

// Atur kecepatan "waktu idle" di sini
const IDLE_START_DELAY_MS = 2000;
const IDLE_TICK_MS = 250;
const IDLE_STEP = 10;

const clamp = (n: number): number => Math.min(100, Math.max(0, n));

function getMood(s: PetStats): PetMood {
  if (s.hunger > 70) return PetMood.HUNGRY;
  if (s.energy < 30) return PetMood.TIRED;
  if (s.happiness < 30) return PetMood.SAD;
  if (s.happiness > 80 && s.energy > 70) return PetMood.EXCITED;
  if (s.happiness > 60) return PetMood.HAPPY;
  return PetMood.CONTENT;
}

export const PetGame = () => {
  const [petName, setPetName] = useState("");
  const [started, setStarted] = useState(false);
  const [stats, setStats] = useState<PetStats>({
    hunger: 0,
    happiness: 100,
    energy: 100,
  });

  // Idle sudah mentok kalau hunger 100 dan happiness 0
  const idleDone = stats.hunger >= 100 && stats.happiness <= 0;

  // Saat dibiarkan: hunger naik, happiness turun, energy tidak berubah.
  // Timer berhenti sendiri kalau sudah mentok.
    useEffect(() => {
    if (!started || idleDone) return;
    let timer: ReturnType<typeof setInterval> | undefined;
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

  function handleStart(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("pet-name") as HTMLInputElement;
    const trimmed = input.value.trim();
    setPetName(trimmed === "" ? "Pet" : trimmed);
    setStarted(true);
  }

  function perform(action: PetAction) {
    setStats((s) => {
      switch (action) {
        case PetAction.EAT:
          return { ...s, hunger: clamp(s.hunger - 20), energy: clamp(s.energy + 10) };
        case PetAction.PLAY:
          return { ...s, energy: clamp(s.energy - 15), happiness: clamp(s.happiness + 20) };
        case PetAction.SLEEP:
          return { ...s, hunger: clamp(s.hunger + 10), energy: clamp(s.energy + 30) };
        default:
          return s;
      }
    });
  }

  if (!started) {
    return (
      <main className="app">
        <form className="card" onSubmit={handleStart}>
          <h1>Adopt a pet</h1>
          <label htmlFor="pet-name">What will you name your pet?</label>
          <input
            id="pet-name"
            name="pet-name"
            type="text"
            autoComplete="off"
            defaultValue=""
          />
          <button type="submit">Start game</button>
        </form>
      </main>
    );
  }

  const mood = getMood(stats);

  const rows: { label: string; value: number }[] = [
    { label: "Hunger", value: stats.hunger },
    { label: "Happiness", value: stats.happiness },
    { label: "Energy", value: stats.energy },
  ];

  return (
    <main className="app">
      <section className="card">
        <h2 className="pet-name">{petName}</h2>
        <div className="pet-face">{MOOD_EMOJI[mood]}</div>
        <p className="mood-label">{MOOD_LABEL[mood]}</p>

        <div className="stats">
          {rows.map((row) => (
            <div className="stat" key={row.label}>
              <span className="stat-label">{row.label}</span>
              <span className="stat-value">{row.value}</span>
              <div className="bar">
                <div className="fill" style={{ width: row.value + "%" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="actions">
          <button type="button" id="eat-action" onClick={() => perform(PetAction.EAT)}>
            Eat
          </button>
          <button type="button" id="play-action" onClick={() => perform(PetAction.PLAY)}>
            Play
          </button>
          <button type="button" id="sleep-action" onClick={() => perform(PetAction.SLEEP)}>
            Sleep
          </button>
        </div>
      </section>
    </main>
  );
};