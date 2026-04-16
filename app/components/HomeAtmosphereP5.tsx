'use client';

import { useEffect, useRef } from 'react';
import type p5Types from 'p5';

export default function HomeAtmosphereP5() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: p5Types | null = null;
    let disposed = false;

    const boot = async () => {
      const p5Module = await import('p5');
      if (disposed || !hostRef.current) return;
      const P5 = p5Module.default;

      instance = new P5((p: p5Types) => {
        const RENDER_SCALE = 0.5;
        const asciiChars = ['.', ':', '-', '+', '*', '#', '@'];
        const bayer4 = [
          [0, 8, 2, 10],
          [12, 4, 14, 6],
          [3, 11, 1, 9],
          [15, 7, 13, 5]
        ];

        const renderScene = () => {
          p.clear();
          p.blendMode(p.BLEND);

          // Static dither field.
          p.blendMode(p.ADD);
          const step = 2;
          for (let y = 0; y < p.height; y += step) {
            for (let x = 0; x < p.width; x += step) {
              const v = p.noise(x * 0.016, y * 0.018, 0.6);
              const threshold = bayer4[(y / step) % 4][(x / step) % 4] / 16;
              const regionWeight = p.map(p.noise(x * 0.0022, y * 0.002), 0, 1, 0.45, 1.45, true);
              if (v > 0.45 + threshold * 0.34 / regionWeight) {
                p.fill(234, 242, 250, p.map(v, 0.5, 1, 1, 4.5) * (0.35 + regionWeight * 0.2));
                p.rect(x, y, 1, 1);
              }
            }
          }

          // Static ASCII field.
          p.blendMode(p.SCREEN);
          p.textSize(11);
          p.textFont('monospace');
          const asciiStepX = 11;
          const asciiStepY = 12;
          for (let y = 0; y < p.height + asciiStepY; y += asciiStepY) {
            for (let x = 0; x < p.width + asciiStepX; x += asciiStepX) {
              const n = p.noise(x * 0.011, y * 0.014, 1.8);
              const idx = Math.min(asciiChars.length - 1, Math.floor(n * asciiChars.length));
              const glyph = asciiChars[idx];
              const regionWeight = p.map(p.noise(x * 0.0022, y * 0.002, 2.4), 0, 1, 0.35, 1.6, true);
              if (n < 0.24 + (1 - regionWeight) * 0.18) continue;
              const alpha = p.map(n, 0.18, 1, 10, 36, true) * regionWeight;
              const jitterX = (((x * 17 + y * 31) % 7) - 3) * 0.35;
              const jitterY = (((x * 13 + y * 19) % 5) - 2) * 0.3;
              p.fill(238, 246, 255, alpha);
              p.text(glyph, x + jitterX, y + jitterY);
            }
          }
        };

        p.setup = () => {
          const c = p.createCanvas(
            Math.max(1, Math.floor(hostRef.current!.clientWidth * RENDER_SCALE)),
            Math.max(1, Math.floor(hostRef.current!.clientHeight * RENDER_SCALE))
          );
          c.parent(hostRef.current!);
          p.pixelDensity(1);
          p.noStroke();
          renderScene();
          p.noLoop();
        };

        p.windowResized = () => {
          if (!hostRef.current) return;
          p.resizeCanvas(
            Math.max(1, Math.floor(hostRef.current.clientWidth * RENDER_SCALE)),
            Math.max(1, Math.floor(hostRef.current.clientHeight * RENDER_SCALE))
          );
          renderScene();
        };
      });
    };

    void boot();

    return () => {
      disposed = true;
      instance?.remove();
    };
  }, []);

  return <div className="wiki-home-atmo-p5" ref={hostRef} aria-hidden="true" />;
}
