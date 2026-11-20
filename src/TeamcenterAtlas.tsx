import { useLayoutEffect, useMemo, useState } from 'react'
import {
  BadgeCheck, Boxes, Database, Files, HardDrive, HardDriveDownload,
  KeyRound, Laptop2, LockKeyhole, Monitor, Network, Route, ScanSearch,
  SearchCheck, Server, Settings2, Waypoints, Workflow
} from 'lucide-react'
import ServiceConnections, { type DiagramEdge } from './ServiceConnections'
import './teamcenter-atlas.css'

type NodeData = {
  id:string; title:string; detail:string; port:string;
  tier:string; category:'core'|'conditional'|'pattern'|'legacy';
}
type Props={
  nodes:NodeData[]
  edges:DiagramEdge[]
  activeFlow:{id:string;label:string;nodes:string[];edges:string[]}
  selectedNode:string
  selectedEdge:string
  showAll:boolean
  setShowAll:(next:boolean)=>void
  onNode:(id:string)=>void
  onEdge:(edge:DiagramEdge)=>void
}
const ICONS={
  awc:Monitor,rich:Laptop2,fcc:HardDriveDownload,gateway:Route,webtier:Server,
  tcss:LockKeyhole,directory:KeyRound,manager:Waypoints,tcserver:Boxes,
  fsc:Files,tmc:Settings2,dispatcher:Workflow,vis:Monitor,indexer:SearchCheck,
  license:BadgeCheck,database:Database,volume:HardDrive,solr:ScanSearch,zookeeper:Network
}
const places:Record<string,{x:number;y:number}>={
  awc:{x:37,y:161},rich:{x:37,y:376},fcc:{x:37,y:590},
  gateway:{x:241,y:161},webtier:{x:408,y:161},tcss:{x:241,y:376},directory:{x:408,y:376},
  manager:{x:583,y:161},tcserver:{x:764,y:161},fsc:{x:583,y:376},tmc:{x:764,y:376},
  dispatcher:{x:583,y:590},vis:{x:764,y:590},indexer:{x:583,y:804},license:{x:764,y:804},
  database:{x:971,y:161},volume:{x:971,y:376},solr:{x:971,y:590},zookeeper:{x:971,y:804}
}
const zones=[
  {id:'client',name:'CLIENT & ACCESS',hint:'브라우저 · Rich Client · FCC',x:18,w:188,tone:'access',count:'03'},
  {id:'web',name:'WEB & IDENTITY',hint:'Gateway · Application · SSO',x:219,w:343,tone:'web',count:'04'},
  {id:'enterprise',name:'TEAMCENTER SERVICES',hint:'Business · FMS · Operations',x:566,w:380,tone:'core',count:'08'},
  {id:'resource',name:'DATA & SEARCH',hint:'Database · Files · Index',x:953,w:256,tone:'data',count:'04'}
]
const customRoutes:Record<string,NonNullable<DiagramEdge['route']>>={
  a03:{start:'right',end:'bottom',via:[[211,447],[211,333],[480,333]]},
  a05:{start:'bottom',end:'top',via:[[109,331],[313,331]]},
  a09:{start:'right',end:'left',via:[[211,661],[211,550],[569,550],[569,447]]},
  a10:{start:'bottom',end:'bottom',via:[[655,548],[1043,548]]},
  a11:{start:'top',end:'bottom',via:[[655,774],[1043,774]]},
  a13:{start:'left',end:'top',via:[[747,232],[747,556],[655,556]]},
  a14:{start:'right',end:'top',via:[[931,232],[931,775],[836,775]]},
  a15:{start:'top',end:'bottom',via:[[836,331],[655,331]]},
  a16:{start:'top',end:'bottom',via:[[836,550],[655,550]]}
}
const W=1228,H=1022

