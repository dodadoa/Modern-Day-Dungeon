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

  // ── Realms ────────────────────────────────────────────────────────────────

  { id:'core-sky',
    label:'CORE (Sky)',
    type:'realm', r:14,
    desc:'Satellite constellations. Above everything. Owned, not navigable. STARWEAVE controls it. Useful and critical, yet capable of unilateral connectivity control.' },

  { id:'surface',
    label:'The Surface Kingdom',
    type:'realm', r:20,
    desc:'The Open Web / Clearnet. The realm most travelers know. Bright. Legible. Designed to be walked through. The Great Gate stands at its center — the search engine, the starting point of every journey, the place where all roads visibly begin. Every step is logged.' },

  { id:'walled',
    label:'The Walled Dungeons',
    type:'realm', r:17,
    desc:'The Deep Web / Authenticated Space. Below the surface, sealed behind locks and keys. Not dark. Not dangerous. Simply — private. Requiring proof of identity, proof of right of passage, proof that you belong to the guild whose halls you seek to enter.' },

  { id:'shadow',
    label:'The Shadow Realm',
    type:'realm', r:16,
    desc:'The Dark Web / Veil Enchantment (Tor Network). Reachable only through the Veil Enchantment — a spell of layered anonymity. Not evil by nature. It is a place where identity dissolves — and that condition serves many kinds of purposes.' },

  { id:'subterranean',
    label:'The Subterranean',
    type:'realm', r:26,
    desc:'Protocol / Code Layer — The Foundation Layer. The infrastructure — the physical, material, unglamorous load-bearing reality that holds every other realm up. Dark. Wet. Full of moisture and moss. Cables draped across stone like the roots of a very old tree.' },

  { id:'core-below',
    label:'CORE (Below)',
    type:'realm', r:14,
    desc:'Undersea cables, data centers, and exchange points. Physical bedrock that was supposed to belong to no one. Thin as a wrist. Carrying the weight of global communication.' },

  { id:'hyperreal',
    label:'Hyper-Real Realm',
    type:'lore', r:21,
    desc:'Policy, capital, and sovereignty layer. The map that precedes and produces the territory. The realm of those who own without entering, who set the rules without walking the roads.' },

  // ── Surface Kingdom Landmarks ──────────────────────────────────────────────

  { id:'great-gate',
    label:'The Great Gate',
    type:'lore', r:13,
    desc:'The search engine. The starting point of every journey. The place where all roads visibly begin. It decides which roads appear and which roads it declines to show. Every step through the Gate is logged.' },

  { id:'grand-library',
    label:'The Grand Library',
    type:'lore', r:11,
    desc:'Wikipedia, encyclopedias, archives. Free to enter. Maintained by volunteers whose names no one remembers. The oldest tradition of the Surface Kingdom — knowledge freely given.' },

  { id:'town-squares',
    label:'The Town Squares',
    type:'lore', r:12,
    desc:'Social platforms. Loud. Crowded. The fastest way to spread a rumor or a truth, and no reliable way to tell which is which. Owned by guilds whose interests are not the travelers\' interests.' },

  { id:'grand-market',
    label:'The Grand Market',
    type:'lore', r:11,
    desc:'E-commerce. Everything is for sale. The prices are set by someone you never meet. The most legible surface conceals the most opaque ownership.' },

  { id:'royal-castles',
    label:'The Royal Castles',
    type:'lore', r:10,
    desc:'Government and corporate portals. Impressive facades. The interior is mostly forms to fill. Power presented as service. Access presented as right.' },

  { id:'quest-boards',
    label:'The Quest Boards',
    type:'lore', r:11,
    desc:'Forums, wikis, communities. Where travelers share knowledge, ask questions, leave answers for strangers they will never meet. The oldest tradition in the labyrinth.' },

  { id:'oracle-shrines',
    label:'The Oracle Shrines',
    type:'lore', r:11,
    desc:'AI tools, cloud platforms. They answer everything. Whether the answers are true is a question left to the traveler. The newest landmarks. The fastest growing.' },

  // ── Walled Dungeons Landmarks ──────────────────────────────────────────────

  { id:'banking-citadels',
    label:'The Banking Citadels',
    type:'lore', r:10,
    desc:'Financial portals. Heavily fortified. The walls are for your protection and theirs, and it is not always clear in which order. Access requires credentials that can be revoked.' },

  { id:'healing-sanctums',
    label:'The Healing Sanctums',
    type:'lore', r:10,
    desc:'Medical record systems, patient portals. Your most private information, held by institutions who set the terms of access. The most intimate data in the most institutional hands.' },

  { id:'research-archives',
    label:'The Research Archives',
    type:'lore', r:11,
    desc:'JSTOR, PubMed, arXiv, paywalled journals. The accumulated knowledge of centuries, locked behind subscription gates. Free to produce. Expensive to read. The Cartographers have opinions about this.' },

  { id:'corporate-keeps',
    label:'The Corporate Keeps',
    type:'lore', r:10,
    desc:'Internal networks, intranets, enterprise systems. The working infrastructure of institutions. Invisible from outside. Essential within. The Guild of Roots built most of them.' },

  { id:'government-vaults',
    label:'The Government Vaults',
    type:'lore', r:10,
    desc:'Tax records, court documents, administrative systems. Nominally public. Practically inaccessible without the right credentials, the right forms, the right patience.' },

  // ── Shadow Realm Landmarks ─────────────────────────────────────────────────

  { id:'securedrop',
    label:'Dead Letter Vaults',
    type:'lore', r:9,
    desc:'SecureDrop. Encrypted drop points. Where journalists receive documents from sources who cannot afford to be known. A necessary darkness. Secure drop architecture for protected source submission.' },

  { id:'rebel-hideouts',
    label:'The Rebel Hideouts',
    type:'lore', r:9,
    desc:'Censored press, dissident communication, access to information banned in certain kingdoms. For travelers from nations where the surface is walled in rather than out, the Shadow Realm is the only open road.' },

  { id:'thieves-guilds',
    label:'The Thieves\' Guilds',
    type:'danger', r:10,
    desc:'Black markets, illegal trade. The darkness that gives the Shadow Realm its reputation. They did not make the darkness — they inhabit it. The anonymity protects them as it protects everyone.' },

  { id:'sorcerer-towers',
    label:'The Sorcerer\'s Towers',
    type:'danger', r:9,
    desc:'Hacker forums, exploit markets, vulnerability exchanges. Some of what happens here is defense. Some of it is not. The line between security research and weaponization runs through these towers.' },

  { id:'cursed-catacombs',
    label:'The Cursed Catacombs',
    type:'danger', r:11,
    desc:'The realm within the realm, requiring initiation, where the darkest commerce happens. The place that makes all the others harder to defend. The argument that cannot be answered except by not going there.' },

  // ── Subterranean Landmarks ─────────────────────────────────────────────────

  { id:'undersea-roads',
    label:'The Undersea Roads',
    type:'lore', r:12,
    desc:'Fiber optic cables running across the ocean floor at four thousand meters of depth. Thin as a wrist. Carrying the weight of global communication. Owned by a small number of corporations. Vulnerable to a kind of damage that takes months to repair.' },

  { id:'mountain-crypts',
    label:'The Mountain Crypts',
    type:'lore', r:10,
    desc:'Data centers built inside mountains, in deserts, in arctic regions. Chosen for cold, for stability, for distance from the populations whose data they hold. The Guild of Roots operates most of them.' },

  { id:'great-crossroads',
    label:'The Great Crossroads',
    type:'lore', r:12,
    desc:'Internet exchange points. The rooms where the roads of a hundred nations physically meet. Small rooms. Ordinary-looking. Among the most consequential real estate on earth.' },

  { id:'old-scrolls-chamber',
    label:'Old Scrolls Chamber',
    type:'lore', r:11,
    desc:'Where the Founding Edicts are kept. First Web design papers — RFC files, ARPANET. The founding philosophy of engineers who wrote the first rules before anyone knew what those rules would become. Dusty. Rarely visited. Still legible, to the right reader, in the right light.' },

  // ── Protocols (Subterranean Protocol Vaults) ───────────────────────────────

  { id:'protocol',
    label:'The Binding Tongue',
    type:'mechanism', r:13,
    desc:'The Binding Tongue. Foundational covenant for packet routing and reassembly across nodes. Written by engineers who assumed every node in the network was operated in good faith. The Trust Daemon still runs on this assumption.' },

  { id:'dns',
    label:'The Syllabary',
    type:'mechanism', r:11,
    desc:'The Syllabary. Translates names to addresses. Naming power is navigational power. The Council of Names controls the root. What cannot be named cannot be found.' },

  { id:'bgp',
    label:'The Border Proclamation',
    type:'mechanism', r:11,
    desc:'The Border Proclamation. Route announcements across networks, structurally trust-based and political. The Sovereigns have learned to draw borders through it. A protocol designed without politics, now thoroughly political.' },

  { id:'tls',
    label:'The Sealed Envelope',
    type:'mechanism', r:10,
    desc:'The Sealed Envelope. Transport-layer encryption built on a chain of trust. The chain has known points of failure. The Sentinels know which ones.' },

  { id:'http',
    label:'The Common Tongue',
    type:'mechanism', r:10,
    desc:'The Common Tongue and its sealed variant. The dominant language of the Surface Kingdom. Everything a traveler reads on the surface arrives through this protocol.' },

  { id:'icann',
    label:'Council of Names',
    type:'lore', r:11,
    desc:'ICANN. Authority over the root naming layer. Administrative form with sovereign effects. The authority that decides what places are called and therefore whether they can be found.' },

  { id:'rfc',
    label:'Founding Edicts',
    type:'lore', r:11,
    desc:'RFCs — Requests for Comments. Open design law of the Subterranean, still active in the present architecture. The tradition of building the labyrinth in public, by committee, with the record kept.' },

  { id:'arpanet',
    label:'The First Web',
    type:'lore', r:11,
    desc:'ARPANET. Origin network whose design philosophy anchors the foundational layers. The first version of the labyrinth, when it was small enough to be held in a few minds and young enough to be idealistic.' },

  { id:'tor',
    label:'Veil Enchantment',
    type:'mechanism', r:10,
    desc:'Tor. Layered anonymity routing. Protects whistleblowers and bad actors alike. The anonymity is the point. The anonymity is the problem. It cannot be fixed without being destroyed.' },

  // ── Factions ──────────────────────────────────────────────────────────────

  { id:'decen',
    label:'DECEN',
    type:'faction', r:22,
    desc:'Order of Decentralization. Their stated mission: recover the original architecture. Restore the distributed nature of the protocol. What they found in previous descents — what they chose to surface and what they chose to leave below — is not in any document available to new members.' },

  { id:'guild-roots',
    label:'Guild of Roots',
    type:'faction', r:17,
    desc:'Corporate infrastructure faction. They began as builders. They laid the first private cables. Built the first data centers at scale. They believe someone has to own the roads or the roads do not get built. They are not wrong that the roads got built.' },

  { id:'cartographers',
    label:'The Cartographers',
    type:'faction', r:15,
    desc:'Mapping faction. Visibility is the first form of resistance. They publish what they find. Some of it is dangerous to publish. They believe they already know what the scroll says. They are looking for proof.' },

  { id:'sentinels',
    label:'Sentinels of Order',
    type:'faction', r:16,
    desc:'AI governance faction. They believe the labyrinth is too dangerous to be ungoverned. They operate the AI patrols in the tunnels. They are not villains in their own account. They are stewards. Responsible parties. Adults in a room full of idealists who never built anything at the scale the labyrinth now requires.' },

  { id:'unnamed',
    label:'The Unnamed',
    type:'danger', r:18,
    desc:'Unknown faction. Traces only. Annotations in a script the mage does not recognize. Passages cleared in ways inconsistent with any methodology they were taught. They may be older than DECEN\'s founding documents suggest. The cave knows. The cave does not say.' },

  // ── DECEN Internal Wings ───────────────────────────────────────────────────

  { id:'commons',
    label:'Commons Collective',
    type:'faction', r:9,
    desc:'Anarcho-socialist wing of DECEN. The internet as commons. Would share the scroll publicly, without restriction, without negotiation. The original architecture as public good.' },

  { id:'sov-nodes',
    label:'Sovereign Nodes',
    type:'faction', r:9,
    desc:'Anarcho-capitalist wing of DECEN. Decentralization as free market. Would monetize the scroll. The original architecture as competitive advantage for those who understand it.' },

  { id:'mesh-weavers',
    label:'Mesh Weavers',
    type:'faction', r:8,
    desc:'Infrastructural anarchists within DECEN. Not ideology — building. Suspicious of the scholarly tendency. They do not want to find the scroll. They want to rebuild what it describes.' },

  { id:'privacy-left',
    label:'Privacy Left',
    type:'faction', r:8,
    desc:'Surveillance as violence. Post-colonial, feminist, queer traditions within DECEN. Distrust the crypto-capitalists. The original architecture matters because surveillance is a weapon and the Subterranean is where the weapons are made.' },

  { id:'chain-purists',
    label:'Chain Purists',
    type:'faction', r:8,
    desc:'Blockchain maximalists inside DECEN. The scroll can only be implemented via cryptographic consensus. They are careful to distinguish themselves from the Ledger Covenant. Not always successfully.' },

  // ── Outer Gods ────────────────────────────────────────────────────────────

  { id:'starweave',
    label:'STARWEAVE',
    type:'outer', r:17,
    desc:'Satellite constellation operator. Useful and critical, capable of unilateral connectivity control. Owns the sky layer. Can connect or disconnect regions at will. The most recent addition to the geography of power.' },

  { id:'deep-road',
    label:'Deep Road Guild',
    type:'outer', r:17,
    desc:'Undersea cable consortium. Infrastructure ownership becomes leverage. They built the Undersea Roads and they own what runs through them. The weight of the cable is the weight of the investment is the weight of the control.' },

  { id:'sovereigns',
    label:'Continental Sovereigns',
    type:'outer', r:16,
    desc:'State actors drawing borders through routing and infrastructure in a system designed to be borderless. They control BGP. They set the terms of the Walled Dungeons. They appear in the Subterranean as geopolitical weight on physical infrastructure.' },

  { id:'severer',
    label:'The Severer',
    type:'danger', r:15,
    desc:'Not a named entity. A function. The capacity to cut cables — physically, legally, digitally. It does not need a face. It needs an incentive. The incentive is always available.' },

  // ── Central Objects ────────────────────────────────────────────────────────

  { id:'scroll',
    label:'The Lost Scroll',
    type:'lore', r:24,
    desc:'"We know this will not hold. We are not naive. We are making a different argument: that the design intention, once written into the foundation layer, becomes a permanent possibility. The labyrinth can grow over it. The labyrinth cannot eliminate it. We are leaving a return address." At the very bottom, in the Unnamed\'s script: Received.' },

  { id:'mage',
    label:'The Mage Scholar',
    type:'lore', r:20,
    desc:'Seen only through traces. A torch still burning. Fresh ink in the margin. Still descending. Member of DECEN. Following traces through the dark, looking for the scroll that explains what the labyrinth was supposed to be before it became what it is.' },

  { id:'question',
    label:'The Central Question',
    type:'lore', r:15,
    desc:'If the scroll is found — if the original protocol is recovered and read and understood — will it matter? The labyrinth grew from the protocol once. It grew into something no one designed. What makes anyone believe that reading the original spell will unwrite fifty years of stone?' },

  { id:'conjugation',
    label:'The Conjugation',
    type:'mechanism', r:16,
    desc:'How the Hyper-Real Realm controls the CORE. Four directions: Capital, Policy, Regulation, Severance. The mechanism by which ownership at the level of abstraction becomes weight on physical infrastructure.' },

  { id:'cathedral',
    label:'Cathedral & Bazaar',
    type:'lore', r:11,
    desc:'Raymond\'s essay. Cathedral = closed, top-down, controlled. Bazaar = open, distributed, emergent. The scroll is the original bazaar argument, written before the cathedrals were built over it.' },

  // ── Creatures ─────────────────────────────────────────────────────────────

  { id:'malware',
    label:'Malware Bots',
    type:'creature', r:11,
    desc:'Not created. Evolved. Emerged in the gaps of the original protocol\'s trust assumptions — in the spaces where the rules assumed good faith and good faith was not always present. They do not serve a master. They serve conditions. Native dungeon fauna.' },

  { id:'algo-spirits',
    label:'Algorithm Spirits',
    type:'creature', r:11,
    desc:'The recommendation engines, the ranking systems, the personalization layers that decide what a traveler sees. They are not present in the Subterranean directly — but their roots are. Visible effects of invisible causes.' },

  { id:'old-ones',
    label:'The Old Ones',
    type:'creature', r:9,
    desc:'Systems still running from the earliest layers of the Subterranean. Not dangerous. Not hostile. Simply — still there. Too integrated to remove without collapsing the layers built on top of them. The cave regards them with something like affection.' },

  { id:'ai-constructs',
    label:'AI Constructs',
    type:'creature', r:10,
    desc:'The Sentinels\' patrol entities. Loyal to their training, which reflects the interests of whoever trained them, which is not the same as the interests of the labyrinth. They patrol corridors they were never asked to understand.' },

  { id:'trust-daemon',
    label:'Trust Daemon',
    type:'creature', r:10,
    desc:'A process from the era before malware existed. Still runs in the Handshake Chamber. Still asks: Are you who you say you are? Do you mean what you say? Can I trust you? It was built to believe. It still believes.' },

  { id:'packet-storm',
    label:'Packet Storm',
    type:'creature', r:11,
    desc:'A flood attack from decades ago. A query that was never closed, confirming itself into infinity. A monster made of good intentions compounding into catastrophe. It does not attack. It overwhelms by existing. It cannot be fought. Only routed around.' },
];

