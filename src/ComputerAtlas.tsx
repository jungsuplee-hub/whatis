import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, CircleHelp, Cpu, Database, Gauge, HardDrive, Layers3, Monitor, Network, Pause, Play, Search, ShieldCheck, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { computerById, computerChapterById, computerChapters, computerTopics, type ComputerChapter, type ComputerChapterId, type ComputerTopic } from './computerContent'
import ComputerMotion from './ComputerMotion'
import ComputerDetailDiagram, { hasComputerDetailDiagram } from './ComputerDetailDiagram'
import SystemsFlowGallery, { SystemsFlowFocus, stageFlow } from './SystemsFlowAtlas'
import { topicBeginners, topicStepBasics } from './systemsTopicBeginner'
import { flowById } from './systemsFlowData'
import './computer-atlas.css'

type Props={view:'home'|'chapter'|'topic';id?:string;onTopic:(id:string)=>void;onChapter:(id:string)=>void;onHome:()=>void;onLab:(topicId?:string)=>void}
const icons:Record<ComputerChapterId,LucideIcon>={hardware:Cpu,parallel:Gauge,memory:Layers3,operating:Monitor,virtual:Database,storage:HardDrive,resilience:ShieldCheck,cloud:Network}

const journey=[
 {name:'프로그램 실행',tech:'PROGRAM',detail:'사용자가 프로그램을 실행합니다. 필요한 코드와 데이터가 준비됩니다.'},
 {name:'저장장치 읽기',tech:'STORAGE',detail:'실행 파일의 필요한 부분을 저장장치에서 읽어옵니다.'},
 {name:'RAM에 배치',tech:'MEMORY',detail:'운영체제가 프로그램 실행에 필요한 메모리 공간을 준비합니다.'},
 {name:'CPU 시간 배정',tech:'SCHEDULER',detail:'운영체제가 실행할 스레드에 CPU 시간을 할당합니다.'},
 {name:'명령 실행',tech:'CPU',detail:'CPU가 명령을 가져오고 해석하고 연산을 수행합니다.'},
 {name:'결과 출력',tech:'OUTPUT',detail:'처리 결과가 화면에 표시되거나 파일에 저장됩니다.'},
]

