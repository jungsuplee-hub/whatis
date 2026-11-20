import { useEffect, useMemo, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, BookmarkCheck,
  BookOpen, Box, BrainCircuit, Check, CheckCircle2, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Compass, Cpu, Database, ExternalLink, Factory,
  GitBranch, Globe2, Hash, Home, Image, Layers3,
  Lightbulb, Menu, MessageSquareText, Network, Orbit, PlugZap,
  Search, Scissors, Server, Share2, ShieldCheck, SlidersHorizontal, Sparkles, TerminalSquare,
  ThumbsUp, Workflow, Wrench, X, FlaskConical, Blocks, ChartNoAxesCombined, Clock3
} from 'lucide-react'
import { categories, categoryById, generalTopics, siemensTopics, siemensSolutions, topicById } from './data'
import type { Area, Category, Topic } from './data'
import './styles.css'

const icons: Record<string, LucideIcon> = {
  brain: BrainCircuit, sparkles: Sparkles, database: Database, workflow: Workflow,
  sliders: SlidersHorizontal, shield: ShieldCheck, layers: Layers3, clipboard: ClipboardCheck,
  box: Box, factory: Factory, chart: ChartNoAxesCombined, network: Network,
  check: CheckCircle2, message: MessageSquareText, 'git-branch': GitBranch,
  hash: Hash, terminal: TerminalSquare, image: Image, orbit: Orbit, search: Search,
  scissors: Scissors, bot: Cpu, wrench: Wrench, plug: PlugZap, history: Clock3,
  thumbs: ThumbsUp, cpu: Cpu, flask: FlaskConical, activity: Activity, server: Server, blocks: Blocks
}
const Icon = ({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) => {
  const Component = icons[name] || Sparkles
  return <Component size={size} strokeWidth={1.8} className={className} aria-hidden="true" />
}
type Route = { area: Area; page: 'home' | 'category' | 'topic' | 'saved'; id?: string }
const parseRoute = (): Route => {
  const pieces = decodeURIComponent(window.location.hash.slice(1)).split('/').filter(Boolean)
  const area: Area = pieces[0] === 'siemens' ? 'siemens' : 'general'
  if (pieces[1] === 'category' && pieces[2] && categoryById(pieces[2])?.area === area) return { area, page: 'category', id: pieces[2] }
  if (pieces[1] === 'saved') return { area, page: 'saved' }
  if (pieces[1] && topicById(pieces[1])?.area === area) return { area, page: 'topic', id: pieces[1] }
  return { area, page: 'home' }
}
const toHash = (next: Route) => '#' + next.area + (next.page === 'topic' ? '/' + next.id : next.page === 'category' ? '/category/' + next.id : next.page === 'saved' ? '/saved' : '')

function App() {
  const [route, setRoute] = useState<Route>(parseRoute)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedStage, setSelectedStage] = useState(0)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('whatis:favorites') || '[]') as string[] } catch { return [] }
  })
  const searchRef = useRef<HTMLInputElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const navigate = (next: Route) => {
    setRoute(next)
    setMobileMenu(false)
    setSearchOpen(false)
    setQuery('')
    setSelectedStage(0)
    const hash = toHash(next)
    if (window.location.hash !== hash) window.location.hash = hash
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  useEffect(() => {
    const handler = () => { setRoute(parseRoute()); setSelectedStage(0); setMobileMenu(false); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true) }
      if (event.key === '/' && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) { event.preventDefault(); setSearchOpen(true) }
      if (event.key === 'Escape') { setSearchOpen(false); setMobileMenu(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])
  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 0) }, [searchOpen])
  useEffect(() => { localStorage.setItem('whatis:favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { if (mainRef.current) mainRef.current.focus({ preventScroll: true }) }, [route])
  const currentTopics = route.area === 'general' ? generalTopics : siemensTopics
  const currentCategories = categories.filter(c => c.area === route.area)
  const currentTopic = route.page === 'topic' ? topicById(route.id ?? '') : undefined
  const currentCategory = route.page === 'category' ? categoryById(route.id ?? '') : undefined
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return generalTopics
    return generalTopics.filter(t => [t.title, t.english, t.summary, t.description, categoryById(t.category)?.title].some(v => v?.toLowerCase().includes(q)))
  }, [query])
  const saved = currentTopics.filter(t => favorites.includes(t.id))
  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  const goTopic = (t: Topic) => navigate({ area: t.area, page: 'topic', id: t.id })
  const goCategory = (c: Category) => navigate({ area: c.area, page: 'category', id: c.id })
  const home = (area: Area = route.area) => navigate({ area, page: 'home' })
  const switchArea = (area: Area) => navigate({ area, page: 'home' })
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { setCopied(false) }
  }
  const [copied, setCopied] = useState(false)
  const docTitle = currentTopic ? currentTopic.title : currentCategory ? currentCategory.title : 'WHATIS'
  useEffect(() => { document.title = docTitle === 'WHATIS' ? 'WHATIS — 기술을 한눈에 이해하다' : docTitle + ' — WHATIS' }, [docTitle])

  return <div className="app-shell">
    <header className="topbar">
      <button className="mobile-toggle icon-button" aria-label="메뉴 열기" onClick={() => setMobileMenu(true)}><Menu size={22}/></button>
      <button className="brand" onClick={() => home('general')} aria-label="WHATIS 홈">
        <span className="brand-mark"><span className="brand-mark-inside">w<span>.</span></span></span>
        <span className="brand-word">whatis<span className="brand-period">.</span><small>VISUAL TECHNOLOGY GUIDE</small></span>
      </button>
      <div className="topbar-center">
        <div className="area-switch" role="group" aria-label="기술 분야 선택">
          <button className={route.area === 'general' ? 'selected' : ''} onClick={() => switchArea('general')}><Sparkles size={15}/> 일반 AI</button>
          <button className={route.area === 'siemens' ? 'selected' : ''} onClick={() => switchArea('siemens')} title="Siemens 기술 영역은 추후 공개 예정"><Layers3 size={15}/> Siemens <span className="coming-soon-pill">준비 중</span></button>
        </div>
      </div>
      <div className="topbar-end">
        <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="기술 검색 열기"><Search size={17}/><span>무엇이 궁금하신가요?</span><kbd>⌘ K</kbd></button>
        <a className="github-link" href="https://github.com/jungsuplee-hub/whatis" target="_blank" rel="noopener noreferrer" title="GitHub 저장소"><Globe2 size={18}/></a>
      </div>
    </header>

    <div className="layout">
      {mobileMenu && <button className="menu-backdrop" onClick={() => setMobileMenu(false)} aria-label="메뉴 닫기"/>}
      <aside className={'sidebar ' + (mobileMenu ? 'sidebar-open' : '')}>
        <div className="sidebar-scroll">
          <div className="sidebar-mobile-head"><span>탐색하기</span><button className="icon-button" onClick={() => setMobileMenu(false)} aria-label="닫기"><X size={20}/></button></div>
          <p className="sidebar-label">EXPLORE</p>
          <button className={'side-home ' + (route.page === 'home' ? 'active' : '')} onClick={() => home()}><Home size={18}/><span>홈 · 전체 보기</span><ChevronRight size={16} className="side-arrow"/></button>
          <button className={'side-home ' + (route.page === 'saved' ? 'active' : '')} onClick={() => navigate({ area: route.area, page: 'saved' })}><Bookmark size={18}/><span>저장한 개념</span><span className="side-count">{saved.length}</span></button>
          <div className="side-divider"/>
          <div className="sidebar-heading"><span>{route.area === 'general' ? 'GENERAL AI' : 'SIEMENS SOFTWARE'}</span><span>{route.area === 'siemens' ? 'SOON' : String(currentTopics.length).padStart(2,'0') + ' TOPICS'}</span></div>
          {route.area === 'siemens' && <p className="sidebar-soon-note">제품별 기술 문서는 이후 확장됩니다. 현재는 일반 AI 영역을 이용해 주세요.</p>}
          <div className="sidebar-group">
            {currentCategories.map(category => {
              const catTopics = currentTopics.filter(t => t.category === category.id)
              const activeCategory = route.page === 'category' && route.id === category.id
              const activeTopic = route.page === 'topic' && currentTopic?.category === category.id
              return <div className="side-section" key={category.id}>
                <button className={'side-category ' + ((activeCategory || activeTopic) ? 'group-active' : '')} onClick={() => goCategory(category)}>
                  <span className={'side-category-icon tone-' + category.color}><Icon name={category.icon} size={17}/></span>
                  <span>{category.title}</span><span className="side-count">{catTopics.length}</span>
                </button>
                {(activeCategory || activeTopic) && <div className="side-subtopics">
                  {catTopics.map(t => <button key={t.id} className={'side-topic ' + (route.page === 'topic' && route.id === t.id ? 'topic-active' : '')} onClick={() => goTopic(t)}><span className="side-topic-dot"/>{t.title}</button>)}
                </div>}
              </div>
            })}
          </div>
          <div className="sidebar-bottom">
            <div className="sidebar-tip"><div className="tip-icon"><Lightbulb size={17}/></div><strong>읽는 것보다, 보는 것.</strong><p>각 개념의 구조도를 클릭하며 흐름을 따라가 보세요.</p></div>
            <p className="sidebar-foot">© 2026 WHATIS · Visual knowledge</p>
          </div>
        </div>
      </aside>
      <main className="main" ref={mainRef} tabIndex={-1}>
        {route.page === 'home' && (route.area === 'siemens' ? <SiemensPreview goGeneral={() => switchArea('general')}/> : <HomePage area={route.area} list={currentTopics} groups={currentCategories} goTopic={goTopic} goCategory={goCategory} onSearch={() => setSearchOpen(true)}/>) }
        {route.page === 'category' && currentCategory && <CategoryPage category={currentCategory} list={currentTopics.filter(t => t.category === currentCategory.id)} goTopic={goTopic} goHome={() => home()}/>}
        {route.page === 'saved' && <SavedPage list={saved} goTopic={goTopic} goHome={() => home()}/>}
        {route.page === 'topic' && currentTopic && <TopicPage topic={currentTopic} selectedStage={selectedStage} setSelectedStage={setSelectedStage} favorite={favorites.includes(currentTopic.id)} toggleFavorite={() => toggleFavorite(currentTopic.id)} goHome={() => home()} goCategory={() => goCategory(categoryById(currentTopic.category)!)} goTopic={goTopic} share={share} copied={copied}/>}
        <footer className="main-footer"><span><span className="footer-dot"/> WHATIS <span className="footer-separator">/</span> 기술을 이해하는 가장 시각적인 방법</span><span>학습용 개념 설명 · 기술 원문은 각 공식 출처 참고</span></footer>
      </main>
    </div>
    {searchOpen && <div className="search-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSearchOpen(false) }}>
      <div className="search-modal" role="dialog" aria-modal="true" aria-label="기술 검색">
        <div className="search-input-row"><Search size={23}/><input ref={searchRef} placeholder="기술 이름, 영문 약어, 설명으로 검색..." value={query} onChange={e => setQuery(e.target.value)}/><button onClick={() => {setSearchOpen(false);setQuery('')}} aria-label="닫기"><span>ESC</span><X size={17}/></button></div>
        <div className="search-modal-body">
          <div className="search-modal-label"><span>{query ? '검색 결과' : '일반 AI 개념'}</span><span>{filtered.length}개 개념</span></div>
          {filtered.length ? filtered.slice(0, 12).map(t => <button key={t.id} className="search-result" onClick={() => goTopic(t)}>
            <span className={'result-icon tone-' + (categoryById(t.category)?.color || 'blue')}><Icon name={t.icon} size={20}/></span>
            <span className="result-text"><strong>{t.title}<small>{t.english}</small></strong><span>{t.summary}</span></span><ArrowUpRight size={18}/>
          </button>) : <div className="search-empty"><Search size={28}/><strong>일치하는 개념이 없습니다</strong><span>다른 키워드로 다시 검색해 보세요.</span></div>}
        </div>
        <div className="search-modal-footer"><span><kbd>/</kbd> 또는 <kbd>⌘ K</kbd> 검색 열기</span><span><kbd>ESC</kbd> 닫기</span></div>
      </div>
    </div>}
  </div>
}


