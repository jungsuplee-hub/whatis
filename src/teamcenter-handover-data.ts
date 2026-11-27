export const handover = [
  {
    "id": "start",
    "group": "01 인수인계",
    "title": "운영 환경 인벤토리",
    "summary": "인수받은 시스템에서 무엇이 어디에서 실행되는지 먼저 정리한다.",
    "beginner": "시스템을 이해하지 않고 서비스 재시작이나 설정 변경부터 하면 장애 범위가 커질 수 있다.",
    "steps": [
      "제품 버전·패치·배포 도구(DC/TEM)·OS·DB·AW 버전 및 지원 매트릭스를 대조한다.",
      "웹/Gateway, Enterprise, DB, FMS, Indexer, Dispatcher, License 및 선택 서비스의 실제 역할과 연결을 그림으로 기록한다.",
      "DEV/STG/PRD별 담당자, 서비스 계정 관리 위치, 변경 승인 절차, 백업 및 복구 목표를 별도 접근제어 문서에 기록한다."
    ],
    "verify": "실제 접속·로그인·검색·파일 조회·승인 흐름을 테스트하고 기준 결과를 남긴다.",
    "source": "Teamcenter Deployment Reference Architecture 2606, p.27; OneNote · 아키텍처 설명 / Configuration (주제 분류)",
    "next": "architecture"
  },
  {
    "id": "architecture",
    "group": "02 아키텍처",
    "title": "2-tier / 4-tier와 서비스 흐름",
    "summary": "클라이언트, 웹 계층, Enterprise 계층, DB와 파일 계층의 역할을 분리한다.",
    "beginner": "4-tier에서 웹 요청이 정상이라고 해서 DB나 파일 서버까지 정상이라는 뜻은 아니다.",
    "steps": [
      "Rich Client 2-tier와 4-tier 및 Active Workspace의 접속 경로를 구별한다.",
      "Gateway/Web tier에서 요청을 받고 Server Manager가 관리하는 tcserver에서 비즈니스 로직을 처리하는 구조를 확인한다.",
      "DB 메타데이터와 FMS 파일 전송 경로를 구분하고 각 연결의 TLS·방화벽·로드밸런서 구성을 확인한다."
    ],
    "verify": "사용자 요청별 실제 경로와 장애 영향 범위를 설명할 수 있어야 한다.",
    "source": "Teamcenter Deployment Reference Architecture 2606, p.27; OneNote · Teamcenter Four Tier Architect (이미지 목차)",
    "next": "pool"
  },
  {
    "id": "pool",
    "group": "02 아키텍처",
    "title": "Pool Manager / Server Manager / MUX",
    "summary": "서버 프로세스 할당 및 웹 계층 연결을 점검한다.",
    "beginner": "프로세스가 살아 있어도 사용 가능한 tcserver가 부족하거나 연결이 실패할 수 있다.",
    "steps": [
      "현재 할당·유휴 프로세스 및 대기 요청을 관찰한다.",
      "웹 계층과 Server Manager의 통신 오류, tcserver 기동 실패, DB·라이선스 연결을 같은 시각의 로그에서 확인한다.",
      "풀 크기 변경 전 프로세스별 메모리와 동시 사용자 부하를 측정한다."
    ],
    "verify": "테스트 계정 로그인과 동시 요청을 재현해 오류율·대기시간을 비교한다.",
    "source": "OneNote · Pool Manager / Server Manager / Mux (주제); Teamcenter Deployment Reference Architecture 2606",
    "next": "gateway"
  },
  {
    "id": "gateway",
    "group": "02 아키텍처",
    "title": "Active Workspace Gateway / Microservices",
    "summary": "AW 요청 경로와 웹 화면에 필요한 서비스의 의존성을 파악한다.",
    "beginner": "AW 화면이 열려도 특정 API나 파일 임시 저장 서비스가 실패할 수 있다.",
    "steps": [
      "브라우저 개발자 도구에서 실패 URL·HTTP 상태·발생 시각을 확인한다.",
      "Gateway, Web tier 및 TcGQL, File Repository의 상태를 점검한다.",
      "사용 기능별 추가 Microservice의 배포 여부와 버전, 인증서, 서비스 등록 정보를 대조한다."
    ],
    "verify": "로그인, 객체 조회, 파일 미리보기와 실제 사용 모듈을 각각 검증한다.",
    "source": "Teamcenter Installation Using Deployment Center 2606, p.13; OneNote · AW gateway architecture (이미지 목차)",
    "next": "fms"
  },
  {
    "id": "fms",
    "group": "02 아키텍처",
    "title": "FMS / FSC / FCC / Volume",
    "summary": "파일 전송 문제와 객체 메타데이터 문제를 분리한다.",
    "beginner": "Teamcenter 객체가 조회되더라도 실제 파일 다운로드가 실패할 수 있다.",
    "steps": [
      "클라이언트 캐시(FCC), 서버 캐시(FSC), 실제 Volume의 경로와 역할을 확인한다.",
      "실패하는 파일의 Dataset·Named Reference·Volume 및 파일 전송 경로를 식별한다.",
      "FSC 연결, 파일 저장소 용량·권한, 캐시 로그와 티켓 오류를 확인한다."
    ],
    "verify": "소형·대형 파일 각각 업로드 후 다운로드하고 파일 내용과 크기를 검증한다.",
    "source": "OneNote · FMS 관련 설정 / FSC proxy error (현장 사례); Teamcenter Deployment Reference Architecture 2606, p.27",
    "next": "dispatcher"
  },
  {
    "id": "dispatcher",
    "group": "02 아키텍처",
    "title": "Dispatcher / Scheduler / Module / Client",
    "summary": "파일 변환과 후처리 요청의 각 단계를 확인한다.",
    "beginner": "변환 요청이 등록되어도 스케줄러 배정이나 실행 모듈, 결과 등록이 실패할 수 있다.",
    "steps": [
      "요청 ID, 상태, Translator, 입력 파일, 큐 대기 시간, 실행 시간을 확인한다.",
      "Scheduler의 배정, Module의 변환 실행, Client의 결과 반영을 구별하고 각각의 로그를 조사한다.",
      "실패 파일과 정상 파일을 비교하고 재처리 전에 중복 결과와 원본 보존 여부를 확인한다."
    ],
    "verify": "테스트 변환 요청이 완료되고 결과 Dataset이 연결되는지 확인한다.",
    "source": "OneNote · Dispatcher 아키텍처 / Dispatcher Client·Module·Schedule Detail (주제)",
    "next": "index"
  },
  {
    "id": "index",
    "group": "02 아키텍처",
    "title": "TcFTSIndexer / Solr / ZooKeeper",
    "summary": "저장된 객체와 검색용 인덱스가 일치하는지 점검한다.",
    "beginner": "객체는 존재하지만 인덱스 반영이 늦으면 AW 검색에 나오지 않을 수 있다.",
    "steps": [
      "객체 ID로 직접 조회한 결과와 AW 검색 결과를 비교한다.",
      "Indexer 로그, 실행 흐름, Solr 상태·용량, 사용하는 경우 ZooKeeper 연결을 확인한다.",
      "객체 속성 색인과 구조 색인, 파일 내용 색인을 구별한다."
    ],
    "verify": "변경한 테스트 객체가 예상 시간 안에 검색되고 권한 정책이 유지되는지 확인한다.",
    "source": "OneNote · runTcFTSIndexer 관련 명령 / IDX 서버 / Solr·Zookeeper (주제)",
    "next": "install"
  },
  {
    "id": "install",
    "group": "03 설치·업그레이드",
    "title": "지원 매트릭스 / 사전 준비",
    "summary": "지원되는 조합을 확정하고 설치 전 환경을 준비한다.",
    "beginner": "설치 성공 여부뿐 아니라 운영 지원 가능성과 구성요소 호환성이 중요하다.",
    "steps": [
      "목표 Teamcenter 버전의 Platform Matrix에서 OS, DB, Java, Node.js 및 연동 제품 조합을 확인한다.",
      "공식 설치 미디어와 License Server, DNS, 인증서, 저장공간, 서비스 계정 및 방화벽을 준비한다.",
      "설치 환경의 초기 상태와 복구 계획을 문서화한다."
    ],
    "verify": "필수 의존성이 모두 준비되고 라이선스 및 네트워크 연결 테스트가 성공해야 한다.",
    "source": "Teamcenter Installation Using Deployment Center 2606, p.8; OneNote · PlatformMatrix (주제)",
    "next": "dc"
  },
  {
    "id": "dc",
    "group": "03 설치·업그레이드",
    "title": "Deployment Center / TEM",
    "summary": "배포 도구와 버전에 맞는 설치·변경 절차를 선택한다.",
    "beginner": "DC에서 선택한 애플리케이션과 실제 대상 서버에 배포되는 구성요소를 구분해야 한다.",
    "steps": [
      "현재 환경을 등록하고 제품 미디어·대상 호스트·애플리케이션·컴포넌트 구성을 확인한다.",
      "설정 입력과 의존성 검증 후 생성된 설치 스크립트를 검토하고 승인된 환경에서 수행한다.",
      "TEM 기반 기존 환경에는 해당 버전의 유지보수 절차를 적용하고 DC 절차와 혼용하지 않는다."
    ],
    "verify": "배포 상태, 설치 로그, 서비스 및 대표 기능을 확인하고 실제 구성 스냅샷을 보관한다.",
    "source": "Teamcenter Installation Using Deployment Center 2606; Google Drive · Teamcenter Applications and Components in Deployment Center (2606 HTML)",
    "next": "upgrade"
  },
  {
    "id": "upgrade",
    "group": "03 설치·업그레이드",
    "title": "패치 / 업그레이드 / 롤백",
    "summary": "버전 변경을 데이터 모델과 연동 시스템 변경까지 포함해 계획한다.",
    "beginner": "바이너리만 되돌려도 DB 모델이 바뀌었다면 이전 상태로 복구되지 않을 수 있다.",
    "steps": [
      "출발·목표 버전의 지원되는 업그레이드 경로 및 중간 단계, 패치 호환성을 확인한다.",
      "BMIDE, 사용자 정의 라이브러리, AW, Dispatcher, CAD 및 연동을 테스트 환경에서 검증한다.",
      "DB·Volume·설정의 정합 백업과 복구 리허설, 중단 시간 및 롤백 결정 시점을 합의한다."
    ],
    "verify": "업그레이드 후 데이터·검색·파일·워크플로·연동 및 성능을 이전 기준과 대조한다.",
    "source": "OneNote · Teamcenter 별 업그레이드 가능여부 확인 (주제); Google Drive · Teamcenter Upgrade Using TEM / Teamcenter Update Using Deployment Center (참고 문서명)",
    "next": "sizing"
  },
  {
    "id": "sizing",
    "group": "04 운영·성능",
    "title": "사이징 / 용량 / 모니터링",
    "summary": "동시 사용자와 실제 처리량을 기준으로 서버 자원을 평가한다.",
    "beginner": "CPU 사용률 하나만으로 증설을 결정하지 않는다.",
    "steps": [
      "동시 세션, BOM 규모, 파일 전송량, 변환량, 색인량 및 데이터 증가율을 수집한다.",
      "CPU, 메모리, DB 대기, 디스크 I/O, 네트워크, 큐 및 요청 응답시간의 기준선을 만든다.",
      "부하 발생 계층을 특정하고 공식 사이징 자료와 시험 결과로 변경안을 평가한다."
    ],
    "verify": "변경 전후 같은 작업량에서 p95 응답시간, 오류율, 큐 지연을 비교한다.",
    "source": "OneNote · Server Sizing / Performance Optimization (주제); Teamcenter Deployment Reference Architecture 2606, p.27",
    "next": "service"
  },
  {
    "id": "service",
    "group": "04 운영·성능",
    "title": "서비스 기동·종료 / 헬스체크",
    "summary": "실제 배포의 의존성과 유지보수 정책에 맞춰 작업한다.",
    "beginner": "공통 기동 순서를 모든 환경에 동일하게 적용하지 않는다.",
    "steps": [
      "변경 창과 사용자 공지, 실행 중인 작업·변환·색인 상태를 확인한다.",
      "서비스 관리자 또는 배포 도구에 등록된 실제 서비스 이름과 의존성을 확인한다.",
      "DB·파일·인증 등 기반 의존성 정상 여부를 확인하며 해당 구성의 승인된 순서를 따른다."
    ],
    "verify": "로그인, 검색, 파일 다운로드·업로드, 변환·승인과 모니터링 상태를 확인한다.",
    "source": "OneNote · 서비스 기동관련 (주제); Teamcenter Deployment Reference Architecture 2606",
    "next": "logs"
  },
  {
    "id": "logs",
    "group": "04 운영·성능",
    "title": "로그 위치와 증거 수집",
    "summary": "요청이 어느 구성요소에서 실패했는지 시간 순으로 추적한다.",
    "beginner": "운영 환경에 따라 로그 위치와 파일명은 다르므로 경로를 단정하지 않는다.",
    "steps": [
      "사용자·요청 ID·시간대·오류 코드·재현 단계를 기록하고 관련 서버 로그의 시간을 맞춘다.",
      "Windows 임시 폴더 및 Linux 서비스 환경의 로그 위치를 서비스 설정에서 확인한다.",
      "Gateway/Web, tcserver syslog, FMS, Indexer, Dispatcher 및 배포 로그를 증상에 따라 선택한다."
    ],
    "verify": "최초 오류와 후속 오류를 분리하고 인증정보·개인정보를 제거한 증거를 보관한다.",
    "source": "OneNote · Teamcenter Log 위치 / 배포 로그 / teamcenter syslog 설정",
    "next": "backup"
  },
  {
    "id": "backup",
    "group": "04 운영·성능",
    "title": "백업 / 복구 / DR",
    "summary": "DB와 실제 파일 저장소를 동일한 복구 기준으로 관리한다.",
    "beginner": "메타데이터와 파일의 복구 시점이 다르면 파일 참조가 일치하지 않을 수 있다.",
    "steps": [
      "DB, Volume, TC_DATA, 배포 구성, 커스터마이징, 인증서 및 필요한 설정을 백업 범위로 식별한다.",
      "RPO/RTO와 백업 주기, 암호화, 접근권한, 복구 책임자를 합의한다.",
      "격리된 환경에서 복원하여 객체와 파일 정합성, 검색 재구성 필요 여부를 확인한다."
    ],
    "verify": "복원 시험의 소요 시간, 데이터 유실 범위, 기능 검증 결과를 기록한다.",
    "source": "운영 체크리스트 제안; Teamcenter Deployment Reference Architecture 2606, p.27 (공유 파일 구성 참고)",
    "next": "license"
  },
  {
    "id": "license",
    "group": "05 관리·설정",
    "title": "라이선스 / 사용자 / 조직",
    "summary": "접속 장애가 라이선스인지 인증·권한인지 구분한다.",
    "beginner": "라이선스 할당과 Teamcenter 그룹·역할·프로젝트 권한은 서로 다른 영역이다.",
    "steps": [
      "라이선스 서버 상태, 만료·기능 종류·가용 수량을 확인한다.",
      "사용자 활성 상태와 Group/Role 및 프로젝트 멤버십을 확인한다.",
      "권한 변경은 승인 후 최소 권한 원칙으로 적용하고 대표 사용자로 테스트한다."
    ],
    "verify": "정상 사용자와 권한 제한 사용자의 차이가 의도한 정책과 일치해야 한다.",
    "source": "Teamcenter Installation Using Deployment Center 2606, p.8; OneNote · 라이선스 변경시 해줘야 하는 작업 / 사용자 등록 (주제)",
    "next": "sso"
  },
  {
    "id": "sso",
    "group": "05 관리·설정",
    "title": "SSO / Security Services",
    "summary": "인증 흐름과 Teamcenter 내부 권한을 분리한다.",
    "beginner": "IdP 로그인 성공이 Teamcenter 세션 생성 성공을 보장하지 않는다.",
    "steps": [
      "인증 제공자, Teamcenter Security Services 및 Gateway의 연동 구조를 확인한다.",
      "인증서 만료·시간 동기화·리다이렉트 URI·세션 정책·계정 매핑을 점검한다.",
      "일반 사용자와 승인된 서비스 계정의 인증 방식 및 비밀정보 관리 절차를 확인한다."
    ],
    "verify": "정상 로그인·로그아웃·세션 만료 후 재로그인 및 권한 제한을 검증한다.",
    "source": "Teamcenter Deployment Reference Architecture 2606, p.27; OneNote · SSO 설정 / Session Timeout (주제)",
    "next": "prefs"
  },
  {
    "id": "prefs",
    "group": "05 관리·설정",
    "title": "Preferences / ACL / Organization",
    "summary": "설정의 범위와 권한 정책을 관리한다.",
    "beginner": "사용자별 설정 차이와 객체 접근 규칙을 혼동하지 않는다.",
    "steps": [
      "Preference의 정확한 키와 Site/Group/Role/User 등 적용 범위를 버전별 레퍼런스에서 확인한다.",
      "Access Manager 규칙, 소유권, 그룹·역할, 프로젝트 및 릴리즈 상태가 접근에 미치는 영향을 확인한다.",
      "변경 전 export 또는 설정 기록을 남기고 시험 환경에서 역할별 검증을 수행한다."
    ],
    "verify": "허용 대상은 접근되고 금지 대상은 접근되지 않는지 확인한다.",
    "source": "OneNote · ACL / Preference / TC 주요 Configuration (주제)",
    "next": "bmide"
  },
  {
    "id": "bmide",
    "group": "06 개발·배포",
    "title": "BMIDE 데이터 모델과 배포",
    "summary": "타입, 속성, LOV, 관계 및 규칙 변경을 관리한다.",
    "beginner": "모델 변경은 DB 스키마와 클라이언트 메타데이터에 영향을 줄 수 있다.",
    "steps": [
      "현재 모델과 수정 템플릿의 버전·의존성·변경된 타입과 속성을 확인한다.",
      "개발 환경에서 패키징 및 모델 검증 후 해당 버전 DC/TEM 배포 절차를 따른다.",
      "캐시 갱신 필요 여부를 확인하고 기존 데이터와 신규 생성 객체를 검증한다."
    ],
    "verify": "타입 생성, 속성 저장, 검색, ACL, 기존 커스터마이징에 회귀 문제가 없어야 한다.",
    "source": "OneNote · BMIDE Model 배포 / BMIDE 관련 Preference (주제, 구버전 TEM 화면 포함)",
    "next": "aw"
  },
  {
    "id": "aw",
    "group": "06 개발·배포",
    "title": "AW 개발 / Stylesheet / Cache",
    "summary": "화면 구성 변경과 모델 변경을 구분한다.",
    "beginner": "화면에 속성이 보이지 않는 문제는 모델, 권한, Stylesheet, 클라이언트 캐시 등 다양한 원인이 있다.",
    "steps": [
      "대상 화면의 타입·Stylesheet·ViewModel과 지원되는 AW 개발 구조를 파악한다.",
      "소스 버전과 빌드 설정을 확인하고 테스트 환경에서 빌드·배포한다.",
      "실패 시 빌드 로그와 브라우저 콘솔을 확인하고 지원되는 캐시 갱신 방법을 적용한다."
    ],
    "verify": "정상/제한 사용자, 신규·기존 객체에서 UI와 실제 저장값을 확인한다.",
    "source": "OneNote · AW Build 하기 (구버전 사례) / Style Sheet 개발(AW) (주제)",
    "next": "workflow"
  },
  {
    "id": "workflow",
    "group": "06 개발·배포",
    "title": "Workflow / Handler / Release",
    "summary": "승인 프로세스와 상태 변경 규칙을 관리한다.",
    "beginner": "작업 완료와 객체 릴리즈는 같은 의미가 아닐 수 있다.",
    "steps": [
      "템플릿, 대상 객체, Task 유형, 담당자, Rule/Action Handler와 분기 조건을 확인한다.",
      "수정 전 템플릿 버전을 보존하고 진행 중 인스턴스의 영향을 확인한다.",
      "승인·반려·재작업·담당자 부재·오류 케이스를 시험한다."
    ],
    "verify": "예상된 Task 할당, 접근권한, 상태 및 결과 객체 관계가 일치한다.",
    "source": "OneNote · Workflow 개발(AW) / Workflow Task 정리 (주제); Google Drive · Workflow Designer / Workflow Handlers (참고 문서명)",
    "next": "jenkins"
  },
  {
    "id": "jenkins",
    "group": "06 개발·배포",
    "title": "Jenkins CI/CD / 배포 인수인계",
    "summary": "소스부터 빌드·검증·배포·복구까지 이력을 남긴다.",
    "beginner": "빌드 성공과 운영 배포 성공을 별도로 관리한다.",
    "steps": [
      "Git 저장소, 브랜치, Jenkinsfile, 빌드 에이전트 및 의존성 버전을 기록한다.",
      "TC 서버, AW, Indexer, Dispatcher, Admin 설정의 산출물을 구분하고 배포 순서와 승인 단계를 정한다.",
      "비밀정보는 자격증명 저장소를 이용하고 산출물 및 변경 전 버전을 보관한다."
    ],
    "verify": "빌드 번호와 커밋, 대상 환경, 설치 로그, 기능 검증 및 롤백 정보를 연결한다.",
    "source": "OneNote · Jenkins / Build Script / 배포 상세 프로세스 (주제)",
    "next": "login-error"
  },
  {
    "id": "login-error",
    "group": "07 장애 대응",
    "title": "로그인 실패 / Connection refused",
    "summary": "로그인 장애를 클라이언트, 웹, 인증, Enterprise, DB로 분해한다.",
    "beginner": "모든 사용자인지 일부 사용자 또는 특정 노드인지 먼저 확인한다.",
    "steps": [
      "HTTP 상태와 실패 메시지를 기록하고 서비스 연결 및 인증 경로를 추적한다.",
      "Pool Manager의 프로세스 할당·라이선스·DB 연결을 확인한다.",
      "최근 인증서·패치·설정 변경과 정상 노드 차이를 확인한 뒤 담당 계층을 복구한다."
    ],
    "verify": "정상 사용자와 제한 사용자로 로그인 및 로그아웃을 검증한다.",
    "source": "OneNote · Pool Manager 실행이 안되는 경우 / login failed / Connection refused (장애 주제)",
    "next": "cache-error"
  },
  {
    "id": "cache-error",
    "group": "07 장애 대응",
    "title": "Shared Metadata Cache 오류",
    "summary": "DB에 배포된 모델과 공유 메타데이터 캐시의 불일치를 확인한다.",
    "beginner": "캐시가 오래됐다는 메시지는 모델 버전 차이를 확인하는 단서이며 무조건 캐시 삭제를 의미하지 않는다.",
    "steps": [
      "로그의 모델·Dataset 버전과 최근 BMIDE 배포 이력을 대조한다.",
      "노드별 모델·캐시 상태와 공유 저장소 연결을 확인한다.",
      "해당 버전의 generate_metadata_cache 유틸리티 절차를 확인하고 승인·백업 후 필요한 경우에만 갱신한다."
    ],
    "verify": "모든 노드의 로그인·타입 조회·객체 생성 및 Dispatcher 연결을 재검증한다.",
    "source": "OneNote · The Shared Metadata Cache is out of date (2023-11 현장 사례, 특정 명령·자격증명 제외)",
    "next": "file-error"
  },
  {
    "id": "file-error",
    "group": "07 장애 대응",
    "title": "FSC proxy / 파일 업로드 실패",
    "summary": "메타데이터, 파일 전송, 캐시, 네트워크 오류를 분리한다.",
    "beginner": "FSC proxy 오류는 원인이 여러 가지일 수 있다.",
    "steps": [
      "파일 크기·Dataset·실패 방향과 FSC/FCC 로그·HTTP 오류를 확인한다.",
      "FMS Bootstrap 경로, Volume 연결·용량, DNS 및 인증서 상태를 대조한다.",
      "메타데이터 불일치가 확인된 경우에만 관련 캐시 갱신을 검토한다."
    ],
    "verify": "업로드한 파일과 다운로드 파일의 내용이 일치하고 다른 사용자의 파일도 정상인지 확인한다.",
    "source": "OneNote · FSC proxy error -9101 (현장 사례: metadata cache 재생성) / 파일 업로드 되지 않음 (주제)",
    "next": "search-error"
  },
  {
    "id": "search-error",
    "group": "07 장애 대응",
    "title": "검색 누락 / Reindex",
    "summary": "인덱싱 지연과 권한 필터 문제를 분리한다.",
    "beginner": "전체 재색인은 DB·검색 서버에 부하를 줄 수 있으므로 마지막 선택지로 둔다.",
    "steps": [
      "누락 객체가 직접 조회되는지와 권한·검색 조건을 확인한다.",
      "Indexer 실행 흐름과 오류 로그를 확인한다. 구버전 노트의 runTcFTSIndexer -status는 상태 조회 예시이며 대상 버전에서 옵션을 확인한다.",
      "지원되는 범위별 재색인을 검토하고 전체 재색인은 영향·용량·소요시간을 검토한 뒤 승인받는다."
    ],
    "verify": "대표 객체와 구조 검색, 파일 내용 검색 결과를 권한별로 비교한다.",
    "source": "OneNote · runTcFTSIndexer 관련 명령 (2024-04) / 특정 날짜 Reindex (주제)",
    "next": "convert-error"
  },
  {
    "id": "convert-error",
    "group": "07 장애 대응",
    "title": "Dispatcher 변환 실패 / PDF Timeout",
    "summary": "변환 실패가 입력 파일 문제인지 시간 제한인지 결과 반영 문제인지 판단한다.",
    "beginner": "복잡한 문서는 변환 결과가 늦게 생성되어도 요청 자체는 이미 실패 처리될 수 있다.",
    "steps": [
      "요청 ID와 변환 시작·종료 시각 및 출력 생성 여부를 확인한다.",
      "Translator의 지원 형식·파일 크기·리소스·시간 제한과 로그를 비교한다.",
      "현장 기록에 나온 FileCheckWait, FileCheckWaitForZero, NOGUI_TIMEOUT은 버전별 정의와 단위를 확인한 뒤 시험 환경에서 조정 여부를 검토한다."
    ],
    "verify": "동일 입력 재현과 정상 문서 변환을 확인하고 큐 적체 또는 중복 등록이 없는지 검사한다.",
    "source": "OneNote · PDF 파일 변환시 실패하는 케이스 (2024-01, 구버전 사례)",
    "next": "aw-error"
  },
  {
    "id": "aw-error",
    "group": "07 장애 대응",
    "title": "AW 흰 화면 / 401 / 빌드 오류",
    "summary": "브라우저, 인증, Gateway, 패키지 문제를 나눠 진단한다.",
    "beginner": "흰 화면만으로 장애 원인을 확정할 수 없다.",
    "steps": [
      "개발자 도구 Network·Console에서 첫 실패 요청, 상태 코드 및 JS 오류를 확인한다.",
      "401이면 승인된 인증 구성과 세션을 확인하고, 모듈 누락이면 빌드 산출물·버전·의존성을 점검한다.",
      "최근 배포 변경을 비교하고 수정 전 이전 산출물 및 설정을 보존한다."
    ],
    "verify": "캐시가 없는 신규 세션에서 로그인과 대상 화면 기능을 검증한다.",
    "source": "OneNote · AW 로그인 관련 / awbuild 에러 401 / Module not found (장애 주제)",
    "next": "ai"
  },
  {
    "id": "ai",
    "group": "08 확장·연동",
    "title": "Teamcenter Copilot / AI Services 2606",
    "summary": "AI 구성의 데이터 흐름과 운영 책임을 구별한다.",
    "beginner": "기존 AW 검색 인덱스와 AI의 벡터 검색 저장소는 목적과 점검 대상이 다르다.",
    "steps": [
      "2606 구축 자료의 Teamcenter Copilot 선택 및 필요한 AI Microservices를 확인한다.",
      "AWS 사용 시 Bedrock 모델·Embedding·OpenSearch Serverless 컬렉션과 IAM/네트워크 정책을 승인된 구성으로 확인한다.",
      "Indexer 및 파일 내용 색인 설정은 실제 버전·기능·권한 기준으로 확인하고 모델/Region을 임의 확정하지 않는다."
    ],
    "verify": "Copilot 응답, 권한 제한 문서 제외, 색인 반영, 호출 오류·비용을 검증한다.",
    "source": "Google Drive · Teamcenter 2606 AWS 및 Deployment Center 실전 구축 가이드 (2026-10-27)",
    "next": "integration"
  },
  {
    "id": "integration",
    "group": "08 확장·연동",
    "title": "SOA / REST / CAD·ERP·Polarion 연동",
    "summary": "연동 인터페이스의 데이터 소유권과 실패 복구를 정리한다.",
    "beginner": "Teamcenter와 외부 시스템의 저장 결과가 서로 일치하는지 확인해야 한다.",
    "steps": [
      "연동별 API, 인증, 데이터 매핑, 동기/비동기 방식과 원본 시스템을 문서화한다.",
      "오류 재처리, 중복 방지, 타임아웃 및 추적 ID 규칙을 확인한다.",
      "지원 버전 및 변경 시 영향을 검증하고 운영 권한을 최소화한다."
    ],
    "verify": "정상·오류·중복 요청에 대한 결과와 데이터 정합성을 검사한다.",
    "source": "OneNote · Interface / Restful (주제); Google Drive · Teamcenter Integration Framework (참고 문서명)",
    "next": "handover"
  },
  {
    "id": "handover",
    "group": "09 인수인계 완료",
    "title": "최종 인수인계 체크리스트",
    "summary": "다음 운영자가 스스로 상태 확인과 장애 대응을 할 수 있도록 검증한다.",
    "beginner": "문서를 전달하는 것과 운영이 가능한 상태로 전환하는 것은 다르다.",
    "steps": [
      "최신 구성도, 버전 목록, 서비스 의존성, 관리 문서 위치, 담당자 및 지원 채널을 확인한다.",
      "백업 복구 시험, 대표 업무 기능 시험, 모니터링 알림 및 장애 접수 절차를 확인한다.",
      "미해결 이슈와 위험, 접근권한 인계 여부, 배포·롤백 절차를 책임자와 확인한다."
    ],
    "verify": "인수자가 테스트 환경에서 독립적으로 점검을 수행하고 인수 승인 기록을 남긴다.",
    "source": "운영 체크리스트 제안; OneNote · 운영전환 점검사항 (주제)",
    "next": "start"
  }
]
