import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowRight,
  Apple,
  Bath,
  BatteryCharging,
  Box,
  Brain,
  CalendarDays,
  CalendarCheck2,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Coffee,
  CloudRain,
  DoorOpen,
  Dumbbell,
  Flame,
  Footprints,
  GlassWater,
  HeartPulse,
  HeartHandshake,
  Headphones,
  History,
  Leaf,
  ListChecks,
  LockKeyhole,
  Package,
  Moon,
  PackageCheck,
  Plus,
  RefreshCcw,
  Smile,
  Sparkles,
  Sprout,
  Shirt,
  ShieldCheck,
  Target,
  TimerReset,
  Trophy,
  Trash2,
  Zap,
  Waves
} from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./components/ui/dropdown-menu";
import { Input as UiInput } from "./components/ui/input";
import { Progress } from "./components/ui/progress";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./components/ui/select";
import { Switch } from "./components/ui/switch";
import "./styles.css";

const STORAGE_KEY = "gym-prep-companion-react-v1";

const motivations = [
  {
    id: "mental-clarity",
    label: "Mental clarity",
    guide: "Clear-Mind Sage",
    inspiration: "Yoda-inspired",
    tone: "Calm and grounding",
    icon: Waves,
    guideIcon: Leaf,
    color: "#277568",
    theme: {
      bg: "#eef7f1",
      glow: "#b9d9c8",
      accent: "#d7b95a",
      ink: "#183229"
    },
    font: "Georgia, 'Times New Roman', serif",
    line: "Clear path, clear mind. Prep before the day gets noisy."
  },
  {
    id: "better-energy",
    label: "Better energy",
    guide: "Energy Fighter",
    inspiration: "Goku-inspired",
    tone: "Upbeat and momentum-focused",
    icon: Flame,
    guideIcon: Zap,
    color: "#d55f36",
    theme: {
      bg: "#fff1e3",
      glow: "#ffc267",
      accent: "#2f88d8",
      ink: "#2b1710"
    },
    font: "Impact, Haettenschweiler, 'Arial Black', sans-serif",
    line: "Tomorrow's energy starts with tonight's setup."
  },
  {
    id: "stress-relief",
    label: "Stress relief",
    guide: "Quiet Coach",
    inspiration: "Mr. Miyagi-inspired",
    tone: "Gentle and pressure-reducing",
    icon: Moon,
    guideIcon: Sprout,
    color: "#5f7d89",
    theme: {
      bg: "#edf5f7",
      glow: "#c9dce4",
      accent: "#b7a6d8",
      ink: "#172b32"
    },
    font: "'Trebuchet MS', Verdana, sans-serif",
    line: "Set the bag down early. Carry less in your head."
  },
  {
    id: "strength",
    label: "Strength",
    guide: "Rep Coach",
    inspiration: "Rocky-inspired",
    tone: "Direct and disciplined",
    icon: Dumbbell,
    guideIcon: Trophy,
    color: "#405f91",
    theme: {
      bg: "#eef3fb",
      glow: "#b9c9ea",
      accent: "#c74a41",
      ink: "#111f34"
    },
    font: "'Arial Black', Impact, sans-serif",
    line: "Prep the basics. Show up ready to train."
  },
  {
    id: "health",
    label: "Health",
    guide: "Steady Guide",
    inspiration: "Uncle Iroh-inspired",
    tone: "Practical and sustainable",
    icon: HeartPulse,
    guideIcon: Coffee,
    color: "#6d7d3b",
    theme: {
      bg: "#f5f4e8",
      glow: "#d9d093",
      accent: "#b96d3b",
      ink: "#2b2d17"
    },
    font: "Palatino, 'Palatino Linotype', Georgia, serif",
    line: "Health is built by steady choices. Prepare the next one."
  },
  {
    id: "routine",
    label: "Back to routine",
    guide: "Restart Coach",
    inspiration: "Ted Lasso-inspired",
    tone: "Forgiving and habit-focused",
    icon: TimerReset,
    guideIcon: Smile,
    color: "#98722b",
    theme: {
      bg: "#fff5df",
      glow: "#f0cf73",
      accent: "#5f9bc9",
      ink: "#30210f"
    },
    font: "'Trebuchet MS', Verdana, sans-serif",
    line: "No perfection. Restart with the next planned session."
  }
];

const prepSuggestions = [
  "Pack shoes",
  "Pack clothes",
  "Fill water bottle",
  "Eat early",
  "Protein or snack",
  "Charge headphones",
  "Put bag by door",
  "Pack towel",
  "Pack lock",
  "Shower items"
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullDays = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday"
};

const reminderNudges = {
  "mental-clarity": {
    icon: "🧘",
    Mon: "Clear the path",
    Tue: "Quiet start, clear mind",
    Wed: "Make space to reset",
    Thu: "Less noise, one session",
    Fri: "End clear",
    Sat: "Move, then breathe",
    Sun: "Settle the week"
  },
  "better-energy": {
    icon: "⚡",
    Mon: "Power up the week",
    Tue: "Charge starts now",
    Wed: "Midweek energy hit",
    Thu: "Keep the spark alive",
    Fri: "Finish with fire",
    Sat: "Train like play",
    Sun: "Bank energy early"
  },
  "stress-relief": {
    icon: "🍃",
    Mon: "Release the pressure",
    Tue: "One calm step",
    Wed: "Let the load drop",
    Thu: "Breathe into motion",
    Fri: "Shake off the week",
    Sat: "Easy body, easy mind",
    Sun: "Start softer"
  },
  strength: {
    icon: "🥊",
    Mon: "Show up strong",
    Tue: "Build the base",
    Wed: "Earn the next rep",
    Thu: "Train the promise",
    Fri: "Finish disciplined",
    Sat: "Put in the work",
    Sun: "Ready the comeback"
  },
  health: {
    icon: "🍵",
    Mon: "Choose steady",
    Tue: "Small choice, long game",
    Wed: "Take care today",
    Thu: "Keep it sustainable",
    Fri: "Health gets a vote",
    Sat: "Move for future-you",
    Sun: "Reset with care"
  },
  routine: {
    icon: "👏",
    Mon: "Restart simple",
    Tue: "Keep the thread",
    Wed: "One slot at a time",
    Thu: "Routine over perfect",
    Fri: "Do the next one",
    Sat: "Show up lightly",
    Sun: "Set up the return"
  }
};

