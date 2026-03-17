import { useEffect } from "react";

export function useConfettiOnce() {
  useEffect(() => {
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.35 },
        colors: ["#FF4D6D", "#D4A017", "#FFFFFF", "#FFE5D0", "#F5C842"],
        ticks: 220,
        gravity: 1.1,
        scalar: 0.95,
      });
    });
  }, []);
}
