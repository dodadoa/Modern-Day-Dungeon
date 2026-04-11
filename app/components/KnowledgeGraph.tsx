'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { NODES, LINKS, GraphNode, GraphLink } from '../data/graph';


interface Props {
  compact?: boolean;
  onNodeSelect?: (node: GraphNode) => void;
}

interface SimNode extends GraphNode {
  x: number;
  y: number;
  fx: number | null;
  fy: number | null;
  vx: number;
  vy: number;
}

interface SimLink extends GraphLink {
  source: SimNode;
  target: SimNode;
}

interface TooltipData {
  type: string;
  label: string;
  desc: string;
}

interface PanelData {
  type: string;
  label: string;
  desc: string;
  connections: GraphNode[];
}

export default function KnowledgeGraph({ compact, onNodeSelect }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const onNodeSelectRef = useRef(onNodeSelect);
  onNodeSelectRef.current = onNodeSelect;

  const getNeighbors = useCallback((id: string) => {
    const set = new Set<string>([id]);
    LINKS.forEach(l => {
      const s = typeof l.source === 'object' ? (l.source as SimNode).id : l.s;
      const t = typeof l.target === 'object' ? (l.target as SimNode).id : l.t;
      if (s === id) set.add(t);
      if (t === id) set.add(s);
    });
    return set;
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    let W = container.clientWidth;
    let H = container.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');
    gRef.current = g;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5])
      .on('zoom', e => g.attr('transform', e.transform));
    zoomRef.current = zoom;
    svg.call(zoom);

    const defs = svg.append('defs');

    defs.append('marker')
      .attr('id', 'arr')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 20).attr('refY', 5)
      .attr('markerWidth', 5).attr('markerHeight', 5)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M2 2L8 5L2 8')
      .attr('fill', 'none')
      .attr('stroke', '#888')
      .attr('stroke-width', 1.5)
      .attr('stroke-linecap', 'round');

    const nodes: SimNode[] = NODES.map(n => ({ ...n, x: W / 2, y: H / 2, fx: null, fy: null, vx: 0, vy: 0 }));
    const nodeMap = new Map<string, SimNode>(nodes.map(n => [n.id, n]));

    const linkData: SimLink[] = LINKS.map(l => ({
      ...l,
      source: nodeMap.get(l.s)!,
      target: nodeMap.get(l.t)!,
    }));

    const sim = d3.forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(linkData)
        .id(d => d.id)
        .distance(d => 55 + (d.source.r + d.target.r) * 2.8)
        .strength(0.35)
      )
      .force('charge', d3.forceManyBody<SimNode>().strength(d => -d.r * 22).distanceMax(500))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collide', d3.forceCollide<SimNode>().radius(d => d.r + 16))
      .force('x', d3.forceX(W / 2).strength(0.03))
      .force('y', d3.forceY(H / 2).strength(0.03))
      .alphaDecay(0.012);
    simRef.current = sim;

    const linkEl = g.append('g').selectAll<SVGLineElement, SimLink>('line')
      .data(linkData).join('line')
      .attr('class', 'graph-link')
      .attr('stroke', '#666')
      .attr('stroke-width', d => d.w || 1)
      .attr('stroke-opacity', 0.5)
      .attr('marker-end', 'url(#arr)');

    const nodeEl = g.append('g').selectAll<SVGGElement, SimNode>('g')
      .data(nodes).join('g')
      .attr('class', 'graph-node')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, SimNode>()
          .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    nodeEl.filter(d => d.r >= 17)
      .append('circle')
      .attr('r', d => d.r + 6)
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.3)
      .attr('stroke-opacity', 0.08);

    nodeEl.filter(d => d.r >= 21)
      .append('circle')
      .attr('r', d => d.r + 12)
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.2)
      .attr('stroke-opacity', 0.04);

    nodeEl.append('circle')
      .attr('class', 'node-bg')
      .attr('r', d => d.r)
      .attr('fill', '#000')
      .attr('stroke', '#aaa')
      .attr('stroke-width', d => d.r >= 17 ? 1.5 : 1)
      .attr('stroke-opacity', 1);

    nodeEl.append('text')
      .attr('class', 'node-lbl')
      .attr('y', d => d.r + 13)
      .attr('fill', '#aaa')
      .attr('text-anchor', 'middle')
      .attr('font-family', "'Share Tech Mono', monospace")
      .attr('font-size', '10px')
      .attr('pointer-events', 'none')
      .text(d => d.label);

    function pulse(id: string) {
      const nb = getNeighbors(id);
      /* Opacity + color only — per-element feGaussianBlur was very costly while the sim moves nodes. */
      nodeEl.selectAll<SVGCircleElement, SimNode>('circle.node-bg')
        .attr('stroke', function () {
          const d = d3.select<SVGGElement, SimNode>(this.parentNode as SVGGElement).datum();
          return nb.has(d.id) ? '#fff' : '#666';
        })
        .attr('opacity', function () {
          const d = d3.select<SVGGElement, SimNode>(this.parentNode as SVGGElement).datum();
          return nb.has(d.id) ? 1 : 0.48;
        });
      nodeEl.selectAll<SVGTextElement, SimNode>('text.node-lbl')
        .attr('fill', function () {
          const d = d3.select<SVGGElement, SimNode>(this.parentNode as SVGGElement).datum();
          return nb.has(d.id) ? '#fff' : '#6e6e6e';
        })
        .attr('font-size', function () {
          const d = d3.select<SVGGElement, SimNode>(this.parentNode as SVGGElement).datum();
          return nb.has(d.id) ? '11px' : '10px';
        })
        .attr('opacity', function () {
          const d = d3.select<SVGGElement, SimNode>(this.parentNode as SVGGElement).datum();
          return nb.has(d.id) ? 1 : 0.52;
        });
      linkEl
        .attr('stroke-opacity', d => {
          const s = d.source.id, t = d.target.id;
          if (s === id || t === id) return 0.88;
          return 0.26;
        })
        .attr('stroke-width', d => {
          const s = d.source.id, t = d.target.id;
          if (s === id || t === id) return 1.8;
          return d.w || 1;
        });
    }

    function clearHighlight() {
      nodeEl.selectAll<SVGCircleElement, SimNode>('circle.node-bg')
        .attr('stroke', '#aaa')
        .attr('opacity', 1);
      nodeEl.selectAll<SVGTextElement, SimNode>('text.node-lbl')
        .attr('fill', '#aaa')
        .attr('font-size', '10px')
        .attr('opacity', 1);
      linkEl
        .attr('stroke-opacity', 0.5)
        .attr('stroke-width', d => d.w || 1);
    }

    const tooltip = tooltipRef.current;
    const panel = panelRef.current;

    nodeEl
      .on('mouseenter', (e: MouseEvent, d: SimNode) => {
        if (!tooltip) return;
        (tooltip.querySelector('#tt-cat') as HTMLElement).textContent = d.type.toUpperCase();
        (tooltip.querySelector('#tt-name') as HTMLElement).textContent = d.label;
        (tooltip.querySelector('#tt-body') as HTMLElement).textContent = d.desc;
        tooltip.classList.add('on');
        pulse(d.id);
      })
      .on('mousemove', (e: MouseEvent) => {
        if (!tooltip) return;
        const x = e.clientX + 14;
        const y = e.clientY - 10;
        tooltip.style.left = (x + 220 > W ? x - 240 : x) + 'px';
        tooltip.style.top = y + 'px';
      })
      .on('mouseleave', () => {
        if (!tooltip) return;
        tooltip.classList.remove('on');
        clearHighlight();
      })
      .on('click', (e: MouseEvent, d: SimNode) => {
        e.stopPropagation();
        onNodeSelectRef.current?.(d);

        if (!compact && panel) {
          const TYPE_CODES: Record<string, string> = { realm:'[R]', faction:'[F]', outer:'[O]', lore:'[L]', danger:'[!]', mechanism:'[M]', creature:'[C]' };
          const nb = getNeighbors(d.id);
          const connected = NODES.filter(n => nb.has(n.id) && n.id !== d.id);
          (panel.querySelector('#pan-cat') as HTMLElement).textContent = `${TYPE_CODES[d.type] || '[ ]'} ${d.type.toUpperCase()}`;
          const panName = panel.querySelector('#pan-name') as HTMLElement;
          panName.textContent = d.label;
          panName.style.color = '#fff';
          (panel.querySelector('#pan-body') as HTMLElement).textContent = d.desc;
          (panel.querySelector('#pan-links-label') as HTMLElement).textContent = `◈ CONNECTIONS · ${connected.length}`;
          const pl = panel.querySelector('#pan-links') as HTMLElement;
          pl.innerHTML = '';
          connected.forEach(n => {
            const span = document.createElement('span');
            span.className = 'pan-link';
            span.style.color = '#aaa';
            span.textContent = `--> ${TYPE_CODES[n.type] || '[ ]'} ${n.label}`;
            pl.appendChild(span);
          });
          panel.classList.add('on');
        }

        pulse(d.id);
      });

    svg.on('click', () => {
      panel?.classList.remove('on');
      clearHighlight();
    });

    sim.on('tick', () => {
      linkEl
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      nodeEl.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    const t = setTimeout(() => {
      svg.call(zoom.transform, d3.zoomIdentity.translate(W * 0.08, H * 0.08).scale(0.84));
    }, 900);

    const handleResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      sim
        .force('center', d3.forceCenter(W / 2, H / 2))
        .force('x', d3.forceX(W / 2).strength(0.03))
        .force('y', d3.forceY(H / 2).strength(0.03));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', handleResize);
      sim.stop();
    };
  }, [getNeighbors, compact]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.4);
  };
  const handleZoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.72);
  };
  const handleReset = () => {
    if (!svgRef.current || !zoomRef.current || !containerRef.current) return;
    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;
    d3.select(svgRef.current).transition().duration(500)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(0.85).translate(-W / 2, -H / 2));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q || !svgRef.current || !zoomRef.current) return;
    const hit = NODES.find(n => n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q));
    if (hit && hit.x !== undefined && hit.y !== undefined) {
      d3.select(svgRef.current).transition().duration(500).call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(
          (containerRef.current?.clientWidth ?? 800) / 2 - hit.x * 1.3,
          (containerRef.current?.clientHeight ?? 600) / 2 - hit.y * 1.3
        ).scale(1.3)
      );
    }
  };

  return (
    <div ref={containerRef} className={compact ? 'graph-container graph-compact' : 'graph-container'}>
      <svg ref={svgRef} className="graph-svg" />

      {!compact && (
        <div className="hdr">
          <h1>MDD // KNOWLEDGE GRAPH</h1>
          <p>Modern Day Dungeon :: The Subterranean</p>
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
          <div className="leg-h">◈ node types</div>
          {[
            ['[O]', 'Outer God'],
            ['[R]', 'Realm'],
            ['[F]', 'Faction'],
            ['[L]', 'Lore / Concept'],
            ['[!]', 'Danger / Unknown'],
            ['[M]', 'Mechanism'],
            ['[C]', 'Creature'],
          ].map(([code, label]) => (
            <div key={label} className="leg-r">
              <span className="leg-code">{code}</span>
              {label}
            </div>
          ))}
        </div>
      )}

      <div className="count">
        {NODES.length} nodes // {LINKS.length} edges
      </div>
    </div>
  );
}
