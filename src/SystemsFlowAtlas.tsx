import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, CircleHelp, GitBranch, Maximize2, Pause, Play, X } from 'lucide-react'
import type { FlowDiagram, FlowDomain, FlowLayout, FlowNode } from './systemsFlowData'
import { flowByDomain } from './systemsFlowData'
import './systems-flow-atlas.css'

type Point=[number,number]
const placements:Record<FlowLayout,Point[]>={
 pipeline:[[30,77],[270,77],[510,77],[510,222],[270,222],[30,222]],
 fork:[[16,144],[203,144],[475,34],[475,144],[475,254],[675,144]],
 cycle:[[30,77],[270,77],[510,77],[510,222],[270,222],[30,222]],
 ladder:[[30,77],[270,77],[510,77],[30,222],[270,222],[510,222]],
 split:[[14,139],[180,54],[180,235],[365,54],[365,235],[526,139]],
 reverse:[[30,77],[270,77],[510,77],[510,222],[270,222],[30,222]]
}
const nodeWidth=142,nodeHeight=68
function connector(a:Point,b:Point,reverse=false,layout?:FlowLayout,fromIndex?:number,toIndex?:number){
 const [ax,ay]=a,[bx,by]=b
 const dx=bx-ax,dy=by-ay
 // The Agentic RAG retry edge travels around the outside of the lower row.
 if(layout==='fork'&&fromIndex===4&&toIndex===1)
  return 'M 546 322 V 334 H 182 V 202 H 203'
 // Dedicated ports separate fork arrows instead of using a cramped branch spine.
 // The upper branch enters the lower result from its top-right port,
 // never against the outgoing right-hand arrow of that same result.
 if(layout==='fork'&&fromIndex===2&&toIndex===4)
  return 'M 617 68 H 635 V 232 H 588 V 254'
 if(layout==='fork'&&fromIndex===1){
  const sx=ax+nodeWidth,ex=bx
  if(toIndex===2)return `M ${sx} ${ay+16} H 390 V ${by+34} H ${ex}`
  if(toIndex===3)return `M ${sx} ${ay+34} H ${ex}`
  if(toIndex===4)return `M ${sx} ${ay+52} H 410 V ${by+34} H ${ex}`
 }
 if(layout==='fork'&&toIndex===5){
  const sx=ax+nodeWidth,ex=bx
  if(fromIndex===2)return `M ${sx} ${ay+34} H 640 V ${by+16} H ${ex}`
  if(fromIndex===3)return `M ${sx} ${ay+34} H ${ex}`
  if(fromIndex===4)return `M ${sx} ${ay+34} H 654 V ${by+52} H ${ex}`
 }
 // Split flowboards use explicit top/bottom lanes for long shortcuts.
 // Direct mid-lane routing would otherwise cross the other branch's cards.
 if(layout==='split'&&fromIndex===0&&toIndex===3)
  return 'M 85 139 V 19 H 436 V 54'
 if(layout==='split'&&fromIndex===0&&toIndex===4)
  return 'M 85 207 V 325 H 436 V 303'
 if(layout==='split'&&fromIndex===2&&toIndex===5)
  return 'M 251 303 V 325 H 597 V 207'
 if(Math.abs(dx)<44&&Math.abs(dy)>170){
  const sx=ax+nodeWidth,ex=bx+nodeWidth,rail=Math.min(665,Math.max(sx,ex)+18)
  return `M ${sx} ${ay+nodeHeight/2} H ${rail} V ${by+nodeHeight/2} H ${ex}`
 }
 if(reverse){
  const sx=ax+nodeWidth/2,ex=bx+nodeWidth/2
  return `M ${sx} ${ay+nodeHeight} V 327 H 665 V 12 H ${ex} V ${by}`
 }
 // Two-row jumps go through the clear horizontal lane between the rows,
 // rather than entering another service card on the destination row.
 if(Math.abs(dy)>114){
  const forward=dy>0
  const sx=ax+nodeWidth/2, ex=bx+nodeWidth/2
  const sy=forward?ay+nodeHeight:ay
  const ey=forward?by:by+nodeHeight
  const mid=(sy+ey)/2
  return `M ${sx} ${sy} V ${mid} H ${ex} V ${ey}`
 }
 if(Math.abs(dx)<44){
  const sx=ax+nodeWidth/2,ex=bx+nodeWidth/2
  const sy=dy>=0?ay+nodeHeight:ay
  const ey=dy>=0?by:by+nodeHeight
  const middle=(sy+ey)/2
  return `M ${sx} ${sy} V ${middle} H ${ex} V ${ey}`
 }
 const forward=dx>0
 const sx=forward?ax+nodeWidth:ax,ex=forward?bx:bx+nodeWidth
 const sy=ay+nodeHeight/2,ey=by+nodeHeight/2
 const mid=(sx+ex)/2
 return `M ${sx} ${sy} H ${mid} V ${ey} H ${ex}`
}
const domainWord:Record<FlowDomain,string>={ai:'AI SYSTEMS',computer:'COMPUTER SYSTEMS',teamcenter:'TEAMCENTER 2606',polarion:'POLARION 2606'}
const topicLayout:Record<string,FlowLayout>={foundations:'pipeline',models:'cycle',retrieval:'ladder',training:'reverse',production:'split'}
const topicSpecificLayout:Record<string,FlowLayout>={
 'ai-agent':'cycle','function-calling':'pipeline','mcp':'ladder',
 'orchestration':'cycle','context-memory':'reverse'
}
function defaultLayouts(i:number):FlowLayout{return (['pipeline','fork','cycle','ladder','split','reverse'] as FlowLayout[])[i%6]}
export function stageFlow(input:{id:string;title:string;subtitle:string;steps:{title:string;subtitle:string;detail:string}[];domain:FlowDomain;seed?:string}):FlowDiagram{
 const stageNodes=input.steps.map((s,i)=>({id:`${input.id}-phase-${i}`,title:s.title,subtitle:s.subtitle,detail:s.detail}))
 const first:FlowNode={id:input.id+'-start',title:'시작',subtitle:'입력 / 요청',detail:input.subtitle}
 const last:FlowNode={id:input.id+'-end',title:'완료',subtitle:'처리 결과',detail:'지금까지 진행한 단계를 종합해 결과를 반환합니다.'}
 // Stage-specific node texts and explanations are sourced directly from the existing lesson.
 const nodes=stageNodes.length>=5
  ?[first,...stageNodes.slice(0,5)]
  :[first,...stageNodes.slice(0,4),last]
 const layout=topicSpecificLayout[input.id]||topicLayout[input.seed||'']||defaultLayouts([...input.id].reduce((n,c)=>n+c.charCodeAt(0),0))
 const links:Record<FlowLayout,[number,number][]>={
  pipeline:[[0,1],[1,2],[2,3],[3,4],[4,5]],
  fork:[[0,1],[1,2],[1,3],[1,4],[2,5],[3,5],[4,5]],
  cycle:[[0,1],[1,2],[2,3],[3,4],[4,1],[4,5]],
  ladder:[[0,1],[1,2],[0,3],[3,4],[4,5],[2,5]],
  split:[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]],
  reverse:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,2]]
 }
 return {id:input.id+'-story',domain:input.domain,title:input.title,subtitle:input.subtitle,layout,nodes,links:links[layout],keyPoint:input.subtitle,tag:'STEP FLOW'}
}
type DrawingProps={diagram:FlowDiagram;step:number;compact?:boolean;onStep?:(n:number)=>void}
export function SystemsFlowDrawing({diagram,step,compact=false,onStep}:DrawingProps){
 const uniqueId=useId().replace(/:/g,'')
 const nodes=diagram.nodes
 const positions=placements[diagram.layout]
 const isFork=diagram.layout==='fork'
 const boardWidth=isFork?840:680
 const boardHeight=isFork?360:340
 return <div className={'systems-drawing '+(compact?'systems-drawing-compact':'')} role="img" aria-label={diagram.title+' 단계별 시스템 구조'}>
  <svg viewBox={`0 0 ${boardWidth} ${boardHeight}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
   <defs>
    <pattern id={uniqueId+'dot'} width="23" height="23" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" opacity=".09"/></pattern>
    <marker id={uniqueId+'arrow'} viewBox="0 0 10 10" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" refX="9.5" refY="5" orient="auto"><path d="M1 1.5 L8.5 5 L1 8.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></marker>
   </defs>
   <rect x="0" y="0" width={boardWidth} height={boardHeight} rx="13" className="systems-board-surface"/>
   <rect x="0" y="0" width={boardWidth} height={boardHeight} rx="13" fill={'url(#'+uniqueId+'dot)'} opacity=".65"/>
   <g className="systems-edges">
    {diagram.links.map(([a,b],i)=>{
     const active=a===step||b===step
     const backwards=b<a&&Math.abs(a-b)>2&&diagram.layout==='reverse'
     const feedback=b<a
     const d=connector(positions[a],positions[b],backwards,diagram.layout,a,b)
     return <g key={i} data-from={a} data-to={b} className={'systems-edge '+(active?'systems-edge-active':'')+(feedback?' systems-edge-feedback':'')}>
       <path d={d} className="systems-edge-track" markerEnd={'url(#'+uniqueId+'arrow)'}/>
       <path d={d} className="systems-edge-moving"/>
       {(active||compact)&&<circle r="3.9" className="systems-data-packet">
         <animateMotion path={d} dur={compact?'3.7s':'2.4s'} repeatCount="indefinite"/>
       </circle>}
     </g>
    })}
   </g>
   {nodes.map((node,i)=>{const [x,y]=positions[i];return <g key={node.id} transform={`translate(${x} ${y})`} className={'systems-node '+(step===i?'systems-node-active':'')+(onStep?' systems-node-clickable':'')} onClick={()=>onStep?.(i)} onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&onStep){e.preventDefault();onStep(i)}}} role={onStep?'button':undefined} tabIndex={onStep?0:undefined} aria-label={onStep?node.title+' 단계 보기':undefined}>
     <rect x="0" y="0" width={nodeWidth} height={nodeHeight} rx="10" className="systems-node-bg"/>
     <rect x="12" y="11" width="23" height="22" rx="6" className="systems-node-badge"/>
     <text x="23.5" y="26.2" textAnchor="middle" className="systems-node-numeral">{String(i+1).padStart(2,'0')}</text>
     <circle cx="126" cy="21" r="4" className="systems-node-status"/>
     <text x="12" y="46" className="systems-node-title" textLength={undefined}>{node.title.length>15?node.title.slice(0,14)+'…':node.title}</text>
     <text x="12" y="60" className="systems-node-subtitle">{node.subtitle.length>22?node.subtitle.slice(0,21)+'…':node.subtitle}</text>
    </g>})}
   <text x="19" y={boardHeight-15} className="systems-board-mark">WHATIS / INTERACTIVE SYSTEM FLOW</text>
   <text x={boardWidth-19} y={boardHeight-15} textAnchor="end" className="systems-board-mark">{String(step+1).padStart(2,'0')} / {String(nodes.length).padStart(2,'0')}</text>
  </svg>
 </div>
}
type FocusProps={diagram:FlowDiagram;embedded?:boolean;onClose?:()=>void;initialStep?:number;onStepChange?:(n:number)=>void}
export function SystemsFlowFocus({diagram,embedded=false,onClose,initialStep=0,onStepChange}:FocusProps){
 const [localStep,setLocalStep]=useState(initialStep)
 const [playing,setPlaying]=useState(true)
 const current=onStepChange?initialStep%diagram.nodes.length:localStep%diagram.nodes.length
 const [showPath,setShowPath]=useState(true)
 const sheet=useRef<HTMLDivElement>(null)
 const previousFocus=useRef<HTMLElement|null>(null)
 const select=(i:number)=>{setPlaying(false);onStepChange?.(i);setLocalStep(i)}
 useEffect(()=>{
  if(onStepChange||!playing||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
  const timer=window.setInterval(()=>setLocalStep(s=>(s+1)%diagram.nodes.length),3000)
  return()=>window.clearInterval(timer)
 },[playing,diagram.id,diagram.nodes.length,onStepChange])
 useEffect(()=>{
  if(embedded)return
  previousFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null
  const old=document.body.style.overflow
  document.body.style.overflow='hidden'
  sheet.current?.querySelector<HTMLButtonElement>('.systems-focus-close')?.focus()
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape')onClose?.()
   if(e.key!=='Tab'||!sheet.current)return
   const focusable=[...sheet.current.querySelectorAll<HTMLElement>('button:not([disabled])')]
   if(!focusable.length)return
   const first=focusable[0],last=focusable[focusable.length-1]
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
  window.addEventListener('keydown',key)
  return()=>{window.removeEventListener('keydown',key);document.body.style.overflow=old;previousFocus.current?.focus({preventScroll:true})}
 },[embedded,onClose])
 useEffect(()=>{sheet.current?.querySelector('.systems-focus-scroll')?.scrollTo({top:0})},[diagram.id])
 return <section className={'systems-focus '+(embedded?'systems-focus-embedded':'systems-focus-sheet')} ref={sheet} role={embedded?'region':'dialog'} aria-modal={embedded?undefined:true} aria-label={diagram.title+' 동작 과정'}>
  <header className="systems-focus-top">
   <span className="systems-eyebrow"><GitBranch size={15}/> {domainWord[diagram.domain]} / {diagram.tag}</span>
   {!embedded&&<button className="systems-focus-close" type="button" onClick={onClose} aria-label="닫기"><X size={20}/></button>}
  </header>
  <div className="systems-focus-scroll">
   <div className="systems-focus-head"><h3>{diagram.title}</h3><p>{diagram.subtitle}</p></div>
   <div className="systems-focus-diagram-scroll" aria-label="좌우로 이동 가능한 시스템 연결도"><SystemsFlowDrawing diagram={diagram} step={current} onStep={select}/></div><p className="systems-scroll-hint">도식을 좌우로 밀면 가려진 연결과 구성요소도 볼 수 있어요.</p>
   <div className="systems-controls">
    <span>STEP {String(current+1).padStart(2,'0')} / {String(diagram.nodes.length).padStart(2,'0')}</span>
    <div>
     <button type="button" onClick={()=>select((current+diagram.nodes.length-1)%diagram.nodes.length)} aria-label="이전 단계"><ChevronLeft size={17}/></button>
     {!onStepChange&&<button type="button" className="systems-play" onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={15}/>:<Play size={15}/>} {playing?'일시정지':'재생'}</button>}
     <button type="button" onClick={()=>select((current+1)%diagram.nodes.length)} aria-label="다음 단계"><ChevronRight size={17}/></button>
    </div>
   </div>
   <div className="systems-focus-explain"><span>현재 진행 단계</span><h4>{diagram.nodes[current].title}</h4><strong>{diagram.nodes[current].subtitle}</strong><p>{diagram.nodes[current].detail}</p></div>
   <div className="systems-step-navigator" role="group" aria-label="흐름 단계 선택">
    {diagram.nodes.map((n,i)=><button type="button" key={n.id} className={current===i?'active':''} onClick={()=>select(i)} aria-pressed={current===i}><span>{String(i+1).padStart(2,'0')}</span><strong>{n.title}</strong><small>{n.subtitle}</small></button>)}
   </div>
   <button type="button" className="systems-all-details-toggle" aria-expanded={showPath} onClick={()=>setShowPath(v=>!v)}>{showPath?'전체 단계 설명 접기':'전체 단계 설명 보기'} <span>{showPath?'−':'+'}</span></button>
   {showPath&&<div className="systems-all-details">{diagram.nodes.map((n,i)=><div key={n.id}><span>{String(i+1).padStart(2,'0')}</span><p><strong>{n.title} · </strong>{n.detail}</p></div>)}</div>}
   <div className="systems-keypoint"><Check size={18}/><p>{diagram.keyPoint}</p></div>
   {diagram.warning&&<p className="systems-warning"><CircleHelp size={14}/>{diagram.warning}</p>}
   <p className="systems-model-note">원리를 이해하기 위한 논리적 애니메이션으로, 실제 데이터·신호·연결 포트를 그대로 재현한 것은 아닙니다.</p>
  </div>
  {!embedded&&<footer className="systems-focus-footer"><button type="button" onClick={onClose}>구성도 목록으로 돌아가기 <ArrowLeft size={16}/></button></footer>}
 </section>
}
type GalleryProps={domain:FlowDomain;title?:string;subtitle?:string;limit?:number;className?:string}
export default function SystemsFlowGallery({domain,title,subtitle,limit,className=''}:GalleryProps){
 const list=useMemo(()=>flowByDomain(domain).slice(0,limit),[domain,limit])
 const [active,setActive]=useState<FlowDiagram|null>(null)
 const grouping=domain==='ai'?'AI SYSTEM DESIGN':domain==='computer'?'COMPUTER ARCHITECTURE':domain==='teamcenter'?'TEAMCENTER SERVICE FLOWS':'POLARION SERVICE FLOWS'
 return <section className={'systems-gallery '+className} aria-label={title||grouping}>
  <div className="systems-gallery-header">
   <div><span className="systems-eyebrow"><GitBranch size={16}/> VISUAL SYSTEM LAB / {domainWord[domain]}</span>
    <h2>{title||grouping}</h2><p>{subtitle||'각 도식의 데이터 흐름을 움직이는 화살표로 보고, 클릭하면 단계별 원리까지 탐색할 수 있습니다.'}</p>
   </div>
   <span className="systems-count">{String(list.length).padStart(2,'0')} INTERACTIVE FLOWS</span>
  </div>
  <div className="systems-gallery-grid">
   {list.map((diagram,i)=><button key={diagram.id} type="button" onClick={()=>setActive(diagram)} className={'systems-gallery-card systems-tile-'+i%4}>
    <div className="systems-tile-header"><span>{String(i+1).padStart(2,'0')} / {diagram.tag}</span><Maximize2 size={16}/></div>
    <div className="systems-tile-name"><h3>{diagram.title}</h3><p>{diagram.subtitle}</p></div>
    <SystemsFlowDrawing diagram={diagram} step={i%6} compact/>
    <div className="systems-tile-footer"><span>움직이는 연결선 · 6단계</span><strong>자세히 보기 <ArrowRight size={15}/></strong></div>
   </button>)}
  </div>
  {active&&createPortal(<div className="systems-focus-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setActive(null)}}><SystemsFlowFocus key={active.id} diagram={active} onClose={()=>setActive(null)}/></div>,document.body)}
 </section>
}
