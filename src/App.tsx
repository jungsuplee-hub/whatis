import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
const SiemensArchitect=lazy(()=>import('./SiemensArchitect'))
const PolarionOperations=lazy(()=>import('./PolarionOperations'))
const TeamcenterHandover=lazy(()=>import('./TeamcenterHandover'))
const TeamcenterUserDemo=lazy(()=>import('./TeamcenterUserDemo'))
const PolarionUserDemo=lazy(()=>import('./PolarionUserDemo'))
const ComputerAtlas=lazy(()=>import('./ComputerAtlas'))
const PracticeLab=lazy(()=>import('./PracticeLab'))
import type { Area } from './data'
import AiCourse, { courseIds } from './AiCourse'
import './editorial.css'
import './home-polish.css'
import './mobile-clarity.css'
import './siemens-navigation.css'

type Route = {area: Area|'computer'; page:'home'|'category'|'topic'|'saved'|'tc-demo'|'polarion-demo'|'lab'|'siemens-old'|'teamcenter'|'opcenter'|'opcenter-ai'|'opcenter-lab'|'polarion-ops'|'tc-ops'|'tc-architecture';id?:string;detail?:boolean}
const routeFromHash = ():Route => {
  const paths=decodeURIComponent(window.location.hash.slice(1)).split('/').filter(Boolean)
  if(paths[0]==='computer'){
    if(paths[1]==='lab')return {area:'computer',page:'lab',id:paths[2]}
    if(paths[1]==='chapter'&&paths[2])return {area:'computer',page:'category',id:paths[2]}
    if(paths[1])return {area:'computer',page:'topic',id:paths[1]}
    return {area:'computer',page:'home'}
  }
  if(paths[0]==='siemens'&&paths[1]==='teamcenter'&&paths[2]==='atlas')return {area:'siemens',page:'tc-architecture'}
  if(paths[0]==='siemens'&&paths[1]==='teamcenter'&&paths[2])return {area:'siemens',page:'tc-ops',id:paths[2]}
  if(paths[0]==='siemens'&&paths[1]==='teamcenter')return {area:'siemens',page:'teamcenter'}
  if(paths[0]==='siemens'&&paths[1]==='opcenter'&&paths[2]==='lab')return {area:'siemens',page:'opcenter-lab'}
  if(paths[0]==='siemens'&&paths[1]==='opcenter'&&paths[2]==='ai')return {area:'siemens',page:'opcenter-ai'}
  if(paths[0]==='siemens'&&paths[1]==='opcenter')return {area:'siemens',page:'opcenter'}
  if(paths[0]==='siemens'&&(paths[1]==='old'||paths[1]==='flows'))return {area:'siemens',page:'siemens-old'}
  if(paths[0]==='siemens'&&paths[1]==='ops'&&paths[2])return {area:'siemens',page:'polarion-ops',id:paths[2]}
  if(paths[0]==='siemens'&&paths[1]==='teamcenter-demo')return {area:'siemens',page:'tc-demo'}
  if(paths[0]==='siemens'&&paths[1]==='polarion-demo')return {area:'siemens',page:'polarion-demo'}
  if(paths[0]==='siemens')return {area:'siemens',page:'home'}
  return {area:'general',page:'home',id:paths[0]==='general'&&courseIds.includes(paths[1]||'')?paths[1]:undefined}
}
const hashFor = (r:Route) => r.area==='general'?'#general'+(r.id?'/'+r.id:''):'#'+r.area+(r.page==='topic'?'/'+r.id:r.page==='category'?'/'+(r.area==='computer'?'chapter':'category')+'/'+r.id:r.page==='saved'?'/saved':r.page==='lab'?'/lab'+(r.id?'/'+r.id:''):r.page==='tc-demo'?'/teamcenter-demo':r.page==='polarion-demo'?'/polarion-demo':r.page==='teamcenter'?'/teamcenter':r.page==='tc-architecture'?'/teamcenter/atlas':r.page==='tc-ops'?'/teamcenter/'+r.id:r.page==='opcenter-lab'?'/opcenter/lab':r.page==='opcenter-ai'?'/opcenter/ai':r.page==='opcenter'?'/opcenter':r.page==='siemens-old'?'/old':r.page==='polarion-ops'?'/ops/'+r.id:'')
function OpcenterPresales({ai=false,lab=false}:{ai?:boolean;lab?:boolean}){
  const frame=useRef<HTMLIFrameElement>(null)
  useEffect(()=>{
    const el=frame.current
    if(!el)return
    if(lab){
      const resizeLab=()=>{el.style.height=Math.max(300,window.innerHeight-el.getBoundingClientRect().top-8)+'px'}
      resizeLab()
      window.addEventListener('resize',resizeLab)
      return ()=>window.removeEventListener('resize',resizeLab)
    }
    let observer:ResizeObserver|undefined
    const resize=()=>{
      observer?.disconnect()
      const doc=el.contentDocument
      if(!doc?.body)return
      const update=()=>{el.style.height=Math.ceil(doc.body.getBoundingClientRect().height)+'px'}
      update()
      observer=new ResizeObserver(update)
      observer.observe(doc.body)
    }
    el.addEventListener('load',resize)
    if(el.contentDocument?.readyState==='complete')resize()
    return ()=>{el.removeEventListener('load',resize);observer?.disconnect()}
  },[])
  return <iframe ref={frame} className={"opcenter-presales-frame"+(lab?" opcenter-lab-frame":"")} src={lab?"./mes/?embed=1":ai?"./mes/ai/?embed=1":"./mes/presales/?embed=1"} title={lab?"MES 실습 연구실":ai?"Opcenter AI Deep Dive":"Opcenter Presales Field Guide"}/>
}