function SiemensPreview({ goGeneral }: { goGeneral: () => void }) {
  return <>
    <div className="page-topline"><div className="topline-breadcrumb"><span>KNOWLEDGE BASE</span><ChevronRight size={14}/><strong>Siemens · 준비 중</strong></div></div>
    <section className="siemens-preview">
      <div className="siemens-preview-top"><span><Layers3 size={16}/> FUTURE COLLECTION</span><span>NOT YET PUBLISHED</span></div>
      <div className="siemens-preview-body">
        <span className="siemens-preview-symbol"><Layers3 size={35}/></span>
        <span className="siemens-preview-kicker">UPCOMING · SIEMENS SOLUTIONS</span>
        <h1>Siemens 기술 영역은<br/><em>준비 중입니다.</em></h1>
        <p>현재는 일반 AI 기술 백과사전에 집중하고 있습니다. Siemens 영역은 추후 솔루션별 문서와 구조도를 별도로 구성할 예정입니다.</p>
        <button className="button-primary" onClick={goGeneral}>일반 AI 살펴보기 <ArrowRight size={18}/></button>
      </div>
      <div className="siemens-future-list">
        <span className="mini-eyebrow">PLANNED SOLUTION SECTIONS</span>
        <div>{siemensSolutions.map(sol => <div key={sol.id} className="siemens-future-item"><span className="future-item-dot"/><strong>{sol.name}</strong><span>추후 작성</span></div>)}</div>
      </div>
    </section>
  </>
}
function HomePage({ area, list, groups, goTopic, goCategory, onSearch }: { area: Area; list: Topic[]; groups: Category[]; goTopic: (t: Topic) => void; goCategory: (c: Category) => void; onSearch: () => void }) {
  const siemens = area === 'siemens'
  const primary = siemens ? ['teamcenter','polarion','nx','simcenter'] : ['rag','llm','ai-agent','mcp']
  const featured = primary.map(id => topicById(id)).filter((t): t is Topic => Boolean(t))
  return <>
    <div className="page-topline"><div className="topline-breadcrumb"><span>KNOWLEDGE BASE</span><ChevronRight size={14}/><strong>{siemens ? 'Siemens Technology' : 'General AI'}</strong></div><span className="topline-note"><span className="status-dot"/> VISUAL EXPLAINER</span></div>
    <section className={'hero ' + (siemens ? 'hero-siemens' : '')}>
      <div className="hero-text">
        <div className="hero-eyebrow"><span className="eyebrow-mark">✳</span> A BETTER WAY TO UNDERSTAND TECH <span className="eyebrow-line"/></div>
        <h1>{siemens ? <>Siemens 기술,<br/><em>연결해서</em> 이해하다.</> : <>어려운 AI 기술,<br/><em>그림으로</em> 이해하다.</>}</h1>
        <p>{siemens ? 'Teamcenter, Polarion, NX부터 제조 솔루션까지. 흩어진 개념을 하나의 흐름으로 이해해 보세요.' : 'LLM, RAG, Agent, MCP까지. 어렵게 느껴지는 기술을 복잡한 문장 대신 명확한 구조와 흐름으로 설명합니다.'}</p>
        <div className="hero-actions">
          <button className="button-primary" onClick={() => goTopic(featured[0])}>첫 번째 개념 살펴보기 <ArrowRight size={18}/></button>
          <button className="button-ghost" onClick={onSearch}><Search size={17}/> 개념 검색</button>
        </div>
        <div className="hero-bottomline"><span><CheckCircle2 size={14}/> 단계별 인터랙티브 구조도</span><span><CheckCircle2 size={14}/> 공식 문서 기반</span></div>
      </div>
      <HeroArtwork siemens={siemens} onOpen={goTopic}/>
    </section>
    <div className="metric-strip">
      <div><strong>{list.length.toString().padStart(2,'0')}<span>+</span></strong><small>TECH CONCEPTS</small></div>
      <div><strong>{groups.length.toString().padStart(2,'0')}</strong><small>TECH CATEGORIES</small></div>
      <div><strong>100<span>%</span></strong><small>VISUAL EXPLANATIONS</small></div>
      <div className="metric-copy"><span className="metric-copy-icon"><Lightbulb size={22}/></span><p>단순 용어 풀이를 넘어<br/><strong>기술이 작동하는 방식</strong>까지</p></div>
    </div>
    <section className="section-block">
      <SectionHeader eyebrow="01 / EXPLORE BY CATEGORY" title="관심 있는 분야부터 시작하세요" description="어떤 기술이 궁금한가요? 주제별로 정리한 지식 지도를 탐색해 보세요."/>
      <div className="category-grid">
        {groups.map((c,i) => <button key={c.id} className={'category-card category-' + c.color} onClick={() => goCategory(c)}>
          <div className="category-card-top"><span className="category-number">0{i+1}</span><ArrowUpRight size={21}/></div>
          <div className="category-symbol"><Icon name={c.icon} size={27}/></div>
          <div className="category-card-content"><h3>{c.title}</h3><p>{c.caption}</p><div className="category-card-footer">{list.filter(t => t.category === c.id).length}개 기술 보기 <ArrowRight size={16}/></div></div>
        </button>)}
      </div>
    </section>
    {!siemens && <section className="section-block">
      <SectionHeader eyebrow="02 / THE BIG PICTURE" title="기술은 서로 연결되어 있습니다" description="하나의 기술이 다른 기술 위에서 어떻게 발전하는지 살펴보세요."/>
      <div className="evolution-card">
        <div className="evolution-top"><div><span className="mini-eyebrow">TECHNOLOGY EVOLUTION</span><h3>AI에서 AI Agent까지</h3></div><span className="evolution-hint"><MouseGuide/> 클릭해서 더 알아보기</span></div>
        <div className="evolution-flow">
          {['ai','machine-learning','deep-learning','llm','ai-agent'].map((id,i) => {
            const t = topicById(id)!
            return <div className="evolution-flow-item" key={id}>{i>0 && <div className="evolution-connector"><ArrowRight size={19}/></div>}<button onClick={() => goTopic(t)} className={'evolution-node evol-'+i}><span className="evolution-step">0{i+1}</span><Icon name={t.icon} size={25}/><strong>{t.title}</strong><span>{t.english}</span></button></div>
          })}
        </div>
        <p className="evolution-caption"><Lightbulb size={16}/> 위 흐름은 개념 간 관계를 단순화한 학습용 도식이며, 기술의 유일한 발전 경로를 뜻하지 않습니다.</p>
      </div>
    </section>}
    <section className="section-block section-featured">
      <SectionHeader eyebrow={siemens ? '02 / START HERE' : '03 / POPULAR TOPICS'} title={siemens ? '먼저 알아두면 좋은 Siemens 기술' : '이 개념부터 알아보세요'} description="많이 연결되는 핵심 기술을 골랐습니다. 카드를 누르면 단계별 구조도와 활용 사례를 볼 수 있습니다."/>
      <div className="featured-grid">{featured.map((t,i) => <button key={t.id} className="featured-card" onClick={() => goTopic(t)}>
        <div className="featured-card-top"><span className={'featured-icon tone-' + (categoryById(t.category)?.color || 'blue')}><Icon name={t.icon} size={25}/></span><span className="featured-index">0{i+1} / 04</span></div>
        <span className="featured-category">{categoryById(t.category)?.title}</span><h3>{t.title}</h3><p>{t.summary}</p><div className="featured-bottom"><span>{t.stages.length}단계 구조도</span><span className="featured-arrow"><ArrowUpRight size={20}/></span></div>
      </button>)}</div>
    </section>
    <section className="closing-banner"><div className="closing-icon"><BookOpen size={28}/></div><div><span>LEARN VISUALLY, UNDERSTAND DEEPLY.</span><h3>아는 기술이 하나씩 연결될 때, 전체 그림이 보입니다.</h3><p>어렵게 외우지 말고 구조를 따라 이해해 보세요.</p></div><button onClick={onSearch}>기술 찾기 <ArrowRight size={18}/></button></section>
  </>
}
function MouseGuide() { return <Compass size={15}/> }
function HeroArtwork({ siemens, onOpen }: { siemens: boolean; onOpen: (t: Topic) => void }) {
  const nodes = siemens ? [
    {id:'teamcenter',name:'Teamcenter',sub:'PLM · PRODUCT DATA',place:'hero-node-1'},
    {id:'polarion',name:'Polarion',sub:'ALM · REQUIREMENTS',place:'hero-node-2'},
    {id:'nx',name:'NX',sub:'CAD · ENGINEERING',place:'hero-node-3'},
    {id:'opcenter',name:'Opcenter',sub:'MANUFACTURING',place:'hero-node-4'}
  ] : [
    {id:'llm',name:'LLM',sub:'LANGUAGE MODEL',place:'hero-node-1'},
    {id:'embeddings',name:'Embeddings',sub:'VECTOR REPRESENTATION',place:'hero-node-2'},
    {id:'rag',name:'RAG',sub:'KNOWLEDGE RETRIEVAL',place:'hero-node-3'},
    {id:'ai-agent',name:'AI Agent',sub:'TOOL USE · REASONING',place:'hero-node-4'}
  ]
  return <div className="hero-art" aria-label="기술 관계 시각화">
    <div className="hero-art-noise"/><div className="hero-art-top"><span><span className="hero-live-dot"/> CONCEPT RELATION MAP</span><span>01 / 04</span></div>
    <svg className="hero-connection-lines" viewBox="0 0 570 430" fill="none" aria-hidden="true" preserveAspectRatio="none">
      <path d="M288 216 C190 216 196 98 110 97 M288 216 C365 216 368 98 463 97 M288 216 C182 216 196 340 106 340 M288 216 C375 216 381 340 464 340" stroke="#91abc1" strokeWidth="1.5" strokeDasharray="5 7" opacity=".48"/>
      <circle cx="288" cy="216" r="90" stroke="#6384a7" strokeWidth="1" opacity=".23"/>
      <circle cx="288" cy="216" r="134" stroke="#6384a7" strokeWidth="1" opacity=".12"/>
      <circle cx="288" cy="216" r="175" stroke="#6384a7" strokeWidth="1" strokeDasharray="3 8" opacity=".18"/>
    </svg>
    <div className="hero-core"><div className="hero-core-logo"><BrainCircuit size={33}/></div><span>{siemens ? 'DIGITAL' : 'ARTIFICIAL'}</span><strong>{siemens ? 'ENTERPRISE' : 'INTELLIGENCE'}</strong><div className="core-orbit orbit-1"/><div className="core-orbit orbit-2"/></div>
    {nodes.map((n,i) => <button key={n.id} className={'hero-graph-node '+n.place} onClick={() => onOpen(topicById(n.id)!)}><span className="hero-graph-icon"><Icon name={topicById(n.id)!.icon} size={17}/></span><strong>{n.name}</strong><small>{n.sub}</small><span className="hero-graph-bubble">0{i+1}</span></button>)}
    <div className="hero-art-bottom"><span><span className="hero-art-block"/> INTERACTIVE KNOWLEDGE GRAPH</span><span><span className="tiny-dot"/> CONNECTED</span></div>
  </div>
}
function SectionHeader({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {
  return <div className="section-header"><span className="section-eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
}
function TopicGrid({ list, goTopic }: { list: Topic[]; goTopic: (t: Topic) => void }) {
  return <div className="topics-grid">{list.map((t,i) => <button className="topic-list-card" key={t.id} onClick={() => goTopic(t)}>
    <div className="topic-card-top"><span className={'topic-list-icon tone-'+(categoryById(t.category)?.color||'blue')}><Icon name={t.icon} size={23}/></span><span className="topic-list-idx">{String(i+1).padStart(2,'0')}</span></div>
    <h3>{t.title} <ArrowUpRight size={19}/></h3><span className="topic-eng">{t.english}</span><p>{t.summary}</p><div className="topic-list-meta"><span><span className="dot-mini"/>{t.level}</span><span>{t.stages.length}단계 구조도 <ArrowRight size={15}/></span></div>
  </button>)}</div>
}
function CategoryPage({ category, list, goTopic, goHome }: { category: Category; list: Topic[]; goTopic: (t: Topic) => void; goHome: () => void }) {
  return <>
    <div className="detail-breadcrumb"><button onClick={goHome}>전체 보기</button><ChevronRight size={15}/><strong>{category.title}</strong></div>
    <div className={'listing-hero listing-'+category.color}><div className="listing-hero-content"><span className="listing-eyebrow">EXPLORE / {category.area==='general'?'GENERAL AI':'SIEMENS'}</span><span className={'listing-big-icon tone-'+category.color}><Icon name={category.icon} size={33}/></span><h1>{category.title}</h1><p>{category.caption} — 각 기술의 개념과 동작 구조를 한눈에 정리했습니다.</p><span className="listing-count">{String(list.length).padStart(2,'0')} CONCEPTS</span></div><div className="listing-decoration"><Icon name={category.icon} size={260}/></div></div>
    <div className="listing-header"><h2>이 분야의 기술 <span>{list.length}</span></h2><span>카드를 선택해 구조도를 살펴보세요 <ArrowDown size={16}/></span></div>
    <TopicGrid list={list} goTopic={goTopic}/>
  </>
}
function SavedPage({ list, goTopic, goHome }: { list: Topic[]; goTopic: (t: Topic) => void; goHome: () => void }) {
  return <><div className="detail-breadcrumb"><button onClick={goHome}>전체 보기</button><ChevronRight size={15}/><strong>저장한 개념</strong></div><div className="saved-heading"><span className="saved-icon"><BookmarkCheck size={29}/></span><h1>내가 저장한 기술</h1><p>다시 보고 싶은 개념을 이곳에서 빠르게 찾아볼 수 있습니다. 저장 목록은 현재 브라우저에만 보관됩니다.</p></div>{list.length ? <TopicGrid list={list} goTopic={goTopic}/> : <div className="saved-empty"><Bookmark size={44}/><h2>아직 저장한 개념이 없습니다</h2><p>개념 상세 페이지에서 북마크 버튼을 눌러 추가해 보세요.</p><button className="button-primary" onClick={goHome}>기술 둘러보기 <ArrowRight size={17}/></button></div>}</>
}

function TopicPage({ topic, selectedStage, setSelectedStage, favorite, toggleFavorite, goHome, goCategory, goTopic, share, copied }: {
  topic: Topic; selectedStage: number; setSelectedStage: (v: number) => void; favorite: boolean; toggleFavorite: () => void
  goHome: () => void; goCategory: () => void; goTopic: (t: Topic) => void; share: () => void; copied: boolean
}) {
  const category = categoryById(topic.category)!
  const related = topic.related.map(id => topicById(id)).filter((t): t is Topic => !!t)
  const phase = topic.stages[selectedStage] || topic.stages[0]
  return <>
    <div className="detail-breadcrumb"><button onClick={goHome}>{topic.area === 'general' ? '일반 AI' : 'Siemens'}</button><ChevronRight size={15}/><button onClick={goCategory}>{category.title}</button><ChevronRight size={15}/><strong>{topic.title}</strong></div>
    <div className="detail-title-layout">
      <div className="detail-heading"><div className="topic-heading-tags"><span className={'topic-category-tag tone-'+category.color}><Icon name={category.icon} size={15}/>{category.title}</span><span className="level-tag"><span className="level-bullet"/>{topic.level}</span><span className="read-time"><Clock3 size={14}/> 약 3분</span></div><h1>{topic.title}<span className="title-period">.</span></h1><p className="english-name">{topic.english}</p><p className="detail-summary">{topic.summary}</p></div>
      <div className="detail-actions"><button className={'small-action ' + (favorite?'action-saved':'')} onClick={toggleFavorite} title={favorite ? '저장 취소' : '개념 저장'}>{favorite ? <BookmarkCheck size={18}/> : <Bookmark size={18}/>}<span>{favorite ? '저장됨' : '저장'}</span></button><button className="small-action" onClick={share} title="현재 개념 링크 복사">{copied ? <Check size={18}/> : <Share2 size={18}/>}<span>{copied ? '복사됨' : '공유'}</span></button></div>
    </div>
    <div className="definition-card"><div className={'definition-icon tone-'+category.color}><Lightbulb size={23}/></div><div><span>IN A NUTSHELL · 한 문장으로 이해하기</span><p>{topic.description}</p></div></div>
    <section className="diagram-section">
      <div className="diagram-title-row"><div><span className="section-eyebrow">HOW IT WORKS / INTERACTIVE DIAGRAM</span><h2>한눈에 보는 작동 원리</h2><p>각 단계를 클릭하면 해당 과정이 어떻게 작동하는지 자세히 볼 수 있습니다.</p></div><div className="diagram-counter"><span>{String(selectedStage+1).padStart(2,'0')}</span> / {String(topic.stages.length).padStart(2,'0')}</div></div>
      <div className="diagram-panel">
        <div className="diagram-panel-top"><span><span className="diagram-online"/> SYSTEM FLOW <span className="diagram-panel-separator">/</span> {topic.english.toUpperCase()}</span><span><span className="diagram-square"/> TAP TO EXPLORE</span></div>
        <div className="diagram-flow-scroll"><div className="diagram-flow" role="group" aria-label={topic.title + ' 단계별 구조도'}>
          {topic.stages.map((stage,i) => <div className="diagram-item" key={stage.name}>
            {i !== 0 && <div className={'diagram-join ' + (selectedStage>=i?'join-active':'')}><span className="join-line"/><ArrowRight size={18}/></div>}
            <button aria-pressed={selectedStage===i} onClick={() => setSelectedStage(i)} className={'diagram-node ' + (selectedStage===i?'diagram-active':'')}>
              <div className="diagram-node-top"><span>{String(i+1).padStart(2,'0')}</span>{i===0?<span className="diagram-node-label">INPUT</span>:i===topic.stages.length-1?<span className="diagram-node-label">OUTPUT</span>:<span className="diagram-node-label">PROCESS</span>}</div>
              <div className="diagram-node-art"><span className="node-ring ring-one"/><span className="node-ring ring-two"/><Icon name={i===0?'message':i===topic.stages.length-1?'check':topic.icon} size={30}/></div>
              <strong>{stage.name}</strong><p>{stage.note}</p><span className="node-selected-indicator"><ArrowRight size={15}/></span>
            </button>
          </div>)}
        </div></div>
        <div className="diagram-bottom"><span>● 선택된 단계</span><div className="step-progress">{topic.stages.map((_,i)=><button key={i} onClick={()=>setSelectedStage(i)} title={i+1+'단계로 이동'} className={i===selectedStage?'on':''}/>)}</div><span>{selectedStage+1} / {topic.stages.length}</span></div>
      </div>
      <div className="stage-explainer"><div className="stage-explainer-left"><span>STEP {String(selectedStage+1).padStart(2,'0')}</span><h3>{phase.name}</h3><strong>{phase.note}</strong><p>{phase.detail}</p></div><div className="stage-explainer-actions"><button onClick={()=>setSelectedStage(Math.max(0,selectedStage-1))} disabled={selectedStage===0} aria-label="이전 단계"><ChevronLeft size={19}/></button><button onClick={()=>setSelectedStage(Math.min(topic.stages.length-1,selectedStage+1))} disabled={selectedStage===topic.stages.length-1} aria-label="다음 단계"><ChevronRight size={19}/></button></div></div>
      <p className="diagram-disclaimer"><CircleHelp size={14}/> 이해를 돕기 위한 개념 구조도입니다. 실제 시스템의 구성·순서·구현은 제품과 아키텍처에 따라 달라질 수 있습니다.</p>
    </section>
    <section className="detail-info-grid">
      <div className="info-card analogy-card"><div className="info-card-kicker"><span><Lightbulb size={18}/></span>쉽게 이해하기</div><h3>비유로 이해하면</h3><p>{topic.analogy}</p><div className="analogy-graphic"><span>COMPLEX</span><ArrowRight size={22}/><span>SIMPLE</span></div></div>
      <div className="info-card keypoint-card"><div className="info-card-kicker"><span><CheckCircle2 size={18}/></span>꼭 알아둘 핵심</div><h3>핵심 포인트</h3><ul>{topic.insights.map(x=><li key={x}><Check size={18}/><span>{x}</span></li>)}</ul></div>
    </section>
    <section className="section-block section-uses"><SectionHeader eyebrow="REAL WORLD / USE CASES" title="실제로 어디에 사용할까요?" description="실무에서 자주 만나는 적용 사례로 개념을 연결해 보세요."/><div className="usecase-grid">{topic.useCases.map((u,i)=><div key={u} className="usecase-card"><div className="usecase-index">0{i+1}</div><span className="usecase-line"/><h3>{u}</h3><span>APPLICATION EXAMPLE <ArrowUpRight size={15}/></span></div>)}</div></section>
    <div className="caution-box"><div className="caution-icon"><CircleHelp size={21}/></div><div><strong>자주 헷갈리는 부분</strong><p>{topic.caution}</p></div></div>
    <section className="sources-section"><div className="sources-header"><div><span className="section-eyebrow">REFERENCES / OFFICIAL SOURCES</span><h2>더 깊이 알아보기</h2><p>원문 문서와 신뢰할 수 있는 기술 자료를 직접 확인할 수 있습니다.</p></div><ExternalLink size={22}/></div><div className="source-links">{topic.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"><span><Globe2 size={19}/></span><strong>{source.name}</strong><ArrowUpRight size={19}/></a>)}</div></section>
    {related.length>0 && <section className="related-section"><div className="related-heading"><div><span className="section-eyebrow">KEEP EXPLORING</span><h2>함께 보면 좋은 개념</h2></div><span>지식을 연결해 보세요 <ArrowRight size={17}/></span></div><div className="related-grid">{related.map(t=><button key={t.id} className="related-card" onClick={()=>goTopic(t)}><span className={'related-icon tone-'+(categoryById(t.category)?.color||'blue')}><Icon name={t.icon} size={21}/></span><strong>{t.title}</strong><span>{t.english}</span><ArrowUpRight className="related-arrow" size={18}/></button>)}</div></section>}
    <button className="back-to-category" onClick={goCategory}><ArrowLeft size={17}/>{category.title} 목록으로 돌아가기</button>
  </>
}
export default App
