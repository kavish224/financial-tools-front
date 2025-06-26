'use client';
import { useEffect, useRef } from "react";
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function Ad() {
  const adRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.adsbygoogle &&
        Array.isArray(window.adsbygoogle)
      ) {
        try {
          window.adsbygoogle.push({});
          clearInterval(interval);
        } catch (e) {
          console.error("Adsense push error", e);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-4213724490364096"
      data-ad-slot="3482786374"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
