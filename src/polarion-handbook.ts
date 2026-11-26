export type OpsTable={title:string;head:string[];rows:string[][]}
export type Handbook={ref:string;sections?:string[][];tables?:OpsTable[];code?:string;verify?:string}
export const handbook:Record<string,Handbook>={
  "sizing": {
    "ref": "Deployment and Maintenance Guide, 1-1~1-6, 6-1~6-2, 6-42~6-44",
    "sections": [
      [
        "2606 용량 산정 기준",
        "동시 사용자 수를 1차 기준으로, 프로젝트 수를 2차 기준으로 삼는다. 서로 다른 등급에 해당하면 높은 쪽을 적용한다. 동시 사용자 수가 낮더라도 프로젝트 수나 저장소 규모가 상위 등급에 해당하면 높은 기준을 검토한다. 아래는 문서에 제시된 기준치이지 성능 보증이나 절대 설치 한계가 아니다. 모든 클러스터 CPU·RAM·Java 메모리 값은 애플리케이션 노드 1대 기준이다."
      ],
      [
        "서버 산정 방법",
        "1. 라이선스 수 대신 실제 동시 활동 인원을 측정한다. 2. 프로젝트 수와 SVN 리비전 수, 실제 저장소 용량을 기록한다. 3. 아래 등급의 CPU·메모리·SSD 용량·IOPS 기준을 비교한다. 4. SVN·Load Balancer가 분리된 경우 각 서버도 별도로 산정한다. 5. 실제 데이터와 사용자 작업 조합으로 부하 및 재색인 시간을 검증한다."
      ],
      [
        "메모리 해석",
        "Java Memory는 전체 RAM과 동일하지 않다. JVM 이외에 PostgreSQL, Apache, SVN, OS page cache, JVM native memory의 여유가 필요하다. 문서의 JVM 일반 지침은 RAM의 약 50% 수준부터 검토하는 것이지만 사이징 표의 권장 Java Memory는 등급별로 다르다. 두 지침을 혼용하여 일률적으로 고정하지 않는다."
      ],
      [
        "인수인계용 용량 지표",
        "동시 사용자 외에도 피크 요청률, SVN repository 크기·revision 증가량, DB·외부 첨부·backup 공간, index rebuild 시간, 노드 장애 시 잔존 용량을 기록한다. 용량 추정은 운영 데이터의 최근 성장 추세와 동일한 사용자 작업을 기준으로 검증한다."
      ]
    ],
    "tables": [
      {
        "title": "Standalone 권장 등급",
        "head": [
          "동시 사용자 미만",
          "프로젝트 미만",
          "CPU",
          "RAM GB",
          "Java GB",
          "SSD 최소",
          "SVN 규모 기준"
        ],
        "rows": [
          [
            "50",
            "100",
            "4",
            "32",
            "16",
            "250 GB / 15k IOPS",
            "5M rev / 약 100 GB 미만"
          ],
          [
            "100",
            "250",
            "8",
            "64",
            "40",
            "250 GB / 15k IOPS",
            "5M / 약 100 GB 미만"
          ],
          [
            "200",
            "500",
            "16",
            "128",
            "80",
            "500 GB / 15k IOPS",
            "10M / 약 300 GB 미만"
          ],
          [
            "300",
            "500",
            "32",
            "256",
            "180",
            "500 GB / 15k IOPS",
            "10M / 약 300 GB 미만"
          ]
        ]
      },
      {
        "title": "Cluster 권장 등급",
        "head": [
          "동시 사용자 미만",
          "프로젝트 미만",
          "노드 수",
          "노드 CPU/RAM/Java",
          "LB CPU/RAM",
          "SVN CPU/RAM",
          "SSD / SVN 기준"
        ],
        "rows": [
          [
            "500",
            "800",
            "2",
            "16 / 128 / 80",
            "16 / 56",
            "12 / 32",
            "2 TB+, 15k IOPS / 15M rev, 약 1 TB"
          ],
          [
            "1,000",
            "1,000",
            "3",
            "16 / 128 / 80",
            "16 / 56",
            "12 / 32",
            "2 TB+, 15k IOPS / 15M, 약 1 TB"
          ],
          [
            "3,000",
            "2,500",
            "4",
            "32 / 256 / 130",
            "32 / 128",
            "24 / 56",
            "4 TB+, 20k IOPS / 20M, 약 2 TB"
          ],
          [
            "5,000",
            "4,000",
            "4",
            "32 / 256 / 130",
            "32 / 128",
            "24 / 56",
            "4 TB+, 20k IOPS / 25M, 약 2.5 TB"
          ],
          [
            "7,000",
            "5,000",
            "4",
            "32 / 256 / 130",
            "32 / 128",
            "24 / 56",
            "6 TB+, 20k IOPS / 30M, 약 3 TB"
          ]
        ]
      }
    ],
    "verify": "동시 사용량과 프로젝트 중 높은 등급을 선택했는지, 저장소 예상 성장과 피크 I/O를 반영했는지 확인한다. 표 범위 밖 규모는 별도 성능 검증 및 Siemens 협의 대상이다."
  },
  "install": {
    "ref": "Deployment and Maintenance Guide, 1-4~1-9, 2-28~2-55, 3-1~3-6",
    "sections": [
      [
        "지원 환경 확인",
        "2606 Linux는 x86_64/amd64이며 RHEL 9.x/10.x, SLES 15 SP7, Debian 12/13, Ubuntu 22.04/24.04 LTS가 문서에 명시된다. RHEL 8.x와 OpenJDK 17은 이 목록에서 제외되어 있다. 평가 설치와 운영용 Standard 설치를 구분한다."
      ],
      [
        "Linux 수동 설치 순서",
        "Java, Apache 및 필요한 모듈, Subversion과 PostgreSQL을 먼저 설치하고 서비스 및 연결을 구성한다. 배포 ZIP을 임시 디렉터리에 풀고 Polarion 디렉터리로 이동한다. polarion 시스템 계정을 준비하고 libinstall/default.sh에서 설치 경로 및 v_web_user, v_web_group을 검토한다. root 권한으로 manual_install.sh를 실행한다. 기본 바이너리 위치는 /opt/polarion, 데이터 위치는 /opt/polarion/data이다."
      ],
      [
        "설치 후 보안 및 기동",
        "애플리케이션과 Maven 바이너리는 root 소유의 읽기 중심 권한으로 관리하고 데이터 경로는 polarion 및 Apache 서비스 계정에 필요한 쓰기 권한을 준다. 초기 활성화 후 Apache의 /installrepo Location을 제거하고 인증·라이선스·접속 및 쓰기 테스트를 수행한다. SELinux 정책은 운영 보안 정책을 유지하면서 검증한다."
      ]
    ],
    "tables": [
      {
        "title": "Linux 제품 지원 버전",
        "head": [
          "항목",
          "2606 요구/지원"
        ],
        "rows": [
          [
            "Java",
            "64-bit OpenJDK 21 HotSpot; Eclipse Temurin 21 권장"
          ],
          [
            "SVN",
            "1.14.x; 최신 1.14.x 권장"
          ],
          [
            "Apache",
            "최소 2.4.51; mod_proxy_ajp, mod_proxy_wstunnel, WebDAV/SVN 모듈"
          ],
          [
            "PostgreSQL",
            "13.x~18.x 지원, 14 이상 권장"
          ],
          [
            "폰트",
            "URW fonts 설치"
          ]
        ]
      }
    ],
    "code": "java -version\nhttpd -v\nsvn --version --quiet\npsql --version\n# 수동 설치 패키지의 Polarion 디렉터리에서\nchmod +x manual_install.sh\n# 설치 승인 및 환경 검증 후 root로 실행\n./manual_install.sh",
    "verify": "설치 후 기본 관리자 비밀번호 변경, /installrepo 정리, 라이선스, repoSystem, 백업 정책, 접속 URL 및 대표 사용자 작업을 확인한다."
  },
  "architecture": {
    "ref": "Deployment and Maintenance Guide, 2-14, 2-65~2-113, 3-2~3-6, 6-3",
    "sections": [
      [
        "저장소와 검색의 관계",
        "SVN은 Polarion 업무 데이터 및 이력의 주 저장소다. PostgreSQL은 복잡한 조회 및 SQL 인덱스에 사용되며 2512 이후 인증 데이터에도 사용된다. Lucene 및 Object Maps/Location Index는 검색과 객체 위치 조회에 관여한다. 외부 첨부 저장소를 선택한 경우 파일 본체는 별도 저장소에 위치한다."
      ],
      [
        "구성 유형",
        "Standalone은 한 인스턴스를 운영하는 방식이다. Multi-instance는 독립 인스턴스들이 Coordinator를 이용해 라이선스를 관리할 수 있다. Cluster는 여러 Application Node와 Coordinator, Shared Services, Load Balancer를 조합한다. 독립 인스턴스와 동일 저장소를 사용하는 클러스터를 구분해야 한다."
      ],
      [
        "인수인계에 남길 항목",
        "호스트별 역할, OS/Java/SVN/Apache/DB 버전, 실제 데이터·설정·로그 경로, 서비스 unit, URL·포트, 인증 방식, DB 위치, 공유 파일시스템 mount, 백업과 복구 정책을 기록한다. 비밀번호는 문서가 아닌 승인된 비밀 관리 시스템에 저장한다."
      ],
      [
        "데이터의 권위와 복구 대상",
        "운영 인수인계 시 SVN 원본(업무 객체 및 revision), 외부 첨부의 바이너리, PostgreSQL의 인덱스와 인증 DB, 공유 설정, 로컬 캐시를 서로 다른 복구 대상으로 분류한다. 인덱스는 원본으로부터 재생성 가능한 영역이 있으나 인증 DB는 같은 방식으로 재생성한다고 가정하지 않는다. 서비스 장애 때 어느 계층이 쓰기 작업을 책임지는지 먼저 파악해야 한다."
      ]
    ],
    "tables": [
      {
        "title": "구성요소 역할과 첫 점검",
        "head": [
          "대상",
          "업무",
          "확인"
        ],
        "rows": [
          [
            "Apache",
            "웹 프록시·SVN HTTP 접근",
            "httpd -M, 요청/오류 로그"
          ],
          [
            "Polarion Java",
            "업무 처리·Index·Job",
            "서비스 및 main/startup 로그"
          ],
          [
            "SVN / svnserve",
            "데이터 저장·시스템 조회",
            "repo, repoSystem, 리비전"
          ],
          [
            "PostgreSQL",
            "SQL 조회/인증 DB",
            "서비스, pg_stat_activity"
          ],
          [
            "Coordinator",
            "클러스터 제어·라이선스",
            "연결 상태, 버전"
          ],
          [
            "Shared Services",
            "공유 구성 및 저장소",
            "mount, 공유 경로"
          ],
          [
            "외부 첨부 저장소",
            "바이너리 보관",
            "접근 및 용량"
          ]
        ]
      }
    ]
  },
  "service": {
    "ref": "Deployment and Maintenance Guide, 3-5~3-6, 7-27, 8-5~8-6, 8-83, 8-89",
    "sections": [
      [
        "서비스 구성",
        "Linux에서 Polarion은 Java 프로세스로 동작하며 Apache, PostgreSQL, svnserve(구성된 경우), colleno, Node.js 등의 프로세스가 별도로 존재한다. Polarion 종료만으로 관련 프로세스가 반드시 모두 끝났다고 볼 수 없다. 업데이트 절차에서는 NodeJS 및 Variants 종료도 확인한다."
      ],
      [
        "정기 재시작 절차",
        "작업 창과 실행 중인 Job을 확인한다. 실제 서비스 이름과 의존성을 확인하고 Polarion을 정상 종료한다. 종료 후 Java 및 관련 프로세스의 잔류 여부와 로그를 확인한다. 의존 서비스가 정상인지 확인 후 Polarion을 시작한다. 일반 Polarion 재시작과 DB/SVN/Apache를 함께 변경하는 유지보수의 순서를 구분한다."
      ],
      [
        "기동 검증",
        "startup 로그의 단계 완료, 웹 로그인, 프로젝트 목록, 읽기·저장, 검색, REST 및 Job 상태를 확인한다. Historical DB 색인이 백그라운드에서 실행 중이면 일부 이력 기능의 제한 여부도 확인한다."
      ]
    ],
    "code": "systemctl status polarion --no-pager\n# 승인된 작업 창에서\nsystemctl stop polarion\nps -eo pid,comm | grep -E 'java|node|colleno'\n# 의존 서비스 정상 확인 후\nsystemctl start polarion\njournalctl -u polarion -n 100 --no-pager\n# 대체 공식 스크립트: /opt/polarion/bin/polarion.init start|stop",
    "verify": "프로세스 active 여부뿐 아니라 실제 화면·검색·저장 성공을 검증한다."
  },
  "properties": {
    "ref": "Deployment and Maintenance Guide, 3-6; Polarion 2606 Config Properties Reference (각 property 이름); Deployment and Maintenance Guide 6-24, 7-26",
    "sections": [
      [
        "설정 위치와 반영 방식",
        "Linux 시스템 파일은 /opt/polarion/etc/polarion.properties, Windows는 C:\\Polarion\\polarion\\configuration\\polarion.properties가 기본이다. 시스템 파일 변경은 서버 재시작이 필요하다. Administration의 Configuration Properties에서 편집하는 온라인 고급 설정은 별도로 동작하며 재시작을 요구하지 않는 항목이 있다."
      ],
      [
        "변경 기록 양식",
        "변경 요청 번호 / 대상 서버 / 정확한 키 / 변경 전·후 값 / 적용 범위 / 변경 시간 / 재시작 및 검증 방법 / 원복값을 기록한다. Cluster의 공유 설정과 노드 로컬 설정을 구분한다. 복구를 위해 설정 파일 복사본을 보존한다."
      ],
      [
        "문서 간 값 차이",
        "동일한 2606 문서라도 security.cacheSize는 Config Properties Reference에서 20,000, Deployment Guide 6-19 및 6-24에서 30,000으로 표기된다. startup.workers도 Reference에서는 min(CPU, maxPoolSize−1), Deployment Guide에서는 CPU 수 중심으로 설명한다. 실제 설치의 로그·유효 설정을 확인하고 단일 기본값으로 단정하지 않는다."
      ]
    ],
    "code": "# 키 존재 여부만 확인 (실제 설정 파일 기준)\ngrep -nE '^com\\.polarion\\.startup\\.workers[.=]|^com\\.siemens\\.polarion\\.platform\\.sql\\.maxPoolSize=' /opt/polarion/etc/polarion.properties\n# 변경 전 백업 예시\ncp -p /opt/polarion/etc/polarion.properties /opt/polarion/etc/polarion.properties.prechange",
    "verify": "서버 재시작 후 로그, 실제 동작 및 변경 전후 성능을 확인한다. 비밀값이 담긴 파일의 접근 권한을 유지한다.",
    "tables": [
      {
        "title": "2606 운영 주요 Properties — 기본값/기능 (Config Properties Reference)",
        "head": [
          "키",
          "기본값",
          "동작"
        ],
        "rows": [
          [
            "base.url",
            "none",
            "서비스 URL(FQDN 또는 IP)"
          ],
          [
            "repoSystem",
            "null",
            "시스템 계정 read-only SVN 대체 URL; 미설정 시 repo"
          ],
          [
            "com.polarion.platform.internalPG",
            "null",
            "통합 PostgreSQL 연결 설정; 설치 시 구성"
          ],
          [
            "com.polarion.platform.sharedPG",
            "null",
            "Cluster Shared Services PostgreSQL 연결"
          ],
          [
            "com.polarion.startup.workers",
            "min(CPU,maxPoolSize−1) / 가이드 설명은 CPU 수",
            "startup/reindex 및 후속 index 작업의 workers. 문서 간 차이"
          ],
          [
            "com.polarion.startup.workers.phase#",
            "가용 CPU 관련 (개별 기본 확인 필요)",
            "2(Location Index), 3, 7, 9, 10, 11 단계별 worker"
          ],
          [
            "com.siemens.polarion.platform.sql.maxPoolSize",
            "CPU×2, 미설정 시 10~20 제한",
            "PostgreSQL pool; 명시값 하한 10, 20 초과 시 max_connections >4배"
          ],
          [
            "com.siemens.polarion.objectindexing.runtimeWorkers",
            "min(cores/2+1,8)",
            "기동 이후 data indexing workers"
          ],
          [
            "com.siemens.polarion.platform.locationIndex.enabled",
            "false",
            "Location Index 사용; full reindex 및 백업 호환 주의"
          ],
          [
            "com.siemens.polarion.persistence.objectMaps.inMemory",
            "false",
            "기존 Object Maps 메모리 방식 선택; LI가 우선"
          ],
          [
            "com.polarion.platform.security.cacheSize",
            "20000 / 30000 (문서 차이)",
            "보안 캐시 entry 수. 실제 유효 설정 확인"
          ],
          [
            "com.polarion.platform.ehcachexml",
            "<polarion>/polarion/configuration/ehcache.xml",
            "사용자 캐시 설정 파일 위치"
          ],
          [
            "com.polarion.platform.cacheStats.intervalMs",
            "-1",
            "주기적 cache 통계 비활성. 43200000은 12시간"
          ],
          [
            "com.polarion.platform.repository.canHaveEmptyRolesInSvnAccessFile",
            "true",
            "false 시 UI에서 Role 인원 최소 1명 조건 적용"
          ],
          [
            "com.siemens.polarion.javasvndriver.timeoutFastOperations",
            "10000 ms",
            "SVN 메타데이터 등 빠른 작업 timeout"
          ],
          [
            "com.siemens.polarion.javasvndriver.timeoutSlowOperations",
            "120000 ms",
            "문서/Work Item 읽기·쓰기 및 bulk 작업 timeout"
          ],
          [
            "com.siemens.polarion.javasvndriver.retryDelay",
            "500 ms",
            "일시 장애 후 재시도 대기"
          ],
          [
            "com.siemens.polarion.javasvndriver.timeoutRetryRateLimit",
            "30",
            "병렬 SVN 작업의 이동 1분간 재시도 상한"
          ],
          [
            "com.siemens.polarion.platform.memorycache.fileInMemoryLimit",
            "10 MB",
            "Repository 수정 시 파일 메모리 보관 한도, 초과 시 임시 파일"
          ],
          [
            "com.siemens.polarion.projectImport.maxProjectArchiveSize",
            "8 GB (8589934592 bytes)",
            "프로젝트 ZIP import 제한"
          ],
          [
            "com.siemens.polarion.projectImport.skipMimeTypeCheck",
            "false",
            "프로젝트 import MIME 검사 생략 여부"
          ],
          [
            "com.siemens.polarion.attachments.externalStorage.type",
            "null",
            "fileSystem/s3/azure/gcs, 변경 제한"
          ],
          [
            "com.siemens.polarion.attachments.externalStorage.fileSystem.basePath",
            "null",
            "외부 저장소 절대 경로"
          ],
          [
            "com.siemens.polarion.rest.enabled",
            "false",
            "REST endpoint 활성화; false인 경우 503"
          ],
          [
            "com.siemens.polarion.rest.swaggerUi.enabled",
            "false",
            "Swagger UI 활성화; REST enabled도 true 필요"
          ],
          [
            "com.siemens.polarion.rest.bodySizeLimit",
            "2097152 bytes",
            "JSON POST/PATCH/DELETE body 한도; 첨부의 JSON 메타데이터 포함"
          ],
          [
            "com.siemens.polarion.rest.defaultPageSize",
            "100",
            "REST page size 기본"
          ],
          [
            "com.siemens.polarion.rest.maxPageSize",
            "100",
            "최대 요청 page size; 절대 상한 10000"
          ],
          [
            "com.siemens.polarion.rest.maxIncludedSize",
            "500",
            "included entities 제한, 최대 10000"
          ],
          [
            "com.siemens.polarion.rest.maxRelationshipSize",
            "500",
            "relationship entities 제한, 최대 10000"
          ],
          [
            "com.siemens.polarion.rest.security.restApiToken.enabled",
            "false",
            "활성 세션 기반 Polarion Page JS REST 호출 허용"
          ],
          [
            "com.polarion.platform.sql.statementTimeoutSecs",
            "600 s",
            "Polarion 각 DB 연결 statement timeout"
          ],
          [
            "com.polarion.platform.sql.searchSizeLimit",
            "1000000 bytes",
            "SQL 결과 크기 제한"
          ],
          [
            "com.siemens.polarion.previewgenerator.wmfemf.enabled",
            "true",
            "WMF/EMF 내장 pseudo preview"
          ],
          [
            "com.siemens.polarion.nodeJsServer.autoStart",
            "true",
            "수식 SVG 변환 Node.js 자동 시작"
          ],
          [
            "attachments.indexingOfAttachmentContent.enabled",
            "head",
            "head만, true는 head+history, false는 내용 색인 중지"
          ],
          [
            "com.polarion.platform.sql.synchronousHistoryCreation",
            "false",
            "history DB 색인 동기 수행 여부"
          ],
          [
            "com.polarion.platform.sql.synchronousAttachmentIndexingAlways",
            "false",
            "첨부 색인 동기 수행 여부"
          ],
          [
            "com.polarion.platform.sql.populateEnumOptionsTable",
            "false",
            "pre-loading 시 DB enumeration 갱신 Job 시작 여부"
          ],
          [
            "com.siemens.polarion.license.salt.enabled",
            "true",
            "SALT 사용 여부; 기존 라이선스는 false"
          ],
          [
            "com.siemens.polarion.license.salt.server",
            "29000@hostName",
            "SALT 라이선스 서버 주소 형식"
          ],
          [
            "com.polarion.platform.monitoring.notifications.freeSpacePercent",
            "5",
            "디스크 여유 경보 (%)"
          ],
          [
            "com.polarion.platform.monitoring.notifications.disabled",
            "false",
            "모니터링 알림 비활성화 여부"
          ],
          [
            "com.siemens.polarion.nodeJsServer.host",
            "127.0.0.1",
            "수식 변환 서버 host"
          ],
          [
            "com.siemens.polarion.nodeJsServer.port",
            "34568",
            "수식 변환 서버 port"
          ],
          [
            "com.siemens.polarion.systemload.loggingTimeInterval",
            "10000 ms",
            "Linux system load 로깅 주기"
          ],
          [
            "com.siemens.polarion.systemload.minimalValueToLog",
            "1",
            "load average 로그 기록 시작 기준 (CPU % 아님)"
          ],
          [
            "com.polarion.platform.cacheStats.columns",
            "모든 열 (Deployment Guide 6-24)",
            "캐시 통계 출력 열 선택"
          ]
        ]
      }
    ]
  },
  "apache": {
    "ref": "Deployment and Maintenance Guide, 6-28~6-34, 8-81; Apache 2.4 MPM",
    "sections": [
      [
        "MPM 설정과 의미",
        "Linux에서는 가능한 경우 event MPM을 사용하고, 미지원 환경에서는 worker를 권장한다. event/worker의 동시 처리 상한은 ServerLimit × ThreadsPerChild와 MaxRequestWorkers의 관계를 확인한다. ThreadLimit과 ServerLimit은 실행 중 자유롭게 변경되는 값이 아니다. StartServers는 초기 프로세스 수이며 실제 부하에 따라 spare thread 기준으로 프로세스 수가 조절된다."
      ],
      [
        "MPM 튜닝 절차",
        "현재 부하에서 CPU, RSS, BusyWorkers/IdleWorkers, HTTP 응답시간을 기록한다. 요청 한도와 스레드 수가 실제 병목인지 먼저 판단한다. 변경 전 설정 구문 검사 후 검증 환경에서 요청량과 메모리 사용량을 비교한다. ServerLimit/ThreadLimit 같은 수명 범위 설정은 전체 stop/start가 필요한지 확인한다."
      ],
      [
        "메모리 증가 및 CPU 상승",
        "MaxConnectionsPerChild가 0이면 연결 횟수에 의한 자식 교체 제한이 없다. 양수로 설정하면 연결 처리 수 기준으로 교체되지만 특정 요청이 오래 지속되거나 프로세스 내부 메모리 증가가 발생하는 근본 원인이 해결된다고 보장하지 않는다. 로그의 요청 시간, CPU 및 PID RSS를 같이 확인한다."
      ]
    ],
    "tables": [
      {
        "title": "2606 문서의 Linux event MPM 예시",
        "head": [
          "지시어",
          "예시값",
          "의미"
        ],
        "rows": [
          [
            "StartServers",
            "6",
            "초기 자식 수"
          ],
          [
            "ServerLimit",
            "16",
            "자식 프로세스 한도 관련"
          ],
          [
            "MinSpareThreads",
            "25",
            "idle 스레드 하한"
          ],
          [
            "MaxSpareThreads",
            "75",
            "idle 스레드 상한"
          ],
          [
            "ThreadLimit",
            "64",
            "자식별 스레드 설정 한도"
          ],
          [
            "ThreadsPerChild",
            "25",
            "자식별 작업 스레드"
          ],
          [
            "MaxRequestWorkers",
            "400",
            "동시 요청 처리 한도"
          ],
          [
            "MaxConnectionsPerChild",
            "20000",
            "연결 수 기준 자식 교체"
          ]
        ]
      }
    ],
    "code": "httpd -V\nhttpd -M | grep mpm\nhttpd -t\nhttpd -t -D DUMP_RUN_CFG\nps -C httpd -o pid,ppid,%cpu,rss,nlwp --sort=-rss\n# RHEL 예시: 설정 파일만 조회\ngrep -RInE '^[[:space:]]*(ServerLimit|ThreadsPerChild|MaxRequestWorkers|MaxConnectionsPerChild)' /etc/httpd --include='*.conf'",
    "verify": "예시는 범용 운영 정답이 아니다. 현재 모듈·서버 역할·CPU·메모리·동시 요청에 맞추고 400 workers로 설정한 경우 16×25와 일치하는지 확인한다."
  },
  "svn": {
    "ref": "Deployment and Maintenance Guide, 5-40~5-44, 6-3~6-10, 8-81~8-83; Administrator and User Help, 4-123~4-124; 6-4~6-5 (svnserve 예시)",
    "sections": [
      [
        "SVN 시스템 접근과 사용자 접근",
        "repo는 일반 저장소 URL이며 repoSystem은 시스템 사용자의 읽기 전용 대체 URL이다. 운영 인덱싱 성능을 위해 svnserve의 svn:// 경로를 설정하는 것이 공식 지침이다. svnserve는 내부 접근 용도로 제한한다. 2606 지원 버전은 1.14.x이다."
      ],
      [
        "SVN 처리량과 캐시",
        "Siemens의 산정 지침은 동시 사용자 한 명당 HTTP SVN 연결 2개 및 svnserve 연결 2개를 기준으로 검토한다. SVNInMemoryCacheSize는 KB 단위로 128 MB가 131072에 해당한다. 1.10+에서 이 설정을 0으로 만드는 것은 권장하지 않는다. svnserve의 -M 단위는 MB이다."
      ],
      [
        "Repository 관리",
        "svnadmin pack은 shard 단위 저장 구조를 최적화하며 리비전 이력을 삭제하지 않는다. 정기 pack을 권장하지만 대규모 저장소에서는 I/O 영향을 확인한다. 저장소 포맷 변경은 dump→create→load→pack 순서의 별도 작업이며 Polarion 업그레이드와 동시에 하지 않는 것이 문서 권고다."
      ],
      [
        "Access File 변경 영향",
        "2606에서 2506 이후 구성의 Access File은 저장소의 /.polarion/access를 사용한다. Apache에서 해당 위치의 AuthzSVNAccessFile을 확인한다. 권한 변경 시점과 CPU 상승, 지연 요청을 상관 분석하되 원인으로 단정하지 않는다."
      ],
      [
        "svnserve 시스템 접근의 운영 검증",
        "repoSystem은 사용자 HTTP 접근 경로와 구분되는 시스템 읽기용 URL이다. Linux에서는 실제 svnserve 서비스의 bind 주소, -r 저장소 root, -R read-only, thread 및 memory cache 설정을 확인한다. 6-5의 예시는 512 동시 사용자에 대한 로컬 구성으로 min threads 64, max threads 1024, cache 2048 MB이며 일반 권장 기본값으로 해석하지 않는다. 원격 Shared Services 구성에는 실제 필요한 호스트와 접근 정책을 적용한다."
      ],
      [
        "SVN 캐시와 느린 요청",
        "cache size 및 text delta/full text cache는 SVN 서버 읽기 처리 비용에 영향을 줄 수 있다. cache 확대 전 현재 리소스, 요청 종류와 정상 대비 지연을 확인한다. svnserve의 -M 단위는 MB, Apache SVNInMemoryCacheSize는 KB로 구분한다. svnserve와 HTTPD의 설정은 각각 독립적으로 관리한다."
      ]
    ],
    "code": "svnlook youngest /path/to/repo\nsvnlook uuid /path/to/repo\n# 구성 확인\nsvnserve --version --quiet\nsvnserve --help\n# polarion.properties 예시(실제 svnserve root 확인)\nrepoSystem=svn://localhost/\n# Apache mod_dav_svn 설정 예시\nSVNInMemoryCacheSize 131072\nSVNCacheTextDeltas On\nSVNCacheFullTexts On",
    "verify": "read-only 시스템 URL이 의도한 저장소를 가리키는지, 사용자 접근 URL과 동일 리비전인지 검증한다. 저장소 경로를 직접 수정하지 않는다."
  },
  "postgres": {
    "ref": "Deployment and Maintenance Guide, 6-10~6-14, 8-86~8-88; Config Properties Reference",
    "sections": [
      [
        "기본 경로",
        "기본 Linux 데이터 위치는 /opt/polarion/data/postgres-data, 기본 local port는 5433이다. PostgreSQL 설정 파일은 postgresql.conf, 접속 허용 정책은 pg_hba.conf이다. 설치 방식 및 분리 배치에 따라 실제 위치와 포트는 다를 수 있다."
      ],
      [
        "Pool과 max_connections",
        "Polarion은 HEAD, HEAD read-only, History의 세 pool을 사용하며 Resource Traceability pool은 별도이다. workers를 명시적으로 조정한다면 maxPoolSize를 workers의 약 2배로 맞추고 PostgreSQL max_connections는 pool의 4배 이상을 확보한다. Config Reference의 명시값 20 초과 경고는 4배보다 큰 값을 요구한다. 다른 DB 접속 및 Apache DBD의 여유도 필요하다."
      ],
      [
        "DB 성능과 데이터 안전",
        "Deployment Guide에는 재구축 가능한 SQL 인덱스 중심의 튜닝 예시가 있으나 fsync, synchronous_commit, full_page_writes 비활성화는 내구성에 영향을 준다. 2606에서 인증 데이터도 PostgreSQL에 저장되므로 시스템 DB에 무조건 적용하지 않는다. autovacuum, dead tuple, 장시간 트랜잭션, I/O를 먼저 확인한다."
      ],
      [
        "연결 및 대기 상태 진단",
        "pg_stat_activity의 state는 backend의 처리 상태이고 wait_event_type/wait_event는 현재 대기 이벤트를 표시한다. active이면서 wait_event가 존재할 수도 있다. idle in transaction은 트랜잭션이 열린 상태에서 다음 요청을 기다리는 상태다. 장시간 열린 트랜잭션은 직접 종료하기 전에 해당 애플리케이션 작업과 영향 범위를 확인한다."
      ],
      [
        "Pool 수와 연결 수",
        "Polarion의 HEAD, HEAD read-only, History 연결 pool 외에 Resource Traceability pool(문서 기본 10) 및 외부 서비스가 별도 존재할 수 있다. 명시 maxPoolSize 20 초과의 경우 PostgreSQL max_connections를 4배 초과로 맞추라는 조건을 적용하고 실제 연결 여유를 검증한다. DB CPU 사용량이 낮아도 pool 대기가 발생할 수 있으므로 활성 연결·최대 설정 및 애플리케이션 로그를 비교한다."
      ]
    ],
    "tables": [
      {
        "title": "6-11 설정 예시 (전용 인덱스 DB 기준 검토)",
        "head": [
          "설정",
          "예시/권고",
          "해석"
        ],
        "rows": [
          [
            "max_connections",
            "80 / pool×4 이상",
            "전체 DB 접속량 고려"
          ],
          [
            "shared_buffers",
            "2 GB / RAM 10~15%; 큰 RAM 시스템은 20 GB 이하 권고",
            "SHMMAX 및 실제 부하 확인"
          ],
          [
            "work_mem",
            "10 MB / 10~100 MB",
            "연산별 할당 가능"
          ],
          [
            "maintenance_work_mem",
            "200 MB",
            "유지보수 메모리"
          ],
          [
            "effective_cache_size",
            "4 GB / RAM 약 1/3",
            "쿼리 플래너 추정값"
          ],
          [
            "max_locks_per_transaction",
            "200",
            "락 관련 예시"
          ],
          [
            "max_wal_size",
            "2000 MB",
            "WAL 크기 목표"
          ],
          [
            "statement_timeout",
            "590000 ms",
            "서버측 예시; 앱 property 별도"
          ]
        ]
      }
    ],
    "code": "SHOW port;\nSHOW max_connections;\nSHOW shared_buffers;\nSHOW statement_timeout;\nSELECT datname,state,wait_event_type,count(*) FROM pg_stat_activity GROUP BY 1,2,3 ORDER BY 4 DESC;\nSELECT schemaname,relname,n_live_tup,n_dead_tup,last_autovacuum FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 20;",
    "verify": "DB별 역할과 데이터 내구성을 확인하고 재시작 전 백업 및 영향 검토를 한다. Apache DBD는 PostgreSQL 재시작 후 연결이 stale해질 수 있으므로 Apache 재시작 필요성을 확인한다."
  },
  "jvm": {
    "ref": "Deployment and Maintenance Guide, 3-21, 6-1~6-2, 6-14~6-28",
    "sections": [
      [
        "JVM Heap 설정",
        "Linux 기본 파일은 /opt/polarion/etc/config.sh, Windows는 polarion.ini이다. Xms와 Xmx는 초기/최대 heap, G1GC는 문서 예시의 GC이다. 운영 sizing 표와 실제 사용량을 기준으로 결정한다."
      ],
      [
        "Heap 분석",
        "RSS는 heap 외 native memory 등을 포함한다. GC 이후 사용량이 지속적으로 올라가는지, full GC/정지 시간이 증가하는지, 캐시 eviction과 연동되는지 기록한다. 단순히 heap이 높다는 이유로 늘리지 않는다."
      ],
      [
        "Ehcache 별도 문서",
        "아래 Ehcache 구성·기본값·통계 문서에서 캐시를 구분한다. 캐시 heap entry 증가는 JVM heap 사용량도 증가시킨다."
      ]
    ],
    "code": "# 예시: 32 GB 서버에 Java 16 GB (공식 소형 등급)\n# /opt/polarion/etc/config.sh 의 PSVN_JServer_opt 내 옵션 검토\n-Xms16G\n-Xmx16G\n-XX:+UseG1GC\n-XX:+HeapDumpOnOutOfMemoryError\n# 읽기 중심 OS 진단\nfree -h\nps -eo pid,comm,%cpu,rss --sort=-rss | head -20",
    "verify": "Heap 설정 변경 후 Java 옵션, GC 지표, 서비스 및 응답 시간을 검증한다. Heap dump는 파일 크기·운영 중단 위험 확인 후 수행한다."
  },
  "index": {
    "ref": "Deployment and Maintenance Guide, 8-83~8-89; Administrator and User Help 4-1080; Config Properties Reference",
    "sections": [
      [
        "복구 수준 선택",
        "SVN commit과 Polarion 시작 시 마지막 색인 리비전 이후 변경을 반영한다. Work Item 누락, 이력 이상이면 전체 Reindex부터 하지 않는다. 전역 또는 프로젝트 Administration > Maintenance > Index에서 대상 index를 선택하고 Refresh Index를 수행한다. 해결되지 않으면 Check Index를 실행한다. 그 후에도 문제가 남으면 전체 재구축을 계획한다."
      ],
      [
        "전체 Reindex",
        "Polarion을 종료한 뒤 Linux에서는 polarion.init reindex, Windows에서는 reindex.bat를 수행한다. 재구축 스크립트는 기존 workspace/polarion-data를 polarion-data.saved로 옮긴 후 새 index를 생성하고 서비스를 시작한다. 사용자 이용은 core index 재구축 중 제한된다. 작업 도중 중지하면 재실행이 필요하므로 멈춘 것처럼 보여도 startup 로그부터 확인한다."
      ],
      [
        "백그라운드 색인",
        "History DB 재색인 동안 사용자는 일반 서비스를 이용할 수 있으나 이력, baseline/Time Machine, 역사 SQL 보고서, Plan 차트와 일부 Test 관련 기능에 제한이 있을 수 있다. 인덱스 완료와 일반 서비스 기동 완료를 혼동하지 않는다."
      ],
      [
        "workers 및 DB 연결",
        "workers, maxPoolSize, PostgreSQL max_connections를 함께 산정한다. 별도 phase workers는 Siemens가 특수 상황에서만 조정하도록 안내한다. Config Reference에는 phase 2도 Location Index에 한해 기술된다."
      ],
      [
        "History DB 재색인 진행 중 사용자 영향",
        "core index가 완료되어 접속이 가능해져도 History DB Creator가 진행 중이면 Document History의 backlink나 삭제 댓글이 불완전할 수 있다. Baseline(Time Machine), 역사 SQL 보고서, Plan burn-up/burn-down 및 일부 Test Management form extension은 사용 제한 또는 오류가 나타날 수 있다. 검색과 역사 기능 완료 시각을 따로 기록한다."
      ]
    ],
    "tables": [
      {
        "title": "단계별 workers 조정 대상",
        "head": [
          "Phase",
          "작업"
        ],
        "rows": [
          [
            "2",
            "Context recognition (Location Index 사용 시)"
          ],
          [
            "3",
            "Context initialization"
          ],
          [
            "7",
            "Data indexing (다른 startup 단계에서의 data indexing에도 사용)"
          ],
          [
            "9",
            "Tomcat application startup; cluster에서는 1보다 크게 설정"
          ],
          [
            "10",
            "AttachmentIndexer"
          ],
          [
            "11",
            "DBHistoryCreator"
          ]
        ]
      }
    ],
    "code": "# 승인된 전체 재구축 작업 (Linux 기본 경로)\nsystemctl stop polarion\n/opt/polarion/bin/polarion.init reindex\n# 별도 셸에서 진행 로그 확인\nls -lt /opt/polarion/data/logs/main/log4j-startup-*.log\n# 예시: 16 workers의 설정 검토\ncom.polarion.startup.workers=16\ncom.siemens.polarion.platform.sql.maxPoolSize=32\n# PostgreSQL max_connections는 128보다 큰 값 및 실제 여유 검토",
    "verify": "startup 로그 단계, Monitor의 후속 Job 및 누락 항목, 이력, 검색, SQL 기반 기능을 검증한다."
  },
  "cluster": {
    "ref": "Deployment and Maintenance Guide, 2-65~2-113, 5-56, 8-25~8-53",
    "sections": [
      [
        "신규 Cluster 구축 계획",
        "2606 가이드는 동일 버전의 Coordinator, Node 1, Node 2, Shared Services를 별도 구성하는 4대 예시를 제공한다. 초기에는 동일 버전 Standalone 설치 및 독립 검증을 수행할 수 있다. 운영 SVN은 Shared Services에만 생성하고 Cluster 구성이 끝나기 전 신규 Node를 서비스에 공개하지 않는다. Node에는 Java/Apache/PostgreSQL, Coordinator에는 Java/Apache, Shared Services에는 Apache/SVN이 기본 역할에 필요한 구성요소로 설명된다. 실제 인증 DB 배치도 함께 확정해야 한다."
      ],
      [
        "공유 구성",
        "Cluster의 각 Application Node, Coordinator에서 공유 폴더가 동일한 지정 경로로 마운트되어야 한다. Linux 기본 예시는 /opt/polarion/shared이며 Shared Services Folder로 연결된다. Coordinator와 Node의 com.polarion.shared 값이 일치해야 한다."
      ],
      [
        "공유 스토리지와 Load Balancer",
        "Linux 공유 데이터는 NFSv4.2를 사용하도록 가이드가 안내하며 NFSv3 및 SSHFS는 사용하지 않도록 권고한다. Shared Services에서 loadbalancer.conf.apache24.template을 기반으로 LB 구성을 만들고 Cluster LB의 ProxyTimeout 600초 예시를 검토한다. 실제 export/mount 권한은 승인된 네트워크 정책과 서비스 계정의 일관성을 고려해 제한적으로 구성한다. 신규 구축에만 해당하는 서비스 제거 단계를 기존 운영 서버에 그대로 실행하지 않는다."
      ],
      [
        "버전과 운영 상태",
        "Coordinator와 연결된 Node/Instance의 제품 버전이 다를 때 사용자 로그온하는 구성은 지원하지 않는다. Repository 업데이트는 한 번만 수행해야 한다. 이 원칙은 재시작, 패치 및 장애 복구에 중요하다."
      ],
      [
        "장애 격리",
        "한 Node 장애인지 공유 SVN/DB/인증/Load Balancer 장애인지 구분한다. Load Balancer 상태를 확인하고 영향 노드를 제외할 경우 승인 및 잔여 Node 용량을 검토한다. 다른 Node에서 동일 기능을 검증한다."
      ],
      [
        "노드 단독 장애와 공통 서비스 장애",
        "하나의 Node만 실패하면 LB 상태·노드 로컬 JVM/인덱스·DB 연결 및 로그를 비교하고, 여러 Node가 동시에 실패하면 Coordinator, SVN, 인증 DB, shared storage 등 공통 의존성도 조사한다. Coordinator 중지 시 모든 배포에서 동일한 서비스 가용성이 보장된다고 가정하지 않는다. 작업 범위를 정상 노드 및 잔여 용량과 함께 평가한다."
      ]
    ],
    "code": "# 모든 관련 서버에서 실제 mount 확인\nfindmnt -T /opt/polarion/shared\nls -ld /opt/polarion/shared\n# 공유 경로 설정 확인\n grep -n '^com\\.polarion\\.shared=' /opt/polarion/etc/polarion.properties",
    "verify": "Node·Coordinator의 동일 버전, 공유 폴더 접근, 사용자 로그인 및 failover 시나리오를 검증한다."
  },
  "backup": {
    "ref": "Deployment and Maintenance Guide, 4-83, 8-135~8-144",
    "sections": [
      [
        "백업 대상 구분",
        "Polarion의 Backup Job은 Lucene/SQL index/Object Maps 등을 복원하기 위한 기능이다. 고객의 전체 SVN 및 외부 첨부 원본을 백업하는 기능은 아니다. 전체 운영 백업과 인덱스 백업을 별도 정책으로 둔다."
      ],
      [
        "운영 백업 범위",
        "SVN 원본, DB(특히 system 인증 데이터), 외부 첨부 저장소, polarion.properties, 커스텀 설치·확장, 필요한 build 및 report trend 데이터, Connectors 관계 DB, 라이선스 및 Secrets Manager 관련 자료를 포함한다. 보관 시점을 일관되게 기록한다."
      ],
      [
        "인덱스 backup/restore",
        "Global Administration > Scheduler에 polarion.jobs.backup Job을 설정한다. Monitor의 Scheduled Jobs에서 Backup Job을 선택하여 Execute now를 누르고 결과 경로를 확인한다. 복원 스크립트는 로컬 PostgreSQL 설치가 있어야 한다. Polarion 및 관련 PostgreSQL을 중지한 뒤 관리자 권한으로 restore.sh의 -backupFile을 지정하여 실행한다. 성공 후 DB, Polarion 순으로 시작한다."
      ],
      [
        "복원 범위의 검증",
        "Index backup과 운영 전체 백업을 복원 시나리오별로 분리한다. 예를 들어 검색만 손상된 경우와 SVN/인증 DB/외부 첨부 손상이 발생한 경우는 복구 자료가 달라진다. 정합성이 필요한 구성요소를 같은 시점으로 복원하고 복원 후 신규 쓰기, 이력 및 권한까지 확인한다."
      ]
    ],
    "tables": [
      {
        "title": "Index Backup Job 파라미터",
        "head": [
          "키",
          "기본",
          "역할"
        ],
        "rows": [
          [
            "folder",
            "data/backup",
            "백업 아카이브"
          ],
          [
            "tempFolder",
            "사용자 temp",
            "임시 경로"
          ],
          [
            "workers",
            "가용 CPU 수",
            "백업 작업 스레드"
          ],
          [
            "postgresTimeout",
            "240분",
            "DB 백업 제한시간"
          ],
          [
            "postgresCommand",
            "-F t -z -X s",
            "pg_basebackup 옵션"
          ],
          [
            "removeNodeFromCluster",
            "false",
            "클러스터 LB 제외 옵션"
          ]
        ]
      }
    ],
    "code": "<!-- Scheduler 설정 예시 -->\n<job id=\"polarion.jobs.backup\" name=\"Index backup\" scope=\"system\"/>\n# 복구 연습용 명령 (서비스 종료 및 승인 후)\n/opt/polarion/bin/restore.sh -backupFile /path/to/backup.zip",
    "verify": "격리된 환경에서 백업을 실제 복원하고 로그인·Work Item·첨부·이력·검색을 확인한다. 백업 성공 로그만으로 복구 성공이라고 판단하지 않는다."
  },
  "upgrade": {
    "ref": "Deployment and Maintenance Guide, 8-1~8-25, 8-80; 2606 update package files",
    "sections": [
      [
        "업데이트 사전 준비",
        "SVN, DB, 구성·권한·인증 정보 및 필수 build를 백업한다. 설치 환경의 Java 21 및 지원 OS/DB/SVN을 먼저 확인한다. 패키지의 5_Required_Config_changes.txt, 3_Third-party_for_Linux.txt(Windows는 4_Third-party_for_Windows.txt), 2_How_to_update_Polarion.txt를 실제 대상 릴리스 기준으로 검토한다."
      ],
      [
        "Single Instance Linux 업데이트",
        "1. Polarion 중지 및 NodeJS/Variants 잔류 확인. Apache와 PostgreSQL은 일반 update 단계에서 계속 실행하는 것이 문서 권고이다. 2. 사용자 플러그인/feature를 백업. 3. legacy DB URL을 쓰는 경우 system DB 준비. 4. update.sh를 root로 실행. 5. 경고 파일과 필수 구성 변경 확인. 6. 인증 DB·SVN access·보안 헤더·외부 확장 관련 변경을 적용. 7. 서비스 기동 및 필요한 색인 완료 검증."
      ],
      [
        "2404에서 2606으로 전환할 때 확인",
        "2506에 도입된 SVN 내 Access File 관리, 2512부터 passwd/passwd_credentials의 PostgreSQL 관리, 2606 Secrets Manager 및 보안 헤더 이동 등을 별도 검증한다. 변경 전/후 Apache 설정과 polarion.properties diff를 남긴다. 변경점별 상세 항목은 별도 문서로 분리했다."
      ],
      [
        "Cumulative Patch",
        "동일 버전의 공개 누적 패치는 앞선 패치의 수정 내용을 포함한다. 일반적으로 minor update는 Reindex를 요구하지 않지만 실제 패키지의 안내와 required config changes에 따라 판단한다. 주요 업데이트 시 자동 재색인으로 중단이 길어질 수 있다."
      ]
    ],
    "code": "# 승인된 단일 인스턴스 업데이트 작업\nsystemctl stop polarion\n# 배포 패키지를 해제한 위치에서\nchmod +x update.sh\n./update.sh\n# warnings.txt 및 필수 설정 검토 후 기동\nsystemctl start polarion",
    "verify": "구버전 호환 확장·인증·SVN 경로·패치별 수정사항을 테스트 환경에서 확인한다. 롤백은 전체 정합 백업 복원 계획을 기준으로 한다."
  },
  "roles": {
    "ref": "Administrator and User Help, 4-86~4-124, 4-145~4-176",
    "sections": [
      [
        "역할 구성",
        "권한은 Role에 부여하고 Role은 사용자에 할당한다. Repository 범위 Role과 Project 범위 Role을 구분한다. Global 관리자는 전체 계정을 볼 수 있으나 프로젝트 관리자는 자신이 관리하는 프로젝트에 Role이 지정된 사용자만 접근할 수 있다."
      ],
      [
        "메뉴",
        "Global Administration 또는 Project Administration > User Management에서 Users, Groups, Roles, Repository access, Permissions Management를 확인한다. Permissions Management > By Role에서 Role별 접근 수준을, By Permission에서 대상 권한별 Role 및 Scope를 확인한다."
      ],
      [
        "SVN 동기화",
        "Roles 화면의 Synchronize SVN Access File은 role 정의/사용자 role 할당과 SVN access의 group membership를 동기화한다. Access File의 첫 부분인 그룹 정의에만 영향을 주며 뒤쪽 디렉터리 규칙은 수정하지 않는다. 수동으로 user-roles.xml/access를 바꾼 후 권한 불일치가 발생할 경우 검토한다."
      ],
      [
        "권한 점검",
        "사용자 권한 문제가 프로젝트 단위인지, 객체별 READ/MODIFY인지, SVN 경로 권한인지 분리한다. 동일 프로젝트에서 정상 계정과 문제 계정의 Role 및 Group을 비교하고 실제 작업을 테스트한다."
      ]
    ],
    "verify": "Global 권한 부여로 우회하지 않고 필요한 권한만 부여한다. access 동기화 전후 차이와 사용자별 테스트를 기록한다."
  },
  "project": {
    "ref": "Administrator and User Help, 2-56~2-189, 4-43~4-46, 4-59~4-63",
    "sections": [
      [
        "프로젝트 생성",
        "Repository 선택 후 Administration > Projects > New Project에서 템플릿을 이용한다. Project ID는 시스템 식별자이며 표시 이름·경로와 별개다. ID에는 영문자, 숫자, underscore, dash, period를 사용하고 공백은 제외한다. Tracker Prefix는 시스템 내 유일하게 관리하는 것이 권장된다."
      ],
      [
        "기존 경로 Mark",
        "Global Administration > Projects > Mark Project에서 Location에 SVN 폴더 경로를 지정한다. 기존 프로젝트를 다시 Mark할 때 ID를 변경하면 이력을 잃을 수 있다. Project Details에서 필요한 정보를 확인한다. 프로젝트 목록에서 사라졌다고 무조건 재Mark 또는 삭제하지 않는다."
      ],
      [
        "Mark 상태 불일치",
        "먼저 global 관리자로 Projects 목록을 조회한다. 실제 SVN 폴더와 ID, 권한, index 상태를 확인한다. 동일 경로가 이미 Mark되어 있는 경우 중복 생성·폴더 삭제 대신 로그·정상 리비전·프로젝트 등록 상태를 조사한다. 해당 프로젝트가 표시되는 경우 Maintenance의 Refresh/Check Index를 검토한다."
      ]
    ],
    "verify": "대상 경로·ID·이력·사용자 권한·목록 노출·검색을 확인한다."
  },
  "attachments": {
    "ref": "Deployment and Maintenance Guide, 5-28~5-36; Administrator and User Help 4-613~4-621; Config Properties Reference",
    "sections": [
      [
        "External Storage 저장 방식",
        "외부 저장소에 실제 바이너리가 저장되고 SVN에는 .ref.xml 메타데이터가 남는다. checksum 기반으로 동일 내용의 바이너리를 중복 저장하지 않으며 checksum 앞 두 문자로 하위 경로가 분류된다. 메타데이터의 리비전으로 과거 버전 접근이 가능하다. .ref.xml은 Polarion이 관리하며 수동 생성·편집 대상이 아니다."
      ],
      [
        "지원 방식과 전환 제한",
        "fileSystem, s3, azure, gcs 중 하나를 선택한다. 일단 외부 저장 방식을 구성하면 다른 외부 저장 방식으로 전환하거나 SVN에 신규 첨부 저장하는 것은 지원하지 않는다. 기존 데이터 이전은 지원되지 않는다고 문서에 명시한다."
      ],
      [
        "파일시스템 설정",
        "설정 전 basePath 디렉터리가 실제로 존재해야 하며 절대 경로, 설치 경로 밖, Polarion 서비스 계정 쓰기 가능 조건을 갖춰야 한다. Cluster에서는 모든 Node가 동일한 공유 위치에 접근할 수 있어야 한다."
      ],
      [
        "장애 분석",
        "업로드의 HTTP 상태/요청 크기, Apache 및 Polarion 로그를 확인한다. 외부 저장소 권한과 공간을 확인하고 다운로드·기존 리비전도 검증한다. 백업 정책은 SVN 메타데이터와 바이너리를 함께 보존해야 한다."
      ],
      [
        "업로드 Antivirus와 장애 분류",
        "com.siemens.polarion.antivirus.scannerCmd에 승인된 검사 실행 파일 또는 wrapper를 지정하면 파일이 임시 저장된 뒤 검사되고 정상 파일만 영구 저장된다. 검사 대상은 첨부뿐 아니라 ReqIF, Page/Project import, Word round-trip 등 전체 업로드다. 표준화된 검사 종료 코드 0은 정상, 1은 감염, 기타는 검사 실패로 처리된다. 감염이나 검사 실패는 업로드 거부와 transaction rollback을 유발한다. 파일별 거부 시 검사 프로그램의 상태 및 exit code를 확인하되 검사를 우회하지 않는다."
      ]
    ],
    "code": "# fileSystem 예시: 사전에 경로 생성 및 권한 검증\ncom.siemens.polarion.attachments.externalStorage.type=fileSystem\ncom.siemens.polarion.attachments.externalStorage.fileSystem.basePath=/storage/polarion-attachments",
    "verify": "작은 신규 첨부의 업로드·다운로드·버전 변경 후 이전 버전 조회를 테스트한다. 스토리지 전환은 복구 방안 없는 운영 변경으로 진행하지 않는다.",
    "tables": [
      {
        "title": "업로드 처리 결과와 진단 기준",
        "head": [
          "단계",
          "확인",
          "실패 시"
        ],
        "rows": [
          [
            "HTTP 수신",
            "상태 코드, 요청 크기",
            "Apache 및 proxy 로그"
          ],
          [
            "Antivirus 검사",
            "프로그램 실행/종료 코드",
            "0 정상 / 1 감염 / 기타 검사 오류"
          ],
          [
            "Polarion 저장",
            "사용자 권한, 앱 로그",
            "객체·작업 상태 확인"
          ],
          [
            "External Storage",
            "basePath/공유 경로, 용량",
            "접근 및 쓰기 권한 확인"
          ],
          [
            "조회 및 Preview",
            "SVN 메타데이터, 원본 파일",
            "다운로드와 렌더링 오류 분리"
          ]
        ]
      }
    ]
  },
  "migration": {
    "ref": "Administrator and User Help, 4-59~4-63; Config Properties Reference",
    "sections": [
      [
        "Project Export",
        "Global Administration > Projects에서 프로젝트를 선택하고 Export를 클릭한다. Export 작업 창의 job logs 링크에서 진행 및 결과를 확인한다. 성공 로그에는 Global Admin이 내려받을 수 있는 export URL이 표시된다."
      ],
      [
        "Project Import",
        "Global Administration > Projects > Import에서 유효한 ZIP과 Folder Name을 지정한다. ZIP에는 프로젝트 및 .polarion 폴더가 있어야 한다. 대상 Folder Name은 기존에 존재하면 안 된다. Location은 선택 사항이며 유효한 경로여야 한다. Import 실행 후 job logs에서 결과를 확인한다."
      ],
      [
        "제한과 성능",
        "기본 archive 한도는 8 GB(8,589,934,592 bytes)이다. maxProjectArchiveSize를 이용해 조정할 수 있다. skipMimeTypeCheck의 기본값은 false이다. 검사를 생략하는 것은 보안 검토가 필요한 선택이며 단순히 속도를 높이기 위해 적용하지 않는다."
      ],
      [
        "이전 이후 확인",
        "프로젝트 ID와 경로, Work Item/문서 수, 첨부파일, 링크, 권한, 검색 및 이력을 확인한다. Export/Import가 SVN repository 전체의 이력 복원과 동일하다고 가정하지 않는다. 실패 시 Job 로그와 대상 반영 범위를 먼저 확인한다."
      ]
    ],
    "code": "com.siemens.polarion.projectImport.maxProjectArchiveSize=8589934592\ncom.siemens.polarion.projectImport.skipMimeTypeCheck=false",
    "verify": "대상 프로젝트 활성화가 필요한 경우 Mark 절차를 수행하되 기존 ID/경로와 충돌하지 않는지 검증한다."
  },
  "workflow": {
    "ref": "Administrator and User Help, 4-207~4-313, 8-25~8-59",
    "sections": [
      [
        "설정 우선순위",
        "Work Item Workflow는 ① 프로젝트+Work Item Type ② Global+Type ③ 프로젝트 공통 ④ Global 공통 순서로 가장 구체적인 설정을 탐색한다. Global 변경이 프로젝트별 설정을 가진 대상까지 무조건 덮어쓰지는 않는다."
      ],
      [
        "설정 경로",
        "Administration > Work Items > Workflow에서 상태, 전이, Action, Condition을 정의한다. 전이 조건이 충족되지 않으면 상태 변경을 제한할 수 있다. Action은 필드 값 설정/삭제나 연관 항목 생성 등을 수행할 수 있다. Document 및 Test Run은 별도 workflow를 지원한다."
      ],
      [
        "운영 변경 체크",
        "타입별 상태값, 전이 경로, 필수 필드, Role 조건, 스크립트 Action/Condition, 기존 항목 및 이력에 미치는 영향을 검증한다. 기존 데이터에서 쓰는 enumeration ID는 화면 표시명과 구분한다."
      ]
    ],
    "verify": "신규/기존 Work Item에서 승인·반려·필수 필드 누락·권한별 전이를 테스트한다."
  },
  "admin": {
    "ref": "Administrator and User Help, 4-1~4-22, 4-6",
    "sections": [
      [
        "Administration 진입",
        "Navigation Header에서 Repository 또는 프로젝트를 선택하고 Administration으로 들어간다. Repository scope는 전역, 프로젝트 scope는 해당 프로젝트의 설정이다. 대부분 GUI에서 가능하며 XML 설정도 제공한다."
      ],
      [
        "Global과 Project 상속",
        "Global 설정은 프로젝트에 개별 설정이 없을 때 전파된다. 특정 프로젝트에서 다른 동작이 발생하면 해당 프로젝트의 로컬 구성과 전역 설정의 차이를 먼저 확인한다. 파일 기반 system properties는 이 범위와 별도이다."
      ],
      [
        "운영 메뉴 지도",
        "Projects, User Management, Work Items, Documents, Test Management, Scheduler, Maintenance, Configuration Properties 등 관리 메뉴를 업무별로 구분해 운영한다. 실제 표시 여부는 사용자 관리 권한과 범위에 의존한다."
      ]
    ],
    "verify": "설정 변경 전 선택된 범위와 영향을 받는 프로젝트를 확인한다."
  },
  "logs": {
    "ref": "Deployment and Maintenance Guide, 4-103~4-109, 7-20~7-26, 8-90; 7-26 (System load averages)",
    "sections": [
      [
        "기본 로그 경로",
        "Linux /opt/polarion/data/logs/main, Windows C:\\Polarion\\data\\logs\\main. 날짜별 파일명과 실제 서버 timezone을 확인한다. Apache access/error는 OS 설정에 따라 경로가 다르다."
      ],
      [
        "로그 설정",
        "기본 log4j2.xml은 polarion/plugins/com.polarion.core.util_*/log4j2.xml에 있으며 사용자 설정은 polarion/configuration/log4j2.xml로 복사해 구성한다. 22 R1 이후 구 log4j.properties는 무시된다. monitorInterval 설정 여부에 따라 재시작이 필요할 수 있다."
      ],
      [
        "분석 절차",
        "발생 시각을 고정하고 startup/REST/RPC/TX/main 및 Apache·DB 로그를 겹쳐 본다. 동일 시간의 정상 요청과 느린 요청을 구분한다. 로그에 요청 시간 필드가 없는 경우 추정하지 않는다."
      ],
      [
        "System load 평균 로그 (Linux)",
        "com.siemens.polarion.systemload.loggingTimeInterval 기본 10000ms, com.siemens.polarion.systemload.minimalValueToLog 기본 1이다. load average는 CPU 사용률(%)이 아니며 CPU 수와 실행/대기 작업의 관점에서 해석한다. 같은 시점의 vmstat·CPU·I/O와 비교한다."
      ]
    ],
    "tables": [
      {
        "title": "로그 종류",
        "head": [
          "파일 패턴",
          "용도"
        ],
        "rows": [
          [
            "log4j-startup-*.log",
            "기동 및 재색인 진행"
          ],
          [
            "log4j-rpc-*.csv",
            "GWT RPC 요청"
          ],
          [
            "log4j-restapi-*",
            "REST API 관련"
          ],
          [
            "log4j-tx-*.log",
            "트랜잭션 통계"
          ],
          [
            "log4j-licensing-*.log",
            "라이선스"
          ],
          [
            "log4j-security-*",
            "보안 이벤트"
          ],
          [
            "log4j-monitoring-*",
            "시스템 모니터링"
          ],
          [
            "log4j-scripts-*",
            "스크립트"
          ]
        ]
      }
    ],
    "code": "find /opt/polarion/data/logs/main -maxdepth 1 -type f -name 'log4j-*' -printf '%TY-%Tm-%Td %TH:%TM %f\\n' | sort\n# 실제 날짜의 startup 파일 지정 후\ngrep -inE 'ERROR|WARN|Exception' /path/to/log4j-startup-DATE.log | tail -80",
    "verify": "로그 타임존·수집 시각·파일명·서버 역할을 기록하고 토큰, 쿠키 및 개인 정보를 공유 전 검토한다."
  },
  "handover": {
    "ref": "Deployment and Maintenance Guide 3-2~3-6, 7-1, 8-140; 자체 운영 점검표",
    "sections": [
      [
        "인수인계 환경대장",
        "서버 역할/호스트, 설치 버전 및 패치, OS/Java/SVN/Apache/DB 버전, 서비스 unit, 설치 및 저장 경로, DB port, Apache MPM, JVM Xmx/Xms, repo/repoSystem, 공유 storage, license 유형/만료, 인증 방식, 연결된 외부 시스템, 백업 경로·주기, 담당자 및 변경 승인 체계를 기록한다. 실제 운영 값은 공개 페이지에 저장하지 않는다."
      ],
      [
        "일일",
        "노드별 상태, 디스크 여유, CPU/RAM, 오류 건수, 최근 backup 결과, 실패 Job, 라이선스 잔여 사용량 및 사용자 주요 기능을 확인한다."
      ],
      [
        "주간/월간",
        "저장소 증가량, 느린 요청 상위 유형, GC 및 cache eviction, DB dead tuple/용량, SVN pack 결과, 복원 연습, 패치 및 지원 버전, 인증서/라이선스 만료 일정을 확인한다."
      ]
    ],
    "verify": "새 담당자가 관리자 계정 없이도 읽기 가능한 점검 정보를 찾고, 승인된 절차로 실제 조치를 수행할 수 있는지 인수인계 검증한다.",
    "tables": [
      {
        "title": "운영 인수인계 환경 대장 (내부용 작성 항목)",
        "head": [
          "분야",
          "인수인계 시 필수 항목",
          "검증 증빙"
        ],
        "rows": [
          [
            "서비스",
            "구성 유형, URL, 버전/패치, 서버 역할 및 담당자",
            "구성도 / 설치·상태 확인"
          ],
          [
            "서버",
            "OS, CPU, RAM, JVM, filesystem mount, disk/IOPS",
            "서버 자원 기록"
          ],
          [
            "데이터",
            "SVN 경로/URL, rev, DB 역할/port, external storage",
            "경로 및 접근 검증"
          ],
          [
            "보안",
            "인증 유형, Role·Group, 인증서 만료, 비밀정보 보관 위치",
            "승인 계정 테스트"
          ],
          [
            "유지보수",
            "백업 범위, 주기, 복구 목표, 패치 창, Job",
            "최근 백업/복구 결과"
          ],
          [
            "장애",
            "로그 경로, 모니터링, 에스컬레이션, 미해결 이슈",
            "최근 장애 및 조치 이력"
          ],
          [
            "연동",
            "API, connector, plugin, script, 운영 책임자",
            "연동 목록 및 테스트"
          ]
        ]
      }
    ]
  },
  "paths": {
    "ref": "Deployment and Maintenance Guide 3-2~3-6, 6-21, 8-89, 8-140",
    "tables": [
      {
        "title": "Linux 기준 경로",
        "head": [
          "경로",
          "역할"
        ],
        "rows": [
          [
            "/opt/polarion",
            "제품 설치"
          ],
          [
            "/opt/polarion/etc/polarion.properties",
            "시스템 설정"
          ],
          [
            "/opt/polarion/etc/config.sh",
            "JVM 및 서비스 환경"
          ],
          [
            "/opt/polarion/polarion/configuration/ehcache.xml",
            "사용자 cache override"
          ],
          [
            "/opt/polarion/polarion/configuration/log4j2.xml",
            "사용자 로그 설정"
          ],
          [
            "/opt/polarion/data/svn/repo",
            "기본 SVN repository"
          ],
          [
            "/opt/polarion/data/postgres-data",
            "기본 PostgreSQL 데이터"
          ],
          [
            "/opt/polarion/data/workspace/polarion-data",
            "Index 및 작업 데이터"
          ],
          [
            "/opt/polarion/data/workspace/polarion-data.saved",
            "재색인 이전 폴더"
          ],
          [
            "/opt/polarion/data/logs/main",
            "Polarion 로그"
          ],
          [
            "/opt/polarion/data/bir/projects",
            "빌드"
          ],
          [
            "/opt/polarion/data/rr",
            "보고서"
          ],
          [
            "/opt/polarion/data/synchronizer",
            "Connector 관계 데이터"
          ],
          [
            "/opt/polarion/shared",
            "Cluster 공유 경로 예시"
          ],
          [
            "/etc/httpd/conf.d/polarionSVN.conf",
            "RHEL SVN Apache 설정"
          ],
          [
            "/etc/apache2/conf-available/polarionSVN.conf",
            "Debian/Ubuntu 설정"
          ]
        ]
      }
    ],
    "sections": [
      [
        "원본과 재생성 가능 데이터",
        "SVN·외부 첨부·인증 DB·설정과 검색 인덱스를 구분한다. 재색인용 .saved 디렉터리 및 cache를 원본 데이터와 혼동하지 않는다. 설치 옵션 및 symlink로 경로가 다를 수 있어 삭제 전 실제 mount·경로·복구 필요성을 반드시 확인한다."
      ]
    ],
    "code": "ls -ld /opt/polarion /opt/polarion/data\nfindmnt -T /opt/polarion/data\ndf -h /opt/polarion/data"
  },
  "ehcache": {
    "ref": "Deployment and Maintenance Guide 6-14~6-28; Config Properties Reference; 6-24~6-28 (statistics)",
    "sections": [
      [
        "기본 구성과 재정의",
        "platform.jar 내부 META-INF/ehcache.xml의 기본 설정을 기반으로 사용자 파일을 polarion/configuration/ehcache.xml에 만든다. 원본 service 요소를 제거한 뒤 cache-template/cache 요소만 재정의한다. startup에서 XSD 검증을 통과해야 기본값과 병합된다. 실패 시 기본 설정으로 돌아가므로 로그를 반드시 확인한다."
      ],
      [
        "통계 읽기",
        "HITS는 cache hit, MISSES는 조회 실패, HIT_RATIO는 비율, GETS/PUTS는 조회/삽입 횟수, EVICTION은 용량 등의 이유로 제거된 항목 수다. 누적 miss만 많다고 부족하다고 판단하지 않는다. eviction 및 작업량 대비 변화와 평균 GET/PUT 시간, 디스크 tier 속도를 함께 확인한다."
      ],
      [
        "중·대형 권고",
        "중형(100~300 프로젝트, 등록 사용자 5k~20k)의 ss-context/combined는 40k heap/1 GB disk, user-restricted/assigned는 40k heap, dao-workitem 50k/4 GB, dao-module 3k~5k/4 GB. 대형(300~500+ 프로젝트, 20k~50k+ 사용자)은 ss-context/combined 80k/2 GB, user-restricted/assigned 80k, dao-workitem 50k~100k/6 GB, dao-module 6k~10k/6 GB. 보안 cache heap은 security.cacheSize 이상이어야 한다."
      ],
      [
        "제약",
        "user-restricted-projects, user-assigned-projects, wiki-page, wiki-page-exists는 heap-only를 유지한다. cache 파일 삭제 후 재기동 시 재생성되지만 warm-up 동안 성능에 영향이 있다. 설정 파일 변경 후 Polarion 재시작이 필요하다."
      ],
      [
        "통계 비교 예시 (가상 데이터)",
        "예를 들어 A 구간에서 GETS 100,000, MISSES 6,000, EVICTION 20,000이고 B 구간에서 GETS 100,000, MISSES 6,000, EVICTION 200이면 hit ratio는 둘 다 94%이지만 eviction 상황은 다르다. 실제 통계에서 GETS 증가량 대비 miss·eviction 증가량을 비교하고 재시작으로 counter가 초기화됐는지 확인한다. 이 숫자는 실제 장애 데이터가 아닌 설명 예시다."
      ],
      [
        "캐시 설정 확인 순서",
        "기본 XML의 alias별 목적·heap entry·disk size와 custom override를 비교하고, 실제 startup의 validation 결과를 확인한다. 보안 캐시 연관 값은 같은 규모로 맞추고 heap-only 캐시에 disk tier를 추가하지 않는다. 캐시가 작다는 판단은 eviction, I/O 대기, 응답 시간, Heap 여유를 종합해서 한다."
      ]
    ],
    "tables": [
      {
        "title": "2606 기본 캐시 용량 (Deployment Guide 6-18~6-19)",
        "head": [
          "Alias",
          "Heap entries",
          "Disk"
        ],
        "rows": [
          [
            "dao-global",
            "20000",
            "1 GB"
          ],
          [
            "dao-workitem",
            "50000",
            "2 GB"
          ],
          [
            "dao-module",
            "1000",
            "2 GB"
          ],
          [
            "dao-user",
            "30000",
            "2 GB"
          ],
          [
            "dao-attachment",
            "25000",
            "500 MB"
          ],
          [
            "dao-comment",
            "25000",
            "500 MB"
          ],
          [
            "dao-project",
            "25000",
            "250 MB"
          ],
          [
            "dao-projectgroup",
            "25000",
            "250 MB"
          ],
          [
            "dao-plan",
            "5000",
            "500 MB"
          ],
          [
            "dao-testrun",
            "100",
            "4 GB"
          ],
          [
            "dao-richpage",
            "5000",
            "1 GB"
          ],
          [
            "dao-wikipage",
            "5000",
            "1 GB"
          ],
          [
            "dao-moduleattachment",
            "25000",
            "500 MB"
          ],
          [
            "dao-modulecomment",
            "25000",
            "500 MB"
          ],
          [
            "dao-testrunattachment",
            "25000",
            "500 MB"
          ],
          [
            "dao-richpageattachment",
            "25000",
            "500 MB"
          ],
          [
            "dao-wikipageattachment",
            "25000",
            "500 MB"
          ],
          [
            "ss-context / ss-combined",
            "30000 (가이드 표기)",
            "500 MB"
          ],
          [
            "user-restricted-projects / user-assigned-projects",
            "30000",
            "heap only"
          ],
          [
            "bq",
            "500",
            "1 GB"
          ],
          [
            "historical-queries",
            "200",
            "1 GB"
          ]
        ]
      }
    ],
    "code": "# 12시간 간격 통계 출력\ncom.polarion.platform.cacheStats.intervalMs=43200000\n# main 로그에서 확인\ngrep -n 'polarion.info.cache.statistics' /path/to/main.log",
    "verify": "문서 간 security.cacheSize 20k/30k 차이를 유효 설정으로 확인한다. 기존과 동일 작업량에서 eviction 및 응답시간, GC를 비교한다."
  },
  "location": {
    "ref": "Polarion 2606 Config Properties Reference; Deployment and Maintenance Guide 8-86~8-89; Administrator and User Help 4-1163~4-1164",
    "sections": [
      [
        "Object Maps",
        "com.siemens.polarion.persistence.objectMaps.inMemory 기본 false. false는 disk 방식, true는 추가 JVM 메모리를 사용한다. 특히 문서 간 Work Item 이동 등 일부 동작을 빠르게 할 수 있지만 비정상 종료 시 disk 방식보다 복구 안정성이 낮다고 문서에 기술된다."
      ],
      [
        "Location Index",
        "com.siemens.polarion.platform.locationIndex.enabled 기본 false. 새 Location Index는 기존 Object Maps를 대신하며 inMemory 설정보다 우선한다. 2512+에서 활성화 시 전체 Reindex가 필요하고 Object Maps 방식과 backup package 호환이 되지 않는다. 역사 데이터 구현 차이로 일부 API 동작도 달라질 수 있다."
      ],
      [
        "적용 판단",
        "동일한 데이터와 버전의 검증 환경에서 start/reindex 시간, 메모리, 변경 작업 속도와 검색 정확도를 비교한다. true가 항상 모든 작업을 빠르게 한다고 가정하지 않는다."
      ],
      [
        "Object Maps 형식 변경",
        "Administrator and User Help 4-1163~4-1164에 따르면 inMemory 전환 시 전체 Reindex 또는 index backup → property 변경 → restore → 정상 기동으로 새 형식을 적용할 수 있다. 메모리 요구량은 object-maps 폴더 크기의 약 3배로 안내되나 실제 사용량은 달라진다. Location Index의 백업은 Object Maps 방식과 호환되지 않는다는 제한을 별도로 적용한다."
      ]
    ],
    "code": "com.siemens.polarion.platform.locationIndex.enabled=false\ncom.siemens.polarion.persistence.objectMaps.inMemory=false",
    "verify": "기존/신규 방식의 백업 호환 여부와 재색인 요구를 확인한다."
  },
  "authdb": {
    "ref": "Deployment and Maintenance Guide 8-9~8-17, 8-142~8-144",
    "sections": [
      [
        "변경 배경",
        "2512부터 passwd 및 passwd_credentials의 비밀번호 관리는 PostgreSQL로 이전되었다. polarion_system의 polarion_internal.svnauthn/userauthn이 해당 인증 구성을 담당한다. mod_authn_dbd와 mod_dbd를 사용하는 Apache 구성을 검토한다."
      ],
      [
        "Apache 설정 변경",
        "기존 AuthUserFile 기반 설정을 DB 인증으로 전환하는 구성이 적용되었는지 확인한다. 시스템 DB 호스트/포트, 서비스 계정 환경변수, DBDriver pgsql 및 연결 pool을 검토한다. 인증 SQL 및 비밀값은 운영 설정에서만 유지한다. LDAP를 함께 쓸 때 기존 file ldap provider가 dbd ldap로 전환되었는지 확인한다."
      ],
      [
        "장애와 백업",
        "PostgreSQL 재시작 뒤 Apache 연결 pool이 stale해질 수 있으므로 Apache 재시작이 필요하다고 문서는 안내한다. DB와 인증 테이블을 백업 범위에 포함한다. 비밀번호 해시·토큰을 공개하거나 일반 진단 자료에 덤프하지 않는다."
      ]
    ],
    "tables": [
      {
        "title": "Apache DBD 예시 기본값",
        "head": [
          "항목",
          "값",
          "역할"
        ],
        "rows": [
          [
            "DBDMin",
            "4",
            "최소 연결"
          ],
          [
            "DBDKeep",
            "8",
            "유지 연결"
          ],
          [
            "DBDMax",
            "20",
            "최대 연결"
          ],
          [
            "DBDExptime",
            "30초",
            "초과 idle 연결 만료"
          ]
        ]
      }
    ],
    "code": "httpd -M | grep -E 'dbd|authn_dbd'\n# 인증 설정 유무만 확인 (자격 증명 포함 행은 출력하지 않음)\ngrep -nE '^\\s*DBD(Min|Keep|Max|Exptime)' /etc/httpd/conf.d/polarionSVN.conf",
    "verify": "테스트 사용자 로그인 및 SVN 접근, 패스워드 변경과 기존 계정 연결을 검증한다."
  },
  "access": {
    "ref": "Administrator and User Help 4-123~4-124; Deployment and Maintenance Guide 8-18~8-19; Config Properties Reference",
    "sections": [
      [
        "저장 위치",
        "2506에서 이미 이전한 구성이라면 Apache의 AuthzSVNAccessFile은 ^/.polarion/access를 사용한다. 이전 버전의 외부 access 파일 구성과 혼용하지 않는다. 경로별 규칙과 group membership을 구분한다."
      ],
      [
        "Sync 동작",
        "Roles 화면 Synchronize SVN Access File은 role 정의 및 assignment를 access의 group과 맞춘다. directory 규칙은 수정하지 않는다. 사용자에게 역할을 할당했는데 저장소 접근이 기대와 다르거나 수동 구성 변경이 있었을 때 사용한다."
      ],
      [
        "빈 Role 설정",
        "com.polarion.platform.repository.canHaveEmptyRolesInSvnAccessFile 기본 true. false는 Administration에서 Role 생성/편집 시 한 명 이상을 요구하며 필요하면 현재 사용자를 추가하고 새 프로젝트의 비어 있는 초기 Role에도 현재 사용자를 지정한다. 이 설정이 이미 존재하는 빈 그룹을 일괄 정리하거나 sync 시 자동으로 더미를 삽입한다고 문서는 보장하지 않는다."
      ],
      [
        "장애 진단",
        "빈 그룹 존재, access 변경 revision, 실제 SVN 버전, Apache error, 요청 지연을 비교한다. 권한 파일을 일괄 삭제하거나 우회하지 않는다."
      ]
    ],
    "code": "# 실제 설정 파일 확인\n grep -n 'AuthzSVNAccessFile' /etc/httpd/conf.d/polarionSVN.conf\n# property의 존재 여부 확인\n grep -n '^com\\.polarion\\.platform\\.repository\\.canHaveEmptyRolesInSvnAccessFile=' /opt/polarion/etc/polarion.properties"
  },
  "updatecluster": {
    "ref": "Deployment and Maintenance Guide 8-25~8-53, 8-53~8-80",
    "sections": [
      [
        "적용 범위",
        "2304 이상에서 업그레이드하는 경우 8-25의 절차, 22 R2 또는 이전은 별도 절차를 적용한다. Application Node/Instance/Coordinator 전부를 업데이트한다. 저장소 업데이트는 한 번만 수행한다."
      ],
      [
        "사전 준비",
        "공유 폴더를 Coordinator/Node에 동일 경로로 마운트하고 com.polarion.shared 설정을 확인한다. 백업·복원 연습, 사용자 영향, 전체 패치 패키지, 인증과 확장 변경을 준비한다."
      ],
      [
        "2304 이상 3-Node 예시의 전환 순서",
        "① Node A를 LB에서 제외하고 서비스 중지, 백업 및 2512 인증 DB 사전 준비 후 업데이트한다. ② Shared Services의 해당 변경과 third-party/add-on을 적용하고 A를 시작하여 startup 로그를 확인한다. 이때 A는 사용자 서비스 준비 완료 상태가 아니다. ③ 다운타임 공지 후 A/B/C의 Polarion을 모두 중지하고 Coordinator를 중지한다. ④ Coordinator 업데이트 및 reindex, 라이선스 확인. ⑤ Shared Services의 SVN authz/DBD 및 보안 헤더 변경 검증. ⑥ Node A를 시작하고 색인 완료 후 사용자 접속을 검증한다. LB에 자동 복귀하지 않으면 관리 화면에서 상태를 확인한다. ⑦ Node B/C 업데이트 및 시작, 필요하면 A의 index backup으로 복구한다."
      ],
      [
        "검증",
        "노드별 기동 상태와 Coordinator 버전 일치, SVN 리비전, 라이선스, 공유 경로, LB 요청 분배와 사용자 작업을 확인한다."
      ],
      [
        "운영 변경 경계",
        "위 순서는 Deployment Guide 8-27~8-52의 흐름을 요약한 것이다. 실제 2512 이전 인증 전환 과정에는 임시 update 구성 및 DB 준비가 포함되며 해당 기존 구성에서만 적용된다. 운영 환경의 직접 실행용 전체 명령은 아니며 검증 환경에서 대상 패키지와 설정별 분기 절차를 확정한다. Shared Services의 Diagtool도 A의 버전으로 맞춘다."
      ]
    ],
    "verify": "구성별 상세 단계가 동일하지 않으므로 검증 환경에서 정확한 전환 순서를 확정한다. 이번 페이지는 전환 통제 기준이다."
  },
  "headers": {
    "ref": "Deployment and Maintenance Guide 4-42~4-100, 8-19~8-21",
    "sections": [
      [
        "보안 헤더 관리 변경",
        "2606 업데이트 절차는 Polarion 관련 Apache security header 설정을 polarion.properties의 Tomcat header 설정으로 이전하는 작업을 안내한다. 기존 Apache 설정과 이중 적용되지 않는지 확인한다. 사이트 공통 Apache 보안 정책이나 다른 서비스는 무조건 제거하지 않는다."
      ],
      [
        "변경 대상",
        "vary, strictTransportSecurity, contentSecurityPolicy, xXssProtection, referrerPolicy, xContentTypeOptions, cacheControl 등의 com.siemens.polarion.tomcat.header.* 키를 검토한다. CSP 값은 Linked Data 등의 외부 연동에 따라 달라질 수 있다."
      ],
      [
        "Secrets Manager",
        "2606은 기존 property 비밀값을 별도 관리하도록 Secrets Manager를 제공한다. 백업과 복구 시 암호화 자료 및 접근 정책을 함께 고려하며, Cluster에서는 공유 폴더 조건을 충족해야 한다. secret 값을 공용 문서나 GitHub에 기록하지 않는다."
      ]
    ],
    "verify": "업데이트 전후 브라우저 응답 헤더와 로그인, iframe/연동 기능, HTTPS 통신을 검증한다."
  },
  "preview": {
    "ref": "Deployment and Maintenance Guide 5-53~5-69; Administrator and User Help 4-391; Config Properties Reference",
    "sections": [
      [
        "OLE 및 미리보기",
        "Windows용 preview generator와 Linux에서 원격 Windows 변환을 사용하는 OLE 환경은 설치·SMB·OpenSSH·변환 스크립트 및 Polarion 설정을 함께 검토해야 한다. 이미지가 표시되지 않으면 원본 첨부 접근·preview 생성 결과·브라우저 로딩 상태를 구분한다."
      ],
      [
        "Word OLE Import의 범위",
        "Word 문서의 OLE 객체 자체를 가져오는 것은 아니며 문서에 포함된 WMF/EMF thumbnail을 JPEG로 변환해 표시한다. Windows 가이드는 ImageMagick을 권장하며 관련 설정 prefix는 com.polarion.oleconverter이다. Linux 환경에서 원격 변환 구성인 경우 converter와 네트워크, 공유 경로, 서비스 계정의 상태를 점검한다."
      ],
      [
        "WMF/EMF",
        "com.siemens.polarion.previewgenerator.wmfemf.enabled 기본 true는 내장 pseudo preview generator 사용 여부이다. 외부 generator가 해당 형식을 실제 지원할 때 내장 기능 비활성화를 검토할 수 있다."
      ],
      [
        "수식",
        "Node.js는 MathJax 수식을 SVG로 변환하며 autoStart 기본 true이다. false로 변경하면 관리자가 프로세스를 직접 관리해야 하며 변환 서비스가 없을 경우 화면 및 export에 수식 대신 경고 표시가 나타날 수 있다."
      ]
    ],
    "verify": "동일 첨부의 다운로드·화면 표시·PDF/Word export를 확인한다."
  },
  "live-loading": {
    "ref": "Administrator and User Help 3-469~3-471, 8-66",
    "sections": [
      [
        "화면 설정",
        "Document Properties 사이드바의 On-demand Work Item Loading에서 ON/OFF를 확인한다. ON이면 화면에 스크롤되어 들어온 Work Item 데이터를 로딩하므로 브라우저 native Find만으로 전체 문서를 검색할 수 없다."
      ],
      [
        "검색 및 검증",
        "ON일 때 문서에 포커스를 두고 Polarion Find 또는 Ctrl+F를 이용한다. OFF일 때 Ctrl+F는 브라우저 native Find를 실행한다. 일부 문서에서 미리보기가 누락되면 문서 로딩 상태, 첨부 원본, preview 결과를 비교하고 설정을 바꾼 검증 결과를 기록한다."
      ],
      [
        "주의",
        "대형 문서의 OFF는 전체 로딩 비용이 증가할 수 있다. 모든 프로젝트에 일괄 적용하지 않는다."
      ]
    ],
    "verify": "해당 문서의 검색 결과, 로딩 시간 및 미리보기 표시를 같은 조건에서 비교한다."
  },
  "permissions": {
    "ref": "Administrator and User Help 3-531~3-532, 4-145~4-189",
    "sections": [
      [
        "문서 권한",
        "Document READ는 문서 내용 및 속성 조회, MODIFY FIELDS는 상태·custom field 등 속성 변경, MODIFY CONTENT는 문서 본문 및 구조 변경에 해당한다. CREATE NEW는 MANAGE/MODIFY FIELDS/MODIFY CONTENT도 필요하다. MANAGE 또는 MODIFY CONTENT만으로 MODIFY FIELDS가 자동 부여되지 않는다."
      ],
      [
        "구분 방법",
        "읽기·편집·문서 내 Work Item 이동·첨부·필드 수정·댓글 등 실패하는 작업 단위를 나눈다. Space 권한과 Work Item 권한이 문서 권한과 함께 관련될 수 있으므로 실제 Role과 Permission scope를 확인한다."
      ]
    ],
    "verify": "최소 권한 계정에서 각각 읽기, 편집, 상태 변경, 첨부 및 문서 생성 여부를 검증한다."
  },
  "templates": {
    "ref": "Administrator and User Help 4-68~4-70, 4-43",
    "sections": [
      [
        "관리 위치",
        "Global Administration > Project Templates에서 템플릿을 조회하고 기존 템플릿 복제, 다운로드, 사용자 템플릿 업로드 및 갱신을 수행한다. 시스템 제공 템플릿은 repository /.polarion/projects/templates/에 저장된다."
      ],
      [
        "운영 절차",
        "사용 중인 타입, workflow, enumeration, custom fields 및 문서/공간 구조를 확인하고 검증 프로젝트를 생성한다. 기존 프로젝트 설정이 템플릿 갱신만으로 자동 업데이트된다고 가정하지 않는다. 템플릿 내 Work Item ID 충돌에도 주의한다."
      ]
    ],
    "verify": "새 프로젝트 생성 후 역할, 상태 전이, 기본 문서 및 링크 규칙을 테스트한다."
  },
  "baseline": {
    "ref": "Administrator and User Help 3-352~3-358, 3-393, 3-865~3-912, 3-1323, 4-392~4-441",
    "sections": [
      [
        "Baseline",
        "프로젝트 baseline과 document baseline은 대상 범위가 다르다. 기준 리비전과 사용자 권한을 기록하고 비교 화면과 이력 접근을 확인한다. Historical DB 색인이 진행 중일 때 일부 baseline 기능이 제한될 수 있다."
      ],
      [
        "Collection",
        "Collection은 여러 Document 및 관련 산출물을 묶어 관리하는 기능이다. Administration의 Collection 설정에서 Navigation 표시, 권한, custom fields 등을 관리한다. Collection baseline과 문서 baseline을 혼동하지 않는다."
      ],
      [
        "시험",
        "Test Case와 Test Run을 구분하고 테스트 결과, workflow, signature 및 오래된 Test Run 정리 설정을 검토한다. 작업의 저장/검색/이력과 연결된 요구사항 추적성까지 확인한다."
      ]
    ],
    "verify": "시험 결과와 기준선이 의도한 리비전 및 요구사항과 연결되는지 검증한다."
  },
  "scheduler": {
    "ref": "Administrator and User Help 4-1065, 8-9; Deployment and Maintenance Guide 8-88, 8-136~8-138",
    "sections": [
      [
        "화면",
        "Global Administration > Scheduler에서 scheduled jobs 설정을 관리하고 Monitor의 Scheduled Jobs에서 대상 작업을 선택하여 Execute now를 사용할 수 있다. Job 실행 상태와 로그를 확인한다."
      ],
      [
        "색인 Job",
        "AttachmentIndexer와 DBHistoryCreator는 startup phase 10/11에 대응한다. 문서는 기본 작업 시간대를 19:00~08:00으로 안내하며 예약 작업으로 중지·재개할 수 있다. 실제 설치의 스케줄이 수정되었는지 확인한다."
      ],
      [
        "운영 규칙",
        "장시간 Job이 실행되면 Node, 시작 시간, 진행 로그 및 서버 지표를 비교한다. 중복 실행이나 강제 중단 전에 작업의 특성과 영향 범위를 확인한다."
      ]
    ],
    "verify": "예정 시간, 실제 실행 시간, 완료 상태, 누적 실패를 기록한다."
  },
  "diag": {
    "ref": "Deployment and Maintenance Guide 4-103~4-109, 7-1~7-26, 10-1; 자체 진단 예시",
    "sections": [
      [
        "SVN CPU 100%",
        "호스트 전체 CPU, PID별 CPU, SVN 요청량/지연, access 수정 시점과 error를 동일 시간축으로 비교한다. CPU가 높은 시점의 요청 유형과 정상 구간 대비 차이가 핵심이다. access 변경이 겹친다는 것만으로 원인이라고 확정하지 않는다."
      ],
      [
        "HTTPD 메모리",
        "전체 메모리와 PID별 RSS, shared memory 중복 합산, child 재생성 여부 및 BusyWorkers 추세를 확인한다. MaxConnectionsPerChild 변경은 연결 수 기준 교체 정책일 뿐 메모리 누수의 직접 증명은 아니다."
      ],
      [
        "REST 및 화면 오류",
        "401은 인증, 403은 권한 문제의 가능성이 있으나 응답 주체를 확인한다. REST API가 비활성화된 경우 2606 property 문서상 503이다. 프록시/앱/SVN/DB 로그와 요청 correlation을 확인한다."
      ],
      [
        "복구 기준",
        "장애 시간, 영향 범위, 재현, 로그, 최근 변경, 조치, 사후 검증을 기록한다. 데이터 삭제나 강제 restart부터 수행하지 않는다."
      ]
    ],
    "code": "date -Is\nuptime\nfree -h\nvmstat 1 5\nps -eo pid,ppid,comm,%cpu,rss,nlwp --sort=-%cpu | head -25\n# sysstat 설치 시\niostat -xz 1 5\n# Apache 오류의 시각 및 상태를 실제 LogFormat 기준으로 확인\ngrep -iE 'timeout|error|AH[0-9]+|authz' /path/to/error_log | tail -80",
    "verify": "조치 전후 동일 부하 조건에서 CPU, 응답 시간, 오류율을 비교한다."
  },
  "license": {
    "ref": "Deployment and Maintenance Guide 3-7~3-12, 7-28~7-35; Config Properties Reference",
    "sections": [
      [
        "라이선스 제공 방식",
        "2606의 기본은 SALT이며 기존 Polarion proprietary 방식은 별도로 사용 가능하지만 제거 예정으로 분류된다. 기존 방식은 com.siemens.polarion.license.salt.enabled=false가 필요하다. Cluster에서 두 방식 사이를 전환할 때 Coordinator reindex가 필요하다. 같은 방식에서 단순 갱신하는 작업과 구분한다."
      ],
      [
        "Named 및 Concurrent",
        "Named 사용자는 할당한 라이선스를 사용한다. Concurrent 사용자는 할당받은 종류의 사용 가능한 슬롯이 없으면 로그인하지 못한다. 미할당자는 기본 Concurrent 라이선스를 사용한다. 명시 기본값이 없을 경우 슬롯 수가 가장 많은 종류를 선택하며 동수이면 낮은 등급을 선택한다. 기본 할당 변경은 20분마다 한 번만 가능하다."
      ],
      [
        "관리 화면과 재활성화",
        "Repository 범위 Administration > License에서 License Assignment and Usage를 연다. Default Licenses 및 Group Licenses를 설정하고 Save한다. 개인 할당은 User Management > Users에서 관리한다. 기존 라이선스의 Reactivate Polarion에서는 온라인/오프라인 절차를 진행하며 온라인 활성화 전 동일 키로 실행 중인 인스턴스가 없는지 확인한다."
      ],
      [
        "SALT 연결 및 진단",
        "SALT 서버 주소는 com.siemens.polarion.license.salt.server (문서 형식 port@hostName, 기본 포트 29000)로 검토한다. 기존 방식은 설치의 license/users 및 license 파일 경로를 보존한다. 현재 사용량은 License Usage를 새로고침하여 확인하며 licensing 로그는 Concurrent 로그인·로그오프 시 통계를 남긴다."
      ]
    ],
    "tables": [
      {
        "title": "라이선스 장애 구분",
        "head": [
          "증상",
          "확인",
          "조치 판단"
        ],
        "rows": [
          [
            "전체 로그인 실패",
            "라이선스 서버 연결·만료·활성화 로그",
            "인증 장애와 구분"
          ],
          [
            "특정 사용자 로그인 불가",
            "할당 라이선스, 사용 중인 슬롯, 그룹",
            "부족 여부 확인"
          ],
          [
            "갱신 키 반영 실패",
            "현재 활성 키 유형, 적용 위치, Coordinator",
            "로그 확인 후 Reactivate 절차"
          ],
          [
            "SALT 전환",
            "공유 설정 및 Coordinator",
            "전환 시 reindex 계획"
          ]
        ]
      }
    ],
    "code": "# SALT를 사용하지 않는 승인된 기존 라이선스 구성\ncom.siemens.polarion.license.salt.enabled=false\n# SALT 사용 구성의 서버 주소 형식 예시\n# com.siemens.polarion.license.salt.server=29000@LICENSE_HOST\nls -lt /opt/polarion/data/logs/main/log4j-licensing-*.log",
    "verify": "실제 라이선스 방식·만료일·할당량과 대표 Named/Concurrent 사용자의 로그인 결과를 기록한다. 키와 사용자 정보는 공개하지 않는다."
  },
  "auth": {
    "ref": "Administrator and User Help 6-1~6-93, 6-118~6-155; Deployment and Maintenance Guide 3-12, 4-70~4-78",
    "sections": [
      [
        "인증 아키텍처",
        "Polarion은 로컬 비밀번호, LDAP, OAuth 2, SAML, Teamcenter Security Services를 지원하며 다중 제공자 구성이 가능하다. LDAP/SSO의 사용자 인증과 Polarion 내부 Role·그룹 및 라이선스는 각각 확인한다. 로컬 비밀번호 저장 방식은 2512 이후 DB 전환 문서와 함께 해석한다."
      ],
      [
        "설정 위치와 반영",
        "Global Administration > User Management > Authentication의 XML 편집기를 사용한다. UI에서 저장하면 즉시 반영되며 일반적으로 재시작이 필요하지 않다. 파일 직접 수정은 기본적으로 재시작이 필요하고 UI와 동기화되지 않을 수 있다. Standalone 기본 디렉터리는 /opt/polarion/data/authentication, Cluster는 Coordinator의 data/workspace/cluster-data 아래이다."
      ],
      [
        "사용자·그룹 동기화",
        "인증 공급자의 로그인 성공과 Polarion 사용자 생성/그룹/Role 매핑을 구분한다. 사용자 ID 매핑, 소속 그룹·역할 및 라이선스 할당 정책을 확인한다. LDAP sync와 SSO group/role sync는 별도 동작이며 동기화 대상과 제외 정책을 사전에 테스트한다."
      ],
      [
        "인증 장애",
        "리디렉션 및 IdP 오류, 토큰 만료·시스템 시간, 인증서 만료, 사용자 매핑, 라이선스, 프로젝트 권한 순으로 확인한다. 기존 관리자 세션 및 승인된 복구 수단을 확보하고 XML 백업을 유지한다. 인증 설정 오류로 기동이 중단되면 로그와 XML 구문을 확인한다."
      ]
    ],
    "tables": [
      {
        "title": "인증 설정 및 검증 기준",
        "head": [
          "방식",
          "핵심 구성",
          "검증"
        ],
        "rows": [
          [
            "LDAP",
            "서버·검색 기준·사용자 매핑",
            "로그인, 그룹 동기화, 제한된 계정"
          ],
          [
            "SAML",
            "IdP/SP metadata·인증서·사용자 매핑",
            "리디렉션, assertion, 만료"
          ],
          [
            "OAuth 2",
            "provider·client 설정·redirect URI",
            "토큰, 사용자 ID 매핑"
          ],
          [
            "TcSS",
            "Teamcenter 인증 서비스 연동",
            "SSO 및 세션 처리"
          ],
          [
            "로컬",
            "2512+ DB 인증 구성",
            "로그인/비밀번호 변경/SVN 연동"
          ]
        ]
      }
    ],
    "code": "# Standalone: authentication.xml의 전체 경로 지정 예시\n# com.siemens.polarion.security.auth.file=/secure/config/authentication.xml\n# Cluster Coordinator: 사용자 지정 폴더 (내부 구조는 제품 관리)\n# com.siemens.polarion.security.auth.cluster.folder=/secure/auth\n# 인증서 만료 확인 예시\nopenssl x509 -in /path/to/cert.pem -noout -dates",
    "verify": "관리자 및 일반 사용자의 로그인, 로그아웃, 잘못된 자격 증명 거부, 프로젝트 접근, 사용자/그룹 동기화를 검증한다. IdP 비밀값을 출력하거나 인증을 우회하지 않는다."
  },
  "workitem": {
    "ref": "Administrator and User Help 3-48~3-302, 3-193~3-194, 3-384~3-393, 3-531~3-532",
    "sections": [
      [
        "Work Item의 구조",
        "Work Item은 요구사항, 결함, 작업, 테스트 케이스 등 업무 데이터의 개별 객체다. 유형에 따라 필드·workflow·링크가 다르며 프로젝트 ID와 항목 ID를 조합해 식별한다. 표/트리/문서에서 같은 항목을 조회할 수 있으므로 표시 화면과 실제 객체를 구분한다."
      ],
      [
        "LiveDoc과 Space",
        "Space는 Document와 Page를 구성하는 영역이다. LiveDoc은 본문과 Work Item을 결합한다. 항목 이동, 참조, 원본 문서의 관계를 구분하고 문서 속성 수정과 본문 변경에 별도 권한이 필요할 수 있다."
      ],
      [
        "추적성과 링크",
        "Direct link는 연결을 생성한 항목에 저장되며 반대 방향에서 보이는 backlink는 derived link이다. Smart Link는 다른 객체로 이동하는 링크 표현이며 Work Item Link Role의 관계와 동일하지 않다. 관계 규칙과 반대 방향 표시를 검증한다."
      ],
      [
        "Page와 보고서",
        "보고서나 Page가 느릴 때 단일 조회인지, 위젯 여러 개·복잡 SQL·Velocity 처리인지 TXLOGGER에서 구분한다. 보고서 변경은 데이터 범위, 권한, 필터와 계산 시간까지 검증한다."
      ]
    ],
    "tables": [
      {
        "title": "화면별 주요 확인",
        "head": [
          "문제",
          "우선 확인",
          "관련 문서"
        ],
        "rows": [
          [
            "Work Item 검색 누락",
            "ID/프로젝트/쿼리/권한/Index",
            "Index 및 Reindex"
          ],
          [
            "문서 내용 누락",
            "On-demand loading, 문서 revision, 참조 항목",
            "LiveDoc 로딩"
          ],
          [
            "저장 불가",
            "Workflow 조건, 필수값, 객체 권한",
            "Workflow/Permissions"
          ],
          [
            "보고서 지연",
            "TXLOGGER, SQL, 위젯 범위",
            "TXLOGGER/성능"
          ],
          [
            "역사 데이터 미표시",
            "History Indexing 상태",
            "Reindex"
          ]
        ]
      }
    ],
    "verify": "항목 생성·저장·링크·검색·문서 표시·이력 조회를 서로 다른 권한의 테스트 계정으로 확인한다."
  },
  "api": {
    "ref": "REST API User Guide for Polarion 1-2~1-18, 2-1~2-23, 3-1~3-17; Config Properties Reference",
    "sections": [
      [
        "활성화와 권한",
        "REST endpoint는 기본 비활성이다. com.siemens.polarion.rest.enabled=true로 설정하고 기동한다. Swagger UI는 별도 swaggerUi.enabled=true가 필요하다. 인증(PAT, JWT, TCSSO 및 활성 Polarion session 방식), endpoint 권한, item-level 권한을 구분한다. 호출별 인증이 기본이다."
      ],
      [
        "GET과 응답 크기",
        "fields[workitems]=title,status처럼 필요한 필드만 지정한다. @all을 대량 응답에 사용하면 서버/네트워크/클라이언트 부담이 증가한다. page[size]와 page[number], 결과의 links.next를 이용해 순차 조회한다. 실제 상한은 property의 maxPageSize를 따른다."
      ],
      [
        "요청 형식과 수정",
        "JSON body에는 Content-Type: application/json을 사용한다. 첨부 API는 multipart/form-data 및 파일 content 조회에 application/octet-stream을 사용하는 경우가 있다. PATCH 이후 body가 비어 있을 수 있으므로 상태 코드와 실제 저장 결과를 확인한다. 재시도 전에 중복 생성 여부를 검사한다."
      ],
      [
        "장애 분류",
        "401은 PAT 누락·무효 등 인증, 403은 endpoint 또는 객체 권한, 406은 Accept, 415는 Content-Type, 503은 REST 비활성 또는 서비스 불가 여부를 먼저 확인한다. Apache 등 다른 응답 주체의 오류는 body와 로그로 분리한다."
      ],
      [
        "API 사용량 및 운영 경계",
        "응답 링크에 next가 있으면 실제 다음 페이지 URL을 따라가고 없으면 종료한다. 제한을 넘긴 요청을 반복하지 않는다. 필요한 field만 선택하고 @all을 대량 사용하지 않는다. 자동 연동은 호출 횟수·응답코드·처리량·실패 재시도 및 인증 만료를 별도로 모니터링한다. 읽기 예제는 실제 운영 서비스에 대량 부하를 주는 방식으로 실행하지 않는다."
      ]
    ],
    "tables": [
      {
        "title": "REST 응답 판단표",
        "head": [
          "HTTP",
          "우선 점검"
        ],
        "rows": [
          [
            "200",
            "GET 등 성공"
          ],
          [
            "201",
            "생성 결과/ID 확인"
          ],
          [
            "204",
            "응답 body 없이 성공한 경우"
          ],
          [
            "401",
            "토큰·인증"
          ],
          [
            "403",
            "endpoint·item 권한"
          ],
          [
            "406 / 415",
            "Accept / Content-Type"
          ],
          [
            "503",
            "REST enabled, Polarion 서비스 및 프록시"
          ]
        ]
      }
    ],
    "code": "# 토큰을 shell history에 직접 남기지 않는 읽기 예시\nread -rs -p 'PAT: ' PAT; echo\nBASE='https://YOUR-SERVER/polarion/rest/v1'\ncurl -sS -G -H \"Authorization: Bearer $PAT\" \\\n  -H 'Accept: application/json' \\\n  --data-urlencode 'fields[workitems]=title,status' \\\n  --data-urlencode 'page[size]=25' \\\n  \"$BASE/projects/PROJECT_ID/workitems\"\nunset PAT",
    "verify": "비운영 테스트 프로젝트에서 허용/거부 계정, 페이지 처리, 필드 제한, 조회 및 승인된 변경 시나리오를 검증한다. 토큰은 로그·Git에 저장하지 않는다."
  },
  "jobs": {
    "ref": "Administrator and User Help 4-1065~4-1067, 8-9; Deployment and Maintenance Guide 8-88, 8-136~8-138",
    "sections": [
      [
        "Monitor의 표시 조건",
        "Global MANAGE JOBS 권한이 없는 사용자는 자신이 실행한 진행 중/완료 Job만 볼 수 있다. 경고가 나타나는 경우 실제 모든 작업이 없다는 뜻은 아니다. global 관리자와 일반 사용자 화면을 비교한다."
      ],
      [
        "예약 작업 실행",
        "Navigation > Monitor의 Scheduled Jobs에서 해당 작업을 선택하고 Execute now로 실행할 수 있다. Scheduler는 Global Administration에서만 정의하며 XML 수정 후 Save하면 재시작 없이 반영된다."
      ],
      [
        "실패 및 오래 걸리는 작업",
        "Job name, 상태, 실행 서버, 실행 시작/종료, 로그를 기록한다. 이전 실행과 비교하여 현재 진행 중인지 대기인지 구분한다. 중복 실행 전 데이터 수정 범위·자원 영향·재시도 가능성을 확인한다."
      ],
      [
        "여러 작업 연결",
        "multi.job은 이름으로 다른 Job을 호출할 수 있으며 기본 순차 실행이다. parallel, terminateOnFailure, delegateFailure의 설정에 따라 실행 및 실패 처리 방식이 달라진다. 운영 작업은 검증 환경에서 실패 경로를 테스트한 뒤 사용한다."
      ]
    ],
    "verify": "예정된 작업이 의도한 서버와 시간에 실행되는지, 실패 작업이 후속 작업에 미친 영향을 확인한다."
  },
  "incident": {
    "ref": "Deployment and Maintenance Guide 4-103~4-109, 7-1~7-26, 10-1; 자체 장애 대응 절차",
    "sections": [
      [
        "접수 및 범위 분류",
        "장애 시작·종료(시간대 포함), 영향 사용자/프로젝트/노드, 실패 작업과 HTTP 상태, 재현 조건, 최근 변경을 기록한다. 전체 로그인 불가, 특정 프로젝트 불가, 저장만 느림, 조회만 느림을 분리한다."
      ],
      [
        "증거 보존",
        "서비스 재시작 또는 설정 원복 전에 가능한 범위에서 관련 로그, 프로세스 상태, CPU/RAM/I/O, SVN 리비전과 요청량을 확보한다. 운영 상황에서 thread dump/JFR/heap dump는 각 수집 부하 및 민감 데이터 포함 여부를 확인한다."
      ],
      [
        "대응 우선순위",
        "가용한 다른 노드에서 같은 요청 비교 → 공통 서비스 상태 확인 → 병목 계층 분리 → 승인된 완화 조치 → 서비스 검증 순서로 판단한다. CPU 사용률이 높다는 것만으로 원인 특정은 불가능하다."
      ],
      [
        "사후 분석",
        "시간축을 정렬하고 지연 요청 유형과 오류, CPU/DB/SVN/캐시 지표의 선후관계를 비교한다. 원인 확정, 재발 방지, 담당자, 검증 결과와 미확인 가설을 나누어 기록한다."
      ]
    ],
    "tables": [
      {
        "title": "장애 분류와 첫 진입 문서",
        "head": [
          "증상",
          "우선 확인",
          "관련 항목"
        ],
        "rows": [
          [
            "로그인 실패",
            "인증·라이선스·공통 DB",
            "인증 / License"
          ],
          [
            "HTTPD CPU·메모리",
            "PID, 요청량/지연, MPM",
            "Apache / SVN"
          ],
          [
            "검색 결과 누락",
            "권한, 리비전, index",
            "Reindex"
          ],
          [
            "첨부 오류",
            "파일 크기, HTTP 상태, 저장소",
            "Attachment"
          ],
          [
            "시작 멈춤",
            "startup 로그, 단계 및 DB",
            "기동 / Reindex"
          ],
          [
            "특정 Node 느림",
            "LB 및 Node별 로그/자원",
            "Cluster"
          ]
        ]
      }
    ],
    "verify": "완화 후 대표 사용자 시나리오와 정상 범위 복귀를 확인하고 재발 모니터링을 시작한다."
  },
  "release": {
    "ref": "Deployment and Maintenance Guide 8-1~8-25, 8-80; 2606 Config Properties Reference; 2606 공개 릴리스 안내",
    "sections": [
      [
        "릴리스·패치 식별",
        "설치된 major release와 실제 패치 수준을 구분한다. 2606 base release의 변경사항이 현재 패치에 대한 결함 해결 여부를 의미하지는 않는다. 대상 버전 패키지의 수정 목록과 실제 설치 상태를 기준으로 기록한다."
      ],
      [
        "2404 → 2606 검토 포인트",
        "2506 SVN access 위치 변경, 2512 인증 데이터 DB 전환, 2606 SALT 기본 활성화 여부·Secrets Manager·Tomcat 보안 헤더 및 Java 21 지원 조건을 개별 변경 항목으로 관리한다. Object Maps/Location Index는 명시적 기능 선택으로 별도 검증한다."
      ],
      [
        "확장 기능 검증",
        "플러그인, custom UI, 스크립트, connector, REST API, 외부 보고서 등을 인벤토리화한다. 제품 업그레이드에 따른 Java 및 Jakarta API 호환성과 권한, 보안 정책을 테스트 환경에서 검증한다."
      ],
      [
        "Resolved Issues 관리",
        "문제의 증상과 발생 조건·버전·오류 메시지를 기록한다. 동일한 결함 ID 및 수정 버전인지 검증한다. 확인되지 않은 결함 번호·Hotfix 이름은 등록하지 않는다."
      ]
    ],
    "verify": "승인된 대상 빌드, 패치 수정사항, 필수 구성 변경, 지원 종료 기능, 사후 테스트 증거가 변경 기록에 남아 있어야 한다."
  },
  "commands": {
    "ref": "Deployment and Maintenance Guide 3-5~3-6, 8-83~8-89; Linux 시스템 명령 (자체 운영 예시)",
    "sections": [
      [
        "읽기 전용 진단",
        "시간과 hostname부터 기록한다. CPU 부하, 가용 메모리, 파일시스템 사용률 및 inode, 프로세스별 CPU/RSS, 서비스 상태를 구분해 측정한다."
      ],
      [
        "서비스 운영",
        "systemctl status 및 journalctl로 현재 상태와 로그를 확인한다. 서비스 unit 이름은 설치 방식에 따라 다를 수 있다. Polarion의 기본 reindex 명령은 /opt/polarion/bin/polarion.init reindex이며 일반 restart와 구별한다."
      ],
      [
        "스크립트 작성 원칙",
        "모든 명령의 실행 서버 및 대상 경로를 기록한다. 검색은 *.conf 등 필요한 파일 범위로 제한한다. 전체 repo를 재귀적으로 조사하는 명령은 큰 저장소에 I/O 부담을 줄 수 있다. 비밀값 및 내부 정보가 담긴 로그는 승인된 저장 위치에만 보존한다."
      ]
    ],
    "tables": [
      {
        "title": "점검 명령어 표",
        "head": [
          "목적",
          "명령",
          "해석"
        ],
        "rows": [
          [
            "CPU",
            "uptime; vmstat 1 5",
            "load average/CPU wait와 runnable"
          ],
          [
            "Memory",
            "free -h",
            "available 중심"
          ],
          [
            "Disk",
            "df -h; df -i",
            "사용량 및 inode"
          ],
          [
            "프로세스",
            "ps -eo pid,comm,%cpu,rss --sort=-%cpu",
            "PID별 순간/누적 표시 차이 주의"
          ],
          [
            "서비스",
            "systemctl --failed",
            "실패 unit 확인"
          ],
          [
            "네트워크",
            "ss -lnt; ss -s",
            "listener와 socket 상태"
          ],
          [
            "Apache",
            "httpd -t; httpd -M",
            "구문 및 module"
          ],
          [
            "SVN",
            "svnlook youngest /path/to/repo",
            "최종 리비전"
          ]
        ]
      }
    ],
    "code": "hostname; date -Is; uptime\nfree -h; df -h; df -i\nvmstat 1 5\nps -eo pid,ppid,comm,%cpu,rss --sort=-%cpu | head -20\nsystemctl --failed\nss -s",
    "verify": "동일 호스트에서 정상 구간과 장애 구간의 데이터를 비교한다. 명령은 일반 Linux 점검 예시이며 제품별 실행 절차와 구분한다."
  },
  "integration": {
    "ref": "REST API User Guide 2606; Administrator and User Help 5-1~5-89; Deployment and Maintenance Guide 5-70~5-75, 8-18",
    "sections": [
      [
        "연동 인벤토리",
        "Teamcenter/외부 PLM, Connector, REST/SOAP, SDK 플러그인, 스크립트, Resource Traceability 및 ERA를 구분한다. 원본 시스템, 동기화 방향, 인증·권한, 객체 매핑, 재시도, 버전 및 운영 책임자를 기록한다."
      ],
      [
        "스크립트와 확장",
        "워크플로 Condition과 Function, scheduled script, Page 위젯을 구분한다. Script Monitor에서 실행·오류·시간을 조사하고 커스텀 플러그인은 설치 바이너리 업데이트와 분리해 백업한다."
      ],
      [
        "ERA / Kafka",
        "ERA 서비스를 사용하면 제품 업데이트 시 ERA 버전 호환 및 Kafka와 서비스 의존성도 확인한다. 실제 연동이 없는 환경에는 이 절차를 적용하지 않는다."
      ],
      [
        "연동 장애 및 데이터 일관성",
        "실패 요청 ID와 시각·응답을 확인하고 원본과 대상 객체를 비교한다. 네트워크·인증·권한·API 스키마·업무 조건 중 어디에서 실패했는지 구분한다. 중복 처리 또는 일부 데이터 반영에 유의한다."
      ]
    ],
    "verify": "검증 환경에서 정상/실패/재시도/중복 처리·권한 제한·장애 복구와 객체 링크 일관성을 검증한다."
  },
  "ports": {
    "ref": "Deployment and Maintenance Guide 2-113~2-115",
    "sections": [
      [
        "연결 범위",
        "포트 표는 기본 구성에서 필요한 서비스 간 연결을 뜻한다. 인터넷 또는 모든 호스트로 열어야 한다는 의미가 아니다. 내부 RPC, AJP, SVN, NFS는 필요한 호스트 간 연결만 허용하고 관리용 URL은 관리자 접근으로 제한한다."
      ],
      [
        "운영 환경 검증",
        "실제 Listener 및 방화벽 정책과 DNS를 대조한다. LB→Node, Node→Coordinator, Node→Shared Services, Node 간 Job/RPC 및 membership 흐름을 각각 점검한다. PostgreSQL 및 별도 인증·연동 포트는 환경 대장에 별도 기록한다."
      ]
    ],
    "tables": [
      {
        "title": "기본 연결 기준 (선택 구성은 해당 시만)",
        "head": [
          "출발",
          "목적",
          "포트 / 프로토콜"
        ],
        "rows": [
          [
            "Client",
            "Apache / LB",
            "80 / 443 HTTP(S)"
          ],
          [
            "Apache / LB",
            "Polarion Node",
            "8889 TCP AJP"
          ],
          [
            "Node",
            "SVN HTTP(S)",
            "80 / 443"
          ],
          [
            "Node",
            "svnserve",
            "3690 TCP"
          ],
          [
            "Node",
            "Coordinator Zookeeper",
            "2181 TCP"
          ],
          [
            "Node",
            "다른 Node Job RPC",
            "8887 TCP"
          ],
          [
            "Node",
            "다른 Node membership",
            "45564 TCP"
          ],
          [
            "Node",
            "Shared Storage Linux",
            "2049 TCP NFSv4"
          ],
          [
            "Node",
            "Shared Storage Windows",
            "139, 445 TCP SMB"
          ],
          [
            "Node",
            "Kafka (사용 시)",
            "9092 TCP"
          ]
        ]
      }
    ],
    "code": "ss -lnt\n# 승인된 서버에서 실제 목적 호스트/포트의 연결 테스트\n# 예: nc -vz NODE_HOST 8889",
    "verify": "연결이 필요한 방향만 허용하고 내부 서비스의 공개 접근 및 불필요한 listener가 없는지 확인한다."
  },
  "hardware": {
    "ref": "Deployment and Maintenance Guide 6-42~6-44, 8-86~8-88; Config Properties Reference",
    "sections": [
      [
        "CPU 변경",
        "workers와 DB maxPoolSize가 명시 설정된 상태라면 CPU 증설 후 값을 함께 검토한다. maxPoolSize는 미설정 시 10~20 범위 제한이 있으므로 CPU×2라고만 이해하면 안 된다. 가이드의 수동 튜닝은 workers≤CPU, pool≈2×workers, DB max_connections 4배 수준을 제시하되 pool 20 초과 조건에서는 4배 초과 및 여유를 반영한다."
      ],
      [
        "RAM 및 Apache 변경",
        "JVM Xms/Xmx, PostgreSQL shared_buffers/effective_cache_size, Cache heap/disk 용량과 Apache process/thread 제한, svnserve max threads 및 cache를 함께 검토한다. 증설 전후 동일 부하에서 실제 효과를 검증한다."
      ],
      [
        "예시 계산",
        "아래는 수동 workers 값에 따른 설정 검토 예시이며 실제 적정값을 보장하지 않는다. DB 다른 접속과 보안 데이터의 안정성, OS 메모리 여유를 함께 고려한다."
      ]
    ],
    "tables": [
      {
        "title": "workers에 따른 Pool 계산 예시",
        "head": [
          "workers (명시)",
          "Pool 예시",
          "DB max_connections"
        ],
        "rows": [
          [
            "8",
            "16",
            "64보다 충분한 여유 (문서 최소 80 검토)"
          ],
          [
            "16",
            "32",
            "128 초과"
          ],
          [
            "24",
            "48",
            "192 초과"
          ],
          [
            "32",
            "64",
            "256 초과"
          ]
        ]
      }
    ],
    "verify": "각 서비스의 변경 전/후 설정과 peak CPU, GC, 대기 연결, 응답시간, 실제 reindex 소요 시간을 비교한다."
  },
  "disk": {
    "ref": "Deployment and Maintenance Guide 7-26~7-28, 8-83, 8-94~8-98",
    "sections": [
      [
        "디스크 부족 대응",
        "df로 파일시스템과 inode를 확인하고 실제 Polarion data mount의 사용률을 확인한다. 로그, 백업, 빌드 산출물, index 및 SVN을 구분한다. 원본 repo 또는 외부 첨부 파일을 임의 삭제하지 않는다."
      ],
      [
        "정기 작업",
        "SVN revision shard pack은 문서에서 주간 실행을 권장한다. build.clean은 local deployment 또는 오래된 빌드 정리용이고 logs.cleanup은 지정 파일 패턴/보존 기간의 로그 정리용이다. 보존 기간은 감사·장애 분석 정책과 맞춘다."
      ],
      [
        "자원 경보",
        "디스크 여유 기본 경보는 5%이며 문서에는 1 GB, 100 MB 저수준 경보도 설명한다. heap 여유 경보도 있다. receivers 및 monitoring notifications 설정, 메일 도착을 검증한다."
      ]
    ],
    "code": "df -h /opt/polarion/data\ndf -i /opt/polarion/data\n# 승인된 작업 창, 실제 저장소에 대해 정기 pack\n# svnadmin pack /path/to/repo\n# polarion.properties 예시\ncom.polarion.platform.monitoring.notifications.freeSpacePercent=5\ncom.polarion.platform.monitoring.notifications.disabled=false",
    "verify": "공간 확보량, 데이터 접근, Job 결과, 보존 대상 누락 여부를 확인한다. 재색인 이전 .saved는 복구 필요성·백업·정상 상태 확인 후 별도로 판단한다."
  },
  "txlogger": {
    "ref": "Deployment and Maintenance Guide 4-107~4-109, 7-21~7-25",
    "sections": [
      [
        "로그 구조",
        "TXLOGGER는 트랜잭션의 총 실행 시간, CPU user/system, 누적 할당 메모리와 세부 작업 시간을 제공한다. thread annotation에는 u:userId, i:page/object, e:widget, job 식별자 등이 표시될 수 있다. Total은 전체 경과시간이고 CPU는 계산에 사용된 시간이다."
      ],
      [
        "분석 방법",
        "같은 요청의 Total 대비 CPU를 비교한다. CPU가 Total보다 작다고 바로 DB 병목이라고 판단하지 말고 DB, SVN, permission, renderer, Velocity 등 실제 세부 항목을 확인한다. Allocated memory는 트랜잭션 중 누적 할당량이지 종료 시 살아 있는 Heap 크기나 RSS가 아니다. 계층별 시간이 중첩될 수 있다."
      ],
      [
        "RPC·REST와 연결",
        "TX 로그의 시간·thread·user·object를 RPC CSV 또는 REST 로그, Apache 요청 및 OS 지표와 비교한다. 느린 호출이 어느 화면/보고서/스크립트인지 확인하고 동일 조건 재현 데이터를 확보한다."
      ]
    ],
    "code": "# 정확한 날짜 파일을 지정\n grep -n 'TXLOGGER' /path/to/log4j-tx-DATE.log | tail -50\n# 결과는 승인된 범위에서 별도로 보관\n# 로그 형식(단위, multiline)을 먼저 확인하고 시간 기준으로 파싱",
    "verify": "지연 요청의 시각, 객체/사용자(가명 처리), Total, CPU, 상위 세부 작업과 관련 로그를 증거에 포함한다."
  },
  "diagtool": {
    "ref": "diagtool.pdf 1~9장; Deployment and Maintenance Guide 4-107, 8-52",
    "sections": [
      [
        "실행 위치와 옵션",
        "설치 루트의 diagtool 디렉터리(또는 승인된 배포 ZIP)에서 diagtool.properties를 검토한 뒤 Linux run.sh / Windows run.bat로 실행한다. -polarionHome, -resultsDir, -configuration 옵션을 지원하며 CLI 값이 설정 파일보다 우선한다."
      ],
      [
        "기본 진단 및 부하",
        "기본 모듈은 EnvironmentCheck와 PolarionCheck다. FieldTest는 별도 성능 테스트를 포함하므로 운영에서 실행 전 부하와 영향 여부를 확인한다. Shared Services 서버의 diagtool은 업데이트된 Node의 도구 버전과 맞춰 관리한다."
      ],
      [
        "결과 수집",
        "결과 경로의 고유 이름 폴더 및 log4j.txt를 확인한다. UI에서 실행하는 경우 Monitor Job 결과 위치를 확인한다. 자동 전송을 비활성화하고 결과를 검토한 뒤 승인된 Siemens 지원 채널로 전달한다."
      ]
    ],
    "code": "# 설치된 도구의 실제 경로를 확인한 뒤 실행\ncd /opt/polarion/diagtool\n./run.sh -sendResults no -resultsDir /path/to/approved-diagnostics\n# 설정된 모듈 및 결과 확인",
    "verify": "진단 결과, 도구 버전, 실행 서버, 기간을 기록하고 민감정보 및 고객 데이터 포함 여부를 확인한다."
  },
  "custom-fields": {
    "ref": "Administrator and User Help 4-207~4-245",
    "sections": [
      [
        "Custom Field 구성",
        "Administration > Work Items > Custom Fields에서 전역/프로젝트 및 전체 type/특정 type 범위를 선택한다. 공통 설정 파일은 custom-fields.xml이고 type 별 파일은 type ID를 접두어로 사용한다. 예를 들어 requirement-custom-fields.xml이다."
      ],
      [
        "필수값의 기존 데이터 영향",
        "기존 유형에 required custom field를 추가해도 이전 생성 항목에 값이 비어 있는 경우 기존 항목의 변경이 가능할 수 있다. 이미 입력된 값의 제거는 제한될 수 있다. 신규 생성, 기존 편집, 빈값 처리 시나리오를 분리해 테스트한다."
      ],
      [
        "Enumeration 및 의존값",
        "Enum 필드는 기존 enumeration을 참조한다. 상위 값에 따라 하위 선택값을 필터링하도록 enumeration mapping 및 custom field dependency를 구성할 수 있다. 의존 chain 중 읽기 전용 설정이 다른 필드에 영향을 줄 수 있다."
      ],
      [
        "변경 통제",
        "기존 ID를 무분별하게 삭제·변경하지 않는다. 데이터 검색, 보고서, REST, 스크립트, workflow 조건 및 기존 이력에 영향을 주는지 확인한다."
      ]
    ],
    "verify": "신규/기존 Work Item, 필드 필수 조건, 의존 선택 및 권한별 검색·편집·API 값을 검증한다."
  },
  "project-life": {
    "ref": "Administrator and User Help 4-44~4-59",
    "tables": [
      {
        "title": "관리 작업의 차이",
        "head": [
          "작업",
          "의미",
          "주의"
        ],
        "rows": [
          [
            "Mark",
            "기존 repository 폴더를 프로젝트로 등록",
            "재등록 시 ID 유지"
          ],
          [
            "Unmark",
            "포털에서 프로젝트 표시/관리 중지",
            "파일은 SVN에 남음"
          ],
          [
            "Delete",
            "포털 및 repository 파일 제거",
            "삭제 작업 승인 및 정합 백업 필요"
          ],
          [
            "Move",
            "프로젝트 경로 이동",
            "ID 유지, 사용자 중단 및 SVN access 규칙 별도 확인"
          ]
        ]
      }
    ],
    "sections": [
      [
        "이동 절차",
        "Global Administration > Projects에서 대상 프로젝트를 선택하고 Move를 실행하여 새 경로를 지정한다. 대상 폴더 충돌을 확인하고 완료 후 프로젝트 목록 및 SVN access 규칙을 검증한다. 문서상 Move는 access 파일의 프로젝트 관련 규칙을 자동 갱신하지 않는다."
      ],
      [
        "Unmark와 Delete",
        "Projects에서 대상 선택 후 Unmark 또는 Delete를 구분한다. Unmark는 SVN 파일을 유지하지만 Delete는 파일 삭제가 포함된다. 포털 목록에 없는 프로젝트에 대해 중복 Mark를 반복하거나 SVN 폴더를 직접 삭제하는 것을 기본 복구로 사용하지 않는다."
      ]
    ],
    "verify": "프로젝트 ID, 경로, 이력, 권한 및 목록을 확인하고 승인 없이 파괴적 작업을 수행하지 않는다."
  },
  "notifications": {
    "ref": "Deployment and Maintenance Guide 5-26, 5-47~5-50; Administrator and User Help 4-491~4-496",
    "sections": [
      [
        "이벤트와 대상",
        "Work Item 생성/상태 변경, Document 수정, 댓글, Page watcher 등 이벤트에 수신 대상이 연결된다. 작성자, assignee, watcher 등의 대상 설정에 따라 알림이 발생한다. 같은 사용자가 여러 대상에 속해도 동일 이벤트의 알림이 중복 발송되지 않는 방식이다."
      ],
      [
        "권한과 개인 설정",
        "대상 artifact의 READ 권한이 없으면 해당 변경 알림을 받지 못한다. 필드 단위 artifact 권한을 이메일 제한 수단으로 사용할 수 없다는 제한을 고려한다. 사용자 개인 알림 설정 및 이메일 주소도 확인한다."
      ],
      [
        "운영 점검",
        "메일 서버 접속 및 설정, Polarion 알림 이벤트와 대상, 사용자 권한과 수신 여부, 발송 관련 로그를 비교한다. Collaboration Notification과 일반 이메일을 구분한다. Cluster 공통 설정 및 노드별 동작을 검증한다."
      ]
    ],
    "verify": "테스트 이벤트를 생성해 허용 수신자에게 한 번 도착하고 권한 없는 계정에는 알림이 가지 않는지 확인한다."
  },
  "script": {
    "ref": "Administrator and User Help 5-1~5-89; Deployment and Maintenance Guide 8-6",
    "sections": [
      [
        "분류",
        "Workflow Condition은 실행 조건, Function은 전이 시 동작, Scheduled Script는 예약 Job, Page Script/위젯은 렌더링 중 실행되는 코드로 구분한다. SDK 플러그인은 제품의 Java/API 호환성 및 설치 위치를 관리한다."
      ],
      [
        "변경 절차",
        "스크립트 ID·버전, 실행 위치, 입력 데이터·권한, 예상 수정 범위 및 예외 처리 방식을 기록한다. Script Monitor 및 log4j-scripts 로그로 실행 시간과 오류를 확인한다. 사용자 플러그인/feature는 제품 업데이트 전 별도로 백업하고 extensions 위치를 확인한다."
      ],
      [
        "운영 장애",
        "TXLOGGER의 Velocity/스크립트/DB 지표, 실행 시점 및 요청 빈도를 조사한다. 문제가 특정 프로젝트 또는 위젯에 한정되는지 확인한 후 승인된 구성 원복을 검토한다."
      ]
    ],
    "verify": "테스트 환경에서 정상/실패/권한 부족/대량 데이터 조건을 검증하고 이전 버전 복원 경로를 보존한다."
  },
  "svn-cpu": {
    "ref": "Deployment and Maintenance Guide 6-3~6-10, 7-26, 10-1; Apache HTTP Server 2.4 mod_status / mod_log_config; 자체 진단 절차",
    "sections": [
      [
        "1. 관측 지표와 인과관계",
        "SVN 서버의 호스트 CPU, httpd PID별 CPU, 실행 중 요청과 종료된 요청 로그는 서로 다른 관측값이다. Access File 변경 직후 CPU가 올라가는 경우 변경 리비전, CPU 상승 시작·종료 시간, 요청 지연의 시작 시각을 같은 타임존으로 비교한다. 같은 시간대에 발생했다는 사실만으로 authz 재계산을 원인으로 확정하지 않는다."
      ],
      [
        "2. 장애가 시작됐을 때",
        "먼저 OS의 vmstat 또는 mpstat, PID별 CPU와 메모리를 기록한다. 가능하면 승인된 내부 server-status에서 PID와 현재 요청을 확인한다. 서버가 응답하지 않으면 status나 SVN 명령을 반복 호출하지 않고 OS 관측을 우선한다. %CPU는 명령에 따라 누적값 또는 샘플 구간 값이므로 기록 방식도 남긴다."
      ],
      [
        "3. 요청 로그 분류",
        "Apache access log는 일반적으로 요청 종료 후 기록되므로 CPU 상승 시점과 로그 기록 시점이 같지 않을 수 있다. LogFormat에 %D(μs) 또는 %T(초)가 포함되는지 확인한다. 요청별 응답시간이 없다면 정확한 지연 순위를 복원할 수 없다. PROPFIND, REPORT, GET, MERGE 등 HTTP method별 요청량과 지연을 정상 구간과 비교한다."
      ],
      [
        "4. Access File의 변경 확인",
        "저장소 변경 경로와 권한 관련 관리 작업 시각을 확인하고 sync 이후 그룹 정의 변화와 path 규칙 변경을 분리한다. Access File이 변경됐는지, 동일한 리비전에서 문제가 반복되는지, 노드에서 발생한 요청의 분포가 달라졌는지 기록한다. 권한 정보를 그대로 외부에 전송하지 않는다."
      ],
      [
        "5. 판단과 후속 조치",
        "CPU 급등에 일치하는 PID 및 특정 작업 유형이 확인된 경우 그 근거로 Siemens 지원에 전달한다. 해당 시점의 요청 정보가 수집되지 않았으면 원인 미확정으로 남긴다. 긴급 대응과 재발 원인 분석을 분리하며, MPM 변경이나 Access File 원복의 효과는 같은 부하 조건에서 검증한다."
      ]
    ],
    "tables": [
      {
        "title": "원인 분리용 증거 매트릭스",
        "head": [
          "관측",
          "가능한 설명 (확정 아님)",
          "추가 증거"
        ],
        "rows": [
          [
            "CPU 높음 / httpd CPU 높음",
            "Apache 또는 SVN 처리 비용",
            "PID별 현재 요청, access duration"
          ],
          [
            "CPU 높음 / iowait 높음",
            "디스크 대기 동반",
            "iostat, storage latency"
          ],
          [
            "Access 변경과 동시 발생",
            "인가 관련 처리 가능성",
            "변경 revision, 요청 분포, 재현"
          ],
          [
            "CPU 정상 / 긴 요청 증가",
            "대기·외부 의존성",
            "TXLOGGER, DB wait, network"
          ],
          [
            "access log 지연 기록 없음",
            "시간 데이터 부족",
            "LogFormat, 수집 정책 검토"
          ]
        ]
      }
    ],
    "code": "# 읽기 전용 예시: 5초 간격 3회 샘플\nhostname; date -Is\nvmstat 5 3\nps -C httpd -o pid,ppid,%cpu,rss,nlwp,etime --sort=-%cpu | head -25\n# sysstat 설치 환경\npidstat -u -p ALL 5 3\n# 설정 파일에 기록된 응답시간 필드 확인 (RHEL 예시)\ngrep -RInE '^[[:space:]]*(LogFormat|CustomLog)' /etc/httpd --include='*.conf'\n# 저장소의 최신 리비전만 확인 (실제 경로 지정)\nsvnlook youngest /path/to/repo",
    "verify": "정상 구간과 장애 구간을 같은 방식으로 수집한 뒤, CPU를 소비한 구성요소·요청·변경 시각을 확인된 증거와 미확인 가설로 구분한다."
  },
  "httpd-memory": {
    "ref": "Apache HTTP Server 2.4 mpm_common, event, mod_status; Deployment and Maintenance Guide 6-28~6-34; 자체 진단 절차",
    "sections": [
      [
        "RSS·PSS·호스트 메모리",
        "RSS는 프로세스에 매핑된 resident 메모리이고 여러 프로세스가 공유하는 페이지를 각각 포함할 수 있다. PID RSS를 합산하면 실제 전체 물리 메모리 점유량을 과대평가할 수 있다. /proc/PID/smaps_rollup의 Pss와 free의 available을 함께 확인한다. 권한이 허용된 경우에만 조회한다."
      ],
      [
        "event MPM의 프로세스 수",
        "ThreadsPerChild는 프로세스별 worker 수, MaxRequestWorkers는 동시 처리 worker 상한이다. ServerLimit는 프로세스 한도에 관련된다. 종료 중인 자식 프로세스가 남을 수 있어 현재 PID 수를 단순히 MaxRequestWorkers/ThreadsPerChild로 제한된다고 판단하지 않는다."
      ],
      [
        "MaxConnectionsPerChild",
        "0은 연결 수 기준 자동 교체 제한 없음이다. 양수는 자식이 처리하는 연결 수에 따른 교체 정책이다. 처리 중인 연결이 남아 있을 수 있어 즉시 종료를 보장하지 않는다. HTTP 요청 건수와 TCP 연결 수를 동일하게 계산하지 않는다."
      ],
      [
        "운영 중 판단",
        "PID별 RSS/PSS·프로세스 생성 시각·BusyWorkers·IdleWorkers를 추적한다. 메모리와 동일 PID의 수명·작업량이 관련 있는지, graceful 종료 중인 자식이 누적되는지 확인한다. reload 후 RSS 하락만으로 메모리 누수 원인이 입증되는 것은 아니다."
      ],
      [
        "변경의 검증 기준",
        "MPM 변경 전 CPU·메모리·worker·오류율·지연의 정상 기준선을 남긴다. 하나의 변수씩 테스트하고 실제 max worker 포화가 발생했는지 확인한다. ServerLimit 또는 ThreadLimit은 서버 수명 범위 설정이므로 일반 reload로 적용된다고 가정하지 않는다."
      ]
    ],
    "tables": [
      {
        "title": "모니터 지표 해석",
        "head": [
          "지표",
          "의미",
          "주의"
        ],
        "rows": [
          [
            "BusyWorkers",
            "처리 중인 worker",
            "CPU 사용률 아님"
          ],
          [
            "IdleWorkers",
            "대기 중인 worker",
            "모든 연결 수와 다름"
          ],
          [
            "RSS",
            "프로세스 resident memory",
            "공유 페이지 중복"
          ],
          [
            "PSS",
            "공유 페이지를 비례 배분한 값",
            "권한 필요, 스냅샷"
          ],
          [
            "MemAvailable",
            "OS가 추정한 사용 가능한 메모리",
            "free와 구분"
          ],
          [
            "PID lifetime",
            "프로세스 실행 시간",
            "교체 여부 비교"
          ]
        ]
      }
    ],
    "code": "free -h\nps -C httpd -o pid,ppid,etime,%cpu,rss,nlwp --sort=-rss | head -25\n# 승인된 PID의 비례 메모리 확인\n# grep -E '^(Rss|Pss|Private_Clean|Private_Dirty):' /proc/PID/smaps_rollup\nhttpd -V\nhttpd -t -D DUMP_RUN_CFG\n# 내부 관리 경로가 이미 구성된 환경에서만 status 확인\n# curl -fsS http://127.0.0.1/server-status?auto",
    "verify": "변경 효과를 동일한 트래픽 조건에서 메모리 증가율, CPU, worker 포화, 오류율 및 응답 시간으로 비교한다."
  },
  "upload-error": {
    "ref": "Administrator and User Help 4-59~4-63, 4-391, 4-613~4-621; Deployment and Maintenance Guide 5-28~5-37; REST API User Guide 3-12~3-17; 자체 운영 절차",
    "sections": [
      [
        "1. 재현 조건",
        "화면/REST/프로젝트 Import 중 어떤 경로인지, 파일 이름·확장자·바이트 크기, 발생 시간과 사용자 권한을 기록한다. 정상 소형 파일과 실패 파일을 검증 환경에서 비교한다. 원본 파일 내용과 인증 토큰은 공개 자료로 수집하지 않는다."
      ],
      [
        "2. 프록시·HTTP 계층",
        "브라우저 Network 또는 REST 응답의 상태 코드와 body를 확인하고 같은 시점의 Apache/프록시 오류 로그에서 응답을 만든 계층을 확인한다. 400은 잘못된 요청의 가능성, 403은 권한 또는 보안 정책, 413은 크기 제한, 415는 미지원 media type 가능성을 뜻한다. 상태 코드 하나로 특정 규칙이나 제품 원인을 확정할 수 없다."
      ],
      [
        "3. 애플리케이션 검증",
        "프로젝트 ZIP은 별도 archive 한도와 MIME 검사를 적용한다. Antivirus 구성 시 모든 업로드를 검사하며 파일 검사가 실패하면 작업이 거부될 수 있다. 검증에 실패한 파일을 정상 파일로 바꿔 테스트하고 검사 정책을 우회하지 않는다."
      ],
      [
        "4. 저장소 및 결과",
        "SVN과 외부 파일 저장소의 접근·용량·권한, 애플리케이션 로그, Import Job의 결과를 확인한다. 화면에서 Job이 실패로 표시되더라도 일부 대상이 생성되었는지 확인 후 재실행 여부를 결정한다."
      ],
      [
        "5. 업로드와 표시를 구분",
        "다운로드가 정상이고 미리보기만 실패하면 preview converter 또는 LiveDoc 로딩 문제를 우선 구분한다. 업로드가 실패한 경우는 정상 저장 및 원본 접근 여부부터 확인한다."
      ]
    ],
    "tables": [
      {
        "title": "응답 코드별 확인 순서",
        "head": [
          "코드/증상",
          "첫 확인",
          "추가 확인"
        ],
        "rows": [
          [
            "400",
            "request/응답 body",
            "Apache·앱 오류"
          ],
          [
            "401",
            "인증",
            "PAT 만료·사용자"
          ],
          [
            "403",
            "권한/보안 정책",
            "응답 주체 및 로그"
          ],
          [
            "413",
            "요청 바이트 한도",
            "Proxy/HTTP/제품별 제한"
          ],
          [
            "415",
            "Content-Type",
            "JSON vs multipart"
          ],
          [
            "Job Failed",
            "Job log",
            "실제 대상 반영 범위"
          ],
          [
            "미리보기만 실패",
            "원본 다운로드",
            "변환 및 화면 로딩"
          ]
        ]
      }
    ],
    "code": "# 저장소 공간 확인 (실제 경로로 변경)\ndf -h /opt/polarion/data\ndf -i /opt/polarion/data\n# 승인된 로그에서 시간과 오류 유형을 확인\n# grep -iE 'attachment|upload|multipart|antivirus|413|415' /path/to/error_log | tail -60",
    "verify": "동일 계정에서 정상 파일 업로드·다운로드·미리보기와 권한 제한 파일의 의도된 거부를 확인한다."
  },
  "project-missing": {
    "ref": "Administrator and User Help 4-44~4-59, 4-1080; Deployment and Maintenance Guide 8-83~8-89; 자체 운영 절차",
    "sections": [
      [
        "증상 분류",
        "프로젝트가 SVN에 존재하는 것과 Polarion에서 등록된 프로젝트로 인식되는 것은 별개다. 기존 Mark 메시지, 목록 미표시, 프로젝트 조회 실패, 검색 누락을 각각 기록한다. 프로젝트 ID와 SVN 경로, 표시 이름을 구분한다."
      ],
      [
        "1. 관리자 화면",
        "Repository 범위에서 Global Administration > Projects를 열고 필터를 초기화한 뒤 ID 및 표시 이름으로 확인한다. 사용자 계정과 global 관리자 결과를 비교한다. 프로젝트만 보이지 않는지, 다른 프로젝트와 전체 서비스가 정상인지 판단한다."
      ],
      [
        "2. 원본 및 변경 이력",
        "SVN 관리자 승인 하에 실제 프로젝트 경로 및 .polarion 구성 존재 여부와 이전 정상 리비전을 확인한다. 대량 삭제·재등록 또는 프로젝트 ID 변경을 피한다. 사용자/Role 및 access 규칙이 해당 경로에 맞는지 확인한다."
      ],
      [
        "3. Index 상태",
        "startup 및 프로젝트 관련 로그에서 변경 처리, Index 업데이트 실패 및 완료 상태를 확인한다. 표시되는 프로젝트의 Maintenance에서는 대상 Index에 Refresh/Check를 검토한다. 목록에 없어서 프로젝트 범위 기능에 접근 불가하면 global 범위에서 가능한 진단을 하고, 전체 재구축은 영향 분석 뒤 결정한다."
      ],
      [
        "4. 복구 선택",
        "Unmark는 파일을 남기고 포털에서 제외하는 기능이며 Delete는 파일 삭제를 포함한다. 이미 Mark로 표시되지만 화면에서 대상 선택이 안 되는 상황을 단순 Unmark 재실행으로 해결할 수 있다고 가정하지 않는다. 원인 불명일 경우 관련 로그와 실제 상태를 Siemens 지원에 전달한다."
      ]
    ],
    "tables": [
      {
        "title": "상태별 대응",
        "head": [
          "확인 결과",
          "다음 단계"
        ],
        "rows": [
          [
            "관리자만 조회 가능",
            "사용자 Role/Permission 확인"
          ],
          [
            "관리자도 목록 없음",
            "등록·경로·색인 로그 확인"
          ],
          [
            "SVN 경로 없음",
            "삭제/이동 이력·백업 검증"
          ],
          [
            "이미 Mark 메시지",
            "중복 생성 금지, 실제 등록 상태 조사"
          ],
          [
            "목록 정상, 검색만 누락",
            "Refresh/Check Index 검토"
          ]
        ]
      }
    ],
    "verify": "기존 프로젝트 ID·경로·이력을 보존한 상태에서 관리자 및 권한 있는 사용자에게 목록·검색·저장이 정상인지 확인한다."
  }
}
export const extraGuides=[
  {
    "id": "handover",
    "group": "서버",
    "title": "인수인계 필수 정보 및 일일·주간 점검",
    "keywords": "인수인계 checklist daily weekly operations inventory",
    "summary": "운영 환경을 넘겨받을 때 제품 지식뿐 아니라 실제 구성값을 기록해야 한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 3-2~3-6, 7-1, 8-140; 자체 운영 점검표"
  },
  {
    "id": "paths",
    "group": "서버",
    "title": "설치 디렉터리와 파일 위치",
    "keywords": "path directory logs workspace polarion-data saved config",
    "summary": "실제 설치 경로를 확인하고 아래 기본 경로와 비교한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 3-2~3-6, 6-21, 8-89, 8-140"
  },
  {
    "id": "ehcache",
    "group": "성능",
    "title": "Ehcache 전체 운영: 기본값·튜닝·통계",
    "keywords": "ehcache xml eviction dao-workitem ss-context cache statistics",
    "summary": "2606 문서의 캐시별 기본값과 변경 절차를 구분한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 6-14~6-28; Config Properties Reference"
  },
  {
    "id": "location",
    "group": "성능",
    "title": "Location Index / Object Maps / startup workers",
    "keywords": "location index object maps inMemory phase reindex",
    "summary": "Location Index와 기존 Object Maps를 혼동하지 않는다.",
    "checks": [],
    "reference": "Polarion 2606 Config Properties Reference; Deployment and Maintenance Guide 8-86~8-89"
  },
  {
    "id": "authdb",
    "group": "설정",
    "title": "2512+ 인증 DB 및 Apache DBD",
    "keywords": "passwd passwd_credentials polarion_system svnauthn userauthn DBD authn_dbd",
    "summary": "파일 기반 인증에서 PostgreSQL로 이전된 구성을 인수인계한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 8-9~8-17, 8-142~8-144"
  },
  {
    "id": "access",
    "group": "설정",
    "title": "SVN Access File 동기화 및 빈 Role",
    "keywords": "authz access file svn access synchronize empty role user-roles.xml",
    "summary": "권한 관련 변경의 실제 범위를 파악한다.",
    "checks": [],
    "reference": "Administrator and User Help 4-123~4-124; Deployment and Maintenance Guide 8-18~8-19; Config Properties Reference"
  },
  {
    "id": "updatecluster",
    "group": "유지보수",
    "title": "클러스터 및 다중 인스턴스 업그레이드",
    "keywords": "cluster upgrade node coordinator shared services reindex downtime",
    "summary": "Single Instance와 분리하여 검증한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 8-25~8-53, 8-53~8-80"
  },
  {
    "id": "headers",
    "group": "설정",
    "title": "2606 보안 헤더·Secrets Manager 전환",
    "keywords": "security headers tomcat CSP HSTS secrets manager 2606",
    "summary": "업그레이드 전 기존 Apache 구성과 신규 애플리케이션 설정을 비교한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 4-42~4-100, 8-19~8-21"
  },
  {
    "id": "preview",
    "group": "화면",
    "title": "OLE·WMF/EMF Preview·Node.js 수식",
    "keywords": "OLE WMF EMF preview generator MathJax NodeJS 이미지",
    "summary": "첨부 preview와 공식 수식 처리의 서비스 의존성을 구분한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 5-53~5-69; Administrator and User Help 4-391; Config Properties Reference"
  },
  {
    "id": "live-loading",
    "group": "화면",
    "title": "LiveDoc On-demand Work Item Loading",
    "keywords": "livedoc on-demand loading ctrl f 이미지 200 find replace",
    "summary": "대형 문서에서 부분 로딩과 검색 동작을 구분한다.",
    "checks": [],
    "reference": "Administrator and User Help 3-469~3-471, 8-66"
  },
  {
    "id": "permissions",
    "group": "화면",
    "title": "Document·Space·Work Item 권한",
    "keywords": "READ MANAGE MODIFY FIELDS MODIFY CONTENT Space permission",
    "summary": "객체별 권한을 구분한다.",
    "checks": [],
    "reference": "Administrator and User Help 3-531~3-532, 4-145~4-189"
  },
  {
    "id": "templates",
    "group": "화면",
    "title": "Project Templates 관리 및 구성 재사용",
    "keywords": "template project configuration duplicate upload download",
    "summary": "프로젝트 구성의 표준화를 관리한다.",
    "checks": [],
    "reference": "Administrator and User Help 4-68~4-70, 4-43"
  },
  {
    "id": "baseline",
    "group": "화면",
    "title": "Baseline·Collection·Test Management 운영",
    "keywords": "baseline collection time machine test run test case",
    "summary": "릴리스 기준선 및 시험 데이터 관리 범위를 구분한다.",
    "checks": [],
    "reference": "Administrator and User Help 3-352~3-358, 3-393, 3-865~3-912, 3-1323, 4-392~4-441"
  },
  {
    "id": "scheduler",
    "group": "화면",
    "title": "Scheduler 설정 및 Job 운영",
    "keywords": "scheduler cron monitor execute now attachmentindexer dbhistorycreator",
    "summary": "예약 작업과 사용자 부하를 함께 관리한다.",
    "checks": [],
    "reference": "Administrator and User Help 4-1065, 8-9; Deployment and Maintenance Guide 8-88, 8-136~8-138"
  },
  {
    "id": "diag",
    "group": "성능",
    "title": "장애 분석 Runbook: CPU·메모리·SVN·REST",
    "keywords": "diagnostic cpu spike 100 slow httpd heap rest error 401 403 503",
    "summary": "증거를 수집한 뒤 조치한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 4-103~4-109, 7-1~7-26, 10-1; 자체 진단 예시"
  },
  {
    "id": "ports",
    "group": "서버",
    "title": "네트워크·방화벽·서비스 연결",
    "keywords": "port firewall AJP 8889 8887 3690 2181 2049 45564 NFS Zookeeper",
    "summary": "배포 유형별 연결 관계와 실제 허용 포트를 관리한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 2-113~2-115"
  },
  {
    "id": "hardware",
    "group": "성능",
    "title": "CPU·RAM 증설 후 연관 설정 조정",
    "keywords": "hardware scale workers pool max_connections heap ServerLimit upgrade",
    "summary": "CPU 증설만으로 제품의 설정 한도가 자동으로 모두 증가하지 않는다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 6-42~6-44, 8-86~8-88; Config Properties Reference"
  },
  {
    "id": "disk",
    "group": "유지보수",
    "title": "디스크 공간·로그·Repository 정기 유지보수",
    "keywords": "disk space full logs.cleanup build.clean pack backup retention inode",
    "summary": "원본 데이터와 삭제 가능한 산출물을 구분한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 7-26~7-28, 8-83, 8-94~8-98"
  },
  {
    "id": "txlogger",
    "group": "성능",
    "title": "TXLOGGER·RPC 로그 분석",
    "keywords": "txlogger transaction total CPU allocated memory RPC GWT slow request",
    "summary": "지연 요청의 실제 처리 계층을 분석한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 4-107~4-109, 7-21~7-25"
  },
  {
    "id": "diagtool",
    "group": "성능",
    "title": "Polarion Diagnostic Tool (PDT) 실행 및 결과",
    "keywords": "diagtool pdt run.sh resultsDir sendResults probe FieldTest",
    "summary": "지원 분석에 필요한 환경·Polarion 진단 결과를 수집한다.",
    "checks": [],
    "reference": "diagtool.pdf 1~9장; Deployment and Maintenance Guide 4-107, 8-52"
  },
  {
    "id": "custom-fields",
    "group": "화면",
    "title": "Custom Field·Enumeration 운영",
    "keywords": "custom field custom-fields.xml enum enumeration field required dependent",
    "summary": "설정 파일, 상속 범위와 기존 데이터 영향을 구분한다.",
    "checks": [],
    "reference": "Administrator and User Help 4-207~4-245"
  },
  {
    "id": "project-life",
    "group": "화면",
    "title": "프로젝트 이동·Unmark·Delete의 차이",
    "keywords": "project move unmark delete history id inactive archive",
    "summary": "프로젝트 변경 작업은 이력 및 권한에 직접 영향을 준다.",
    "checks": [],
    "reference": "Administrator and User Help 4-44~4-59"
  },
  {
    "id": "notifications",
    "group": "화면",
    "title": "알림·SMTP·Watcher 운영",
    "keywords": "notification email SMTP watcher event target read permission",
    "summary": "알림 누락은 이벤트, 수신자, 권한 및 전송을 각각 확인한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 5-26, 5-47~5-50; Administrator and User Help 4-491~4-496"
  },
  {
    "id": "script",
    "group": "설정",
    "title": "Script·SDK 확장 관리 및 장애",
    "keywords": "script monitor scheduled workflow function condition SDK extension",
    "summary": "스크립트와 플러그인은 업그레이드 및 성능 장애의 점검 대상이다.",
    "checks": [],
    "reference": "Administrator and User Help 5-1~5-89; Deployment and Maintenance Guide 8-6"
  },
  {
    "id": "svn-cpu",
    "group": "성능",
    "title": "SVN CPU 급등·Access File 변경 장애 분석",
    "keywords": "svn cpu 100 access file authz spike httpd request slow PROPFIND REPORT",
    "summary": "CPU 급등 시 프로세스와 지연 요청의 시간축을 맞추고 권한 파일 변경과의 관련성을 검증한다.",
    "checks": [],
    "reference": "Deployment and Maintenance Guide 6-3~6-10, 7-26, 10-1; Apache HTTP Server 2.4 mod_status / mod_log_config; 자체 진단 절차"
  },
  {
    "id": "httpd-memory",
    "group": "성능",
    "title": "Apache 메모리 증가·Worker 포화 분석",
    "keywords": "httpd memory RSS PSS MaxConnectionsPerChild scoreboard busy workers graceful reload",
    "summary": "프로세스 메모리와 worker 사용량을 분리해 설정 변경의 필요성을 판단한다.",
    "checks": [],
    "reference": "Apache HTTP Server 2.4 mpm_common, event, mod_status; Deployment and Maintenance Guide 6-28~6-34; 자체 진단 절차"
  },
  {
    "id": "upload-error",
    "group": "화면",
    "title": "첨부·Import 업로드 실패 및 HTTP 오류",
    "keywords": "upload attachment MIME antivirus 400 403 413 415 mod_security multipart import",
    "summary": "업로드 실패를 HTTP 수신, 파일 검증, 권한, 저장 및 미리보기 문제로 나눈다.",
    "checks": [],
    "reference": "Administrator and User Help 4-59~4-63, 4-391, 4-613~4-621; Deployment and Maintenance Guide 5-28~5-37; REST API User Guide 3-12~3-17; 자체 운영 절차"
  },
  {
    "id": "project-missing",
    "group": "화면",
    "title": "프로젝트가 Mark 상태인데 목록에 보이지 않을 때",
    "keywords": "project missing mark unmark project list index visibility SVN role",
    "summary": "프로젝트 등록·접근·표시 및 색인을 분리해 확인한다.",
    "checks": [],
    "reference": "Administrator and User Help 4-44~4-59, 4-1080; Deployment and Maintenance Guide 8-83~8-89; 자체 운영 절차"
  }
]