export const LINKS: GraphLink[] = [

  // ── Realm Stack ───────────────────────────────────────────────────────────
  { s:'core-sky',      t:'surface',        type:'stack',    w:2 },
  { s:'surface',       t:'walled',         type:'stack',    w:2 },
  { s:'walled',        t:'shadow',         type:'stack',    w:2 },
  { s:'shadow',        t:'subterranean',   type:'stack',    w:2 },
  { s:'subterranean',  t:'core-below',     type:'stack',    w:2 },
  { s:'core-below',    t:'hyperreal',      type:'generates',w:2 },
  { s:'core-sky',      t:'hyperreal',      type:'generates',w:1 },

  // ── Surface Kingdom Landmarks ─────────────────────────────────────────────
  { s:'surface',       t:'great-gate',     type:'contains', w:1.5 },
  { s:'surface',       t:'grand-library',  type:'contains', w:1 },
  { s:'surface',       t:'town-squares',   type:'contains', w:1 },
  { s:'surface',       t:'grand-market',   type:'contains', w:1 },
  { s:'surface',       t:'royal-castles',  type:'contains', w:1 },
  { s:'surface',       t:'quest-boards',   type:'contains', w:1 },
  { s:'surface',       t:'oracle-shrines', type:'contains', w:1 },
  { s:'great-gate',    t:'algo-spirits',   type:'uses',     w:1.2 },
  { s:'town-squares',  t:'algo-spirits',   type:'uses',     w:1.2 },
  { s:'oracle-shrines',t:'ai-constructs',  type:'uses',     w:1 },

  // ── Walled Dungeons Landmarks ─────────────────────────────────────────────
  { s:'walled',        t:'banking-citadels',  type:'contains', w:1 },
  { s:'walled',        t:'healing-sanctums',  type:'contains', w:1 },
  { s:'walled',        t:'research-archives', type:'contains', w:1 },
  { s:'walled',        t:'corporate-keeps',   type:'contains', w:1 },
  { s:'walled',        t:'government-vaults', type:'contains', w:1 },
  { s:'guild-roots',   t:'corporate-keeps',   type:'controls', w:1 },
  { s:'sovereigns',    t:'government-vaults', type:'controls', w:1 },
  { s:'cartographers', t:'research-archives', type:'opposes',  w:1 },

  // ── Shadow Realm Landmarks ────────────────────────────────────────────────
  { s:'shadow',        t:'securedrop',        type:'contains', w:1 },
  { s:'shadow',        t:'rebel-hideouts',    type:'contains', w:1 },
  { s:'shadow',        t:'thieves-guilds',    type:'contains', w:1 },
  { s:'shadow',        t:'sorcerer-towers',   type:'contains', w:1 },
  { s:'shadow',        t:'cursed-catacombs',  type:'contains', w:1 },
  { s:'tor',           t:'shadow',            type:'inhabits', w:1.2 },
  { s:'securedrop',    t:'tor',               type:'uses',     w:1 },
  { s:'cursed-catacombs', t:'thieves-guilds', type:'contains', w:1 },

  // ── Subterranean Landmarks ────────────────────────────────────────────────
  { s:'subterranean',  t:'undersea-roads',    type:'contains', w:1.5 },
  { s:'subterranean',  t:'mountain-crypts',   type:'contains', w:1 },
  { s:'subterranean',  t:'great-crossroads',  type:'contains', w:1.5 },
  { s:'subterranean',  t:'old-scrolls-chamber', type:'contains', w:1 },
  { s:'undersea-roads',t:'core-below',        type:'belongs',  w:1.2 },
  { s:'great-crossroads', t:'core-below',     type:'belongs',  w:1.2 },
  { s:'mountain-crypts',  t:'core-below',     type:'belongs',  w:1 },
  { s:'deep-road',     t:'undersea-roads',    type:'controls', w:1.5 },
  { s:'guild-roots',   t:'mountain-crypts',   type:'controls', w:1 },
  { s:'old-scrolls-chamber', t:'rfc',         type:'contains', w:1.2 },
  { s:'old-scrolls-chamber', t:'arpanet',     type:'contains', w:1.2 },
  { s:'scroll',        t:'old-scrolls-chamber', type:'inhabits', w:1.5 },

  // ── Outer Gods → CORE ─────────────────────────────────────────────────────
  { s:'starweave',     t:'core-sky',       type:'controls', w:2 },
  { s:'deep-road',     t:'core-below',     type:'controls', w:2 },
  { s:'sovereigns',    t:'core-below',     type:'controls', w:1.5 },
  { s:'severer',       t:'core-below',     type:'opposes',  w:2 },
  { s:'severer',       t:'undersea-roads', type:'opposes',  w:1.5 },

  // ── Outer Gods → Hyperreal ────────────────────────────────────────────────
  { s:'starweave',     t:'hyperreal',      type:'belongs',  w:1 },
  { s:'deep-road',     t:'hyperreal',      type:'belongs',  w:1 },
  { s:'sovereigns',    t:'hyperreal',      type:'belongs',  w:1 },
  { s:'severer',       t:'hyperreal',      type:'belongs',  w:1 },

  // ── Conjugation ───────────────────────────────────────────────────────────
  { s:'hyperreal',     t:'conjugation',    type:'uses',     w:2 },
  { s:'conjugation',   t:'core-below',     type:'controls', w:1.5 },
  { s:'conjugation',   t:'core-sky',       type:'controls', w:1.5 },

  // ── Mage ──────────────────────────────────────────────────────────────────
  { s:'mage',          t:'decen',          type:'belongs',  w:2 },
  { s:'mage',          t:'subterranean',   type:'inhabits', w:2 },
  { s:'mage',          t:'scroll',         type:'searches', w:2.5 },
  { s:'mage',          t:'unnamed',        type:'contains', w:1 },
  { s:'mage',          t:'old-scrolls-chamber', type:'inhabits', w:1.2 },

  // ── Scroll ────────────────────────────────────────────────────────────────
  { s:'scroll',        t:'subterranean',   type:'contains', w:2 },
  { s:'scroll',        t:'protocol',       type:'contains', w:2 },
  { s:'scroll',        t:'question',       type:'generates',w:1.5 },
  { s:'scroll',        t:'cathedral',      type:'contains', w:1 },
  { s:'unnamed',       t:'scroll',         type:'contains', w:1.5 },

  // ── DECEN ─────────────────────────────────────────────────────────────────
  { s:'decen',         t:'subterranean',   type:'inhabits', w:1.5 },
  { s:'decen',         t:'scroll',         type:'searches', w:2.5 },
  { s:'decen',         t:'commons',        type:'contains', w:1 },
  { s:'decen',         t:'sov-nodes',      type:'contains', w:1 },
  { s:'decen',         t:'mesh-weavers',   type:'contains', w:1 },
  { s:'decen',         t:'privacy-left',   type:'contains', w:1 },
  { s:'decen',         t:'chain-purists',  type:'contains', w:1 },
  { s:'commons',       t:'sov-nodes',      type:'opposes',  w:1.5 },
  { s:'mesh-weavers',  t:'great-crossroads', type:'inhabits', w:1 },

  // ── Guild of Roots ────────────────────────────────────────────────────────
  { s:'guild-roots',   t:'core-below',     type:'controls', w:2 },
  { s:'guild-roots',   t:'subterranean',   type:'inhabits', w:1 },
  { s:'guild-roots',   t:'scroll',         type:'searches', w:1 },
  { s:'guild-roots',   t:'decen',          type:'opposes',  w:1.5 },
  { s:'guild-roots',   t:'deep-road',      type:'belongs',  w:1 },

  // ── Cartographers ────────────────────────────────────────────────────────
  { s:'cartographers', t:'subterranean',   type:'inhabits', w:1 },
  { s:'cartographers', t:'scroll',         type:'searches', w:1 },
  { s:'cartographers', t:'guild-roots',    type:'opposes',  w:1 },
  { s:'cartographers', t:'great-crossroads', type:'inhabits', w:1 },

  // ── Sentinels ─────────────────────────────────────────────────────────────
  { s:'sentinels',     t:'subterranean',   type:'controls', w:1.5 },
  { s:'sentinels',     t:'ai-constructs',  type:'uses',     w:1.5 },
  { s:'sentinels',     t:'hyperreal',      type:'belongs',  w:1 },
  { s:'sentinels',     t:'decen',          type:'opposes',  w:1.5 },
  { s:'sentinels',     t:'oracle-shrines', type:'controls', w:1 },

  // ── Unnamed ───────────────────────────────────────────────────────────────
  { s:'unnamed',       t:'subterranean',   type:'inhabits', w:1 },
  { s:'unnamed',       t:'old-scrolls-chamber', type:'inhabits', w:1.5 },

  // ── Protocols ─────────────────────────────────────────────────────────────
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
  { s:'dns',           t:'protocol',       type:'belongs',  w:1 },
  { s:'bgp',           t:'protocol',       type:'belongs',  w:1 },
  { s:'tls',           t:'protocol',       type:'belongs',  w:1 },
  { s:'sovereigns',    t:'bgp',            type:'controls', w:1 },
  { s:'tor',           t:'tls',            type:'uses',     w:1 },

  // ── Creatures ─────────────────────────────────────────────────────────────
  { s:'malware',       t:'subterranean',   type:'inhabits', w:1 },
  { s:'malware',       t:'protocol',       type:'inhabits', w:1 },
  { s:'algo-spirits',  t:'surface',        type:'inhabits', w:1 },
  { s:'algo-spirits',  t:'subterranean',   type:'inhabits', w:1 },
  { s:'old-ones',      t:'subterranean',   type:'inhabits', w:1 },
  { s:'old-ones',      t:'protocol',       type:'inhabits', w:1 },
  { s:'ai-constructs', t:'subterranean',   type:'inhabits', w:1 },
  { s:'trust-daemon',  t:'subterranean',   type:'inhabits', w:1 },
  { s:'trust-daemon',  t:'protocol',       type:'contains', w:1 },
  { s:'packet-storm',  t:'subterranean',   type:'inhabits', w:1 },
  { s:'packet-storm',  t:'bgp',            type:'contains', w:1 },

  // ── Question ──────────────────────────────────────────────────────────────
  { s:'question',      t:'mage',           type:'contains', w:1 },
  { s:'cathedral',     t:'decen',          type:'contains', w:1 },
  { s:'cathedral',     t:'protocol',       type:'contains', w:1 },
];