export default function TeamcenterAtlas({
  nodes,edges,activeFlow,selectedNode,selectedEdge,showAll,setShowAll,onNode,onEdge
}:Props){
 const [board,setBoard]=useState<HTMLDivElement|null>(null)
 const [scrollArea,setScrollArea]=useState<HTMLDivElement|null>(null)
 const [scale,setScale]=useState(1)
 useLayoutEffect(()=>{
   if(!scrollArea)return
   const measure=()=>{
     const width=scrollArea.clientWidth
     const next=width>=830?Math.min(1,Math.max(.85,(width-12)/W)):1
     setScale(next)
   }
   const ro=new ResizeObserver(measure)
   ro.observe(scrollArea)
   window.addEventListener('resize',measure)
   measure()
   return ()=>{ro.disconnect();window.removeEventListener('resize',measure)}
 },[scrollArea])
 const jump=(id:string)=>{
   onNode(id)
   const target=places[id]
   if(target&&scrollArea){
     scrollArea.scrollTo({left:Math.max(0,target.x*scale-75),behavior:'smooth'})
   }
 }
 const activeNodes=new Set(activeFlow.nodes)
 const routedEdges=useMemo(()=>edges.map(e=>customRoutes[e.id]?{...e,route:customRoutes[e.id]}:e),[edges])
 return <section className="tca">
  <div className="tca-toolbar">
   <div className="tca-toolbar-title"><div className="tca-pulse"/><div><strong>LIVE INFRASTRUCTURE MAP</strong><span>Teamcenter 2606 · Logical reference topology</span></div></div>
   <div className="tca-toolbar-actions">
    <div className="tca-legend" aria-label="연결선 상태"><span><i className="tca-line-active"/>선택 경로</span><span><i className="tca-line-optional"/>설정별 확인</span></div>
    <button type="button" className="tca-toggle" aria-pressed={showAll} onClick={()=>setShowAll(!showAll)}>{showAll?'선택 흐름만':'전체 연결 보기'}</button>
   </div>
  </div>
  <div className="tca-jumps">
   <span>JUMP TO</span>
   {[{id:'awc',name:'사용자'},{id:'gateway',name:'웹·인증'},{id:'tcserver',name:'업무 서버'},{id:'fsc',name:'FMS'},{id:'database',name:'데이터'},{id:'solr',name:'검색'}].map(it=>
    <button type="button" key={it.id} onClick={()=>jump(it.id)}>{it.name}</button>)}
  </div>
  <div className="tca-scroller" ref={setScrollArea} role="region" tabIndex={0} aria-label="서비스 아이콘과 연결선이 있는 Teamcenter 인프라 구성도, 모바일에서는 가로 스크롤">
   <div className="tca-scale" style={{width:W*scale,height:H*scale}}>
    <div className="tca-board" ref={setBoard} style={{transform:'scale('+scale+')',transformOrigin:'top left'}}>
      <div className="tca-dotgrid"/>
      <div className="tca-board-head"><span><span className="tca-live-point"/> ACTIVE FLOW</span><strong>{activeFlow.label}</strong><span>선택한 서비스 경로를 강조합니다</span></div>
      {zones.map((z,i)=><div className={'tca-zone tca-zone-'+z.tone} key={z.id} style={{left:z.x,width:z.w}}>
        <div className="tca-zone-header"><span>{String(i+1).padStart(2,'0')} / {z.name}</span><b>{z.count}</b></div>
        <div className="tca-zone-hint">{z.hint}</div>
      </div>)}
      {nodes.map(n=>{
       const p=places[n.id]
       const Icon=ICONS[n.id as keyof typeof ICONS]||Server
       const active=activeNodes.has(n.id)
       return <button type="button" data-service={n.id} key={n.id}
        style={{left:p.x,top:p.y}} aria-pressed={selectedNode===n.id}
        className={'tca-service tca-service-'+n.tier+(active?' in-flow':'')+(selectedNode===n.id?' chosen':'')}
        onClick={()=>onNode(n.id)}>
        <div className="tca-service-top">
          <span className="tca-service-icon"><Icon size={22} strokeWidth={1.9}/></span>
          <span className="tca-service-state">{n.category==='core'?'CORE':n.category==='pattern'?'PATTERN':n.category==='legacy'?'LEGACY':'OPTIONAL'}</span>
        </div>
        <strong>{n.title}</strong><small>{n.detail}</small>
        <div className="tca-service-foot"><span>{n.port}</span><i className={active?'on':''}/></div>
       </button>
      })}
      <ServiceConnections boardElement={board} edges={routedEdges} selectedIds={activeFlow.edges} selectedId={selectedEdge} showAll={showAll} onSelect={onEdge}/>
      <div className="tca-board-footer">FOUR-TIER LOGICAL REFERENCE · NOT A VERIFIED INSTALLATION BLUEPRINT</div>
    </div>
   </div>
  </div>
  <footer className="tca-footer"><div><strong>19</strong><span>Components</span></div><div><strong>16</strong><span>Connections</span></div><p>포트는 공유 도면·일반 프로토콜·환경별 확인을 구분합니다. 연결선과 구성요소를 눌러 설계 조건을 확인하세요.</p></footer>
 </section>
}