function App(){
  const [route,setRoute]=useState<Route>(routeFromHash)
  const navigate=(r:Route)=>{
    setRoute(r)
    if(window.location.hash!==hashFor(r))window.location.hash=hashFor(r)
    window.scrollTo({top:0,behavior:'instant'})
  }
  const home=()=>navigate({area:'general',page:'home'})
  const computerHome=()=>navigate({area:'computer',page:'home'})
  const computerLab=(topicId?:string)=>{
    if(topicId)try{sessionStorage.setItem('whatis:practice:entry:computer',topicId)}catch{/* browser storage disabled */}
    navigate({area:'computer',page:'lab',id:topicId})
  }
  const computerTopic=(id:string)=>navigate({area:'computer',page:'topic',id})
  const computerChapter=(id:string)=>navigate({area:'computer',page:'category',id})
  useEffect(()=>{
    const fn=()=>{setRoute(routeFromHash());window.scrollTo({top:0,behavior:'instant'})}
    window.addEventListener('hashchange',fn)
    return()=>window.removeEventListener('hashchange',fn)
  },[])
  useEffect(()=>{if(route.area==='computer')return;document.title=(route.area==='general'?'AI 코스 | ':'')+'whatis. — 어렵지 않은 기술 이야기'},[route.area])
  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      const active=e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement
      if(((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')||(e.key==='/'&&!active)){
        const ops=document.getElementById('teamcenter-ops-search')||document.getElementById('polarion-ops-search');if(ops instanceof HTMLInputElement){e.preventDefault();ops.focus();ops.select()}
      }
    }
    document.addEventListener('keydown',handler)
    return()=>document.removeEventListener('keydown',handler)
  },[])

  return <div className="new-app">
    <header className={'site-header'+(route.area==='siemens'?' site-header-siemens':'')}>
      <div className="header-inner">
        <button type="button" className="site-brand" onClick={home} aria-label="WHATIS 첫 화면">whatis<span>.</span></button>
        <nav className="site-nav" aria-label="주제별 메뉴">
          <button type="button" className={route.area==='general'?'active':''} onClick={home}>일반 AI</button>
          <button type="button" className={route.area==='computer'?'active':''} onClick={computerHome}>컴퓨터 구조</button>
          <button type="button" className={route.area==='siemens'?'active':''} onClick={()=>navigate({area:'siemens',page:'home'})}>Siemens</button>
        </nav>
        <div className="header-actions">
          {route.area!=='general'&&<button type="button" aria-label={route.area==='computer'?'컴퓨터 기술 검색':route.area==='siemens'?(route.page.startsWith('tc-')||route.page==='teamcenter'?'Teamcenter 운영 가이드 검색':'Polarion 운영 가이드 검색'):'AI 기술 검색'} className="header-icon" onClick={()=>{if(route.area==='computer'){computerHome();window.setTimeout(()=>document.getElementById('computer-tech-search')?.focus(),90)}else if(route.area==='siemens'){const tc=route.page.startsWith('tc-')||route.page==='teamcenter';navigate({area:'siemens',page:tc?'teamcenter':'home'});window.setTimeout(()=>document.getElementById(tc?'teamcenter-ops-search':'polarion-ops-search')?.focus(),250)}}}><Search size={20}/></button>}
        </div>
      </div>
      {route.area==='siemens'&&<nav className="siemens-subnav" aria-label="Siemens 제품 메뉴">
        <button type="button" className={['teamcenter','tc-ops','tc-architecture','tc-demo','siemens-old'].includes(route.page)?'active':''} aria-current={['teamcenter','tc-ops','tc-architecture','tc-demo','siemens-old'].includes(route.page)?'page':undefined} onClick={()=>navigate({area:'siemens',page:'teamcenter'})}>Teamcenter</button>
        <button type="button" className={['home','polarion-ops','polarion-demo'].includes(route.page)?'active':''} aria-current={['home','polarion-ops','polarion-demo'].includes(route.page)?'page':undefined} onClick={()=>navigate({area:'siemens',page:'home'})}>Polarion</button>
        <button type="button" className={['opcenter','opcenter-ai','opcenter-lab'].includes(route.page)?'active':''} aria-current={['opcenter','opcenter-ai','opcenter-lab'].includes(route.page)?'page':undefined} onClick={()=>navigate({area:'siemens',page:'opcenter'})}>Opcenter</button>
      </nav>}
    </header>
    <main className="site-main">
      {route.page==='home'&&route.area==='general'&&<AiCourse view={route.id} onNavigate={id=>navigate({area:'general',page:'home',id})}/>}
      {route.page==='lab'&&route.area==='computer'&&<Suspense fallback={<div className="computer-page-loading" role="status">컴퓨터 구조 실습 연구실을 준비하고 있습니다.</div>}><PracticeLab domain="computer" startId={route.id} onBack={computerHome}/></Suspense>}
      {(route.page==='home'||route.page==='polarion-ops')&&route.area==='siemens'&&<Suspense fallback={<div className="computer-page-loading" role="status">Polarion 운영 가이드를 준비하고 있습니다.</div>}><PolarionOperations documentId={route.page==='polarion-ops'?route.id:undefined} onNavigate={id=>navigate(id?{area:'siemens',page:'polarion-ops',id}:{area:'siemens',page:'home'})} onOld={()=>navigate({area:'siemens',page:'siemens-old'})} onDemo={()=>navigate({area:'siemens',page:'polarion-demo'})}/></Suspense>}
      {['teamcenter','tc-ops'].includes(route.page)&&route.area==='siemens'&&<Suspense fallback={<div className="computer-page-loading" role="status">Teamcenter 운영 가이드를 준비하고 있습니다.</div>}><TeamcenterHandover id={route.page==='tc-ops'?route.id:undefined} onNavigate={id=>navigate(id?{area:'siemens',page:'tc-ops',id}:{area:'siemens',page:'teamcenter'})} onArchitecture={()=>navigate({area:'siemens',page:'tc-architecture'})} onDemo={()=>navigate({area:'siemens',page:'tc-demo'})}/></Suspense>}
      {(route.page==='siemens-old'||route.page==='tc-architecture')&&route.area==='siemens'&&<Suspense fallback={<div className="computer-page-loading" role="status">Siemens 아키텍처 화면을 준비하고 있습니다.</div>}><SiemensArchitect key={route.page} scopedTeamcenter={route.page==='tc-architecture'} onHome={()=>navigate({area:'siemens',page:'home'})} onTeamcenterDemo={()=>navigate({area:'siemens',page:'tc-demo'})} onPolarionDemo={()=>navigate({area:'siemens',page:'polarion-demo'})}/></Suspense>}
      {['opcenter','opcenter-ai','opcenter-lab'].includes(route.page)&&route.area==='siemens'&&<>
        <nav className="opcenter-subnav" aria-label="Opcenter 학습 메뉴">
          <button className={route.page==='opcenter'?'active':''} aria-current={route.page==='opcenter'?'page':undefined} onClick={()=>navigate({area:'siemens',page:'opcenter'})}>Presales 종합 가이드</button>
          <button className={route.page==='opcenter-ai'?'active':''} aria-current={route.page==='opcenter-ai'?'page':undefined} onClick={()=>navigate({area:'siemens',page:'opcenter-ai'})}>AI 심화 가이드</button>
          <button className={route.page==='opcenter-lab'?'active':''} aria-current={route.page==='opcenter-lab'?'page':undefined} onClick={()=>navigate({area:'siemens',page:'opcenter-lab'})}>MES 실습</button>
        </nav><OpcenterPresales key={route.page} ai={route.page==='opcenter-ai'} lab={route.page==='opcenter-lab'}/>
      </>}
      {route.page==='tc-demo'&&route.area==='siemens'&&<Suspense fallback={<div className="computer-page-loading" role="status">Teamcenter 학습 화면을 준비하고 있습니다.</div>}><TeamcenterUserDemo onBack={()=>navigate({area:'siemens',page:'teamcenter'})}/></Suspense>}
      {route.page==='polarion-demo'&&route.area==='siemens'&&<Suspense fallback={<div className="computer-page-loading" role="status">Polarion 학습 화면을 준비하고 있습니다.</div>}><PolarionUserDemo onBack={()=>navigate({area:'siemens',page:'home'})}/></Suspense>}
      {route.area==='computer'&&route.page!=='lab'&&<Suspense fallback={<div className="computer-page-loading" role="status">컴퓨터 구조 학습 화면을 준비하고 있습니다.</div>}><ComputerAtlas view={route.page==='category'?'chapter':route.page==='topic'?'topic':'home'} id={route.id} onTopic={computerTopic} onChapter={computerChapter} onHome={computerHome} onLab={computerLab}/></Suspense>}
    </main>
    <footer className="site-footer"><span>whatis. <i>알수록 가까워지는 기술</i></span><span>기술을 눈으로 이해하는 인터랙티브 학습</span></footer>
  </div>
}

export default App
