import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, BookmarkCheck, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ExternalLink, Pause, Play, Search, Share2, X } from 'lucide-react'
import FlowPlayground from './FlowPlayground'
import ConceptMotion from './ConceptMotion'
import TopicStageScene from './TopicStageScene'
import SiemensArchitect from './SiemensArchitect'
import { categories, categoryById, generalTopics, topicById } from './data'
import type { Topic, Area, Category } from './data'
import { lessons } from './lessonContent'
import { examplesForTopic } from './serviceExamples'
import './editorial.css'
import './service-examples.css'
import './home-polish.css'
import './mobile-clarity.css'

type Route = {area: Area; page:'home'|'category'|'topic'|'saved';id?:string}
const routeFromHash = ():Route => {
  const paths=decodeURIComponent(window.location.hash.slice(1)).split('/').filter(Boolean)
  const area:Area=paths[0]==='siemens'?'siemens':'general'
  const category=paths[1]==='category'?categoryById(paths[2]||''):undefined
  if(category?.area===area)return {area,page:'category',id:category.id}
  if(paths[1]==='saved')return {area,page:'saved'}
  const t=topicById(paths[1]||'')
  if(t?.area===area)return {area,page:'topic',id:t.id}
  return {area,page:'home'}
}
const hashFor = (r:Route) => '#'+r.area+(r.page==='topic'?'/'+r.id:r.page==='category'?'/category/'+r.id:r.page==='saved'?'/saved':'')
const technicalName = (t:Topic) => ({
  ai:'AI', 'machine-learning':'Machine Learning', 'deep-learning':'Deep Learning',
  'neural-networks':'Neural Network', 'supervised-learning':'Supervised Learning',
  'generative-ai':'Generative AI', llm:'LLM', transformer:'Transformer',
  tokens:'Token', 'prompt-engineering':'Prompt Engineering', multimodal:'Multimodal AI',
  embeddings:'Embedding', 'vector-database':'Vector DB', 'semantic-search':'Semantic Search',
  chunking:'Chunking', rag:'RAG', 'ai-agent':'AI Agent', 'function-calling':'Function Calling',
  mcp:'MCP', orchestration:'Orchestration', 'context-memory':'Context & Memory',
  'fine-tuning':'Fine-tuning', rlhf:'RLHF', quantization:'Quantization',
  distillation:'Distillation', 'training-vs-inference':'Training / Inference',
  'model-serving':'Model Serving', 'model-evaluation':'Model Evaluation',
  'ai-safety':'AI Safety', observability:'Observability',
  hallucination:'Hallucination', 'image-generation':'Image Generation',
  'speech-to-text':'Speech to Text', 'search-vs-ai':'Search vs AI',
  'personal-data':'Data Privacy', 'ai-limitations':'AI Limitations'
} as Record<string,string>)[t.id]||t.title
const friendly = (t:Topic) => lessons[t.id]?.heading||t.title
const simple = (t:Topic) => lessons[t.id]?.short||t.summary
const grouped=categories.filter(c=>c.area==='general')
const featuredIds=['search-vs-ai','image-generation','hallucination','speech-to-text','tokens','personal-data']