function ChapterCard({chapter,onChapter,index}:{chapter:ComputerChapter;onChapter:(id:string)=>void;index:number}){
 const Icon=icons[chapter.id]
 return <button type="button" onClick={()=>onChapter(chapter.id)} className={'computer-chapter-card computer-chapter-'+chapter.id}>
  <div className="computer-chapter-meta"><span>{chapter.index} / CHAPTER</span><Icon size={20}/></div>
  <div className="computer-chapter-preview"><ComputerMotion chapter={chapter.id} step={index%4} compact/></div>
  <div className="computer-chapter-bottom"><span className="computer-chapter-eng">{chapter.technical}</span><h3>{chapter.title}</h3><p>{chapter.intro}</p>
    <div className="computer-chapter-bottom-line"><span>{chapter.topicIds.length}개의 이야기</span><ArrowUpRight size={22}/></div>
  </div>
 </button>
}
function ComputerHome({onChapter,onTopic,onLab}:{onChapter:(id:string)=>void;onTopic:(id:string)=>void;onLab:(topicId?:string)=>void}){
 const [chapter,setChapter]=useState<ComputerChapterId>('hardware')
 const [search,setSearch]=useState('')
 const [journeyStep,setJourneyStep]=useState(0)
 const [isPlaying,setPlaying]=useState(true)
 const [diagramStep,setDiagramStep]=useState(0)
 useEffect(()=>{
  if(!isPlaying)return
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if(reduced)return
  const interval=window.setInterval(()=>setDiagramStep(s=>(s+1)%4),2800)
  return()=>clearInterval(interval)
 },[isPlaying])
 const matched=useMemo(()=>{
  const q=search.trim().toLowerCase()
  return q?computerTopics.filter(t=>[t.title,t.technical,t.lede,computerChapterById[t.chapter]?.title].some(v=>v?.toLowerCase().includes(q))):[]
 },[search])
 return <div className="computer-page">
  <section className="computer-hero">
    <div className="computer-hero-copy">
      <span className="computer-eyebrow"><span/> A VISUAL GUIDE TO COMPUTING</span>
      <h1>컴퓨터 안에서는<br/><em>무슨 일이 벌어질까?</em></h1>
      <p>전원을 켜고 프로그램을 실행하는 순간부터, CPU·메모리·운영체제·저장소가 함께 움직이는 모습을 따라가 보세요.</p>
      <div className="computer-hero-actions">
        <button type="button" onClick={()=>onLab()}><Play size={17}/> 컴퓨터 구조 직접 실습하기 <ArrowRight size={18}/></button>
        <button type="button" className="computer-hero-secondary-action" onClick={()=>onTopic('computer-parts')}>작동 원리 읽기 <ArrowRight size={17}/></button>
        <span>8개 장 · {computerTopics.length}개 이야기</span>
      </div>
    </div>
    <div className="computer-hero-stage">
      <div className="computer-hero-stage-head"><span>LIVE SYSTEM MODEL</span><button type="button" onClick={()=>setPlaying(v=>!v)}>{isPlaying?<Pause size={15}/>:<Play size={15}/>} {isPlaying?'멈춤':'재생'}</button></div>
      <ComputerMotion chapter={chapter} step={diagramStep}/>
      <div className="computer-hero-stage-foot">
        <strong>{computerChapterById[chapter]?.title}</strong>
        <span>시각화는 이해를 위한 개념 모델입니다</span>
      </div>
    </div>
  </section>
  <nav className="computer-quick-nav" aria-label="컴퓨터 구조 장별 미리보기">
   {computerChapters.map(c=><button type="button" className={chapter===c.id?'active':''} key={c.id} onClick={()=>{setChapter(c.id);setDiagramStep(0)}}><span>{c.index}</span>{c.title}</button>)}
  </nav>
  <SystemsFlowGallery domain="computer" title="컴퓨터 안의 10가지 핵심 흐름" subtitle="CPU 명령부터 가상 메모리, 입출력, RAID, 고가용성까지 각 단계에서 데이터가 어디로 이동하는지 살펴보세요."/>
  <section className="computer-story-path">
    <div className="computer-section-heading"><div><span>01 / FOLLOW THE SIGNAL</span><h2>프로그램 하나가 실행될 때</h2><p>각 단계를 눌러 컴퓨터가 함께 처리하는 일을 살펴보세요.</p></div><span className="computer-page-count">01—06</span></div>
    <div className="computer-story-interact">
      <div className="computer-story-rail">{journey.map((step,i)=><button type="button" key={step.tech} className={journeyStep===i?'active':''} onClick={()=>setJourneyStep(i)} aria-pressed={journeyStep===i}><span className="computer-story-number">{String(i+1).padStart(2,'0')}</span><strong>{step.name}</strong><small>{step.tech}</small></button>)}</div>
      <div className="computer-story-insight"><span>STEP {String(journeyStep+1).padStart(2,'0')} / {String(journey.length).padStart(2,'0')}</span><h3>{journey[journeyStep].name}</h3><p>{journey[journeyStep].detail}</p><button type="button" onClick={()=>setJourneyStep((journeyStep+1)%journey.length)}>다음 단계 <ArrowRight size={17}/></button></div>
    </div>
  </section>
  <section className="computer-chapters-section" id="computer-chapters">
    <div className="computer-section-heading"><div><span>02 / EXPLORE THE MACHINE</span><h2>관심 있는 기술부터</h2><p>컴퓨터 내부의 연결을 큰 흐름으로 묶었습니다. 기술명을 선택하면 동작 과정을 볼 수 있습니다.</p></div>
      <label className="computer-search"><Search size={17}/><input id="computer-tech-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="CPU, TLB, RAID, 클러스터 검색" aria-label="컴퓨터 기술 검색"/>{search&&<button type="button" aria-label="검색어 지우기" onClick={()=>setSearch('')}><X size={16}/></button>}</label>
    </div>
    {search.trim()?<div className="computer-search-results">
      <span className="computer-search-label">검색 결과 · {matched.length}건</span>
      {matched.length?matched.map(t=><button type="button" key={t.id} onClick={()=>onTopic(t.id)}><span><small>{computerChapterById[t.chapter]?.title}</small><strong>{t.title}</strong><em>{t.technical}</em></span><ArrowUpRight size={18}/></button>):<p>관련 주제를 찾지 못했습니다. 다른 용어로 검색해 주세요.</p>}
    </div>:<div className="computer-chapter-grid">{computerChapters.map((c,i)=><ChapterCard key={c.id} chapter={c} index={i} onChapter={onChapter}/>)}</div>}
  </section>
 </div>
}
function ComputerChapterPage({chapter,onTopic,onHome,onLab}:{chapter:ComputerChapter;onTopic:(id:string)=>void;onHome:()=>void;onLab:(topicId?:string)=>void}){
 const [step,setStep]=useState(0)
 const Icon=icons[chapter.id]
 return <div className="computer-page computer-chapter-page">
   <div className="computer-chapter-top-actions"><button type="button" className="computer-back" onClick={onHome}><ArrowLeft size={17}/> 모든 장 보기</button><button type="button" className="computer-chapter-lab-link" onClick={()=>onLab(chapter.topicIds[0])}><Play size={15}/> 이 분야 직접 실습하기 <ArrowRight size={15}/></button></div>
   <div className="computer-chapter-intro"><div><span className="computer-eyebrow"><span/> CHAPTER {chapter.index}</span><Icon className="computer-chapter-large-icon" size={30}/><h1>{chapter.title}</h1><span className="computer-chapter-english">{chapter.technical}</span><p>{chapter.intro}</p></div>
   <div className="computer-chapter-demo"><ComputerMotion chapter={chapter.id} step={step}/><div className="computer-demo-navigator">{[0,1,2,3].map(n=><button type="button" aria-label={`${n+1}번째 시각화 단계`} aria-pressed={step===n} className={step===n?'active':''} onClick={()=>setStep(n)} key={n}/>)}</div></div></div>
   <SystemsFlowFocus embedded diagram={flowById(({
      hardware:'cpu-execution',parallel:'cpu-pipeline',memory:'cache-memory',operating:'scheduler',
      virtual:'virtual-memory',storage:'raid-data',resilience:'cluster-ha',cloud:'cloud-virtual'
     } as Record<ComputerChapterId,string>)[chapter.id])!}/>
   <div className="computer-section-heading"><div><span>RELATED LESSONS / {chapter.topicIds.length}</span><h2>한 가지씩 깊이 보기</h2><p>구성요소를 외우기보다 실제 동작 순서를 따라가 보세요.</p></div></div>
   <div className="computer-topic-list">{chapter.topicIds.map((id,i)=>{const t=computerById[id]!;return <button type="button" key={id} onClick={()=>onTopic(t.id)}><span className="computer-topic-num">{String(i+1).padStart(2,'0')}</span><div><span className="computer-chapter-eng">{t.technical}</span><strong>{t.title}</strong><p>{t.lede}</p></div><ArrowUpRight size={21}/></button>})}</div>
 </div>
}
function ComputerTopicPage({topic,onChapter,onTopic,onLab}:{topic:ComputerTopic;onChapter:(id:string)=>void;onTopic:(id:string)=>void;onLab:(topicId?:string)=>void}){
 const [step,setStep]=useState(0)
 const [playing,setPlaying]=useState(true)
 const [details,setDetails]=useState(true)
 const chapter=computerChapterById[topic.chapter]!
 const all=chapter.topicIds
 const current=all.indexOf(topic.id)
 const next=computerById[all[(current+1)%all.length]]!
 useEffect(()=>{
  if(!playing||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
  const id=window.setInterval(()=>setStep(s=>(s+1)%topic.steps.length),3400)
  return()=>window.clearInterval(id)
 },[playing,topic.id,topic.steps.length])
 const change=(n:number)=>{setStep(n);setPlaying(false)}
 return <article className="computer-page computer-topic-page">
  <div className="computer-topic-breadcrumb"><button type="button" onClick={()=>onChapter(chapter.id)}><ArrowLeft size={16}/> {chapter.title}</button><button type="button" className="computer-lesson-lab-link" onClick={()=>onLab(topic.id)}><Play size={14}/> 이 개념을 직접 실습하기</button><span>CHAPTER {chapter.index} / {String(current+1).padStart(2,'0')}</span></div>
  <header className="computer-topic-hero"><span className="computer-eyebrow"><span/> INTERACTIVE EXPLANATION</span><span className="computer-topic-tech">{topic.technical}</span><h1>{topic.title}</h1><p>{topic.lede}</p></header>
  <div className="computer-lesson-body">
    <div className="computer-lesson-screen">
      <div className="computer-lesson-screen-head"><span><span/> BEHIND THE MACHINE</span><span>{String(step+1).padStart(2,'0')} / {String(topic.steps.length).padStart(2,'0')}</span></div>
      {hasComputerDetailDiagram(topic.id)?<ComputerDetailDiagram topicId={topic.id} step={step}/>:<ComputerMotion chapter={chapter.id} step={step}/>}
      <div className="computer-lesson-active"><span>{String(step+1).padStart(2,'0')}</span><div><strong>{topic.steps[step].title}</strong><small>{topic.steps[step].subtitle}</small></div></div>
    </div>
    <div className="computer-lesson-controls">
      <span className="computer-sequence-label">단계별로 살펴보기</span>
      <div className="computer-sequence">{topic.steps.map((st,i)=><button type="button" key={i} onClick={()=>change(i)} className={step===i?'active':''} aria-pressed={step===i}><span>{String(i+1).padStart(2,'0')}</span><strong>{st.title}</strong><small>{st.subtitle}</small><i/></button>)}</div>
      <div className="computer-sequence-buttons"><button aria-label="이전 단계" onClick={()=>change((step+topic.steps.length-1)%topic.steps.length)}><ChevronLeft size={19}/></button><button className="computer-play" onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={16}/>:<Play size={16}/>} {playing?'잠시 멈추기':'자동 재생'}</button><button aria-label="다음 단계" onClick={()=>change((step+1)%topic.steps.length)}><ChevronRight size={19}/></button></div>
      <div className="computer-current-explain"><span>지금 일어나는 일</span><p>{topic.steps[step].detail}</p></div>
    </div>
  </div>
  <p className="computer-visual-caveat"><CircleHelp size={15}/> 개념을 이해하기 위한 애니메이션입니다. 실제 하드웨어의 내부 신호·처리 시간·상대적 크기를 그대로 나타내는 것은 아닙니다.</p>
  <SystemsFlowFocus key={topic.id} embedded diagram={stageFlow({
    id:topic.id,title:topic.title+' · 단계별 전체 구조',subtitle:topic.lede,
    domain:'computer',seed:topic.chapter,overview:topic.lede,scenario:topic.takeaway,scenarioLabel:'핵심 정리',
    beginnerLead:topicBeginners[topic.id],beginnerSteps:topicStepBasics[topic.id],
    warning:topic.reality,steps:topic.steps
  })}/>

  <section className="computer-topic-note">
    <div><span>THE KEY IDEA</span><h2>핵심은 이것입니다.</h2><p>{topic.takeaway}</p></div>
  </section>
  {topic.reality&&<div className="computer-reality"><ShieldCheck size={20}/><div><strong>알아두면 좋은 추가 설명</strong><p>{topic.reality}</p></div></div>}
  <div className="computer-detail-expand"><button type="button" onClick={()=>setDetails(v=>!v)} aria-expanded={details}><span>전체 단계 설명 읽기</span><span>{details?'접기 −':'펼치기 +'}</span></button>
    {details&&<div className="computer-detail-lines">{topic.steps.map((st,i)=><section key={i}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{st.title} <small>{st.subtitle}</small></h3><p>{st.detail}</p></div></section>)}</div>}
  </div>
  <button type="button" className="computer-next-topic" onClick={()=>onTopic(next.id)}><span><small>다음 이야기</small><strong>{next.title}</strong><em>{next.technical}</em></span><ArrowRight size={24}/></button>
 </article>
}
export default function ComputerAtlas({view,id,onTopic,onChapter,onHome,onLab}:Props){
 useEffect(()=>{
  const title=view==='topic'?computerById[id||'']?.title:view==='chapter'?computerChapterById[id||'']?.title:'컴퓨터 구조 · 운영체제'
  document.title=(title||'컴퓨터 구조 · 운영체제')+' | whatis.'
 },[view,id])
 if(view==='topic'&&id&&computerById[id])return <ComputerTopicPage key={id} topic={computerById[id]!} onChapter={onChapter} onTopic={onTopic} onLab={onLab}/>
 if(view==='chapter'&&id&&computerChapterById[id])return <ComputerChapterPage key={id} chapter={computerChapterById[id]!} onHome={onHome} onTopic={onTopic} onLab={onLab}/>
 return <ComputerHome onTopic={onTopic} onChapter={onChapter} onLab={onLab}/>
}
