import { useState, useRef } from "react";
import { ANIM_STEPS } from "../data/successContent.js";

export function useAmbassadorProgressAnimation() {
  const [counter,   setCounter]   = useState(0);
  const [barWidth,  setBarWidth]  = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  const animRunning = useRef(false);
  const animTimers  = useRef([]);

  const start = () => {
    if (animRunning.current) return;
    animRunning.current = true;
    ANIM_STEPS.forEach(({ delay, count, bar, badge, done }) => {
      const t = setTimeout(() => {
        if (count !== undefined) setCounter(count);
        if (bar   !== undefined) setBarWidth(bar);
        if (badge === true)  setShowBadge(true);
        if (badge === false) setShowBadge(false);
        if (done) animRunning.current = false;
      }, delay);
      animTimers.current.push(t);
    });
  };

  const reset = () => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
    animRunning.current = false;
    setCounter(0);
    setBarWidth(0);
    setShowBadge(false);
  };

  return { counter, barWidth, showBadge, start, reset };
}
