import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Search, ExternalLink } from 'lucide-react'
import './polarion-operations.css'
import { opsDetails } from './polarion-ops-details'
import { handbook, extraGuides } from './polarion-handbook'

const baseGuides = [
  {
    "id": "architecture",
    "group": "서버",
    "title": "아키텍처와 서버 구성",
    "keywords": "single instance cluster coordinator node topology load balancer",
    "summary": "시스템 구성도를 최신 상태로 유지하고 각 서버 역할과 의존성을 확인하는 출발점입니다.",
    "checks": [
      "구성별 호스트 역할, 서비스 연결 방향, 저장소 위치, 접속 URL, 버전과 운영 담당자를 기록한다.",
      "장애가 난 구성요소와 영향을 받는 사용자 범위를 분리한다.",
      "단일 인스턴스와 클러스터의 유지보수 절차를 혼용하지 않는다."
    ],
    "reference": "Deployment and Maintenance Guide · 설치 및 아키텍처"
  },
  {
    "id": "sizing",
    "group": "서버",
    "title": "서버 사이징 및 용량 계획",
    "keywords": "CPU RAM heap core sizing disk IOPS 동시 사용자",
    "summary": "사용자 수뿐 아니라 데이터 규모와 실제 작업량을 기준으로 용량을 검토합니다.",
    "checks": [
      "동시 사용자, Work Item·문서·첨부파일 규모, 저장소 증가량을 기록한다.",
      "CPU, 메모리, 디스크 I/O, 네트워크 지연의 평상시·최대치를 비교한다.",
      "2606 지원 환경과 공식 사이징 기준을 대조하고 검증 환경에서 부하를 측정한다."
    ],
    "reference": "Deployment and Maintenance Guide · 사이징"
  },
  {
    "id": "install",
    "group": "서버",
    "title": "설치 및 초기 구성",
    "keywords": "install linux windows firewall port certificate installation",
    "summary": "운영 환경을 만들기 전에 지원 버전과 요구사항을 확정합니다.",
    "checks": [
      "OS·Java·DB·SVN·Apache 지원 조합을 확인한다.",
      "방화벽, DNS, 인증서, 서비스 계정 및 저장 공간을 검토한다.",
      "설치 후 로그인·프로젝트 조회·저장·검색을 확인한다."
    ],
    "reference": "Deployment and Maintenance Guide · 설치"
  },
  {
    "id": "service",
    "group": "서버",
    "title": "기동·종료·정기 점검",
    "keywords": "start stop restart systemctl service status",
    "summary": "서비스 변경은 의존성, 사용자 영향, 작업 창을 확인한 뒤 수행합니다.",
    "checks": [
      "서비스 상태와 최근 로그를 먼저 기록한다.",
      "실제 배포 유형에 맞는 공식 기동·종료 순서를 확인한다.",
      "변경 후 웹 접속·로그인·저장·검색·연동을 확인한다."
    ],
    "reference": "Deployment and Maintenance Guide · 시스템 프로세스 및 유지보수"
  },
  {
    "id": "properties",
    "group": "설정",
    "title": "Polarion Properties",
    "keywords": "polarion.properties default scope configuration 설정 기본값",
    "summary": "설정은 제품 버전과 적용 범위를 확인한 후 변경합니다.",
    "checks": [
      "정확한 설정 키, 현재값, 공식 기본값, 적용 범위를 기록한다.",
      "변경 전 설정 파일을 백업하고 한 번에 한 변경만 검증한다.",
      "재시작 필요 여부와 복구 방법은 2606 레퍼런스에서 확인한다."
    ],
    "reference": "Polarion 2606 Config Properties Reference"
  },
  {
    "id": "apache",
    "group": "서버",
    "title": "Apache HTTPD 및 MPM",
    "keywords": "httpd apache MPM MaxRequestWorkers ServerLimit MaxConnectionsPerChild CPU 메모리 503",
    "summary": "프록시와 SVN 요청 처리 상태를 함께 확인하는 영역입니다.",
    "checks": [
      "HTTPD 프로세스·스레드 수, CPU, RSS 및 요청 지연을 같은 시간대로 기록한다.",
      "access/error 로그에서 요청 경로·상태 코드·지연을 비교한다.",
      "MPM 값은 현재 모듈, 동시 요청과 메모리 예산을 근거로 검증한다."
    ],
    "reference": "Deployment and Maintenance Guide · Apache 최적화"
  },
  {
    "id": "svn",
    "group": "서버",
    "title": "SVN Repository 및 Access File",
    "keywords": "SVN authz access file sync access file 권한 CPU 100 PROPFIND",
    "summary": "저장소와 접근 정책 변경의 영향 범위를 파악합니다.",
    "checks": [
      "문제 발생 시간과 저장소 요청, CPU, 권한 변경 기록을 비교한다.",
      "접근 오류인지 저장소 응답 지연인지 먼저 분리한다.",
      "운영 저장소 또는 권한 파일 직접 변경은 승인·백업·복구 절차를 확인한다."
    ],
    "reference": "Deployment and Maintenance Guide · Subversion / Administrator and User Help · 사용자 권한"
  },
  {
    "id": "postgres",
    "group": "서버",
    "title": "PostgreSQL 관리",
    "keywords": "postgresql DB connection query disk database",
    "summary": "데이터베이스 장애와 애플리케이션 오류를 구분합니다.",
    "checks": [
      "DB 상태, 연결 수, 저장 공간, 장시간 쿼리와 오류 로그를 확인한다.",
      "응답 지연이 DB·SVN·JVM 중 어디서 발생하는지 비교한다.",
      "DB 재시작·복구 전 서비스 의존성과 백업 정합성을 확인한다."
    ],
    "reference": "Deployment and Maintenance Guide · PostgreSQL"
  },
  {
    "id": "jvm",
    "group": "성능",
    "title": "JVM·Heap·GC·Ehcache",
    "keywords": "heap GC JFR cache eviction hit ratio JVM OOM memory",
    "summary": "메모리·GC·캐시 지표를 시간에 따라 분석합니다.",
    "checks": [
      "Heap 사용량과 GC 이후 사용량, GC 정지 시간, 프로세스 RSS를 구분한다.",
      "캐시의 hit/miss·eviction 추세와 작업량을 함께 확인한다.",
      "단일 수치만으로 Heap 또는 캐시 증설을 결정하지 않는다."
    ],
    "reference": "Deployment and Maintenance Guide · 성능 최적화 및 JVM 모니터링"
  },
  {
    "id": "index",
    "group": "성능",
    "title": "Index 및 Reindex",
    "keywords": "lucene reindex location index 재색인 검색 누락 mark",
    "summary": "검색 결과와 저장된 데이터가 일치하지 않을 때 확인할 영역입니다.",
    "checks": [
      "누락 데이터의 프로젝트·ID·재현 검색 조건을 기록한다.",
      "인덱스 관련 로그와 현재 작업 상태, 디스크 여유를 확인한다.",
      "Reindex 수행 방식·시간·서비스 영향은 배포 유형 및 2606 문서를 확인한다."
    ],
    "reference": "Deployment and Maintenance Guide · Index and Reindex"
  },
  {
    "id": "cluster",
    "group": "서버",
    "title": "Cluster·Coordinator·Node",
    "keywords": "cluster coordinator node shared data load balancing",
    "summary": "노드별 상태와 공유 구성요소를 확인합니다.",
    "checks": [
      "노드별 버전·서비스 상태·응답·로그를 비교한다.",
      "로드밸런서 및 공유 저장소 등 공통 의존성을 확인한다.",
      "노드 또는 Coordinator 재시작 전 해당 구성의 공식 절차를 확인한다."
    ],
    "reference": "Deployment and Maintenance Guide · Cluster"
  },
  {
    "id": "backup",
    "group": "유지보수",
    "title": "백업·복구·재해복구",
    "keywords": "backup restore recovery RPO RTO repository",
    "summary": "백업 성공 여부와 실제 복구 가능 여부는 구분해야 합니다.",
    "checks": [
      "보존 대상과 복구 시점, 목표 복구 시간을 기록한다.",
      "저장소·DB·첨부파일·설정의 정합성 및 보관 정책을 검토한다.",
      "격리된 검증 환경에서 복원하고 로그인·조회·저장·검색을 점검한다."
    ],
    "reference": "Deployment and Maintenance Guide · 백업 및 복구"
  },
  {
    "id": "upgrade",
    "group": "유지보수",
    "title": "패치·Hotfix·업그레이드",
    "keywords": "patch cumulative update hotfix upgrade rollback 2606",
    "summary": "버전 변경을 통제된 변경 작업으로 관리합니다.",
    "checks": [
      "현재 설치 버전·패치·확장 기능을 기록하고 대상 패키지 및 지원 조건을 확인한다.",
      "검증 환경에서 업데이트·백업·복원 계획과 주요 업무 테스트를 검증한다.",
      "운영 작업 창·중단 공지·승인·롤백 판단 기준을 마련한다."
    ],
    "reference": "Deployment and Maintenance Guide · Updates and maintenance"
  },
  {
    "id": "license",
    "group": "설정",
    "title": "라이선스 관리",
    "keywords": "license SALT named concurrent activation rollover",
    "summary": "라이선스 종류와 서버 구성에 맞추어 확인합니다.",
    "checks": [
      "설치 버전, 라이선스 방식, 만료일, 할당과 사용량을 기록한다.",
      "오류 발생 시 활성화 관련 로그와 라이선스 서버 연결 상태를 확인한다.",
      "갱신 전에 적용 방식과 롤백 절차를 공식 문서에서 확인한다."
    ],
    "reference": "Deployment and Maintenance Guide · Licensing / SALT licensing guide"
  },
  {
    "id": "roles",
    "group": "화면",
    "title": "사용자·Role·Permission",
    "keywords": "user role permissions authz access file 403",
    "summary": "인증 성공과 데이터 접근 권한은 별도로 점검합니다.",
    "checks": [
      "동일 작업의 사용자별·프로젝트별 결과를 비교한다.",
      "그룹·Role·권한 상속 및 대상 객체 범위를 확인한다.",
      "권한 변경 전후 대표 사용자로 허용·거부 시나리오를 검증한다."
    ],
    "reference": "Administrator and User Help · 사용자 및 권한"
  },
  {
    "id": "auth",
    "group": "설정",
    "title": "인증·SSO·LDAP·보안",
    "keywords": "SSO LDAP SAML OIDC TLS SSL login 401 secrets",
    "summary": "로그인 실패는 인증 경로와 애플리케이션 권한을 분리해 진단합니다.",
    "checks": [
      "인증 방식과 실패 시점, 브라우저 응답, 인증 제공자 로그를 확인한다.",
      "인증서 유효성, DNS, 시간 동기화 및 연결 상태를 확인한다.",
      "토큰·비밀번호·세션 식별자는 로그 공유 전에 제거한다."
    ],
    "reference": "Deployment and Maintenance Guide · 인증 및 보안"
  },
  {
    "id": "admin",
    "group": "화면",
    "title": "Administration 및 사용자 화면",
    "keywords": "administration navigation portal settings 화면 메뉴",
    "summary": "관리 범위와 사용자 권한을 구분합니다.",
    "checks": [
      "전역 설정인지 프로젝트 설정인지 먼저 확인한다.",
      "로그인 계정의 관리 권한과 대상 프로젝트를 기록한다.",
      "메뉴 이름과 경로는 2606 Help 및 실제 화면을 대조한다."
    ],
    "reference": "Administrator and User Help · Administration"
  },
  {
    "id": "project",
    "group": "화면",
    "title": "프로젝트·프로젝트 그룹 관리",
    "keywords": "project group template mark unmark project list missing",
    "summary": "프로젝트 생성·조회·설정 문제를 확인합니다.",
    "checks": [
      "프로젝트 ID, 경로, 사용자 권한 및 재현 계정을 기록한다.",
      "저장소와 화면의 표시 결과를 비교한다.",
      "삭제·Mark·Unmark 등 변경 작업은 데이터 영향 및 공식 절차를 확인한다."
    ],
    "reference": "Administrator and User Help · 프로젝트 관리"
  },
  {
    "id": "workitem",
    "group": "화면",
    "title": "Work Item·LiveDoc·LiveReport",
    "keywords": "work item livedoc livereport document preview OLE search",
    "summary": "업무 화면별 저장·검색·렌더링 문제를 분리합니다.",
    "checks": [
      "문제 문서 또는 항목 ID, 브라우저, 사용자, 오류 시점을 기록한다.",
      "다른 사용자·다른 항목에서도 재현되는지 확인한다.",
      "서버 로그, 브라우저 오류, 권한 및 첨부파일 의존성을 함께 확인한다."
    ],
    "reference": "Administrator and User Help · 사용자 가이드"
  },
  {
    "id": "workflow",
    "group": "화면",
    "title": "Workflow·Enumeration·Custom Field",
    "keywords": "workflow enumeration custom field status condition function",
    "summary": "구성 변경은 업무 규칙과 기존 데이터에 영향을 줄 수 있습니다.",
    "checks": [
      "대상 프로젝트·항목 유형·상태 전이·설정 상속을 확인한다.",
      "관련 필드와 워크플로 조건을 테스트 프로젝트에서 검증한다.",
      "변경 전후 대표 작업과 기존 데이터 조회를 비교한다."
    ],
    "reference": "Administrator and User Help · Work Item 및 Document 구성"
  },
  {
    "id": "attachments",
    "group": "서버",
    "title": "Attachment 및 File Storage",
    "keywords": "attachment external storage MIME upload 413 400 preview",
    "summary": "첨부 오류를 요청·권한·저장·렌더링 영역으로 분리합니다.",
    "checks": [
      "파일 크기·유형·대상 객체·발생 시점·HTTP 상태 코드를 기록한다.",
      "서버 및 프록시 로그, 저장 공간, 권한을 확인한다.",
      "저장 위치나 보안 검사를 변경하기 전 공식 구성과 정책을 확인한다."
    ],
    "reference": "Deployment and Maintenance Guide / Administrator and User Help · Attachment"
  },
  {
    "id": "migration",
    "group": "유지보수",
    "title": "Import·Export·데이터 이전",
    "keywords": "import export migration project attachment failed",
    "summary": "데이터 이전은 항목 수와 검증 기준을 정해 수행합니다.",
    "checks": [
      "원본·대상 버전, 이전 단위, 첨부파일, 권한 범위를 기록한다.",
      "검증 환경에서 작은 단위로 이전 및 결과를 확인한다.",
      "실패 시 로그와 실제 반영 범위를 대조하고 중복 실행 전에 정합성을 확인한다."
    ],
    "reference": "Administrator and User Help · Import/Export"
  },
  {
    "id": "api",
    "group": "설정",
    "title": "REST API 및 외부 연동",
    "keywords": "REST API PAT JWT TCSSO 401 403 500 endpoint token",
    "summary": "Polarion REST API는 PAT, JWT, Teamcenter SSO 토큰 인증을 지원합니다. 실제 권한 및 엔드포인트는 공식 개발자 문서에서 확인합니다.",
    "checks": [
      "API 활성화 여부와 호출 URL, 메서드, 응답 코드를 기록한다.",
      "토큰 유효성, API 권한 및 대상 객체 권한을 구분해 확인한다.",
      "재시도 전 변경 요청의 중복 반영 여부를 확인하고 토큰은 공유하지 않는다."
    ],
    "reference": "Siemens 공개 REST API 개발자 문서"
  },
  {
    "id": "jobs",
    "group": "화면",
    "title": "Job·Scheduler·Monitor",
    "keywords": "job scheduler monitor manage jobs job stuck",
    "summary": "예약·실행 작업의 상태와 영향을 확인합니다.",
    "checks": [
      "Job 이름, 시작·종료 시간, 실행 노드와 상태를 기록한다.",
      "작업 로그와 같은 시간대의 시스템 부하를 비교한다.",
      "실행 중 작업의 중지 또는 재실행 전 부작용을 확인한다."
    ],
    "reference": "Administrator and User Help · Monitor / Deployment and Maintenance Guide · 모니터링"
  },
  {
    "id": "logs",
    "group": "성능",
    "title": "로그 및 진단 도구",
    "keywords": "diagtool thread dump JFR txlogger error log diagnostic",
    "summary": "장애 자료를 동일한 시간 범위로 수집합니다.",
    "checks": [
      "타임존, 발생 시각, 사용자 영향, 재현 절차를 기록한다.",
      "애플리케이션·프록시·SVN·DB 로그와 시스템 지표를 보존한다.",
      "진단 수집의 부하와 개인정보·인증 정보 포함 여부를 확인한다."
    ],
    "reference": "Deployment and Maintenance Guide · 진단 / diagtool"
  },
  {
    "id": "incident",
    "group": "성능",
    "title": "장애 대응 및 성능 분석",
    "keywords": "slow CPU 100 memory latency timeout 장애 응답 지연",
    "summary": "원인 단정보다 영향 범위·증거·변경 이력을 우선 확인합니다.",
    "checks": [
      "전체 사용자 또는 특정 사용자·기능·노드에 한정되는지 분류한다.",
      "오류 시점의 CPU·메모리·I/O·로그와 최근 변경을 비교한다.",
      "복구 조치의 승인 및 효과를 기록하고 재발 시 비교할 기준선을 남긴다."
    ],
    "reference": "운영 체크리스트 · 공식 진단 자료는 Support Center"
  },
  {
    "id": "release",
    "group": "유지보수",
    "title": "2606 변경사항 및 해결된 결함",
    "keywords": "release notes resolved issues deprecation removal plan",
    "summary": "2606 공개 릴리스 안내와 실제 설치 패치의 변경사항을 구분합니다.",
    "checks": [
      "현재 버전과 패치 수준을 먼저 확인한다.",
      "공식 해결 결함 목록 및 제거 예정 기능을 대상 버전 기준으로 확인한다.",
      "확장 기능·연동·보안 설정을 검증 환경에서 재검증한다."
    ],
    "reference": "2606 공개 릴리스 안내 / Resolved Issues / Deprecation and Removal Plan"
  },
  {
    "id": "commands",
    "group": "서버",
    "title": "Linux 운영 명령어·체크리스트",
    "keywords": "linux ps top free df iostat journalctl systemctl command",
    "summary": "아래는 일반 Linux 읽기 중심 점검 명령이며 Polarion 전용 절차가 아닙니다.",
    "checks": [
      "uptime / free -h / df -h 로 시스템 상태를 확인한다.",
      "ps -eo pid,comm,%cpu,%mem,rss --sort=-%cpu 로 프로세스 CPU·메모리를 확인한다.",
      "systemctl status <서비스명> 및 journalctl -u <서비스명> 으로 실제 서비스 상태와 로그를 확인한다."
    ],
    "reference": "일반 Linux 명령 · 시스템 매뉴얼 man"
  },
  {
    "id": "integration",
    "group": "설정",
    "title": "외부 제품 연동·SDK·스크립트",
    "keywords": "Teamcenter Simulink Rhapsody Salesforce SDK script",
    "summary": "연동 구성과 확장 기능의 버전 호환성을 관리합니다.",
    "checks": [
      "연동 제품 버전·연결 경로·인증·데이터 소유권을 기록한다.",
      "실패 요청의 ID·응답·재처리 상태를 확인한다.",
      "업데이트 전 확장 기능과 SDK 호환성을 공식 문서에서 검토한다."
    ],
    "reference": "Siemens 공개 개발자 문서 / 제품별 연동 가이드"
  }
]
const guides=[...baseGuides,...extraGuides]
const groups=['전체','서버','설정','화면','성능','유지보수']
const shortcuts=['SVN CPU 100','HTTPD 메모리','Reindex','Access File','Ehcache','Attachment','Cluster','Hotfix','REST API','Import']
const official='https://support.sw.siemens.com/'
const release='https://blogs.sw.siemens.com/polarion/polarion-alm-2606-whats-new-and-noteworthy/'
const developer='https://developer.siemens.com/polarion/overview.html'
const auth='https://developer.siemens.com/polarion/authentication.html'
export default function PolarionOperations({onOld,onDemo}:{onOld:()=>void;onDemo:()=>void}){
 const [query,setQuery]=useState('')
 const [group,setGroup]=useState('전체')
 const [selected,setSelected]=useState('')
 const filtered=useMemo(()=>guides.filter(g=>(group==='전체'||g.group===group)&&query.trim().toLowerCase().split(/\s+/).every(q=>[g.title,g.keywords,g.summary,g.checks.join(' '),g.reference,JSON.stringify(opsDetails[g.id]??{}),JSON.stringify(handbook[g.id]??{})].join(' ').toLowerCase().includes(q))),[query,group])
 const current=filtered.find(g=>g.id===selected)??filtered[0]
 const detail=current?opsDetails[current.id]:undefined
 const book=current?handbook[current.id]:undefined
 return <section className="po-page">
  <nav className="po-nav"><span>SIEMENS ARCHITECT / POLARION 2606</span><button onClick={onOld}>Old · 기존 아키텍처 <ArrowRight size={16}/></button></nav>
  <header className="po-hero"><div><span>OPERATIONS KNOWLEDGE BASE</span><h1>Polarion 2606<br/>운영 기술 가이드</h1><p>서버·화면·환경설정·장애 대응을 검색하고 점검 순서를 확인하세요.</p></div><div className="po-hero-stat"><strong>{guides.length}</strong><span>운영 주제</span><button onClick={onDemo}>화면 체험 <ArrowRight size={16}/></button></div></header>
  <div className="po-notice"><BookOpen size={20}/><div><strong>운영 인수인계 핸드북 · 2606</strong><p>2606 제품 문서에서 검증한 기술 정보, 설정값, 실무 절차 및 운영 검증 항목을 수록했습니다. 기본값과 권고값, 공식 예시와 운영 환경별 값은 구분합니다.</p></div></div>
  <div className="po-search"><Search size={22}/><input id="polarion-ops-search" aria-label="운영 가이드 검색" placeholder="예: SVN, Reindex, 사용자 권한, Hotfix" value={query} onChange={e=>{setQuery(e.target.value);setSelected('')}}/><button onClick={()=>{setQuery('');setGroup('전체');setSelected('')}}>초기화</button></div>
  <div className="po-chips" aria-label="자주 찾는 주제">{shortcuts.map(s=><button key={s} onClick={()=>{setQuery(s);setGroup('전체');setSelected('')}}>{s}</button>)}</div>
  <div className="po-tabs" role="group" aria-label="운영 가이드 분류">{groups.map(g=><button key={g} aria-pressed={g===group} className={g===group?'active':''} onClick={()=>{setGroup(g);setSelected('')}}>{g}</button>)}<small>{filtered.length}개 결과</small></div>
  <div className="po-layout"><aside aria-label="운영 가이드 목록">{filtered.map(g=><button key={g.id} className={current?.id===g.id?'active':''} onClick={()=>setSelected(g.id)}><span>{g.group}</span><strong>{g.title}</strong><ArrowRight size={15}/></button>)}</aside>
  {current?<article key={current.id}><span className="po-label">POLARION 2606 / {current.group}</span><h2>{current.title}</h2><p>{current.summary}</p>{book&&<div className="po-handbook"><div className="po-handbook-ref"><strong>근거 문서</strong><p>{book.ref}</p></div>{book.sections?.map(([title,body])=><section key={title}><h3>{title}</h3><p>{body}</p></section>)}{book.tables?.map(t=><section key={t.title}><h3>{t.title}</h3><div className="po-table-wrap"><table><thead><tr>{t.head.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{t.rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div></section>)}{book.code&&<><h3>명령어 및 설정 예시</h3><pre className="po-code"><code>{book.code}</code></pre></>}{book.verify&&<><h3>완료 및 검증 기준</h3><p className="po-caution">{book.verify}</p></>}</div>}{!book&&detail&&<><h3>기술 설명</h3><p>{detail.body}</p><h3>실무 절차</h3><p>{detail.procedure}</p>{detail.command&&<><h3>설정 및 진단 명령 예시</h3><pre className="po-code"><code>{detail.command}</code></pre></>}<h3>주의 사항</h3><p className="po-caution">{detail.caution}</p></>}{current.checks.length>0&&<><h3>운영 점검 순서</h3><ol>{current.checks.map(c=><li key={c}>{c}</li>)}</ol></>}<h3>공식 문서 찾기</h3><p>{current.reference}</p>{detail&&<p className="po-small">2606 문서 참고 위치: {detail.section}</p>}<div className="po-links">{detail&&<a href={detail.url} target="_blank" rel="noreferrer">해당 기술 참고자료 <ExternalLink size={15}/></a>}<a href={official} target="_blank" rel="noreferrer">Siemens Support Center <ExternalLink size={15}/></a>{current.id==='api'||current.id==='integration'?<><a href={developer} target="_blank" rel="noreferrer">2606 개발자 문서 <ExternalLink size={15}/></a><a href={auth} target="_blank" rel="noreferrer">REST 인증 <ExternalLink size={15}/></a></>:null}{current.id==='release'||current.id==='upgrade'?<a href={release} target="_blank" rel="noreferrer">2606 공개 릴리스 안내 <ExternalLink size={15}/></a>:null}</div><p className="po-small">공식 문서의 기술적 사실을 한국어로 재구성했으며, 일부 진단 명령과 인수인계 체크리스트는 자체 작성한 운영 예시입니다. 실제 변경 시 환경 및 적용 범위를 검증하세요.</p></article>:<article><h2>검색 결과가 없습니다.</h2><p>다른 키워드나 전체 분류로 검색하세요.</p><button onClick={()=>{setQuery('');setGroup('전체')}}><ArrowLeft size={16}/> 전체 보기</button></article>}
  </div><footer className="po-footer"><a href={release} target="_blank" rel="noreferrer">2606 공식 릴리스</a><a href={developer} target="_blank" rel="noreferrer">공식 개발자 문서</a><a href={official} target="_blank" rel="noreferrer">Support Center</a><button onClick={onOld}>Old · 기존 Siemens Architect</button></footer>
 </section>
}
