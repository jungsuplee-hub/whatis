export type StandardManual={where:string[][];code?:string;how:string[];result:string;ref?:string}
export const teamcenterStandard:Record<string,StandardManual>={
  "start": {
    "where": [
      [
        "TC_ROOT",
        "/Teamcenter_ROOT (Linux) / D:\\Teamcenter\\tc_root (Windows)",
        "제품 바이너리·유틸리티 설치 위치. 실제 변수명은 TC_ROOT"
      ],
      [
        "TC_DATA",
        "/Teamcenter_DATA / D:\\Teamcenter\\tc_data",
        "환경별 DB 연결·환경 초기화 및 구성. TC_ROOT와 구분"
      ],
      [
        "TC_ROOT/bin",
        "/Teamcenter_ROOT/bin",
        "서버 및 CLI 유틸리티"
      ],
      [
        "TC_DATA/tc_profilevars",
        "Linux: tc_profilevars / Windows: tc_profilevars.bat",
        "해당 환경의 변수 초기화"
      ],
      [
        "FMS_HOME",
        "예: /Teamcenter_ROOT/fsc",
        "FSC/FCC 설치 위치; 구성별 상이"
      ],
      [
        "Volume",
        "예: /data/tcvolume01",
        "파일 원본, FSC 캐시와 구분"
      ],
      [
        "TC_TMP_DIR",
        "실제 환경 변수 및 서비스 로그 경로 확인",
        "임시 파일·로그 경로 확인의 출발점"
      ],
      [
        "별도 설치",
        "예: /apps/dc, /apps/dispatcher, /apps/solr",
        "DC, Dispatcher, Search 등은 독립 설치될 수 있음"
      ]
    ],
    "code": " # Linux: 기존 Teamcenter 환경을 초기화한 셸에서 조회\nprintf 'TC_ROOT=%s\\nTC_DATA=%s\\nFMS_HOME=%s\\nTC_TMP_DIR=%s\\n' \"$TC_ROOT\" \"$TC_DATA\" \"$FMS_HOME\" \"$TC_TMP_DIR\"\nls -ld \"$TC_ROOT\" \"$TC_DATA\" \"$TC_ROOT/bin\" \"$TC_DATA/tc_profilevars\"\nfindmnt -T \"$TC_DATA\"\n# Windows: Teamcenter Command Prompt에서\n# echo %TC_ROOT%\n# echo %TC_DATA%\n# echo %FMS_HOME%\n# echo %TC_TMP_DIR%",
    "how": [
      "운영 환경의 Teamcenter Command Prompt 또는 공식 프로파일이 이미 로드된 셸에서 네 변수의 실제 값을 확인한다. 시스템 전역 환경 변수와 서비스 계정의 실행 환경이 다를 수 있으므로 서비스 등록 정보와 비교한다. TC_ROOT는 설치 경로, TC_DATA는 특정 DB 환경의 구성 경로이므로 동일 서버에 복수 환경이 있으면 혼동하기 쉽다.",
      "서버별 인벤토리 예시: tc-web01=Gateway/Web, tc-app01=Server Manager와 tcserver, tc-db01=DB, tc-fms01=FSC와 Volume, tc-search01=Solr/Indexer, tc-dsp01=Dispatcher. 명칭은 예시이며 실제 통합/분리 구성을 기록한다. URL, 포트, DNS, 인증서, 서비스 계정은 공개 문서가 아니라 내부 대장에 남긴다.",
      "설치 버전은 해당 환경에서 install -ask_version 유틸리티 지원을 확인해 조회하고 DC/TEM 환경 버전, AW 버전, DB/OS/JDK 버전을 별도로 적는다. 설치 파일 폴더명만으로 릴리스나 패치가 확인됐다고 판단하지 않는다.",
      "데이터 위치에는 DB 백업 경로, Volume 원본 경로, 구성 파일, 커스터마이징 저장소, 검색 데이터, 임시/cache를 각각 표시한다. 원본과 재생성 가능한 데이터를 구분하면 백업과 장애 대응 범위가 결정된다."
    ],
    "result": "예를 들어 /Teamcenter_ROOT/bin이 있고 TC_DATA가 /Teamcenter_DATA라면 실행 파일은 전자에서, 환경 초기화는 후자에서 찾는다. 경로가 비어 있으면 프로파일 미로드 가능성을 조사하며 파일이 없다고 바로 설치 오류로 판단하지 않는다. 실제 명령 결과와 서비스별 로그·정상 업무 기록을 인벤토리에 연결한다.",
    "ref": "Teamcenter Installation Using Deployment Center 2606 p.9; Teamcenter command-line environment (참고: https://tc.xcelerator.us/docs/tc-administration/environment-variables/02-setting-up-a-teamcenter-command-line-environment)"
  },
  "architecture": {
    "where": [
      [
        "TC_ROOT/bin",
        "Enterprise 노드",
        "tcserver 및 제품 유틸리티"
      ],
      [
        "TC_DATA",
        "Enterprise 노드",
        "DB 연결 환경"
      ],
      [
        "Gateway / Web tier",
        "DC 환경의 설치 경로",
        "브라우저 요청·4-tier 연결"
      ],
      [
        "FMS_HOME / Volume",
        "FSC 노드 및 저장소",
        "실제 파일 경로"
      ],
      [
        "DB / Search",
        "별도 서비스 등록 경로",
        "객체 메타데이터와 검색 인덱스"
      ]
    ],
    "code": "# Linux: 각 서비스 호스트에서 조회\nss -lnt\nps -eo pid,comm,%cpu,rss --sort=-rss | head -20",
    "how": [
      "2-tier는 Rich Client가 로컬 서버 실행 환경을 사용해 DB에 접근한다. 4-tier Rich Client는 Web tier를 경유하고, AW는 브라우저에서 Gateway와 웹/API 계층을 거친다. 실제 엔드포인트와 연결 순서는 DC의 배포 구성으로 확인한다.",
      "객체 속성 조회, Dataset 파일 열기, 검색, 변환은 서로 다른 경로이다. 웹 주소 접속 성공은 Enterprise 또는 FMS 성공을 보장하지 않는다.",
      "서버 간 연결 기록에는 송신 역할, 수신 역할, 등록 FQDN, 실제 수신 포트, TLS 종료 위치를 적는다. 포트는 배포별로 달라지므로 ss 또는 서비스 설정과 대조한다."
    ],
    "result": "객체 조회가 정상인데 파일 다운로드가 실패하면 FMS 경로부터, 객체 조회는 정상인데 검색만 누락되면 Indexer/Solr부터 조사한다. 모든 사용자 로그인 실패는 공통 웹·인증·Enterprise·DB 경로를 나누어 확인한다.",
    "ref": "Deployment Reference Architecture 2606 p.27; Installation Using Deployment Center 2606"
  },
  "pool": {
    "where": [
      [
        "TC_ROOT",
        "Enterprise 설치 루트",
        "Server Manager와 tcserver"
      ],
      [
        "TC_DATA/tc_profilevars",
        "실제 서비스 환경",
        "DB 환경·실행 변수"
      ],
      [
        "Server Manager 등록 경로",
        "서비스 관리자/DC",
        "풀 구성 및 로그 위치"
      ],
      [
        "TC_TMP_DIR / 서비스 로그",
        "실제 설정",
        "tcserver 오류 추적"
      ]
    ],
    "code": "ps -eo pid,comm,%cpu,rss | grep '[t]cserver'\n# Windows PowerShell\n# Get-Process tcserver -ErrorAction SilentlyContinue",
    "how": [
      "Server Manager는 요청을 처리할 tcserver 프로세스를 준비하고 할당한다. 초기 풀, 유휴/활성 서버, 최대 서버 개수와 세션 대기 상태는 실제 관리 화면 또는 서비스 구성으로 확인한다.",
      "로그인 실패 시 웹 요청 시각을 Server Manager 로그와 tcserver syslog에 대조한다. 프로세스 미생성, 초기화 실패, DB 연결 실패, 라이선스 부족을 별개로 분류한다.",
      "메모리 산정 예시: 관찰한 tcserver RSS × 예상 동시 프로세스 수에 OS 및 기타 서비스 여유를 더해 검토한다. RSS 공유 메모리 중복과 DB 연결 제한도 고려하며 제품 권장 수치로 취급하지 않는다."
    ],
    "result": "유휴 서버가 없고 대기 시간이 증가하면 풀 포화 가능성이 있다. tcserver가 시작 즉시 종료하면 풀을 키우기보다 해당 초기화 로그의 첫 오류를 조사한다."
  },
  "gateway": {
    "where": [
      [
        "Gateway 설치 루트",
        "DC 컴포넌트의 실제 경로",
        "웹 진입점과 라우팅"
      ],
      [
        "TcGQL / Web tier",
        "설치된 서비스 경로",
        "API 처리"
      ],
      [
        "File Repository",
        "DC 구성에서 확인",
        "웹 콘텐츠 임시 저장"
      ],
      [
        "브라우저 Network/Console",
        "F12 개발자 도구",
        "요청 URL, 상태, JS 오류"
      ]
    ],
    "code": "# 공개되지 않은 내부 주소는 실제 환경 값으로 교체\ncurl -I https://teamcenter.example.invalid/\nss -lnt",
    "how": [
      "DC에서 AW Gateway, 웹 계층, TcGQL 및 File Repository의 컴포넌트 등록 주소·인증서·서비스 상태를 확인한다. Linux Gateway의 Node.js/NPM 전제조건은 2606 설치 문서에서 확인된다.",
      "브라우저 Network에서 Preserve log를 활성화하고 로그인 또는 화면 열기를 재현한다. 첫 실패 요청, 상태 코드, 응답 시각을 기록하되 쿠키 및 토큰은 외부에 공유하지 않는다.",
      "401/403은 인증 또는 권한, 502/503은 프록시와 상위 서비스 상태를 조사할 단서다. 직접 원인 확정은 Gateway 및 대상 서비스 로그의 일치 여부를 확인한 뒤 한다."
    ],
    "result": "정적 UI만 성공하고 API가 실패하면 Gateway 기동 자체보다는 대상 API 라우팅과 인증을 검토한다. 새 브라우저 세션에서 실제 객체 조회까지 성공해야 한다.",
    "ref": "Installation Using Deployment Center 2606 pp.9, 13"
  },
  "fms": {
    "where": [
      [
        "FMS_HOME",
        "예: /Teamcenter_ROOT/fsc",
        "FSC 실행·설정 위치"
      ],
      [
        "fsc.xml / fmsmaster_<FSC ID>.xml",
        "FSC 구성 디렉터리 예시",
        "FSC와 master/Volume 경로 구성; 실제 파일명 확인"
      ],
      [
        "FCC",
        "클라이언트 FMS_HOME",
        "클라이언트 캐시와 로그"
      ],
      [
        "Volume",
        "예: /data/tcvolume01",
        "원본 파일, 캐시와 별도"
      ]
    ],
    "code": "printf 'FMS_HOME=%s\\n' \"$FMS_HOME\"\nls -ld \"$FMS_HOME\"\nfind \"$FMS_HOME\" -maxdepth 2 -type f -iname '*.xml'\n# 실제 Volume 경로로 바꾸어 용량/마운트 조회\n# df -h /data/tcvolume01\n# findmnt -T /data/tcvolume01",
    "how": [
      "Rich Client의 Dataset Named Reference와 Volume을 확인한다. FMS는 파일 전송을 담당하고 DB에는 객체 및 파일 참조가 저장된다. 파일 이름만 같아도 다른 참조일 수 있다.",
      "FSC 서비스가 실행되는 계정의 Volume 접근 권한과 마운트 상태, FSC master 구성에 등록된 ID·주소를 확인한다. fsc.xml과 fmsmaster 계열 XML은 설치 방식에 따라 이름과 위치가 달라진다.",
      "동일 사용자로 작은 테스트 파일을 업로드하고 다시 다운로드한다. 특정 Volume에서만 실패하는지 비교하며 원본 파일과 다운로드 파일의 해시를 대조한다. 운영 Volume의 직접 이동·삭제는 하지 않는다."
    ],
    "result": "디스크가 정상이어도 FSC 등록 주소가 틀리거나 서비스 계정의 접근이 거부되면 전송 실패가 발생한다. 원본 파일 경로를 먼저 식별하고 캐시를 원본처럼 취급하지 않는다.",
    "ref": "FMS 환경 변수 참고: https://tc.xcelerator.us/docs/tc-administration/environment-variables/05-environment-variables-listing; 구버전 System Administration의 FSC XML 예시"
  },
  "dispatcher": {
    "where": [
      [
        "Dispatcher 설치 루트",
        "예: /apps/dispatcher",
        "Scheduler, Module, Dispatcher Client 각각 실제 설치 경로"
      ],
      [
        "Scheduler/Module/Client 로그",
        "각 컴포넌트 로그 설정",
        "작업 ID로 추적"
      ],
      [
        "Translator 구성",
        "Module에서 해당 Translator 등록 확인",
        "실행 프로그램과 입력/출력 경로"
      ],
      [
        "Staging",
        "실제 설정 경로",
        "변환 작업 파일; Volume과 구분"
      ]
    ],
    "code": "# 실제 Dispatcher 설치 경로에서 (읽기 전용)\n# find /apps/dispatcher -maxdepth 4 -type f -name '*.log'\n# 지원 버전에서 Module bin의 runmodule.sh -ping\n# Windows: runmodule.bat -ping",
    "how": [
      "변환 요청을 제출한 후 요청 ID, Translator 이름, 등록 시각과 상태를 기록한다. Scheduler에서 배정되지 않으면 Module 등록/가용 상태를 보고, 실행 단계라면 Module과 Translator 로그를 확인한다.",
      "Staging에 입력 파일과 출력 결과가 생기는지 확인한다. 결과 파일이 생성됐는데 Dataset에 등록되지 않으면 Dispatcher Client의 결과 반영·권한·FMS 경로를 확인한다.",
      "복잡한 문서만 실패하면 정상 파일과 실패 파일의 크기·입력 형식·변환 실행 시간·타임아웃을 비교한다. 작업 ID와 원래 결과를 확인하지 않고 중복 제출하지 않는다."
    ],
    "result": "대기·실행·결과 등록의 어느 단계에서 중단됐는지 분리해 담당 컴포넌트를 찾는다.",
    "ref": "Dispatcher runtime status 참고: https://tc.xcelerator.us/docs/tc-administration/dispatcher/view-runtime-status-of-dispatcher-services-and-dispatcher-client-history; OneNote Dispatcher 사례"
  },
  "index": {
    "where": [
      [
        "TC_ROOT/TcFTSIndexer/bin",
        "Indexer 실행 호스트",
        "runTcFTSIndexer 유틸리티"
      ],
      [
        "TC_ROOT/TcFTSIndexer/log 또는 logs",
        "실제 배포에서 확인",
        "Indexer 로그 (버전별 상이)"
      ],
      [
        "Solr 서비스 / 데이터 경로",
        "Search 노드",
        "검색 색인 저장"
      ],
      [
        "FTSI 관련 Dataset",
        "Rich Client 검색",
        "인덱싱 구성 확인"
      ]
    ],
    "code": "# Teamcenter 환경을 로드한 Indexer 호스트에서\n# 실제 실행 파일명과 지원 옵션 확인 후\nrunTcFTSIndexer -status\n# 로그 경로 확인\nls -ld \"$TC_ROOT/TcFTSIndexer\"/log* ",
    "how": [
      "Teamcenter 객체를 검색 인덱스에 전달하는 Indexer와 실제 검색을 처리하는 Solr를 구별한다. 객체 ID로 직접 조회해 원본이 존재하는지 확인한 뒤 AW 검색 조건과 권한을 비교한다.",
      "runTcFTSIndexer -status로 현재 flow 상태를 조회한다. objdata 등 실제 flow 이름을 확인하고 성공 시각 및 오류 로그를 확인한다. 해당 옵션은 기존 OneNote 및 기술 레퍼런스에 나온 조회 예시다.",
      "인덱싱 설정 또는 스키마 불일치가 의심되면 FTSIndexer Files Dataset과 배포 버전을 확인한다. 데이터 인덱스 삭제 또는 재구축 전에는 공식 릴리스 절차와 디스크·작업량을 확인한다."
    ],
    "result": "flow가 실행 중이어도 실패가 반복되거나 backlog가 증가하면 정상 반영이 아니다. 대표 객체 변경 후 실제 검색 반영 시간으로 검증한다.",
    "ref": "Siemens Community: https://community.sw.siemens.com/s/article/Resolving-Schema-Update-Issues-in-Teamcenter-Indexing-for-Active-Workspace; OneNote Indexer 운영 사례"
  },
  "install": {
    "where": [
      [
        "설치 미디어",
        "예: /install/Tc2606_lnx64.zip",
        "2606 Linux 설치 패키지"
      ],
      [
        "TC_ROOT / TC_DATA",
        "예: /Teamcenter_ROOT / /Teamcenter_DATA",
        "제품과 환경 구분"
      ],
      [
        "Volume",
        "별도 저장소 예시",
        "DB와 정합 백업 대상"
      ],
      [
        "DC",
        "실제 설치 경로",
        "환경과 컴포넌트 배포"
      ]
    ],
    "code": "java -version\n# 해당 컴포넌트가 요구할 때만\nnode --version\nnpm --version\ndf -h\nhostname -f",
    "how": [
      "2606 Platform Matrix에서 OS·DB·Java와 AW, CAD 및 외부 구성의 지원 조합을 확인한다. 2606 설치 문서는 Linux Gateway에 NodeJS/NPM, Linux Microservices Node에 Kubernetes 또는 Docker Swarm을 전제조건으로 설명한다.",
      "설치 미디어를 로컬에 준비하고 DB, Siemens License Server, 필요한 OS 계정과 디렉터리를 마련한다. 설치 권한과 운영 서비스 계정의 권한을 분리한다.",
      "DC에서 환경과 애플리케이션을 등록하고 필요한 컴포넌트를 호스트에 할당한다. 생성된 배포 스크립트와 로그를 확인한 뒤 해당 버전의 설치 단계에 맞춰 실행한다."
    ],
    "result": "설치 로그 성공 외에도 제품 버전, DB 연결, 라이선스, 로그인, 파일 전송과 검색을 확인한다.",
    "ref": "Teamcenter Installation Using Deployment Center 2606 p.9"
  },
  "dc": {
    "where": [
      [
        "DC_HOME",
        "예: /apps/dc (설명용 별칭)",
        "Deployment Center 설치 위치"
      ],
      [
        "DC logs",
        "DC 압축 해제/설치 위치에서 확인",
        "DC 자체 오류"
      ],
      [
        "배포 산출물",
        "환경별 생성 디렉터리",
        "배포 스크립트 및 실행 로그"
      ],
      [
        "TC_ROOT / TC_DATA",
        "대상 서버",
        "실제 배포된 제품 및 환경"
      ]
    ],
    "how": [
      "Software Repositories에서 대상 릴리스 미디어를 식별하고 환경을 생성 또는 선택한다. Applications 선택과 Components 매핑은 별개로 확인한다.",
      "호스트별 설치 경로, 컴포넌트 의존성, 포트 및 인증서를 검토한다. 생성 스크립트에는 민감한 값이 포함될 수 있으므로 공개하지 않고 버전과 생성 시각만 기록한다.",
      "실행 로그에서 첫 실패 컴포넌트와 선행 의존성 오류를 구분한다. DC가 보고하는 상태와 실제 대상 서비스 상태를 비교한다. 기존 TEM 관리 환경을 DC 관리 대상으로 전환하려면 해당 버전의 공식 절차를 확인한다."
    ],
    "result": "DC 작업 성공은 실제 모든 서비스의 정상 동작과 별개다. 환경별 기능 검증과 버전 대장을 갱신한다.",
    "ref": "Installation Using Deployment Center 2606; Deployment Center 가이드의 배포 로그 개념"
  },
  "upgrade": {
    "where": [
      [
        "TC_ROOT",
        "기존·대상 제품 경로",
        "바이너리/유틸리티"
      ],
      [
        "TC_DATA",
        "기존 환경 설정",
        "프로파일과 구성"
      ],
      [
        "DB / Volume",
        "일관된 백업 세트",
        "원본 복구 대상"
      ],
      [
        "DC/TEM 및 BMIDE",
        "배포·모델 이력",
        "지원되는 업그레이드 단계"
      ]
    ],
    "how": [
      "현재 릴리스와 목표 릴리스의 지원 경로를 확인하고 기존 BMIDE 템플릿, AW 커스터마이징, CAD 및 ERP 통합, DB/OS 요구사항을 목록화한다.",
      "검증 환경의 동일한 데이터 복사본에서 전체 업그레이드를 시험한다. DB 모델 변경, 라이선스, 검색 스키마, 외부 연결 변경 여부와 실행 로그·소요 시간을 기록한다.",
      "서비스 중단 창에서 원본 DB와 Volume의 정합 백업 및 복구 시험 결과를 확인한다. 공식 도구의 순서를 따르며 설치 경로만 이전 버전으로 바꾸는 방식은 DB 모델과의 불일치를 만들 수 있다."
    ],
    "result": "검증 실패 기준(로그인, BOM, 파일, 검색, 워크플로, API)을 미리 정의하고 이전 전체 환경의 복구 가능성을 확인한다."
  },
  "sizing": {
    "where": [
      [
        "Enterprise",
        "tcserver / Server Manager",
        "활성·유휴 프로세스와 메모리"
      ],
      [
        "DB",
        "DB 관리 통계",
        "연결, 대기, I/O"
      ],
      [
        "FSC / Volume",
        "저장소 지표",
        "대역폭, 공간, 파일 전송"
      ],
      [
        "Indexer / Dispatcher",
        "각 작업 큐",
        "백로그와 처리 시간"
      ]
    ],
    "code": "free -h\nvmstat 1 5\ndf -h\nps -eo pid,comm,%cpu,rss --sort=-rss | head -20",
    "how": [
      "라이선스 수와 실제 동시에 활동하는 사용자 수를 구분하고 검색, BOM 전개, 파일 전송, 변환 등 업무 시나리오별 피크 요청량을 측정한다.",
      "동일 시간대의 CPU, RAM, swap, I/O, DB 대기와 요청시간을 수집한다. tcserver RSS는 KB 단위이며 공유 메모리를 중복 포함할 수 있다. 사용 가능한 메모리와 JVM/DB 등의 별도 예산도 고려한다.",
      "증설 계획은 정상 부하와 피크 부하, 노드 장애 시 잔여 용량, 데이터 증가량을 반영한다. 실제 권장 사양은 해당 릴리스 Siemens sizing 문서 및 워크로드를 기준으로 확정한다."
    ],
    "result": "CPU만 높다고 CPU 증설을 결론내지 않고 디스크 대기, DB 대기, 큐 포화와 요청별 지연을 비교한다."
  },
  "service": {
    "where": [
      [
        "Windows Services",
        "services.msc / Get-Service",
        "등록 서비스명 및 상태"
      ],
      [
        "Linux service manager",
        "systemctl (systemd 설치 시)",
        "unit 및 상태"
      ],
      [
        "DC 환경",
        "Components",
        "서비스 역할 및 실행 호스트"
      ],
      [
        "TC_DATA / TC_ROOT",
        "대상 환경",
        "프로파일 및 실행 경로"
      ]
    ],
    "code": "# Linux: systemd 환경의 서비스 목록 조회\nsystemctl list-units --type=service --all | grep -Ei 'teamcenter|fsc|solr|dispatcher|gateway'\n# Windows PowerShell\n# Get-Service | Where-Object {$_.DisplayName -match 'Teamcenter|FSC|Dispatcher|Solr'}",
    "how": [
      "서비스명은 배포마다 다르므로 검색 결과를 DC/TEM 환경과 대조하고 실제 등록된 이름과 시작 방식을 기록한다. 이름에 Teamcenter가 없을 수도 있어 전체 구성 목록으로 보완한다.",
      "기동 전 DB, License, FMS, Enterprise, Web/Gateway, Search 및 Dispatcher 의존성을 확인한다. 실제 기동·중지 순서는 환경별 배포 지침에 따르며 사용자 작업과 큐가 진행 중인지 확인한다.",
      "서비스가 Running이어도 초기화 오류가 있을 수 있다. 서비스 시작 시각부터 로그를 읽고 로그인, 객체 조회, 파일 전송, 검색, 변환을 순서대로 검증한다."
    ],
    "result": "특정 계층만 실패하면 모든 서비스를 재시작하지 말고 그 계층의 첫 오류와 의존성을 조사한다."
  },
  "logs": {
    "where": [
      [
        "TC_TMP_DIR",
        "환경 값과 실제 로그 설정",
        "서버 임시 파일 및 syslog 위치 조사"
      ],
      [
        "TC_ROOT/TcFTSIndexer/log*",
        "Indexer 호스트",
        "색인 로그"
      ],
      [
        "FMS_HOME",
        "FSC/FCC 로그 설정",
        "파일 전송 오류"
      ],
      [
        "Gateway / Dispatcher / DC",
        "각 서비스 로그 디렉터리",
        "HTTP, 변환 및 배포 오류"
      ]
    ],
    "code": "date -Is\nprintf 'TC_TMP_DIR=%s\\n' \"$TC_TMP_DIR\"\n# 실제 로그 디렉터리를 확인하고 파일명을 지정해 조회\n# tail -n 100 /path/to/actual.log\n# grep -inE 'ERROR|Exception|WARN' /path/to/actual.log | tail -50",
    "how": [
      "신고에 오류 시각과 시간대, 사용자·노드 범위, 요청 종류 및 객체 ID를 포함한다. 서버간 NTP 시간 차이가 있는지 확인한다.",
      "Enterprise는 tcserver syslog, 파일은 FSC/FCC, AW는 Gateway/API, 검색은 Indexer/Solr, 변환은 Scheduler/Module/Client 로그를 각각 선택한다. 경로는 환경 변수와 서비스 설정으로 식별한다.",
      "첫 번째 오류와 그 뒤의 연쇄 오류를 구분한다. 로그 보존 시 원본은 내부 접근 제한 위치에 보관하고 지원 공유본에는 토큰, 비밀번호, 개인정보를 제거한다."
    ],
    "result": "에러 문자열만으로 판단하지 않고 요청 ID 또는 발생 시각으로 계층을 연결한다. 정상 요청과 실패 요청의 로그를 비교한다."
  },
  "backup": {
    "where": [
      [
        "DB",
        "DBMS 백업 도구",
        "객체·관계·업무 상태 원본"
      ],
      [
        "Volume",
        "FSC에서 등록한 실제 경로",
        "파일 원본"
      ],
      [
        "TC_DATA / 배포 설정",
        "환경 구성",
        "복구에 필요한 연결 및 구성"
      ],
      [
        "커스터마이징 저장소",
        "Git/BMIDE/AW 산출물",
        "재배포 자료"
      ],
      [
        "Search index / cache",
        "별도 데이터",
        "재생성 가능 여부 확인"
      ]
    ],
    "how": [
      "백업 세트의 시점과 DB·Volume 정합성을 확보한다. 제품 버전, 구성 버전, DB 백업 식별자, Volume 백업 범위를 함께 기록한다.",
      "RPO/RTO를 기준으로 복구 우선순위를 설계하고 백업 실패 알림, 보존 기간, 별도 저장 위치 및 복원 권한을 관리한다. DB 및 저장소 복구는 DBMS와 제품 공식 절차를 따른다.",
      "격리된 검증 환경에서 복원한다. 객체와 관계가 조회되더라도 실제 파일을 열어 정상인지 확인하고 검색 인덱스 복구/재생성 요구와 외부 연결을 검증한다."
    ],
    "result": "백업 파일이 존재하는 것과 복원 가능한 것은 다르다. 테스트한 복구 시점, 시간, 기능 결과를 기록한다."
  },
  "license": {
    "where": [
      [
        "Siemens License Server",
        "실제 설치 경로 및 서비스",
        "라이선스 제공"
      ],
      [
        "TC_DATA/tc_profilevars",
        "환경 설정 확인",
        "라이선스 연결 환경 확인"
      ],
      [
        "Organization",
        "Rich Client 관리 화면",
        "User/Group/Role"
      ],
      [
        "License 관리 로그",
        "설치 서버",
        "할당·만료·연결 오류"
      ]
    ],
    "how": [
      "제품과 라이선스 계약의 지원 여부를 확인하고 License Server 서비스와 서버 연결을 확인한다. 실제 라이선스 서버 설정은 환경 프로파일과 제품별 관리 도구를 대조한다.",
      "Organization에서 사용자 활성 상태 및 Group/Role 멤버십을 확인한다. 로그인 자체의 인증 실패와 라이선스 할당 실패, 객체 접근 거부를 구별한다.",
      "갱신 전 만료·사용량·라이선스 기능을 기록하고 해당 라이선스 서버 버전에서 지원되는 갱신 절차를 적용한다."
    ],
    "result": "갱신 후 실제 대표 사용자의 기능과 할당 상태를 확인한다. 접근 권한 문제를 라이선스 문제로 처리하지 않는다."
  },
  "sso": {
    "where": [
      [
        "IdP 관리 화면",
        "조직 인증 서비스",
        "등록 애플리케이션 및 인증 정책"
      ],
      [
        "Security Services",
        "실제 설치 경로",
        "Teamcenter 인증 연결"
      ],
      [
        "Gateway/Web",
        "DC 설정 및 로그",
        "리다이렉트·세션"
      ],
      [
        "브라우저 Network",
        "개발자 도구",
        "실패 요청의 시각과 상태"
      ]
    ],
    "code": "# 인증서 파일 경로가 확인된 경우 만료일 조회\n# openssl x509 -in /path/to/certificate.pem -noout -dates\ntimedatectl status",
    "how": [
      "사용 중인 인증 방식과 IdP, Security Services, Gateway의 주소를 확인한다. 인증 토큰의 형식과 사용자 매핑 규칙은 해당 버전 설정 문서에 따른다.",
      "리다이렉트가 반복되거나 401이 발생하면 첫 실패 URL과 응답 시각을 조사한다. 인증서 만료, 시간 동기화, 등록 주소 불일치, 사용자 ID 매핑을 나누어 검증한다.",
      "변경 전 관리자 복구 경로를 확보하고 로그인·로그아웃·세션 만료 후 재접속 및 권한 차이를 시험한다. 실제 토큰을 문서에 저장하지 않는다."
    ],
    "result": "IdP 성공 후 Teamcenter 세션 생성 실패라면 후속 서비스 로그를 확인한다. 인증을 임의로 해제해 우회하지 않는다."
  },
  "prefs": {
    "where": [
      [
        "Rich Client Preferences",
        "관리 기능",
        "Site/Group/Role/User 등 실제 범위"
      ],
      [
        "Access Manager",
        "관리 기능",
        "객체 접근 규칙"
      ],
      [
        "Organization",
        "관리 기능",
        "사용자와 그룹·역할"
      ],
      [
        "변경 이력",
        "내부 구성 대장",
        "이전값 및 적용 범위"
      ]
    ],
    "how": [
      "Preference 이름을 제품 버전의 Reference에서 검색해 값 형식, 범위, 적용 시점을 확인한다. 같은 키가 여러 범위에 등록될 수 있으므로 실제 적용 값을 확인한다.",
      "Access Manager의 권한 결과는 객체 소유자, 그룹, 역할, 상태 등 조건과 연결된다. 동일 객체에 대해 허용 사용자와 제한 사용자의 결과를 비교한다.",
      "변경 전 기존 값을 내보내거나 안전하게 기록한다. 최소 범위 변경 후 새 세션 또는 필요한 적용 절차를 통해 테스트하고 기존 제한 사용자의 접근이 확대되지 않았는지 확인한다."
    ],
    "result": "UI 표시 여부, Preference 영향, 실제 객체 접근 권한을 분리해 판단한다."
  },
  "bmide": {
    "where": [
      [
        "BMIDE workspace",
        "개발자별 작업 경로",
        "모델 프로젝트와 템플릿"
      ],
      [
        "배포 패키지",
        "버전 관리 산출물",
        "환경별 배포 입력"
      ],
      [
        "TC_ROOT / TC_DATA",
        "대상 환경",
        "제품·모델 구성"
      ],
      [
        "DB / metadata cache",
        "운영 환경",
        "모델 반영 및 조회"
      ]
    ],
    "how": [
      "기존 Business Object 타입을 확장할지 새 타입이 필요한지 결정한다. 속성의 저장 방식, 필수값, LOV, 관계 및 상속을 검토한다.",
      "BMIDE의 모델 검증과 패키지 생성 후 기존 템플릿 의존성을 기록한다. 검증 환경에서 해당 릴리스 지원 DC/TEM 배포 방식으로 적용한다.",
      "기존 데이터 조회, 새 객체 생성, 속성 수정, 검색, 워크플로 및 권한을 시험한다. 모델 변경은 DB 구조와 연관될 수 있으므로 UI 산출물처럼 단순 덮어쓰기로 원복하지 않는다."
    ],
    "result": "신규 모델과 기존 객체 모두 정상이어야 하며 여러 Enterprise 노드의 모델/metadata cache 불일치 여부를 확인한다."
  },
  "aw": {
    "where": [
      [
        "AW Client Builder / 개발 workspace",
        "DC에 등록된 실제 위치",
        "AW 커스터마이징 소스"
      ],
      [
        "View / ViewModel / Stylesheet",
        "해당 릴리스 개발 구조",
        "화면, 동작, 속성 표시"
      ],
      [
        "빌드 로그 / 산출물",
        "실제 빌드 경로",
        "의존성 및 결과"
      ],
      [
        "Gateway / Browser",
        "실행 환경",
        "배포 결과 및 요청 오류"
      ]
    ],
    "code": "# AW 프로젝트에서 설치된 도구 버전 조회\nnode --version\nnpm --version\n# package.json과 릴리스 문서에서 지원되는 빌드 스크립트 확인",
    "how": [
      "화면에 필요한 데이터가 BMIDE 모델과 실제 객체에 존재하는지 먼저 확인한다. 권한, Stylesheet, ViewModel의 조건에 따라 동일 객체도 다르게 표시될 수 있다.",
      "AW 빌드 도구 및 Node 버전은 대상 릴리스와 일치해야 한다. OneNote TC14 사례의 명령을 2606의 고정 절차로 사용하지 않는다. 프로젝트의 실제 빌드 스크립트와 의존성을 확인한다.",
      "검증 환경에서 배포하고 브라우저 Console과 Network에서 모듈/정적 파일/API 요청을 확인한다. 사용자의 역할별 화면과 저장 결과를 시험한다."
    ],
    "result": "빌드 성공, 배포 성공, 브라우저 동작, 실제 업무 데이터 저장을 구분한다."
  },
  "workflow": {
    "where": [
      [
        "Workflow Designer",
        "Rich Client 관리 기능",
        "템플릿 및 Task 구조"
      ],
      [
        "Handler 구성",
        "Task별 Rule/Action",
        "조건·처리 동작"
      ],
      [
        "대상 객체",
        "업무 시험 데이터",
        "Target/Reference 및 상태"
      ],
      [
        "Workflow 이력",
        "업무 객체/작업 정보",
        "실행 결과"
      ]
    ],
    "how": [
      "템플릿에서 시작·검토·승인·반려 흐름 및 Task 담당자 결정 방식을 설계한다. Target 객체와 Reference 객체를 구분한다.",
      "Rule Handler는 조건을 판단하고 Action Handler는 동작을 수행한다. 정확한 Handler 이름과 인수는 해당 릴리스 Workflow Handler Reference에서 확인한다.",
      "시험 객체를 첨부해 승인, 반려, 재작업, 조건 불충족을 각각 재현한다. Task 상태, 대상 객체 상태, 릴리즈 상태를 확인하고 진행 중인 인스턴스에 대한 영향은 별도로 검증한다."
    ],
    "result": "승인 경로뿐 아니라 실패·반려 경로도 의도대로 작동하고 권한이 없는 사용자의 승인 가능성이 없는지 확인한다."
  },
  "jenkins": {
    "where": [
      [
        "Git repository",
        "소스 및 Jenkinsfile",
        "변경 이력"
      ],
      [
        "Jenkins job / Console Output",
        "CI 서버",
        "빌드 로그와 번호"
      ],
      [
        "Artifacts",
        "환경별 패키지",
        "BMIDE/AW/서버 코드"
      ],
      [
        "대상 환경",
        "DC/TEM 및 서비스",
        "실제 배포 이력"
      ]
    ],
    "how": [
      "Jenkinsfile에서 checkout, build, test, artifact, deploy, verify 단계를 식별한다. Git commit ID와 빌드 번호를 산출물에 연결한다.",
      "TC 서버 코드와 BMIDE 모델, AW 화면, Dispatcher 및 설정 변경을 별도 산출물로 구분한다. DB 변경 여부에 따라 배포·복구 전략이 달라진다.",
      "운영 배포 승인 전 검증 환경 결과와 산출물 체크섬을 대조한다. 비밀정보는 승인된 credentials 관리 기능을 사용하고 콘솔 출력에 남기지 않는다."
    ],
    "result": "같은 commit과 artifact로 어느 환경에 무엇이 반영되었는지 추적 가능해야 한다."
  },
  "login-error": {
    "where": [
      [
        "브라우저 / Rich Client",
        "접속 오류 및 시각",
        "클라이언트 범위"
      ],
      [
        "Gateway/Web 로그",
        "실제 서비스 위치",
        "HTTP 오류"
      ],
      [
        "Server Manager / tcserver syslog",
        "Enterprise 노드",
        "프로세스·DB·라이선스"
      ],
      [
        "IdP / License / DB",
        "각 관리 서비스",
        "의존성 실패"
      ]
    ],
    "how": [
      "전체 사용자, 특정 그룹, 특정 노드, 특정 클라이언트로 범위를 나눈다. 브라우저 페이지 자체 실패와 인증 이후 실패를 구분한다.",
      "Connection refused는 대상의 연결 수신이 실패했다는 단서이므로 실제 서비스 주소·수신 상태와 네트워크를 확인한다. tcserver가 종료되면 초기화 syslog에서 DB·라이선스 오류를 조사한다.",
      "최근 변경 사항(인증서, DNS, 패치, 설정)과 최초 오류 발생 시각을 대조한다. 설정 복구 후 신규 세션에서 대표 역할의 객체 조회까지 시험한다."
    ],
    "result": "다른 사용자와 다른 노드도 같은 요청을 수행해 범위가 해소되었는지 판단한다."
  },
  "cache-error": {
    "where": [
      [
        "tcserver syslog",
        "Enterprise 노드",
        "Shared Metadata Cache 오류와 버전"
      ],
      [
        "TC_DATA / 모델 배포 기록",
        "실제 환경",
        "모델·구성 버전"
      ],
      [
        "TC_ROOT/bin",
        "유틸리티 설치 위치",
        "generate_metadata_cache 존재와 지원 옵션 확인"
      ]
    ],
    "code": "# 파일 존재 여부만 확인 (실행하지 않음)\nls \"$TC_ROOT/bin\"/generate_metadata_cache*",
    "how": [
      "Shared Metadata Cache out of date 메시지에서 모델 버전과 캐시 버전 차이를 읽고 BMIDE 배포 시각과 비교한다. OneNote 2023 사례는 구버전 운영 기록이다.",
      "Enterprise 노드가 참조하는 모델과 캐시가 동일한지 조사한다. generate_metadata_cache의 정확한 실행 옵션, 인증 및 서비스 상태 조건은 해당 릴리스 공식 문서를 확인한다.",
      "메타데이터 캐시 생성은 승인된 변경 작업이다. 백업 및 복구 범위를 확정하고 실행 후 여러 노드의 로그인, 타입 조회, 객체 생성 및 연계 서비스를 시험한다."
    ],
    "result": "단일 노드에서만 오류가 사라지는지 전체에서 동일한지 검증한다. 로그 근거 없는 캐시 삭제는 하지 않는다."
  },
  "file-error": {
    "where": [
      [
        "Dataset Named Reference",
        "Rich Client",
        "문제 파일 및 Volume"
      ],
      [
        "FMS_HOME",
        "FSC 구성·로그",
        "전송 경로 및 오류"
      ],
      [
        "Volume mount",
        "실제 저장소 경로",
        "파일 시스템과 권한"
      ],
      [
        "FCC log",
        "클라이언트 설정 위치",
        "클라이언트 전송 실패"
      ]
    ],
    "how": [
      "같은 사용자로 객체 조회, 다운로드, 업로드를 각각 시험하고 문제가 특정 파일·Volume·클라이언트에 한정되는지 확인한다.",
      "FSC proxy -9101은 기존 OneNote 사례에서 metadata cache 관련 해결이 있었지만 모든 동일 오류의 원인이 아니다. FSC 경로, 인증, 설정, Volume 연결, 로그와 최근 모델 변경을 함께 조사한다.",
      "정상 파일과 실패 파일의 전송 경로를 비교하며 원본 Volume을 직접 수정하지 않는다. 캐시 갱신은 불일치 로그가 있고 공식 절차가 확인된 경우에만 수행한다."
    ],
    "result": "다운로드 파일의 크기/해시와 신규 업로드 후 다운로드를 검증하고 다른 Volume도 정상인지 확인한다."
  },
  "search-error": {
    "where": [
      [
        "AW Global Search",
        "사용자 화면",
        "검색 조건·권한"
      ],
      [
        "직접 객체 조회",
        "Rich Client/AW",
        "원본 존재 여부"
      ],
      [
        "TC_ROOT/TcFTSIndexer/bin",
        "Indexer 호스트",
        "상태 조회 유틸리티"
      ],
      [
        "TcFTSIndexer/log* / Solr",
        "Search 계층",
        "실패와 지연"
      ]
    ],
    "code": "# 실제 실행 환경과 지원 옵션을 확인한 뒤\nrunTcFTSIndexer -status",
    "how": [
      "ID 직접 조회와 검색 결과가 일치하지 않으면 동일 사용자와 타입, 필터, 권한을 확인한다. 원본 조회 자체가 실패하면 인덱스를 먼저 고치지 않는다.",
      "Indexer flow, 로그, 마지막 반영 시간, Solr 상태를 조사한다. 검색 스키마 변경과 FTSIndexer Files Dataset의 버전 차이를 확인한다.",
      "대상 범위를 제한한 공식 재색인 방식이 지원되는지 확인한다. 전체 재색인은 공간과 업무 영향, DB 부하를 평가한 승인 작업으로 취급한다."
    ],
    "result": "대표 변경 객체가 검색에 반영되고, 권한 없는 데이터가 검색에 나타나지 않는지 확인한다.",
    "ref": "Siemens Community: https://community.sw.siemens.com/s/article/Resolving-Schema-Update-Issues-in-Teamcenter-Indexing-for-Active-Workspace"
  },
  "convert-error": {
    "where": [
      [
        "Dispatcher request ID",
        "업무 요청",
        "입력 및 상태"
      ],
      [
        "Scheduler/Module/Client",
        "컴포넌트 로그",
        "배정·실행·등록"
      ],
      [
        "Translator 설정",
        "실제 Module 구성",
        "시간 제한 및 실행 환경"
      ],
      [
        "Staging / result",
        "작업별 경로",
        "출력 생성 여부"
      ]
    ],
    "how": [
      "요청 시각, 실패 시각, 실제 출력 생성 시각을 기록한다. 정상 파일과 실패 파일의 입력 형식, 파일 크기, 페이지 수 또는 복잡도를 비교한다.",
      "No files generated 같은 오류가 보이면 출력이 실제 생성되지 않았는지 또는 확인 시간 안에 생성되지 않았는지 구별한다. 출력이 있으면 Client의 결과 등록 실패도 조사한다.",
      "OneNote PDF 사례의 FileCheckPause, FileCheckWait, FileCheckWaitForZero, NOGUI_TIMEOUT은 해당 Translator 버전에서 설정 이름과 단위를 확인할 대상이다. 기존 환경의 숫자를 기본값으로 복사하지 않는다."
    ],
    "result": "시간 제한 조정으로 큐가 밀리거나 대기 시간이 증가하지 않는지 정상·복잡 파일을 모두 시험한다."
  },
  "aw-error": {
    "where": [
      [
        "Browser Console/Network",
        "F12",
        "JS 오류 및 실패 HTTP 요청"
      ],
      [
        "AW 빌드 로그",
        "CI 또는 Client Builder",
        "의존성/모듈 문제"
      ],
      [
        "Gateway/API 로그",
        "실제 등록 경로",
        "인증·라우팅"
      ],
      [
        "배포 산출물",
        "실제 경로",
        "버전과 파일 존재 여부"
      ]
    ],
    "how": [
      "흰 화면 발생 시 최초 Console 오류와 첫 실패 요청을 기록한다. 강제 새로고침 전에 정상/실패 세션의 차이를 확보한다.",
      "401이 빌드 의존성 다운로드 중 발생한 것인지 브라우저 API 호출 중인지 구분한다. 전자는 패키지 접근 설정, 후자는 인증·Gateway 경로를 조사한다.",
      "Module not found는 빌드 산출물 및 의존성 버전을 확인한다. 배포 버전이 이전과 혼용되지 않았는지 확인하고 새 세션·다른 역할에서 실제 저장을 시험한다."
    ],
    "result": "화면 표시뿐 아니라 기능 실행과 요청 성공 여부를 검증한다."
  },
  "ai": {
    "where": [
      [
        "DC Applications / Components",
        "2606 배포 환경",
        "Teamcenter Copilot 및 AI Microservices"
      ],
      [
        "AWS Bedrock",
        "AWS 계정/Region",
        "지원 모델·Inference Profile·Embedding"
      ],
      [
        "OpenSearch Serverless",
        "Vector search 컬렉션",
        "임베딩 검색"
      ],
      [
        "IAM / 네트워크",
        "AWS 관리 환경",
        "권한 및 접근 정책"
      ],
      [
        "AI 서비스 로그",
        "실제 배포 환경",
        "색인·검색·모델 오류"
      ]
    ],
    "how": [
      "AI를 사용하지 않는 기본 Teamcenter/AW 검색 경로와 Copilot의 색인·임베딩·검색·모델 호출 경로를 구분한다. 2606 DC에서 선택된 컴포넌트를 확인한다.",
      "AWS 구성 가이드의 지원 모델과 Region, Bedrock 호출 권한, OpenSearch Serverless 데이터 접근·네트워크 정책을 실제 계정 구성과 비교한다. ARN, Region, 계정 ID는 환경별 값이다.",
      "색인된 문서 수와 실패량, 검색 결과, LLM 호출 오류 및 응답 지연을 별도로 수집한다. 권한이 없는 자료가 검색·응답에 노출되지 않는지 테스트한다."
    ],
    "result": "모델 호출 성공만으로 정상 판정하지 않고 실제 문서 검색 및 답변의 근거와 사용자 권한을 검증한다.",
    "ref": "Google Drive Teamcenter 2606 AWS/DC 구축 가이드 (2026-10-27); 실제 지원 모델은 제품 버전 문서 확인"
  },
  "integration": {
    "where": [
      [
        "SOA/REST 또는 CAD 연동",
        "설치된 클라이언트/서버",
        "인터페이스와 버전"
      ],
      [
        "Gateway / 서비스 로그",
        "요청 처리 계층",
        "요청 ID·실패"
      ],
      [
        "외부 연동 큐/이력",
        "실제 통합 제품",
        "재시도 및 상태"
      ],
      [
        "Teamcenter / 외부 시스템",
        "데이터 원본",
        "ID 매핑과 결과"
      ]
    ],
    "how": [
      "연동별 호출 방향, 객체 ID와 속성 매핑, 원본 시스템, 인증, 타임아웃 및 재시도 정책을 표로 정리한다. 데이터 주체를 정해 양쪽 수정 충돌을 예방한다.",
      "요청 ID로 송신·수신 로그를 대조하고 원격 저장은 성공했지만 응답이 유실된 경우와 실제 저장 실패를 구분한다.",
      "검증 환경에서 정상 처리, 실패, 중복 요청, 재시도와 권한 제한을 시험한다. 버전 업그레이드 시 API 호환성과 인증 변경을 점검한다."
    ],
    "result": "양쪽 객체의 ID·상태·관계가 일치해야 하며 동일 요청의 재시도에 중복 데이터가 없는지 확인한다."
  },
  "handover": {
    "where": [
      [
        "환경대장",
        "내부 접근제어 문서",
        "서버별 버전/역할/실제 경로"
      ],
      [
        "DC/TEM 및 Git",
        "배포·모델 이력",
        "릴리스와 산출물"
      ],
      [
        "로그/모니터링",
        "서비스별 위치",
        "장애 기준선"
      ],
      [
        "백업 및 복구 기록",
        "내부 복구 저장소",
        "복구 시점과 시험 결과"
      ]
    ],
    "how": [
      "인수 대상 서버의 TC_ROOT, TC_DATA, FMS_HOME, Volume, 검색/변환/웹 서비스 실제 경로와 서비스 이름을 운영대장에 작성한다.",
      "검증 환경에서 로그인, 객체 생성, 파일 업로드·다운로드, 검색, 승인, 장애 로그 수집을 인수자가 직접 수행한다. 결과를 정상 상태의 기준 기록으로 유지한다.",
      "백업 복구 시험과 변경 승인 체계, 접근 권한, 공급사 지원 경로, 잔여 기술 부채를 기록한다. 실제 비밀정보는 접근 통제된 별도 관리체계로 인계한다."
    ],
    "result": "어떤 장애에서 어느 호스트와 로그를 확인할지 설명할 수 있고 승인된 복구 절차 및 담당자를 찾을 수 있어야 한다."
  }
}
