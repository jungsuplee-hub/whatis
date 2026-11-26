export type OpsDetail = { section:string; body:string; procedure:string; caution:string; command:string; url:string }
export const opsDetails: Record<string, OpsDetail> = {
  "architecture": {
    "section": "Deployment and Maintenance Guide 2-14, 2-65, 2-70~2-73, 2-113",
    "body": "단일 인스턴스는 운영 대상이 하나인 구성, 클러스터는 여러 노드가 하나의 서비스를 제공하는 구성으로 구분해 관리한다. Coordinator가 포함된 구성에서는 라이선스 관리와 노드 서비스의 역할을 나누어 기록한다. 실제 저장소·DB·공유 데이터 배치 방식은 설치 구성에 따라 달라지므로 운영 구성도에 명시해야 한다.",
    "procedure": "서버 목록에 hostname, IP 대신 내부 관리 식별자, 서비스, 연결 대상, 저장 경로, 백업 정책을 정리한다. 사용자 요청 경로(브라우저→프록시→애플리케이션)를 먼저 확인하고 저장소·DB 연결은 별도 확인한다.",
    "caution": "단일 노드의 정상 여부만으로 전체 클러스터가 정상이라고 판단하지 않는다.",
    "command": "ss -lnt\nsystemctl list-units --type=service --state=running",
    "url": "https://support.sw.siemens.com/"
  },
  "sizing": {
    "section": "Deployment and Maintenance Guide 1-1~1-15, 6-16, 3-21",
    "body": "동시 접속 수와 동시 요청량은 다르다. 조회 위주와 대량 편집·문서 저장·보고서 생성은 같은 사용자 수에서도 다른 리소스를 요구한다. CPU, JVM Heap 외 메모리, 디스크 I/O와 저장 공간을 분리해 용량을 산정한다. 2606 공개 릴리스는 업데이트된 사이징 가이드를 안내한다.",
    "procedure": "평상시 및 피크 시점의 CPU·메모리·디스크 대기·응답시간을 수집한다. Work Item 수, 전체 리비전 규모, 첨부 용량·증가량, 동시 활동 사용자 수를 함께 기록한다. 증설 검토 시 동일 테스트 데이터와 요청 조합으로 비교한다.",
    "caution": "공식 서버 요구사항과 권장 사양은 아래 원문에서 설치 유형별로 확인한다. 이 페이지에는 검증하지 못한 권장 코어·RAM 수치를 임의로 제시하지 않는다.",
    "command": "lscpu\nfree -h\nlsblk\n df -h\nvmstat 1 5",
    "url": "https://docs.sw.siemens.com/en-US/doc/230235217/PL20251205943446859.polarion_help_sc.xid1944826/xid1398196"
  },
  "install": {
    "section": "Deployment and Maintenance Guide 1-4~1-15, 2-14~2-117, 3-2~3-23",
    "body": "설치 시 제품 패키지만 준비하는 것으로 끝나지 않는다. 지원 OS·Java·SVN·DB 조합, DNS, 시간 동기화, 인증서, 파일시스템과 서비스 계정을 준비해야 한다. 2606은 Tomcat 11을 도입했으므로 Servlet 기반 확장 기능의 Jakarta API 호환성을 별도로 검토한다.",
    "procedure": "1. 지원 매트릭스 확인 → 2. 패키지 무결성 및 저장 경로 확인 → 3. 검증 환경 설치 → 4. 인증 및 라이선스 설정 → 5. 테스트 프로젝트의 조회·편집·첨부·검색·REST 검증 → 6. 운영 설치 승인.",
    "caution": "설치 명령과 지원 패키지 버전은 OS 및 배포 유형별 공식 설치 절차를 따른다.",
    "command": "cat /etc/os-release\njava -version\nsvn --version --quiet\nhttpd -v\npsql --version",
    "url": "https://blogs.sw.siemens.com/polarion/polarion-alm-2606-whats-new-and-noteworthy/"
  },
  "service": {
    "section": "Deployment and Maintenance Guide 3-5~3-6, 8-83",
    "body": "서비스 중지와 기동은 단순한 프로세스 재실행이 아니라 요청 종료, 의존 서비스 상태 및 데이터 일관성 확인을 포함한다. systemd의 active 상태는 웹 기능의 정상 동작을 보장하지 않는다.",
    "procedure": "변경 전 서비스 목록과 최근 오류, 실행 중인 Job을 확인한다. 정해진 작업 창에서 배포 유형별 기동/종료 절차를 따른다. 이후 로그인·프로젝트 조회·테스트 데이터 저장·검색·연동을 검증한다.",
    "caution": "아래 SERVICE는 실제 확인한 unit 이름으로 바꾼다. 운영 환경에서 임의 재시작하지 않는다.",
    "command": "systemctl list-units --type=service --all\nsystemctl status SERVICE --no-pager\njournalctl -u SERVICE --since '30 minutes ago' --no-pager",
    "url": "https://support.sw.siemens.com/"
  },
  "properties": {
    "section": "Polarion 2606 Config Properties Reference; Deployment and Maintenance Guide 3-6, 4-42",
    "body": "설정 하나를 검토할 때 키 이름, 현재값, 기본값, 허용값, 적용 범위와 재시작 조건을 기록한다. 예를 들어 REST API 활성화 키는 com.siemens.polarion.rest.enabled이며 공개 개발자 가이드상 기본값 false, 시스템 범위이고 기동 전에 적용한다. Swagger 활성화 키는 com.siemens.polarion.rest.swaggerUi.enabled이며 기본값 false이다.",
    "procedure": "변경 대상 파일과 노드를 식별한 뒤 백업과 변경 차이를 기록한다. 검증 환경에서 변경 효과를 확인하고 동일 구성의 운영 환경에 승인 후 적용한다. 비밀값은 출력하지 않는다.",
    "caution": "예제는 REST를 운영 목적에 맞게 승인받았을 때만 적용한다. 설정 파일에 중복 키가 있는지도 확인한다.",
    "command": "# 승인된 REST 활성화 예시 (설정 파일)\ncom.siemens.polarion.rest.enabled=true\n# Swagger UI가 필요한 경우에만\ncom.siemens.polarion.rest.swaggerUi.enabled=true",
    "url": "https://developer.siemens.com/polarion/enable-rest-api.html"
  },
  "apache": {
    "section": "Deployment and Maintenance Guide 6-28, 8-81; Apache HTTP Server 2.4 MPM",
    "body": "MaxRequestWorkers는 동시에 처리 가능한 요청 수에 관한 상한이다. event/worker에서 ThreadsPerChild는 자식 프로세스당 작업 스레드 수이며 ServerLimit는 프로세스 구성 상한에 관여한다. MaxConnectionsPerChild가 0이면 연결 수에 따른 자식 교체 제한이 없으며, 양수면 해당 연결 수에 도달한 프로세스가 교체 대상이 된다. 이는 메모리 증가 원인을 해결한다는 보장은 아니다.",
    "procedure": "1. httpd -V로 MPM 확인. 2. 요청 지연과 BusyWorkers·IdleWorkers 추세 비교. 3. 자식 PID별 RSS와 요청량을 기록. 4. 설정 변경 전 httpd -t로 구문 검사. 5. 변경 이후 처리량·오류·메모리 추세 비교.",
    "caution": "server-status의 CPU 통계는 현재 호스트 전체 CPU 사용률과 동일하지 않다. OS 지표를 별도로 확인한다. status 페이지는 외부 노출하지 않는다.",
    "command": "httpd -V\nhttpd -M\nhttpd -t\nhttpd -t -D DUMP_RUN_CFG\nps -C httpd -o pid,ppid,%cpu,rss,nlwp --sort=-rss",
    "url": "https://httpd.apache.org/docs/2.4/mod/mpm_common.html"
  },
  "svn": {
    "section": "Deployment and Maintenance Guide 5-40~5-43, 8-81~8-83",
    "body": "SVN은 리비전과 변경 이력을 관리한다. SVN authz는 저장소 경로에 대한 읽기·쓰기 접근 규칙을 표현한다. 권한 변경과 CPU 상승이 동일 시간에 나타나는 경우 상관관계부터 검증하고 원인으로 단정하지 않는다.",
    "procedure": "저장소 경로와 마지막 리비전 확인, 권한 변경 시각과 Apache 요청 로그·CPU 비교, 동일한 접근 요청의 평상시/장애 시 응답 시간 비교 순으로 수행한다. 저장소 무결성 검사와 백업은 승인된 작업 창에서 실행한다.",
    "caution": "svnadmin verify는 저장소 크기에 따라 I/O 부담이 크다. hotcopy는 SVN 저장소 사본이며 Polarion 전체 백업을 대체하지 않는다. pack은 이력 삭제 기능이 아니다.",
    "command": "svnadmin --version --quiet\nsvnlook youngest /path/to/repository\nsvnlook uuid /path/to/repository\n# 사용 가능 옵션 확인\nsvnadmin help verify\nsvnadmin help hotcopy",
    "url": "https://svnbook.red-bean.com/en/1.8/svn.reposadmin.maint.html"
  },
  "postgres": {
    "section": "Deployment and Maintenance Guide 6-10, 8-83",
    "body": "pg_stat_activity는 서버 프로세스별 활동 및 대기 상태를 확인하는 시스템 뷰이다. active 쿼리 수, 대기 이벤트, 트랜잭션 지속시간을 DB CPU·디스크 지표와 함께 보면 병목 범위를 구분하는 데 도움이 된다.",
    "procedure": "DB 접근 권한이 있는 운영 계정으로 상태를 조회한다. 대기 유형과 장시간 트랜잭션을 확인하고, 서비스 요청 지연 시점과 비교한다. 현재 통계와 누적 통계를 구분해 해석한다.",
    "caution": "SQL은 읽기 전용 진단 예시이다. 쿼리 종료, vacuum full, DB 재시작은 별도의 영향 검토가 필요하다.",
    "command": "SELECT state, wait_event_type, count(*)\nFROM pg_stat_activity\nGROUP BY state, wait_event_type;\n\nSELECT pid, state, now()-xact_start AS xact_age,\n       wait_event_type, wait_event\nFROM pg_stat_activity\nWHERE xact_start IS NOT NULL\nORDER BY xact_age DESC;",
    "url": "https://www.postgresql.org/docs/14/monitoring-stats.html"
  },
  "jvm": {
    "section": "Deployment and Maintenance Guide 3-21, 6-14~6-28, 7-9~7-11",
    "body": "Heap은 JVM 객체를 저장하는 영역이며 OS RSS와 같지 않다. GC 이후에도 Heap이 지속 상승하는지, GC 시간 비중이 증가하는지, Cache miss와 eviction이 사용량에 비례하는지를 확인한다. 캐시의 hit ratio는 요청 기간 및 누적 통계에 따라 달라진다.",
    "procedure": "메모리·GC·응답 시간·캐시 통계를 같은 기간으로 수집한다. JVM Heap뿐 아니라 네이티브 메모리, 파일시스템 캐시 및 다른 프로세스 사용량도 확인한다. Cache 크기를 변경할 때 한 가지씩 변경하고 동일 작업량에서 비교한다.",
    "caution": "Heap dump 및 상세 진단은 운영 중 상당한 부하와 중단을 일으킬 수 있다. 진단 수준은 운영 영향 검토 후 선택한다.",
    "command": "ps -eo pid,comm,%cpu,%mem,rss --sort=-rss | head -20\nfree -h\nvmstat 1 5",
    "url": "https://support.sw.siemens.com/"
  },
  "index": {
    "section": "Deployment and Maintenance Guide 8-83~8-90, 8-135~8-139; Administrator and User Help 4-1080",
    "body": "Reindex는 검색·색인 관련 문제 대응에서 검토하는 작업이다. 원본 데이터 변경과 검색 결과 갱신은 구분해야 한다. 2606의 Location Index는 PostgreSQL 기반의 조기 도입 기능으로 Siemens는 운영과 유사한 데이터로 검증 환경에서 평가할 것을 안내한다.",
    "procedure": "먼저 원본 객체 존재 여부, 사용자 권한, 검색 조건, 인덱스 작업 상태 및 로그를 확인한다. 저장공간과 서비스 영향을 확인하고 공식 문서의 해당 배포 유형별 재색인 절차를 선택한다. 완료 후 기존 누락 항목과 대표 검색 결과를 검증한다.",
    "caution": "인덱스 폴더 직접 삭제나 강제 재색인 명령은 환경별 공식 절차를 확인하기 전 사용하지 않는다. Location Index 활성화 여부는 테스트 환경에서 검토한다.",
    "command": "df -h\n# 인덱스 관련 기록을 읽기 전용으로 검색\ngrep -inE 'reindex|index' /path/to/polarion.log | tail -50",
    "url": "https://blogs.sw.siemens.com/polarion/polarion-alm-2606-whats-new-and-noteworthy/"
  },
  "cluster": {
    "section": "Deployment and Maintenance Guide 2-65~2-112, 5-56, 8-25",
    "body": "클러스터에서는 노드 장애, Coordinator 장애, 공통 서비스 장애를 구분한다. 하나의 노드만 느린 상황에서는 다른 노드와 같은 요청의 결과를 비교하고, 여러 노드에서 동시 문제가 발생하면 공통 의존성도 확인한다.",
    "procedure": "로드밸런서의 노드 상태 및 실제 요청 분배를 확인한다. 노드별 버전·설정·CPU·메모리·로그 및 공유 서비스 응답을 확인한다. 유지보수 시 운영 구성별 공식 순서를 따른 뒤 서비스 접근과 라이선스, 주요 기능을 검증한다.",
    "caution": "Coordinator 재시작 시 Node 재시작 필요 여부를 모든 구성에 동일하게 적용할 수 없다. 실제 배포 형태와 공식 절차를 확인한다.",
    "command": "hostname\nuptime\nss -lnt\nsystemctl list-units --type=service --state=running",
    "url": "https://support.sw.siemens.com/"
  },
  "backup": {
    "section": "Deployment and Maintenance Guide 4-83, 8-135~8-144",
    "body": "RPO는 허용 가능한 데이터 손실 범위(시간), RTO는 복구 목표 시간이다. SVN, DB, 외부 첨부 저장소, 설정 및 인증 관련 자료의 백업 시점과 일관성이 중요하다. 인덱스 백업과 저장소 백업은 역할이 다르다.",
    "procedure": "백업 범위·주기·보관 장소·암호화 및 권한을 확인한다. 백업 목록과 성공 로그를 검증하고 실제 복구 훈련을 수행한다. 복원 후 리비전, 프로젝트, 첨부, 사용자 인증과 검색 결과를 검증한다.",
    "caution": "운영 복원은 기존 데이터를 덮어쓸 수 있다. 격리된 복구 환경에서 절차를 먼저 검증한다.",
    "command": "# SVN 백업 방식과 옵션 확인 (실행 전)\nsvnadmin help hotcopy\n# 백업 위치 여유 공간 확인\ndf -h",
    "url": "https://svnbook.red-bean.com/en/1.8/svn.ref.svnadmin.c.hotcopy.html"
  },
  "upgrade": {
    "section": "Deployment and Maintenance Guide 8-1~8-80, 8-80 (Cumulative updates)",
    "body": "패치는 설치된 제품의 수정 배포이고 버전 업그레이드는 대상 릴리스로 전환하는 작업이다. 2606 공개 변경사항에는 Tomcat 11, Jakarta 전환 및 Groovy 관련 변경이 있으므로 기존 확장 기능을 확인해야 한다.",
    "procedure": "사전: 현재 버전·패치·지원 조합·커스텀 확장 및 외부 연동 기록, 릴리스/제거 계획 확인, 전체 백업 및 복원 검증. 작업: 공식 패키지의 해당 구성별 절차를 따라 변경 기록 작성. 사후: 기동, 로그인, 프로젝트, 검색, 권한, 첨부, API, Job, 클러스터 노드와 오류 로그 검증.",
    "caution": "정확한 패치 실행 파일·명령과 재시작/재색인 조건은 배포 패키지에 동봉된 안내에 따른다. 임의로 이전 바이너리만 복사해 롤백하지 않는다.",
    "command": "java -version\nhttpd -v\nsvn --version --quiet\npsql --version",
    "url": "https://blogs.sw.siemens.com/polarion/polarion-alm-2606-whats-new-and-noteworthy/"
  },
  "license": {
    "section": "Deployment and Maintenance Guide 3-7~3-12, 7-28~7-35; SALT Licensing Server Guide",
    "body": "Named 사용자 라이선스와 Concurrent 사용자 라이선스는 할당 및 사용 방식이 다르다. SALT를 사용하는 구성은 해당 라이선스 서버의 연결 상태와 제품 라이선스 설정을 별도로 관리한다.",
    "procedure": "현재 라이선스 유형, 만료일, 활성화 상태, 사용량, 사용자 및 그룹 할당을 확인한다. 갱신 또는 전환 전 기존 라이선스 정보와 작업 절차를 기록한다. 변경 후 대표 사용자별 접속 및 기능 사용을 검증한다.",
    "caution": "라이선스 키나 활성화 파일은 공개 로그 및 화면 캡처에 포함하지 않는다. 정확한 갱신 방식은 라이선스 종류별 공식 절차를 적용한다.",
    "command": "",
    "url": "https://support.sw.siemens.com/"
  },
  "roles": {
    "section": "Administrator and User Help 2-14, 4-86~4-176",
    "body": "Role은 사용자에게 적용되는 권한 집합을 구성하는 수단이다. 로그인 가능 여부와 Work Item·문서의 접근 가능 여부는 별개이다. 권한 문제는 전역/프로젝트 범위, 사용자 및 그룹 역할, 대상 객체 권한을 구분한다.",
    "procedure": "Administration에서 사용자·역할·권한 관리 영역을 확인한다. 권한이 정상인 사용자와 실패 사용자의 대상 프로젝트/역할을 비교한다. 테스트 계정으로 읽기·쓰기 및 접근 거부가 의도대로 작동하는지 검증한다.",
    "caution": "광범위한 전역 관리자 권한을 부여하여 오류를 우회하지 않는다. 변경된 권한 범위와 담당자 승인을 기록한다.",
    "command": "",
    "url": "https://support.sw.siemens.com/"
  },
  "auth": {
    "section": "Deployment and Maintenance Guide 3-12, 4-1~4-83",
    "body": "인증은 사용자를 확인하는 단계이고 인가는 수행 가능한 작업을 결정한다. SSO 장애 시 브라우저 리디렉션, 인증 제공자, Polarion 세션과 서버 권한을 분리한다. 2606은 Secrets Manager로 민감 설정값 관리를 강화했다.",
    "procedure": "발생 시간과 인증 경로, HTTP 상태, 인증서 만료 및 시스템 시간을 기록한다. 인증 제공자 로그와 Polarion 로그를 비교한다. 변경 후 정상·만료·권한 없음 등의 조건을 검증한다.",
    "caution": "인증서 검증 또는 보안 규칙을 비활성화해 장애를 우회하지 않는다. 비밀번호와 인증 토큰을 수집 자료에서 제거한다.",
    "command": "date -Is\ntimedatectl status\n# 인증서 파일이 확인된 경우\nopenssl x509 -in /path/to/cert.pem -noout -dates -issuer -subject",
    "url": "https://blogs.sw.siemens.com/polarion/polarion-alm-2606-whats-new-and-noteworthy/"
  },
  "admin": {
    "section": "Administrator and User Help 4-1~4-22",
    "body": "관리 화면에서는 전역 설정과 프로젝트별 설정의 범위를 먼저 구분해야 한다. 같은 설정 이름이라도 프로젝트 유형, 권한, 구성에 따라 표시되는 내용과 변경 범위가 다를 수 있다.",
    "procedure": "관리 화면 진입 후 현재 프로젝트/전역 범위를 확인한다. 메뉴별 변경 대상과 적용 범위를 기록하고 테스트 프로젝트에서 동일 변경을 검증한다. 운영 적용 후 대표 사용자의 화면을 확인한다.",
    "caution": "실제 화면의 메뉴 명칭 및 관리 권한은 사용 중인 2606 Help와 대조한다. 시뮬레이션 화면은 실제 운영 화면과 동일하다고 가정하지 않는다.",
    "command": "",
    "url": "https://support.sw.siemens.com/"
  },
  "project": {
    "section": "Administrator and User Help 2-56~2-189, 4-44",
    "body": "프로젝트 그룹, 프로젝트 경로, 프로젝트 ID 및 표시 이름을 구분해 기록한다. 프로젝트 목록에 표시되지 않는 경우 권한·프로젝트 등록 상태·색인·데이터 위치를 비교해야 하며, 어느 한 가지를 원인으로 단정할 수 없다.",
    "procedure": "정상 계정과 문제 계정의 조회를 비교하고 관리 화면에서 해당 프로젝트를 확인한다. 저장소 경로와 현재 상태를 기록한다. Mark/Unmark는 실제 제품 문서의 조건과 데이터 영향 확인 후 진행한다.",
    "caution": "프로젝트가 화면에 안 보인다는 이유만으로 저장소 폴더를 직접 삭제하거나 재생성하지 않는다.",
    "command": "",
    "url": "https://support.sw.siemens.com/"
  },
  "workitem": {
    "section": "Administrator and User Help 3-48~3-282, 3-601",
    "body": "Work Item은 업무 데이터의 항목 단위이고 LiveDoc은 여러 업무 항목과 문서 내용을 함께 관리하는 화면이다. LiveReport는 보고서와 조회 결과를 표시하는 영역이다. 화면 저장 오류, 검색 누락, 첨부 미표시를 구분해 대응한다.",
    "procedure": "객체 ID와 문서 경로, 재현 조건, 상태 및 링크를 기록한다. 브라우저 개발자 도구의 Network 오류와 같은 시점의 서버 로그를 확인한다. 대표 항목의 이력, 권한, 문서 로딩 상태를 비교한다.",
    "caution": "실제 운영 데이터의 수정은 영향 확인 후 진행한다. 테스트 화면은 참고용이다.",
    "command": "",
    "url": "https://support.sw.siemens.com/"
  },
  "workflow": {
    "section": "Administrator and User Help 4-207~4-313, 8-25~8-59",
    "body": "Enumeration은 선택 가능한 값의 집합, Custom Field는 추가 속성, Workflow는 상태 및 전이 규칙을 구성한다. Workflow 변경 시 전이 조건과 수행 기능, 필요한 권한을 함께 확인한다.",
    "procedure": "설정이 전역 또는 프로젝트 수준인지 확인하고 대상 Work Item·Document 타입과 필드, 상태 전이 규칙을 기록한다. 신규·기존 데이터, 권한별 상태 변경, 필수값 누락 시 거부 여부를 테스트한다.",
    "caution": "사용 중인 값이나 상태를 삭제하기 전 기존 데이터와 보고서·외부 연동 영향을 확인한다.",
    "command": "",
    "url": "https://support.sw.siemens.com/"
  },
  "attachments": {
    "section": "Deployment and Maintenance Guide 5-29; Administrator and User Help 4-391, 4-613~4-621",
    "body": "첨부 요청은 HTTP 요청 수신, 크기 및 유형 검사, 인증·인가, 저장 처리와 다운로드/렌더링 단계를 거친다. 업로드 실패와 다운로드 실패는 발생 지점이 다를 수 있다. 외부 저장소를 쓰는 환경에서는 저장소 접근성과 용량도 확인한다.",
    "procedure": "동일 계정으로 작은 정상 파일과 실패 파일을 비교한다. 응답 상태 코드, 요청 크기, HTTPD 및 애플리케이션 로그, 저장소 상태를 같은 시각으로 확인한다. HTTP 413이면 요청 크기 제한이 관련될 수 있으나 어느 계층에서 응답했는지 로그로 확인한다.",
    "caution": "보안 검사나 크기 제한을 무조건 제거하지 않는다. 서버에서 허용하는 파일의 검증 정책과 운영 요구를 함께 고려한다.",
    "command": "df -h\n# 실제 로그 경로를 적용\ngrep -iE 'attachment|upload|413' /path/to/error.log | tail -50",
    "url": "https://support.sw.siemens.com/"
  },
  "migration": {
    "section": "Administrator and User Help 3-60, 3-1262, 3-1481",
    "body": "이전 작업에서는 데이터 개수뿐 아니라 첨부파일, 링크, 권한, 상태, 이력 및 대상 환경의 설정 차이를 검증해야 한다. Import의 실패 메시지가 실제 변경이 전혀 없음을 보장하지 않으므로 대상 데이터를 확인해야 한다.",
    "procedure": "원본과 대상의 버전, 프로젝트 ID 및 설정 차이, 이전 범위를 기록한다. 샘플 이전 후 항목·첨부·링크·검색을 검증한다. 전체 이전 후 원본 대비 개수 및 누락 목록을 비교한다.",
    "caution": "실패 시 무조건 다시 Import하지 않는다. 실제 반영 범위와 중복·충돌 가능성을 파악한다.",
    "command": "",
    "url": "https://support.sw.siemens.com/"
  },
  "api": {
    "section": "REST API User Guide for Polarion; 공개 2606 Developer Portal",
    "body": "REST API는 기본 비활성화이며 com.siemens.polarion.rest.enabled=true로 기동 전 설정한다. 인증은 PAT, JWT 또는 Teamcenter SSO 토큰 방식 등을 지원한다. PAT는 Authorization Bearer 헤더를 사용한다. 인증 실패는 401, 권한 부족은 403으로 응답할 수 있다. API endpoint 권한과 객체 권한을 함께 확인한다.",
    "procedure": "관리자가 API 활성화를 확인한다. 테스트 계정과 최소 권한의 토큰으로 GET /polarion/rest/v1/projects를 호출한다. 반환 상태 및 로그를 비교하고 쓰기 요청은 별도 테스트 환경에서 검증한다.",
    "caution": "토큰을 코드·공개 저장소·로그에 남기지 않는다. 서버 인증서 검증을 생략하지 않는다. 실제 버전의 REST 명세에서 요청 구조를 확인한다.",
    "command": "# Bash 예시: 토큰을 화면에 표시하지 않음\nread -rs -p 'PAT: ' PAT; echo\ncurl -sS -H \"Authorization: Bearer $PAT\" \\\n  'https://YOUR-SERVER/polarion/rest/v1/projects'\nunset PAT",
    "url": "https://developer.siemens.com/polarion/authentication.html"
  },
  "jobs": {
    "section": "Administrator and User Help 3-366, 4-1090; Deployment and Maintenance Guide 7-1",
    "body": "Job은 서버에서 처리하는 작업 단위다. 실행 시간이 늘어났다면 실행 중인지 대기 중인지, 특정 노드 문제인지, 공통 자원 병목인지 구분한다.",
    "procedure": "Monitor의 작업 목록에서 Job 이름·상태·실행 시간과 관련 로그를 확인한다. 동일 Job의 이전 성공 시간 및 서버 부하와 비교한다. 재실행 전 작업의 중복 실행 가능성과 영향 범위를 확인한다.",
    "caution": "Monitor에서 보이지 않는 작업이 반드시 없는 것은 아니다. 관리 권한 및 필터 범위를 확인한다.",
    "command": "",
    "url": "https://support.sw.siemens.com/"
  },
  "logs": {
    "section": "Deployment and Maintenance Guide 4-103~4-107, 7-20~7-26, 8-90; diagtool guide",
    "body": "로그는 구성요소별로 시간대를 통일해 비교해야 한다. 애플리케이션 오류, HTTP 요청, JVM GC, DB·SVN 지표와 변경 작업 기록을 함께 수집한다. 장애가 끝난 뒤 현재 CPU만 보면 당시 원인을 검증하기 어렵다.",
    "procedure": "장애 시작·종료 시각과 서비스 영향, 최근 설정 변경을 기록한다. 관련 로그를 원본 그대로 별도 보존한 뒤 조사 범위의 복사본을 분석한다. 진단 자료를 공유하기 전 개인 정보·인증 정보 포함 여부를 점검한다.",
    "caution": "진단 도구 및 JVM dump는 데이터량과 서비스 부하를 고려해 승인 후 실행한다.",
    "command": "date -Is\nuptime\nfree -h\ndf -h\njournalctl -u SERVICE --since '2026-01-01 10:00' --until '2026-01-01 10:10' --no-pager",
    "url": "https://support.sw.siemens.com/"
  },
  "incident": {
    "section": "Deployment and Maintenance Guide 10-1, 7-1",
    "body": "장애 대응의 기본 순서는 영향 확인, 증거 수집, 가설 구분, 안전한 복구, 검증, 재발 방지이다. CPU 사용률이 높다는 것만으로 애플리케이션 문제인지 SVN·DB 문제인지 알 수 없다.",
    "procedure": "사용자·프로젝트·노드별로 영향 범위를 좁히고 장애 시간과 로그를 수집한다. 요청 유형별 응답시간을 비교한다. 원인에 대한 근거와 복구 작업 기록을 남기고 조치 이후 같은 지표로 효과를 확인한다.",
    "caution": "운영 중 무작정 재시작이나 캐시 삭제를 하면 증거가 사라지거나 장애가 커질 수 있다. 복구 우선순위와 승인 정책을 따른다.",
    "command": "uptime\nvmstat 1 5\nps -eo pid,comm,%cpu,%mem,rss --sort=-%cpu | head -20\n# sysstat 설치 환경\niostat -xz 1 5",
    "url": "https://support.sw.siemens.com/"
  },
  "release": {
    "section": "2606 Resolved Issues; Deprecation and Removal Plan; Siemens 2606 공개 릴리스 안내",
    "body": "2606 공개 릴리스는 검색 및 저장소 작업 개선, PostgreSQL 기반 Location Index의 조기 도입 개선, Secrets Manager 및 보안 로그 강화, Tomcat 11 전환과 API 확장 등을 소개한다. 구체적인 결함 번호 및 패치 포함 여부는 실제 설치 패치 자료에서 확인한다.",
    "procedure": "업그레이드 전 기존 확장·스크립트·연동을 분류하고 변경된 플랫폼 API 및 제거 예정 기능의 영향을 검토한다. 검증 환경에서 이전 버전과 핵심 시나리오를 비교한다.",
    "caution": "공개 릴리스 개선 사항은 모든 운영 환경에서 동일한 속도 향상을 보장하는 수치가 아니다.",
    "command": "",
    "url": "https://blogs.sw.siemens.com/polarion/polarion-alm-2606-whats-new-and-noteworthy/"
  },
  "commands": {
    "section": "일반 Linux 운영 명령 (제품 전용 명령 아님)",
    "body": "운영 진단은 먼저 읽기 중심 명령을 사용한다. CPU 부하와 사용률, 가용 메모리와 RSS, 디스크 사용량과 I/O 지연은 각각 다른 지표이다.",
    "procedure": "호스트·시각을 기록한 뒤 시스템 상태, 프로세스, 서비스, 로그를 확인한다. 같은 명령을 정상 시점과 장애 시점에 비교해 기준선을 만든다.",
    "caution": "명령의 대상 경로·서비스를 실제 환경에서 확인한다. 운영 데이터 삭제, 프로세스 강제 종료, 재시작은 이 체크리스트에서 제외한다.",
    "command": "hostname; date -Is; uptime\nfree -h; df -h; df -i\nps -eo pid,ppid,comm,%cpu,%mem,rss --sort=-%cpu | head -20\nvmstat 1 5\nsystemctl --failed\nss -s",
    "url": "https://www.freedesktop.org/software/systemd/man/latest/systemctl.html"
  },
  "integration": {
    "section": "REST API User Guide; SDK; Scripting Guide; 제품별 Integration Guide",
    "body": "외부 연동은 요청/응답, 인증, 데이터 소유권, 중복 처리 및 오류 재시도 정책이 필요하다. SDK·스크립트는 제품 버전 변경 시 호환성 검증 대상이다. 2606 Tomcat 11 환경에서는 웹 API 확장 코드의 javax에서 jakarta 전환 영향을 검토한다.",
    "procedure": "인터페이스 목록에 데이터 방향, 인증 방식, 대상 버전, 실행 주기와 책임자를 기록한다. 테스트 환경에서 정상 및 실패·중복·재시도 시나리오를 검증한다.",
    "caution": "연동 키·토큰을 저장소에 커밋하지 않는다. 제품별 정확한 호환 범위는 공식 연동 문서를 확인한다.",
    "command": "",
    "url": "https://developer.siemens.com/polarion/overview.html"
  }
}
