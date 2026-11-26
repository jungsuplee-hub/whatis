import { useMemo, useState } from 'react'
import {
  ArrowLeftRight, ArrowRight, Boxes, ChevronDown, CircleHelp, Database,
  GitBranch, Globe2, Link2, LockKeyhole, ScanSearch, Server, ShieldCheck
} from 'lucide-react'
import './siemens-architect.css'
import TeamcenterInfrastructure from './TeamcenterInfrastructure'
import TeamcenterDeepDive from './TeamcenterDeepDive'
import PolarionArchitecture from './PolarionArchitecture'
import SystemsFlowGallery from './SystemsFlowAtlas'

type Product = 'teamcenter' | 'polarion'
type View = 'logical' | 'deployment' | 'infra'
type IconName = 'browser' | 'app' | 'data' | 'integration' | 'security' | 'process'
type ArchitectureNode = { id:string; title:string; subtitle:string; role:string; inspect:string; type:IconName }
type Decision = { title:string; intro:string; questions:string[]; why:string; kind:string }
const ICONS:Record<IconName,typeof Globe2>={browser:Globe2,app:Boxes,data:Database,integration:Link2,security:ShieldCheck,process:GitBranch}
const products:Record<Product,{
  label:string; full:string; subtitle:string; release:string; releaseUrl:string;
  description:string; nodes:ArchitectureNode[]; decisions:Decision[];
}> = {
  teamcenter:{
    label:'Teamcenter',full:'Teamcenter 2606',subtitle:'PLM · 제품 데이터 및 변경관리',release:'2606',releaseUrl:'https://blogs.sw.siemens.com/teamcenter/teamcenter-2606/',
    description:'제품 구조·문서·변경을 중심으로 사용 경험, 업무 처리, 데이터 관리, 외부 연계를 분리해 보는 논리적 관점입니다.',
    nodes:[
      {id:'experience',title:'Active Workspace',subtitle:'사용자 경험',type:'browser',role:'사용자는 제품 구조·문서·워크플로에 접근합니다.',inspect:'웹 접근, 사용자 역할, 사용 경로와 예상 동시 사용자 수를 확인합니다.'},
      {id:'application',title:'Teamcenter 서비스',subtitle:'업무 로직',type:'app',role:'제품 데이터와 업무 프로세스에 대한 요청을 처리하는 계층입니다.',inspect:'주요 기능과 부하 패턴, 다른 서비스에 대한 의존성을 정리합니다.'},
      {id:'process',title:'제품 구조 · 변경',subtitle:'업무 모델',type:'process',role:'부품 구조, 데이터 관계, 승인·변경 흐름을 관리합니다.',inspect:'데이터 변경 영향도, 승인 역할, 인터페이스 간 책임을 정의합니다.'},
      {id:'data',title:'데이터 · 파일',subtitle:'영속 데이터',type:'data',role:'제품 관련 레코드 및 파일을 저장·관리하는 영역입니다.',inspect:'데이터베이스·파일 저장 요구, 백업 정합성 및 복구 우선순위를 검토합니다.'},
      {id:'integration',title:'외부 시스템 연계',subtitle:'연동 경계',type:'integration',role:'타 시스템과 교환되는 제품·업무 정보를 연결합니다.',inspect:'주고받는 데이터 소유권, 인터페이스 방식, 장애 시 재처리 규칙을 확인합니다.'},
      {id:'security',title:'접근 · 보안 정책',subtitle:'공통 통제',type:'security',role:'사용자 식별과 데이터 접근 권한을 확인할 영역입니다.',inspect:'인증·권한·감사 요건과 외부 연결의 허용 범위를 분리해 검토합니다.'}
    ],
    decisions:[
      {title:'사용자·접근',intro:'누가 어디서 어떤 기능을 사용할까요?',kind:'IDENTITY',questions:['이용자와 운영자의 권한 경계가 분리되어 있나요?','외부 협업자의 접속 조건과 데이터 공개 범위는 무엇인가요?','접속 경로와 인증 방식을 누가 승인하나요?'],why:'인증 정책과 제품 데이터 권한은 함께 검토해야 합니다.'},
      {title:'서비스와 배포',intro:'업무 흐름을 어디에서 처리할까요?',kind:'DEPLOYMENT',questions:['사용자 경험·서비스·데이터의 책임이 나뉘어 있나요?','기능별 장애 영향과 유지보수 범위를 알고 있나요?','테스트·운영 환경의 구성 차이를 기록했나요?'],why:'논리적 경계를 먼저 정한 뒤 실제 서버·네트워크에 배치합니다.'},
      {title:'데이터·복구',intro:'제품 정보와 파일을 어떻게 보호할까요?',kind:'DATA',questions:['제품 DB와 파일 데이터의 정합성은 어떻게 보장하나요?','복구 목표(RPO/RTO)는 누가 정하나요?','복원 후 데이터 일치 여부를 어떻게 검증하나요?'],why:'백업 성공만으로 실제 업무 복구가 보장되지는 않습니다.'},
      {title:'외부 연동',intro:'ERP·CAD·ALM와 어떤 정보를 교환할까요?',kind:'INTEGRATION',questions:['시스템별 데이터 원천과 최종 책임자는 누구인가요?','실패한 동기화에 대한 재처리·중복 방지 방안이 있나요?','변경 이벤트와 대용량 파일 이동을 구분했나요?'],why:'연동은 데이터 계약과 오류 처리 체계부터 설계해야 합니다.'},
      {title:'용량·성능',intro:'실제 부하는 무엇으로 결정되나요?',kind:'CAPACITY',questions:['이용자 수뿐 아니라 작업 유형별 트래픽이 정의됐나요?','검색·제품 구조 열람·파일 처리를 별도 측정하나요?','제품 버전별 검증 환경에서 부하 테스트할 계획인가요?'],why:'CPU·메모리 숫자는 작업량과 데이터 규모를 알기 전에는 확정하지 않습니다.'},
      {title:'변경·운영',intro:'버전 변경도 안전하게 할 수 있을까요?',kind:'OPERATIONS',questions:['업그레이드 전후 기능·인터페이스 검증 목록이 있나요?','릴리스별 구성 변경을 기록하고 있나요?','모니터링, 변경 승인, 장애 복구 담당자를 정의했나요?'],why:'운영 절차는 설치 방식만큼 중요합니다.'}
    ]
  },
  polarion:{
    label:'Polarion',full:'Polarion ALM 2606',subtitle:'ALM · 요구사항과 시험 추적성',release:'2606',releaseUrl:'https://blogs.sw.siemens.com/polarion/polarion-alm-2606-whats-new-and-noteworthy/',
    description:'요구사항·Work Item·시험·추적성이라는 업무 관점에서 사용, 처리, 데이터 보존과 연동을 분리한 개념도입니다.',
    nodes:[
      {id:'experience',title:'Polarion 웹 화면',subtitle:'사용자 접근',type:'browser',role:'요구사항 작성, 검토, 시험, 보고서 작업을 수행하는 진입점입니다.',inspect:'검토자와 작성자의 역할, 프로젝트 구조와 예상 동시 작업 유형을 구분합니다.'},
      {id:'application',title:'ALM 기능',subtitle:'업무 처리',type:'app',role:'Work Item, 문서, 시험과 승인 작업의 규칙을 처리합니다.',inspect:'고빈도 작업, 대량 항목 편집, 프로젝트 간 참조 패턴을 점검합니다.'},
      {id:'process',title:'추적성 · 테스트',subtitle:'연결된 업무 정보',type:'process',role:'요구사항과 구현·검증 산출물의 연결 관계를 관리합니다.',inspect:'링크 타입과 추적 범위, 기준선·검토 흐름을 설계합니다.'},
      {id:'data',title:'저장 · 이력',subtitle:'영속 데이터',type:'data',role:'업무 정보와 변경 이력을 보존하는 영역입니다.',inspect:'저장·색인·백업의 범위를 확인하고 복구 시 일관성을 검증합니다.'},
      {id:'integration',title:'REST · 외부 도구',subtitle:'연동 인터페이스',type:'integration',role:'개발·테스트·PLM 도구와 정보를 교환할 수 있습니다.',inspect:'API 권한, 동기화 단위, 실패·재시도·중복 실행을 검토합니다.'},
      {id:'security',title:'사용자·보안 통제',subtitle:'접근 정책',type:'security',role:'프로젝트 및 데이터 접근의 허용 범위를 다루는 영역입니다.',inspect:'역할·프로젝트 권한·감사·외부 접속을 구분해 검토합니다.'}
    ],
    decisions:[
      {title:'프로젝트 모델',intro:'요구사항과 시험을 어떻게 연결할까요?',kind:'MODEL',questions:['Work Item 유형과 상태 전이가 정리됐나요?','추적성 링크의 방향·의미·필수 여부를 정의했나요?','프로젝트 간 공통 항목을 재사용할 때 책임자를 구분했나요?'],why:'아키텍처는 데이터 모델과 실제 업무 절차에서 시작합니다.'},
      {title:'운영 규모',intro:'어떤 작업이 부하를 일으킬까요?',kind:'WORKLOAD',questions:['동시 접속과 실제 동시 편집을 구분했나요?','Work Item 수, 문서 크기, 추적 관계의 규모를 알 수 있나요?','보고서와 대량 변경 업무를 별도로 시험하나요?'],why:'사용자 수만으로 적정 서버 크기를 확정할 수 없습니다.'},
      {title:'가용성·복구',intro:'중단과 복구의 기준은 무엇인가요?',kind:'RECOVERY',questions:['중단 허용 시간과 데이터 손실 허용 범위가 정해졌나요?','애플리케이션·저장 데이터·이력의 복구 순서를 검증했나요?','클러스터·다중 인스턴스 필요 여부를 업무 요건으로 판단했나요?'],why:'사용 환경의 가용성 목표부터 정하고 검증 가능한 복구 테스트를 계획합니다.'},
      {title:'데이터·색인',intro:'검색과 이력을 안정적으로 유지할까요?',kind:'DATA',questions:['저장된 원본과 검색 결과의 역할을 구분했나요?','색인 지연·재구축·데이터 불일치 감지 방법이 있나요?','백업 뒤 실제 업무 시나리오로 복구를 확인하나요?'],why:'검색 편의성과 원본 데이터의 무결성은 별도 검토 항목입니다.'},
      {title:'통합·API',intro:'외부 도구와 무엇을 연결할까요?',kind:'INTEGRATION',questions:['외부 호출을 허용할 권한과 데이터 범위가 정해졌나요?','모든 변경이 실시간이어야 하는지 검토했나요?','연동 장애가 사용자 작업에 미치는 영향을 측정하나요?'],why:'연동의 목적과 데이터 책임을 먼저 합의해야 합니다.'},
      {title:'버전·운영',intro:'릴리스와 환경 차이를 어떻게 관리할까요?',kind:'OPERATIONS',questions:['운영·검증 환경의 버전과 설정을 추적하나요?','업그레이드 후 핵심 업무와 연계를 재검증하나요?','모니터링 지표와 운영자 대응 절차를 정의했나요?'],why:'운영 설계는 제품 기능 외에 로그·복구·변경 관리도 포함합니다.'}
    ]
  }
}
const relationNodes=[
  {title:'제품 변경',subtitle:'Teamcenter',details:'부품·제품 구조와 변경 관리의 맥락'},
  {title:'요구사항·검증',subtitle:'Polarion',details:'요구사항, 테스트, 추적 가능한 업무 항목'},
  {title:'연결 관계',subtitle:'Integration',details:'양쪽의 변경 영향·참조·책임 범위'}
]
export default function SiemensArchitect({onHome,onTeamcenterDemo,onPolarionDemo}:{onHome:()=>void;onTeamcenterDemo:()=>void;onPolarionDemo:()=>void}) {
  const [product,setProduct]=useState<Product>('teamcenter')
  const [view,setView]=useState<View>('infra')
  const [selected,setSelected]=useState('experience')
  const [tab,setTab]=useState<'map'|'flows'|'decisions'|'bridge'>(()=>window.location.hash.startsWith('#siemens/flows')?'flows':'map')
  const [checks,setChecks]=useState<Record<string,boolean>>({})
  const config=products[product]
  const node=config.nodes.find(n=>n.id===selected)??config.nodes[0]
  const completed=useMemo(()=>config.decisions.reduce((n,d)=>n+(checks[product+'-'+d.kind]?1:0),0),[checks,config,product])
  const pick=(next:Product)=>{setProduct(next);setSelected('experience');setView('infra');setTab('map')}
  return <section className="sa-page">
    <div className="sa-path"><button type="button" onClick={onHome}><ArrowRight size={15}/> Polarion 운영 가이드</button><span>/</span><strong>Siemens Architecture · Old</strong></div>
    <header className="sa-intro">
      <div><span className="sa-eyebrow"><span className="sa-on"/> SOLUTION ARCHITECT NOTES · 2026</span><h1>아키텍처를<br/><em>눈으로 설계하다.</em></h1><p>Teamcenter, Polarion, Opcenter. 제품 설계부터 검증과 제조 실행까지 살펴보세요.</p></div>
      <div className="sa-version-plate"><span>PRODUCT RELEASES</span><strong>2606 <span>/</span> 2606</strong><small>Teamcenter · Polarion ALM</small><p>아키텍처 설명에 사용하는 버전입니다. 실제 적용 시 지원 매트릭스와 최신 패치를 확인하세요.</p></div>
    </header>
    <div className="sa-products" role="group" aria-label="솔루션 선택">
      {(['teamcenter','polarion'] as Product[]).map(v=><button key={v} className={'sa-product '+(product===v?'selected':'')} onClick={()=>pick(v)} aria-pressed={product===v}>
        <span className="sa-product-mark">{v==='teamcenter'?'TC':'PL'}</span>
        <span className="sa-product-name"><strong>{products[v].label}</strong><small>{products[v].subtitle}</small></span><span className="sa-product-version">2606</span><ArrowRight size={20}/>
      </button>)}
      <a className="sa-product sa-opcenter-link" href="./mes/">
        <span className="sa-product-mark">OC</span>
        <span className="sa-product-name"><strong>Opcenter</strong><small>MES · 제조 실행 시뮬레이션</small></span>
        <span className="sa-product-version">LAB</span><ArrowRight size={20}/>
      </a>
    </div>
    <div className="sa-learning-entries">
      <div className="sa-user-guide-entry"><div><span>INTERACTIVE USER GUIDE · TEAMCENTER 2606</span><h3>Teamcenter 화면을 직접 체험하세요.</h3><p>Active Workspace · Item/Revision · BOM · 문서 · 승인 · 변경 관리</p></div><button type="button" onClick={onTeamcenterDemo}>Teamcenter 데모 열기 <ArrowRight size={17}/></button></div>
      <div className="sa-user-guide-entry sa-polarion-guide-entry"><div><span>INTERACTIVE USER GUIDE · POLARION 2606</span><h3>Polarion ALM을 직접 체험하세요.</h3><p>Work Items · Requirements · LiveDocs · Plans · Test Runs · Traceability</p></div><button type="button" onClick={onPolarionDemo}>Polarion 데모 열기 <ArrowRight size={17}/></button></div>
    </div>
    <div className="sa-workspace">
      <div className="sa-workspace-header">
        <div><span className="sa-section-no">01 / EXPLORE</span><h2>{config.full} <span>설계 가이드</span></h2></div>
        <div className="sa-primary-tabs" role="tablist" aria-label="아키텍처 학습 메뉴">
          <button role="tab" aria-selected={tab==='map'} className={tab==='map'?'active':''} onClick={()=>setTab('map')}>구성도</button>
          <button role="tab" aria-selected={tab==='flows'} className={tab==='flows'?'active':''} onClick={()=>setTab('flows')}>동작 흐름</button>
          <button role="tab" aria-selected={tab==='decisions'} className={tab==='decisions'?'active':''} onClick={()=>setTab('decisions')}>설계 질문</button>
          <button role="tab" aria-selected={tab==='bridge'} className={tab==='bridge'?'active':''} onClick={()=>setTab('bridge')}>연계 이해</button>
        </div>
      </div>
      {tab==='map'&&<>
        <div className="sa-map-head"><p>{config.description}</p><div className="sa-switch" role="group" aria-label="구성도 보기 방식"><button onClick={()=>setView('logical')} className={view==='logical'?'on':''}>논리 구조</button><button onClick={()=>setView('deployment')} className={view==='deployment'?'on':''}>배포 구역</button><button onClick={()=>setView('infra')} className={view==='infra'?'on':''}>인프라 구성도</button></div></div>
        {view==='infra'?
          product==='teamcenter'? <>
            <TeamcenterDeepDive/>
            <details className="sa-legacy-overview"><summary>간단한 4계층 설명도 보기 <ChevronDown size={15}/></summary><TeamcenterInfrastructure/></details>
          </> : <PolarionArchitecture/>
          :view==='logical'?
          <div className="sa-map">
            <div className="sa-map-legend"><span><i/> SELECT A COMPONENT</span><span>각 요소를 눌러 역할 확인</span></div>
            <div className="sa-system-flow">
              {config.nodes.filter(n=>n.id!=='security').map((n,i)=>{const Icon=ICONS[n.type];return <div className="sa-flow-unit" key={n.id}>
                <button type="button" className={'sa-flow-card '+(selected===n.id?'chosen':'')} onClick={()=>setSelected(n.id)} aria-pressed={selected===n.id}>
                  <span className="sa-node-step">{String(i+1).padStart(2,'0')}</span><Icon size={30}/><strong>{n.title}</strong><small>{n.subtitle}</small>
                </button>{i<4&&<ArrowRight className="sa-flow-arrow" size={19}/>}
              </div>})}
            </div>
            <div className="sa-common-bar"><button onClick={()=>setSelected('security')} className={selected==='security'?'chosen':''}><ShieldCheck size={18}/> 접근 · 보안 정책 <span>전 영역의 공통 검토 사항</span><ArrowRight size={15}/></button></div>
          </div>
          :<div className="sa-deployment">
            <div className="sa-deploy-title"><Server size={19}/> 배포 구역을 나누어 생각하는 개념적 예시</div>
            <div className="sa-deployment-flow">
              {[{name:'접속 영역',desc:'사용자·브라우저',icon:Globe2},{name:'서비스 영역',desc:'업무 처리·연동',icon:Boxes},{name:'데이터 영역',desc:'데이터·파일·이력',icon:Database}].map((n,i)=><div className="sa-zone" key={n.name}><span>ZONE {String(i+1).padStart(2,'0')}</span><n.icon size={33}/><strong>{n.name}</strong><small>{n.desc}</small></div>)}
            </div><p>하드웨어 대수, 네트워크 포트, 데이터베이스 제품, 지원 OS, 이중화 형태는 여기에서 확정하지 않습니다. 실제 제품별 배포 가이드와 플랫폼 지원표를 확인해야 합니다.</p>
          </div>}
        <div className="sa-inspector"><div className="sa-inspector-icon">{(() => { const Icon=ICONS[node.type];return <Icon size={24}/> })()}</div><div><span>SELECTED COMPONENT · {node.subtitle}</span><h3>{node.title}</h3><p>{node.role}</p><strong><ScanSearch size={15}/> 아키텍트가 확인할 것</strong><p>{node.inspect}</p></div></div>
      </>}
      {tab==='flows'&&<SystemsFlowGallery domain={product} title={product==='teamcenter'?'Teamcenter 서비스가 움직이는 과정':'Polarion 서비스가 움직이는 과정'} subtitle="서버·서비스 관계를 정적인 선 대신 단계별 데이터 흐름으로 설명합니다. 카드에서 설명 패널을 열고 재생·일시정지·단계 선택을 할 수 있습니다."/>}
      {tab==='decisions'&&<div className="sa-decisions">
        <div className="sa-decision-guide"><div><span>ARCHITECT'S CHECKLIST</span><strong>{completed} / {config.decisions.length}</strong></div><p>확인한 항목은 표시해 둘 수 있습니다. 이 브라우저 화면에만 임시로 반영됩니다.</p></div>
        <div className="sa-decision-list">{config.decisions.map((d,i)=><details key={d.kind} className="sa-decision" open><summary><span className="sa-decision-index">{String(i+1).padStart(2,'0')}</span><span className="sa-decision-title"><strong>{d.title}</strong><small>{d.intro}</small></span><span className="sa-decision-check" onClick={e=>e.stopPropagation()}><input type="checkbox" aria-label={d.title+' 검토 완료'} checked={!!checks[product+'-'+d.kind]} onChange={e=>setChecks(s=>({...s,[product+'-'+d.kind]:e.target.checked}))}/></span><ChevronDown size={19}/></summary><div className="sa-decision-body">{d.questions.map((q,j)=><p key={j}><span>{j+1}</span>{q}</p>)}<div><CircleHelp size={16}/>{d.why}</div></div></details>)}</div>
      </div>}
      {tab==='bridge'&&<div className="sa-bridge"><div className="sa-bridge-intro"><span>CROSS-DOMAIN THREAD</span><h3>제품 변경과 요구사항을<br/>어떻게 연결할까요?</h3><p>두 제품 사이의 데이터 소유권·참조 관계·변경 영향 분석을 먼저 정의합니다.</p></div>
        <div className="sa-bridge-chain">{relationNodes.map((v,i)=><div key={v.title} className="sa-bridge-cell"><span>{v.subtitle}</span><strong>{v.title}</strong><small>{v.details}</small>{i!==2&&<ArrowLeftRight size={19}/>}</div>)}</div>
        <div className="sa-bridge-questions">{['어떤 정보가 각 시스템의 원본인가?','참조 대상이 바뀌면 누가 변경을 승인하는가?','연결 실패나 재처리를 어떻게 기록하는가?','제품 버전과 실제 연계 방식이 호환되는가?'].map((q,i)=><div key={q}><span>{String(i+1).padStart(2,'0')}</span><strong>{q}</strong></div>)}</div>
        <p className="sa-bridge-caption">이 그림은 통합 검토용 개념도입니다. 지원되는 실제 연계 방식과 데이터 매핑은 별도 설계·시험이 필요합니다.</p>
      </div>}
    </div>
    <footer className="sa-disclaimer"><LockKeyhole size={17}/><span>이 페이지는 솔루션 아키텍트의 학습과 설계 검토를 돕는 개념형 가이드이며, Siemens 공식 배포도·설치 지침·사이징 결과가 아닙니다. 최종 구성은 권한이 있는 담당자가 해당 버전의 계약 문서와 지원 매트릭스를 확인해야 합니다.</span></footer>
  </section>
}
