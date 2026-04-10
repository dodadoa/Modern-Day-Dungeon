'use client';

import { GraphNode, NODES, LINKS } from '../data/graph';

interface Props {
  node: GraphNode | null;
  onNodeSelect: (node: GraphNode | null) => void;
}

const TYPE_LABELS: Record<string, string> = {
  realm:     'Realm',
  faction:   'Faction',
  outer:     'Outer God',
  lore:      'Lore / Concept',
  danger:    'Danger / Unknown',
  mechanism: 'Mechanism',
  creature:  'Creature',
};

const TYPE_CODES: Record<string, string> = {
  realm:     '[R]',
  faction:   '[F]',
  outer:     '[O]',
  lore:      '[L]',
  danger:    '[!]',
  mechanism: '[M]',
  creature:  '[C]',
};

const LINK_LABELS: Record<string, string> = {
  stack:    'stacked above',
  controls: 'controls',
  belongs:  'belongs to',
  searches: 'seeks',
  opposes:  'opposes',
  uses:     'uses',
  contains: 'contains',
  generates:'generates',
  inhabits: 'inhabits',
};

export default function WikiArticle({ node, onNodeSelect }: Props) {
  if (!node) {
    const nodesByType: Record<string, GraphNode[]> = {};
    NODES.forEach(n => {
      if (!nodesByType[n.type]) nodesByType[n.type] = [];
      nodesByType[n.type].push(n);
    });

    return (
      <div className="wiki-home">

        <div className="wiki-home-header">
          <div className="wiki-home-symbol">◈</div>
          <div className="wiki-home-brand">
            <span className="wiki-home-brand-mdd">MDD</span>
            <span className="wiki-home-brand-sep"> // </span>
            <span className="wiki-home-brand-name">KNOWLEDGE BASE</span>
          </div>
          <div className="wiki-home-tagline">Modern Day Dungeon · The Subterranean Labyrinth</div>
        </div>

        <div className="wiki-home-stats">
          <span className="wiki-home-stat">▸ {NODES.length} entities indexed</span>
          <span className="wiki-home-stat-sep">//</span>
          <span className="wiki-home-stat">▸ {LINKS.length} connections mapped</span>
          <span className="wiki-home-stat-sep">//</span>
          <span className="wiki-home-stat wiki-home-stat--status">▸ STATUS: ACTIVE</span>
        </div>

        <div className="wiki-categories">
          {Object.entries(nodesByType).map(([type, nodes]) => (
            <div key={type} className="wiki-category-card">
              <div className="wiki-cat-header">
                <span className="wiki-cat-code">{TYPE_CODES[type]}</span>
                <span className="wiki-cat-name">{TYPE_LABELS[type] || type}</span>
                <span className="wiki-cat-count">x{nodes.length}</span>
              </div>
              <div className="wiki-cat-nodes">
                {nodes.map(n => (
                  <button
                    key={n.id}
                    className="wiki-cat-node"
                    onClick={() => onNodeSelect(n)}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const nodeMap = new Map(NODES.map(n => [n.id, n]));
  const outgoing: Record<string, GraphNode[]> = {};
  const incoming: Record<string, GraphNode[]> = {};

  LINKS.forEach(l => {
    if (l.s === node.id) {
      if (!outgoing[l.type]) outgoing[l.type] = [];
      const target = nodeMap.get(l.t);
      if (target) outgoing[l.type].push(target);
    }
    if (l.t === node.id) {
      if (!incoming[l.type]) incoming[l.type] = [];
      const source = nodeMap.get(l.s);
      if (source) incoming[l.type].push(source);
    }
  });

  const hasConnections = Object.keys(outgoing).length > 0 || Object.keys(incoming).length > 0;

  return (
    <article className="wiki-article">
      <nav className="wiki-breadcrumb">
        <button className="wiki-bc-home" onClick={() => onNodeSelect(null)}>INDEX</button>
        <span className="wiki-bc-sep"> // </span>
        <span className="wiki-bc-type">
          {TYPE_CODES[node.type]} {TYPE_LABELS[node.type] || node.type}
        </span>
        <span className="wiki-bc-sep"> // </span>
        <span className="wiki-bc-current">{node.label}</span>
      </nav>

      <header className="wiki-article-header">
        <div className="wiki-type-badge">
          {TYPE_CODES[node.type]} {TYPE_LABELS[node.type] || node.type}
        </div>
        <h1 className="wiki-article-title">
          {node.label}
        </h1>
        <hr className="wiki-article-title-rule" />
      </header>

      <div className="wiki-article-body">
        <p className="wiki-article-desc">{node.desc}</p>
      </div>

      {hasConnections && (
        <section className="wiki-connections">
          <h2 className="wiki-connections-title">◈ RELATED ENTITIES</h2>
          <div className="wiki-conn-table">

            {Object.entries(outgoing).map(([type, nodes]) => (
              nodes.map((n, i) => (
                <div key={`out-${type}-${n.id}`} className="wiki-conn-row">
                  {i === 0 ? (
                    <span className="wiki-conn-type">{LINK_LABELS[type] || type}</span>
                  ) : (
                    <span className="wiki-conn-type" />
                  )}
                  <span className="wiki-conn-arrow wiki-conn-out">→</span>
                  <button
                    className="wiki-conn-node"
                    onClick={() => onNodeSelect(n)}
                  >
                    {n.label}
                  </button>
                  <span className="wiki-conn-nodetype">{TYPE_CODES[n.type]}</span>
                </div>
              ))
            ))}

            {Object.entries(incoming).map(([type, nodes]) => (
              nodes.map((n, i) => (
                <div key={`in-${type}-${n.id}`} className="wiki-conn-row">
                  {i === 0 ? (
                    <span className="wiki-conn-type">{LINK_LABELS[type] || type}</span>
                  ) : (
                    <span className="wiki-conn-type" />
                  )}
                  <span className="wiki-conn-arrow wiki-conn-in">←</span>
                  <button
                    className="wiki-conn-node"
                    onClick={() => onNodeSelect(n)}
                  >
                    {n.label}
                  </button>
                  <span className="wiki-conn-nodetype">{TYPE_CODES[n.type]}</span>
                </div>
              ))
            ))}

          </div>
        </section>
      )}
    </article>
  );
}