function App(){
  const [route,setRoute]=useState<Route>(routeFromHash)
  const [searchOpen,setSearchOpen]=useState(false)
  const [query,setQuery]=useState('')
  const [saved,setSaved]=useState<string[]>(()=>{
    try{
      const v=JSON.parse(localStorage.getItem('whatis:favorites')||'[]')
      return Array.isArray(v)?v.filter((id):id is string=>typeof id==='string'):[]
    }catch{return []}
  })
  const searchRef=useRef<HTMLInputElement>(null)
  const navigate=(r:Route)=>{
    setRoute(r);setSearchOpen(false);setQuery('')
    if(window.location.hash!==hashFor(r))window.location.hash=hashFor(r)
    window.scrollTo({top:0,behavior:'instant'})
  }
  const home=()=>navigate({area:'general',page:'home'})
  const openTopic=(t:Topic)=>navigate({area:t.area,page:'topic',id:t.id})
  const openCategory=(c:Category)=>navigate({area:c.area,page:'category',id:c.id})
  const topic=route.page==='topic'?topicById(route.id||''):undefined
  const category=route.page==='category'?categoryById(route.id||''):undefined
  const favorite=(id:string)=>setSaved(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])
  useEffect(()=>{
    const fn=()=>{setRoute(routeFromHash());window.scrollTo({top:0,behavior:'instant'})}
    window.addEventListener('hashchange',fn)
    return()=>window.removeEventListener('hashchange',fn)
  },[])
  useEffect(()=>{localStorage.setItem('whatis:favorites',JSON.stringify(saved))},[saved])
  useEffect(()=>{document.title=(topic?friendly(topic)+' | ':category?category.title+' | ':'')+'whatis. — 어렵지 않은 AI 이야기'},[topic,category])
  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      if(e.key==='Escape')setSearchOpen(false)
      const active=e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement
      if(((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')||(e.key==='/'&&!active)){
        e.preventDefault();setSearchOpen(true)
      }
    }
    document.addEventListener('keydown',handler)
    return()=>document.removeEventListener('keydown',handler)
  },[])
  useEffect(()=>{if(searchOpen)searchRef.current?.focus()},[searchOpen])
  const filtered=useMemo(()=>{
    const q=query.trim().toLocaleLowerCase()
    if(!q)return generalTopics.slice(0,10)
    return generalTopics.filter(t=>[t.title,t.english,friendly(t),simple(t),t.summary,categoryById(t.category)?.title].some(v=>v?.toLocaleLowerCase().includes(q))).slice(0,20)
  },[query])

  return <div className="new-app">
    <header className="site-header">
      <div className="header-inner">
        <button type="button" className="site-brand" onClick={home} aria-label="WHATIS 첫 화면">whatis<span>.</span></button>
        <nav className="site-nav" aria-label="주제별 메뉴">
          <button type="button" className={route.area==='general'?'active':''} onClick={home}>일반 AI</button>
          <button type="button" className={route.area==='siemens'?'active':''} onClick={()=>navigate({area:'siemens',page:'home'})}>Siemens <span className="nav-soon">ARCHITECT</span></button>
        </nav>
        <div className="header-actions">
          <button type="button" aria-label="AI 기술 검색" className="header-icon" onClick={()=>setSearchOpen(true)}><Search size={20}/></button>
          <button type="button" aria-label="저장한 글 보기" className="header-icon saved-icon" onClick={()=>navigate({area:'general',page:'saved'})}><Bookmark size={20}/>{saved.length>0&&<i/>}</button>
        </div>
      </div>
    </header>
    <main className="site-main">
      {route.page==='home'&&route.area==='general'&&<HomePage onTopic={openTopic} onCategory={openCategory} onSearch={()=>setSearchOpen(true)}/>}
      {route.page==='home'&&route.area==='siemens'&&<SiemensArchitect onHome={home}/>}
      {route.page==='category'&&category&&<TopicCollection key={category.id} category={category} onTopic={openTopic} onHome={home}/>}
      {route.page==='saved'&&<SavedCollection ids={saved} onTopic={openTopic} onHome={home}/>}
      {route.page==='topic'&&topic&&<TopicLesson key={topic.id} topic={topic} onHome={home} onCategory={()=>openCategory(categoryById(topic.category)!)} onTopic={openTopic} bookmarked={saved.includes(topic.id)} onBookmark={()=>favorite(topic.id)}/>}
    </main>
    <footer className="site-footer"><span>whatis. <i>알수록 가까워지는 기술</i></span><span>학습용 시각화 · 상세 출처는 각 글에 표시</span></footer>
    {searchOpen&&<div className="finder-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSearchOpen(false)}}>
      <section className="finder-dialog" role="dialog" aria-modal="true" aria-label="AI 기술 찾기">
        <div className="finder-input"><Search size={22}/><input ref={searchRef} placeholder="어떤 게 궁금하세요? (예: AI가 틀리는 이유)" value={query} onChange={e=>setQuery(e.target.value)}/><button onClick={()=>setSearchOpen(false)} aria-label="닫기"><X size={19}/></button></div>
        <div className="finder-results">
          <p>{query?'찾은 이야기':'여기서부터 살펴보세요'}</p>
          {filtered.length===0&&<div className="finder-empty">관련된 글이 없습니다. 다른 말로 검색해 보세요.</div>}
          {filtered.map(t=><button key={t.id} onClick={()=>openTopic(t)}><span className="finder-dot"/><span><strong>{friendly(t)}</strong><small>{t.title}</small></span><ArrowUpRight size={16}/></button>)}
        </div>
        <div className="finder-foot">검색은 이 사이트의 글에서만 이뤄집니다.</div>
      </section>
    </div>}
  </div>
}

