/** Distance from a point to the nearest edge of an axis-aligned rectangle (px). */
export function distancePointToRectBorder(
  px: number,
  py: number,
  r: DOMRectReadOnly,
): number {
  const { left, right, top, bottom } = r;
  const insideX = px >= left && px <= right;
  const insideY = py >= top && py <= bottom;
  if (insideX && insideY) {
    return Math.min(px - left, right - px, py - top, bottom - py);
  }
  const qx = Math.max(left, Math.min(px, right));
  const qy = Math.max(top, Math.min(py, bottom));
  return Math.hypot(px - qx, py - qy);
}

const SHINE_CLASS = 'cursor-bloom-shine';
const SHINE_MAX_DIST = 100;

/** Viewport sample offsets so borders are detected before the cursor crosses them. */
const SAMPLE_OFFSETS: readonly [number, number][] = [
  [0, 0],
  [0, -80],
  [0, 80],
  [-80, 0],
  [80, 0],
  [-56, -56],
  [56, -56],
  [-56, 56],
  [56, 56],
];

/** Border reflection only on index realm stack plates (not graph, article, or chrome). */
function resolveRealmStackPlate(raw: Element, layout: HTMLElement): Element | null {
  if (raw === layout || !layout.contains(raw)) return null;
  if (raw.classList.contains('cursor-bloom-shine-ignore')) return null;
  const plate = raw.closest('.wiki-stack-plate');
  if (!plate || !layout.contains(plate)) return null;
  if (!plate.closest('.wiki-stack-menu')) return null;
  return plate;
}

/**
 * Adds/removes `cursor-bloom-shine` on `.wiki-stack-plate` (realm index stack) near (cx, cy).
 * Reuses `prev` as the set of currently highlighted elements.
 */
export function syncBloomEdgeShine(
  layout: HTMLElement,
  cx: number,
  cy: number,
  prev: Set<Element>,
): void {
  const next = new Set<Element>();

  for (const [ox, oy] of SAMPLE_OFFSETS) {
    const x = Math.min(Math.max(cx + ox, 0), window.innerWidth - 1);
    const y = Math.min(Math.max(cy + oy, 0), window.innerHeight - 1);
    let stack: Element[];
    try {
      stack = document.elementsFromPoint(x, y);
    } catch {
      continue;
    }
    for (const raw of stack) {
      if (!layout.contains(raw) || raw === layout) continue;
      const el = resolveRealmStackPlate(raw, layout);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 3 || rect.height < 3) continue;
      if (distancePointToRectBorder(cx, cy, rect) <= SHINE_MAX_DIST) {
        next.add(el);
      }
    }
  }

  for (const el of prev) {
    if (!next.has(el)) el.classList.remove(SHINE_CLASS);
  }
  for (const el of next) {
    if (!prev.has(el)) el.classList.add(SHINE_CLASS);
  }
  prev.clear();
  next.forEach(e => prev.add(e));
}

export const CURSOR_BLOOM_SHINE_CLASS = SHINE_CLASS;
