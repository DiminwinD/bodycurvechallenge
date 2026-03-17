import { useConfettiOnce } from "../hooks/useConfettiOnce.js";

// Déclenche les confettis une seule fois au montage de /success.
// Aucun rendu visible.
export default function ConfettiEffect() {
  useConfettiOnce();
  return null;
}
