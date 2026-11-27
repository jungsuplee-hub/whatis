import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Search, ExternalLink, ChevronDown, ChevronRight, Copy, Printer, Link2, ListTree, Layers, Menu, X, AlertTriangle, CheckCircle2 } from 'lucide-react'
import './polarion-operations.css'
import { opsDetails } from './polarion-ops-details'
import { handbook, extraGuides } from './polarion-handbook'
import type { OpsTable } from './polarion-handbook'
import { chapters, runbooks } from './polarion-manual-structure'
import type { Runbook } from './polarion-manual-structure'
import { polarionProcedureDetails } from './operations-procedure-details'
import { ManualVisuals } from './PolarionManualVisuals'
import { diagrams, screenshots, officialVisualLinks } from './polarion-visuals'

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
const allGuides=[...baseGuides,...extraGuides]
const guideMap=new Map(allGuides.map(g=>[g.id,g]))
const guideOrder=chapters.flatMap(c=>c.ids)
const chapterOf=(id:string)=>chapters.find(c=>c.ids.includes(id))
const numberOf=(id:string)=>{const c=chapterOf(id);return c?String(chapters.indexOf(c)+1).padStart(2,'0')+'.'+String(c.ids.indexOf(id)+1).padStart(2,'0'):''}
const chapterAliases:Record<string,string>={start:'service',storage:'service',performance:'service'}
const sectionLabel=(title:string)=>title.replace(/^\d+\.\s*/,'')
const chapterNumber=(id:string)=>String(chapters.findIndex(c=>c.id===id)+1).padStart(2,'0')
const official='https://support.sw.siemens.com/'
const developer='https://developer.siemens.com/polarion/overview.html'
const sources=[
 {id:'deployment',name:'Deployment and Maintenance Guide',desc:'설치 · 사이징 · 시스템 구성 · 성능 · 업데이트 · 복구'},
 {id:'help',name:'Administrator and User Help',desc:'Administration · 프로젝트 · 화면 · 사용자 관리 · 인증 · 스크립트'},
 {id:'properties',name:'Polarion 2606 Config Properties Reference',desc:'시스템 및 고급 구성 속성 · 기본값 · 적용 범위'},
 {id:'rest',name:'REST API User Guide for Polarion',desc:'인증 · 권한 · REST 리소스 · API 시나리오'},
 {id:'diag',name:'diagtool.pdf',desc:'진단 도구 실행 · 옵션 · 결과 · 모듈'},
 {id:'notes',name:'OneNote Polarion 운영 기록',desc:'운영 사례·설정·장애 증상 — 2606 문서 및 공개 기술 문서 대조; 내부 정보 제외'},
]
const quick=[['SVN CPU 100%','svn-cpu'],['HTTPD 메모리','httpd-memory'],['Reindex','index'],['Access File','access'],['Ehcache','ehcache'],['첨부파일 오류','upload-error'],['프로젝트 미표시','project-missing'],['라이선스 갱신','license'],['패치 / 업그레이드','upgrade'],['Cluster 업데이트','updatecluster']]
type Guide=typeof allGuides[number]
type ManualSection={id:string;title:string;body?:string;table?:OpsTable;kind?:'runbook'|'code'|'verify'|'checks'|'related'|'source'|'visuals'}
const normalize=(v:string)=>v.toLocaleLowerCase().replace(/[\u200b-\u200d]/g,'').replace(/[-_./]+/g,' ').replace(/\s+/g,' ').trim()
function getSections(g:Guide):ManualSection[]{
 const b=handbook[g.id],r=runbooks[g.id],d=opsDetails[g.id]
 const result:ManualSection[]=[]
 if(b?.sections?.length)b.sections.forEach(([title,body],i)=>result.push({id:'s'+i,title,body}))
 else if(!b&&d)result.push({id:'s0',title:'기술 설명',body:d.body},{id:'s1',title:'운영 절차',body:d.procedure})
 if(diagrams[g.id]||screenshots[g.id]||officialVisualLinks[g.id])result.splice(Math.min(1,result.length),0,{id:'visuals',title:'구성도 및 화면 참고',kind:'visuals'})
 b?.tables?.forEach((table,i)=>result.push({id:'t'+i,title:table.title,table}))
 if(r)result.push({id:'runbook',title:'상세 운영 방법',kind:'runbook'})
 if(b?.code||(!b&&d?.command))result.push({id:'code',title:'명령어 및 설정 예시',kind:'code',body:b?.code||d?.command})
 if(b?.verify||d?.caution)result.push({id:'verify',title:'완료 및 검증 기준',kind:'verify',body:b?.verify||d?.caution})
 if(g.checks.length&&!r&&!b?.sections?.length&&!d?.procedure)result.push({id:'checks',title:'운영 시 고려할 사항',body:g.checks.join(' ')})
 if(r?.related.length)result.push({id:'related',title:'관련 문서',kind:'related'})
 result.push({id:'source',title:'출처 및 적용 범위',kind:'source'})
 return result
}
function BodyText({body}:{body:string}){
 const numbered=body.split(/(?=\s\d{1,2}\.\s)/).map(v=>v.trim()).filter(Boolean)
 if(numbered.length>=3&&/^1\.\s/.test(numbered[0])&&numbered.every((v,i)=>v.startsWith(String(i+1)+'. ')))return <ol className="pm-inline-steps">{numbered.map((v,i)=><li key={i}>{v.replace(/^\d+\.\s*/,'')}</li>)}</ol>
 const parts=body.split(/(?=\s[①②③④⑤⑥⑦⑧⑨⑩]\s)/).map(v=>v.trim()).filter(Boolean)
 if(parts.length>2){const beginsWithStep=/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(parts[0]);return <>{!beginsWithStep&&<p>{parts[0]}</p>}<ol className="pm-inline-steps">{(beginsWithStep?parts:parts.slice(1)).map((p,i)=><li key={i}>{p.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/,'')}</li>)}</ol></>}
 const sent=body.split(/(?<=다\.)\s+(?=[가-힣A-Z0-9])/).filter(Boolean)
 if(body.length>230&&sent.length>3){const chunks:string[]=[];for(let i=0;i<sent.length;i+=2)chunks.push(sent.slice(i,i+2).join(' '));return <>{chunks.map((s,i)=><p key={i}>{s}</p>)}</>}
 return <p>{body}</p>
}
function CodeBlock({code}:{code:string}){
 const [status,setStatus]=useState('')
 const copy=async()=>{try{await navigator.clipboard.writeText(code);setStatus('복사 완료')}catch{setStatus('복사 실패 · 직접 선택하세요')}}
 return <div className="pm-code-block"><div><span>설정 / 명령 예시 · 실행 대상과 권한 확인</span><button type="button" onClick={copy}><Copy size={15}/>{status||'복사'}</button></div><pre><code>{code}</code></pre></div>
}
function DataTable({table,printing=false}:{table:OpsTable;printing?:boolean}){
 const [q,setQ]=useState('')
 const [all,setAll]=useState(false)
 const rows=table.rows.filter(r=>!q.trim()||normalize(r.join(' ')).includes(normalize(q)))
 const truncated=table.rows.length>24&&!all&&!q.trim()&&!printing
 return <div className="pm-table-card">{table.rows.length>15&&!printing&&<div className="pm-table-toolbar"><Search size={15}/><input aria-label={table.title+' 표 검색'} placeholder="이 표에서 설정명·값 검색" value={q} onChange={e=>setQ(e.target.value)}/><span>{rows.length}개</span></div>}<div className="pm-table-scroll"><table><thead><tr>{table.head.map((v,i)=><th key={i} scope="col">{v}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i} className={truncated&&i>=20?'pm-row-collapsed':undefined}>{r.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>{!rows.length&&<p className="pm-empty">일치하는 값이 없습니다.</p>}{table.rows.length>24&&!q.trim()&&!printing&&<button className="pm-table-more" onClick={()=>setAll(v=>!v)}>{all?'처음 20개만 보기':'전체 '+rows.length+'개 보기'}<ChevronDown size={15}/></button>}</div>
}
function RunbookPanel({id,run}:{id:string;run:Runbook}){
 const extra=polarionProcedureDetails[id]||[]
 return <div className="pm-runbook pm-procedure"><div className="pm-run-header"><div><span>작업 유형</span><strong>{run.type}</strong></div><div><span>적용 범위</span><strong>{run.scope}</strong></div><div><span>서비스 영향</span><strong>{run.impact}</strong></div></div>
 <h4>작업을 시작하기 전에</h4><div className="pm-procedure-pre">{run.pre.map((t,i)=><p key={i}>{t}</p>)}</div>
 <h4>작업의 목적과 실제 진행 방법</h4>{extra.map((body,i)=><div className="pm-procedure-explain" key={i}><h5>{['먼저 확인해야 하는 이유','어디에서 어떻게 확인하는가','결과 해석과 후속 조치'][i]||'추가 설명'}</h5><p>{body}</p></div>)}
 <h4>실행 순서</h4><ol className="pm-steps">{run.steps.map(([title,body],i)=><li key={i}><span className="pm-step-number">{String(i+1).padStart(2,'0')}</span><div><strong>{title}</strong><BodyText body={body}/></div></li>)}</ol><div className="pm-warning"><AlertTriangle size={19}/><div><strong>실패 시 대응 / 원복 판단</strong><p>{run.rollback}</p></div></div></div>
}
function ArticleBody({g,onNavigate,printing=false}:{g:Guide;onNavigate:(id:string)=>void;printing?:boolean}){
 const sections=getSections(g),run=runbooks[g.id],book=handbook[g.id]
 return <div className="pm-body">{sections.map((s,i)=><section key={s.id} className="pm-section" id={g.id+'-'+s.id}><h3><span>{numberOf(g.id)}.{i+1}</span>{s.title}</h3>{s.kind==='visuals'?<ManualVisuals id={g.id} printing={printing}/>:s.table?<DataTable table={s.table} printing={printing}/>:s.kind==='runbook'&&run?<RunbookPanel id={g.id} run={run}/>:s.kind==='code'?<CodeBlock code={s.body||''}/>:s.kind==='verify'?<div className="pm-verify"><CheckCircle2 size={20}/><BodyText body={s.body||''}/></div>:s.kind==='related'?<div className="pm-related">{run?.related.map(id=><button key={id} onClick={()=>onNavigate(id)}>{numberOf(id)} {guideMap.get(id)?.title}<ArrowRight size={15}/></button>)}</div>:s.kind==='source'?<div className="pm-source"><strong>{book?.ref||g.reference}</strong><p>기준 버전: Polarion 2606 · 공식 문서의 기술 정보와 자체 정리한 운영 방법를 구분해 정리했습니다. 운영 서버별 값은 별도 환경 대장과 검증 기록을 기준으로 확정합니다.</p>{!printing&&<div><a href={official} target="_blank" rel="noreferrer">Siemens Support Center <ExternalLink size={13}/></a>{book?.links?.map((url,i)=><a key={url} href={url} target="_blank" rel="noreferrer">외부 공식 기술 근거 {i+1} <ExternalLink size={13}/></a>)}{(g.id==='api'||g.id==='integration'||g.id==='script')&&<a href={developer} target="_blank" rel="noreferrer">Polarion Developer Portal <ExternalLink size={13}/></a>}</div>}</div>:s.body?<BodyText body={s.body}/>:null}</section>)}</div>
}
function GuideHeader({g}:{g:Guide}){
 const r=runbooks[g.id],c=chapterOf(g.id)
 return <><div className="pm-breadcrumb"><span>Polarion 2606</span><ChevronRight size={13}/><span>{c?.title}</span></div><div className="pm-article-kicker"><span>SECTION {numberOf(g.id)}</span><span>{r?.type||'기술 참고'}</span></div><h1>{g.title}</h1><p className="pm-lead">{g.summary}</p><div className="pm-meta"><span><BookOpen size={15}/>2606 기준</span><span><Layers size={15}/>{r?.scope||g.group+' 운영'}</span><span>{getSections(g).length}개 절</span></div></>
}
export default function PolarionOperations({onOld,onDemo,documentId,onNavigate}:{onOld:()=>void;onDemo:()=>void;documentId?:string;onNavigate:(id?:string)=>void}){
 const [query,setQuery]=useState('')
 const [mobileOpen,setMobileOpen]=useState(false)
 const current=documentId?guideMap.get(documentId):undefined
 const requestedChapter=documentId?.startsWith('chapter-')?documentId.slice(8):undefined
 const chapter=chapters.find(c=>c.id===(requestedChapter?chapterAliases[requestedChapter]||requestedChapter:undefined))
 const activeChapter=current?chapterOf(current.id):chapter
 const [expanded,setExpanded]=useState<string[]>(()=>activeChapter?[activeChapter.id]:['infra'])
 const [copyStatus,setCopyStatus]=useState('')
 const [tocOpen,setTocOpen]=useState(false)
 const [searchScope,setSearchScope]=useState('all')
 const inputRef=useRef<HTMLInputElement>(null)
 useEffect(()=>{if(activeChapter)setExpanded(old=>old.includes(activeChapter.id)?old:[...old,activeChapter.id]);setMobileOpen(false);setTocOpen(false);setCopyStatus('')},[documentId,activeChapter?.id])
 const go=(id?:string)=>{setQuery('');setSearchScope('all');onNavigate(id);setMobileOpen(false);setTocOpen(false)}
 const searchable=useMemo(()=>allGuides.map(g=>{
  const ss=getSections(g);const r=runbooks[g.id];return {g,ss,hay:normalize([g.title,g.keywords,g.summary,g.reference,JSON.stringify(handbook[g.id]||{}),JSON.stringify(r||{}),JSON.stringify(polarionProcedureDetails[g.id]||[]),JSON.stringify(diagrams[g.id]||[]),JSON.stringify(screenshots[g.id]||[]),chapterOf(g.id)?.title].join(' '))}
 }),[])
 const results=useMemo(()=>{const tokens=normalize(query).split(' ').filter(Boolean);if(!tokens.length)return [];return searchable.filter(x=>(searchScope==='all'||chapterOf(x.g.id)?.id===searchScope)&&tokens.every(t=>x.hay.includes(t))).map(x=>({...x,rank:tokens.reduce((sum,t)=>sum+(normalize(x.g.title).includes(t)?8:0)+(normalize(x.g.keywords).includes(t)?4:0),0)})).sort((a,b)=>b.rank-a.rank||guideOrder.indexOf(a.g.id)-guideOrder.indexOf(b.g.id))},[query,searchScope,searchable])
 const toggleChapter=(id:string)=>setExpanded(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])
 const jump=(id:string)=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'smooth'})
 const copyLink=async()=>{try{await navigator.clipboard.writeText(window.location.href);setCopyStatus('링크 복사됨')}catch{setCopyStatus('주소창에서 링크를 복사하세요')}}
 const idx=current?guideOrder.indexOf(current.id):-1
 const allPrint=documentId==='print'
 const toc=current?getSections(current):[]
 const searching=query.trim().length>0
 const isHome=!current&&!chapter&&!allPrint
 const sourceCount=Object.keys(handbook).length
 return <section className="pm-page">
  <nav className="pm-topbar"><button className="pm-brand" onClick={()=>go()}><BookOpen size={21}/><span><strong>POLARION 2606</strong><small>OPERATIONS HANDBOOK</small></span></button><div className="pm-top-links"><button onClick={()=>go('print')}><Printer size={16}/>전체 문서</button><button onClick={onDemo}>화면 체험<ArrowUpRight size={14}/></button><button onClick={onOld}>Old <ArrowUpRight size={14}/></button></div></nav>
  <div className="pm-search-bar"><Search size={21}/><input ref={inputRef} id="polarion-ops-search" aria-label="전체 운영 문서 검색" placeholder="증상, 설정명, 메뉴, 오류 코드 검색 (예: maxPoolSize, Access File)" value={query} onChange={e=>{setQuery(e.target.value);setSearchScope('all')}} onKeyDown={e=>{if(e.key==='Enter'&&results[0])go(results[0].g.id);if(e.key==='Escape')setQuery('')}}/>{query&&<button onClick={()=>setQuery('')} aria-label="검색 초기화"><X size={17}/></button>}<span className="pm-search-hint">{allGuides.length}개 문서</span></div>
  <nav className="pm-notebook-tabs" aria-label="OneNote 방식 섹션"><button className={isHome&&!searching?'active':''} onClick={()=>go()}>전체 개요</button>{chapters.map((c,i)=><button key={c.id} className={activeChapter?.id===c.id&&!searching?'active':''} style={{'--section-color':['#367d85','#68839a','#4c8c68','#7864a3','#a07949','#a85e54','#47848c','#627996','#8a789d','#647e60','#82878a'][i]} as React.CSSProperties} onClick={()=>go('chapter-'+c.id)}>{c.title}</button>)}</nav>
  <button className="pm-mobile-nav" aria-expanded={mobileOpen} onClick={()=>setMobileOpen(v=>!v)}><Menu size={18}/>매뉴얼 목차<ChevronDown size={17}/></button>
  <div className={'pm-layout'+(current&&!searching?' pm-has-article':'')+(allPrint&&!searching?' pm-print-layout':'')}>
  <aside className={'pm-sidebar'+(mobileOpen?' pm-sidebar-open':'')} aria-label="섹션별 목차">
    <div className="pm-side-head"><span>섹션 / 페이지</span><button onClick={()=>setExpanded(expanded.length===chapters.length?[]:chapters.map(c=>c.id))}>{expanded.length===chapters.length?'모두 접기':'모두 펼치기'}</button></div>
    <button className={'pm-home-link'+(isHome&&!searching?' active':'')} onClick={()=>go()}><BookOpen size={16}/>핸드북 개요</button>
    {chapters.map(c=>{const open=expanded.includes(c.id),active=activeChapter?.id===c.id;return <div key={c.id} className={'pm-chapter-nav'+(active?' pm-active-chapter':'')}><div className="pm-chapter-row"><button onClick={()=>go('chapter-'+c.id)} className={'pm-chapter-link'+(chapter?.id===c.id&&!searching?' active':'')}><span>{chapterNumber(c.id)}</span><strong>{sectionLabel(c.title)}</strong></button><button className="pm-expand" aria-label={c.title+(open?' 접기':' 펼치기')} aria-expanded={open} onClick={()=>toggleChapter(c.id)}><ChevronDown size={16} className={open?'rotated':''}/></button></div>{open&&<div className="pm-chapter-items">{c.groups.map(gr=><div className="pm-note-group" key={gr.title}><div className="pm-note-group-label">{gr.title}</div>{gr.ids.map(id=><button key={id} className={current?.id===id&&!searching?'active':''} aria-current={current?.id===id&&!searching?'page':undefined} onClick={()=>go(id)}><span>{numberOf(id)}</span><strong>{guideMap.get(id)?.title}</strong></button>)}</div>)}</div>}</div>})}
    <div className="pm-side-foot"><span>문서 기준: 2606</span><span>운영 지식베이스 · {sourceCount}개 상세 문서</span></div>
  </aside>
  <div className="pm-content">
   {searching?<div className="pm-search-results"><div className="pm-article-kicker">DOCUMENT SEARCH</div><h1>검색 결과</h1><p className="pm-lead">“{query}” · {results.length}개 문서</p><label className="pm-scope">검색 범위<select value={searchScope} onChange={e=>setSearchScope(e.target.value)}><option value="all">전체 섹션</option>{chapters.map(c=><option key={c.id} value={c.id}>{chapterNumber(c.id)}. {sectionLabel(c.title)}</option>)}</select></label>{results.length?results.map(({g,ss})=>{const tokens=normalize(query).split(' ').filter(Boolean);const match=ss.find(s=>tokens.some(t=>normalize(s.title+' '+(s.body||'')+' '+JSON.stringify(s.table||{})).includes(t)));return <button className="pm-result" key={g.id} onClick={()=>go(g.id)}><div><span>{numberOf(g.id)} · {chapterOf(g.id)?.title}</span><strong>{g.title}</strong><p>{match?(match.title+(match.body?' — '+match.body.slice(0,130)+(match.body.length>130?'…':''):'')):g.summary}</p></div><ArrowRight size={17}/></button>}):<div className="pm-empty"><p>일치하는 문서가 없습니다. 다른 키워드로 검색하거나 검색 범위를 변경하세요.</p><button onClick={()=>setQuery('')}>목차로 돌아가기</button></div>}</div>
    :allPrint?<div className="pm-full"><div className="pm-article-kicker">COMPLETE MANUAL</div><h1>Polarion 2606 운영 인수인계 핸드북</h1><p className="pm-lead">전체 장 · {allGuides.length}개 문서를 한 페이지에서 읽고 인쇄할 수 있습니다.</p><button className="pm-action" onClick={()=>window.print()}><Printer size={17}/>인쇄 / PDF 저장</button>{chapters.map(c=><section key={c.id} className="pm-print-chapter"><h2>{chapterNumber(c.id)}. {c.title}</h2>{c.ids.map(id=>{const g=guideMap.get(id)!;return <article key={id} className="pm-print-article"><GuideHeader g={g}/><ArticleBody g={g} onNavigate={go} printing/></article>})}</section>)}</div>
    :current?<article className="pm-document" key={current.id}><GuideHeader g={current}/><div className="pm-document-actions"><button onClick={copyLink}><Link2 size={15}/>{copyStatus||'문서 링크 복사'}</button><button onClick={()=>window.print()}><Printer size={15}/>인쇄 / PDF</button><button onClick={()=>go('chapter-'+activeChapter?.id)}><ListTree size={15}/>섹션 목차</button></div><div className="pm-inline-toc"><button aria-expanded={tocOpen} onClick={()=>setTocOpen(v=>!v)}><ListTree size={17}/>이 문서의 절<ChevronDown size={15}/></button>{tocOpen&&toc.map((s,i)=><button key={s.id} onClick={()=>jump(current.id+'-'+s.id)}>{i+1}. {s.title}</button>)}</div><ArticleBody g={current} onNavigate={go}/><div className="pm-pager">{idx>0?<button onClick={()=>go(guideOrder[idx-1])}><ArrowLeft size={18}/><div><small>이전 문서</small><strong>{numberOf(guideOrder[idx-1])} {guideMap.get(guideOrder[idx-1])?.title}</strong></div></button>:<span/>}{idx<guideOrder.length-1?<button onClick={()=>go(guideOrder[idx+1])}><div><small>다음 문서</small><strong>{numberOf(guideOrder[idx+1])} {guideMap.get(guideOrder[idx+1])?.title}</strong></div><ArrowRight size={18}/></button>:<span/>}</div></article>
    :chapter?<div className="pm-chapter-page"><div className="pm-breadcrumb"><button onClick={()=>go()}>핸드북 개요</button><ChevronRight size={14}/>Chapter {chapterNumber(chapter.id)}</div><div className="pm-article-kicker">{chapter.en.toUpperCase()} · CHAPTER {chapterNumber(chapter.id)}</div><h1>{chapter.title}</h1><p className="pm-lead">{chapter.intro}</p><h2>섹션의 페이지 목록</h2>{chapter.groups.map((gr,i)=><section className="pm-note-page-group" key={gr.title}><h3><span>{String(i+1).padStart(2,'0')}</span>{gr.title}</h3>{gr.ids.map(id=>{const g=guideMap.get(id)!;return <button key={id} className="pm-chapter-article" onClick={()=>go(id)}><span>{numberOf(id)}</span><div><strong>{g.title}</strong><p>{g.summary}</p><small>{runbooks[id]?'상세 운영 방법 · ':''}{getSections(g).length}개 절</small></div><ArrowRight size={19}/></button>})}</section>)}<button className="pm-action" onClick={()=>go(chapter.ids[0])}>첫 문서 읽기 <ArrowRight size={17}/></button></div>
    :<div className="pm-overview"><header className="pm-cover"><div className="pm-cover-eyebrow">TECHNICAL OPERATIONS MANUAL <span>ON-PREMISE / 2606</span></div><h1>Polarion 2606<br/>운영 인수인계 핸드북</h1><p>Architecture · 설치관련 · 운영관련 · 개발관련 · Configuration · Trouble Shooting · Extensions 등 주제별 섹션과 하위 페이지로 구성한 운영 매뉴얼입니다.</p><div className="pm-cover-meta"><div><strong>{chapters.length}</strong><span>섹션</span></div><div><strong>{allGuides.length}</strong><span>상세 문서</span></div><div><strong>{Object.keys(runbooks).length}</strong><span>상세 작업 설명</span></div><div><strong>{handbook.properties.tables?.[0].rows.length}</strong><span>주요 설정</span></div></div><button className="pm-cover-button" onClick={()=>go('handover')}>인수인계 시작 <ArrowRight size={17}/></button></header><div className="pm-read-first"><div><span>01 / FIRST DAY</span><h2>처음 인수받는다면</h2><p>환경 대장, 서비스 구성도, 설정·로그 경로를 확인하고 일상 점검과 복구 절차를 익힙니다.</p><button onClick={()=>go('handover')}>환경 인수인계 기준<ArrowRight size={15}/></button></div><div><span>02 / INCIDENT</span><h2>장애가 발생했다면</h2><p>시간과 영향 범위를 기록하고 실제 요청, 시스템 지표, 로그를 비교하여 병목을 분리합니다.</p><button onClick={()=>go('incident')}>장애 대응 절차<ArrowRight size={15}/></button></div></div><section className="pm-quick-section"><h2>자주 찾는 운영 문제</h2><div className="pm-quick">{quick.map(([label,id])=><button key={id} onClick={()=>go(id)}>{label}<ArrowUpRight size={14}/></button>)}</div></section><section className="pm-contents"><div className="pm-section-header"><h2>전체 섹션 구성</h2><span>DOCUMENT INDEX</span></div>{chapters.map(c=><button className="pm-chapter-card" key={c.id} onClick={()=>go('chapter-'+c.id)}><span className="pm-chapter-number">{chapterNumber(c.id)}</span><div><span>{c.en}</span><strong>{sectionLabel(c.title)}</strong><p>{c.intro}</p></div><div className="pm-chapter-count">{c.ids.length}개 문서<ArrowRight size={18}/></div></button>)}</section><section className="pm-sources-home"><h2>기준 문서 및 범위</h2><p>기술 내용은 Google Drive의 2606 공식 문서를 기준으로 검증한 사실을 한국어로 재구성했습니다. 문서별 출처·페이지를 본문에 표시하고 운영 예시와 환경별 설정을 구분합니다. 공식 전체 매뉴얼을 그대로 대체하는 자료는 아닙니다. 구성도는 직접 제작한 설명용 도식이며, 화면 이미지는 WhatIs 학습용 시뮬레이션과 공식 원본 링크로 구분합니다.</p>{sources.map(s=><div key={s.id}><BookOpen size={17}/><span><strong>{s.name}</strong><small>{s.desc}</small></span></div>)}<a href={official} target="_blank" rel="noreferrer">Siemens Support Center <ExternalLink size={13}/></a></section></div>}
  </div>
  {current&&!searching&&<aside className="pm-toc" aria-label="본문 목차"><span>이 문서에서</span>{toc.map((s,i)=><button key={s.id} onClick={()=>jump(current.id+'-'+s.id)}><small>{String(i+1).padStart(2,'0')}</small>{s.title}</button>)}<button className="pm-top-jump" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>맨 위로 ↑</button></aside>}
  </div><footer className="pm-footer"><span>Polarion 2606 · Operations Handover</span><a href={official} target="_blank" rel="noreferrer">Siemens Support Center</a><button onClick={()=>go()}>핸드북 개요</button></footer>
 </section>
}
