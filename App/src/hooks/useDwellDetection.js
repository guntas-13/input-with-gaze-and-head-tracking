import { useCallback, useEffect, useRef, useState } from "react";
import popSound from "../sounds/ui-pop-sound-316482.mp3";

export function useDwellDetection(dwellTime = 3000) {
  const [hoveredElement, setHoveredElement] = useState(null);
  const dwellTimerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(0);
  const hoverSoundRef = useRef(null);
  const audioEnabledRef = useRef(false);

  // Initialize hover sound and enable audio on first click
  useEffect(() => {
    hoverSoundRef.current = new Audio(popSound);
    hoverSoundRef.current.volume = 0.5;

    const enableAudio = () => {
      if (!audioEnabledRef.current) {
        hoverSoundRef.current
          .play()
          .then(() => {
            hoverSoundRef.current.pause();
            hoverSoundRef.current.currentTime = 0;
            audioEnabledRef.current = true;
            console.log("Audio enabled successfully");
          })
          .catch((e) => {
            console.error("Failed to enable audio:", e);
          });
      }
    };

    document.addEventListener("click", enableAudio, { once: true });

    return () => {
      document.removeEventListener("click", enableAudio);
      if (hoverSoundRef.current) {
        hoverSoundRef.current = null;
      }
    };
  }, []);

  // Track mouse position
  useEffect(() => {
    const setVars = (x, y) => {
      mouseRef.current = { x, y };
      document.body.style.setProperty("--mouse-x", `${x}px`);
      document.body.style.setProperty("--mouse-y", `${y}px`);
    };

    const onMove = (e) => {
      setVars(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Update cursor fill state
  useEffect(() => {
    if (hoveredElement) {
      // First reset the cursor immediately
      document.body.style.setProperty("--dwell-duration", "0ms");
      document.body.style.setProperty(
        "--cursor-fill",
        "inset(100% 0 0 0 round 50%)"
      );

      // Then start the fill animation after a tiny delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.style.setProperty("--dwell-duration", `${dwellTime}ms`);
          document.body.style.setProperty(
            "--cursor-fill",
            "inset(0 0 0 0 round 50%)"
          );
        });
      });
    } else {
      // Reset immediately with no transition
      document.body.style.setProperty("--dwell-duration", "0ms");
      document.body.style.setProperty(
        "--cursor-fill",
        "inset(100% 0 0 0 round 50%)"
      );
    }
  }, [hoveredElement, dwellTime]);

  const playHoverSound = useCallback(() => {
    if (hoverSoundRef.current && audioEnabledRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current
        .play()
        .then(() => console.log("Sound played"))
        .catch((e) => console.log("Audio play failed:", e));
    }
  }, []);

  const startDwellTimer = useCallback(
    (callback) => {
      console.log(
        "startDwellTimer called, setting timeout for",
        dwellTime,
        "ms"
      );
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
      }
      dwellTimerRef.current = setTimeout(() => {
        console.log("Dwell timer callback executing!");
        callback();
      }, dwellTime);
    },
    [dwellTime]
  );

  const clearDwellTimer = useCallback(() => {
    if (dwellTimerRef.current) {
      console.log("Clearing dwell timer");
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
  }, []);

  return {
    hoveredElement,
    setHoveredElement,
    mouseRef,
    rafRef,
    playHoverSound,
    startDwellTimer,
    clearDwellTimer,
  };
}
