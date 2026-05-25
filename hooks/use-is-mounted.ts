import { useState, useEffect } from "react";

/**
 * A hook to determine if the component has mounted on the client.
 * Useful for resolving hydration mismatches by delaying the rendering 
 * of client-only content.
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
