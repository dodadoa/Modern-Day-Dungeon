'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide } from 'd3-force-3d';
import { GraphNode, GraphLink, NODES, LINKS } from '../data/graph';

interface Props {
  compact?: boolean;
  onNodeSelect?: (node: GraphNode) => void;
}

interface SimNode extends GraphNode {
  layer: number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
  mesh?: THREE.Mesh;
  glow?: THREE.Mesh;
  labelSprite?: THREE.Sprite;
}

interface SimLink extends GraphLink {
  source: SimNode | string;
  target: SimNode | string;
  line?: THREE.Line;
}

const STACK_REALM_ORDER = ['core-sky', 'surface', 'walled', 'shadow', 'subterranean', 'core-below', 'hyperreal'] as const;
const STACK_REALM_SET = new Set<string>(STACK_REALM_ORDER);
const STACK_REALM_INDEX = new Map<string, number>(STACK_REALM_ORDER.map((id, idx) => [id, idx]));

const TYPE_CODES: Record<string, string> = {
  realm: '[R]',
  faction: '[F]',
  outer: '[O]',
  lore: '[L]',
  danger: '[!]',
  mechanism: '[M]',
  creature: '[C]'
};

function buildRealmLayerMap() {
  const adjacency = new Map<string, string[]>();
  NODES.forEach(n => adjacency.set(n.id, []));
  LINKS.forEach(l => {
    adjacency.get(l.s)?.push(l.t);
    adjacency.get(l.t)?.push(l.s);
  });

  const dist = new Map<string, number>();
  const ownerRealm = new Map<string, string>();
  const queue: string[] = [];

  STACK_REALM_ORDER.forEach(realmId => {
    dist.set(realmId, 0);
    ownerRealm.set(realmId, realmId);
    queue.push(realmId);
  });

  while (queue.length) {
    const cur = queue.shift()!;
    const curDist = dist.get(cur)!;
    const owner = ownerRealm.get(cur)!;
    for (const nb of adjacency.get(cur) || []) {
      const nextDist = curDist + 1;
      const prevDist = dist.get(nb);
      if (prevDist === undefined || nextDist < prevDist) {
        dist.set(nb, nextDist);
        ownerRealm.set(nb, owner);
        queue.push(nb);
      }
    }
  }

  const map = new Map<string, number>();
  const mid = Math.floor(STACK_REALM_ORDER.length / 2);
  NODES.forEach(n => {
    if (STACK_REALM_SET.has(n.id)) {
      map.set(n.id, STACK_REALM_INDEX.get(n.id) ?? mid);
      return;
    }
    const realm = ownerRealm.get(n.id);
    map.set(n.id, realm ? (STACK_REALM_INDEX.get(realm) ?? mid) : mid);
  });
  return map;
}

const NODE_LAYER_MAP = buildRealmLayerMap();
const LAYER_GAP = 240;

function layerY(layer: number) {
  const mid = (STACK_REALM_ORDER.length - 1) / 2;
  return (layer - mid) * LAYER_GAP;
}

function safeNum(v: number | undefined | null) {
  return Number.isFinite(v) ? (v as number) : 0;
}

function unitHash(id: string, seed: number) {
  let h = seed;
  for (let i = 0; i < id.length; i += 1) h = (h * 33) ^ id.charCodeAt(i);
  return ((h >>> 0) % 1000) / 1000; // 0..1 deterministic
}

function makeCircleTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.45, 'rgba(220,220,220,0.7)');
  grad.addColorStop(1, 'rgba(220,220,220,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function makeLabelTexture(text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '30px monospace';
  ctx.fillStyle = '#cfcfcf';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function makeDitherFogTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, size, size);

  // Ordered-like dithering using deterministic hash per cell.
  const cell = 4;
  for (let y = 0; y < size; y += cell) {
    for (let x = 0; x < size; x += cell) {
      const v = (((x * 73) ^ (y * 151)) & 255) / 255;
      if (v > 0.72) {
        const a = 0.05 + v * 0.09;
        ctx.fillStyle = `rgba(210,210,210,${a.toFixed(3)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  texture.needsUpdate = true;
  return texture;
}

function makeAsciiGlitterTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const glyphs = ['.', ':', '*', '+'];
  for (let i = 0; i < 220; i += 1) {
    const x = (i * 37) % size;
    const y = (i * 91) % size;
    const g = glyphs[i % glyphs.length];
    const alpha = 0.12 + ((i % 5) * 0.04);
    ctx.fillStyle = `rgba(220,220,220,${alpha.toFixed(3)})`;
    ctx.fillText(g, x, y);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function KnowledgeGraph({ compact, onNodeSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef<string | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const graphData = useMemo(() => {
    const nodes: SimNode[] = NODES.map(n => {
      const layer = NODE_LAYER_MAP.get(n.id) ?? 3;
      const hash = Array.from(n.id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const angle = ((hash % 360) / 360) * Math.PI * 2;
      const radius = 140 + (hash % 260);
      const yJitter = unitHash(n.id, 17) - 0.5;
      const zJitter = unitHash(n.id, 97) - 0.5;
      return {
        ...n,
        layer,
        x: Math.cos(angle) * radius,
        y: layerY(layer) + yJitter * 100,
        z: Math.sin(angle) * radius + zJitter * 80
      };
    });

    const links: SimLink[] = LINKS.map(l => ({
      ...l,
      source: l.s,
      target: l.t
    }));

    return { nodes, links };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 5000);
    camera.position.set(0, 80, 1200);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 180;
    controls.maxDistance = 2500;
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 0.75);
    key.position.set(400, 420, 300);
    scene.add(key);

    const fogPlanes: THREE.Mesh[] = [];
    const fogTexture = makeDitherFogTexture();
    if (fogTexture) {
      for (let i = 0; i < 3; i += 1) {
        const mat = new THREE.MeshBasicMaterial({
          map: fogTexture.clone(),
          color: 0xffffff,
          transparent: true,
          opacity: 0.07 - i * 0.015,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        mat.map!.wrapS = THREE.RepeatWrapping;
        mat.map!.wrapT = THREE.RepeatWrapping;
        mat.map!.repeat.set(8 - i, 8 - i);
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(3000 - i * 500, 2200 - i * 400), mat);
        plane.position.set(0, (i - 1) * 140, -450 - i * 120);
        scene.add(plane);
        fogPlanes.push(plane);
      }
    }

    const glitterTexture = makeAsciiGlitterTexture();
    const glitterMaterial = glitterTexture
      ? new THREE.PointsMaterial({
          map: glitterTexture,
          color: 0xd8d8d8,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
          size: 9,
          sizeAttenuation: true
        })
      : null;
    const glitter = (() => {
      if (!glitterMaterial) return null;
      const count = 140;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        const b = i * 3;
        positions[b] = ((i * 73) % 1700) - 850;
        positions[b + 1] = ((i * 43) % 900) - 450;
        positions[b + 2] = ((i * 97) % 1700) - 850;
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pts = new THREE.Points(geom, glitterMaterial);
      scene.add(pts);
      return pts;
    })();

    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x636363, transparent: true, opacity: 0.2 });
    STACK_REALM_ORDER.forEach((id, idx) => {
      const y = layerY(idx);
      const points = [
        new THREE.Vector3(-760, y, -760),
        new THREE.Vector3(760, y, -760),
        new THREE.Vector3(760, y, 760),
        new THREE.Vector3(-760, y, 760),
        new THREE.Vector3(-760, y, -760)
      ];
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMaterial);
      scene.add(line);
      const realmNode = NODES.find(n => n.id === id);
      if (realmNode) {
        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = 512;
        spriteCanvas.height = 128;
        const ctx = spriteCanvas.getContext('2d');
        if (ctx) {
          ctx.font = '44px monospace';
          ctx.fillStyle = '#b7b7b7';
          ctx.fillText(realmNode.label, 12, 72);
          const tex = new THREE.CanvasTexture(spriteCanvas);
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.65 }));
          sprite.position.set(-700, y + 24, -700);
          sprite.scale.set(320, 80, 1);
          scene.add(sprite);
        }
      }
    });

    const glowTexture = makeCircleTexture();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pressedKeys = new Set<string>();

    const nodeGeomCache = new Map<number, THREE.SphereGeometry>();
    const allMeshes: THREE.Mesh[] = [];
    graphData.nodes.forEach(n => {
      const radius = Math.max(5, n.r * 1.7);
      if (!nodeGeomCache.has(radius)) nodeGeomCache.set(radius, new THREE.SphereGeometry(radius, 20, 20));
      const mat = new THREE.MeshStandardMaterial({
        color: STACK_REALM_SET.has(n.id) ? 0xf2f2f2 : 0xa8a8a8,
        metalness: 0.12,
        roughness: 0.35,
        emissive: 0x000000,
        transparent: true,
        opacity: 0.96
      });
      const mesh = new THREE.Mesh(nodeGeomCache.get(radius)!, mat);
      mesh.position.set(n.x ?? 0, n.y ?? 0, n.z ?? 0);
      mesh.userData.nodeId = n.id;
      scene.add(mesh);
      n.mesh = mesh;
      allMeshes.push(mesh);

      if (glowTexture) {
        const glow = new THREE.Mesh(
          new THREE.PlaneGeometry(radius * 3.2, radius * 3.2),
          new THREE.MeshBasicMaterial({
            map: glowTexture,
            color: 0xffffff,
            transparent: true,
            opacity: 0.07,
            depthWrite: false
          })
        );
        glow.position.copy(mesh.position);
        scene.add(glow);
        n.glow = glow;
      }

      const labelTex = makeLabelTexture(n.label);
      if (labelTex) {
        const label = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: labelTex,
            transparent: true,
            opacity: 0.85,
            depthWrite: false
          })
        );
        label.position.set(n.x ?? 0, (n.y ?? 0) + radius + 20, n.z ?? 0);
        label.scale.set(170, 32, 1);
        scene.add(label);
        n.labelSprite = label;
      }
    });

    graphData.links.forEach(l => {
      const geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(
        geom,
        new THREE.LineBasicMaterial({
          color: 0x7c7c7c,
          transparent: true,
          opacity: 0.44
        })
      );
      scene.add(line);
      l.line = line;
    });

    const sim = forceSimulation(graphData.nodes as any)
      .numDimensions(3)
      .force('charge', forceManyBody().strength((n: SimNode) => -90 - n.r * 16).distanceMax(1100))
      .force('link', (forceLink(graphData.links as any) as any).id((d: any) => d.id).distance((l: any) => 90 + (l.w || 1) * 34))
      .force('collide', (forceCollide() as any).radius((n: SimNode) => n.r * 2.15 + 18).strength(0.9))
      .force('center', forceCenter(0, 0, 0))
      .alphaDecay(0.02);

    const layerForce = () => {
      graphData.nodes.forEach(n => {
        const targetY = layerY(n.layer);
        n.vy = (n.vy ?? 0) + (targetY - (n.y ?? targetY)) * 0.017;
      });
    };
    sim.force('realm-layer', layerForce as any);

    const updateHighlight = (id: string | null) => {
      const nb = new Set<string>();
      if (id) {
        nb.add(id);
        LINKS.forEach(l => {
          if (l.s === id) nb.add(l.t);
          if (l.t === id) nb.add(l.s);
        });
      }
      graphData.nodes.forEach(n => {
        if (!n.mesh) return;
        const mat = n.mesh.material as THREE.MeshStandardMaterial;
        const active = !id || nb.has(n.id);
        mat.color.set(active ? (STACK_REALM_SET.has(n.id) ? 0xffffff : 0xd8d8d8) : 0x565656);
        mat.emissive.set(active && id ? 0x242424 : 0x000000);
        mat.opacity = active ? 0.98 : 0.18;
        if (n.glow) {
          const gm = n.glow.material as THREE.MeshBasicMaterial;
          gm.opacity = active ? (id ? 0.2 : 0.08) : 0.008;
          gm.color.set(active ? 0xffffff : 0x7e7e7e);
        }
        if (n.labelSprite) {
          const lm = n.labelSprite.material as THREE.SpriteMaterial;
          lm.opacity = active ? 0.92 : 0.14;
          lm.color.set(active ? 0xffffff : 0x767676);
        }
      });
      graphData.links.forEach(l => {
        if (!l.line) return;
        const src = typeof l.source === 'string' ? l.source : l.source.id;
        const tgt = typeof l.target === 'string' ? l.target : l.target.id;
        const active = !id || src === id || tgt === id;
        const mat = l.line.material as THREE.LineBasicMaterial;
        mat.opacity = active ? 0.78 : 0.05;
        mat.color.set(active ? 0xd2d2d2 : 0x5a5a5a);
      });
    };

    const showPanel = (n: GraphNode) => {
      if (compact || !panelRef.current) return;
      const panel = panelRef.current;
      const nb = new Set<string>([n.id]);
      LINKS.forEach(l => {
        if (l.s === n.id) nb.add(l.t);
        if (l.t === n.id) nb.add(l.s);
      });
      const connected = NODES.filter(x => nb.has(x.id) && x.id !== n.id);
      (panel.querySelector('#pan-cat') as HTMLElement).textContent = `${TYPE_CODES[n.type] || '[ ]'} ${n.type.toUpperCase()}`;
      (panel.querySelector('#pan-name') as HTMLElement).textContent = n.label;
      (panel.querySelector('#pan-body') as HTMLElement).textContent = n.desc;
      (panel.querySelector('#pan-links-label') as HTMLElement).textContent = `◈ CONNECTIONS · ${connected.length}`;
      const list = panel.querySelector('#pan-links') as HTMLElement;
      list.innerHTML = '';
      connected.forEach(c => {
        const span = document.createElement('span');
        span.className = 'pan-link';
        span.textContent = `--> ${TYPE_CODES[c.type] || '[ ]'} ${c.label}`;
        list.appendChild(span);
      });
      panel.classList.add('on');
    };

    const focusNode = (n: SimNode) => {
      const distance = 220 + n.r * 10;
      camera.position.set((n.x ?? 0) + distance, (n.y ?? 0) + distance * 0.2, (n.z ?? 0) + distance);
      controls.target.set(n.x ?? 0, n.y ?? 0, n.z ?? 0);
      controls.update();
    };

    const tooltip = tooltipRef.current;
    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(allMeshes, false);
      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh;
        const id = String(hit.userData.nodeId);
        if (!id) return;
        const node = graphData.nodes.find(n => n.id === id);
        if (!node) return;
        updateHighlight(id);
        if (tooltip) {
          (tooltip.querySelector('#tt-cat') as HTMLElement).textContent = node.type.toUpperCase();
          (tooltip.querySelector('#tt-name') as HTMLElement).textContent = node.label;
          (tooltip.querySelector('#tt-body') as HTMLElement).textContent = node.desc;
          tooltip.classList.add('on');
          tooltip.style.left = `${event.clientX + 14}px`;
          tooltip.style.top = `${event.clientY - 10}px`;
        }
      } else if (!selectedIdRef.current) {
        updateHighlight(null);
        tooltip?.classList.remove('on');
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(allMeshes, false);
      if (hits.length === 0) {
        selectedIdRef.current = null;
        panelRef.current?.classList.remove('on');
        updateHighlight(null);
        return;
      }
      const id = String((hits[0].object as THREE.Mesh).userData.nodeId);
      const node = graphData.nodes.find(n => n.id === id);
      if (!node) return;
      selectedIdRef.current = id;
      updateHighlight(id);
      onNodeSelect?.(node);
      showPanel(node);
      focusNode(node);
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      const keyName = event.key.toLowerCase();
      if (keyName === 'w' || keyName === 'a' || keyName === 's' || keyName === 'd' || keyName === 'e' || keyName === 'q') {
        pressedKeys.add(keyName);
        event.preventDefault();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const keyName = event.key.toLowerCase();
      pressedKeys.delete(keyName);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      sim.tick();
      const t = clock.getElapsedTime();

      graphData.nodes.forEach(n => {
        const nx = safeNum(n.x);
        const ny = safeNum(n.y);
        const nz = safeNum(n.z);
        n.x = nx;
        n.y = ny;
        n.z = nz;
        n.vx = safeNum(n.vx);
        n.vy = safeNum(n.vy);
        n.vz = safeNum(n.vz);

        if (!n.mesh) return;
        n.mesh.position.set(nx, ny, nz);
        if (n.glow) {
          n.glow.position.copy(n.mesh.position);
          n.glow.lookAt(camera.position);
        }
        if (n.labelSprite) {
          n.labelSprite.position.set(nx, ny + Math.max(20, n.r * 2.2), nz);
        }
      });

      graphData.links.forEach(l => {
        if (!l.line) return;
        const src = (typeof l.source === 'string' ? graphData.nodes.find(n => n.id === l.source) : l.source) as SimNode | undefined;
        const tgt = (typeof l.target === 'string' ? graphData.nodes.find(n => n.id === l.target) : l.target) as SimNode | undefined;
        if (!src || !tgt) return;
        const sx = safeNum(src.x);
        const sy = safeNum(src.y);
        const sz = safeNum(src.z);
        const tx = safeNum(tgt.x);
        const ty = safeNum(tgt.y);
        const tz = safeNum(tgt.z);
        const pos = (l.line.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
        pos.setXYZ(0, sx, sy, sz);
        pos.setXYZ(1, tx, ty, tz);
        pos.needsUpdate = true;
      });

      fogPlanes.forEach((plane, idx) => {
        const mat = plane.material as THREE.MeshBasicMaterial;
        if (mat.map) {
          mat.map.offset.x = t * (0.0022 + idx * 0.0008);
          mat.map.offset.y = t * (0.0015 + idx * 0.0007);
        }
        plane.position.x = Math.sin(t * (0.11 + idx * 0.05)) * (45 + idx * 25);
        plane.position.y += Math.sin(t * (0.32 + idx * 0.08)) * 0.045;
      });

      if (glitter) {
        glitter.rotation.y = t * 0.017;
        glitter.rotation.x = Math.sin(t * 0.08) * 0.04;
      }

      if (pressedKeys.size > 0) {
        const worldUp = new THREE.Vector3(0, 1, 0);
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        if (forward.lengthSq() < 1e-6) forward.set(0, 0, -1);
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(worldUp, forward).normalize();

        const moveH = new THREE.Vector3();
        if (pressedKeys.has('w')) moveH.add(forward);
        if (pressedKeys.has('s')) moveH.sub(forward);
        if (pressedKeys.has('d')) moveH.sub(right);
        if (pressedKeys.has('a')) moveH.add(right);

        const moveV = new THREE.Vector3();
        if (pressedKeys.has('e')) moveV.add(worldUp);
        if (pressedKeys.has('q')) moveV.sub(worldUp);

        let moveDir = new THREE.Vector3();
        if (moveH.lengthSq() > 0 && moveV.lengthSq() > 0) {
          moveH.normalize();
          moveV.normalize();
          moveDir.addScaledVector(moveH, 1 / Math.SQRT2);
          moveDir.addScaledVector(moveV, 1 / Math.SQRT2);
        } else if (moveH.lengthSq() > 0) {
          moveDir.copy(moveH).normalize();
        } else if (moveV.lengthSq() > 0) {
          moveDir.copy(moveV).normalize();
        }

        if (moveDir.lengthSq() > 0) {
          moveDir.multiplyScalar(9);
          camera.position.add(moveDir);
          controls.target.add(moveDir);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      sim.stop();
      controls.dispose();
      fogPlanes.forEach(p => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      glitter?.geometry.dispose();
      glitterMaterial?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [compact, graphData, onNodeSelect]);

  const handleZoomIn = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.multiplyScalar(0.86);
  };
  const handleZoomOut = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.multiplyScalar(1.16);
  };
  const handleReset = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 80, 1200);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q || !cameraRef.current || !controlsRef.current) return;
    const hit = graphData.nodes.find(n => n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q));
    if (!hit) return;
    const dist = 220 + hit.r * 8;
    cameraRef.current.position.set((hit.x ?? 0) + dist, (hit.y ?? 0) + dist * 0.16, (hit.z ?? 0) + dist);
    controlsRef.current.target.set(hit.x ?? 0, hit.y ?? 0, hit.z ?? 0);
    controlsRef.current.update();
  };

  return (
    <div ref={containerRef} className={compact ? 'graph-container graph-compact' : 'graph-container'}>
      {!compact && (
        <div className="hdr">
          <h1>MDD // KNOWLEDGE GRAPH</h1>
          <p>d3-force-3d + three.js renderer</p>
        </div>
      )}

      {!compact && (
        <div className="search-box">
          <input className="search-input" placeholder="> search nodes..." onChange={handleSearch} />
        </div>
      )}

      <div className={compact ? 'ctrls ctrls-compact' : 'ctrls'}>
        <button className="cbtn" onClick={handleZoomIn}>+</button>
        <button className="cbtn" onClick={handleZoomOut}>−</button>
        <button className="cbtn" onClick={handleReset}>⊙</button>
      </div>

      <div ref={tooltipRef} className="tooltip">
        <div className="tt-cat" id="tt-cat" />
        <div className="tt-name" id="tt-name" />
        <div className="tt-body" id="tt-body" />
      </div>

      {!compact && (
        <div ref={panelRef} className="panel">
          <button className="pan-close" id="pan-close" onClick={e => { e.stopPropagation(); panelRef.current?.classList.remove('on'); }}>×</button>
          <div className="pan-cat" id="pan-cat" />
          <div className="pan-name" id="pan-name" />
          <div className="pan-body" id="pan-body" />
          <div className="pan-links-label" id="pan-links-label" />
          <div id="pan-links" />
        </div>
      )}

      {!compact && (
        <div className="legend">
          <div className="leg-h">◈ realm layers (3d)</div>
          {STACK_REALM_ORDER.map(id => (
            <div key={id} className="leg-r">
              <span className="leg-code">[R]</span>
              {NODES.find(n => n.id === id)?.label ?? id}
            </div>
          ))}
        </div>
      )}

      <div className="count">{NODES.length} nodes // {LINKS.length} edges // d3-force-3d</div>
    </div>
  );
}