const initialState = {
  screen: "start",
  motivationId: "",
  slots: [],
  prepItems: [],
  logs: [],
  userName: "Gymbro",
  onboardingComplete: false,
  reminderSettings: {
    dayBefore: true,
    dayBeforeTime: "20:00",
    sameDay: true,
    sameDayLead: "60"
  }
};

function daysAgo(daysBack) {
  return new Date(Date.now() - daysBack * 86400000).toISOString().slice(0, 10);
}

function makeSlots(entries) {
  return entries.map(([day, time, duration, gym]) => ({
    id: crypto.randomUUID(),
    day,
    time,
    duration,
    gym
  }));
}

function makePrep(labels) {
  return labels.map((label, index) => ({
    id: crypto.randomUUID(),
    label
  }));
}

function wentLog(daysBack, duration, activity, before, after, note = "") {
  return {
    id: crypto.randomUUID(),
    went: true,
    date: daysAgo(daysBack),
    duration,
    activity,
    before,
    after,
    note
  };
}

function missedLog(daysBack, moment, reason, note = "") {
  return {
    id: crypto.randomUUID(),
    went: false,
    date: daysAgo(daysBack),
    moment,
    reason,
    note
  };
}

const sampleDatasets = [
  {
    id: "morning-clarity",
    label: "Morning Clarity",
    description: "Consistent 7 AM campus-gym routine with calm reminders.",
    meta: "Mental clarity",
    icon: Brain,
    color: "#277568",
    create: () => ({
      screen: "home",
      userName: "Maya",
      motivationId: "mental-clarity",
      slots: makeSlots([
        ["Mon", "07:00", 60, "IMA"],
        ["Wed", "07:00", 60, "IMA"],
        ["Fri", "07:00", 60, "IMA"]
      ]),
      prepItems: makePrep(["Pack shoes", "Fill water bottle", "Eat early", "Put bag by door", "Charge headphones"]),
      logs: [
        wentLog(24, 60, "Strength", "Neutral", "Clear-headed", "Full body"),
        wentLog(22, 55, "Cardio", "Tired", "Better than before", "Incline walk"),
        wentLog(20, 60, "Strength", "Stressed", "Clear-headed", "Upper body"),
        wentLog(17, 60, "Strength", "Neutral", "Proud", "Lower body"),
        wentLog(15, 50, "Stretching", "Tired", "Clear-headed", "Mobility"),
        wentLog(13, 60, "Strength", "Neutral", "Clear-headed", "Full body"),
        wentLog(3, 60, "Strength", "Tired", "Clear-headed", "Kept it simple"),
        wentLog(1, 55, "Cardio", "Neutral", "Better than before", "Treadmill")
      ]
    })
  },
  {
    id: "energy-prep-friction",
    label: "Energy Prep Friction",
    description: "Energetic user who misses sessions when food or bag prep fails.",
    meta: "Better energy",
    icon: BatteryCharging,
    color: "#d55f36",
    create: () => ({
      screen: "home",
      userName: "Jordan",
      motivationId: "better-energy",
      slots: makeSlots([
        ["Tue", "07:00", 60, "Apartment gym"],
        ["Thu", "07:00", 60, "Apartment gym"],
        ["Sat", "09:30", 60, "IMA"]
      ]),
      prepItems: makePrep(["Protein or snack", "Pack clothes", "Fill water bottle", "Charge headphones", "Clean clothes"]),
      logs: [
        wentLog(18, 60, "Cardio", "Tired", "Energized", "Bike and core"),
        missedLog(16, "Morning of", "No snack/protein ready", "Skipped after feeling hungry"),
        wentLog(14, 45, "Light workout", "Stressed", "Better than before", "Short session still helped"),
        missedLog(4, "Right before leaving", "Did not want to carry the bag", "Had campus all day"),
        wentLog(2, 60, "Strength", "Neutral", "Energized", "Push day")
      ]
    })
  },
  {
    id: "restart-routine",
    label: "Restart Routine",
    description: "User rebuilding after a break with low-pressure consistency.",
    meta: "Back to routine",
    icon: RefreshCcw,
    color: "#98722b",
    create: () => ({
      screen: "home",
      userName: "Alex",
      motivationId: "routine",
      slots: makeSlots([
        ["Mon", "07:00", 60, "IMA"],
        ["Thu", "07:00", 60, "IMA"]
      ]),
      prepItems: makePrep(["Put bag by door", "Pack shoes", "Fill water bottle", "Eat early"]),
      logs: [
        missedLog(23, "After gym time passed", "Mentally unready", "Fell out of routine"),
        missedLog(16, "During the day", "Other tasks took over", "Assignments ran long"),
        wentLog(9, 30, "Light workout", "Stressed", "Proud", "Restart session"),
        wentLog(5, 45, "Strength", "Neutral", "Better than before", "Simple machines"),
        wentLog(1, 60, "Strength", "Tired", "Proud", "First full session back")
      ]
    })
  },
  {
    id: "strength-after-class",
    label: "After-Class Strength",
    description: "Strength-focused user carrying a gym bag through a long campus day.",
    meta: "Strength",
    icon: ShieldCheck,
    color: "#405f91",
    create: () => ({
      screen: "home",
      userName: "Sam",
      motivationId: "strength",
      slots: makeSlots([
        ["Mon", "17:30", 60, "IMA"],
        ["Wed", "17:30", 60, "IMA"],
        ["Fri", "16:00", 60, "IMA"]
      ]),
      prepItems: makePrep(["Pack shoes", "Pack clothes", "Pack lock", "Fill water bottle", "Protein or snack", "Put bag by door"]),
      logs: [
        wentLog(21, 60, "Strength", "Neutral", "Proud", "Squat day"),
        wentLog(19, 55, "Strength", "Tired", "Proud", "Upper body"),
        missedLog(12, "During the day", "Forgot clothes/items", "Forgot shorts"),
        wentLog(7, 60, "Strength", "Neutral", "Better than before", "Deadlifts"),
        wentLog(2, 60, "Strength", "Tired", "Proud", "Push day")
      ]
    })
  },
  {
    id: "stress-relief-rainy-week",
    label: "Rainy Week Reset",
    description: "Stress-relief user who needs gentle nudges when weather adds friction.",
    meta: "Stress relief",
    icon: CloudRain,
    color: "#5f7d89",
    create: () => ({
      screen: "home",
      userName: "Nina",
      motivationId: "stress-relief",
      slots: makeSlots([
        ["Tue", "18:00", 45, "Apartment gym"],
        ["Thu", "18:00", 45, "Apartment gym"]
      ]),
      prepItems: makePrep(["Pack towel", "Fill water bottle", "Charge headphones", "Rain gear", "Clean clothes"]),
      logs: [
        wentLog(15, 45, "Light workout", "Stressed", "Better than before", "Walk and stretch"),
        missedLog(8, "Right before leaving", "Weather or commute friction", "Rain made it easy to skip"),
        wentLog(6, 40, "Stretching", "Stressed", "Clear-headed", "Mobility"),
        wentLog(1, 45, "Cardio", "Tired", "Better than before", "Easy bike")
      ]
    })
  },
  {
    id: "health-steady-start",
    label: "Steady Health Start",
    description: "Health-focused user building a sustainable twice-a-week baseline.",
    meta: "Health",
    icon: HeartHandshake,
    color: "#6d7d3b",
    create: () => ({
      screen: "home",
      userName: "Priya",
      motivationId: "health",
      slots: makeSlots([
        ["Wed", "07:00", 60, "Community gym"],
        ["Sun", "10:00", 60, "Community gym"]
      ]),
      prepItems: makePrep(["Eat early", "Fill water bottle", "Pack shoes", "Pack towel", "Shower items"]),
      logs: [
        wentLog(20, 50, "Cardio", "Neutral", "Energized", "Zone 2"),
        wentLog(17, 60, "Strength", "Neutral", "Proud", "Machines"),
        wentLog(10, 45, "Light workout", "Tired", "Better than before", "Kept it easy"),
        missedLog(3, "Morning of", "Too tired", "Slept badly"),
        wentLog(0, 60, "Strength", "Neutral", "Proud", "Full body")
      ]
    })
  }
];

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const saved = { ...initialState, ...raw };
    if (!saved.userName || saved.userName === "Shankar") saved.userName = "Gymbro";
    if (!Object.hasOwn(raw, "onboardingComplete")) {
      saved.onboardingComplete = Boolean(raw.slots?.length || raw.prepItems?.length || raw.logs?.length);
    }
    return saved;
  } catch {
    return initialState;
  }
}

