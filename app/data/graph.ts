export const NODE_COLORS: Record<string, string> = {
  realm:     '#aaaaaa',
  faction:   '#aaaaaa',
  outer:     '#aaaaaa',
  lore:      '#aaaaaa',
  danger:    '#aaaaaa',
  mechanism: '#aaaaaa',
  creature:  '#aaaaaa',
};

export const LINK_COLORS: Record<string, string> = {
  stack:    '#444444',
  controls: '#444444',
  belongs:  '#444444',
  searches: '#444444',
  opposes:  '#444444',
  uses:     '#444444',
  contains: '#444444',
  generates:'#444444',
  inhabits: '#444444',
};

export type NodeType = 'realm' | 'faction' | 'outer' | 'lore' | 'danger' | 'mechanism' | 'creature';
export type LinkType = 'stack' | 'controls' | 'belongs' | 'searches' | 'opposes' | 'uses' | 'contains' | 'generates' | 'inhabits';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  r: number;
  desc: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

export interface GraphLink {
  s: string;
  t: string;
  type: LinkType;
  w: number;
  source?: string | GraphNode;
  target?: string | GraphNode;
}

export const NODES: GraphNode[] = [
  // Realms
  { id:'core-sky',     label:'CORE (Sky)',           type:'realm',   r:14, desc:'Satellite constellations. Above everything. Owned, not navigable. STARWEAVE controls it.' },
  { id:'surface',      label:'Surface Kingdom',      type:'realm',   r:17, desc:'The open web and the most legible layer. The Great Gate stands at its center and every step is logged.' },
  { id:'walled',       label:'Walled Dungeons',      type:'realm',   r:13, desc:'Deep web and authenticated space. Not dark by nature, simply private and credential-gated.' },
  { id:'shadow',       label:'Shadow Realm',         type:'realm',   r:13, desc:'The dark web. Tor network. Where identity dissolves. Not evil by nature.' },
  { id:'subterranean', label:'The Subterranean',     type:'realm',   r:24, desc:'Protocol and code layer. Dark, wet, and load-bearing for every realm above. The film enters here.' },
  { id:'core-below',   label:'CORE (Below)',          type:'realm',   r:14, desc:'Undersea cables, data centers, and exchange points. Physical bedrock that was supposed to belong to no one.' },
  { id:'hyperreal',    label:'Hyper-Real Realm',     type:'lore',    r:21, desc:'Policy, capital, and sovereignty layer. The map that precedes and produces the territory.' },

  // Factions
  { id:'decen',        label:'DECEN',                type:'faction', r:21, desc:'Order of Decentralization. They seek the original architecture, but their own history in the tunnels is unresolved.' },
  { id:'guild-roots',  label:'Guild of Roots',       type:'faction', r:16, desc:'Corporate infrastructure faction. They began as builders and now defend ownership through growth logic.' },
  { id:'cartographers',label:'Cartographers',        type:'faction', r:14, desc:'Mapping faction. Visibility is the first form of resistance. They publish dangerous knowledge.' },
  { id:'sentinels',    label:'Sentinels of Order',   type:'faction', r:15, desc:'AI governance faction. They operate patrol systems and insist central control is necessary stewardship.' },
  { id:'unnamed',      label:'The Unnamed',          type:'danger',  r:17, desc:'Unknown faction. Traces only. Annotations in an unrecognized script. The cave knows. Does not say.' },

  // DECEN wings
  { id:'commons',      label:'Commons Collective',   type:'faction', r:9,  desc:'Anarcho-socialist wing. The internet as commons. Would share the scroll publicly.' },
  { id:'sov-nodes',    label:'Sovereign Nodes',      type:'faction', r:9,  desc:'Anarcho-capitalist wing. Decentralization as free market. Would monetize the scroll.' },
  { id:'mesh-weavers', label:'Mesh Weavers',         type:'faction', r:8,  desc:'Infrastructural anarchists. Not ideology — building. Suspicious of scholarly tendency.' },
  { id:'privacy-left', label:'Privacy Left',         type:'faction', r:8,  desc:'Surveillance as violence. Post-colonial, feminist, queer traditions. Distrust crypto-capitalists.' },
  { id:'chain-purists',label:'Chain Purists',        type:'faction', r:8,  desc:'Blockchain maximalists inside DECEN. The scroll can only be implemented via cryptographic consensus.' },

  // Outer Gods
  { id:'starweave',    label:'STARWEAVE',            type:'outer',   r:17, desc:'Satellite constellation operator. Useful and critical, yet capable of unilateral connectivity control.' },
  { id:'deep-road',    label:'Deep Road Guild',      type:'outer',   r:17, desc:'Undersea cable consortium. Infrastructure ownership becomes leverage, platforms become product.' },
  { id:'sovereigns',   label:'Continental Sovereigns',type:'outer',  r:16, desc:'State actors drawing borders through routing and infrastructure in a system designed to be borderless.' },
  { id:'severer',      label:'The Severer',          type:'danger',  r:15, desc:'Not a named entity. A function. The capacity to cut cables — physically, legally, digitally.' },

  // Lore
  { id:'scroll',       label:'The Lost Scroll',      type:'lore',    r:23, desc:'Founding protocol intention. Built as a permanent possibility beneath later layers, not a guarantee.' },
  { id:'mage',         label:'The Mage Scholar',     type:'lore',    r:19, desc:'Seen only through traces. A torch still burning. Fresh ink in the margin. Still descending.' },
  { id:'conjugation',  label:'The Conjugation',      type:'mechanism',r:16,desc:'How the Hyper-Real Realm controls the CORE. Four directions: Capital, Policy, Regulation, Severance.' },
  { id:'question',     label:'The Central Question', type:'lore',    r:14, desc:'If the scroll is found — will it matter? The labyrinth grew from the protocol once.' },
  { id:'protocol',     label:'TCP / IP',             type:'lore',    r:12, desc:'The Binding Tongue: foundational covenant for packet routing and reassembly across nodes.' },
  { id:'dns',          label:'DNS',                  type:'lore',    r:10, desc:'The Syllabary: translates names to addresses. Naming power is navigational power.' },
  { id:'bgp',          label:'BGP',                  type:'lore',    r:10, desc:'The Border Proclamation: route announcements across networks, structurally trust-based and political.' },
  { id:'tls',          label:'TLS / SSL',            type:'lore',    r:9,  desc:'The Sealed Envelope: transport-layer encryption built on a chain of trust.' },
  { id:'http',         label:'HTTP / HTTPS',         type:'lore',    r:9,  desc:'The Common Tongue and its sealed variant; the dominant language of the Surface Kingdom.' },
  { id:'icann',        label:'Council of Names',     type:'lore',    r:10, desc:'ICANN-like authority over the root naming layer; administrative form with sovereign effects.' },
  { id:'rfc',          label:'Founding Edicts',      type:'lore',    r:10, desc:'RFC tradition: open design law of the Subterranean, still active in the present architecture.' },
  { id:'arpanet',      label:'The First Web',        type:'lore',    r:10, desc:'ARPANET-like origin network whose design philosophy anchors the foundational layers.' },
  { id:'tor',          label:'Veil Enchantment',     type:'lore',    r:9,  desc:'Tor-like layered anonymity routing. Protects whistleblowers and bad actors alike.' },
  { id:'securedrop',   label:'Dead Letter Vaults',   type:'lore',    r:8,  desc:'Secure drop architecture for protected source submission and asymmetrical risk transfer.' },
  { id:'cathedral',    label:'Cathedral & Bazaar',   type:'lore',    r:11, desc:"Raymond's essay. Cathedral = closed top-down. Bazaar = open distributed. The scroll is the original bazaar." },

  // Creatures
  { id:'malware',      label:'Malware Bots',         type:'creature',r:11, desc:"Not created. Evolved. Emerged in the gaps of the protocol's trust assumptions. Native dungeon fauna." },
  { id:'algo-spirits', label:'Algorithm Spirits',    type:'creature',r:11, desc:'Recommendation engines. Visible effects of invisible causes. Roots in the Subterranean.' },
  { id:'old-ones',     label:'The Old Ones',         type:'creature',r:9,  desc:'Legacy protocols still running. Too integrated to remove. The cave regards them with affection.' },
  { id:'ai-constructs',label:'AI Constructs',        type:'creature',r:10, desc:"Sentinels' patrol entities. Loyal to training objectives, not to labyrinth equilibrium." },
  { id:'trust-daemon', label:'Trust Daemon',         type:'creature',r:10, desc:'Protocol ghost in the Handshake Chamber, still asking if identities and intentions can be trusted.' },
  { id:'packet-storm', label:'Packet Storm',         type:'creature',r:11, desc:'Recursive amplification entity: a loop that confirms itself into infrastructural turbulence.' },
];

