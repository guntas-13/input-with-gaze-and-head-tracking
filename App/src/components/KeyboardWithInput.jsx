import React, { useEffect, useRef, useState } from "react";
import "./KeyboardWithInput.css";
import "./Keyboard.css";
import BackspaceIcon from "../icons/backspace-32.svg";
import SpeakerIcon from "../icons/speaker.png";
import popSound from "../sounds/ui-pop-sound-316482.mp3";

// Import all keyboard icons
import MySelfIcon from "../icons/myself_10012465.png";
import ExitIcon from "../icons/exit.png";
import QuestionIcon from "../icons/question-mark.png";
import PlaceIcon from "../icons/place.png";
import PhoneIcon from "../icons/phone-call.png";
import ClockIcon from "../icons/wall-clock_5378485.png";
import HomeIcon from "../icons/home.png";
import EatIcon from "../icons/binge-eating.png";
import LikeIcon from "../icons/like.png";
import RainbowIcon from "../icons/rainbow_10129397.png";
import DrinkIcon from "../icons/soda_1652494.png";
import PlayIcon from "../icons/rc-car.png";
import StopIcon from "../icons/stop_5181609.png";
import AlphabetIcon from "../icons/alphabet.png";
import CancelIcon from "../icons/cancel_1721955.png";
import SmileIcon from "../icons/smile_9350598.png";
import CheckIcon from "../icons/check-mark_5299048.png";
import VideoIcon from "../icons/video.png";
import BicycleIcon from "../icons/bicycle.png";
import GameIcon from "../icons/game-console.png";
import PuzzleIcon from "../icons/jigsaw.png";
import BoardGameIcon from "../icons/board-game.png";
import CrayonsIcon from "../icons/crayons.png";
import LegosIcon from "../icons/construction.png";
import SportsIcon from "../icons/sports.png";
import BallIcon from "../icons/beach-ball.png";
import CarsIcon from "../icons/rc-car.png";
import SwingIcon from "../icons/swing.png";
import PeopleIcon from "../icons/ancestors.png";
import HurtIcon from "../icons/hurt.png";
import NeedIcon from "../icons/need.png";
import BuyIcon from "../icons/cash.png";
import LoveIcon from "../icons/love.png";
import ToCallIcon from "../icons/phone-call.png";
import ListenIcon from "../icons/listen.png";

const DWELL_TIME = 3000; // 3 seconds for keyboard keys
const BACKSPACE_DWELL_TIME = 2000; // 2 seconds for backspace

