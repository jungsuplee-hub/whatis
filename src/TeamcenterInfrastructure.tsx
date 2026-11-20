import { useState } from 'react'
import {
  Activity, ArrowDown, ArrowRight, BadgeCheck, CheckCircle2,
  ExternalLink, GitFork, HardDrive, Layers3, LockKeyhole, Network,
  Route, ShieldCheck
} from 'lucide-react'
import './teamcenter-infrastructure.css'

type ComponentType = 'product' | 'pattern' | 'optional'
type InfraNode = {
  id:string; name:string; caption:string; type:ComponentType;
  purpose:string; traffic:string; decision:string; ref:'siemens'|'microsoft'|'aws'|'fms'
}
type StoryId='metadata'|'file'|'external'
const references={
  siemens:{label:'Siemens · Active Workspace',url:'https://blogs.sw.siemens.com/teamcenter/Teamcenter-Active-Workspace-Strategy/'},
  microsoft:{label:'Microsoft Learn · Teamcenter baseline',url:'https://learn.microsoft.com/en-us/azure/architecture/example-scenario/manufacturing/teamcenter-baseline'},
  aws:{label:'AWS · Teamcenter reference architecture',url:'https://docs.aws.amazon.com/reference-architecture-diagrams/latest/siemens-teamcenter-plm/siemens-teamcenter-plm.html'},
  fms:{label:'Siemens · File Management System',url:'https://blogs.sw.siemens.com/teamcenter/store-and-forward-with-file-management-system-fms/'}
}
const nodes:InfraNode[]=[
  {id:'client',name:'Active Workspace',caption:'Browser / 사용자',type:'product',purpose:'사용자가 제품 구조·도면·문서·변경 정보를 조회하고 작업하는 웹 경험입니다.',traffic:'사용자 HTTPS 요청과 사용자 인증 결과를 전달받습니다.',decision:'일반 사용자·외부 협력사·원격 설계자의 위치 및 동시 접속 패턴을 구분하세요.',ref:'siemens'},
  {id:'edge',name:'접속 게이트웨이',caption:'LB / Reverse Proxy',type:'pattern',purpose:'접근 정책과 TLS, 웹 요청 분산을 위한 인프라 설계 경계입니다. 단일 필수 제품 구성요소를 뜻하지 않습니다.',traffic:'브라우저 접속을 웹 계층으로 라우팅합니다.',decision:'TLS 종료 위치, 인증 연계, 프록시 헤더, 세션 유지, 접근 허용 구역을 정의하세요.',ref:'microsoft'},
  {id:'web',name:'Web Tier',caption:'웹 애플리케이션',type:'product',purpose:'Active Workspace 등의 웹 요청을 수용하고 Teamcenter 서비스 계층으로 전달하는 논리적 웹 계층입니다.',traffic:'웹 요청과 서비스 응답이 Teamcenter 업무 처리 계층을 왕복합니다.',decision:'웹 애플리케이션의 지원 런타임·배치 단위·세션 요건은 적용 릴리스의 지원 자료로 확정하세요.',ref:'microsoft'},
  {id:'enterprise',name:'Enterprise Tier',caption:'Server Manager / 업무 처리',type:'product',purpose:'Teamcenter 비즈니스 로직과 제품 구조·변경·권한 관련 업무 요청을 처리하는 논리 계층입니다.',traffic:'웹에서 들어온 서비스 요청을 수행하고 데이터·파일 계층에 필요한 작업을 요청합니다.',decision:'BOM 탐색·변경 승인·동시 세션·일괄 작업을 분리하여 처리량과 병목을 측정하세요.',ref:'microsoft'},
  {id:'database',name:'PLM Database',caption:'관계형 DB · 메타데이터',type:'product',purpose:'제품 정보, 객체 관계, 권한과 업무 관련 구조화 데이터를 관리하는 핵심 저장 영역입니다.',traffic:'업무 서버가 DB에 접근합니다. 최종 사용자가 직접 접속하는 경로로 설계하지 않습니다.',decision:'지원 DB 종류·버전, 연결 풀, IOPS, 트랜잭션 지연, 백업·복구 정합성을 검증하세요.',ref:'aws'},
  {id:'fms',name:'FMS / FSC',caption:'파일 전송 · 서버 캐시',type:'product',purpose:'Teamcenter File Management System은 CAD·문서 파일의 저장·전송·캐시를 담당하는 파일 관리 경로입니다.',traffic:'업무 처리와 연계된 권한 확인 후 파일을 캐시·볼륨 사이에서 전송하는 별도 데이터 경로로 이해합니다.',decision:'원격 사이트, 대용량 CAD 열기/저장, 캐시 적중률, 파일 전송량과 지연을 점검하세요.',ref:'fms'},
  {id:'volume',name:'File Volumes',caption:'CAD / JT / PDF 저장 영역',type:'product',purpose:'실제 엔지니어링 파일을 보존하는 영속 저장 영역으로 DB 메타데이터와 역할이 다릅니다.',traffic:'FMS 경로를 통해 파일을 읽고 저장합니다.',decision:'파일 수·평균 및 최대 용량·동시 업로드·스토리지 대역폭·스냅샷 및 복원 정합성을 확인하세요.',ref:'fms'},
  {id:'search',name:'검색 / 인덱싱',caption:'Search · Indexer',type:'optional',purpose:'검색 경험과 관련된 색인·검색 계층입니다. 구성 방식과 필요 여부는 활성화 기능 및 버전별 자료를 확인해야 합니다.',traffic:'검색 대상 데이터의 색인과 사용자 검색 요청이 처리되는 경로를 계획합니다.',decision:'인덱스 증가율·재구축 시간·검색 지연과 운영 복구 절차를 별도 측정하세요.',ref:'aws'},
  {id:'integration',name:'Integration',caption:'ERP / MES / CAD / ALM',type:'optional',purpose:'외부 시스템과 데이터를 교환하는 경계입니다. 필요한 커넥터·서비스·데이터 변환은 프로젝트별로 달라집니다.',traffic:'외부 시스템과 Teamcenter 사이에 인증된 호출·이벤트·배치 데이터 이동이 발생할 수 있습니다.',decision:'원본 데이터 소유권, 실패 재시도, 순서 보장, 중복 방지 및 인터페이스 계약을 정의하세요.',ref:'aws'},
  {id:'security',name:'Identity & Security',caption:'SSO / LDAP / 권한',type:'pattern',purpose:'인증, 권한, 네트워크 경계와 감사 정책을 전체 흐름에 적용하는 공통 설계 영역입니다.',traffic:'사용자 로그인 및 서비스 간 접근 통제와 연계됩니다.',decision:'인증 경로, 역할별 데이터 권한, 서비스 계정, 인증서, 방화벽 정책과 감사 범위를 합의하세요.',ref:'microsoft'},
  {id:'operation',name:'Operations',caption:'로그 / 모니터링 / 백업',type:'pattern',purpose:'관측 가능성, 고가용성, 장애 조치 및 복구를 위한 운영 설계 영역입니다.',traffic:'계층별 상태·지연·오류·용량 지표를 수집하고 필요한 대응 절차에 연결합니다.',decision:'RPO·RTO, 전체 복원 테스트, 알람 임계치, 업그레이드/롤백을 검토하세요.',ref:'microsoft'}
]
const stories:{id:StoryId;label:string;caption:string;path:string[];steps:string[]}[]=[
  {id:'metadata',label:'제품 정보 조회',caption:'BOM·속성·변경정보',path:['client','edge','web','enterprise','database'],steps:['사용자가 제품 구조 또는 속성을 엽니다.','접속 경계를 지나 웹/업무 요청을 처리합니다.','업무 계층이 구조화된 PLM 데이터를 조회하고 응답합니다.']},
  {id:'file',label:'CAD 파일 열기',caption:'FMS 경로 확인',path:['client','edge','web','enterprise','fms','volume'],steps:['사용자가 도면이나 CAD 파일을 선택합니다.','업무 시스템이 접근 권한과 파일 위치 정보를 다룹니다.','FMS/캐시 경로를 통해 파일 데이터를 전달받습니다.']},
  {id:'external',label:'외부 업무 연계',caption:'ERP·MES·ALM',path:['integration','enterprise','database'],steps:['외부 시스템의 업무 데이터 교환이 시작됩니다.','연계 로직·인증·변환 규칙을 거쳐 업무 계층에 요청을 전달합니다.','변경 결과를 반영하고 오류·재처리 결과를 기록합니다.']}
]
const tierRows:{title:string;hint:string;nodes:string[];tone:string}[]=[
  {title:'01 · CLIENT / ACCESS',hint:'사용자와 외부 연결',nodes:['client','edge'],tone:'access'},
  {title:'02 · WEB',hint:'웹 애플리케이션 경계',nodes:['web'],tone:'web'},
  {title:'03 · ENTERPRISE',hint:'비즈니스 로직·서버',nodes:['enterprise','integration'],tone:'enterprise'},
  {title:'04 · RESOURCE',hint:'메타데이터와 파일을 분리',nodes:['database','fms','volume','search'],tone:'resource'}
]
const architectureNotes=[
  {title:'HA · 이중화',label:'AVAILABILITY',icon:Network,details:'웹·업무·파일·DB 각 계층의 단일 장애점을 따로 평가합니다. 다중 서버 또는 다중 AZ 배치 여부는 공식 지원 모델과 프로젝트 SLA로 결정합니다.'},
  {title:'백업과 DR',label:'RECOVERY',icon:HardDrive,details:'DB만 복원해서는 파일과 메타데이터의 일치성을 보장할 수 없습니다. 파일 저장소와 DB의 정합성, 인덱스 복구, 전체 업무 복원 시나리오를 함께 시험합니다.'},
  {title:'네트워크',label:'SEGMENTATION',icon:ShieldCheck,details:'접속·웹·업무·리소스 네트워크 구역을 구분합니다. 실제 프로토콜, 포트, 인증서·방화벽 허용 규칙은 제품 문서와 배포 모델별로 검증합니다.'},
  {title:'사이징',label:'PERFORMANCE',icon:Activity,details:'사용자 수와 실제 동시 부하, BOM 복잡도, CAD 파일 크기, 검색·배치 작업량, 원격 접속 지연을 함께 계측합니다. 이 화면은 CPU/RAM·서버 대수를 제시하지 않습니다.'}
]
export default function TeamcenterInfrastructure(){
  const [story,setStory]=useState<StoryId>('metadata')
  const [selected,setSelected]=useState('enterprise')
  const [note,setNote]=useState<number|null>(null)
  const active=stories.find(s=>s.id===story)!
  const component=nodes.find(n=>n.id===selected)!
  const source=references[component.ref]
  const inPath=new Set(active.path)
  return <div className="tc-infra">
    <header className="tc-infra-header">
      <div><span className="tc-infra-eyebrow">TEAMCENTER · INFRASTRUCTURE LAB</span><h3>요청이 이동하는 경로를<br/>따라가 보세요.</h3><p>4계층 구성에 FMS·검색·외부 연계를 더한 독자적인 인프라 학습도입니다.</p></div>
      <div className="tc-infra-head-mark"><Layers3 size={29}/><strong>4 TIERS</strong><span>Client / Web / Enterprise / Resource</span></div>
    </header>
    <div className="tc-infra-demo">
      <div className="tc-infra-story-tabs" role="group" aria-label="Teamcenter 요청 흐름 선택">
        {stories.map(s=><button key={s.id} type="button" onClick={()=>{setStory(s.id);setSelected(s.id==='file'?'fms':s.id==='external'?'integration':'enterprise')}} className={s.id===story?'active':''} aria-pressed={s.id===story}><Route size={16}/><strong>{s.label}</strong><small>{s.caption}</small></button>)}
      </div>
      <div className="tc-infra-journey">
        <div className="tc-infra-journey-head"><span>REQUEST PATH</span><strong>{active.label}</strong><span>선택한 경로가 구성도에 강조됩니다</span></div>
        <div className="tc-infra-path">{active.path.map((id,i)=>{const n=nodes.find(x=>x.id===id)!;return <div className="tc-infra-path-step" key={id}><button onClick={()=>setSelected(id)} className={selected===id?'selected':''}>{n.name}</button>{i<active.path.length-1&&<ArrowRight size={15}/>}</div>})}</div>
      </div>
    </div>
    <div className="tc-infra-topology">
      <div className="tc-infra-map-key"><span><i className="tc-legend-product"/> Teamcenter 구성 개념</span><span><i className="tc-legend-pattern"/> 인프라 설계 선택</span><span><i className="tc-legend-optional"/> 적용 여부 검토</span></div>
      <div className="tc-infra-tiers">
        {tierRows.map((tier,rowIndex)=><div className={'tc-infra-tier tier-'+tier.tone} key={tier.title}>
          <div className="tc-infra-tier-name"><span>{tier.title}</span><small>{tier.hint}</small></div>
          <div className="tc-infra-tier-items">{tier.nodes.map(id=>{const n=nodes.find(x=>x.id===id)!;const on=inPath.has(id);const selectedNow=id===selected;return <button onClick={()=>setSelected(id)} key={id} type="button" aria-pressed={selectedNow}
            className={'tc-infra-node node-'+n.type+(on?' in-path':'')+(selectedNow?' selected':'')+(on&&id===active.path[active.path.length-1]?' end-point':'')}>
              <span className="tc-infra-node-dot"/><strong>{n.name}</strong><small>{n.caption}</small>
              {on&&<span className="tc-infra-flow-mark"><ArrowRight size={12}/></span>}
            </button>})}</div>
          {rowIndex<tierRows.length-1&&<div className="tc-infra-down"><ArrowDown size={17}/></div>}
        </div>)}
      </div>
      <div className="tc-infra-cross"><button onClick={()=>setSelected('security')} className={selected==='security'?'selected':''}><LockKeyhole size={18}/> Identity / Security <span>인증·역할·접근 제어</span></button><button onClick={()=>setSelected('operation')} className={selected==='operation'?'selected':''}><Activity size={18}/> Observability / Operations <span>모니터링·백업·복구</span></button></div>
    </div>
    <div className="tc-infra-inspection" aria-live="polite">
      <div className="tc-infra-inspection-intro"><span>SELECTED COMPONENT</span><div><h4>{component.name}</h4><span className={'tc-type tc-type-'+component.type}>{component.type==='product'?'제품 계층 개념':component.type==='pattern'?'설계 패턴':'선택 기능'}</span></div><p>{component.purpose}</p></div>
      <div className="tc-infra-inspection-points"><div><strong><GitFork size={15}/> 데이터 흐름</strong><p>{component.traffic}</p></div><div><strong><CheckCircle2 size={15}/> 인프라 설계 검토</strong><p>{component.decision}</p></div>
      <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<ExternalLink size={13}/></a></div>
    </div>
    <div className="tc-infra-path-text"><strong>현재 흐름을 한 문장씩</strong><div>{active.steps.map((step,i)=><p key={step}><span>{String(i+1).padStart(2,'0')}</span>{step}</p>)}</div></div>
    <section className="tc-infra-design-notes"><div className="tc-infra-notes-head"><span>ARCHITECT REVIEW</span><h4>배포 전에 결정할 4가지</h4></div><div className="tc-infra-notes">{architectureNotes.map((item,i)=>{const Icon=item.icon;return <button type="button" onClick={()=>setNote(note===i?null:i)} key={item.title} aria-expanded={note===i} className={note===i?'expanded':''}>
      <span className="tc-note-head"><Icon size={19}/><small>{item.label}</small></span><strong>{item.title}</strong><span className="tc-note-arrow">{note===i?'−':'+'}</span>{note===i&&<p>{item.details}</p>}
    </button>})}</div></section>
    <div className="tc-infra-warning"><BadgeCheck size={16}/><span>4계층과 FMS는 공개 기술자료로 설명되는 구조입니다. Load Balancer·보안 구역·이중화 등은 프로젝트별 설계 선택이며, 이 그림은 특정 2606 구축의 공식 설치도·지원 구성 또는 확정 사이징이 아닙니다.</span></div>
  </div>
}
