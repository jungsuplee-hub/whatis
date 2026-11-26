export type Chapter={id:string;title:string;en:string;intro:string;ids:string[]}
export type Runbook={type:string;scope:string;impact:string;pre:string[];steps:string[][];rollback:string;related:string[]}
export const chapters:Chapter[]=[
  {
    "id": "start",
    "title": "인수인계 및 운영 기준",
    "en": "Handover",
    "intro": "새 운영 담당자가 가장 먼저 확인할 환경 대장, 일상 점검 및 구성의 기본 원칙.",
    "ids": [
      "handover",
      "architecture",
      "paths"
    ]
  },
  {
    "id": "infra",
    "title": "인프라 설계 및 설치",
    "en": "Infrastructure",
    "intro": "지원 환경, 사이징, 네트워크 연결 및 설치·초기 구성을 확인합니다.",
    "ids": [
      "sizing",
      "ports",
      "install",
      "cluster"
    ]
  },
  {
    "id": "service",
    "title": "서비스 운영 및 시스템 설정",
    "en": "System administration",
    "intro": "정상 기동·종료, 구성 파일 및 라이선스 관리.",
    "ids": [
      "service",
      "properties",
      "license"
    ]
  },
  {
    "id": "storage",
    "title": "저장소 및 데이터베이스",
    "en": "Data services",
    "intro": "Apache, SVN, PostgreSQL 및 첨부파일의 실제 저장·접근 구조.",
    "ids": [
      "apache",
      "svn",
      "postgres",
      "attachments"
    ]
  },
  {
    "id": "security",
    "title": "인증·권한 및 보안",
    "en": "Identity & security",
    "intro": "인증 제공자, 사용자 역할, SVN access 동기화와 보안 구성.",
    "ids": [
      "auth",
      "authdb",
      "roles",
      "access",
      "headers",
      "permissions"
    ]
  },
  {
    "id": "portal",
    "title": "프로젝트 및 화면 관리",
    "en": "Portal administration",
    "intro": "프로젝트 및 업무 객체의 생성·구성·권한·사용자 화면을 관리합니다.",
    "ids": [
      "admin",
      "project",
      "project-life",
      "templates",
      "workitem",
      "workflow",
      "custom-fields",
      "live-loading",
      "baseline",
      "preview",
      "notifications"
    ]
  },
  {
    "id": "integration",
    "title": "API·확장 및 예약 작업",
    "en": "Integration & automation",
    "intro": "REST API, 외부 연동, 스크립트, Scheduler와 Job 운영.",
    "ids": [
      "api",
      "integration",
      "script",
      "scheduler",
      "jobs"
    ]
  },
  {
    "id": "performance",
    "title": "성능 및 인덱스 관리",
    "en": "Performance & indexing",
    "intro": "JVM, Ehcache, Location Index, 재색인, 증설과 모니터링.",
    "ids": [
      "jvm",
      "ehcache",
      "index",
      "location",
      "hardware"
    ]
  },
  {
    "id": "maintenance",
    "title": "패치·업그레이드·복구",
    "en": "Maintenance & recovery",
    "intro": "버전 변경, 클러스터 업그레이드, 백업·복원, 프로젝트 이전 및 공간 관리.",
    "ids": [
      "release",
      "upgrade",
      "updatecluster",
      "backup",
      "migration",
      "disk"
    ]
  },
  {
    "id": "troubleshoot",
    "title": "장애 대응 및 기술 진단",
    "en": "Troubleshooting",
    "intro": "증상별 대응 순서, 로그, 진단 도구와 안전한 확인 명령.",
    "ids": [
      "incident",
      "diag",
      "svn-cpu",
      "httpd-memory",
      "upload-error",
      "project-missing",
      "logs",
      "txlogger",
      "diagtool",
      "commands"
    ]
  }
]
export const runbooks:Record<string,Runbook>={
  "service": {
    "type": "변경 작업",
    "scope": "Linux / systemd · Standalone 및 Node",
    "impact": "해당 인스턴스 이용 중단",
    "pre": [
      "작업 승인 및 사용자 공지",
      "진행 중인 Job, 최근 백업, 의존 서비스 상태 기록",
      "Cluster라면 대상 노드 제외 및 잔여 용량 확인"
    ],
    "steps": [
      [
        "기동 전 기준 확보",
        "systemctl status polarion, 현재 로그인·검색·저장 결과 및 startup/main 로그를 기록한다."
      ],
      [
        "정상 종료",
        "대상 Polarion 서비스에 정상 stop을 수행하고 종료 로그 및 프로세스 상태를 확인한다. 강제 종료는 별도 장애 절차로 취급한다."
      ],
      [
        "의존 서비스 확인",
        "SVN·PostgreSQL·Apache 연결 상태를 점검한 후 Polarion을 정상 start한다."
      ],
      [
        "기동 확인",
        "startup 로그와 실제 로그인·저장·검색·REST 기능을 확인한다. History indexing이 계속되는지 Monitor에서도 확인한다."
      ]
    ],
    "rollback": "기동 실패 시 동일한 작업을 반복하지 말고 마지막 정상 설정과 이번 변경 내역을 대조한다. 원복 후 다시 검증하며, 데이터 변경이 있는 경우 정합 백업 복원 계획을 적용한다.",
    "related": [
      "cluster",
      "logs",
      "index",
      "incident"
    ]
  },
  "index": {
    "type": "변경 작업",
    "scope": "Global / Project 또는 전체 서버",
    "impact": "전체 rebuild 시 해당 서버 서비스 중단",
    "pre": [
      "원본 SVN에 항목이 실제 존재하는지, 권한·검색 조건 확인",
      "백업·작업 공간 여유 확인",
      "전체 rebuild가 필요한 경우 유지보수 창 확정"
    ],
    "steps": [
      [
        "Refresh Index",
        "Administration > Maintenance에서 범위를 선택하고 Index 영역의 Refresh Index 실행."
      ],
      [
        "Check Index",
        "Refresh로 해결되지 않으면 Check Index 실행 및 Job 결과 확인."
      ],
      [
        "전체 Reindex 판단",
        "누락/이력 문제가 남으면 전체 재색인 결정. 작업 범위와 현재 버전·Object Maps/Location Index 방식을 기록."
      ],
      [
        "재색인 실행",
        "서비스 정상 중지 후 Linux 기본 스크립트 /opt/polarion/bin/polarion.init reindex 실행. 기존 polarion-data.saved 생성과 startup 로그 확인."
      ],
      [
        "복구 검증",
        "core index 완료와 별도 History/Attachment indexing의 진행을 구분하고 검색·이력·첨부 등 관련 기능 검증."
      ]
    ],
    "rollback": "중간에 임의로 종료하거나 index 폴더를 수동 삭제하지 않는다. 실패하면 원인 및 공간을 확인하고 지원 절차에 따라 다시 재구축하거나 호환 가능한 인덱스 백업 복원을 선택한다.",
    "related": [
      "location",
      "backup",
      "postgres",
      "logs",
      "hardware"
    ]
  },
  "upgrade": {
    "type": "변경 작업",
    "scope": "Standalone · Linux 기준",
    "impact": "업데이트 및 최초 색인에 따른 서비스 중단",
    "pre": [
      "현재·대상 버전, OS/Java/DB/SVN 지원 범위",
      "전체 정합 백업 및 복원 테스트",
      "필수 변경 파일·확장·인증·라이선스 준비"
    ],
    "steps": [
      [
        "검증 환경 재현",
        "대상 버전 패키지와 동일 운영 설정을 사용한 검증 업데이트에서 소요 시간 및 변경 목록 기록."
      ],
      [
        "업데이트 준비",
        "Polarion 정상 중지, Node.js/Variants 종료 여부 확인. 업데이트 단계에서 필요한 Apache 및 PostgreSQL 유지 여부 확인."
      ],
      [
        "업데이트 실행",
        "배포 ZIP에서 update.sh를 관리자 권한으로 실행하고 결과 및 warnings.txt 보존."
      ],
      [
        "버전별 구성 반영",
        "2506 access, 2512 DB 인증, 2606 보안 헤더/Secrets Manager/지원 Java 조건 등 해당되는 변경만 적용."
      ],
      [
        "시작 및 승인 테스트",
        "서비스 시작, 재색인/이력 색인 확인, 로그인·저장·문서·첨부·REST·권한·Job 검증."
      ]
    ],
    "rollback": "설치 파일만 이전 버전으로 되돌리지 않는다. 데이터·DB·설정·외부 저장소를 포함한 검증된 동일 시점 복구 계획을 사용한다. 변경 승인 기준에 따라 서비스 전환 여부를 결정한다.",
    "related": [
      "release",
      "authdb",
      "headers",
      "backup",
      "updatecluster",
      "index"
    ]
  },
  "updatecluster": {
    "type": "변경 작업",
    "scope": "2304+ → 2606 · Cluster 3 Node 예시",
    "impact": "전환 단계에 전체 사용자 중단 구간 존재",
    "pre": [
      "Coordinator/Node/Shared Services 구성도와 LB 상태 확인",
      "모든 Node에 동일 공유 폴더, 버전별 패키지, 백업 확보",
      "SVN 업데이트 담당 1개 Node 지정 및 전환 계획 검증"
    ],
    "steps": [
      [
        "선행 Node A",
        "LB에서 A 제외, Polarion 중지 후 A 업데이트, 필요한 DB/공유 서비스 전환 준비."
      ],
      [
        "전환 준비",
        "A를 시작하여 startup 상태 점검. 아직 사용자 서비스로 공개하지 않는다."
      ],
      [
        "다운타임 시작",
        "사용자 공지 후 A/B/C 모두 중지하고 Coordinator 중지."
      ],
      [
        "Coordinator 전환",
        "Coordinator 업데이트 후 reindex와 라이선스 확인. Shared Services의 SVN/인증/보안 구성 전환."
      ],
      [
        "새 버전 서비스 개시",
        "A 기동 및 필요한 색인 후 대표 기능 검증, LB 상태 확인."
      ],
      [
        "잔여 Node",
        "B/C 업데이트·시작 후 동일 버전 및 인덱스 정상 확인. 필요할 때 A의 호환 백업 복구."
      ]
    ],
    "rollback": "SVN 변경을 여러 Node에서 반복 실행하지 않는다. 서로 다른 Coordinator/Node 버전에서 사용자 로그온하지 않도록 계획한다. 전환 실패 시 서비스 공개 전에 정합 백업과 패키지별 복구 절차로 원복 여부를 결정한다.",
    "related": [
      "cluster",
      "upgrade",
      "backup",
      "authdb",
      "access",
      "license"
    ]
  },
  "backup": {
    "type": "복구 작업",
    "scope": "로컬 PostgreSQL의 Index Backup / 전체 운영 백업 구분",
    "impact": "Index restore 중 대상 서비스 중단",
    "pre": [
      "백업 유형과 대상 시점, 제품 버전, Index 방식 확인",
      "백업 무결성 및 외부 첨부/DB/SVN 정합성 확인",
      "검증 환경에서 복구 및 대상 데이터 영향 확인"
    ],
    "steps": [
      [
        "Index Backup 준비",
        "Global Administration > Scheduler에서 백업 Job의 대상 경로·공간·workers 검토."
      ],
      [
        "실행 및 결과",
        "Monitor > Scheduled Jobs에서 Backup Job을 실행하고 완료 경로와 결과 로그 확보."
      ],
      [
        "복구 준비",
        "호환 백업으로 복구 가능한지 확인하고 승인된 대상의 Polarion 및 해당 PostgreSQL 중지."
      ],
      [
        "복구 실행",
        "Linux restore.sh -backupFile로 검증된 아카이브를 지정한다. 도구 성공 결과 확인 후 PostgreSQL, Polarion 순서로 기동."
      ],
      [
        "검증",
        "백업 시점 이후 SVN 변경 색인 여부와 검색·문서·첨부·이력 확인."
      ]
    ],
    "rollback": "복구 시 기존 색인이 변경될 수 있으므로 실행 전 기존 상태를 별도 보존한다. Index backup이 고객 원본 데이터 전체 백업을 대체하지 않는다.",
    "related": [
      "index",
      "location",
      "paths",
      "disk"
    ]
  },
  "apache": {
    "type": "설정 변경",
    "scope": "Linux Apache event/worker MPM",
    "impact": "적용 방식에 따라 연결 중단 가능",
    "pre": [
      "Apache 역할 및 MPM 확인",
      "PID별 RSS, worker, 요청량/응답시간 기준 확보",
      "원본 *.conf 백업"
    ],
    "steps": [
      [
        "현재 설정",
        "httpd -V, httpd -M, httpd -t -D DUMP_RUN_CFG로 설정 및 모듈 확인."
      ],
      [
        "산정",
        "ServerLimit×ThreadsPerChild, ThreadLimit, spare threads 및 MaxConnectionsPerChild를 역할과 메모리 예산에 맞게 검토."
      ],
      [
        "구문 검증",
        "변경은 검증 환경에서 한 항목씩. httpd -t 성공 여부 및 실제 반영 범위 확인."
      ],
      [
        "적용 및 비교",
        "정적 제한 변경은 전체 기동 중단 여부를 별도 확인. 처리량·RSS·오류·지연·worker를 변경 전후 비교."
      ]
    ],
    "rollback": "검증 실패나 오류율 증가 시 기존 설정 파일을 복원하고 동일한 적용 방식으로 재검증한다. 메모리 증가 원인은 별도 분석한다.",
    "related": [
      "svn",
      "hardware",
      "diag",
      "logs"
    ]
  },
  "ehcache": {
    "type": "설정 변경",
    "scope": "Polarion Node · Ehcache",
    "impact": "설정 반영을 위한 재시작 및 warm-up 영향",
    "pre": [
      "cache 통계 및 GC, JVM heap 여유 확인",
      "기본 ehcache.xml과 기존 custom 파일 확보",
      "관련 security cache 설정값 확인"
    ],
    "steps": [
      [
        "기준 통계",
        "HITS/MISSES/GETS/EVICTION 및 시간 지표를 같은 업무 구간에서 수집."
      ],
      [
        "대상 cache 선택",
        "heap-only 여부, entry 한도, disk tier 성능과 사용자·프로젝트 규모 확인."
      ],
      [
        "재정의",
        "platform.jar 내부 원본을 기준으로 custom XML 구성. service 요소 제거 및 XSD 검증 조건 확인."
      ],
      [
        "적용 및 검증",
        "서비스 재시작 후 XML validation 실패 여부 확인. warm-up 후 동일 업무에서 통계 및 응답시간 재측정."
      ]
    ],
    "rollback": "XML 검증 실패 시 기본 설정이 사용될 수 있다. 정상 custom 파일을 복원하고 재시작한 뒤 로그와 실제 cache 크기를 확인한다.",
    "related": [
      "jvm",
      "properties",
      "hardware",
      "diag"
    ]
  },
  "access": {
    "type": "설정 변경",
    "scope": "Global Administration · SVN 인증/인가",
    "impact": "사용자 repository 접근 및 권한 영향",
    "pre": [
      "현재 Role 할당 및 access 파일 리비전 보존",
      "영향 사용자·프로젝트 확인",
      "DB 인증과 path 권한을 구분"
    ],
    "steps": [
      [
        "원인 확인",
        "사용자/그룹/Role scope 및 실제 프로젝트 권한 확인."
      ],
      [
        "동기화 범위 확인",
        "Synchronize SVN Access File은 group/멤버십을 맞추며 뒤쪽 directory 규칙은 수정하지 않는다."
      ],
      [
        "동기화",
        "승인된 관리 화면에서 수행하고 Job/로그 및 access 변경 내역 비교."
      ],
      [
        "테스트",
        "정상 권한 사용자와 거부되어야 하는 사용자로 동일 저장소·프로젝트 작업 검증."
      ]
    ],
    "rollback": "정상 구성을 근거로 role assignment 및 승인된 access 규칙을 복원한다. 빈 role 일괄 삭제 또는 더미 사용자 삽입을 기본 해결법으로 사용하지 않는다.",
    "related": [
      "roles",
      "svn",
      "authdb",
      "permissions",
      "diag"
    ]
  },
  "migration": {
    "type": "변경 작업",
    "scope": "Global Administration > Projects",
    "impact": "대상 프로젝트 등록/데이터 생성 및 서버 I/O",
    "pre": [
      "ZIP에 유효 프로젝트 및 .polarion 포함",
      "대상 폴더 미존재, 용량 및 권한 확인",
      "원본/대상 비교 기준과 백업 확보"
    ],
    "steps": [
      [
        "Export",
        "원본 Projects에서 대상 선택 및 Export. job log에서 다운로드 링크/성공 확인."
      ],
      [
        "사전 확인",
        "ZIP 크기 제한과 대상 위치 및 기존 ID/경로 충돌 점검."
      ],
      [
        "Import",
        "대상 Global Administration > Projects > Import에서 파일·Folder Name·선택 Location 지정."
      ],
      [
        "결과 확인",
        "Job log와 실제 생성된 프로젝트, Work Item, 링크, 첨부, 권한 확인."
      ],
      [
        "활성화/검증",
        "필요한 경우 Mark 수행. 재실행 전 일부 반영 여부 확인."
      ]
    ],
    "rollback": "실패했다고 무조건 재실행하지 않는다. 대상 생성/변경 범위, 원본 데이터 및 검증 백업을 확인하고 승인된 복구 방법을 선택한다.",
    "related": [
      "project",
      "project-life",
      "attachments",
      "backup"
    ]
  },
  "auth": {
    "type": "설정 변경",
    "scope": "Global 인증 설정 · Standalone/Cluster",
    "impact": "사용자 로그인 및 자동 생성/동기화 영향",
    "pre": [
      "기존 관리자 접근 경로 및 인증 XML 백업",
      "IdP 설정, 인증서 만료, 사용자 매핑 및 권한 기록",
      "별도 테스트 계정 확보"
    ],
    "steps": [
      [
        "범위 확인",
        "Standalone 로컬 설정 또는 Coordinator 관리 구성을 식별한다."
      ],
      [
        "XML 구성",
        "Global Administration > User Management > Authentication의 XML 편집기 사용. 파일 외부 변경과 혼용하지 않는다."
      ],
      [
        "사용자 검증",
        "관리자 및 일반 사용자 로그인, 로그아웃, 사용자 매핑, 권한/라이선스 확인."
      ],
      [
        "동기화 검증",
        "실제 운영에 해당하는 LDAP/SSO Group 및 Role 동기화 결과와 제외 대상 확인."
      ]
    ],
    "rollback": "기존 인증 방법 및 검증된 XML 복구 절차를 유지한다. 관리자가 잠긴 경우 무작정 인증을 우회하지 말고 지원되는 복구 방법과 승인된 관리 경로를 사용한다.",
    "related": [
      "authdb",
      "roles",
      "license",
      "headers"
    ]
  },
  "license": {
    "type": "변경 작업",
    "scope": "Global Administration / Coordinator",
    "impact": "라이선스 미할당·만료 또는 전환 시 로그인 영향",
    "pre": [
      "현재 라이선스 제공 방식, 만료일, 할당량, 서버 위치",
      "정상 라이선스 파일/설정 보존 및 승인",
      "SALT 전환인지 동일 방식 갱신인지 구분"
    ],
    "steps": [
      [
        "현황 확보",
        "Administration > License에서 할당 및 사용 현황 확인, licensing log 보존."
      ],
      [
        "갱신",
        "기존 라이선스 방식은 Reactivate Polarion 절차로 적용. SALT 사용 환경은 라이선스 서버와 계약에 맞는 갱신 절차 확인."
      ],
      [
        "전환 여부",
        "old↔SALT 전환은 property와 Cluster Coordinator reindex 조건을 별도 검토."
      ],
      [
        "사용자 확인",
        "만료일·할당 수 및 대표 Named/Concurrent 계정 로그인 확인."
      ]
    ],
    "rollback": "기존에 사용 가능했던 라이선스 정보 및 승인된 갱신 복구 경로를 사용한다. 동일 키의 중복 활성화를 시도하지 않는다.",
    "related": [
      "auth",
      "cluster",
      "logs"
    ]
  },
  "diag": {
    "type": "장애 대응",
    "scope": "서버별 읽기 중심 증거 수집",
    "impact": "일반 조회 낮음 · 상세 JVM 진단은 별도 평가",
    "pre": [
      "발생 시간과 시간대 및 대상 서버",
      "최근 변경/정상 기준선",
      "로그 보관 위치와 개인정보 처리"
    ],
    "steps": [
      [
        "영향 분류",
        "전체/일부 사용자, 특정 프로젝트/Node/기능을 분리."
      ],
      [
        "시스템 지표",
        "CPU, memory, I/O, PID, worker 상태를 장애 구간과 정상 구간에서 수집."
      ],
      [
        "요청·로그",
        "Apache access/error, SVN access 변경, main/TX/RPC/REST/DB 로그의 같은 시각을 비교."
      ],
      [
        "병목 판단",
        "실제 느린 작업과 세부 처리 계층, 변경 시점의 선후관계를 기록. 근거 없는 원인 확정은 금지."
      ],
      [
        "완화와 사후 확인",
        "승인된 완화 조치 후 동일 요청과 지표를 재측정."
      ]
    ],
    "rollback": "조치 전에 원래 설정 및 증거를 확보한다. 장애 중 대용량 dump 등 고부하 수집은 영향 평가 후 결정한다.",
    "related": [
      "incident",
      "txlogger",
      "diagtool",
      "logs",
      "apache",
      "svn"
    ]
  }
}
