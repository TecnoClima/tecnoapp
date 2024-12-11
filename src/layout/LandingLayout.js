import React, { useEffect, useRef, useState } from "react";

export default function LandingLayout({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState({ x: 1, y: 1 });
  const speed = 2; // Velocidad de movimiento
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePosition = () => {
      const { clientWidth, clientHeight } = container;
      const gradientSize = Math.max(clientHeight, clientWidth) * 0.4; // Tamaño del gradiente
      const nextX = position.x + direction.x * speed;
      const nextY = position.y + direction.y * speed;

      // Rebotar en los bordes
      if (nextX <= 0 || nextX + gradientSize >= clientWidth) {
        setDirection((prev) => ({ ...prev, x: -prev.x }));
      }
      if (nextY <= 0 || nextY + gradientSize >= clientHeight) {
        setDirection((prev) => ({ ...prev, y: -prev.y }));
      }

      setPosition((prev) => ({
        x: prev.x + direction.x * speed,
        y: prev.y + direction.y * speed,
      }));
    };

    const interval = setInterval(updatePosition, 16); // ~60 FPS
    return () => clearInterval(interval);
  }, [position, direction]);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen bg-base-100 overflow-hidden text-base-content"
    >
      <div
        className="absolute h-[max(100vw,100vh)] w-[max(100vw,100vh)] rounded-full bg-radial-gradient from-base-300 to-neutral"
        style={{
          top: position.y,
          left: position.x,
        }}
      ></div>
      <div className="container h-full">{children}</div>
    </div>
  );
}
