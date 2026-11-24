"use client";

import { useEffect, useState } from "react";

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 5 + 3,
      duration: Math.random() * 8 + 7,
      delay: Math.random() * -15,
      opacity: Math.random() * 0.5 + 0.35,
    }));

    setSnowflakes(flakes);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="absolute top-[-10px] rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}