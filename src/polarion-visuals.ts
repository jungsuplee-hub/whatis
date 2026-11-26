export type Diagram={title:string;caption:string;source:string;nodes:(string|number)[][];edges:(string|number)[][]}
export const diagrams:Record<string,Diagram[]>={
  "architecture": [
    {
      "title": "Standalone 요청 및 데이터 처리 구조",
      "caption": "사용자 요청은 Apache를 거쳐 Polarion으로 전달됩니다. SVN 원본, SQL 인덱스 및 캐시는 역할이 다릅니다. 구성에 따라 별도 인증 DB와 외부 첨부 저장소를 사용합니다.",
      "source": "Deployment and Maintenance Guide 2-14, 3-2~3-6, 6-3~6-14",
      "nodes": [
        [
          "Client",
          "Browser / REST",
          0,
          1
        ],
        [
          "Apache HTTPD",
          "HTTP(S) / AJP",
          1,
          1
        ],
        [
          "Polarion JVM",
          "업무 처리 · Index",
          2,
          1
        ],
        [
          "SVN Repository",
          "원본 / revision",
          3,
          0
        ],
        [
          "PostgreSQL",
          "SQL / 인증 DB",
          3,
          1
        ],
        [
          "Storage",
          "첨부 · Cache",
          3,
          2
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          2,
          4
        ],
        [
          2,
          5
        ]
      ]
    }
  ],
  "cluster": [
    {
      "title": "Cluster의 Node·Coordinator·Shared Services 관계",
      "caption": "LB의 사용자 트래픽 분배와 Coordinator 연결, Shared Services의 공통 데이터 접근을 구분합니다. 실제 배치는 환경별로 다릅니다.",
      "source": "Deployment and Maintenance Guide 2-70~2-113",
      "nodes": [
        [
          "Browser",
          "사용자",
          0,
          1
        ],
        [
          "Load Balancer",
          "Apache",
          1,
          1
        ],
        [
          "Node A",
          "Polarion / 로컬 index",
          2,
          0
        ],
        [
          "Node B",
          "Polarion / 로컬 index",
          2,
          2
        ],
        [
          "Coordinator",
          "제어 · 라이선스",
          3,
          0
        ],
        [
          "Shared Services",
          "SVN / shared storage",
          3,
          2
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          2,
          4
        ],
        [
          3,
          4
        ],
        [
          2,
          5
        ],
        [
          3,
          5
        ]
      ]
    }
  ],
  "apache": [
    {
      "title": "event MPM의 Process · Worker 구조",
      "caption": "예시: ServerLimit 16, ThreadsPerChild 25, MaxRequestWorkers 400. 그림은 일부 child만 표현합니다. 종료 중인 child나 비동기 연결은 별도로 고려합니다.",
      "source": "Apache HTTP Server 2.4 event / mpm_common; Deployment and Maintenance Guide 6-28~6-34",
      "nodes": [
        [
          "Parent httpd",
          "MPM 관리",
          0,
          1
        ],
        [
          "Child 1",
          "25 worker threads",
          1,
          0
        ],
        [
          "Child 2",
          "25 worker threads",
          1,
          1
        ],
        [
          "Child …",
          "최대 설정 범위",
          1,
          2
        ],
        [
          "Request",
          "worker 처리",
          2,
          0
        ],
        [
          "Keep-alive",
          "event listener",
          2,
          1
        ],
        [
          "Graceful 종료",
          "기존 연결 완료",
          2,
          2
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          3
        ],
        [
          1,
          4
        ],
        [
          2,
          5
        ],
        [
          3,
          6
        ]
      ]
    }
  ],
  "svn": [
    {
      "title": "SVN의 사용자 경로와 시스템 조회 경로",
      "caption": "repo는 일반 접근 경로이고 repoSystem은 시스템 계정용 읽기 경로입니다. 두 경로가 동일 저장소를 가리키는지 확인합니다.",
      "source": "Deployment and Maintenance Guide 6-3~6-5",
      "nodes": [
        [
          "Polarion",
          "사용자 작업",
          0,
          0
        ],
        [
          "Polarion",
          "시스템 Index 작업",
          0,
          2
        ],
        [
          "Apache / DAV",
          "repo · HTTP(S)",
          1,
          0
        ],
        [
          "svnserve",
          "repoSystem · SVN",
          1,
          2
        ],
        [
          "SVN Repository",
          "업무 원본 및 revision",
          2,
          1
        ]
      ],
      "edges": [
        [
          0,
          2
        ],
        [
          1,
          3
        ],
        [
          2,
          4
        ],
        [
          3,
          4
        ]
      ]
    }
  ],
  "postgres": [
    {
      "title": "Polarion SQL Connection Pool 구조",
      "caption": "HEAD, HEAD Read-only, History 및 별도 Resource Traceability pool의 연결 총량을 DB의 max_connections와 비교해야 합니다.",
      "source": "Deployment and Maintenance Guide 8-86~8-88",
      "nodes": [
        [
          "Polarion JVM",
          "DB 요청",
          0,
          1
        ],
        [
          "HEAD",
          "pool",
          1,
          0
        ],
        [
          "HEAD read-only",
          "pool",
          1,
          1
        ],
        [
          "History",
          "pool",
          1,
          2
        ],
        [
          "Traceability",
          "별도 pool",
          1,
          3
        ],
        [
          "PostgreSQL",
          "연결 상한",
          2,
          1
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          3
        ],
        [
          0,
          4
        ],
        [
          1,
          5
        ],
        [
          2,
          5
        ],
        [
          3,
          5
        ],
        [
          4,
          5
        ]
      ]
    }
  ],
  "ehcache": [
    {
      "title": "Cache miss 발생 시 확인해야 하는 계층",
      "caption": "heap hit, disk tier, 원본 조회는 비용이 서로 다릅니다. 그림은 일반화된 논리 흐름이며 모든 캐시에 disk tier가 있는 것은 아닙니다.",
      "source": "Deployment and Maintenance Guide 6-14~6-28",
      "nodes": [
        [
          "Object lookup",
          "데이터 요청",
          0,
          1
        ],
        [
          "Heap Cache",
          "빠른 조회",
          1,
          1
        ],
        [
          "Disk Tier",
          "설정된 캐시만",
          2,
          1
        ],
        [
          "Authoritative Data",
          "SVN 등 원본",
          3,
          1
        ],
        [
          "Heap hit",
          "캐시 반환",
          1,
          0
        ],
        [
          "Disk hit",
          "캐시 반환",
          2,
          0
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2,
          "miss"
        ],
        [
          2,
          3,
          "miss"
        ],
        [
          1,
          4,
          "hit"
        ],
        [
          2,
          5,
          "hit"
        ]
      ]
    }
  ],
  "index": [
    {
      "title": "검색 누락 시 Index 복구 의사결정",
      "caption": "Refresh → Check → 전체 Reindex 순으로 검토합니다. 전체 재색인은 서비스 중단과 후속 역사 DB 색인을 구분합니다.",
      "source": "Deployment and Maintenance Guide 8-83~8-89",
      "nodes": [
        [
          "원본·권한 확인",
          "SVN / Query",
          0,
          1
        ],
        [
          "Refresh Index",
          "대상 index",
          1,
          1
        ],
        [
          "Check Index",
          "누락 검사",
          2,
          1
        ],
        [
          "Full Reindex",
          "서비스 중단",
          3,
          1
        ],
        [
          "정상 확인",
          "작업 완료",
          1,
          0
        ],
        [
          "정상 확인",
          "작업 완료",
          2,
          0
        ],
        [
          "History DB",
          "후속 작업",
          3,
          2
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2,
          "미해결"
        ],
        [
          2,
          3,
          "미해결"
        ],
        [
          1,
          4,
          "정상"
        ],
        [
          2,
          5,
          "정상"
        ],
        [
          3,
          6
        ]
      ]
    }
  ],
  "attachments": [
    {
      "title": "첨부파일의 저장 및 조회 흐름",
      "caption": "파일 검사가 구성된 경우 업로드 후 검사를 수행합니다. 외부 저장소 구성은 SVN의 메타데이터와 바이너리 저장을 분리합니다.",
      "source": "Deployment and Maintenance Guide 5-28~5-37",
      "nodes": [
        [
          "Upload",
          "UI / API",
          0,
          1
        ],
        [
          "HTTP / App",
          "요청·권한 확인",
          1,
          1
        ],
        [
          "Antivirus",
          "구성 시 검사",
          2,
          1
        ],
        [
          "SVN",
          "일반 저장 또는 metadata",
          3,
          0
        ],
        [
          "External storage",
          "구성 시 바이너리",
          3,
          2
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          2,
          4
        ]
      ]
    }
  ],
  "auth": [
    {
      "title": "인증과 인가·라이선스의 분리",
      "caption": "로그인 성공은 특정 프로젝트 권한 또는 라이선스가 정상임을 보장하지 않습니다. 각 단계의 실패 여부를 분리해서 조사합니다.",
      "source": "Administrator and User Help 6-1~6-93, 4-145~4-176; Deployment and Maintenance Guide 7-28~7-35",
      "nodes": [
        [
          "User",
          "로그인",
          0,
          1
        ],
        [
          "Identity Provider",
          "LDAP / SAML / OAuth",
          1,
          1
        ],
        [
          "User mapping",
          "Polarion 계정",
          2,
          1
        ],
        [
          "License",
          "할당 / 사용",
          3,
          0
        ],
        [
          "Permissions",
          "Role / item 권한",
          3,
          2
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          2,
          4
        ]
      ]
    }
  ],
  "access": [
    {
      "title": "Role 동기화와 SVN access 파일",
      "caption": "Synchronize SVN Access File은 역할 정의 및 사용자 할당과 group membership을 맞추는 기능입니다. 경로별 규칙의 변경과 구분합니다.",
      "source": "Administrator and User Help 4-123~4-124; Deployment and Maintenance Guide 8-18~8-19",
      "nodes": [
        [
          "Role / User",
          "Global·Project scope",
          0,
          1
        ],
        [
          "Sync SVN Access",
          "Administration",
          1,
          1
        ],
        [
          "Group membership",
          "access 파일 앞부분",
          2,
          0
        ],
        [
          "Path rules",
          "별도 관리",
          2,
          2
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2
        ]
      ]
    }
  ],
  "updatecluster": [
    {
      "title": "Cluster 업데이트 단계 및 사용자 전환 구간",
      "caption": "2304 이상에서 2606으로 업데이트하는 문서의 3 Node 예시를 설명한 도식입니다. 필수 구성 변경 및 검증 단계는 본문 Runbook을 사용합니다.",
      "source": "Deployment and Maintenance Guide 8-27~8-52",
      "nodes": [
        [
          "Node A",
          "LB 제외 · 선행 update",
          0,
          1
        ],
        [
          "A/B/C 중지",
          "사용자 중단",
          1,
          1
        ],
        [
          "Coordinator",
          "update · reindex",
          2,
          1
        ],
        [
          "Node A",
          "기동 · 검증",
          3,
          0
        ],
        [
          "Node B/C",
          "update · 기동",
          3,
          2
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          3,
          4
        ]
      ]
    }
  ],
  "backup": [
    {
      "title": "운영 데이터 백업과 Index Backup 구분",
      "caption": "SVN, 인증 DB, 외부 첨부, 설정은 운영 정합 백업의 대상입니다. Index Backup은 검색·SQL index 등의 복구에 사용되며 원본 데이터 전체 백업을 대체하지 않습니다.",
      "source": "Deployment and Maintenance Guide 4-83, 8-135~8-144",
      "nodes": [
        [
          "SVN / 인증 DB",
          "원본 및 이력",
          0,
          0
        ],
        [
          "외부 첨부 / 설정",
          "운영 데이터",
          0,
          2
        ],
        [
          "전체 정합 백업",
          "운영 복원",
          1,
          1
        ],
        [
          "Lucene / SQL",
          "index",
          0,
          4
        ],
        [
          "Index Backup",
          "검색·색인 복원",
          1,
          4
        ],
        [
          "복원 검증",
          "접속·검색·쓰기",
          2,
          2
        ]
      ],
      "edges": [
        [
          0,
          2
        ],
        [
          1,
          2
        ],
        [
          3,
          4
        ],
        [
          2,
          5
        ],
        [
          4,
          5
        ]
      ]
    }
  ],
  "svn-cpu": [
    {
      "title": "SVN CPU 급등 시 증거 수집의 시간축",
      "caption": "CPU·httpd 요청·Access File 변경의 시간을 동일 기준으로 맞춘 뒤 정상 구간과 비교합니다. 도식은 분석 절차이지 특정 장애 원인의 입증이 아닙니다.",
      "source": "자체 장애 분석 도식; Apache mod_status / mod_log_config, Deployment and Maintenance Guide 7-26",
      "nodes": [
        [
          "장애 시각",
          "Timezone 고정",
          0,
          1
        ],
        [
          "OS / PID",
          "CPU · I/O",
          1,
          0
        ],
        [
          "Apache",
          "Request / duration",
          1,
          1
        ],
        [
          "SVN Access",
          "변경 revision",
          1,
          2
        ],
        [
          "상관 분석",
          "정상 vs 장애",
          2,
          1
        ],
        [
          "원인 판단",
          "증거 / 미확정 구분",
          3,
          1
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          3
        ],
        [
          1,
          4
        ],
        [
          2,
          4
        ],
        [
          3,
          4
        ],
        [
          4,
          5
        ]
      ]
    }
  ],
  "upload-error": [
    {
      "title": "첨부 업로드 실패 계층 분리",
      "caption": "HTTP 응답, 애플리케이션 파일 검사, 저장 상태, 화면 렌더링 순서로 증거를 확인합니다.",
      "source": "REST API User Guide 3-12~3-17; Deployment and Maintenance Guide 5-28~5-37",
      "nodes": [
        [
          "HTTP / Proxy",
          "상태 코드",
          0,
          1
        ],
        [
          "App Validation",
          "MIME / Antivirus",
          1,
          1
        ],
        [
          "Storage",
          "SVN / 외부 저장소",
          2,
          1
        ],
        [
          "Preview",
          "다운로드 vs 표시",
          3,
          1
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2
        ],
        [
          2,
          3
        ]
      ]
    }
  ],
  "project-missing": [
    {
      "title": "프로젝트 목록 미표시 확인 경로",
      "caption": "등록 여부, 권한, SVN 경로 및 인덱스 상태를 조사합니다. 원인 확인 전 프로젝트를 삭제하거나 재등록하지 않습니다.",
      "source": "Administrator and User Help 4-44~4-59; Deployment and Maintenance Guide 8-83~8-89",
      "nodes": [
        [
          "Global Admin",
          "Projects 목록",
          0,
          1
        ],
        [
          "Role / Access",
          "사용자 접근 확인",
          1,
          0
        ],
        [
          "SVN path",
          "ID · .polarion",
          1,
          2
        ],
        [
          "Index / Logs",
          "변경 처리 확인",
          2,
          1
        ],
        [
          "복구 판단",
          "Refresh / Check 등",
          3,
          1
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          0,
          2
        ],
        [
          1,
          3
        ],
        [
          2,
          3
        ],
        [
          3,
          4
        ]
      ]
    }
  ],
  "api": [
    {
      "title": "REST API 요청의 인증·권한·응답 흐름",
      "caption": "PAT 등 인증과 endpoint/item-level 권한을 거쳐 조회합니다. 필요한 필드와 pagination을 지정해 응답 크기를 관리합니다.",
      "source": "REST API User Guide 1-6~1-18, 2-1~2-23",
      "nodes": [
        [
          "REST Client",
          "HTTP request",
          0,
          1
        ],
        [
          "Authentication",
          "PAT / JWT",
          1,
          1
        ],
        [
          "Authorization",
          "endpoint / item",
          2,
          1
        ],
        [
          "Response",
          "JSON / links.next",
          3,
          1
        ]
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2
        ],
        [
          2,
          3
        ]
      ]
    }
  ]
}
const screenshotUrls:Record<string,string>={
 workitems:new URL('./ops-figures/workitems.png',import.meta.url).href,
 documents:new URL('./ops-figures/documents.png',import.meta.url).href,
 'test-runs':new URL('./ops-figures/test-runs.png',import.meta.url).href,
 baselines:new URL('./ops-figures/baselines.png',import.meta.url).href,
 reports:new URL('./ops-figures/reports.png',import.meta.url).href
}
export type Screenshot={url:string;title:string;caption:string}
const screenData:Record<string,string[][]>={
  "workitem": [
    [
      "workitems",
      "Work Items 목록 및 속성",
      "좌측 Topics에서 Work Items를 선택하고 목록과 상세 영역을 확인하는 학습용 화면입니다."
    ],
    [
      "documents",
      "Documents & Pages / LiveDoc",
      "문서와 내부 Work Item의 구성 관계를 보여 주는 학습용 화면입니다."
    ],
    [
      "reports",
      "Reports 화면",
      "보고서 확인의 예시입니다. 실제 운영 위젯의 성능과 구성은 다를 수 있습니다."
    ]
  ],
  "live-loading": [
    [
      "documents",
      "LiveDoc 문서 열람",
      "이 예시는 문서 열람 흐름을 설명합니다. On-demand Work Item Loading 설정 UI 자체를 재현한 화면은 아닙니다."
    ]
  ],
  "baseline": [
    [
      "test-runs",
      "Test Runs / 실행 결과",
      "Test Run과 Test Case 결과를 구분하여 확인하는 예시입니다."
    ],
    [
      "baselines",
      "Baselines 화면",
      "기준선 선택과 리비전 관리를 이해하기 위한 화면 예시입니다."
    ]
  ]
}
export const screenshots:Record<string,Screenshot[]>=Object.fromEntries(Object.entries(screenData).map(([id,rows])=>[id,rows.map(([key,title,caption])=>({url:screenshotUrls[key],title,caption}))]))
export const officialVisualLinks:Record<string,{label:string;url:string}[]>={
 release:[{label:'Siemens 공식 2606 릴리스 화면 및 이미지',url:'https://blogs.sw.siemens.com/polarion/polarion-alm-2606-whats-new-and-noteworthy/'}],
 workitem:[{label:'Siemens 공식 ALM 제품 화면',url:'https://plm.sw.siemens.com/en-US/polarion/application-lifecycle-management-alm/'}],
 permissions:[{label:'Siemens Community의 Permissions Management 실제 화면 사례 (버전 미확인)',url:'https://community.sw.siemens.com/s/question/0D5Vb00000VpkljKAB/issue-with-document-custom-set-query-for-restricting-editing-in-polarion'}],
 api:[{label:'Siemens 공식 REST API 명세 / Swagger',url:'https://developer.siemens.com/polarion/rest-api-spec.html'}]
}
