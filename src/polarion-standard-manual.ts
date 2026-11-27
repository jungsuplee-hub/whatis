export const polarionStandard:Record<string,[string,string,string]>={
  "architecture": [
    "/opt/polarion; /opt/polarion/data/svn/repo; /opt/polarion/data/postgres-data; Apache polarionSVN.conf",
    "서버별 Apache, Polarion JVM, SVN, PostgreSQL 및 외부 첨부 역할을 구성도에 기록한다. 브라우저 → Apache → Polarion과 Polarion → SVN/DB의 연결을 분리하고 각 실제 서비스 이름 및 주소를 확인한다.",
    "로그인이 정상인데 검색만 실패하면 인덱스/DB부터, 저장 자체가 실패하면 SVN·권한·저장소를 우선 조사한다. Cluster의 공유 계층은 노드별 장애와 분리한다."
  ],
  "cluster": [
    "/opt/polarion/shared (예시); /opt/polarion/etc/polarion.properties; Coordinator/Node/LB 관리 화면",
    "각 노드에서 findmnt -T 실제 공유 경로를 실행하고 동일 파일시스템을 보는지 확인한다. 노드의 제품 버전, Coordinator 관리 설정, LB 등록과 헬스체크를 대조한다.",
    "한 노드만 오류이면 LB에서 해당 노드의 상태와 로그를 비교한다. 여러 노드가 동일 오류이면 공유 SVN/DB/인증/Coordinator를 우선 조사한다."
  ],
  "paths": [
    "/opt/polarion/bin; /opt/polarion/etc; /opt/polarion/polarion/configuration; /opt/polarion/data",
    "아래 Linux 경로표와 실제 설치 경로를 대조한다. ls -ld 및 findmnt -T를 사용하여 별도 디스크 또는 심볼릭 링크 여부를 확인한다. Windows는 실제 설치 루트 및 서비스 실행 경로 기준으로 매핑한다.",
    "data/svn/repo와 외부 첨부는 원본, workspace의 색인·작업 데이터는 복구 방법이 다른 영역이다. polarion-data.saved도 현재 원본 SVN과 동일하지 않다."
  ],
  "ports": [
    "polarion.properties; Apache VirtualHost/Proxy 설정; DB/SVN 서비스 실제 수신 주소",
    "ss -lnt로 호스트별 리스닝 포트를 조회한 다음 공식 연결표와 대조한다. Apache 외부 HTTPS와 내부 Polarion/DB/SVN/AJP 연결을 별도로 표시한다.",
    "포트가 열려 있어도 제품 인증·TLS·권한·응답은 별도로 확인한다. 포트 번호 예시는 설치 구성에 따라 달라질 수 있다."
  ],
  "sizing": [
    "공식 2606 사이징 표; 서버 모니터링; /opt/polarion/data",
    "동시 사용자를 기준으로 등급을 찾고 프로젝트 수 및 SVN 규모가 더 높은 등급인지 비교한다. free -h, df -h, vmstat 1 5 등으로 실제 자원 사용량과 피크 업무를 수집한다.",
    "표의 CPU/RAM/Java 메모리는 전체 클러스터 합계가 아닌 노드 기준인지 확인한다. heap 외 OS/DB/Apache 여유를 남기고 부하 시험으로 확정한다."
  ],
  "hardware": [
    "/opt/polarion/etc/config.sh; polarion.properties; PostgreSQL 설정; Apache MPM",
    "CPU를 변경하면 색인 workers와 SQL pool 관련 계산을 함께 확인하고 RAM을 변경하면 JVM heap과 Apache 프로세스 예산을 검토한다. 기존 값과 실제 사용량을 먼저 기록한다.",
    "CPU/RAM 증설만으로 병목이 해결됐는지 단정하지 않는다. 같은 작업량에서 응답시간·GC·DB 대기·I/O를 비교한다."
  ],
  "license": [
    "Administration > License; 실제 라이선스 서버; SALT_LICENSE_SERVER (SALT 환경)",
    "라이선스 방식, Named/Concurrent 할당, 만료일과 사용량을 확인한다. 기존 방식은 Reactivate, SALT 방식은 해당 서버의 갱신 절차를 사용한다.",
    "인증 성공과 라이선스 할당 성공을 분리한다. 갱신 후 대표 계정 로그인 및 기능 사용 결과를 확인한다."
  ],
  "install": [
    "/opt/polarion (Linux 기본 예시); /opt/polarion/etc/polarion.properties; /opt/polarion/bin/polarion.init",
    "지원 OS/Java/SVN/PostgreSQL/Apache 조합과 설치 패키지를 확정한다. java -version, df -h, hostname 등으로 전제조건을 확인하고 문서의 설치 스크립트 순서를 따른다.",
    "설치 종료 이후 startup 로그와 실제 웹 접속, 프로젝트 생성·Work Item 저장·검색을 확인한다. 기본 설정 그대로 운영에 공개하지 않는다."
  ],
  "release": [
    "/opt/polarion/polarion/.eclipseproduct; 제품 UI 버전; 패치 이력",
    "기존 버전과 대상 버전을 파일 및 화면에서 대조하고 Release Notes와 Resolved Issues로 변경 사항을 분류한다. 확장 기능, 인증, DB 및 보안 헤더의 릴리스별 변화도 확인한다.",
    "기본 버전과 누적 패치를 구분한다. 패치 적용 완료 로그 및 실제 설치 식별자를 기록한다."
  ],
  "upgrade": [
    "배포 ZIP의 update.sh; warnings.txt; /opt/polarion/etc; SVN/DB/외부 첨부 백업",
    "검증 환경에서 현재→대상 버전 경로로 업데이트하고 실행 시간·warnings.txt·구성 변경을 기록한다. 서비스의 중지/유지 조건은 해당 릴리스 문서에 따른다.",
    "업데이트 성공 메시지 외 로그인·저장·검색·첨부·REST·Job 확인이 필요하다. DB/저장소 변경 후 바이너리만 원복하지 않는다."
  ],
  "updatecluster": [
    "Coordinator; Node A/B/C (역할 예시); Load Balancer; 공유 저장소; update.sh",
    "문서의 3-Node 예시를 실제 노드 목록에 매핑하고 LB 제외, 첫 노드 사전 전환, 전체 중단, Coordinator 및 공유 서비스 전환, 잔여 노드 업데이트 순서를 문서와 대조한다.",
    "다른 버전 노드를 동시에 사용자 트래픽에 노출하지 않는다. 노드별 버전·색인·공유 서비스 및 실제 요청을 검증한다."
  ],
  "migration": [
    "Global Administration > Projects > Export/Import; Job log; ZIP 아카이브",
    "원본 프로젝트 Export를 실행한 후 Job 결과에서 파일 생성 여부를 확인한다. 대상 ID, Folder Name, Location 충돌 및 ZIP 제한을 검토한다.",
    "Import 완료 후 Work Item·LiveDoc·링크·첨부·권한을 확인하고 일부 실패한 경우 중복 반영 여부부터 조사한다."
  ],
  "svn-transfer": [
    "/opt/polarion/data/svn/repo; 원본/대상 SVN repository; svnadmin",
    "원본 UUID·revision 및 대상 상태를 svnlook으로 확인한다. 전체/증분 이동의 차이와 공식 dump/load 또는 hotcopy 적용 범위를 검토한다.",
    "복구된 repository의 revision과 UUID, 대표 경로 및 실제 Polarion 조회를 비교한다. 운영 저장소를 직접 덮어쓰지 않는다."
  ],
  "preview": [
    "Administration의 문서/Import 기능; Image Converter 구성; 실제 converter 로그",
    "원본 Word 문서에서 OLE, WMF/EMF, 수식 등 문제가 되는 콘텐츠를 구분한다. 간단한 테스트 문서와 문제 문서를 각각 Import하여 결과를 비교한다.",
    "원본 문서가 정상이어도 변환 가능한 형식은 제품 버전과 Converter 지원 범위에 따라 달라진다."
  ],
  "handover": [
    "/opt/polarion/etc/polarion.properties; config.sh; data/svn/repo; data/logs/main; PostgreSQL 및 Apache 경로",
    "서버마다 실제 경로, 버전, 서비스명, mount, 주소, 담당자 및 복구 범위를 환경대장에 적는다. 표준 예시와 실측 값을 별도 열에 기록한다.",
    "인수자가 테스트 환경에서 로그인·Work Item 저장·검색·첨부·Job 확인과 로그 수집을 수행하고 복구 시험 결과를 설명할 수 있어야 한다."
  ],
  "service": [
    "/opt/polarion/bin/polarion.init; systemctl status polarion; /opt/polarion/data/logs/main",
    "systemd 환경에서 서비스 상태와 journal을 보고 실제 unit의 실행 파일을 확인한다. 공식 스크립트 방식도 실제 설치에 맞게 구분한다.",
    "Running 상태와 업무 정상은 다르다. startup/main 로그, 저장·검색 및 History indexing 상태를 함께 확인한다."
  ],
  "version-check": [
    "/opt/polarion/polarion/.eclipseproduct; 제품 버전 표시; update 로그",
    "설치 루트의 .eclipseproduct 존재와 실제 버전 표시를 대조한다. 파일의 값과 패치 설치 결과를 기록하고 모든 Cluster 노드에서 비교한다.",
    "노드마다 설치 버전이 다르면 LB 및 업데이트 상태를 검토한다. 폴더명만으로 버전을 단정하지 않는다."
  ],
  "svn": [
    "/opt/polarion/data/svn/repo; polarion.properties의 repoSystem; polarionSVN.conf",
    "svnlook youngest와 uuid로 실제 repository를 확인한다. 사용자 HTTP(S) 접근과 서버 내부 svnserve 접근이 어떻게 구분되는지 설정을 대조한다.",
    "SVN CPU 증가를 사용자 요청, 내부 색인, access 변경, 저장소 I/O와 연결한다. 원본 저장소에 대한 임의 쓰기 작업은 피한다."
  ],
  "postgres": [
    "/opt/polarion/data/postgres-data (기본 예시); DBMS의 SHOW config_file; SHOW data_directory",
    "승인된 DB 조회 계정으로 실제 데이터/설정 파일 및 max_connections, shared_buffers를 확인한다. pg_stat_activity의 state와 wait_event_type을 집계한다.",
    "연결 수 증가와 실제 활성·대기 연결을 구분한다. SQL pool 크기와 DB 연결 상한을 함께 확인하며 운영 DB에 직접 데이터 수정을 하지 않는다."
  ],
  "apache": [
    "/etc/httpd/conf.d/polarionSVN.conf (RHEL); /etc/apache2/conf-available/polarionSVN.conf (Debian 계열)",
    "httpd -V, -M, -t -D DUMP_RUN_CFG로 실제 MPM, 모듈, 실행 설정을 조회한다. Debian 계열은 설치된 apache2ctl 등 대응 명령을 확인한다.",
    "ServerLimit, ThreadsPerChild, MaxRequestWorkers 및 MaxConnectionsPerChild의 관계를 확인하고 실제 RSS와 요청 지연을 기준으로 조정한다."
  ],
  "svn-maintenance": [
    "실제 SVN repository; svnserve 서비스/로그; svnadmin help pack",
    "svnlook으로 revision과 저장소 경로를 확인하고 svnadmin help pack으로 설치된 도구 지원을 확인한다. 유지보수 전 저장소 형식 및 백업을 확인한다.",
    "pack과 백업/검증은 서로 다른 작업이다. 운영 작업 후 repository 접근과 Polarion 실제 저장을 확인한다."
  ],
  "pg-maintenance": [
    "PostgreSQL 관리 세션; pg_stat_user_tables; log_min_duration_statement",
    "테이블별 n_dead_tup과 autovacuum 시각, DB 대기 및 쿼리 지연을 조사한다. 설정 변경 전 실제 디스크와 업무 부하를 비교한다.",
    "VACUUM과 VACUUM FULL의 잠금/공간 특성이 다르므로 FULL을 일상적인 해결책으로 취급하지 않는다."
  ],
  "apache-logs": [
    "Apache access/error log 실제 경로; VirtualHost LogFormat; logrotate 구성",
    "로그의 시간 단위와 필드 정의를 먼저 확인하고 요청 URI, 상태, 요청 처리시간을 같은 구간에서 비교한다. 로그 경로는 실제 설정으로 확인한다.",
    "graceful과 전체 재기동의 차이를 고려한다. 로그 회전 이후 누락 또는 파일 디스크립터 문제가 없는지 확인한다."
  ],
  "jvm": [
    "/opt/polarion/etc/config.sh; 실제 Java 프로세스 및 startup 로그",
    "config.sh의 heap 설정과 실행 JVM의 실제 옵션이 일치하는지 확인한다. JVM heap, native memory, OS available memory와 swap을 구분한다.",
    "GC 지연, OOM, 높은 RSS가 각각 의미하는 바를 구분한다. JVM 최대 heap을 전체 RAM과 동일하게 설정하지 않는다."
  ],
  "ehcache": [
    "/opt/polarion/polarion/configuration/ehcache.xml; platform.jar 원본; main 로그",
    "해당 릴리스의 원본 cache 정의와 사용자 override를 비교한다. cache별 HITS/MISSES/GETS/EVICTION을 동일 시간 구간에서 비교한다.",
    "cache 한도 증가가 GC·heap 부담을 늘릴 수 있다. XML validation 오류와 warm-up 이후 처리량을 함께 확인한다."
  ],
  "index": [
    "Administration > Maintenance > Index; /opt/polarion/bin/polarion.init; data/workspace/polarion-data",
    "원본 SVN과 권한을 확인한 후 Refresh Index, Check Index의 범위와 Job 결과를 비교한다. 전체 reindex 전 .saved 경로, 공간, 색인 방식을 확인한다.",
    "core index 완료와 History/Attachment indexing 완료를 구분한다. 검색·이력·첨부를 각각 확인한다."
  ],
  "location": [
    "polarion.properties: com.siemens.polarion.platform.locationIndex.enabled; Location Index 문서; DB/backup",
    "2606에서는 Object Maps와 early-adoption Location Index를 동시에 활성화할 수 없다. 현재 활성 속성 및 데이터 방식과 백업 호환 조건을 확인한다.",
    "전환은 단순 속성 변경이 아닌 별도 마이그레이션으로 계획한다. 백업 생성 당시의 속성 값과 복원 환경이 맞는지 확인한다."
  ],
  "jvm-diagnostics": [
    "Java PID; /opt/polarion/etc/config.sh; GC/JFR 및 startup 로그",
    "free -h와 vmstat로 시스템 압력을 확인한 후 실제 Java PID를 식별한다. 대상 JVM이 지원하는 진단 도구와 권한, 부하를 검토한다.",
    "GC와 스레드 대기, swap, DB 지연을 동일 시간대에서 비교한다. 진단 자료의 민감정보는 접근을 제한한다."
  ],
  "logs": [
    "/opt/polarion/data/logs/main; log4j2.xml; Apache access/error; PostgreSQL 로그",
    "날짜별 startup/main/TX/RPC/REST 등 실제 파일 목록을 찾고 오류 발생 시각의 첫 예외를 읽는다. Apache와 DB 로그도 같은 시간대로 맞춘다.",
    "WARN의 개수만으로 장애를 단정하지 않는다. 정상 요청과 실패 요청을 비교하고 로그 출력 설정 변경은 별도 승인한다."
  ],
  "txlogger": [
    "data/logs/main의 TX 로그; REST/RPC 로그; 실제 날짜 파일",
    "TX 로그의 시간·요청/트랜잭션 정보와 처리 시간을 확인한다. 동일 시간대 RPC/REST 및 Apache 요청을 연결해 느린 업무를 찾는다.",
    "긴 트랜잭션과 전체 요청 지연이 동일 원인인지 추가 확인한다. 로그 포맷은 실제 릴리스 정의를 따른다."
  ],
  "diagtool": [
    "설치된 diagtool 실제 디렉터리; diagtool 공식 문서; 결과 저장 위치",
    "설치된 도구의 도움말과 공식 옵션을 확인하고 필요한 진단 모듈을 선택한다. 출력 경로와 수집 범위 및 실행 부하를 사전에 확인한다.",
    "정상/장애 구간 자료를 비교한다. 진단 결과에는 설정 및 개인정보가 있을 수 있으므로 외부 공유 전 검토한다."
  ],
  "jobs": [
    "Monitor > Scheduled Jobs; Global Administration > Scheduler; data/logs/main",
    "Job 이름, scope, 시작/완료 시각과 결과를 확인한다. 예약 설정과 실제 실행 이력을 대조하고 중복 Job 여부를 조사한다.",
    "Scheduled 상태와 실행 완료를 구분한다. 실패 원인과 일부 반영 여부를 확인하지 않고 반복 실행하지 않는다."
  ],
  "scheduler": [
    "Global Administration > Scheduler; Job XML 구성; Monitor",
    "Job ID와 이름, scope, 스케줄, 파라미터를 확인한다. 시간대와 중복 실행 가능성을 검토하고 검증 환경에서 실행한다.",
    "설정 저장과 Job 실행 성공은 별개다. 실행 로그와 업무 결과, 다음 예정 시간까지 확인한다."
  ],
  "job-history": [
    "Monitor > Scheduled Jobs; /opt/polarion/data/logs/main",
    "Job 이름 및 오류 시각을 기준으로 Monitor 결과와 날짜별 로그를 대조한다. 실패, 정상 완료, 중단 등의 상태와 실제 출력물을 확인한다.",
    "정상 완료라도 대상 데이터 반영이 없을 수 있으므로 결과 경로와 실제 데이터까지 확인한다."
  ],
  "backup": [
    "SVN/DB/외부 첨부/설정 백업; Scheduler Index Backup; /opt/polarion/bin/restore.sh",
    "인덱스 backup과 전체 재해 복구 백업 범위를 구분한다. 대상 백업의 시각, 버전, Object Maps/Location Index 호환 조건과 복원 시험 결과를 확인한다.",
    "복구 후 백업 이후 SVN 변경의 색인 반영, 실제 Work Item·이력·첨부 조회를 검증한다."
  ],
  "api": [
    "Polarion REST API 설정; 대상 프로젝트 권한; REST API 문서; REST 로그",
    "활성화 여부 및 지원되는 API 버전을 확인하고 읽기 요청부터 시험한다. 리소스 경로, HTTP 상태, pagination과 필요한 fields를 확인한다. 토큰은 공개하지 않는다.",
    "401/403/404/429/5xx의 의미와 실제 응답을 구분하고 쓰기 요청은 검증 환경에서 권한과 중복 처리를 확인한다."
  ],
  "script": [
    "Administration의 Script/Workflow 구성; 승인된 스크립트 소스; Job 로그",
    "스크립트가 호출되는 시점, 입력·출력, 실행 사용자, 트랜잭션 및 적용 범위를 정리한다. 검증 프로젝트에서 정상·오류 입력을 시험한다.",
    "업무 데이터가 일부 변경된 실패의 재시도 가능 여부를 확인한다. 로그에 인증정보를 남기지 않는다."
  ],
  "properties": [
    "/opt/polarion/etc/polarion.properties; Config Properties Reference; Cluster Coordinator 관리 설정",
    "정확한 key를 Reference에서 검색해 자료형, 기본값, 지원 버전, 재기동 필요 여부를 확인한다. 아래 설정표의 설명과 실제 적용 값을 비교한다.",
    "변경 전후 key, scope, 값 및 로그를 기록한다. 예시 값을 모든 서버의 기본값으로 복사하지 않는다."
  ],
  "server-config": [
    "/opt/polarion/etc; /opt/polarion/polarion/configuration; systemctl cat polarion; Apache/DB 설정",
    "실제 서비스 unit 및 ExecStart를 통해 설치 경로를 확인한다. 제품 설정과 OS 서비스 설정, 프록시, DB, Cluster 관리 설정을 분리한다.",
    "파일이 존재해도 로드된 설정인지 확인해야 한다. 구문 검증과 적용 후 기능 검증을 수행한다."
  ],
  "auth": [
    "Global Administration > User Management > Authentication; authentication.xml; IdP",
    "Standalone/Cluster에 맞는 관리 화면에서 실제 인증 방식을 확인한다. 관리자 복구 경로와 구성 백업을 확보하고 사용자 매핑·그룹 동기화·인증서 상태를 조사한다.",
    "로그인 성공과 권한 할당 성공을 분리하며 제한 사용자와 관리자 계정의 결과를 모두 확인한다."
  ],
  "authdb": [
    "Apache DBD 설정; PostgreSQL 인증 관련 DB; polarionSVN.conf",
    "2512 이후 관련 변경 조건을 Release Notes 및 설치 문서에서 확인하고 httpd -M으로 필요한 모듈을 조회한다. 실제 연결 설정과 인증 DB 상태를 대조한다.",
    "일반 SVN 접근 실패와 인증 DB 연결 실패를 구분한다. 민감한 연결 문자열을 공개하지 않는다."
  ],
  "headers": [
    "Apache VirtualHost/보안 설정; 2606 제품 보안 설정; 브라우저 Network",
    "대상 릴리스의 헤더 관리 변경 사항을 확인하고 실제 응답에서 CSP 등 헤더의 존재 및 중복 여부를 확인한다. 프록시와 제품 설정의 중복 적용을 조사한다.",
    "헤더를 무조건 제거하지 않고 필요한 UI 및 연동 동작과 보안 정책을 동시에 검증한다."
  ],
  "roles": [
    "Global/Project Administration > User Management > Roles; 사용자·그룹 설정",
    "Global과 Project scope의 역할 구성을 비교한다. 대표 계정의 실제 역할과 작업 권한을 확인하고 상속 및 SVN 동기화 영향을 조사한다.",
    "정상 허용과 정상 거부를 각각 시험한다. 역할을 넓게 부여해 장애를 우회하지 않는다."
  ],
  "access": [
    "Global Administration의 SVN Access File 관리; 실제 access 설정; Synchronize SVN Access File",
    "사용자와 그룹 멤버십, Role scope 및 directory 규칙을 구분한다. Synchronize 전후 그룹과 멤버십의 차이를 확인한다.",
    "동기화가 모든 directory 규칙을 변경하는 것은 아니다. 정상 허용 및 거부 사용자로 저장소 접근을 검증한다."
  ],
  "permissions": [
    "Global/Project Administration 권한 설정; LiveDoc/Work Item 접근; SVN access",
    "프로젝트 역할, 객체 또는 문서 관련 권한, 저장소 접근 결과를 동일 사용자 조건으로 비교한다. 관리자가 보인다고 일반 사용자에게 보이는 것은 아니다.",
    "문서 표시, 편집, 저장, 검색 등 기능별 접근 권한을 시험하고 과도한 권한 부여를 피한다."
  ],
  "attachments": [
    "polarion.properties의 외부 저장소 관련 속성; 실제 외부 첨부 디렉터리; Apache/Polarion 로그",
    "사용 중인 저장 방식과 지원되는 전환 경로를 확인한다. 실제 mount, 용량, 서비스 계정 권한 및 업로드 한도·Antivirus 관련 설정을 조사한다.",
    "HTTP 업로드 성공, 실제 첨부 저장, 다시 열기 및 권한은 별도 검증한다. 외부 저장소도 원본 백업 대상이다."
  ],
  "notifications": [
    "Administration의 알림 설정; 사용자 개인 설정; SMTP 실제 구성; Job/main 로그",
    "업무 이벤트, 대상 사용자, 개인 구독 및 메일 전송 경로를 확인한다. 테스트 이벤트의 발생 시각과 로그를 비교한다.",
    "이벤트가 생성됐는지, 메일 서버에 전달됐는지, 실제 수신됐는지 구분한다."
  ],
  "workflow": [
    "Project/Global Administration > Work Items > Workflow; 상태·Action 설정",
    "타입별 상태와 전이, 역할 조건, Action 조건 및 스크립트의 적용 위치를 확인한다. 설정 상속을 비교하고 시험 Work Item으로 경로를 실행한다.",
    "승인·거부·재작업과 권한 없는 사용자 결과까지 확인한다. 기존 진행 중 객체의 영향도 조사한다."
  ],
  "custom-fields": [
    "Project/Global Administration > Work Items > Custom Fields; Enumerations",
    "필드 ID·타입·필수 여부·적용 Work Item 타입 및 상속 범위를 확인한다. 기존 데이터에 없는 신규 필수값의 영향을 검토한다.",
    "생성/수정/검색/보고서/API에서 값이 일관되게 사용되는지 확인한다."
  ],
  "templates": [
    "Global/Project Administration의 Templates 관련 설정; 실제 템플릿 위치",
    "문서·프로젝트 등 템플릿 유형과 적용 범위를 확인한다. 복사 대상, 링크, 필드, 권한 및 초기 데이터 설정을 시험 프로젝트에서 검증한다.",
    "템플릿 적용 결과가 신규 데이터에 어떻게 반영되는지 확인하고 기존 데이터가 자동 변경된다고 가정하지 않는다."
  ],
  "incident": [
    "장애 접수 기록; Monitor; data/logs/main; Apache/DB/SVN 로그",
    "발생 시각·영향 사용자·프로젝트·노드·기능·최근 변경을 기록한다. 서비스별 정상/실패 요청과 리소스 지표를 확보한다.",
    "근거가 확인된 계층부터 완화하고 변경 전후 동일 요청을 비교한다. 원인 미확정이면 가설로 남긴다."
  ],
  "diag": [
    "OS 지표; Apache access/error; Polarion TX/RPC/REST; SVN/DB 로그",
    "CPU, RAM, I/O, worker, 연결 및 실제 업무 요청을 같은 시간대에서 수집한다. 요청이 처리된 계층과 첫 오류 위치를 조사한다.",
    "높은 CPU나 메모리는 증상일 수 있다. 정상 구간 대비 지연과 오류를 확인하고 근거 있는 병목만 조치한다."
  ],
  "svn-cpu": [
    "svnserve/Apache 프로세스; SVN access log; polarion.properties; 실제 repo",
    "ps와 vmstat 등으로 CPU를 사용하는 프로세스와 I/O를 분리하고 동일 시각 요청을 유형별 집계한다. access 파일 변경 및 색인 Job과 대조한다.",
    "외부 HTTP 요청, 내부 시스템 접근, repository 처리 중 어느 쪽이 병목인지 확인한다. 단순 CPU 수치만으로 원인을 확정하지 않는다."
  ],
  "httpd-memory": [
    "Apache MPM 설정; ps의 RSS; /proc의 PSS (권한 허용 시); free -h",
    "worker 프로세스 수, 스레드, RSS 및 available memory를 비교한다. 공유 메모리가 RSS 합계에 중복될 수 있음을 고려한다.",
    "프로세스 재활용 설정을 원인 분석 없이 낮추지 않는다. 동일 부하에서 오류율·응답시간·메모리 추세를 비교한다."
  ],
  "project-missing": [
    "Global Administration > Projects; SVN 실제 경로; Administration > Maintenance",
    "프로젝트가 원본 repository에 존재하는지, Mark 상태, 사용자 권한 및 검색 index를 순서대로 확인한다.",
    "원본과 권한이 정상이고 색인만 누락된 경우 Refresh/Check를 검토한다. 없는 프로젝트를 바로 다시 생성하지 않는다."
  ],
  "upload-error": [
    "브라우저 Network; Apache error/access; Polarion main; 외부 첨부 경로",
    "문제 파일의 크기/형식과 사용자 권한을 기록하고 응답 상태 및 실패 시각을 확인한다. 프록시 제한, 제품 한도, Antivirus, 저장소 공간을 분리한다.",
    "업로드 완료 후 실제 첨부 목록과 다운로드를 확인한다. 결과가 불확실한 경우 중복 등록 여부를 조사한다."
  ],
  "request-timeout": [
    "Apache Proxy 설정; Polarion main/TX/RPC 로그; 실제 요청 시간",
    "브라우저 또는 API 요청의 시작·실패 시각과 서버 처리 완료 여부를 비교한다. 프록시와 애플리케이션, DB의 시간 제한을 구분한다.",
    "타임아웃을 무조건 늘리지 않는다. 느린 처리 원인과 재시도 시 중복 데이터 가능성을 확인한다."
  ],
  "host-header": [
    "Apache VirtualHost/Proxy; polarion.properties 관련 허용 호스트 설정; HTTP 응답",
    "정상 FQDN과 대체 접속 주소에서 Host 처리 결과를 비교한다. 실제 프록시 전달 헤더 및 제품 지원 설정을 확인한다.",
    "허용 호스트를 무제한으로 열지 않는다. 정상 주소와 차단되어야 할 주소를 각각 시험한다."
  ],
  "open-files": [
    "systemctl show httpd -p LimitNOFILE; 실제 Polarion unit; 프로세스 fd 통계",
    "실제 서비스 unit의 파일 디스크립터 제한 및 현재 열린 파일 수를 비교한다. shell ulimit와 systemd 서비스의 제한이 다를 수 있음을 확인한다.",
    "Too many open files 오류와 실제 한도 도달 여부를 연결한다. 한도 증가와 누수 원인 조사 모두 필요하다."
  ],
  "nodejs-port": [
    "polarion.properties 및 실제 Node.js/Variants 설정; ss -lntp; startup 로그",
    "문서에 제시된 예시 포트와 실제 리스닝 포트를 대조한다. 포트 충돌, Node 프로세스 상태 및 해당 기능을 확인한다.",
    "Node 포트가 열려 있어도 필요한 기능이 정상인지 확인한다. 관련 없는 프로세스를 중지하지 않는다."
  ],
  "cache-recovery": [
    "/opt/polarion/data/workspace/polarion-data; main/startup 로그; 백업 기록",
    "OneNote 사례의 경로 및 cache 종류를 현재 버전과 대조한다. 원본 저장소와 index/cache의 차이 및 공식 재생성 절차를 확인한다.",
    "캐시 폴더를 임의로 삭제하지 않는다. 복구 전후 동일 조회와 저장 결과, 색인 상태를 비교한다."
  ],
  "extension-management": [
    "/opt/polarion/polarion/extensions (설치별 확인); 확장 패키지; startup 로그",
    "확장 기능의 버전, 의존성, 설치 파일과 공식 지원 범위를 확인한다. 검증 환경에서 설치/업데이트 및 필요 기동을 수행한다.",
    "startup의 모듈 로드 오류와 실제 기능을 확인한다. 제품 업데이트 시 기존 확장 호환성을 별도로 검증한다."
  ],
  "integration": [
    "연동 확장/Connector 설정; data/synchronizer; REST/연동 로그",
    "연동별 원본 시스템, 객체 ID 매핑, 방향, 인증, 재시도 및 충돌 정책을 정리한다. 송수신 로그와 실제 양측 데이터 상태를 비교한다.",
    "저장 성공 후 응답 실패와 저장 자체 실패를 구분한다. 무조건 재전송하면 중복·충돌이 발생할 수 있다."
  ],
  "admin": [
    "Global Administration / Project Administration; Monitor",
    "관리 화면의 범위를 확인하고 Global 상속과 Project override를 구분한다. 설정을 변경하기 전에 실제 적용 대상 프로젝트와 관리 권한을 확인한다.",
    "한 프로젝트 설정 변경과 시스템 전역 변경의 영향 범위가 다르다. 사용자 역할별 실제 기능으로 검증한다."
  ],
  "project": [
    "Global Administration > Projects; SVN 경로; 프로젝트 ID 및 Location",
    "신규 프로젝트의 ID·템플릿·경로가 기존과 충돌하지 않는지 확인한다. 기존 경로의 Mark와 신규 생성은 다른 작업이다.",
    "생성/Mark 후 프로젝트 접근, Work Item, 문서 및 권한이 정상인지 확인한다."
  ],
  "project-life": [
    "Global Administration > Projects; 원본 SVN 경로; 링크·권한 이력",
    "Move, Unmark, Delete의 의미와 대상 데이터의 영향 범위를 확인한다. 관련 링크와 외부 연동, 복구 가능성을 검토한다.",
    "Unmark와 실제 원본 삭제를 혼동하지 않는다. 데이터 이동 후 링크, 검색 및 권한을 검증한다."
  ],
  "workitem": [
    "프로젝트 Work Items; LiveDoc/Space; Work Item 타입·링크 설정",
    "ID, 타입, 상태, Custom Field, 링크 관계 및 소속 문서를 확인한다. 단일 Work Item과 문서 내 Work Item의 표시·편집 흐름을 비교한다.",
    "저장 후 상세 조회, 검색, 문서 내 표시 및 추적성 링크가 일치하는지 확인한다."
  ],
  "live-loading": [
    "LiveDoc 화면의 관련 설정; 문서 내용·검색; 제품 UI",
    "대상 문서에서 관련 표시 설정의 적용 범위를 확인하고 작은 문서와 대형 문서에서 로딩 동작을 비교한다.",
    "화면 로딩 최적화와 원본 데이터 누락을 구분한다. 검색 및 실제 저장 상태를 별도로 확인한다."
  ],
  "baseline": [
    "프로젝트 Baselines / Collections 관련 화면; 대상 revision 및 문서",
    "Baseline 또는 Collection이 고정하는 대상과 범위를 구분하고 현재 데이터와 특정 revision의 조회를 비교한다.",
    "기준선의 내용이 이후 수정으로 바뀌지 않는지, 관련 링크와 접근 권한이 기대대로 동작하는지 확인한다."
  ],
  "ajp": [
    "Apache mod_proxy_ajp 및 Proxy 설정; 실제 내부 수신 주소",
    "httpd -M에서 사용 모듈을 확인하고 실제 프록시 대상과 수신 포트, 접근 제한을 대조한다. AJP가 사용되지 않는 구성도 있다.",
    "외부 HTTPS와 내부 AJP 연결을 구분한다. 필요하지 않은 외부 노출을 추가하지 않는다."
  ],
  "resource-traceability": [
    "Cluster 구성; Resource Traceability 관련 서비스 및 설정; 관련 로그",
    "현재 릴리스에서 해당 기능의 구성 및 의존성을 확인하고 원본 데이터와 추적성 처리 계층을 구분한다. 구성별 활성 여부를 확인한다.",
    "대표 링크를 생성·조회하고 권한 및 서비스 상태를 비교한다. 기능 미설치와 장애를 혼동하지 않는다."
  ],
  "commands": [
    "Linux 서비스 호스트; /opt/polarion; 실제 로그 및 mount",
    "hostname, date -Is, free -h, df -h, df -i, vmstat, ps, ss, systemctl 등의 읽기 명령을 먼저 실행한다. 출력과 발생 시각을 기록한다.",
    "진단 명령과 상태 변경 명령을 구분한다. 대상 경로와 권한을 확인하지 않은 삭제·강제 종료는 하지 않는다."
  ],
  "disk": [
    "/opt/polarion/data; SVN/DB/외부 첨부 mount; df -h / df -i",
    "파일시스템별 사용량과 inode, 증가량을 확인하고 du 조회는 대형 저장소 부하를 고려한다. backup, cache, 원본을 구분한다.",
    "공간 부족이 발생한 실제 mount를 찾는다. 원본이나 .saved를 임의로 지우지 않고 복구 조건과 보존 정책을 확인한다."
  ],
  "linux-common": [
    "systemd unit; NFS mount; timedatectl; 실제 서비스 계정",
    "findmnt, systemctl status/show, timedatectl로 공유 파일시스템, 서비스 환경 및 시간 동기화를 확인한다. 서비스 실행 계정과 shell 사용자를 구분한다.",
    "서버별 경로 및 시간 차이가 장애 원인인지 실제 로그와 요청 시각으로 확인한다."
  ]
}
