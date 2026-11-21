import {useEffect,useMemo,useRef,useState} from 'react'
import {ArrowLeft,ArrowRight,BookOpen,Check,CheckCircle2,ChevronRight,GraduationCap,Info,Lightbulb,ListChecks,Play,RotateCcw,Search,ShieldCheck,Trophy} from 'lucide-react'
import PracticeExercise from './PracticeExercises'
import {allLessons,type LabDomain,type LabLesson} from './practiceLabData'
import {topicById} from './data'
import {computerById} from './computerContent'
import './practice-lab.css'

type Props={domain:LabDomain;startId?:string;onBack:()=>void}
type CourseProgress={currentId:string;completed:string[];attempts:Record<string,number>;updatedAt:string}
const key=(domain:LabDomain)=>'whatis:interactive-practice:v1:'+domain
function loadProgress(domain:LabDomain,lessons:LabLesson[]):CourseProgress{
  const base={currentId:lessons[0].id,completed:[],attempts:{},updatedAt:''}
  try{
    const saved=JSON.parse(localStorage.getItem(key(domain))||'null') as Partial<CourseProgress>|null
    if(saved&&Array.isArray(saved.completed)){
      const known=new Set(lessons.map(l=>l.id))
      const completed=saved.completed.filter((x):x is string=>typeof x==='string'&&known.has(x))
      const currentId=typeof saved.currentId==='string'&&known.has(saved.currentId)?saved.currentId:(lessons.find(x=>!completed.includes(x.id))?.id||base.currentId)
      return {currentId,completed,attempts:saved.attempts||{},updatedAt:saved.updatedAt||''}
    }
  }catch{/* disabled local storage */}
  return base
}
function timestamp(){return new Date().toISOString()}
function resolveMission(domain:LabDomain,requested:string|undefined,lessons:LabLesson[]):string|undefined{
  if(!requested)return undefined
  const exact=lessons.find(l=>l.id===requested||l.sourceId===requested)
  if(exact)return exact.id
  if(domain==='ai'){
    const category=topicById(requested)?.category
    const fallback:Record<string,string>={foundations:'prompt',models:'sampling',retrieval:'embedding',agents:'tools',training:'sampling',production:'evaluation'}
    return fallback[category||'']
  }
  const chapter=computerById[requested]?.chapter
  const fallback:Record<string,string>={hardware:'cpu',parallel:'cpu',memory:'cache',operating:'scheduler',virtual:'paging',storage:'raid',resilience:'failover',cloud:'capacity'}
  return fallback[chapter||'']
}
export default function PracticeLab({domain,startId,onBack}:Props){
  const lessons=allLessons[domain]
  const [progress,setProgress]=useState<CourseProgress>(()=>{
    const saved=loadProgress(domain,lessons)
    const requested=resolveMission(domain,startId,lessons)
    let explicitEntry=false
    try{
      const entryKey='whatis:practice:entry:'+domain
      explicitEntry=Boolean(startId&&sessionStorage.getItem(entryKey)===startId)
      if(explicitEntry)sessionStorage.removeItem(entryKey)
    }catch{/* browser storage disabled */}
    // Explicit clicks on related-topic lessons jump to their lab.
    // A normal reload restores the user's current stage instead.
    return requested&&(explicitEntry||!saved.updatedAt)?{...saved,currentId:requested}:saved
  })
  const [message,setMessage]=useState('')
  const [showOutline,setShowOutline]=useState(true)
  const [search,setSearch]=useState('')
  const [resetCounter,setResetCounter]=useState(0)
  const [lastCompleted,setLastCompleted]=useState('')
  const timeout=useRef<number|null>(null)
  const area=domain==='ai'?'AI':'COMPUTER'
  const isAI=domain==='ai'
  const activeIndex=Math.max(0,lessons.findIndex(x=>x.id===progress.currentId))
  const active=lessons[activeIndex]
  const completed=new Set(progress.completed)
  const solved=completed.has(active.id)
  const allDone=progress.completed.length===lessons.length
  const chapterNames=[...new Set(lessons.map(l=>l.chapter))]
  const donePercent=Math.round(progress.completed.length/lessons.length*100)
  const matching=useMemo(()=>lessons.filter(x=>(x.title+' '+x.english+' '+x.chapter).toLowerCase().includes(search.trim().toLowerCase())),[lessons,search])
  useEffect(()=>{document.title=(isAI?'AI':'컴퓨터 구조')+' 실습 연구실 | whatis.'},[isAI])
  const lastRouteId=useRef(startId)
  useEffect(()=>{
    if(startId===lastRouteId.current)return
    lastRouteId.current=startId
    const requested=resolveMission(domain,startId,lessons)
    if(requested)setProgress(old=>old.currentId===requested?old:{...old,currentId:requested,updatedAt:timestamp()})
  },[domain,startId,lessons])
  useEffect(()=>{try{localStorage.setItem(key(domain),JSON.stringify(progress))}catch{/* browser storage unavailable */}},[progress,domain])
  useEffect(()=>()=>{if(timeout.current!==null)window.clearTimeout(timeout.current)},[])
  const scrollToStage=()=>{
    window.requestAnimationFrame(()=>document.getElementById('practice-lab-stage')?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}))
  }
  const move=(index:number)=>{
    if(index<0||index>=lessons.length)return
    if(timeout.current!==null){window.clearTimeout(timeout.current);timeout.current=null}
    setProgress(old=>({...old,currentId:lessons[index].id,updatedAt:timestamp()}))
    setMessage('');setLastCompleted('')
    scrollToStage()
  }
  const solve=(note:string)=>{
    if(timeout.current!==null)window.clearTimeout(timeout.current)
    const id=active.id
    setProgress(old=>({...old,completed:[...new Set([...old.completed,id])],attempts:{...old.attempts,[id]:(old.attempts[id]||0)+1},updatedAt:timestamp()}))
    setMessage(note)
    setLastCompleted(id)
    if(activeIndex<lessons.length-1){
      timeout.current=window.setTimeout(()=>{
        setProgress(old=>old.currentId===id?{...old,currentId:lessons[activeIndex+1].id,updatedAt:timestamp()}:old)
        setMessage('');setLastCompleted('')
        timeout.current=null
        scrollToStage()
      },4400)
    }
  }
  const resetAll=()=>{
    if(!window.confirm('이 분야의 실습 진도와 입력값을 모두 초기화할까요?'))return
    if(timeout.current!==null){window.clearTimeout(timeout.current);timeout.current=null}
    for(const l of lessons){try{localStorage.removeItem('whatis:lab:exercise:'+domain+':'+l.id)}catch{/* ignore */}}
    setProgress({currentId:lessons[0].id,completed:[],attempts:{},updatedAt:''})
    setMessage('');setLastCompleted('');setResetCounter(v=>v+1)
    scrollToStage()
  }
  const sourceLink='#'+(isAI?'general':'computer')+'/'+active.sourceId
  return <div className={'plab-page plab-'+domain}>
    <div className="plab-breadcrumb"><button onClick={onBack}><ArrowLeft size={16}/>{isAI?'일반 AI':'컴퓨터 구조'} 돌아가기</button><span>/</span><strong>실습 연구실</strong><span className="plab-training-label"><ShieldCheck size={15}/> LOCAL SIMULATION</span></div>
    <header className="plab-hero">
      <div><span className="plab-eyebrow"><span/> WHATIS. HANDS-ON LEARNING / {area}</span>
      <h1>{isAI?'AI를 직접 움직이며':'컴퓨터 안을 직접 조작하며'}<br/><em>배우는 실습 연구실</em></h1>
      <p>{isAI?'프롬프트를 설계하고, 토큰을 나누고, 문서 검색과 근거 평가를 직접 실험해 보세요.':'비트·CPU·캐시·운영체제·RAID·장애 대응을 조작하고 계산 결과를 확인해 보세요.'}</p>
      <div className="plab-hero-actions"><button onClick={()=>{const i=lessons.findIndex(x=>!completed.has(x.id));move(i===-1?0:i)}}><Play size={17}/>{progress.completed.length?'이어 배우기':'첫 실습 시작'}<ArrowRight size={16}/></button><button className="outline" onClick={()=>setShowOutline(v=>!v)}><ListChecks size={16}/>{showOutline?'목록 접기':'전체 실습 목록'}</button></div>
      </div>
      <div className="plab-hero-visual"><span>LEARNING PROGRESS</span><div className="plab-progress-ring" style={{'--progress':donePercent+'%'} as React.CSSProperties}><strong>{donePercent}%</strong><small>COMPLETE</small></div><div className="plab-hero-metrics"><span><b>{progress.completed.length}</b> 완료</span><span><b>{lessons.length}</b> 전체 실습</span><span><b>{chapterNames.length}</b> 학습 분야</span></div></div>
    </header>
    <div className="plab-content">
      {showOutline&&<aside className="plab-outline" aria-label="전체 실습 목차">
        <div className="plab-outline-heading"><span><ListChecks size={17}/> LEARNING PATH</span><h2>실습 목록</h2><p>끝낸 실습은 기록됩니다. 중간 단계부터도 시작할 수 있습니다.</p></div>
        <label className="plab-outline-search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="실습 검색"/></label>
        <div className="plab-outline-scroll">{chapterNames.map(chapter=>{
          const rows=matching.filter(l=>l.chapter===chapter)
          if(!rows.length)return null
          return <div className="plab-outline-chapter" key={chapter}><div><strong>{chapter}</strong><small>{lessons.filter(x=>x.chapter===chapter&&completed.has(x.id)).length} / {lessons.filter(x=>x.chapter===chapter).length}</small></div>
            {rows.map(l=>{const i=lessons.indexOf(l);return <button key={l.id} className={active.id===l.id?'current':''} onClick={()=>move(i)}><span className={completed.has(l.id)?'passed':'pending'}>{completed.has(l.id)?<Check size={14}/>:String(i+1).padStart(2,'0')}</span><span><strong>{l.title}</strong><small>{l.english}</small></span><ChevronRight size={15}/></button>})}</div>
        })}</div>
        <div className="plab-outline-footer"><span><CheckCircle2 size={14}/> {progress.completed.length} / {lessons.length} 완료</span><button onClick={resetAll}><RotateCcw size={13}/> 처음부터</button></div>
      </aside>}
      <main id="practice-lab-stage" className="plab-stage" aria-label="현재 실습">
        <div className="plab-stage-top"><div><span>MISSION {String(activeIndex+1).padStart(2,'0')} / {lessons.length}</span><span className="plab-stage-chapter">{active.chapter}</span></div><div>{solved?<span className="plab-finished-tag"><CheckCircle2 size={15}/> 완료한 실습</span>:<span className="plab-pending-tag">직접 조작 실습</span>}</div></div>
        <div className="plab-progress-line"><span style={{width:donePercent+'%'}}/></div>
        <div className="plab-stage-intro"><span>{active.english}</span><h2>{active.title}</h2><p>{active.goal}</p></div>
        <section className="plab-mission"><div className="plab-mission-heading"><span>01 / 직접 해보기</span><strong>INTERACTIVE SANDBOX</strong></div><PracticeExercise key={domain+'-'+active.id+'-'+resetCounter} domain={domain} id={active.id} solved={solved} solve={solve}/></section>
        {message&&lastCompleted===active.id&&<div className="plab-success" role="status"><Trophy size={23}/><div><strong>실습 완료!</strong><p>{message}</p>{activeIndex<lessons.length-1&&<small>다음 실습으로 자동 진행합니다. 해설을 더 읽고 싶다면 아래 목록에서 다시 열 수 있습니다.</small>}</div><button onClick={()=>move(activeIndex+1)} disabled={activeIndex===lessons.length-1}>{activeIndex===lessons.length-1?'마지막 실습':'다음 실습'}<ArrowRight size={16}/></button></div>}
        <div className="plab-concept">
          <div><span><Lightbulb size={17}/> 02 / 이해했나요?</span><h3>이번 실습이 보여주는 원리</h3><p>{active.concept}</p>{active.sourceNote&&<p>{active.sourceNote}</p>}</div>
          <a href={sourceLink}><BookOpen size={16}/> 기존 기술 설명 읽기 <ArrowRight size={15}/></a>
        </div>
        <div className="plab-stage-nav"><button disabled={activeIndex===0} onClick={()=>move(activeIndex-1)}><ArrowLeft size={16}/> 이전 실습</button><span>{activeIndex+1} / {lessons.length}</span><button onClick={()=>move(activeIndex+1)} disabled={activeIndex===lessons.length-1}>다음 실습 <ArrowRight size={16}/></button></div>
        <p className="plab-caution"><Info size={16}/> 실제 서비스나 운영 중인 서버에 연결하지 않는 브라우저 내 학습 시뮬레이션입니다. 계산 결과는 각 실습에 명시된 가정에만 적용됩니다. 진도는 현재 브라우저에 저장되며 다른 기기와 동기화되지 않습니다.</p>
      </main>
    </div>
    {allDone&&<div className="plab-complete"><GraduationCap size={22}/><strong>{isAI?'AI':'컴퓨터 구조'} 전체 실습 완료</strong><span>모든 실습을 직접 검증했습니다. 완료 기록을 유지하면서 언제든 다시 연습할 수 있습니다.</span><button onClick={resetAll}>처음부터 다시 학습</button></div>}
  </div>
}
