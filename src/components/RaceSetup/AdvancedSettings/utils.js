export const generateNumberOptions = (start, end, pad = true) => {
  return Array.from({ length: end - start + 1 }, (_, i) => pad ? String(start + i).padStart(2, '0') : String(start + i));
};

export const PLACEHOLDER_VALUE = "_placeholder_";

export const calculateTotalDuration = (hours, minutes) => {
  return (parseInt(hours || '0', 10) * 3600) + (parseInt(minutes || '0', 10) * 60);
};