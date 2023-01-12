const WPM = 225; // The average adult reading speed

export const calculateReadingTime = (text: string): string => {
  const words = text.trim().split(/\s+/).length;
  return String(Math.ceil(words / WPM));
}