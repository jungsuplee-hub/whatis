import { useMemo, useState } from 'react'
import { ArrowRight, Boxes, Database, Layers3, MessageSquareText, Network, Search, ShieldCheck, Workflow } from 'lucide-react'
import { microGroups, microItems, type MicroGroup, type MicroItem } from './architecture-service-guides'
import './teamcenter-microservices.css'

type Props={onOpen:(item:MicroItem)=>void}
type Example={id:string;title:string;subtitle:string;steps:{name:string;id?:string;sub:string}[]}
const routes:Example[]=[
  {id:'query',title:'Copilot 질문',subtitle:'실시간 질의 경로 · 개념 예시',steps:[
    {name:'Teamcenter Copilot',id:'tc-copilot',sub:'사용자 요청'}, {name:'Vector Search',id:'opensearch',sub:'준비된 인덱스 검색'},
    {name:'Model Invocation',id:'lm-invoke',sub:'검색 문맥 전달'}, {name:'LLM Provider',id:'bedrock',sub:'추론·응답'}
  ]},
  {id:'index',title:'문서·데이터 색인',subtitle:'사전 색인 경로 · 개념 예시',steps:[
    {name:'Teamcenter Data',sub:'허가된 객체·파일'}, {name:'Data Vectorizing',id:'vectorizing',sub:'전처리·임베딩'},
    {name:'Vector Search',id:'opensearch',sub:'검색 인덱스 저장'}, {name:'Copilot Retrieval',id:'tc-copilot',sub:'질문에서 재사용'}
  ]},
  {id:'agent',title:'Agent 도구 실행',subtitle:'SO-341 확장 옵션 예시',steps:[
    {name:'Agentic Chat',id:'agentic-chat',sub:'요청·도구 계획'}, {name:'Threads Manager',id:'threads-manager',sub:'대화 상태 관리'},
    {name:'Teamcenter MCP',id:'teamcenter-mcp',sub:'승인된 도구 접점'}, {name:'Teamcenter REST',sub:'권한을 지킨 업무 API'}
  ]}
]
const groupOrder:MicroGroup[]=['applications','processing','agent','platform']
export default function TeamcenterMicroserviceAtlas({onOpen}:Props){
  const [group,setGroup]=useState<MicroGroup|'all'>('all')
  const [query,setQuery]=useState('')
  const [route,setRoute]=useState('query')
  const selectedRoute=routes.find(r=>r.id===route)!
  const shown=useMemo(()=>{
    const q=query.trim().toLocaleLowerCase()
    return microItems.filter(s=>(group==='all'||s.group===group)&&(!q||[s.name,s.synopsis,s.purpose,s.category,s.port].some(v=>v.toLocaleLowerCase().includes(q))))
  },[group,query])
  return <div className="tcms">
    <div className="tcms-intro">
      <span>TEAMCENTER 2606 / SERVICE CATALOG</span>
      <h4>Microservices, 이름부터 역할까지.</h4>
      <p>Teamcenter 업무 서버와 AI Microservices, Copilot 애플리케이션, Agent/MCP 확장, 모델·검색 인프라는 서로 다른 역할입니다. 어떤 서비스를 실제로 설치하는지는 선택 기능과 배포 방식에 따라 결정됩니다.</p>
    </div>
    <section className="tcms-topology" aria-label="AI Microservice 데이터 흐름">
      <div className="tcms-flow-header">
        <div><span>INTERACTIVE SERVICE FLOW</span><strong>{selectedRoute.title}</strong><small>{selectedRoute.subtitle}</small></div>
        <div className="tcms-flow-switch">{routes.map(r=><button key={r.id} className={r.id===route?'on':''} aria-pressed={r.id===route} onClick={()=>setRoute(r.id)} type="button">{r.title}</button>)}</div>
      </div>
      <div className="tcms-flow-scroller">
        {selectedRoute.steps.map((st,i)=><div className="tcms-flow-item" key={st.name}>
          {i>0&&<ArrowRight className="tcms-flow-arrow" size={17}/>}
          {st.id?<button onClick={()=>{const hit=microItems.find(x=>x.id===st.id);if(hit)onOpen(hit)}} type="button"><span>0{i+1} / SERVICE</span><strong>{st.name}</strong><small>{st.sub}</small></button>:
            <div className="tcms-flow-external"><span>0{i+1} / TEAMCENTER</span><strong>{st.name}</strong><small>{st.sub}</small></div>}
        </div>)}
      </div>
      <p>흐름을 이해하기 위한 논리적 예시입니다. 각 서비스의 지원 조합·실제 포트·배포 위치는 설치 환경에 따라 다릅니다.</p>
    </section>
    <div className="tcms-catalog-heading">
      <div><span>EXPLORE ALL SERVICES</span><h4>구성요소별 상세 설명</h4><p>카드를 누르면 역할, 실행 계층, 운영 항목과 버전별 주의사항이 오른쪽 패널에 열립니다.</p></div>
      <div className="tcms-search"><Search size={17}/><input aria-label="Microservice 검색" placeholder="Vectorizing, MCP, Redis…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
    </div>
    <div className="tcms-filters">
      <button type="button" className={group==='all'?'on':''} onClick={()=>setGroup('all')}>전체 <b>{microItems.length}</b></button>
      {groupOrder.map(k=><button type="button" key={k} className={group===k?'on':''} onClick={()=>setGroup(k)}>{microGroups[k].label} <b>{microItems.filter(s=>s.group===k).length}</b></button>)}
    </div>
    {shown.length?<div className="tcms-grid">
      {shown.map((s,i)=>{
        const Icon=s.group==='applications'?MessageSquareText:s.group==='processing'?Workflow:s.group==='agent'?Network:s.id==='opensearch'||s.id==='redis'?Database:s.id==='micro-node'?Boxes:Layers3
        return <button key={s.id} type="button" className={'tcms-card tcms-card-'+s.group} onClick={()=>onOpen(s)}>
          <div className="tcms-card-top"><span className="tcms-icon"><Icon size={20}/></span><span>#{String(i+1).padStart(2,'0')} <ArrowRight size={15}/></span></div>
          <span className="tcms-category">{s.category}</span>
          <strong>{s.name}</strong>
          <p>{s.synopsis}</p>
          <div className="tcms-card-foot"><span>{s.port}</span><span>상세 보기 <ArrowRight size={13}/></span></div>
        </button>
      })}
    </div>:<div className="tcms-empty">조건에 맞는 서비스가 없습니다. 검색어나 유형을 바꿔주세요.</div>}
    <footer className="tcms-caveat"><ShieldCheck size={17}/><p>AI 애플리케이션과 실제 실행 Microservice, 지원 인프라를 구분해서 보여줍니다. 도식의 항목 수가 곧 설치 대상 서비스 개수는 아니며 선택하지 않은 Add-on 또는 확장은 설치되지 않을 수 있습니다.</p></footer>
  </div>
}
