import { useRef, useEffect } from "react";

// Déclenche onEnter quand le ref entre dans le viewport, onLeave quand il en sort.
// Rejoue à chaque passage — aucune boucle infinie.
export function useSectionReplay({ onEnter, onLeave, threshold = 0.25 }) {
  const ref = useRef(null);

  // Stocker les callbacks dans un ref pour éviter de recréer l'observer
  // à chaque re-render (pattern stable-ref pour callbacks)
  const callbacksRef = useRef({ onEnter, onLeave });
  callbacksRef.current = { onEnter, onLeave };

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.IntersectionObserver) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callbacksRef.current.onEnter?.();
        else                      callbacksRef.current.onLeave?.();
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}