// Define different keyboard layouts
const KEYBOARD_LAYOUTS = {
  default: [
    { id: "i", label: "i", type: "pronoun", color: "#fff4d6" },
    {
      id: "questions",
      label: "QUESTIONS",
      icon: QuestionIcon,
      type: "category",
      color: "#b3e5fc",
    },
    {
      id: "places",
      label: "PLACES",
      icon: PlaceIcon,
      type: "category",
      color: "#f5f5f5",
    },
    {
      id: "social",
      label: "SOCIAL",
      icon: PhoneIcon,
      type: "category",
      color: "#f5f5f5",
    },
    {
      id: "time",
      label: "TIME",
      icon: ClockIcon,
      type: "category",
      color: "#ffd699",
    },
    {
      id: "exit",
      label: "EXIT",
      icon: ExitIcon,
      type: "action",
      color: "#ffccbc",
    },
    {
      id: "my",
      label: "my",
      icon: MySelfIcon,
      type: "pronoun",
      color: "#fff4d6",
    },
    { id: "can", label: "can", type: "verb", color: "#f5f5f5" },
    { id: "to", label: "to", type: "preposition", color: "#f5f5f5" },
    { id: "eat", label: "eat", icon: EatIcon, type: "verb", color: "#c8e6c9" },
    {
      id: "good",
      label: "good",
      icon: LikeIcon,
      type: "adjective",
      color: "#e1bee7",
    },
    {
      id: "describe",
      label: "DESCRIBE",
      icon: RainbowIcon,
      type: "category",
      color: "#e1bee7",
    },
    { id: "you", label: "you", type: "pronoun", color: "#fff4d6" },
    { id: "do", label: "do", type: "verb", color: "#f5f5f5" },
    {
      id: "drink",
      label: "drink",
      icon: DrinkIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "play",
      label: "play",
      icon: PlayIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "stop",
      label: "stop",
      icon: StopIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "vocab",
      label: "VOCAB",
      icon: AlphabetIcon,
      type: "category",
      color: "#80deea",
    },
    { id: "it", label: "it", type: "pronoun", color: "#fff4d6" },
    {
      id: "dont",
      label: "don't",
      icon: CancelIcon,
      type: "verb",
      color: "#ffcdd2",
    },
    {
      id: "like",
      label: "like",
      icon: SmileIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "yes",
      label: "yes",
      icon: CheckIcon,
      type: "response",
      color: "#c8e6c9",
    },
    {
      id: "watch",
      label: "watch",
      icon: VideoIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    { id: "clear", label: "clear", type: "action", color: "#f5f5f5" },
  ],
  afterI: [
    { id: "would", label: "would", type: "verb", color: "#f5f5f5" },
    { id: "am", label: "am", type: "verb", color: "#f5f5f5" },
    { id: "have", label: "have", type: "verb", color: "#f5f5f5" },
    { id: "got", label: "got", type: "verb", color: "#f5f5f5" },
    {
      id: "social",
      label: "SOCIAL",
      icon: PeopleIcon,
      type: "category",
      color: "#f5f5f5",
    },
    {
      id: "home",
      label: "HOME",
      icon: HomeIcon,
      type: "action",
      color: "#ffccbc",
    },
    { id: "could", label: "could", type: "verb", color: "#f5f5f5" },
    { id: "can", label: "can", type: "verb", color: "#f5f5f5" },
    { id: "m", label: "'m", type: "verb", color: "#f5f5f5" },
    { id: "eat", label: "eat", icon: EatIcon, type: "verb", color: "#c8e6c9" },
    {
      id: "hurt",
      label: "hurt",
      icon: HurtIcon,
      type: "verb",
      color: "#ffcdd2",
    },
    {
      id: "need",
      label: "need",
      icon: NeedIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    { id: "will", label: "will", type: "verb", color: "#f5f5f5" },
    { id: "do", label: "do", type: "verb", color: "#f5f5f5" },
    {
      id: "drink",
      label: "drink",
      icon: DrinkIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "play",
      label: "play",
      icon: PlayIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "stop",
      label: "stop",
      icon: StopIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    { id: "buy", label: "buy", icon: BuyIcon, type: "verb", color: "#c8e6c9" },
    { id: "was", label: "was", type: "verb", color: "#f5f5f5" },
    {
      id: "dont",
      label: "don't",
      icon: CancelIcon,
      type: "verb",
      color: "#ffcdd2",
    },
    {
      id: "like",
      label: "like",
      icon: SmileIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "love",
      label: "love",
      icon: LoveIcon,
      type: "verb",
      color: "#ffb3ba",
    },
    {
      id: "watch",
      label: "watch",
      icon: VideoIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    { id: "clear", label: "clear", type: "action", color: "#f5f5f5" },
  ],
  afterILike: [
    { id: "i", label: "i", type: "pronoun", color: "#fff4d6" },
    {
      id: "questions",
      label: "QUESTIONS",
      icon: QuestionIcon,
      type: "category",
      color: "#b3e5fc",
    },
    {
      id: "places",
      label: "PLACES",
      icon: PlaceIcon,
      type: "category",
      color: "#f5f5f5",
    },
    {
      id: "people",
      label: "PEOPLE",
      icon: PeopleIcon,
      type: "category",
      color: "#f5f5f5",
    },
    {
      id: "time",
      label: "TIME",
      icon: ClockIcon,
      type: "category",
      color: "#ffd699",
    },
    {
      id: "home",
      label: "HOME",
      icon: HomeIcon,
      type: "action",
      color: "#ffccbc",
    },
    {
      id: "my",
      label: "my",
      icon: MySelfIcon,
      type: "pronoun",
      color: "#fff4d6",
    },
    { id: "todo", label: "to do", type: "verb", color: "#f5f5f5" },
    { id: "tohave", label: "to have", type: "verb", color: "#f5f5f5" },
    {
      id: "toeat",
      label: "to eat",
      icon: EatIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "tocall",
      label: "to call",
      icon: ToCallIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "describe",
      label: "DESCRIBE",
      icon: RainbowIcon,
      type: "category",
      color: "#e1bee7",
    },
    { id: "you", label: "you", type: "pronoun", color: "#fff4d6" },
    { id: "ed", label: "-ed", type: "suffix", color: "#f5f5f5" },
    {
      id: "todrink",
      label: "to drink",
      icon: DrinkIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "toplay",
      label: "to play",
      icon: PlayIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "tostop",
      label: "to stop",
      icon: StopIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "vocab",
      label: "VOCAB",
      icon: AlphabetIcon,
      type: "category",
      color: "#80deea",
    },
    { id: "it", label: "it", type: "pronoun", color: "#fff4d6" },
    { id: "s", label: "-s", type: "suffix", color: "#f5f5f5" },
    {
      id: "tolike",
      label: "to like",
      icon: SmileIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "tolisten",
      label: "to listen",
      icon: ListenIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    {
      id: "towatch",
      label: "to watch",
      icon: VideoIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    { id: "clear", label: "clear", type: "action", color: "#f5f5f5" },
  ],
  vocab: [
    { id: "i", label: "i", type: "pronoun", color: "#fff4d6" },
    { id: "to", label: "to", type: "preposition", color: "#f5f5f5" },
    { id: "a", label: "a", type: "article", color: "#f5f5f5" },
    {
      id: "bicycle",
      label: "bicycle",
      icon: BicycleIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "videogame",
      label: "video game",
      icon: GameIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "home",
      label: "HOME",
      icon: HomeIcon,
      type: "action",
      color: "#ffccbc",
    },
    {
      id: "my",
      label: "my",
      icon: MySelfIcon,
      type: "pronoun",
      color: "#fff4d6",
    },
    { id: "ed", label: "-ed", type: "suffix", color: "#f5f5f5" },
    { id: "and", label: "and", type: "conjunction", color: "#f5f5f5" },
    {
      id: "puzzle",
      label: "puzzle",
      icon: PuzzleIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "boardgame",
      label: "board game",
      icon: BoardGameIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "colors",
      label: "colors",
      icon: RainbowIcon,
      type: "category",
      color: "#e1bee7",
    },
    {
      id: "me",
      label: "me",
      icon: MySelfIcon,
      type: "pronoun",
      color: "#fff4d6",
    },
    { id: "ing", label: "-ing", type: "suffix", color: "#f5f5f5" },
    {
      id: "crayons",
      label: "crayons",
      icon: CrayonsIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "legos",
      label: "legos",
      icon: LegosIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "sports",
      label: "sports",
      icon: SportsIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "ball",
      label: "ball",
      icon: BallIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    { id: "you", label: "you", type: "pronoun", color: "#fff4d6" },
    { id: "s", label: "-s", type: "suffix", color: "#f5f5f5" },
    {
      id: "cars",
      label: "cars",
      icon: CarsIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "swing",
      label: "swing",
      icon: SwingIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "watch",
      label: "watch",
      icon: VideoIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    { id: "clear", label: "clear", type: "action", color: "#f5f5f5" },
  ],
  afterILikeToPlay: [
    { id: "i", label: "i", type: "pronoun", color: "#fff4d6" },
    { id: "to", label: "to", type: "preposition", color: "#f5f5f5" },
    { id: "a", label: "a", type: "article", color: "#f5f5f5" },
    {
      id: "bicycle",
      label: "bicycle",
      icon: BicycleIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "videogame",
      label: "video game",
      icon: GameIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "home",
      label: "HOME",
      icon: HomeIcon,
      type: "action",
      color: "#ffccbc",
    },
    {
      id: "my",
      label: "my",
      icon: MySelfIcon,
      type: "pronoun",
      color: "#fff4d6",
    },
    { id: "ed", label: "-ed", type: "suffix", color: "#f5f5f5" },
    { id: "and", label: "and", type: "conjunction", color: "#f5f5f5" },
    {
      id: "puzzle",
      label: "puzzle",
      icon: PuzzleIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "boardgame",
      label: "board game",
      icon: BoardGameIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "colors",
      label: "colors",
      icon: RainbowIcon,
      type: "category",
      color: "#e1bee7",
    },
    {
      id: "me",
      label: "me",
      icon: MySelfIcon,
      type: "pronoun",
      color: "#fff4d6",
    },
    { id: "ing", label: "-ing", type: "suffix", color: "#f5f5f5" },
    {
      id: "crayons",
      label: "crayons",
      icon: CrayonsIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "legos",
      label: "legos",
      icon: LegosIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "sports",
      label: "sports",
      icon: SportsIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "ball",
      label: "ball",
      icon: BallIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    { id: "you", label: "you", type: "pronoun", color: "#fff4d6" },
    { id: "s", label: "-s", type: "suffix", color: "#f5f5f5" },
    {
      id: "cars",
      label: "cars",
      icon: CarsIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "swing",
      label: "swing",
      icon: SwingIcon,
      type: "noun",
      color: "#c8e6c9",
    },
    {
      id: "watch",
      label: "watch",
      icon: VideoIcon,
      type: "verb",
      color: "#c8e6c9",
    },
    { id: "clear", label: "clear", type: "action", color: "#f5f5f5" },
  ],
};

export default function KeyboardWithInput({
  onClose,
  getLLMSuggestions,
  audioEnabled,
}) {
  const [sentence, setSentence] = useState("");
  const [hoveredElement, setHoveredElement] = useState(null);
  const [currentLayout, setCurrentLayout] = useState("default");
  const [currentKeys, setCurrentKeys] = useState(KEYBOARD_LAYOUTS.default);
  const [trackyMouseEnabled, setTrackyMouseEnabled] = useState(false);
  const [trackyMouseReady, setTrackyMouseReady] = useState(false);

  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(0);
  const dwellTimerRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const speechSynthRef = useRef(null);
  const trackyMouseRef = useRef(null);
  const dwellClickerRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ("speechSynthesis" in window) {
      speechSynthRef.current = window.speechSynthesis;
      console.log("Text-to-speech initialized");
    } else {
      console.warn("Text-to-speech not supported in this browser");
    }
  }, []);

  // Function to speak text
  const speakText = (text) => {
    if (!speechSynthRef.current) return;

    // Cancel any ongoing speech
    speechSynthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Optional: Set a specific voice (e.g., female voice)
    const voices = speechSynthRef.current.getVoices();
    if (voices.length > 0) {
      // Try to find a preferred voice, or use default
      const preferredVoice = voices.find((voice) =>
        voice.lang.startsWith("en")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    speechSynthRef.current.speak(utterance);
    console.log("Speaking:", text);
  };

  // Initialize audio
  useEffect(() => {
    hoverSoundRef.current = new Audio(popSound);
    hoverSoundRef.current.volume = 0.5;

    return () => {
      if (hoverSoundRef.current) hoverSoundRef.current = null;
    };
  }, []);

  // Auto-enable when TrackyMouse becomes ready
  useEffect(() => {
    if (trackyMouseReady && !trackyMouseEnabled) {
      console.log("Auto-enabling head tracking...");
      const timer = setTimeout(() => {
        initTrackyMouse();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [trackyMouseReady, trackyMouseEnabled]);

  // Check if Tracky Mouse is loaded
  useEffect(() => {
    console.log("Checking for TrackyMouse library...");
    let attempts = 0;
    const maxAttempts = 100;

    const checkTrackyMouse = () => {
      if (typeof window.TrackyMouse !== "undefined") {
        console.log("TrackyMouse library loaded");
        console.log("TrackyMouse object:", window.TrackyMouse);
        setTrackyMouseReady(true);
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          if (attempts % 10 === 0) {
            console.log(`Waiting for TrackyMouse... (${attempts / 10}s)`);
          }
          setTimeout(checkTrackyMouse, 100);
        } else {
          console.error("TrackyMouse library failed to load after 10 seconds");
          console.error(
            "Check: 1) Network tab for 404 errors, 2) Hard refresh (Cmd+Shift+R), 3) Console for script errors"
          );
        }
      }
    };

    // Start checking after a small delay to let deferred script load
    setTimeout(checkTrackyMouse, 100);
  }, []);

  // Function to initialize Tracky Mouse
  const initTrackyMouse = async () => {
    if (!trackyMouseReady || typeof window.TrackyMouse === "undefined") {
      console.error("TrackyMouse not loaded");
      return;
    }

    try {
      console.log("Initializing TrackyMouse...");

      window.TrackyMouse.dependenciesRoot = "/tracky-mouse";
      console.log(
        "Dependencies root set:",
        window.TrackyMouse.dependenciesRoot
      );

      console.log("Loading dependencies...");
      await window.TrackyMouse.loadDependencies();
      console.log("Dependencies loaded");

      console.log("Initializing head tracking...");
      trackyMouseRef.current = window.TrackyMouse.init(null, {
        statsJs: false,
      });
      console.log("Head tracking initialized");

      setTimeout(() => {
        const trackyUI = document.querySelector(".tracky-mouse-ui");
        if (trackyUI) {
          trackyUI.style.display = "none";
          console.log("TrackyMouse UI hidden");
        }
      }, 100);

      console.log("Requesting camera access...");
      await window.TrackyMouse.useCamera();
      console.log("Camera access granted");

      // Auto-start tracking by simulating F9 press
      console.log("Auto-starting tracking (F9)...");
      const f9Event = new KeyboardEvent("keydown", {
        key: "F9",
        code: "F9",
        keyCode: 120,
        which: 120,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(f9Event);
      console.log("Tracking started");

      console.log("Setting up pointer control...");

      // Enable the pointer explicitly
      if (window.TrackyMouse.setPointerVisibility) {
        window.TrackyMouse.setPointerVisibility(true);
        console.log("Pointer visibility enabled");
      }

      let last_el_over = null;
      window.TrackyMouse.onPointerMove = (x, y) => {
        const target = document.elementFromPoint(x, y) || document.body;

        // Update mouse reference for our existing hover detection
        mouseRef.current = { x, y };

        if (target !== last_el_over) {
          if (last_el_over) {
            const event = new PointerEvent("pointerleave", {
              view: window,
              clientX: x,
              clientY: y,
              pointerId: 1234567890,
              pointerType: "mouse",
              isPrimary: true,
              bubbles: false,
              cancelable: false,
            });
            last_el_over.dispatchEvent(event);
          }
          const event = new PointerEvent("pointerenter", {
            view: window,
            clientX: x,
            clientY: y,
            pointerId: 1234567890,
            pointerType: "mouse",
            isPrimary: true,
            bubbles: false,
            cancelable: false,
          });
          target.dispatchEvent(event);
          last_el_over = target;
        }

        const event = new PointerEvent("pointermove", {
          view: window,
          clientX: x,
          clientY: y,
          pointerId: 1234567890,
          pointerType: "mouse",
          isPrimary: true,
          button: 0,
          buttons: 1,
          bubbles: true,
          cancelable: true,
        });
        target.dispatchEvent(event);
      };
      console.log("Pointer control configured");

      setTimeout(() => {
        const pointer = document.querySelector(".tracky-mouse-pointer");
        if (pointer) {
          pointer.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background: radial-gradient(circle, #ff4444 0%, #cc0000 40%, #990000 100%) !important;
            width: 24px !important;
            height: 24px !important;
            box-shadow: 0 0 10px rgba(255, 68, 68, 0.8), 0 0 20px rgba(204, 0, 0, 0.6), 0 0 30px rgba(153, 0, 0, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.5) !important;
            border: 2px solid rgba(255, 255, 255, 0.8) !important;
            animation: pulse-pointer 2s ease-in-out infinite !important;
            pointer-events: none !important;
            z-index: 999999 !important;
          `;
          console.log("Custom pointer styling applied");
          console.log("Pointer element:", pointer);
        } else {
          console.warn("Pointer element not found");
        }
      }, 500);

      console.log("Initializing dwell clicking...");
      const dwellConfig = {
        targets:
          ".keyboard-key, .backspace-btn, .speaker-btn, .enable-tracky-btn",
        noCenter: (target) =>
          target.matches(
            ".keyboard-key, .backspace-btn, .speaker-btn, .enable-tracky-btn"
          ),
        click: ({ target, x, y }) => {
          console.log("Dwell click on:", target);
          // Simulate click on the target
          const keyId = target.getAttribute("data-key-id");
          if (keyId) {
            setHoveredElement(keyId);
          } else if (target.matches(".backspace-btn")) {
            setHoveredElement("backspace-btn");
          } else if (target.matches(".speaker-btn")) {
            setHoveredElement("speaker-btn");
          } else if (target.matches(".enable-tracky-btn")) {
            // Already handled by clicking the button
          }
        },
      };

      dwellClickerRef.current =
        window.TrackyMouse.initDwellClicking(dwellConfig);
      setTrackyMouseEnabled(true);
      console.log("TrackyMouse initialization complete");
      console.log("Move your head to control the cursor");
      console.log("Hover over keys for 3 seconds to click");
    } catch (error) {
      console.error("Error initializing TrackyMouse:", error);
      alert(
        "Failed to initialize head tracking.\n\nCheck: 1) Camera permission granted, 2) Console for errors\n\nError: " +
          error.message
      );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackyMouseRef.current?.dispose) {
        trackyMouseRef.current.dispose();
      }
      if (dwellClickerRef.current?.dispose) {
        dwellClickerRef.current.dispose();
      }
    };
  }, []);

  // Track mouse position
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      document.body.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.body.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Update cursor fill animation
  useEffect(() => {
    if (hoveredElement) {
      document.body.style.setProperty("--dwell-duration", "0ms");
      document.body.style.setProperty(
        "--cursor-fill",
        "inset(100% 0 0 0 round 50%)"
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const duration =
            hoveredElement === "backspace-btn"
              ? BACKSPACE_DWELL_TIME
              : DWELL_TIME;
          document.body.style.setProperty("--dwell-duration", `${duration}ms`);
          document.body.style.setProperty(
            "--cursor-fill",
            "inset(0 0 0 0 round 50%)"
          );
        });
      });

      if (hoverSoundRef.current && audioEnabled) {
        hoverSoundRef.current.currentTime = 0;
        hoverSoundRef.current.play().catch(() => {});
      }
    } else {
      document.body.style.setProperty("--dwell-duration", "0ms");
      document.body.style.setProperty(
        "--cursor-fill",
        "inset(100% 0 0 0 round 50%)"
      );
    }
  }, [hoveredElement]);

  // Hover detection loop
  useEffect(() => {
    const checkHover = () => {
      const { x, y } = mouseRef.current;
      let found = null;

      const keys = document.querySelectorAll(".keyboard-key");
      keys.forEach((keyEl) => {
        const rect = keyEl.getBoundingClientRect();
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          found = keyEl.getAttribute("data-key-id");
        }
      });

      if (!found) {
        const backspaceBtn = document.querySelector(".backspace-btn");
        if (backspaceBtn) {
          const rect = backspaceBtn.getBoundingClientRect();
          if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          ) {
            found = "backspace-btn";
          }
        }
      }

      if (!found) {
        const speakerBtn = document.querySelector(".speaker-btn");
        if (speakerBtn) {
          const rect = speakerBtn.getBoundingClientRect();
          if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          ) {
            found = "speaker-btn";
          }
        }
      }

      if (found !== hoveredElement) setHoveredElement(found);
      rafRef.current = requestAnimationFrame(checkHover);
    };

    rafRef.current = requestAnimationFrame(checkHover);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hoveredElement]);

  // Handle backspace
  const handleBackspace = () => {
    speakText("backspace");
    const words = sentence.trim().split(" ");
    if (words.length > 0 && words[0] !== "") {
      words.pop();
      setSentence(words.join(" "));
    } else {
      setSentence("");
    }
  };

  // Handle speaker - speak the entire sentence
  const handleSpeaker = () => {
    if (sentence.trim()) {
      speakText(sentence);
    }
  };

  // Determine next layout based on sentence
  const getNextLayout = (updatedSentence) => {
    const words = updatedSentence.trim().toLowerCase().split(" ");
    const lastThreeWords = words.slice(-3).join(" ");
    const lastTwoWords = words.slice(-2).join(" ");
    const lastWord = words[words.length - 1];

    if (lastThreeWords === "i like to play" || lastTwoWords === "to play")
      return "afterILikeToPlay";
    if (lastTwoWords === "i like" || lastTwoWords === "i love")
      return "afterILike";
    if (lastWord === "i") return "afterI";
    return "default";
  };

  // Update keyboard with LLM or pattern-based
  const updateKeyboardWithLLM = async (updatedSentence) => {
    if (getLLMSuggestions && updatedSentence.trim()) {
      try {
        const suggestions = await getLLMSuggestions(updatedSentence);
        if (suggestions && suggestions.length > 0) {
          const llmLayout = [...KEYBOARD_LAYOUTS.default];
          suggestions.slice(0, 18).forEach((suggestion, index) => {
            if (index < 18 && llmLayout[index + 6]) {
              llmLayout[index + 6] = {
                id: `llm_${index}`,
                label: suggestion,
                type: "suggestion",
                color: "#e3f2fd",
              };
            }
          });
          setCurrentKeys(llmLayout);
          setCurrentLayout("llm");
          return;
        }
      } catch (error) {
        console.error("Error getting LLM suggestions:", error);
      }
    }

    const nextLayout = getNextLayout(updatedSentence);
    setCurrentLayout(nextLayout);
    setCurrentKeys(KEYBOARD_LAYOUTS[nextLayout]);
  };

  // Execute key action
  const executeKeyAction = async (keyId) => {
    console.log("executeKeyAction called for:", keyId);
    const key = currentKeys.find((k) => k.id === keyId);
    if (!key) {
      console.log("Key not found:", keyId);
      setHoveredElement(null);
      return;
    }

    console.log("Executing action for key:", key.label);

    if (key.id === "clear") {
      speakText("clear");
      setSentence("");
      setCurrentLayout("default");
      setCurrentKeys(KEYBOARD_LAYOUTS.default);
    } else if (key.id === "home") {
      speakText("home");
      setCurrentLayout("default");
      setCurrentKeys(KEYBOARD_LAYOUTS.default);
    } else if (key.id === "exit") {
      speakText("exit");
      if (onClose) onClose();
    } else if (key.id === "vocab") {
      speakText("vocab");
      setCurrentLayout("vocab");
      setCurrentKeys(KEYBOARD_LAYOUTS.vocab);
    } else if (key.type === "category" && KEYBOARD_LAYOUTS[key.id]) {
      speakText(key.label);
      setCurrentLayout(key.id);
      setCurrentKeys(KEYBOARD_LAYOUTS[key.id]);
    } else {
      // Speak the word before adding it to sentence
      speakText(key.label);

      const newSentence = sentence ? `${sentence} ${key.label}` : key.label;
      console.log("Setting new sentence:", newSentence);
      setSentence(newSentence);
      await updateKeyboardWithLLM(newSentence);
    }

    setHoveredElement(null);
  };

  // Dwell timer for ALL elements
  useEffect(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }

    if (!hoveredElement) return;

    console.log("Starting dwell timer for:", hoveredElement);

    const dwellTime =
      hoveredElement === "backspace-btn" || hoveredElement === "speaker-btn"
        ? BACKSPACE_DWELL_TIME
        : DWELL_TIME;

    dwellTimerRef.current = setTimeout(() => {
      console.log("Dwell completed for:", hoveredElement);

      if (hoveredElement === "backspace-btn") {
        handleBackspace();
        setHoveredElement(null);
      } else if (hoveredElement === "speaker-btn") {
        handleSpeaker();
        setHoveredElement(null);
      } else {
        executeKeyAction(hoveredElement);
      }
    }, dwellTime);

    return () => {
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = null;
      }
    };
  }, [hoveredElement, sentence, currentKeys]);

  return (
    <div className="keyboard-with-input-screen">
      <div className="input-display">
        <input
          type="text"
          className="keyboard-sentence-input"
          placeholder="Your sentence will appear here..."
          value={sentence}
          readOnly
        />
        <button className="speaker-btn" aria-label="Speak sentence">
          <img src={SpeakerIcon} alt="Speaker" />
        </button>
        <button className="backspace-btn" aria-label="Backspace">
          <img src={BackspaceIcon} alt="Backspace" />
        </button>
      </div>

      {!trackyMouseEnabled && trackyMouseReady && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px 40px",
            backgroundColor: "rgba(33, 150, 243, 0.95)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "bold",
            zIndex: 10001,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            textAlign: "center",
          }}
        >
          🎥 Initializing Head Tracking...
        </div>
      )}

      {trackyMouseEnabled && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            padding: "8px 12px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 10000,
          }}
        >
          🎯 Head Tracking Active
        </div>
      )}

      <div className="keyboard-container">
        <div className="keyboard-header">CS435 HCI Vocab</div>
        <div className="keyboard-grid">
          {currentKeys.map((key) => (
            <button
              key={key.id}
              data-key-id={key.id}
              className={`keyboard-key ${key.type} ${
                hoveredElement === key.id ? "hovered" : ""
              }`}
              style={{ backgroundColor: key.color }}
              aria-label={key.label}
            >
              {key.icon && (
                <img src={key.icon} alt={key.label} className="key-icon" />
              )}
              <span className="key-label">{key.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
