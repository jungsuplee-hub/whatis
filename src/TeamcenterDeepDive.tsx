import { useMemo, useState } from 'react'
import {
  ArrowDown, ArrowRight, ChevronDown, CircleAlert,
  Layers3, Search, ShieldCheck, Sparkles, Waypoints
} from 'lucide-react'
import TeamcenterAtlas from './TeamcenterAtlas'
import TeamcenterMicroserviceAtlas from './TeamcenterMicroserviceAtlas'
import { teamcenterServiceGuides, microItems, type MicroItem } from './architecture-service-guides'
import ArchitectureQuickView, { type ArchitectureDetail } from './ArchitectureQuickView'
import './teamcenter-deep-dive.css'

type Tier='client'|'web'|'enterprise'|'resource'|'ai'
type Category='core'|'conditional'|'pattern'|'legacy'
type Node = {
  id:string;title:string;detail:string;port:string;tier:Tier;category:Category;
  role:string;inspect:string;source:'drawing'|'reference'|'concept'
}
type Connection = {
  id:string;from:string;to:string;port:string;proto:string;status:'drawing'|'common'|'verify';
  purpose:string;check:string;
}
type Flow={id:string;label:string;desc:string;nodes:string[];edges:string[]}
type AiMode='native'|'self'|'m365'|'custom'
type Tab='topology'|'ports'|'ai'|'microservices'|'operations'
const tierLabel:Record<Tier,string>={client:'CLIENT TIER',web:'WEB TIER',enterprise:'ENTERPRISE TIER',resource:'RESOURCE TIER',ai:'AI EXTENSION'}
const nodes:Node[]=[
  {id:'awc',title:'AWC / Browser',detail:'Active Workspace Client',tier:'client',category:'core',port:'HTTPS',source:'drawing',role:'브라우저 기반 PLM 사용자 인터페이스',inspect:'사용자 위치, 프록시, 인증 경로, 동시 사용자 수'},
  {id:'rich',title:'Rich Client / TCCS',detail:'4-Tier Rich Client',tier:'client',category:'conditional',port:'Web endpoint',source:'drawing',role:'Teamcenter Rich Client의 4-tier 통신',inspect:'TCCS 연결 URL, 인증·VPN, 클라이언트 버전'},
  {id:'fcc',title:'FCC',detail:'File Client Cache',tier:'client',category:'conditional',port:'FSC 연결',source:'drawing',role:'클라이언트 측 파일 캐싱·전송 경로',inspect:'캐시 경로·용량과 FSC 네트워크 도달성'},
  {id:'gateway',title:'AW Gateway',detail:'Active Workspace Gateway',tier:'web',category:'core',port:'3000*',source:'drawing',role:'Active Workspace 웹 요청 수신·라우팅',inspect:'TLS 종료/리버스 프록시, URL, 세션 정책'},
  {id:'webtier',title:'Teamcenter Web Tier',detail:'Web / App Service',tier:'web',category:'core',port:'7001*',source:'drawing',role:'웹 요청을 Teamcenter 업무 서버에 연결',inspect:'서비스 시작 방식·런타임·health-check·포트 충돌'},
  {id:'tcss',title:'Teamcenter Security',detail:'TCSS Login / Identity',tier:'web',category:'conditional',port:'환경설정',source:'drawing',role:'Teamcenter 로그인·ID 서비스 연계',inspect:'SSO 구성 방식·서비스 기반 배치·인증서'},
  {id:'directory',title:'LDAP / IdP',detail:'Directory / SAML / OIDC',tier:'web',category:'pattern',port:'389/636·443†',source:'concept',role:'기업 계정·인증 시스템 연동',inspect:'LDAPS/TLS·도메인·페더레이션·권한 매핑'},
  {id:'manager',title:'Pool / Server Manager',detail:'Session & Process Pool',tier:'enterprise',category:'core',port:'8088*',source:'drawing',role:'비즈니스 로직 서버의 세션·프로세스 풀 관리',inspect:'풀 개수·실행 프로세스·동시 세션·상태 모니터링'},
  {id:'tcserver',title:'TcServer / Business Logic',detail:'Enterprise Service',tier:'enterprise',category:'core',port:'내부 연결',source:'drawing',role:'BOM·변경·권한·업무 처리 로직',inspect:'CPU·메모리·응답 지연·클러스터 구성'},
  {id:'tmc',title:'Management Console',detail:'Teamcenter Management',tier:'enterprise',category:'conditional',port:'8083*',source:'drawing',role:'운영·관리 기능을 위한 별도 접점',inspect:'관리자망에만 노출, 감사와 접근 통제'},
  {id:'fsc',title:'FSC / FMS',detail:'File Server Cache',tier:'enterprise',category:'core',port:'4544*',source:'drawing',role:'CAD/JT/PDF 파일 캐시와 볼륨 사이의 파일 전송',inspect:'원격 FSC·캐시 적중률·파일 경로·전송량'},
  {id:'dispatcher',title:'Dispatcher',detail:'Client / Scheduler / Module',tier:'enterprise',category:'conditional',port:'설정값',source:'drawing',role:'배치/변환 작업의 예약·수행·관리',inspect:'큐 상태·실패 재시도·작업자 노드·스테이징'},
  {id:'vis',title:'Visualization Services',detail:'Pool / Data Server',tier:'enterprise',category:'legacy',port:'8090/9990*',source:'drawing',role:'시각화 관련 서비스 구성을 검토할 영역',inspect:'2606에서 실제로 배포되는 기능/구성 여부를 먼저 확인'},
  {id:'indexer',title:'FTS Indexer',detail:'Indexing Service',tier:'enterprise',category:'conditional',port:'구성 확인',source:'drawing',role:'색인 생성 및 검색 인프라 연동',inspect:'색인 지연·재구축·용량·장애 시 재처리'},
  {id:'license',title:'License Server',detail:'SALT / License',tier:'enterprise',category:'conditional',port:'28000*',source:'drawing',role:'Teamcenter 사용 권한과 라이선스 서비스 경로',inspect:'라이선스 서버 접근·가용성·사용량'},
  {id:'database',title:'RDBMS',detail:'PLM metadata',tier:'resource',category:'core',port:'1521/1433†',source:'concept',role:'아이템·속성·제품 구조 등 관계형 데이터 저장',inspect:'지원 DB 버전, IOPS, 백업 일관성, HA/DR'},
  {id:'volume',title:'File Volumes',detail:'Dataset / JT / attachments',tier:'resource',category:'core',port:'Storage path',source:'drawing',role:'실제 파일을 저장하는 볼륨/스토리지',inspect:'DB 복구 시점과 파일 복구 시점의 일관성'},
  {id:'solr',title:'Solr / Collections',detail:'Index / Search',tier:'resource',category:'conditional',port:'8983*',source:'drawing',role:'색인과 검색을 위한 검색 엔진 영역',inspect:'Solr 도입 여부, 데이터 동기화, index size, HA'},
  {id:'zookeeper',title:'ZooKeeper',detail:'Search coordination',tier:'resource',category:'conditional',port:'2181*',source:'drawing',role:'구성에 따라 검색 클러스터 조정 서비스',inspect:'사용 버전/토폴로지, 장애 감지 및 클러스터 복구'}
]
const links:Connection[]=[
  {id:'a01',from:'awc',to:'gateway',port:'443 / 3000*',proto:'HTTPS / proxy',status:'drawing',purpose:'웹 화면 접속 → Gateway로 요청 전달',check:'3000은 공유 도면의 AWC Gateway 예시. 외부에는 443으로 프록시하고 실제 내부 포트 확인'},
  {id:'a02',from:'gateway',to:'webtier',port:'7001*',proto:'HTTP(S)',status:'drawing',purpose:'Gateway와 Teamcenter Web Tier 간 요청',check:'7001은 사용자가 작성한 도면 예시이며 2606 보편 기본 포트 아님'},
  {id:'a03',from:'rich',to:'webtier',port:'7001*',proto:'TCCS / HTTP(S)',status:'drawing',purpose:'Rich Client 4-tier 통신',check:'TCCS 경로와 웹 계층 URL이 구성에 따라 달라짐'},
  {id:'a04',from:'tcss',to:'directory',port:'389/636†',proto:'LDAP(S)',status:'common',purpose:'IdP/디렉터리 기반 사용자 확인',check:'LDAP 389, LDAPS 636은 디렉터리 표준 포트이지 Teamcenter 필수 포트가 아님'},
  {id:'a05',from:'awc',to:'tcss',port:'443 / 설정',proto:'SSO / HTTPS',status:'verify',purpose:'인증 경로·세션 발급',check:'SAML/OIDC, TCSS 로그인·ID 서비스, 프록시 구조에 따라 달라짐'},
  {id:'a06',from:'webtier',to:'manager',port:'8088*',proto:'TC service',status:'drawing',purpose:'웹/엔터프라이즈 업무 요청 및 풀 관리',check:'실제 Teamcenter 서비스와 Server Manager 간 통신 포트는 현장 설정 검증'},
  {id:'a07',from:'manager',to:'tcserver',port:'내부',proto:'Server process',status:'verify',purpose:'서버 프로세스 실행/할당',check:'pool manager vs business logic 프로세스 연결과 방화벽 정책 확인'},
  {id:'a08',from:'tcserver',to:'database',port:'1521/1433†',proto:'SQL / JDBC',status:'common',purpose:'Teamcenter 구조화 데이터 읽기·쓰기',check:'Oracle 1521, SQL Server 1433은 DB 제품의 통상 포트 예시. 지원 DB/연결 설정 확인'},
  {id:'a09',from:'fcc',to:'fsc',port:'4544*',proto:'FMS / HTTP(S)',status:'drawing',purpose:'Client File Cache → Server Cache 파일 접근',check:'4544는 구성에 따라 달라질 수 있는 FSC 포트 예시. 실제 설정 확인'},
  {id:'a10',from:'fsc',to:'volume',port:'Storage path',proto:'File I/O',status:'verify',purpose:'캐시 ↔ 실제 파일 저장소',check:'NFS/SMB/object store 등 저장 방식은 지원 환경에서 확인'},
  {id:'a11',from:'indexer',to:'solr',port:'8983*',proto:'Solr HTTP',status:'drawing',purpose:'색인 처리 → Solr 검색 컬렉션',check:'8983은 도면 예시이며 운영 Solr HTTPS 포트/접근 정책 별도 확인'},
  {id:'a12',from:'solr',to:'zookeeper',port:'2181*',proto:'ZooKeeper',status:'drawing',purpose:'검색 클러스터 조정(선택 구성)',check:'ZooKeeper 사용/버전/포트는 실제 search stack 아키텍처로 결정'},
  {id:'a13',from:'tcserver',to:'dispatcher',port:'설정값',proto:'Job / queue',status:'verify',purpose:'비동기 처리 또는 변환 워크플로 연결',check:'Dispatcher 구성요소별 인스턴스, 포트, staging 위치를 검증'},
  {id:'a14',from:'tcserver',to:'license',port:'28000*',proto:'License',status:'drawing',purpose:'라이선스 서버와 통신',check:'도면에 기입된 SALT 예시값. 실제 license server / vendor daemon 포트 확인'},
  {id:'a15',from:'tmc',to:'manager',port:'8083 / 8088*',proto:'Admin',status:'drawing',purpose:'관리 도구에서 서버 상태/설정 접근',check:'관리 서비스 포트는 외부 인터넷 비노출 권고. 사용 환경 설정 확인'},
  {id:'a16',from:'vis',to:'fsc',port:'설정값',proto:'File transfer',status:'verify',purpose:'시각화 기능 사용 시 파일 접근',check:'2606 배포에 해당 서비스가 실제 포함되는지 검토'}
]
const flows:Flow[]=[
  {id:'browse',label:'BOM 조회',desc:'브라우저 → 웹 → 업무 → DB',nodes:['awc','gateway','webtier','manager','tcserver','database'],edges:['a01','a02','a06','a07','a08']},
  {id:'cad',label:'CAD 파일 다운로드',desc:'클라이언트 → FSC → 파일 볼륨',nodes:['rich','fcc','fsc','volume','webtier','tcserver'],edges:['a03','a09','a10']},
  {id:'search',label:'검색·색인',desc:'Indexer → Solr → ZooKeeper',nodes:['indexer','solr','zookeeper','awc','webtier'],edges:['a11','a12']},
  {id:'batch',label:'변환·배치',desc:'Teamcenter → Dispatcher',nodes:['tcserver','dispatcher','fsc','volume'],edges:['a13','a10']}
]
const modes:{id:AiMode;name:string;tag:string;summary:string;steps:{title:string;note:string;target:string}[];indexSteps?:{title:string;note:string;target:string}[];caution:string;source:string}[]=[
  {id:'native',name:'Teamcenter Copilot',tag:'PRODUCT CAPABILITY',summary:'Teamcenter 데이터와 관련 문서에 근거한 질의응답을 처리하는 제품 기능을 기능 블록으로 표현합니다.',steps:[
    {title:'Active Workspace',note:'Copilot 질문·대화 컨텍스트',target:'web'},
    {title:'AI Services / 관리 계층',note:'인증·요청 라우팅·서비스 오케스트레이션',target:'teamcenter'},
    {title:'Vector Retrieval',note:'사전에 생성된 색인에서 권한에 맞는 참고 내용을 검색',target:'retrieval'},
    {title:'LLM Invocation',note:'찾은 문맥을 바탕으로 LLM API를 호출',target:'model'},
    {title:'사용자에게 반환',note:'응답·참조·접근 정책 검토',target:'response'}
  ],indexSteps:[
    {title:'Teamcenter 데이터·문서',note:'색인 대상과 접근 권한·수집 범위 정의',target:'teamcenter'},
    {title:'Ingestion / Vectorizing',note:'문서 추출·분할·전처리',target:'ingest'},
    {title:'Embedding Model',note:'텍스트를 검색용 벡터로 변환',target:'model'},
    {title:'Vector Index',note:'검색 인덱스 구축·갱신·보관',target:'retrieval'}
  ],caution:'실제 Teamcenter Copilot의 지원 모델·AI 스택·배포 패턴은 릴리스의 AI 플랫폼 지원표와 라이선스 조건을 확인해야 합니다.',source:'https://blogs.sw.siemens.com/teamcenter/teamcenter-plm-ai-copilot/'},
  {id:'self',name:'Self-managed 예시',tag:'CUSTOM DESIGN · NOT UNIVERSAL',summary:'자체 AI 호스트를 사용하는 한 가지 구현 예시입니다. 모든 Teamcenter 2606 환경의 공식 기본 배포라고 주장하지 않습니다.',steps:[
    {title:'Teamcenter & AI microservices',note:'호출 / 인증 / Copilot 앱 서비스',target:'teamcenter'},
    {title:'OpenSearch Retrieval',note:'기존 색인에서 관련 문맥 검색 · 9200†',target:'retrieval'},
    {title:'Ollama LLM 호출',note:'찾은 문맥 전달 · 11434†',target:'model'},
    {title:'근거 기반 답변',note:'응답 생성 및 권한 재확인',target:'response'}
  ],indexSteps:[
    {title:'Teamcenter 데이터·파일',note:'승인된 문서와 속성 선택',target:'teamcenter'},
    {title:'Vectorizing / ETL',note:'문서 분할·전처리',target:'ingest'},
    {title:'Ollama Embedding',note:'임베딩 모델 API · 11434†',target:'model'},
    {title:'OpenSearch Vector Index',note:'검색 가능한 벡터 인덱스 저장 · 9200†',target:'retrieval'}
  ],caution:'OpenSearch 9200, Ollama 11434는 일반적인 API 포트 예시입니다. 특정 모델·GPU·설치 순서·지원 여부는 별도 확인해야 합니다.',source:'https://blogs.sw.siemens.com/teamcenter/teamcenter-copilot-plm-chat/'},
  {id:'m365',name:'Microsoft 365 Copilot',tag:'SEPARATE INTEGRATION',summary:'Microsoft 365 업무 환경에서 Teamcenter 지식을 활용하는 별도의 제품 연계 경로입니다.',steps:[
    {title:'Microsoft 365 Copilot',note:'사용자의 Microsoft 365 컨텍스트',target:'web'},
    {title:'Teamcenter Agent / Connector',note:'연동·권한·토큰 검증',target:'connector'},
    {title:'Teamcenter API / 서비스',note:'허가된 PLM 작업 및 데이터 접근',target:'teamcenter'},
    {title:'업무 데이터 결과',note:'문서·제품정보·작업 결과를 제한적으로 전달',target:'response'}
  ],caution:'Teamcenter 내장 Copilot과 Microsoft 365 Copilot은 동일한 인터페이스가 아닙니다. 별도의 라이선스·연동 구성·권한 검증이 필요합니다.',source:'https://blogs.sw.siemens.com/teamcenter/plm-integration-with-microsoft-365-copilot/'},
  {id:'custom',name:'Custom Agent / MCP',tag:'CUSTOM EXTENSION · OPTIONAL',summary:'자체 AI Agent가 Teamcenter 업무 데이터를 연동하는 선택적 설계 패턴입니다. 기본 제품에 MCP Server가 항상 포함된다는 의미가 아닙니다.',steps:[
    {title:'Agent / User',note:'승인된 도구 호출 요청',target:'web'},
    {title:'MCP Adapter / API Gateway',note:'도구 목록·권한·스키마·감사',target:'connector'},
    {title:'Teamcenter Services',note:'읽기·변경 API를 정책에 따라 제한',target:'teamcenter'},
    {title:'검증된 작업 결과',note:'원본 데이터 무단 열람·수정 방지',target:'response'}
  ],caution:'MCP는 AI 연동 프로토콜이며 Teamcenter 2606 필수 내장 통신 포트/서비스라고 간주할 수 없습니다. 구현 방식·지원 범위는 개별 프로젝트의 계약·배포 자료로 확인하세요.',source:'https://blogs.sw.siemens.com/teamcenter/teamcenter-2606/'}
]
const qa=[
  {title:'서비스·실행체',text:'서비스마다 실행 호스트, OS, 설치 유형(서비스/컨테이너), 서비스 계정, 재시작 순서와 장애 범위를 기록'},
  {title:'포트·방화벽',text:'출발지/목적지 IP 또는 그룹, TCP/UDP, 포트, TLS 종료 위치, 실제 리슨 여부를 관리; 예시 포트를 그대로 개방하지 않음'},
  {title:'파일 무결성',text:'RDBMS + Volume/FMS 백업 시점과 복구 후 아이템·Dataset·물리 파일 참조 일치 검증'},
  {title:'검색·색인',text:'Indexer/Solr 및 사용 중인 조정 서비스의 실제 배치, 색인 재구축, 읽기 지연, 저장소 용량 증가율'},
  {title:'AI 데이터 보안',text:'Copilot과 Agent가 접근하는 문서·속성 범위, 프롬프트·임베딩/벡터 보존, 외부 LLM 데이터 이동, 감사·사람 승인'},
  {title:'HA/DR·운영',text:'웹/업무 서버와 DB·FSC·검색·AI 서비스마다 RPO/RTO, 장애 조치, 관측 지표 및 복원 리허설을 분리'}
]
const statusLabel:Record<Connection['status'],string>={drawing:'구성 예시',common:'표준 기술 예시',verify:'환경별 확인'}
const statusHelp="* 구성별 예시 포트 (공식 기본값 아님) · † 일반 기술의 대표 포트 (설정·보안 정책에 따라 다름)";
export default function TeamcenterDeepDive(){
  const [tab,setTab]=useState<Tab>('topology')
  const [flow,setFlow]=useState('browse')
  const [nodeId,setNodeId]=useState('manager')
  const [linkId,setLinkId]=useState('a06')
  const [quick,setQuick]=useState<{kind:'component'|'connection'|'microservice';id:string}|null>(null)
  const [portFilter,setPortFilter]=useState<'all'|Connection['status']>('all')
  const [portSearch,setPortSearch]=useState('')
  const [aiMode,setAiMode]=useState<AiMode>('native')
  const [aiStep,setAiStep]=useState(0)
  const [aiPhase,setAiPhase]=useState<'query'|'index'>('query')
  const [openQa,setOpenQa]=useState<number|null>(null)
  const [showAllEdges,setShowAllEdges]=useState(true)
  const activeFlow=flows.find(f=>f.id===flow)!
  const activeLink=links.find(l=>l.id===linkId)!
  const visiblePorts=useMemo(()=>links.filter(l=>(portFilter==='all'||l.status===portFilter)&&([l.from,l.to,l.port,l.proto,l.purpose].join(' ').toLowerCase().includes(portSearch.toLowerCase()))),[portSearch,portFilter])
  const ai=modes.find(m=>m.id===aiMode)!
  const aiSteps=aiPhase==='index'&&ai.indexSteps?ai.indexSteps:ai.steps
  const changeFlow=(next:string)=>{setFlow(next);const target=flows.find(x=>x.id===next)!;setNodeId(target.nodes[0]);setLinkId(target.edges[0])}
  const chooseNode=(id:string)=>{setNodeId(id);setQuick({kind:'component',id})}
  const chooseLink=(x:Connection)=>{setLinkId(x.id);setNodeId(x.to);setQuick({kind:'connection',id:x.id})}
  const chooseMicroservice=(item:MicroItem)=>setQuick({kind:'microservice',id:item.id})
  const openMatrix=()=>{
    setQuick(null)
    setTab('ports')
    window.requestAnimationFrame(()=>document.querySelector('.tcd-tabs')?.scrollIntoView({behavior:'smooth',block:'start'}))
  }
  const quickNode=quick?.kind==='component'?nodes.find(n=>n.id===quick.id):undefined
  const quickLink=quick?.kind==='connection'?links.find(l=>l.id===quick.id):undefined
  const quickMicro=quick?.kind==='microservice'?microItems.find(m=>m.id===quick.id):undefined
  const quickDetail:ArchitectureDetail|null=quickNode?{
    kind:'component',eyebrow:tierLabel[quickNode.tier],title:quickNode.title,subtitle:quickNode.detail,
    description:quickNode.role,
    metricLabel:'서비스 포트 / 경로',metric:quickNode.port,secondaryLabel:'구성 유형',
    secondary:quickNode.category==='core'?'핵심':quickNode.category==='conditional'?'선택 기능':quickNode.category==='legacy'?'기존 기능':'설계 패턴',
    status:quickNode.source==='drawing'?'포트 예시 · 실제 환경에서 확인':'환경별 구성 · 실제 설정 확인',
    reviewLabel:'설계 시 확인할 사항',review:quickNode.inspect,
    guide:teamcenterServiceGuides[quickNode.id],
    related:links.filter(l=>l.from===quickNode.id||l.to===quickNode.id).map(l=>({
      id:l.id,
      title:nodes.find(n=>n.id===l.from)?.title+' → '+nodes.find(n=>n.id===l.to)?.title,
      subtitle:l.port+' · '+l.proto
    }))
  }:quickLink?{
    kind:'connection',eyebrow:'CONNECTION · '+quickLink.id.toUpperCase(),
    title:nodes.find(n=>n.id===quickLink.from)?.title+' → '+nodes.find(n=>n.id===quickLink.to)?.title,
    description:quickLink.purpose,metricLabel:'통신 포트',metric:quickLink.port,
    secondaryLabel:'프로토콜 / 방식',secondary:quickLink.proto,status:statusLabel[quickLink.status],
    reviewLabel:'실제 환경에서 확인할 사항',review:quickLink.check
  }:quickMicro?{
    kind:'microservice',eyebrow:quickMicro.category,
    title:quickMicro.name,subtitle:quickMicro.purpose,description:quickMicro.synopsis,
    metricLabel:'엔드포인트 / 포트',metric:quickMicro.port,
    secondaryLabel:'서비스 분류',secondary:quickMicro.category,
    status:'제품 기능·배포 옵션별 적용',
    reviewLabel:'핵심 운영 점검',review:quickMicro.guide.operations[0],
    guide:quickMicro.guide
  }:null
  return <section className="tcd" aria-label="Teamcenter 실무 상세 아키텍처">
    <header className="tcd-header">
      <div><div className="tcd-kicker"><span/> ARCHITECTURE BLUEPRINT · 2606</div><h3>Teamcenter,<br/><em>서비스까지 들여다보기.</em></h3><p>사용자가 작성한 4계층 구성도를 바탕으로 서비스를 분리하고 연결·포트·Copilot을 탐색하도록 재구성했습니다.</p></div>
      <div className="tcd-meta"><Layers3 size={24}/><strong>4 TIERS</strong><span>19 Components</span><small>AI / Microservice 구성별 선택</small></div>
    </header>
    <nav className="tcd-tabs" aria-label="상세 아키텍처 메뉴">
      {([{id:'topology',name:'서비스 구성도',number:'01'},{id:'ports',name:'통신 / 포트',number:'02'},{id:'ai',name:'Copilot / AI',number:'03'},{id:'microservices',name:'Microservices',number:'04'},{id:'operations',name:'운영 설계',number:'05'}] as {id:Tab;name:string;number:string}[]).map(x=><button type="button" onClick={()=>setTab(x.id)} key={x.id} className={tab===x.id?'current':''} aria-pressed={tab===x.id}><span>{x.number}</span>{x.name}</button>)}
    </nav>
    {tab==='topology'&&<>
      <div className="tcd-flow-selector"><div><strong>요청 흐름 선택</strong><small>선택된 컴포넌트와 연결 경로가 강조됩니다</small></div><div className="tcd-flow-buttons">{flows.map(f=><button className={f.id===flow?'active':''} onClick={()=>changeFlow(f.id)} type="button" key={f.id}>{f.label}</button>)}</div></div>
      <TeamcenterAtlas
        nodes={nodes} edges={links} activeFlow={activeFlow}
        selectedNode={nodeId} selectedEdge={linkId}
        showAll={showAllEdges} setShowAll={setShowAllEdges}
        onNode={chooseNode} onJump={setNodeId} onEdge={chooseLink}
      />
      <div className="tcd-path-strip"><div><strong><Waypoints size={15}/> {activeFlow.label}</strong><small>{activeFlow.desc}</small></div><div className="tcd-path-items">{activeFlow.nodes.map((n,i)=><span key={n}><button onClick={()=>chooseNode(n)} className={n===nodeId?'selected':''}>{nodes.find(x=>x.id===n)!.title}</button>{i<activeFlow.nodes.length-1&&<ArrowRight size={13}/>}</span>)}</div></div>
      <div className="tcd-edge-list"><h4>현재 흐름의 연결</h4><div>{links.filter(l=>activeFlow.edges.includes(l.id)).map(l=><button type="button" onClick={()=>chooseLink(l)} key={l.id}><strong>{nodes.find(n=>n.id===l.from)?.title}</strong><ArrowRight size={14}/><strong>{nodes.find(n=>n.id===l.to)?.title}</strong><span>{l.port}</span><small>{statusLabel[l.status]}</small></button>)}</div></div>
    </>}
    {tab==='ports'&&<>
      <div className="tcd-section-intro"><div><span className="tcd-eyebrow">CONNECTION MATRIX</span><h4>누가, 어디로, 어떤 포트로?</h4><p>실제 방화벽 룰의 출발지·목적지·포트를 확정하기 전 검토할 연결 목록입니다. 사용자 도면에 없는 값은 추측하지 않았습니다.</p></div></div>
      <div className="tcd-port-controls"><div className="tcd-search"><Search size={16}/><input aria-label="서비스나 포트로 검색" value={portSearch} onChange={e=>setPortSearch(e.target.value)} placeholder="서비스·포트·프로토콜 검색"/></div><div className="tcd-port-filters">{([{v:'all',s:'전체'},{v:'drawing',s:'공유 도면'},{v:'common',s:'표준 예시'},{v:'verify',s:'검증 필요'}] as {v:typeof portFilter;s:string}[]).map(o=><button key={o.v} onClick={()=>setPortFilter(o.v)} className={portFilter===o.v?'current':''} type="button">{o.s}</button>)}</div></div>
      <div className="tcd-port-table-scroll"><table className="tcd-port-table"><thead><tr><th>연결</th><th>통신</th><th>포트 / 경로</th><th>근거 수준</th><th>설계 목적</th></tr></thead><tbody>{visiblePorts.map(l=><tr key={l.id} className={linkId===l.id?'selected':''} onClick={()=>chooseLink(l)}><td><strong>{nodes.find(n=>n.id===l.from)?.title}</strong><span>→ {nodes.find(n=>n.id===l.to)?.title}</span></td><td>{l.proto}</td><td><b>{l.port}</b></td><td><span className={'tcd-status tcd-status-'+l.status}>{statusLabel[l.status]}</span></td><td>{l.purpose}</td></tr>)}</tbody></table>{visiblePorts.length===0&&<p className="tcd-empty">조건에 맞는 연결이 없습니다.</p>}</div>
      <div className="tcd-link-inspector"><span className="tcd-eyebrow">SELECTED LINK · {activeLink.id.toUpperCase()}</span><h4>{nodes.find(n=>n.id===activeLink.from)?.title} <ArrowRight size={18}/> {nodes.find(n=>n.id===activeLink.to)?.title}</h4><div><strong>{activeLink.port}</strong><span>{activeLink.proto}</span><span className={'tcd-status tcd-status-'+activeLink.status}>{statusLabel[activeLink.status]}</span></div><p>{activeLink.purpose}</p><p><CircleAlert size={16}/>{activeLink.check}</p></div>
      <p className="tcd-port-caution">{statusHelp}. 팀센터 설치 시의 정확한 기본 포트 목록은 버전별 Deployment Connection & Communication Table 및 설치 구성으로 검증해야 합니다.</p>
    </>}
    {tab==='ai'&&<>
      <div className="tcd-section-intro"><span className="tcd-eyebrow">TEAMCENTER AI · INTEGRATION</span><h4>Copilot은 Teamcenter에 어떻게 붙을까?</h4><p>같은 AI처럼 보여도 제품 내부 Copilot, 외부 LLM, Microsoft 365, 고객 개발 MCP Agent는 다른 설계 대상입니다.</p></div>
      <div className="tcd-ai-modes">{modes.map(m=><button key={m.id} type="button" onClick={()=>{setAiMode(m.id);setAiStep(0);setAiPhase('query')}} className={aiMode===m.id?'active':''}><span>{m.tag}</span><strong>{m.name}</strong></button>)}</div>
      <div className="tcd-ai-story"><div className="tcd-ai-head"><div><span className="tcd-eyebrow">{ai.tag}</span><h4>{ai.name}</h4><p>{ai.summary}</p></div><span><Sparkles size={25}/> AI FLOW</span></div>
        {ai.indexSteps&&<div className="tcd-ai-phase" role="group" aria-label="AI 처리 과정 구분"><button className={aiPhase==='query'?'active':''} onClick={()=>{setAiPhase('query');setAiStep(0)}}>질문할 때 · 실시간</button><button className={aiPhase==='index'?'active':''} onClick={()=>{setAiPhase('index');setAiStep(0)}}>데이터 인덱싱 · 사전</button></div>}
        <div className="tcd-ai-flow">{aiSteps.map((step,i)=><button key={step.title} type="button" aria-pressed={aiStep===i} className={'tcd-ai-step '+(aiStep===i?'selected':'')} onClick={()=>setAiStep(i)}><span>{String(i+1).padStart(2,'0')}</span><strong>{step.title}</strong><small>{step.note}</small>{i<aiSteps.length-1&&<ArrowDown size={16}/>}</button>)}</div>
        <div className="tcd-ai-explain"><span>SELECTED STEP {String(aiStep+1).padStart(2,'0')} / {aiSteps.length}</span><strong>{aiSteps[aiStep]?.title}</strong><p>{aiSteps[aiStep]?.note}</p></div>
      </div>
      <div className="tcd-ai-caution"><ShieldCheck size={17}/><span>{ai.caution}</span></div>
      <div className="tcd-ai-service-inventory">
        <div className="tcd-ai-service-title"><strong>AI Microservices · 실제 기능 분류</strong><button type="button" className="tcd-micro-all" onClick={()=>setTab('microservices')}>전체 구성요소 {microItems.length}개 보기 →</button></div>
        <div className="tcd-ai-service-grid">
          {microItems.filter(m=>m.group==='processing'||m.group==='agent').map((svc,i)=><button type="button" onClick={()=>chooseMicroservice(svc)} className="tcd-ai-service" key={svc.id}><span>{String(i+1).padStart(2,'0')} · {svc.category}</span><strong>{svc.name}</strong><small>{svc.purpose}</small><b>{svc.port}</b></button>)}
        </div>
        <p>Teamcenter AI 확장 구성의 서비스 명칭을 기준으로 분류했습니다. 적용 제품 옵션과 설치 버전에 따라 실제 실행 서비스 수는 달라집니다.</p>
      </div>
      <div className="tcd-ai-port-review"><strong>AI 경계에서 검토할 통신</strong><div><span>Copilot UI ↔ AI Services</span><b>HTTPS / 인증</b><small>서비스 URL·실제 리슨 포트는 현장 확인</small></div><div><span>Embedding / LLM API</span><b>443 또는 11434†</b><small>Cloud API 또는 self-managed 사례; 구성에 따라 다름</small></div><div><span>Vector DB</span><b>9200† / provider API</b><small>OpenSearch 사례 또는 벡터 DB 제공자 API</small></div><div><span>Agent ↔ Teamcenter</span><b>인증된 서비스 경로</b><small>MCP는 선택적 확장이며 설치 기본 포트로 단정 불가</small></div></div>
    </>}
    {tab==='microservices'&&<TeamcenterMicroserviceAtlas onOpen={chooseMicroservice}/>}
    {tab==='operations'&&<><div className="tcd-section-intro"><span className="tcd-eyebrow">DESIGN REVIEW</span><h4>구성도 다음은 운영 가능성 검증</h4><p>구축 직전에 채울 체크리스트입니다. 구체적인 서버 수·HA 구성·포트 오픈은 설치 및 플랫폼 호환성 문서로 확정합니다.</p></div><div className="tcd-ops">{qa.map((q,i)=><button type="button" key={q.title} className={openQa===i?'expanded':''} onClick={()=>setOpenQa(openQa===i?null:i)}><span>{String(i+1).padStart(2,'0')}</span><strong>{q.title}</strong><ChevronDown size={18}/>{openQa===i&&<p>{q.text}</p>}</button>)}</div></>}
    <ArchitectureQuickView
      detail={quickDetail}
      onClose={()=>setQuick(null)}
      onRelated={id=>{const match=links.find(l=>l.id===id);if(match)chooseLink(match)}}
      onMatrix={quick?.kind==='microservice'?undefined:openMatrix}
    />
  </section>
}