function HomePage({onTopic,onCategory,onSearch}:{onTopic:(t:Topic)=>void;onCategory:(c:Category)=>void;onSearch:()=>void}){
  return <>
    <section className="magazine-hero">
      <div className="hero-number"><span className="hero-number-dot"/> AN INTERACTIVE JOURNEY INTO AI</div>
      <h1>질문을 보내면,<br/><em>안에서는 무슨 일이?</em></h1>
      <p>채팅창에서 출발해 답변이 완성될 때까지. 직접 따라가 보세요.</p>
      <div className="hero-scribble" aria-hidden="true"><span>?</span><span>→</span><span>!</span></div>
    </section>
    <div className="exhibit-label"><span><i/> 01 / 먼저 체험하기</span><span>화면을 눌러보세요</span></div>
    <FlowPlayground/>
    <section className="feature-explore">
      <div className="section-identity"><span>02 / 한 장으로 이해하기</span><h2>그 다음은, 이 질문들.</h2></div>
      <div className="story-grid">
        {featuredIds.map((id,i)=>{const t=topicById(id)!;return <button key={id} className={'story-tile story-'+i} onClick={()=>onTopic(t)}>
          <span className="story-tile-top"><span>{technicalName(t)}</span><ArrowUpRight size={19}/></span>
          <ConceptMotion category={t.category} topicId={t.id} compact label={t.title+' 애니메이션 예시'}/>
          <div className="story-tile-bottom"><strong>{friendly(t)}</strong><span>보러 가기 <ArrowRight size={15}/></span></div>
        </button>})}
      </div>
    </section>
    <section className="topic-directory">
      <div className="directory-head"><div><span>03 / 관심 있는 것부터</span><h2>AI 이야기 골라보기</h2></div><button onClick={onSearch}><Search size={18}/> 모든 글 검색</button></div>
      <div className="directory-grid">{grouped.map((c,i)=><button key={c.id} onClick={()=>onCategory(c)} className={'directory-item d-'+i}>
        <span className="directory-num">{String(i+1).padStart(2,'0')}</span><div className="directory-titles"><strong>{navLabel(c.id)}</strong><span>{c.title}</span><div className="directory-tech-list" aria-label="설명하는 기술">{generalTopics.filter(t=>t.category===c.id).map(technicalName).join(" · ")}</div></div><span className="directory-count">{generalTopics.filter(t=>t.category===c.id).length}개 이야기</span><ArrowUpRight size={20}/></button>)}</div>
    </section>
  </>
}

