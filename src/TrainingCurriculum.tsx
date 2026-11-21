import {useEffect,useState} from 'react'
import {ArrowRight,BookOpen,Check,CheckCircle2,ChevronDown,ChevronRight,Clock,History,LayoutList,ListChecks,Pause,Play,RotateCcw,Search,SkipForward,X} from 'lucide-react'
import './training-curriculum.css'
import {TrainingSpotlight} from './TrainingSpotlight'

export type TrainingLesson<S extends string> = {
  id:string
  chapter:string
  title:string
  section:S
  event:string
  description:string
  hint:string
  source?:string
}
export type TrainingProgress = {
  activeId:string|null
  completed:string[]
  skipped:string[]
  paused:boolean
  updatedAt:string
}
const empty:TrainingProgress={activeId:null,completed:[],skipped:[],paused:true,updatedAt:''}
function readProgress<S extends string>(key:string,lessons:readonly TrainingLesson<S>[]):TrainingProgress{
  try{
    const raw=JSON.parse(localStorage.getItem(key)||'null')
    if(raw&&Array.isArray(raw.completed)&&Array.isArray(raw.skipped)){
      const valid=new Set(lessons.map(x=>x.id))
      return {
        activeId:typeof raw.activeId==='string'&&valid.has(raw.activeId)?raw.activeId:null,
        completed:raw.completed.filter((x:unknown)=>typeof x==='string'&&valid.has(x)),
        skipped:raw.skipped.filter((x:unknown)=>typeof x==='string'&&valid.has(x)),
        paused:raw.paused===true,
        updatedAt:typeof raw.updatedAt==='string'?raw.updatedAt:''
      }
    }
  }catch{/* localStorage unavailable or old data */}
  return {...empty}
}
export function useTrainingCourse<S extends string>(storageKey:string,lessons:readonly TrainingLesson<S>[],navigate:(s:S)=>void){
  const [progress,setProgress]=useState<TrainingProgress>(()=>readProgress(storageKey,lessons))
  const [listOpen,setListOpen]=useState(false)
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(progress))}catch{/* storage unavailable */}},[progress,storageKey])
  const index=lessons.findIndex(x=>x.id===progress.activeId)
  const current=index>=0?lessons[index]:null
  const completed=new Set(progress.completed)
  const skipped=new Set(progress.skipped)
  const doneCount=lessons.filter(x=>completed.has(x.id)).length
  const passedCount=doneCount+lessons.filter(x=>skipped.has(x.id)&&!completed.has(x.id)).length
  const finished=progress.activeId===null&&passedCount>=lessons.length&&lessons.length>0
  const nextUnfinished=lessons.find(x=>!completed.has(x.id)&&!skipped.has(x.id))
  const navigateTo=(step:TrainingLesson<S>)=>{
    navigate(step.section)
    window.requestAnimationFrame(()=>document.querySelector('[data-training-host]')?.scrollIntoView({block:'start',behavior:'smooth'}))
  }
  const start=()=>{
    const step=current||nextUnfinished||lessons[0]
    if(!step)return
    setProgress(p=>({...p,activeId:step.id,paused:false,updatedAt:new Date().toISOString()}))
    navigateTo(step)
  }
  const jump=(id:string)=>{
    const step=lessons.find(x=>x.id===id)
    if(!step)return
    setProgress(p=>({...p,activeId:id,paused:false,updatedAt:new Date().toISOString()}))
    navigateTo(step)
  }
  const finishStep=(status:'completed'|'skipped')=>{
    if(!current||progress.paused)return false
    const next=lessons[index+1]
    setProgress(p=>{
      const completed=status==='completed'?[...new Set([...p.completed,current.id])]:p.completed
      const skipped=status==='skipped'?[...new Set([...p.skipped,current.id])].filter(x=>!completed.includes(x)):p.skipped.filter(x=>x!==current.id)
      return {activeId:next?.id??null,completed,skipped,paused:!next,updatedAt:new Date().toISOString()}
    })
    if(next&&next.section!==current.section)navigateTo(next)
    return true
  }
  const mark=(event:string)=>current?.event===event&&finishStep('completed')
  const skip=()=>finishStep('skipped')
  const pause=()=>setProgress(p=>({...p,paused:true,updatedAt:new Date().toISOString()}))
  const reset=()=>{
    setProgress({...empty})
    setListOpen(true)
  }
  return {progress,current,doneCount,passedCount,finished,listOpen,setListOpen,start,jump,mark,skip,pause,reset,completed,skipped}
}
export type TrainingCourseReturn<S extends string> = ReturnType<typeof useTrainingCourse<S>>
type Props<S extends string> = {
  title:string
  lessons:readonly TrainingLesson<S>[]
  course:TrainingCourseReturn<S>
  onResetData:()=>void
  brand:'polarion'|'teamcenter'
}
export function TrainingCurriculum<S extends string>({title,lessons,course,onResetData,brand}:Props<S>){
  const [find,setFind]=useState('')
  const [expanded,setExpanded]=useState<string[]>([])
  const chapters=[...new Set(lessons.map(x=>x.chapter))]
  const {current,progress,doneCount,skipped,completed,finished}=course
  const started=progress.activeId!==null||course.passedCount>0
  const chapterNumber=current?chapters.indexOf(current.chapter)+1:0
  return <div className="training-course" data-training-host>
    <TrainingSpotlight step={current} brand={brand} paused={progress.paused}/>
    <div className="training-course-main">
      <div className="training-course-brand"><BookOpen size={19}/><span>{title}<strong>{finished?'전체 과정 종료':current&&!progress.paused?'연속 실습 진행 중':started?'이전 진행 기록이 있습니다':'사용자 기능 전체 실습'}</strong></span></div>
      <div className="training-course-progress" aria-label={'전체 실습 '+doneCount+'/'+lessons.length+'개 완료'}>
        <div><strong>{doneCount} / {lessons.length}</strong><span>직접 완료 {doneCount} · 건너뜀 {skipped.size}</span></div>
        <div className="training-course-progress-bar"><i style={{width:(doneCount/Math.max(lessons.length,1)*100)+'%'}}/></div>
      </div>
      <div className="training-course-commands">
        <button className="training-primary" onClick={course.start}><Play size={15}/>{finished?'완료한 과정 다시 보기':current&&!progress.paused?'현재 단계로 이동':started?'이어하기':'전체 실습 시작'}</button>
        <button className="training-course-list-btn" onClick={()=>course.setListOpen(v=>!v)} aria-expanded={course.listOpen}><ListChecks size={15}/> 전체 목록 <span>{lessons.length}</span></button>
        {current&&!progress.paused&&<button className="training-pause" onClick={course.pause} title="진행 위치를 저장하고 중단"><Pause size={15}/> 중단</button>}
      </div>
    </div>
    {current&&!progress.paused&&<div className="training-course-now" role="region" aria-label="현재 실습 단계">
      <div className="training-course-now-head"><span>CHAPTER {String(chapterNumber).padStart(2,'0')} / {chapters.length} · STEP {indexOfCurrent(lessons,current)+1} / {lessons.length}</span><strong>{current.chapter}</strong></div>
      <div className="training-course-now-info"><h3>{current.title}</h3><p>{current.description}</p><div><ArrowRight size={14}/><strong>화면에서 실행할 작업:</strong> {current.hint}</div></div>
      <div className="training-course-now-buttons"><button className="training-course-find-target" onClick={()=>{const target=document.querySelector('[data-training-focus]');if(target)target.scrollIntoView({behavior:'smooth',block:'center'});else course.jump(current.id)}}><ArrowRight size={14}/> 다음 작업 위치 보기</button><button onClick={()=>course.jump(current.id)}><ArrowRight size={14}/> 기능 화면으로 이동</button><button onClick={course.skip} title="체험하지 않은 단계로 기록"><SkipForward size={14}/> 건너뛰기</button></div>
    </div>}
    {finished&&<div className="training-course-done"><CheckCircle2 size={17}/><span><strong>전체 실습 목차를 끝까지 진행했습니다.</strong> 직접 조작으로 완료한 {doneCount}개와 건너뛴 {skipped.size}개를 구분해 기록했습니다.</span><button onClick={()=>course.setListOpen(true)}>결과 확인</button></div>}
    {started&&progress.paused&&!finished&&<div className="training-course-resume"><Clock size={16}/> 이전 학습 위치가 저장되어 있습니다. <button onClick={course.start}>이어서 실습하기 <ArrowRight size={14}/></button></div>}
    {course.listOpen&&<div className="training-course-outline" role="region" aria-label="전체 실습 목차">
      <div className="training-course-outline-head"><div><h3><LayoutList size={17}/> 전체 실습 목차</h3><p>기능별로 직접 이동할 수 있습니다. 완료·건너뛰기·진행 중 상태를 저장합니다.</p></div><button onClick={()=>course.setListOpen(false)} aria-label="실습 목록 닫기"><X size={19}/></button></div>
      <div className="training-course-outline-tools"><label><Search size={15}/><input placeholder="기능명이나 단계 검색" value={find} onChange={e=>setFind(e.target.value)}/></label><button onClick={()=>setExpanded(expanded.length===chapters.length?[]:chapters)}>{expanded.length===chapters.length?'전체 접기':'전체 펼치기'}</button></div>
      <div className="training-course-chapters">{chapters.map((chapter,chapterIndex)=>{
        const items=lessons.filter(x=>x.chapter===chapter)
        const chapterDone=items.filter(x=>completed.has(x.id)).length
        const matching=items.filter(x=>(x.title+' '+x.description+' '+x.hint).toLowerCase().includes(find.toLowerCase()))
        const open=expanded.includes(chapter)||chapter===current?.chapter||Boolean(find.trim())
        if(find.trim()&&!matching.length)return null
        return <section key={chapter} className="training-course-chapter">
          <button className="training-course-chapter-toggle" onClick={()=>setExpanded(old=>old.includes(chapter)?old.filter(x=>x!==chapter):[...old,chapter])} aria-expanded={open}><span>{String(chapterIndex+1).padStart(2,'0')}</span><strong>{chapter}</strong><small>{chapterDone}/{items.length} 완료</small>{open?<ChevronDown size={17}/>:<ChevronRight size={17}/>}</button>
          {open&&<div className="training-course-lesson-list">{matching.map(step=>{
            const no=lessons.indexOf(step)+1
            const isCurrent=current?.id===step.id&&!progress.paused
            const status=completed.has(step.id)?'done':skipped.has(step.id)?'skipped':isCurrent?'current':'new'
            return <button key={step.id} className={'training-course-lesson '+status} onClick={()=>course.jump(step.id)}><span className="training-course-step-num">{status==='done'?<Check size={14}/>:status==='skipped'?<SkipForward size={13}/>:no}</span><span className="training-course-step-copy"><strong>{step.title}</strong><small>{step.hint}</small></span><em>{status==='done'?'완료':status==='skipped'?'건너뜀':status==='current'?'진행 중':'시작'}</em><ChevronRight size={14}/></button>
          })}</div>}
        </section>
      })}</div>
      <div className="training-course-outline-footer"><span><History size={14}/> 학습 기록은 현재 브라우저에 저장됩니다. 다른 기기에는 동기화되지 않습니다.</span><button onClick={()=>{if(window.confirm('실습 진행 기록만 초기화할까요? 데모 데이터는 유지됩니다.'))course.reset()}}><RotateCcw size={13}/> 진행 기록 초기화</button><button onClick={()=>{if(window.confirm('모든 실습 기록과 데모 데이터를 처음 상태로 되돌릴까요?'))onResetData()}}><RotateCcw size={13}/> 전체 처음부터</button></div>
    </div>}
  </div>
}
function indexOfCurrent<S extends string>(lessons:readonly TrainingLesson<S>[],step:TrainingLesson<S>){return lessons.findIndex(x=>x.id===step.id)}