function App() {
  const [state, setState] = useState(loadState);
  const [history, setHistory] = useState([]);
  const [selectedDays, setSelectedDays] = useState(["Mon", "Wed"]);
  const [went, setWent] = useState(true);
  const [toast, setToast] = useState(null);

  const motivation = motivations.find((item) => item.id === state.motivationId) || motivations[0];
  const nextSlot = state.slots[0];
  const completedLogs = state.logs.filter((log) => log.went);
  const sessionStreak = getSessionStreak(state.logs);
  const currentWeekCompleted = getCurrentWeekCompleted(state.logs);
  const weeklyStreak = getWeeklyStreak(state.logs, state.slots.length);

  function update(patch) {
    setState((current) => {
      if (patch.screen && patch.screen !== current.screen) {
        setHistory((currentHistory) => [...currentHistory, current.screen].slice(-20));
      }
      const next = { ...current, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function setScreen(screen) {
    update({ screen });
  }

  function goBack() {
    setHistory((currentHistory) => {
      const previous = currentHistory.at(-1);
      if (!previous) return currentHistory;
      setState((current) => {
        const next = { ...current, screen: previous };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return currentHistory.slice(0, -1);
    });
  }

  function addPrep(label) {
    const clean = label.trim();
    if (!clean) return;
    if (state.prepItems.some((item) => item.label.toLowerCase() === clean.toLowerCase())) return;
    update({ prepItems: [...state.prepItems, { id: crypto.randomUUID(), label: clean }] });
  }

  function removePrep(id) {
    update({ prepItems: state.prepItems.filter((item) => item.id !== id) });
  }

  function addSlots(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const time = form.get("time");
    const duration = Number(form.get("duration"));
    const gym = form.get("gym").trim();
    const newSlots = selectedDays.map((day) => ({
      id: crypto.randomUUID(),
      day,
      time,
      duration,
      gym
    }));
    update({ slots: [...state.slots, ...newSlots], screen: "prep" });
  }

  function saveLog(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const log = went
      ? {
          id: crypto.randomUUID(),
          went: true,
          date: form.get("date"),
          duration: Number(form.get("duration")),
          activity: form.get("activity"),
          before: form.get("before"),
          after: form.get("after"),
          note: form.get("note").trim()
        }
      : {
          id: crypto.randomUUID(),
          went: false,
          date: form.get("date"),
          moment: form.get("moment"),
          reason: form.get("reason"),
          note: form.get("missedNote").trim()
        };
    update({ logs: [...state.logs, log], onboardingComplete: true, screen: "progress" });
  }

  function updateReminderSettings(patch) {
    update({ reminderSettings: { ...state.reminderSettings, ...patch } });
  }

  function saveName(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const userName = form.get("userName").trim() || "Gymbro";
    update({ userName, screen: "motivation" });
  }

  async function testReminder(type) {
    const message = buildReminderMessage({
      type,
      nextSlot,
      prepItems: state.prepItems,
      motivation,
      userName: state.userName
    });
    setToast({ title: type === "dayBefore" ? "Day-before test sent" : "Same-day test sent", message });
    window.setTimeout(() => setToast(null), 5200);

    if (!("Notification" in window)) return;
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission === "granted") {
      const notification = new Notification("StreakFit reminder", {
        body: message,
        icon: "/vite.svg"
      });
      notification.onclick = () => {
        window.focus();
        setScreen("prep");
        notification.close();
      };
    }
  }

  function loadSample(sampleId = "morning-clarity") {
    const selectedSample = sampleDatasets.find((sample) => sample.id === sampleId) || sampleDatasets[0];
    const sample = { ...initialState, ...selectedSample.create(), onboardingComplete: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    setState(sample);
    setHistory([]);
  }

  function finishOnboarding(screen = "home") {
    update({ onboardingComplete: true, screen });
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
    setHistory([]);
  }

  const screen = {
    start: (
      <StartScreen
        motivation={motivation}
        userName={state.userName}
        onSubmit={saveName}
      />
    ),
    motivation: (
      <MotivationScreen
        selected={state.motivationId}
        onSelect={(motivationId) => update({ motivationId, screen: "slots" })}
      />
    ),
    slots: (
      <SlotsScreen
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        onSubmit={addSlots}
        slots={state.slots}
        removeSlot={(id) => update({ slots: state.slots.filter((slot) => slot.id !== id) })}
      />
    ),
    prep: (
      <PrepScreen
        items={state.prepItems}
        addPrep={addPrep}
        removePrep={removePrep}
        onNext={() => setScreen("reminders")}
      />
    ),
    home: (
      <HomeScreen
        nextSlot={nextSlot}
        motivation={motivation}
        prepItems={state.prepItems}
        completedLogs={completedLogs}
        logs={state.logs}
        slots={state.slots}
        currentWeekCompleted={currentWeekCompleted}
        weeklyStreak={weeklyStreak}
        go={setScreen}
      />
    ),
    reminders: (
      <RemindersScreen
        nextSlot={nextSlot}
        prepItems={state.prepItems}
        motivation={motivation}
        userName={state.userName}
        settings={state.reminderSettings}
        updateSettings={updateReminderSettings}
        testReminder={testReminder}
        finishOnboarding={finishOnboarding}
        go={setScreen}
      />
    ),
    tracker: <TrackerScreen went={went} setWent={setWent} onSubmit={saveLog} />,
    progress: (
      <ProgressScreen
        logs={state.logs}
        slots={state.slots}
        sessionStreak={sessionStreak}
        currentWeekCompleted={currentWeekCompleted}
        weeklyStreak={weeklyStreak}
        completedLogs={completedLogs}
        motivation={motivation}
      />
    )
  }[state.screen];

  return (
    <main
      className={`app theme-${motivation.id} font-sans antialiased`}
      style={{
        "--guide": motivation.color,
        "--display-font": motivation.font,
        "--theme-bg": motivation.theme.bg,
        "--theme-glow": motivation.theme.glow,
        "--theme-accent": motivation.theme.accent,
        "--theme-ink": motivation.theme.ink
      }}
    >
      <TopBar
        screen={state.screen}
        setScreen={setScreen}
        canGoBack={history.length > 0}
        goBack={goBack}
        loadSample={loadSample}
        reset={reset}
      />
      <section className="hero">
        <GuideCard motivation={motivation} screen={state.screen} state={state} />
        <div className="stage" key={state.screen}>
          {screen}
        </div>
      </section>
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          onOpen={() => {
            setToast(null);
            setScreen("prep");
          }}
        />
      )}
    </main>
  );
}

function TopBar({ screen, setScreen, canGoBack, goBack, loadSample, reset }) {
  const tabs = [
    ["home", "Home", Target],
    ["motivation", "Why", Sparkles],
    ["slots", "Slots", CalendarDays],
    ["prep", "Prep", ListChecks],
    ["reminders", "Remind", Clock3],
    ["tracker", "Log", Activity],
    ["progress", "Stats", Flame]
  ];

  return (
    <header className="topbar">
      <div className="brand-group">
        <Button className="back-button" variant="secondary" size="icon" onClick={goBack} disabled={!canGoBack} aria-label="Go back">
          <ChevronLeft size={19} />
        </Button>
        <Button className="brand-button" variant="ghost" onClick={() => setScreen("start")}>
          <span className="brand-orb"><Dumbbell size={18} /></span>
          <span>StreakFit</span>
        </Button>
      </div>
      <nav className="tabbar">
        {tabs.map(([id, label, Icon]) => (
          <Button className={screen === id ? "active" : ""} variant="ghost" size="sm" key={id} onClick={() => setScreen(id)}>
            <Icon size={17} />
            <span>{label}</span>
          </Button>
        ))}
      </nav>
      <div className="top-actions">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="tiny-button" variant="secondary" size="sm">Samples</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="sample-menu" align="end">
            {sampleDatasets.map((sample) => {
              const SampleIcon = sample.icon;
              return (
                <DropdownMenuItem
                  className="sample-menu-item"
                  key={sample.id}
                  style={{ "--sample": sample.color }}
                  onClick={() => loadSample(sample.id)}
                >
                  <span className="sample-icon"><SampleIcon size={18} /></span>
                  <span className="sample-copy">
                    <strong>{sample.label}</strong>
                    <small>{sample.meta}</small>
                    <span>{sample.description}</span>
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="tiny-button danger" variant="destructive" size="sm" onClick={reset}>Reset</Button>
      </div>
    </header>
  );
}

function GuideCard({ motivation, screen, state }) {
  const copy = getGuideCopy(screen, motivation, state);
  const progress = getScreenProgress(screen);
  const currentStep = progress.step || 1;
  const showOnboardingProgress = !state.onboardingComplete && isOnboardingScreen(screen);
  return (
    <aside className="guide-card">
      <div className="guide-topline">
        <span>{progress.label}</span>
        {showOnboardingProgress && <strong>{currentStep}/6</strong>}
      </div>
      <div className="mascot-scene">
        <div className="guide-orbit orbit-one" />
        <div className="guide-orbit orbit-two" />
        <CharacterAvatar motivationId={motivation.id} />
        <div className="spark s1" />
        <div className="spark s2" />
        <div className="spark s3" />
      </div>
      <div className="guide-copy">
        <p className="kicker">{motivation.inspiration}</p>
        <h1>{motivation.guide}</h1>
        <p className="guide-bubble">{copy}</p>
      </div>
      {showOnboardingProgress && (
        <div className="guide-stepper" aria-label="Onboarding progress">
          <Progress value={(currentStep / 6) * 100} />
        </div>
      )}
      <div className="guide-stats">
        <span><CalendarDays size={15} /> {state.slots.length} slots</span>
        <span><PackageCheck size={15} /> {state.prepItems.length} prep</span>
        <span><Activity size={15} /> {state.logs.length} logs</span>
      </div>
      <div className="guide-meta">
        <Badge>{getCharacterEmoji(motivation.id)} {motivation.label}</Badge>
        <Badge variant="outline">✦ {motivation.tone}</Badge>
      </div>
    </aside>
  );
}

function CharacterAvatar({ motivationId }) {
  return (
    <div className={`character-avatar ${motivationId}`} aria-hidden="true">
      <div className="character-aura" />
      <div className="character-hair">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="character-ears">
        <span />
        <span />
      </div>
      <div className="character-head">
        <span className="eye left" />
        <span className="eye right" />
        <span className="brow left" />
        <span className="brow right" />
        <span className="mouth" />
        <span className="mustache" />
      </div>
      <div className="character-body">
        <span className="gi-belt" />
        <span className="glove left" />
        <span className="glove right" />
        <span className="tea-cup" />
        <span className="whistle" />
      </div>
    </div>
  );
}

function StartScreen({ userName, onSubmit }) {
  return (
    <div className="screen intro-screen">
      <div className="intro-hero">
        <h2>Your gym streak starts before you leave.</h2>
      </div>
      <div className="feature-strip">
        <MiniFeature icon={CalendarDays} label="Pick days" />
        <MiniFeature icon={PackageCheck} label="Save prep" />
        <MiniFeature icon={Clock3} label="Get nudged" />
        <MiniFeature icon={Flame} label="Keep streaks" />
      </div>
      <form className="name-card" onSubmit={onSubmit}>
        <Input label="What should your guide call you?" name="userName" defaultValue={userName || "Gymbro"} placeholder="Gymbro" />
        <Button>Continue <ArrowRight size={18} /></Button>
      </form>
    </div>
  );
}

function MotivationScreen({ selected, onSelect }) {
  return (
    <div className="screen">
      <ScreenTitle eyebrow="Step 2" title="Choose your reason." subtitle="This chooses your guide style and reminder tone." />
      <div className="motivation-grid">
        {motivations.map((motivation) => {
          const Icon = motivation.icon;
          return (
            <Button
              className={`motivation-card ${selected === motivation.id ? "selected" : ""}`}
              key={motivation.id}
              style={{ "--card": motivation.color }}
              onClick={() => onSelect(motivation.id)}
              variant="ghost"
            >
              <span className="icon-badge"><Icon size={22} /></span>
              <strong>{motivation.label}</strong>
              <small>{motivation.guide}</small>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function SlotsScreen({ selectedDays, setSelectedDays, onSubmit, slots, removeSlot }) {
  function toggleDay(day) {
    setSelectedDays((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day]));
  }

  return (
    <div className="screen">
      <ScreenTitle eyebrow="Step 3" title="Commit days in one tap." subtitle="Select multiple days, then apply one time and duration to all." />
      <form className="slot-form" onSubmit={onSubmit}>
        <div className="day-pills">
          {days.map((day) => (
            <Button
              className={selectedDays.includes(day) ? "selected" : ""}
              type="button"
              key={day}
              onClick={() => toggleDay(day)}
              variant="secondary"
            >
              {day}
            </Button>
          ))}
        </div>
        <div className="input-row">
          <Input label="Time" name="time" type="time" defaultValue="07:00" />
          <Input label="Minutes" name="duration" type="number" defaultValue="60" min="10" />
          <Input label="Gym" name="gym" placeholder="IMA" />
          <Button disabled={!selectedDays.length}>Add</Button>
        </div>
      </form>
      <CardList empty="No gym slots yet.">
        {slots.map((slot) => (
          <div className="slot-card" key={slot.id}>
            <div>
              <strong>{fullDays[slot.day]} at {formatTime(slot.time)}</strong>
              <span>{slot.duration} min {slot.gym ? `at ${slot.gym}` : ""}</span>
            </div>
            <Button className="icon-action" variant="ghost" size="icon" onClick={() => removeSlot(slot.id)}><Trash2 size={16} /></Button>
          </div>
        ))}
      </CardList>
    </div>
  );
}

function PrepScreen({ items, addPrep, removePrep, onNext }) {
  const [custom, setCustom] = useState("");

  function submit(event) {
    event.preventDefault();
    addPrep(custom);
    setCustom("");
  }

  return (
    <div className="screen">
      <ScreenTitle eyebrow="Step 4" title="Build your prep ritual." subtitle="Capture what you want to pack or do. Reminders reuse this exact list." />
      <form className="custom-prep" onSubmit={submit}>
        <input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="Add your own: eat banana, fill bottle, pack straps" />
        <Button>Add</Button>
      </form>
      <div className="prep-chip-grid">
        {prepSuggestions.map((item) => (
          <PrepChip key={item} label={item} selected={items.some((prep) => prep.label === item)} addPrep={addPrep} removePrep={removePrep} items={items} />
        ))}
        {items
          .filter((item) => !prepSuggestions.includes(item.label))
          .map((item) => (
            <PrepChip key={item.id} label={item.label} selected addPrep={addPrep} removePrep={removePrep} items={items} />
          ))}
      </div>
      <div className="action-row">
        <Button onClick={onNext}>Set reminders <ArrowRight size={18} /></Button>
      </div>
    </div>
  );
}

function PrepChip({ label, selected, addPrep, removePrep, items }) {
  function toggle() {
    if (selected) {
      const item = items.find((prep) => prep.label === label);
      if (item) removePrep(item.id);
    } else {
      addPrep(label);
    }
  }

  return (
    <Button className={`prep-chip ${selected ? "selected" : ""}`} variant="secondary" type="button" onClick={toggle}>
      <span><PrepItemIcon label={label} size={16} /></span>
      {label}
    </Button>
  );
}

function HomeScreen({ nextSlot, motivation, prepItems, completedLogs, logs, slots, currentWeekCompleted, weeklyStreak, go }) {
  const recentLogs = [...logs].reverse().slice(0, 3);

  return (
    <div className="screen">
      <ScreenTitle eyebrow="Home" title="Next session, less friction." subtitle={motivation.line} />
      <div className="home-grid">
        <Button className="big-action" variant="secondary" onClick={() => go("prep")}>
          <PackageCheck size={32} />
          <span>Prep list</span>
          <strong>{prepItems.length} items</strong>
        </Button>
        <Button className="big-action" variant="secondary" onClick={() => go("tracker")}>
          <Activity size={32} />
          <span>Log session</span>
          <strong>{completedLogs.length} done</strong>
        </Button>
      </div>
      <div className="next-card">
        <Clock3 size={24} />
        <div>
          <span>Next planned workout</span>
          <strong>{nextSlot ? `${fullDays[nextSlot.day]} at ${formatTime(nextSlot.time)}` : "No slot yet"}</strong>
          <small>{nextSlot ? `${nextSlot.duration} min ${nextSlot.gym ? `at ${nextSlot.gym}` : ""}` : "Add your days first."}</small>
        </div>
      </div>
      <div className="stat-row">
        <Stat label="Planned this week" value={slots.length} icon={CalendarDays} />
        <Stat label="Completed this week" value={currentWeekCompleted} icon={CheckCircle2} />
        <Stat label="Weekly streak" value={weeklyStreak} icon={Flame} />
      </div>
      <div className="home-history">
        <div className="section-label">
          <span>Recent logs</span>
          <Button variant="secondary" size="sm" onClick={() => go("progress")}>View all</Button>
        </div>
        <CardList empty="No logs yet. Log your first session.">
          {recentLogs.map((log) => (
            <div className="log-card" key={log.id}>
              <Badge variant={log.went ? "success" : "miss"}>{log.went ? "Went" : "Missed"}</Badge>
              <div>
                <strong>{log.date}</strong>
                <small>
                  {log.went
                    ? `${log.duration} min ${log.activity} · ${log.before} to ${log.after}`
                    : `${log.moment} · ${log.reason}`}
                </small>
              </div>
            </div>
          ))}
        </CardList>
      </div>
      <div className="action-row">
        <Button variant="secondary" onClick={() => go("reminders")}>Preview reminders</Button>
        <Button variant="secondary" onClick={() => go("slots")}>Edit slots</Button>
      </div>
    </div>
  );
}

function RemindersScreen({ nextSlot, prepItems, motivation, userName, settings, updateSettings, testReminder, finishOnboarding, go }) {
  return (
    <div className="screen">
      <ScreenTitle eyebrow="Step 5" title="Set up nudges." subtitle="Choose when StreakFit should remind you to prep." />
      <div className="reminder-settings">
        <div className="reminder-setting-card">
          <label className="toggle-row">
            <Switch
              checked={settings.dayBefore}
              onCheckedChange={(checked) => updateSettings({ dayBefore: checked })}
            />
            <span>Day-before reminder</span>
          </label>
          <Input
            label="Send around"
            name="dayBeforeTime"
            type="time"
            value={settings.dayBeforeTime}
            onChange={(event) => updateSettings({ dayBeforeTime: event.target.value })}
          />
          <Button type="button" onClick={() => testReminder("dayBefore")}>Test day-before</Button>
        </div>
        <div className="reminder-setting-card">
          <label className="toggle-row">
            <Switch
              checked={settings.sameDay}
              onCheckedChange={(checked) => updateSettings({ sameDay: checked })}
            />
            <span>Same-day reminder</span>
          </label>
          <Select
            label="Before workout"
            name="sameDayLead"
            value={settings.sameDayLead}
            onChange={(event) => updateSettings({ sameDayLead: event.target.value })}
            options={[
              ["30", "30 mins before"],
              ["60", "60 mins before"],
              ["120", "2 hours before"]
            ]}
          />
          <Button type="button" onClick={() => testReminder("sameDay")}>Test same-day</Button>
        </div>
      </div>
      <div className="action-row">
        <Button onClick={() => go("tracker")}>Open tracker <ArrowRight size={18} /></Button>
        <Button variant="secondary" onClick={() => finishOnboarding("home")}>Go home</Button>
      </div>
    </div>
  );
}

function TrackerScreen({ went, setWent, onSubmit }) {
  return (
    <div className="screen">
      <ScreenTitle eyebrow="Step 6" title="Log what happened." subtitle="Date first. Then the form adapts to whether you went." />
      <form className="tracker-form" onSubmit={onSubmit}>
        <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        <div className="went-toggle">
          <Button type="button" variant="secondary" className={went ? "selected" : ""} onClick={() => setWent(true)}><CheckCircle2 size={18} /> I went</Button>
          <Button type="button" variant="secondary" className={!went ? "selected" : ""} onClick={() => setWent(false)}><TimerReset size={18} /> I missed it</Button>
        </div>
        {went ? <WentFields /> : <MissedFields />}
        <Button>Save log</Button>
      </form>
    </div>
  );
}

function WentFields() {
  return (
    <div className="form-card">
      <Input label="Duration (mins)" name="duration" type="number" defaultValue="60" min="0" />
      <Select label="What did you do?" name="activity" options={["Strength", "Cardio", "Stretching", "Sports", "Light workout", "Custom"]} />
      <Select label="Before" name="before" options={["Tired", "Stressed", "Neutral", "Energized", "Clear-headed", "Proud"]} />
      <Select label="After" name="after" options={["Energized", "Clear-headed", "Proud", "Better than before", "Neutral", "Frustrated"]} />
      <Input label="Note" name="note" placeholder="Upper body, treadmill, short session..." />
    </div>
  );
}

function MissedFields() {
  return (
    <div className="form-card">
      <Select label="When did the plan break?" name="moment" options={["Night before", "Morning of", "During the day", "Right before leaving", "After gym time passed", "Not sure"]} />
      <Select label="What got in the way?" name="reason" options={["Did not prep", "Forgot clothes/items", "Did not eat early", "No snack/protein ready", "Did not want to carry the bag", "Mentally unready", "Too tired", "Other tasks took over", "Weather or commute friction", "Other"]} />
      <Input label="Optional note" name="missedNote" placeholder="What should the next reminder help with?" />
    </div>
  );
}

function ProgressScreen({ logs, slots, sessionStreak, currentWeekCompleted, weeklyStreak, completedLogs, motivation }) {
  return (
    <div className="screen">
      <ScreenTitle eyebrow="Progress" title="Small wins, visible." subtitle={motivation.line} />
      <div className="progress-sections">
        <section className="progress-panel weekly-panel">
          <PanelHeading icon={CalendarCheck2} eyebrow="This week" title="Current weekly routine" />
          <div className="stat-row">
            <Stat label="Planned" value={slots.length} icon={CalendarDays} />
            <Stat label="Completed" value={currentWeekCompleted} icon={CheckCircle2} />
            <Stat label="Weekly streak" value={weeklyStreak} icon={Flame} />
          </div>
        </section>
        <section className="progress-panel alltime-panel">
          <PanelHeading icon={ChartNoAxesCombined} eyebrow="Up to date" title="Everything logged so far" />
          <div className="stat-row secondary-stats">
            <Stat label="Total completed" value={completedLogs.length} icon={Dumbbell} />
            <Stat label="Session streak" value={sessionStreak} icon={Zap} />
          </div>
        </section>
        <section className="progress-panel log-panel">
          <PanelHeading icon={History} eyebrow="History" title="Session log" />
          <CardList empty="No logs yet. Log your first session.">
            {[...logs].reverse().map((log) => (
              <div className="log-card" key={log.id}>
                <Badge variant={log.went ? "success" : "miss"}>{log.went ? "Went" : "Missed"}</Badge>
                <div>
                  <strong>{log.date}</strong>
                  <small>
                    {log.went
                      ? `${log.duration} min ${log.activity} · ${log.before} to ${log.after}`
                      : `${log.moment} · ${log.reason}`}
                  </small>
                  {log.note && <small>{log.note}</small>}
                </div>
              </div>
            ))}
          </CardList>
        </section>
      </div>
    </div>
  );
}

function ScreenTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="screen-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function MiniFeature({ icon: Icon, label }) {
  return (
    <div className="mini-feature">
      <span className="feature-icon"><Icon size={18} /></span>
      <span>{label}</span>
    </div>
  );
}

function PanelHeading({ icon: Icon, eyebrow, title }) {
  return (
    <div className="panel-heading">
      <span><Icon size={18} /></span>
      <div>
        <small>{eyebrow}</small>
        <strong>{title}</strong>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="input-field">
      <span>{label}</span>
      <UiInput {...props} />
    </label>
  );
}

function Select({ label, name, options, ...props }) {
  const { onChange, value, defaultValue } = props;
  const firstOption = options[0];
  const fallbackValue = Array.isArray(firstOption) ? firstOption[0] : firstOption;
  function handleValueChange(nextValue) {
    onChange?.({ target: { name, value: nextValue } });
  }

  return (
    <label className="input-field">
      <span>{label}</span>
      <UiSelect name={name} value={value} defaultValue={defaultValue ?? (value === undefined ? fallbackValue : undefined)} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
        {options.map((option) => {
          const value = Array.isArray(option) ? option[0] : option;
          const optionLabel = Array.isArray(option) ? option[1] : option;
          return <SelectItem key={value} value={value}>{optionLabel}</SelectItem>;
        })}
        </SelectContent>
      </UiSelect>
    </label>
  );
}

function ReminderCard({ label, icon: Icon, children, onClick }) {
  return (
    <button className="reminder-card" type="button" onClick={onClick}>
      <span><Icon size={18} /> {label}</span>
      <p>{children}</p>
      <small>Tap to open prep list</small>
    </button>
  );
}

function Toast({ title, message, onClose, onOpen }) {
  return (
    <Card className="toast" role="status" onClick={onOpen}>
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
        <small>Click to open prep list</small>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Close reminder test"
      >
        x
      </Button>
    </Card>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <Card className="stat-card">
      {Icon && <span className="stat-icon"><Icon size={19} /></span>}
      <strong>{value}</strong>
      <span>{label}</span>
    </Card>
  );
}

function CardList({ children, empty }) {
  const hasChildren = React.Children.count(children) > 0;
  return <div className="card-list">{hasChildren ? children : <div className="empty">{empty}</div>}</div>;
}

function getGuideCopy(screen, motivation, state) {
  if (screen === "start") return "I keep the prep simple: choose days, save what to bring, then follow the nudge.";
  if (screen === "motivation") return "Pick the reason. I will match the tone and reminders to that.";
  if (screen === "slots") return "You choose the gym time. I only help you protect the routine.";
  if (screen === "prep" && state.prepItems.length) return "Good. I will reuse this list in your reminders.";
  if (screen === "tracker") return "Quick log. No guilt. The pattern is the point.";
  if (screen === "reminders") return "I use your prep list, not a generic script.";
  if (state.logs.length && screen === "progress") return "Look at the pattern. Then make the next start easier.";
  return motivation.line;
}

function getScreenProgress(screen) {
  return {
    start: { step: 1, label: "Intro" },
    motivation: { step: 2, label: "Reason" },
    slots: { step: 3, label: "Days" },
    prep: { step: 4, label: "Prep" },
    reminders: { step: 5, label: "Nudges" },
    tracker: { step: 6, label: "Log" },
    home: { step: 6, label: "Home" },
    progress: { step: 6, label: "Stats" }
  }[screen] || { step: 1, label: "Intro" };
}

function isOnboardingScreen(screen) {
  return ["start", "motivation", "slots", "prep", "reminders", "tracker"].includes(screen);
}

function buildReminderMessage({ type, nextSlot, prepItems, motivation, userName = "Gymbro" }) {
  const day = nextSlot?.day || getTodayShortDay();
  const messageSet = reminderNudges[motivation.id] || reminderNudges["mental-clarity"];
  const nudge = messageSet[day] || motivation.line;
  const icon = messageSet.icon || "✨";
  const when = type === "dayBefore" ? "Tomorrow" : nextSlot ? fullDays[day] : "Soon";
  const time = nextSlot ? formatCompactTime(nextSlot.time) : "";

  return `${nudge} ${userName || "Gymbro"}! ${icon} Gym ${when}${time ? ` @ ${time}` : ""}`;
}

function getTodayShortDay() {
  return days[(new Date().getDay() + 6) % 7];
}

function getCharacterEmoji(motivationId) {
  return {
    "mental-clarity": "🧘",
    "better-energy": "⚡",
    "stress-relief": "🍃",
    strength: "🥊",
    health: "🍵",
    routine: "👏"
  }[motivationId] || "✨";
}

function PrepItemIcon({ label, size = 16 }) {
  const Icon = getPrepIcon(label);
  return <Icon size={size} strokeWidth={2.5} />;
}

function getPrepIcon(label) {
  const text = label.toLowerCase();
  if (text.includes("shoe")) return Footprints;
  if (text.includes("cloth") || text.includes("shirt")) return Shirt;
  if (text.includes("water") || text.includes("bottle")) return GlassWater;
  if (text.includes("eat") || text.includes("banana") || text.includes("snack") || text.includes("protein")) return Apple;
  if (text.includes("headphone") || text.includes("charge")) return Headphones;
  if (text.includes("door")) return DoorOpen;
  if (text.includes("bag")) return Package;
  if (text.includes("towel") || text.includes("shower")) return Bath;
  if (text.includes("lock")) return LockKeyhole;
  return Box;
}

function getSessionStreak(logs) {
  let streak = 0;
  for (let i = logs.length - 1; i >= 0; i -= 1) {
    if (!logs[i].went) break;
    streak += 1;
  }
  return streak;
}

function getWeekStart(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getWeekKey(dateValue) {
  return getWeekStart(dateValue).toISOString().slice(0, 10);
}

function getCurrentWeekCompleted(logs) {
  const currentWeekKey = getWeekKey(new Date().toISOString().slice(0, 10));
  return logs.filter((log) => log.went && getWeekKey(log.date) === currentWeekKey).length;
}

function getWeeklyStreak(logs, plannedPerWeek) {
  if (!plannedPerWeek) return 0;

  const completedByWeek = logs.reduce((acc, log) => {
    if (!log.went) return acc;
    const key = getWeekKey(log.date);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  let weekStart = getWeekStart(new Date().toISOString().slice(0, 10));
  let streak = 0;

  while (completedByWeek[weekStart.toISOString().slice(0, 10)] >= plannedPerWeek) {
    streak += 1;
    weekStart.setDate(weekStart.getDate() - 7);
  }

  return streak;
}

function formatTime(value) {
  const [hourRaw, minute] = value.split(":");
  const hour = Number(hourRaw);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minute} ${suffix}`;
}

function formatCompactTime(value) {
  const [hourRaw, minute] = value.split(":");
  const hour = Number(hourRaw);
  const suffix = hour >= 12 ? "pm" : "am";
  const displayHour = hour % 12 || 12;
  return minute === "00" ? `${displayHour}${suffix}` : `${displayHour}:${minute}${suffix}`;
}

createRoot(document.getElementById("root")).render(<App />);