export const LINKS: GraphLink[] = [
  // Stack connections
  { s:'core-sky',      t:'surface',        type:'stack',    w:2 },
  { s:'surface',       t:'walled',         type:'stack',    w:2 },
  { s:'walled',        t:'shadow',         type:'stack',    w:2 },
  { s:'shadow',        t:'subterranean',   type:'stack',    w:2 },
  { s:'subterranean',  t:'core-below',     type:'stack',    w:2 },
  { s:'core-below',    t:'hyperreal',      type:'generates',w:2 },
  { s:'core-sky',      t:'hyperreal',      type:'generates',w:1 },

  // Outer God → CORE
  { s:'starweave',     t:'core-sky',       type:'controls', w:2 },
  { s:'deep-road',     t:'core-below',     type:'controls', w:2 },
  { s:'sovereigns',    t:'core-below',     type:'controls', w:1.5 },
  { s:'severer',       t:'core-below',     type:'opposes',  w:2 },

  // Outer God → Hyperreal
  { s:'starweave',     t:'hyperreal',      type:'belongs',  w:1 },
  { s:'deep-road',     t:'hyperreal',      type:'belongs',  w:1 },
  { s:'sovereigns',    t:'hyperreal',      type:'belongs',  w:1 },
  { s:'severer',       t:'hyperreal',      type:'belongs',  w:1 },

  // Conjugation
  { s:'hyperreal',     t:'conjugation',    type:'uses',     w:2 },
  { s:'conjugation',   t:'core-below',     type:'controls', w:1.5 },
  { s:'conjugation',   t:'core-sky',       type:'controls', w:1.5 },

  // Mage
  { s:'mage',          t:'decen',          type:'belongs',  w:2 },
  { s:'mage',          t:'subterranean',   type:'inhabits', w:2 },
  { s:'mage',          t:'scroll',         type:'searches', w:2.5 },
  { s:'mage',          t:'unnamed',        type:'contains', w:1 },

  // Scroll
  { s:'scroll',        t:'subterranean',   type:'contains', w:2 },
  { s:'scroll',        t:'protocol',       type:'contains', w:2 },
  { s:'scroll',        t:'question',       type:'generates',w:1.5 },
  { s:'scroll',        t:'cathedral',      type:'contains', w:1 },

  // DECEN
  { s:'decen',         t:'subterranean',   type:'inhabits', w:1.5 },
  { s:'decen',         t:'scroll',         type:'searches', w:2.5 },
  { s:'decen',         t:'commons',        type:'contains', w:1 },
  { s:'decen',         t:'sov-nodes',      type:'contains', w:1 },
  { s:'decen',         t:'mesh-weavers',   type:'contains', w:1 },
  { s:'decen',         t:'privacy-left',   type:'contains', w:1 },
  { s:'decen',         t:'chain-purists',  type:'contains', w:1 },
  { s:'commons',       t:'sov-nodes',      type:'opposes',  w:1.5 },

  // Guild of Roots
  { s:'guild-roots',   t:'core-below',     type:'controls', w:2 },
  { s:'guild-roots',   t:'subterranean',   type:'inhabits', w:1 },
  { s:'guild-roots',   t:'scroll',         type:'searches', w:1 },
  { s:'guild-roots',   t:'decen',          type:'opposes',  w:1.5 },
  { s:'guild-roots',   t:'deep-road',      type:'belongs',  w:1 },

  // Cartographers
  { s:'cartographers', t:'subterranean',   type:'inhabits', w:1 },
  { s:'cartographers', t:'scroll',         type:'searches', w:1 },
  { s:'cartographers', t:'guild-roots',    type:'opposes',  w:1 },

  // Sentinels
  { s:'sentinels',     t:'subterranean',   type:'controls', w:1.5 },
  { s:'sentinels',     t:'ai-constructs',  type:'uses',     w:1.5 },
  { s:'sentinels',     t:'hyperreal',      type:'belongs',  w:1 },
  { s:'sentinels',     t:'decen',          type:'opposes',  w:1.5 },

  // Unnamed
  { s:'unnamed',       t:'subterranean',   type:'inhabits', w:1 },
  { s:'unnamed',       t:'scroll',         type:'searches', w:1 },

  // Protocols
  { s:'protocol',      t:'subterranean',   type:'contains', w:1.5 },
  { s:'dns',           t:'subterranean',   type:'contains', w:1 },
  { s:'bgp',           t:'subterranean',   type:'contains', w:1 },
  { s:'tls',           t:'subterranean',   type:'contains', w:1 },
  { s:'http',          t:'surface',        type:'inhabits', w:1 },
  { s:'http',          t:'tls',            type:'uses',     w:1 },
  { s:'icann',         t:'dns',            type:'controls', w:1.2 },
  { s:'rfc',           t:'protocol',       type:'contains', w:1.2 },
  { s:'rfc',           t:'dns',            type:'contains', w:1 },
  { s:'rfc',           t:'bgp',            type:'contains', w:1 },
  { s:'rfc',           t:'tls',            type:'contains', w:1 },
  { s:'arpanet',       t:'rfc',            type:'generates',w:1.2 },
  { s:'tor',           t:'shadow',         type:'inhabits', w:1.2 },
  { s:'securedrop',    t:'tor',            type:'uses',     w:1 },
  { s:'securedrop',    t:'shadow',         type:'inhabits', w:1 },
  { s:'dns',           t:'protocol',       type:'belongs',  w:1 },
  { s:'bgp',           t:'protocol',       type:'belongs',  w:1 },
  { s:'tls',           t:'protocol',       type:'belongs',  w:1 },
  { s:'sovereigns',    t:'bgp',            type:'controls', w:1 },

  // Creatures
  { s:'malware',       t:'subterranean',   type:'inhabits', w:1 },
  { s:'algo-spirits',  t:'surface',        type:'inhabits', w:1 },
  { s:'algo-spirits',  t:'subterranean',   type:'inhabits', w:1 },
  { s:'old-ones',      t:'subterranean',   type:'inhabits', w:1 },
  { s:'ai-constructs', t:'subterranean',   type:'inhabits', w:1 },
  { s:'trust-daemon',  t:'subterranean',   type:'inhabits', w:1 },
  { s:'trust-daemon',  t:'protocol',       type:'contains', w:1 },
  { s:'packet-storm',  t:'subterranean',   type:'inhabits', w:1 },
  { s:'packet-storm',  t:'bgp',            type:'contains', w:1 },

  // Question
  { s:'question',      t:'mage',           type:'contains', w:1 },
  { s:'cathedral',     t:'decen',          type:'contains', w:1 },
  { s:'cathedral',     t:'protocol',       type:'contains', w:1 },
];