const navLabel=(id:string):string=>({
  foundations:'AI, 처음부터',models:'AI가 만드는 것',retrieval:'AI가 자료를 찾는 법',
  agents:'AI가 일을 하는 법',training:'AI가 배우는 법',production:'AI를 믿어도 될까?'
} as Record<string,string>)[id]||categoryById(id)?.title||id
function TopicCards({items,onTopic}:{items:Topic[];onTopic:(t:Topic)=>void}){
  return <div className="lesson-grid">{items.map((t,i)=><button key={t.id} className={'lesson-tile lesson-'+(i%4)} onClick={()=>onTopic(t)}>
    <div className="lesson-preview lesson-poster">
      <div className="lesson-poster-top"><span className="lesson-poster-category">{categoryById(t.category)?.title}</span><span className="lesson-poster-number">{String(i+1).padStart(2,'0')}</span></div>
      <strong className="lesson-poster-term">{technicalName(t)}</strong>
      <span className="lesson-poster-english">{t.title}</span>
      <span className="lesson-poster-subtitle">{t.stages[0]?.name} <ArrowRight size={13}/> {t.stages[t.stages.length-1]?.name}</span>
    </div>
    <div className="lesson-tile-text"><strong>{friendly(t)}</strong><span className="lesson-arrow"><ArrowUpRight size={22}/></span></div>
  </button>)}</div>
}
function TopicCollection({category,onTopic,onHome}:{category:Category;onTopic:(t:Topic)=>void;onHome:()=>void}){
  const list=generalTopics.filter(t=>t.category===category.id)
  return <section className="collection-page">
    <button className="back-link" onClick={onHome}><ArrowLeft size={17}/> 모든 이야기</button>
    <header className="collection-head"><div><span className="kicker">CURIOUS ABOUT AI / {String(list.length).padStart(2,'0')} STORIES</span><h1>{navLabel(category.id)}</h1><span className="collection-tech-label">{category.title}</span><p>한 가지씩 선택하고, 움직이는 단계로 이해해 보세요.</p></div><div className="collection-motion"><ConceptMotion category={category.id} label={category.title+' 움직이는 예시'}/></div></header>
    <TopicCards items={list} onTopic={onTopic}/>
  </section>
}
function SavedCollection({ids,onTopic,onHome}:{ids:string[];onTopic:(t:Topic)=>void;onHome:()=>void}){
  const list=ids.map(id=>topicById(id)).filter((t):t is Topic=>Boolean(t))
  return <section className="collection-page">
    <button className="back-link" onClick={onHome}><ArrowLeft size={17}/> 돌아가기</button>
    <header className="saved-heading"><span className="kicker">MY COLLECTION</span><h1>다시 보고 싶은 이야기</h1><p>이 브라우저에만 저장됩니다.</p></header>
    {list.length?<TopicCards items={list} onTopic={onTopic}/>:<div className="no-saved"><Bookmark size={37}/><p>아직 저장한 글이 없어요.</p><button onClick={onHome}>둘러보기 <ArrowRight size={16}/></button></div>}
  </section>
}
function TopicLesson({topic,onHome,onCategory,onTopic,bookmarked,onBookmark}:{topic:Topic;onHome:()=>void;onCategory:()=>void;onTopic:(t:Topic)=>void;bookmarked:boolean;onBookmark:()=>void}){
  const [step,setStep]=useState(0)
  const [playing,setPlaying]=useState(true)
  const [copied,setCopied]=useState(false)
  const [expandStep,setExpandStep]=useState(false)
  const phase=topic.stages[step]
  const lesson=lessons[topic.id]
  const category=categoryById(topic.category)!
  const serviceExamples=examplesForTopic(topic.id)
  const related=topic.related.map(id=>topicById(id)).filter((t):t is Topic=>Boolean(t)).slice(0,4)
  useEffect(()=>{
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if(!playing||reduce)return
    const timer=window.setInterval(()=>{setStep(s=>(s+1)%topic.stages.length);setExpandStep(false)},2900)
    return()=>window.clearInterval(timer)
  },[playing,topic.id,topic.stages.length])
  const choose=(i:number)=>{setStep(i);setPlaying(false);setExpandStep(false)}
  const copy=async()=>{
    try{await navigator.clipboard.writeText(window.location.href);setCopied(true)}catch{setCopied(false)}
  }
  return <article className="lesson-page">
    <div className="lesson-navigation"><button className="back-link" onClick={onCategory}><ArrowLeft size={16}/> {navLabel(topic.category)}</button><button className="back-home" onClick={onHome}>전체 보기</button></div>
    <header className="lesson-head">
      <div><span className="kicker">A CLOSER LOOK · {category.title}</span><span className="lesson-tech-heading">{technicalName(topic)}</span><h1>{friendly(topic)}</h1><p>{simple(topic)}</p></div>
      <div className="lesson-actions">
        <button onClick={onBookmark} aria-label={bookmarked?'저장 취소':'글 저장'} title={bookmarked?'저장됨':'저장하기'}>{bookmarked?<BookmarkCheck size={19}/>:<Bookmark size={19}/>}<span>{bookmarked?'저장됨':'저장'}</span></button>
        <button onClick={copy} aria-label="링크 복사"><Share2 size={19}/><span>{copied?'복사됨':'공유'}</span></button>
      </div>
    </header>
    <div className="lesson-visual">
      <div className="lesson-visual-body">
        <div className="visual-overline"><span><i/> ANIMATED EXPLANATION</span><span>{step+1} / {topic.stages.length}</span></div>
        <TopicStageScene topic={topic} step={step}/>
        <div className="lesson-visual-caption"><span>{String(step+1).padStart(2,'0')}</span><div><strong>{phase.name}</strong><small>{phase.note}</small></div></div>
      </div>
      <div className="lesson-sequence">
        <span className="sequence-overline">눈으로 따라가기</span>
        <div className="sequence-steps">{topic.stages.map((s,i)=><button key={i} className={step===i?'selected':''} aria-pressed={step===i} onClick={()=>choose(i)}><span>{String(i+1).padStart(2,'0')}</span><strong>{s.name}</strong><span className="sequence-dot"/></button>)}</div>
        <div className="sequence-controls">
          <button onClick={()=>choose((step+topic.stages.length-1)%topic.stages.length)} aria-label="이전 단계"><ChevronLeft size={21}/></button>
          <button onClick={()=>setPlaying(p=>!p)} aria-label={playing?'자동 재생 멈추기':'자동 재생하기'}>{playing?<Pause size={17}/>:<Play size={17}/>} {playing?'잠시 멈추기':'이어 보기'}</button>
          <button onClick={()=>choose((step+1)%topic.stages.length)} aria-label="다음 단계"><ChevronRight size={21}/></button>
        </div>
        <button className="sequence-more" onClick={()=>{setPlaying(false);setExpandStep(e=>!e)}} aria-expanded={expandStep}>{expandStep?'설명 접기':'이 단계의 설명 읽기'}<ChevronDown size={18}/></button>
        {expandStep&&<p className="sequence-description">{phase.detail}</p>}
      </div>
    </div>
    <p className="visual-note"><CircleHelp size={15}/> 이해를 돕는 단순화된 시각 예시입니다. 실제 제품의 내부 동작과 정확히 일치하지 않을 수 있습니다.</p>
    {serviceExamples.length>0&&<section className="service-examples" aria-labelledby="service-examples-title">
      <div className="service-examples-header">
        <div><span className="service-examples-kicker">REAL-WORLD EXAMPLES</span><h2 id="service-examples-title">이 기술을 만날 수 있는 서비스</h2><p>실제 서비스·개발 도구·공식 자료에서 어떻게 활용되는지 살펴보세요.</p></div>
        <span className="service-examples-count">{serviceExamples.length} EXAMPLES</span>
      </div>
      <div className="service-examples-grid">
        {serviceExamples.map(service=><a key={service.name+service.url} className="service-example-card" href={service.url} target="_blank" rel="noopener noreferrer" aria-label={service.name+' 공식 사이트 새 창에서 열기'}>
          <span className="service-example-type">{service.kind}</span>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <span className="service-example-link">공식 사이트 보기 <ExternalLink size={15}/></span>
        </a>)}
      </div>
      <p className="service-examples-note">기술의 활용을 이해하기 위한 사례입니다. 모든 서비스가 같은 방식으로 작동하는 것은 아니며, 이용 요금·가입 및 제공 기능은 해당 사이트에서 확인해 주세요.</p>
    </section>}
    <div className="lesson-read-more">
      <div className="lesson-read-more-head"><span>궁금한 내용만 펼쳐 읽어보세요</span><span>DETAILS</span></div>
      <details><summary><span className="detail-index">01</span><span>일상에서 어떤 모습일까?</span><ChevronDown size={20}/></summary><div className="detail-answer"><p>{lesson?.familiar||topic.analogy}</p><p className="detail-annotation">{topic.analogy}</p></div></details>
      <details><summary><span className="detail-index">02</span><span>쉽게 다시 설명해 줘</span><ChevronDown size={20}/></summary><div className="detail-answer"><p>{topic.description}</p><ul>{topic.insights.map(s=><li key={s}>{s}</li>)}</ul></div></details>
      <details><summary><span className="detail-index">03</span><span>어디에 사용할 수 있을까?</span><ChevronDown size={20}/></summary><div className="detail-answer"><div className="use-examples">{topic.useCases.map(s=><span key={s}>{s}</span>)}</div></div></details>
      <details><summary><span className="detail-index">04</span><span>이건 꼭 조심하세요</span><ChevronDown size={20}/></summary><div className="detail-answer"><p>{lesson?.keyIdea||topic.caution}</p><p className="detail-annotation">{topic.caution}</p></div></details>
      <details><summary><span className="detail-index">05</span><span>정확한 자료는 어디에 있을까?</span><ChevronDown size={20}/></summary><div className="detail-answer"><p>아래 자료는 원문입니다. 영어 문서가 포함될 수 있습니다.</p>{topic.sources.map(src=><a className="source-anchor" key={src.url} href={src.url} target="_blank" rel="noopener noreferrer">{src.name}<ExternalLink size={15}/></a>)}</div></details>
    </div>
    {related.length>0&&<section className="next-stories"><div className="next-head"><span>RELATED STORIES</span><h2>다음에는 이것도 살펴보세요</h2></div><div className="next-grid">{related.map(t=><button key={t.id} onClick={()=>onTopic(t)}><span>{friendly(t)}</span><ArrowUpRight size={18}/></button>)}</div></section>}
  </article>
}
export default App
