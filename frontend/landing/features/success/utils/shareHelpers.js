export const WA_LINK   = "https://wa.me/2250799576214";
export const APP_LINK  = "/bodycurve-control";
export const SHARE_URL = "https://bodycurvechallenge.com";

export const WA_SHARE = `https://wa.me/?text=${encodeURIComponent(
  "Je viens de rejoindre le BodyCurve Challenge 🎉 C'est un programme de remise en forme de 21 jours avec coaching et application dédiée. Rejoins-moi → " + SHARE_URL
)}`;

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}
