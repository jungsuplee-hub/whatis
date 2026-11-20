import { useLayoutEffect, useMemo, useState } from 'react'
import { ArrowRight, ChevronDown, Database, GitBranch, Globe2, KeyRound, Network, Search, Server } from 'lucide-react'
import ServiceConnections, { type DiagramEdge } from './ServiceConnections'
import ArchitectureQuickView, { type ArchitectureDetail } from './ArchitectureQuickView'
import { polarionServiceGuides } from './architecture-service-guides'
import './polarion-architecture.css'

type NodeKind='access'|'edge'|'app'|'coord'|'store'|'optional'
type Node={id:string;title:string;subtitle:string;kind:NodeKind;x:number;y:number;port:string;role:string;review:string;icon:'globe'|'server'|'data'|'flow'|'key'|'index'}
const IconMap={globe:Globe2,server:Server,data:Database,flow:GitBranch,key:KeyRound,index:Search}
const nodes:Node[]=[
  {id:'user',title:'ALM 사용자',subtitle:'Browser / Reviewers',kind:'access',x:38,y:154,port:'HTTPS',role:'요구사항·테스트·추적성 사용자',review:'외부 사용자 접근 범위와 인증 정책',icon:'globe'},
  {id:'api',title:'API / Integration',subtitle:'REST API Consumer',kind:'access',x:38,y:333,port:'HTTPS',role:'CI/CD 및 외부 시스템 요청의 진입점',review:'PAT·서비스 계정·재시도·최소 권한',icon:'flow'},
  {id:'idp',title:'Enterprise Identity',subtitle:'SSO / LDAP (선택)',kind:'optional',x:38,y:564,port:'구성별',role:'기업 인증·계정 경계. 사용 여부와 방식은 환경에 따라 다릅니다.',review:'SSO 로그인과 프로젝트 권한 매핑',icon:'key'},
  {id:'lb',title:'Load Balancer',subtitle:'Cluster entry',kind:'edge',x:296,y:144,port:'80/443†',role:'사용자 요청을 정상적인 Polarion 애플리케이션 노드로 분산',review:'HTTPS/TLS, 세션, 장애 감지, failover 정책',icon:'flow'},
  {id:'apache',title:'Apache HTTPD',subtitle:'Reverse proxy / SVN WebDAV',kind:'edge',x:496,y:144,port:'443 / 8889*',role:'웹 접근과 AJP 프록시 및 SVN 접근 경계를 담당할 수 있습니다.',review:'mod_proxy_ajp, WebDAV, reverse proxy와 TLS 종료 위치',icon:'server'},
  {id:'coord',title:'Coordinator',subtitle:'Cluster / License control',kind:'coord',x:497,y:380,port:'2181*',role:'클러스터 노드 상태·라이선스·코디네이션 업무 처리',review:'단일 장애점, 노드 등록, ZooKeeper 도달성, 복구 절차',icon:'flow'},
  {id:'app1',title:'Polarion Node A',subtitle:'JVM · Ehcache · REST',kind:'app',x:719,y:155,port:'AJP 8889*',role:'사용자 요청, Work Item, 요구사항·시험 작업을 처리하는 애플리케이션 노드',review:'애플리케이션 CPU/메모리, Ehcache tier, 인덱스 I/O',icon:'server'},
  {id:'app2',title:'Polarion Node B',subtitle:'JVM · Ehcache · REST',kind:'app',x:719,y:342,port:'AJP 8889*',role:'동일 논리 인스턴스의 다른 애플리케이션 노드 (클러스터 예시)',review:'동일 릴리스·설정, 세션 정책, 노드 간 상태 정합성',icon:'server'},
  {id:'zoo',title:'ZooKeeper',subtitle:'Coordinator / Node sessions',kind:'coord',x:1031,y:383,port:'2181*',role:'Polarion 클러스터의 코디네이션 연결에 사용',review:'코디네이터/노드 연결 구성과 네트워크 통제',icon:'flow'},
  {id:'svn',title:'SVN Repository',subtitle:'Shared source of truth',kind:'store',x:306,y:670,port:'HTTP(S)/SVN',role:'클러스터가 공유하는 Subversion 원본 저장소',review:'백업 정합성, SVN I/O, 무결성, 접근 권한',icon:'data'},
  {id:'shared',title:'Shared Services',subtitle:'Shared data / Cluster assets',kind:'store',x:504,y:670,port:'공유 경로',role:'클러스터가 사용하는 공유 서비스와 데이터 위치',review:'공유 데이터 마운트·권한·장애 및 복원 경계',icon:'data'},
  {id:'pg1',title:'PostgreSQL · A',subtitle:'Node-local metadata',kind:'store',x:724,y:635,port:'5433 예시†',role:'노드 로컬 구성 예시의 PostgreSQL 저장 영역',review:'실제 DB 아키텍처와 sharedPG 적용 여부 확인',icon:'data'},
  {id:'pg2',title:'PostgreSQL · B',subtitle:'Node-local metadata',kind:'store',x:724,y:785,port:'설정별',role:'Node B 쪽 PostgreSQL 계층 (배포 모델에 따라 달라짐)',review:'원본 SVN와 DB 간 정합성, 노드별 백업',icon:'data'},
  {id:'idx1',title:'Lucene Index · A',subtitle:'Search index / local I/O',kind:'store',x:941,y:635,port:'파일 I/O',role:'Node A 검색 색인·질의. 독립 네트워크 서버가 아닌 색인 리소스',review:'인덱스 디스크 성능·재구축·복원',icon:'index'},
  {id:'idx2',title:'Lucene Index · B',subtitle:'Search index / local I/O',kind:'store',x:941,y:785,port:'파일 I/O',role:'Node B 검색 색인 리소스',review:'색인 불일치·복구 시 검색 기능 재검증',icon:'index'}
]
type Edge=DiagramEdge
const edges:Edge[]=[
 {id:'pl01',from:'user',to:'lb',port:'443†',proto:'HTTPS',status:'common',purpose:'사용자의 웹 접속',check:'443은 HTTPS 일반 포트이며 현장 공개 엔드포인트 확인'},
 {id:'pl02',from:'api',to:'lb',port:'443†',proto:'HTTPS / REST',status:'common',purpose:'외부 자동화·REST API 요청',check:'클러스터 REST API는 로드 밸런서 URL을 사용'},
 {id:'pl03',from:'lb',to:'apache',port:'443 / proxy',proto:'HTTP(S)',status:'verify',purpose:'웹 요청 라우팅',check:'HTTPD / LB가 동일 노드에 배치될 수도 있음'},
 {id:'pl04',from:'apache',to:'app1',port:'8889*',proto:'AJP (example)',status:'drawing',purpose:'웹 프록시가 Polarion Node A로 요청 전달',check:'Polarion 2606 가이드의 AJP 설정 예시, 필수 고정 포트 아님'},
 {id:'pl05',from:'apache',to:'app2',port:'8889*',proto:'AJP (example)',status:'drawing',purpose:'웹 프록시가 Polarion Node B로 요청 전달',check:'노드별 실제 AJP 바인딩/설정 확인'},
 {id:'pl06',from:'app1',to:'coord',port:'2181*',proto:'ZooKeeper',status:'drawing',purpose:'클러스터 Node A 코디네이션',check:'coordinator 주소/포트는 배포 구성에서 확인'},
 {id:'pl07',from:'app2',to:'coord',port:'2181*',proto:'ZooKeeper',status:'drawing',purpose:'클러스터 Node B 코디네이션',check:'애플리케이션 노드와 coordinator 사이 실제 연결 확인'},
 {id:'pl08',from:'coord',to:'zoo',port:'2181*',proto:'ZooKeeper logical',status:'verify',purpose:'Coordinator에서 관리되는 ZooKeeper 역할',check:'다이어그램 상 논리 구분이며 별도 서버라는 뜻은 아님'},
 {id:'pl09',from:'app1',to:'svn',port:'HTTP(S)/SVN',proto:'SVN access',status:'verify',purpose:'Node A가 공유 Subversion에 접근',check:'클러스터가 공유 저장소 하나를 사용'},
 {id:'pl10',from:'app2',to:'svn',port:'HTTP(S)/SVN',proto:'SVN access',status:'verify',purpose:'Node B가 공유 Subversion에 접근',check:'네트워크/서비스 계정 인증 확인'},
 {id:'pl11',from:'app1',to:'pg1',port:'설정값',proto:'PostgreSQL',status:'verify',purpose:'Node A의 PostgreSQL 데이터 접근',check:'5433은 일부 구성 참고값. DB 서버 배치·지원 방식 별도 확인'},
 {id:'pl12',from:'app2',to:'pg2',port:'설정값',proto:'PostgreSQL',status:'verify',purpose:'Node B의 PostgreSQL 데이터 접근',check:'sharedPG 사용 여부에 따라 토폴로지 변경 필요'},
 {id:'pl13',from:'app1',to:'idx1',port:'Local I/O',proto:'Lucene index',status:'verify',purpose:'Node A 검색 색인 접근',check:'Lucene은 무조건 네트워크 포트로 호출하는 서비스가 아님'},
 {id:'pl14',from:'app2',to:'idx2',port:'Local I/O',proto:'Lucene index',status:'verify',purpose:'Node B 검색 색인 접근',check:'로컬/공유 스토리지 구성을 검증'},
 {id:'pl15',from:'coord',to:'shared',port:'공유 경로',proto:'Shared services',status:'verify',purpose:'Coordinator의 공유 구성/데이터 접근',check:'공유 서비스 서버·공유 폴더 설계를 별도로 확정'},
 {id:'pl16',from:'app1',to:'shared',port:'공유 경로',proto:'Shared services',status:'verify',purpose:'Node A가 공유 서비스 데이터에 접근',check:'마운트 위치와 권한을 검증'},
 {id:'pl17',from:'app2',to:'shared',port:'공유 경로',proto:'Shared services',status:'verify',purpose:'Node B가 공유 서비스 데이터에 접근',check:'가용성/지연/동기화를 검증'},
 {id:'pl18',from:'idp',to:'apache',port:'설정별',proto:'SSO integration',status:'verify',purpose:'인증 연계 선택 구성',check:'인증 제품 및 프로토콜 지원은 환경에서 확인'}
]
const flows=[
 {id:'workitem',name:'Work Item 편집',description:'사용자 → Web → Node → Shared SVN',edges:['pl01','pl03','pl04','pl09'],nodes:['user','lb','apache','app1','svn']},
 {id:'rest',name:'REST API 호출',description:'외부 도구 → LB → Node B',edges:['pl02','pl03','pl05','pl12'],nodes:['api','lb','apache','app2','pg2']},
 {id:'search',name:'검색·추적성',description:'사용자 → Node A → Lucene',edges:['pl01','pl03','pl04','pl13'],nodes:['user','lb','apache','app1','idx1']},
 {id:'cluster',name:'클러스터 / 장애 조치',description:'두 노드 → Coordinator · Shared Services',edges:['pl06','pl07','pl08','pl15','pl16','pl17'],nodes:['app1','app2','coord','zoo','shared']}
]
const zones=[
 {title:'USER & INTEGRATIONS',description:'ACCESS / UNTRUSTED',className:'access',x:18,y:65,w:229,h:825},
 {title:'ENTRY / SHARED WEB',description:'HTTPS · APACHE · COORDINATION',className:'entry',x:265,y:65,w:415,h:445},
 {title:'POLARION APPLICATION CLUSTER',description:'TWO APPLICATION NODES · EXAMPLE',className:'app',x:689,y:65,w:292,h:446},
 {title:'PERSISTENCE / SEARCH',description:'SVN · SHARED DATA · LOCAL I/O',className:'data',x:265,y:536,w:950,h:351},
 {title:'COORDINATION',description:'LOGICAL ROLE · ZOOKEEPER',className:'coord',x:998,y:65,w:217,h:445},
]
const reviews=[
 {name:'가용성·장애 조치',kicker:'HIGH AVAILABILITY',body:'Coordinator, Shared Services, LB, Application Nodes의 단일 장애점을 구분하고 failover 결과를 실제 업무 흐름으로 검증합니다.'},
 {name:'원본 및 색인 복구',kicker:'DATA INTEGRITY',body:'Subversion 원본, PostgreSQL, Lucene 색인, 공유 데이터의 정합성과 복원 순서를 별도로 검증합니다.'},
 {name:'사용자·API 보안',kicker:'ACCESS CONTROL',body:'로드 밸런서·API 노출 범위, SSO 연계, REST 토큰 관리, 계정·프로젝트 권한과 TLS 구성을 확인합니다.'},
 {name:'I/O와 용량',kicker:'PERFORMANCE',body:'Polarion App Node의 PostgreSQL 및 Lucene I/O와 SVN 네트워크 지연을 분리 측정합니다. 실제 사이징은 사용량 조사 후 확정합니다.'},
]
const statusText:Record<Edge['status'],string>={drawing:'구성 예시',common:'일반 프로토콜',verify:'배포별 확인'}
type Tab='topology'|'connections'|'operations'
export default function PolarionArchitecture(){
 const [tab,setTab]=useState<Tab>('topology')
 const [flow,setFlow]=useState(flows[0].id)
 const [selectedNode,setSelectedNode]=useState('app1')
 const [selectedEdge,setSelectedEdge]=useState('pl04')
 const [quick,setQuick]=useState<{kind:'component'|'connection';id:string}|null>(null)
 const [allEdges,setAllEdges]=useState(true)
 const [board,setBoard]=useState<HTMLDivElement|null>(null)
 const [scrollArea,setScrollArea]=useState<HTMLDivElement|null>(null)
 const [scale,setScale]=useState(1)
 const [query,setQuery]=useState('')
 const [filter,setFilter]=useState<'all'|Edge['status']>('all')
 const [opened,setOpened]=useState(-1)
 const edge=edges.find(e=>e.id===selectedEdge)!
 const active=flows.find(f=>f.id===flow)!
 useLayoutEffect(()=>{
  if(!scrollArea)return
  const resize=()=>setScale(window.innerWidth>=850?Math.min(1,Math.max(.5,(scrollArea.clientWidth-8)/1240)):1)
  const ro=new ResizeObserver(resize)
  ro.observe(scrollArea)
  window.addEventListener('resize',resize)
  resize()
  return ()=>{ro.disconnect();window.removeEventListener('resize',resize)}
 },[scrollArea])
 const jump=(id:string)=>{
   setSelectedNode(id)
   const x=nodes.find(n=>n.id===id)?.x??0
   scrollArea?.scrollTo({left:Math.max(0,x*scale-52),behavior:'smooth'})
 }
 const visible=useMemo(()=>edges.filter(e=>(filter==='all'||e.status===filter)&&[e.from,e.to,e.port,e.proto,e.purpose].join(' ').toLowerCase().includes(query.toLowerCase())),[filter,query])
 const chooseNode=(id:string)=>{setSelectedNode(id);setQuick({kind:'component',id})}
 const goEdge=(e:Edge)=>{setSelectedEdge(e.id);setSelectedNode(e.to);setQuick({kind:'connection',id:e.id})}
 const openMatrix=()=>{
   setQuick(null)
   setTab('connections')
   window.requestAnimationFrame(()=>document.querySelector('.pol-tabs')?.scrollIntoView({behavior:'smooth',block:'start'}))
 }
 const quickNode=quick?.kind==='component'?nodes.find(n=>n.id===quick.id):undefined
 const quickEdge=quick?.kind==='connection'?edges.find(e=>e.id===quick.id):undefined
 const quickDetail:ArchitectureDetail|null=quickNode?{
   kind:'component',eyebrow:'POLARION · '+quickNode.kind.toUpperCase(),
   title:quickNode.title,subtitle:quickNode.subtitle,description:quickNode.role,
   metricLabel:'서비스 포트 / 경로',metric:quickNode.port,secondaryLabel:'구성 영역',
   secondary:quickNode.kind==='app'?'애플리케이션':quickNode.kind==='store'?'저장소':quickNode.kind==='coord'?'조정 서비스':quickNode.kind==='optional'?'선택 기능':'접속 / 서비스',
   status:'논리 구성 예시 · 실제 환경에서 확인',
   reviewLabel:'아키텍처 검토 사항',review:quickNode.review,
   guide:polarionServiceGuides[quickNode.id],
   related:edges.filter(e=>e.from===quickNode.id||e.to===quickNode.id).map(e=>({
     id:e.id,title:nodes.find(n=>n.id===e.from)?.title+' → '+nodes.find(n=>n.id===e.to)?.title,
     subtitle:e.port+' · '+e.proto
   }))
 }:quickEdge?{
   kind:'connection',eyebrow:'POLARION · CONNECTION '+quickEdge.id.toUpperCase(),
   title:nodes.find(n=>n.id===quickEdge.from)?.title+' → '+nodes.find(n=>n.id===quickEdge.to)?.title,
   description:quickEdge.purpose,metricLabel:'통신 포트 / 경로',metric:quickEdge.port,
   secondaryLabel:'프로토콜',secondary:quickEdge.proto,status:statusText[quickEdge.status],
   reviewLabel:'아키텍처 검토 사항',review:quickEdge.check
 }:null
 return <section className="pol-studio">
   <header className="pol-hero">
     <div><span className="pol-overline"><span/> POLARION · 2606 INFRASTRUCTURE ATLAS</span><h3>서비스가 연결되어<br/><em>하나의 ALM을 만듭니다.</em></h3><p>Polarion 클러스터의 실제 역할을 기준으로, 연결선·포트·데이터 흐름을 분석하는 아키텍처 스튜디오입니다.</p></div>
     <div className="pol-summary"><strong>15 <span>COMPONENTS</span></strong><strong>18 <span>CONNECTIONS</span></strong><small>Logical cluster reference</small></div>
   </header>
   <nav className="pol-tabs" aria-label="Polarion 아키텍처 탐색">
    {([{id:'topology',title:'01 · 서비스 토폴로지'},{id:'connections',title:'02 · 통신 / 포트'},{id:'operations',title:'03 · 설계 검토'}] as {id:Tab;title:string}[]).map(t=><button type="button" key={t.id} className={tab===t.id?'on':''} onClick={()=>setTab(t.id)}>{t.title}</button>)}
   </nav>
   {tab==='topology'&&<>
    <div className="pol-topology-tools">
      <div><span className="pol-mini-label">ACTIVE WORKFLOW</span><strong>{active.name}</strong><small>{active.description}</small></div>
      <div className="pol-flows">{flows.map(f=><button type="button" className={f.id===flow?'active':''} onClick={()=>{setFlow(f.id);setSelectedNode(f.nodes[0]);setSelectedEdge(f.edges[0])}} key={f.id}>{f.name}</button>)}</div>
    </div>
    <div className="pol-canvas-frame">
      <div className="pol-canvas-toolbar"><span><Network size={15}/> POLARION ARCHITECTURE / CLUSTER VIEW</span><button type="button" onClick={()=>setAllEdges(!allEdges)}>{allEdges?'주요 흐름만':'전체 연결 보기'}</button></div>
      <div className="pol-canvas-jumps" aria-label="구성도 영역 빠른 이동"><span>빠른 이동</span>{([{id:'user',label:'접속'},{id:'lb',label:'웹'},{id:'app1',label:'앱 클러스터'},{id:'svn',label:'데이터'},{id:'zoo',label:'Coordinator'}] as const).map(x=><button type="button" key={x.id} onClick={()=>jump(x.id)}>{x.label}</button>)}</div>
      <div className="pol-canvas-scroll" ref={setScrollArea} role="region" tabIndex={0} aria-label="Polarion 연결선이 그려진 인터랙티브 인프라 구성도">
        <div className="pol-canvas-scale" style={{width:1240*scale,height:966*scale}}>
        <div className="pol-canvas" ref={setBoard} style={{transform:'scale('+scale+')',transformOrigin:'top left'}}>
          <div className="pol-grid"/>
          {zones.map(z=><div key={z.title} className={'pol-zone pol-zone-'+z.className} style={{left:z.x,top:z.y,width:z.w,height:z.h}}><strong>{z.title}</strong><small>{z.description}</small></div>)}
          {nodes.map(n=>{const Icon=IconMap[n.icon];return <button type="button" data-service={n.id} key={n.id} style={{left:n.x,top:n.y}} className={'pol-node pol-node-'+n.kind+(active.nodes.includes(n.id)?' in-flow':'')+(n.id===selectedNode?' chosen':'')} onClick={()=>chooseNode(n.id)} aria-pressed={selectedNode===n.id}>
             <span className="pol-node-identity"><Icon size={19}/><span>{n.kind==='optional'?'OPTIONAL':n.kind==='store'?'DATA':n.kind==='app'?'APPLICATION':'SERVICE'}</span><i/></span>
             <strong>{n.title}</strong><small>{n.subtitle}</small><span className="pol-node-port">{n.port}</span>
           </button>})}
          <ServiceConnections boardElement={board} edges={edges} selectedIds={active.edges} selectedId={selectedEdge} showAll={allEdges} onSelect={goEdge}/>
          <div className="pol-canvas-note">CONCEPTUAL CLUSTER · NOT A NETWORK FIREWALL RULESET</div>
        </div>
        </div>
      </div>
      <div className="pol-canvas-footer"><span><i className="pol-legend-dot"/> 선택 흐름</span><span><i className="pol-legend-line"/> 기타 확인된 관계</span><span><i className="pol-legend-dash"/> 설정별 확인</span><small>서비스·연결선 클릭 → 상세 패널 · 모바일: 좌우 스크롤</small></div>
    </div>
   </>}
   {tab==='connections'&&<>
    <header className="pol-section-heading"><span>CONNECTION MATRIX</span><h4>통신 경로를 검증하는 테이블</h4><p>IP·서버 대수·고정 포트를 임의로 확정하지 않습니다. 아래 수치는 구성 예시·일반 프로토콜·검증 필요 값으로 구분했습니다.</p></header>
    <div className="pol-matrix-tools"><label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="서비스 / 포트 검색"/></label><div>{(['all','drawing','common','verify'] as const).map(v=><button type="button" onClick={()=>setFilter(v)} className={filter===v?'on':''} key={v}>{v==='all'?'전체':statusText[v]}</button>)}</div></div>
    <div className="pol-matrix">{visible.map(e=><button type="button" key={e.id} onClick={()=>goEdge(e)} className={selectedEdge===e.id?'selected':''}><span>{e.id.toUpperCase()}</span><strong>{nodes.find(n=>n.id===e.from)?.title}<ArrowRight size={14}/>{nodes.find(n=>n.id===e.to)?.title}</strong><b>{e.port}</b><small>{e.proto}</small><em>{statusText[e.status]}</em></button>)}{visible.length===0&&<p>검색된 연결이 없습니다.</p>}</div>
    <div className="pol-info-strip"><strong>{edge.purpose}</strong><p>{edge.check}</p></div>
   </>}
   {tab==='operations'&&<><header className="pol-section-heading"><span>ARCHITECT REVIEW</span><h4>설계 결정과 운영 검증</h4><p>클러스터 토폴로지, 데이터 무결성, 네트워크·보안, 워크로드별 성능을 점검할 수 있습니다.</p></header><div className="pol-reviews">{reviews.map((r,i)=><button type="button" key={r.kicker} className={opened===i?'open':''} onClick={()=>setOpened(opened===i?-1:i)}><span>{String(i+1).padStart(2,'0')} / {r.kicker}</span><strong>{r.name}</strong><ChevronDown size={18}/>{opened===i&&<p>{r.body}</p>}</button>)}</div></>}

   <ArchitectureQuickView detail={quickDetail} onClose={()=>setQuick(null)}
     onRelated={id=>{const match=edges.find(e=>e.id===id);if(match)goEdge(match)}}
     onMatrix={openMatrix}/>
 </section>
}
