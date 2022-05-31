import { useCallback, useEffect, useMemo, useState } from "react";

// Compose our useMedia hook to detect dark mode preference.
// The API for useMedia looks a bit weird, but that's because ...
// ... it was designed to support multiple media queries and return values.
// Thanks to hook composition we can hide away that extra complexity!
// Read the recipe for useMedia to learn more: usehooks.com/useMedia
const values = [true];
const defaultValue = false;

export const useDarkMode = () => {
  // Array containing a media query list for each query
  const mediaQueryLists = useMemo(
    () => ["(prefers-color-scheme: dark)"].map((q) => window.matchMedia(q)),
    []
  );
  // Function that gets value based on matching media query
  const getValue = useCallback(() => {
    // Get index of first media query that matches
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    // Return related value or defaultValue if none
    return values?.[index] || defaultValue;
  }, [mediaQueryLists]);
  // State and setter for matched value
  const [value, setValue] = useState(getValue);
  useEffect(
    () => {
      // Event listener callback
      // Note: By defining getValue outside of useEffect we ensure that it has ...
      // ... current values of hook args (as this hook callback is created once on mount).
      const handler = () => setValue(getValue);
      // Set a listener for each media query with above handler as callback.
      mediaQueryLists.forEach((mql) => mql.addListener(handler));
      // Remove listeners on cleanup
      return () =>
        mediaQueryLists.forEach((mql) => mql.removeListener(handler));
    },
    [getValue, mediaQueryLists] // Empty array ensures effect is only run on mount and unmount
  );
  return value;
};
