'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import WikiArticle from './components/WikiArticle';
import { GraphNode, NODES } from './data/graph';

const KnowledgeGraph = dynamic(() => import('./components/KnowledgeGraph'), { ssr: false });

type MainView = 'home' | 'article' | 'graph';

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

const FONT_SCALES = [0.8, 0.9, 1.0, 1.1, 1.2, 1.35];
const DEFAULT_FONT_IDX = 3;

export default function Page() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [mainView, setMainView] = useState<MainView>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fontIdx, setFontIdx] = useState(DEFAULT_FONT_IDX);

  const nodesByType: Record<string, GraphNode[]> = {};
  NODES.forEach(n => {
    if (!nodesByType[n.type]) nodesByType[n.type] = [];
    nodesByType[n.type].push(n);
  });

  const handleNodeSelect = (node: GraphNode | null) => {
    setSelectedNode(node);
    setMainView(node ? 'article' : 'home');
  };

  const handleHome = () => {
    setSelectedNode(null);
    setMainView('home');
  };

  const handleGraph = () => {
    setMainView('graph');
  };

  return (
    <div className="wiki-layout" style={{ '--font-scale': FONT_SCALES[fontIdx] } as React.CSSProperties}>

      {/* Top bar */}
      <header className="wiki-topbar">
        <button
          className="wiki-menu-btn"
          onClick={() => setSidebarOpen(v => !v)}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          ☰
        </button>

        <div className="wiki-logo">
          <span className="wiki-logo-mdd">MDD</span>
          <span className="wiki-logo-sep">//</span>
          <span className="wiki-logo-name">Knowledge Base</span>
        </div>

        {mainView === 'article' && selectedNode && (
          <div className="wiki-topbar-crumb">
            <span className="wiki-topbar-type">
              {TYPE_CODES[selectedNode.type]}
            </span>
            <span className="wiki-topbar-label"> {selectedNode.label}</span>
          </div>
        )}

        <div className="wiki-font-controls">
          <button
            className="wiki-font-btn wiki-font-btn--dec"
            onClick={() => setFontIdx(i => Math.max(0, i - 1))}
            disabled={fontIdx === 0}
            title="Decrease font size"
          >A−</button>
          <button
            className="wiki-font-btn wiki-font-btn--inc"
            onClick={() => setFontIdx(i => Math.min(FONT_SCALES.length - 1, i + 1))}
            disabled={fontIdx === FONT_SCALES.length - 1}
            title="Increase font size"
          >A+</button>
        </div>

        <button
          className={`wiki-graph-btn${mainView === 'graph' ? ' active' : ''}`}
          onClick={handleGraph}
        >
          [graph]
        </button>

        <button className="wiki-home-btn" onClick={handleHome}>
          [index]
        </button>
      </header>

      <div className="wiki-body">

        {/* Left sidebar — always shows the node index */}
        {sidebarOpen && (
          <aside className="wiki-sidebar">
            <div className="sidebar-label">◈ index</div>
            <div className="node-index">
              {Object.entries(nodesByType).map(([type, nodes]) => (
                <div key={type} className="idx-section">
                  <div className="idx-section-title">
                    {TYPE_CODES[type]} {TYPE_LABELS[type] || type}
                  </div>
                  {nodes.map(n => (
                    <button
                      key={n.id}
                      className={`idx-node${selectedNode?.id === n.id && mainView === 'article' ? ' active' : ''}`}
                      onClick={() => handleNodeSelect(n)}
                    >
                      <span className="idx-type-code">{TYPE_CODES[n.type]}</span>
                      {n.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Main content area */}
        <main className={`wiki-main${mainView === 'graph' ? ' wiki-main--graph' : ''}`}>
          {mainView === 'graph' ? (
            <KnowledgeGraph onNodeSelect={handleNodeSelect} />
          ) : (
            <WikiArticle node={selectedNode} onNodeSelect={handleNodeSelect} />
          )}
        </main>

      </div>
    </div>
  );
}
