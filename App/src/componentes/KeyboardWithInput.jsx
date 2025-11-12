import React, { useEffect, useState } from "react";
import "./KeyboardWithInput.css";
import Keyboard from "./Keyboard";
import BackspaceIcon from "../icons/backspace-32.svg";
import { useDwellDetection } from "../hooks/useDwellDetection";

const DWELL_TIME = 3000; // 3 seconds

export default function KeyboardWithInput({ onClose, getLLMSuggestions }) {
  const [sentence, setSentence] = useState("");

  const {
    hoveredElement,
    setHoveredElement,
    mouseRef,
    rafRef,
    playHoverSound,
    startDwellTimer,
    clearDwellTimer,
  } = useDwellDetection(DWELL_TIME);

  // Dwell detection for backspace button AND keyboard keys
  useEffect(() => {
    const checkHover = () => {
      const { x, y } = mouseRef.current;
      let found = null;

      // Check keyboard keys first
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

      // If no keyboard key found, check backspace button
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

      if (found !== hoveredElement) {
        setHoveredElement(found);
      }

      rafRef.current = requestAnimationFrame(checkHover);
    };

    rafRef.current = requestAnimationFrame(checkHover);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hoveredElement, mouseRef, rafRef, setHoveredElement]);

  // Play sound when hovering over any element
  useEffect(() => {
    if (hoveredElement) {
      playHoverSound();
    }
  }, [hoveredElement, playHoverSound]);

  // Handle backspace to remove last word
  const handleBackspace = () => {
    const words = sentence.trim().split(" ");
    if (words.length > 0 && words[0] !== "") {
      words.pop(); // Remove last word
      setSentence(words.join(" "));
    } else {
      setSentence("");
    }
  };

  // Handle dwell timer for backspace button and pass callback to keyboard for keys
  useEffect(() => {
    clearDwellTimer();

    if (hoveredElement === "backspace-btn") {
      console.log("Starting dwell timer for backspace");
      startDwellTimer(() => {
        console.log(
          "Backspace dwell timer completed, executing handleBackspace"
        );
        handleBackspace();
        // Reset hovered element after action completes to reset cursor
        setHoveredElement(null);
      });
    }
    // Note: Keyboard keys are handled by the Keyboard component's dwell effect

    return clearDwellTimer;
  }, [
    hoveredElement,
    sentence,
    startDwellTimer,
    clearDwellTimer,
    setHoveredElement,
    handleBackspace,
  ]);

  return (
    <div className="keyboard-with-input-screen">
      <div className="input-display">
        <input
          type="text"
          className="sentence-input"
          placeholder="Your sentence will appear here..."
          value={sentence}
          readOnly
        />
        <button className="backspace-btn" aria-label="Backspace">
          <img src={BackspaceIcon} alt="Backspace" />
        </button>
      </div>

      <Keyboard
        sentence={sentence}
        onSentenceChange={setSentence}
        getLLMSuggestions={getLLMSuggestions}
        onClose={onClose}
        mouseRef={mouseRef}
        rafRef={rafRef}
        playHoverSound={playHoverSound}
        startDwellTimer={startDwellTimer}
        clearDwellTimer={clearDwellTimer}
        hoveredElement={hoveredElement}
        setHoveredElement={setHoveredElement}
      />
    </div>
  );
}
