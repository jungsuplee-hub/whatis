import type {PolarionSection} from './polarion-demo-data'
import type {TrainingLesson} from './TrainingCurriculum'

type Step=TrainingLesson<PolarionSection>
const row=(id:string,chapter:string,title:string,section:PolarionSection,event:string,description:string,hint:string):Step=>({id,chapter,title,section,event,description,hint})
export const polarionCourse:Step[]=[
 row('pl-01','프로젝트 · 화면 탐색','프로젝트 홈 열기','home','home-open','프로젝트의 요약 지표와 내 작업 목록을 확인합니다.','상단 Polarion 로고 또는 왼쪽 Home을 클릭'),
 row('pl-02','프로젝트 · 화면 탐색','Work Items 열기','work-items','nav-work-items','요구사항과 테스트 케이스를 조회할 수 있는 Tracker에 들어갑니다.','왼쪽 Work Items 클릭'),
 row('pl-03','프로젝트 · 화면 탐색','Work Item 검색','work-items','search-items','ID나 제목으로 Work Item 검색 결과를 좁혀 보세요.','목록 위 검색창에 키워드 입력'),
 row('pl-04','프로젝트 · 화면 탐색','유형 필터 사용','work-items','filter-type','Requirement, Test Case 등의 유형별로 목록을 필터링합니다.','유형 선택창에서 All 이외 유형 선택'),
 row('pl-05','프로젝트 · 화면 탐색','상태 필터 사용','work-items','filter-status','작업 상태별 필터로 필요한 업무를 찾습니다.','Status 선택창에서 상태 선택'),
 row('pl-06','프로젝트 · 화면 탐색','목록 필터 초기화','work-items','clear-filters','검색과 유형, 상태 필터를 모두 해제합니다.','목록 도구 모음의 필터 초기화 버튼 클릭'),
 row('pl-07','프로젝트 · 화면 탐색','Tree 계층 보기','work-items','tree-view','Work Item 링크를 기준으로 계층을 살펴봅니다.','Table 옆 Tree 버튼 클릭'),
 row('pl-08','프로젝트 · 화면 탐색','하위 항목 접기/펼치기','work-items','tree-toggle','상위 Work Item의 하위 링크 항목을 접고 펼칩니다.','Tree 보기의 하위 항목 화살표 클릭'),
 row('pl-09','프로젝트 · 화면 탐색','Table 목록 복귀','work-items','table-view','일반 표 보기로 복귀합니다.','Table 버튼 클릭'),

 row('pl-10','Work Item · 생성과 속성','요구사항(Requirement) 만들기','work-items','create-requirement','새 요구사항을 생성하고 상세 속성을 확인합니다.','Create Work Item → Requirement → 제목 입력 → Create'),
 row('pl-11','Work Item · 생성과 속성','Work Item 선택','work-items','select-item','목록에서 항목을 선택하여 아래 편집 패널에 표시합니다.','방금 만든 Work Item 행 클릭'),
 row('pl-12','Work Item · 생성과 속성','제목·담당자·우선순위 변경','work-items','edit-item','Edit로 필드를 변경한 후 저장해 봅니다.','Edit → Title/Assignee/Priority 수정 → Save'),
 row('pl-13','Work Item · 생성과 속성','빠른 상태 변경','work-items','item-status','Open, In Progress 등 Work Item 상태를 바꿉니다.','Quick status change 선택창에서 다른 상태로 변경'),
 row('pl-14','Work Item · 생성과 속성','관심 항목 Watch','work-items','watch-item','선택한 Work Item을 내 관심 항목으로 표시합니다.','Work Item Editor의 Watch 버튼 클릭'),
 row('pl-15','Work Item · 생성과 속성','댓글 작성','work-items','comment-item','동료에게 전달할 검토 댓글을 입력하고 저장합니다.','Add a comment 입력 → Add 클릭'),
 row('pl-16','Work Item · 생성과 속성','활동·이력 탭','work-items','show-activity','Work Item 변경 기록과 검토 상태를 확인합니다.','Review · History · Attachments 탭 클릭'),
 row('pl-17','Work Item · 생성과 속성','파일명 연결','work-items','attach-item-file','Work Item에 첨부 파일명을 학습용으로 기록합니다.','Attachments 아래 파일 이름 입력 → Add'),
 row('pl-18','Work Item · 생성과 속성','속성·링크 탭 복귀','work-items','show-fields','속성 편집과 Work Item 링크 목록으로 돌아옵니다.','Fields · Description · Links 탭 클릭'),
 row('pl-19','Work Item · 생성과 속성','Test Case 만들기','work-items','create-test-case','요구사항 검증에 사용하는 Test Case를 생성합니다.','Create Work Item → Test Case 유형으로 생성'),
 row('pl-20','Work Item · 생성과 속성','Defect 만들기','work-items','create-defect-item','테스트나 개발 과정에서 발견된 결함을 기록합니다.','Create Work Item → Defect 유형으로 생성'),
 row('pl-21','Work Item · 생성과 속성','Task 만들기','work-items','create-task','개발 작업 항목을 새로 작성합니다.','Create Work Item → Task 유형으로 생성'),
 row('pl-22','Work Item · 생성과 속성','Change Request 만들기','work-items','create-change-request','요구사항 변경 요청을 만들어 검토 대상을 정의합니다.','Create Work Item → Change Request 유형으로 생성'),

 row('pl-23','링크 · Traceability','연결 대상 선택','work-items','select-item','원본 Work Item을 선택하여 링크를 설정합니다.','목록에서 연결할 Work Item 하나 선택'),
 row('pl-24','링크 · Traceability','Work Item 연결 생성','work-items','create-link','두 Work Item 간 관계를 링크로 관리합니다.','Add Link → 관계/대상 선택 → Add Link'),
 row('pl-25','링크 · Traceability','연결 관계 제거','work-items','remove-link','잘못 연결된 학습용 관계를 삭제합니다.','Linked Work Items의 연결 삭제(X) 버튼 클릭'),
 row('pl-26','링크 · Traceability','Traceability 관계 조회','traceability','show-trace','요구사항과 테스트 간 추적성 화면을 확인합니다.','Traceability 화면 아래 실제 링크 항목 중 하나 클릭'),
 row('pl-27','링크 · Traceability','추적 링크의 원본 열기','work-items','select-item','링크로 이동한 항목을 상세 패널에서 확인합니다.','선택된 항목을 목록에서 다시 클릭'),

 row('pl-28','검토 · 승인 · 재작업','검토 요청','work-items','submit-item-review','선택한 Work Item을 In Review 상태로 보냅니다.','Request Review 버튼 클릭'),
 row('pl-29','검토 · 승인 · 재작업','검토 승인','work-items','approve-item','검토자가 승인하면 Approved 상태가 됩니다.','Approve 버튼 클릭'),
 row('pl-30','검토 · 승인 · 재작업','처리 이력 확인','work-items','show-activity','변경 이력에 검토 요청과 승인 로그가 남는지 확인합니다.','Review · History · Attachments 탭 클릭'),
 row('pl-31','검토 · 승인 · 재작업','재검토 요청','work-items','submit-item-review','승인된 항목의 새 검토를 다시 시작합니다.','Request Review 클릭'),
 row('pl-32','검토 · 승인 · 재작업','수정 요청 처리','work-items','rework-item','검토자가 Rework를 요청하면 Open으로 돌아갑니다.','Request Rework 버튼 클릭'),

 row('pl-33','LiveDocs · 문서 관리','새 LiveDoc 만들기','documents','create-doc','Space에 LiveDoc 문서를 새로 생성합니다.','Create Document → 제목 입력 → Create'),
 row('pl-34','LiveDocs · 문서 관리','LiveDoc 선택','documents','select-doc','Space 트리에서 작업할 문서를 선택합니다.','문서 트리에서 문서 한 개 클릭'),
 row('pl-35','LiveDocs · 문서 관리','문서 섹션 수정','documents','edit-doc','문서 섹션 제목과 본문을 편집해 저장합니다.','Edit Section → Heading/Body 수정 → Save'),
 row('pl-36','LiveDocs · 문서 관리','Work Item 삽입','documents','add-doc-item','LiveDoc 안에 추적 가능한 Work Item을 연결합니다.','Insert Work Item → 대상 선택 → Add to Document'),
 row('pl-37','LiveDocs · 문서 관리','문서 검토 요청','documents','doc-review','문서 상태를 In Review로 바꿔 검토 흐름을 연습합니다.','문서 도구의 Request Review 클릭'),
 row('pl-38','LiveDocs · 문서 관리','문서 승인','documents','doc-approve','검토 완료 문서를 Approved로 변경합니다.','문서 도구의 Approve 클릭'),

 row('pl-39','Plans · 일정과 범위','Plan 생성','plans','create-plan','릴리스 또는 이터레이션을 위한 계획을 생성합니다.','Create Plan → 제목 입력 → Create'),
 row('pl-40','Plans · 일정과 범위','Plan 선택','plans','select-plan','계획의 일정과 상태, 연결 Work Item을 봅니다.','왼쪽 Plan 목록에서 방금 만든 Plan 선택'),
 row('pl-41','Plans · 일정과 범위','Plan에 작업 추가','plans','attach-plan','계획 범위에 Work Item을 추가합니다.','Add Work Item에서 항목 선택 → Add to Plan'),
 row('pl-42','Plans · 일정과 범위','Plan 상태 전환','plans','plan-status','Not Started에서 In Progress로 계획을 진행시킵니다.','Change Status 클릭'),
 row('pl-43','Plans · 일정과 범위','Plan에서 작업 제거','plans','remove-plan-item','불필요한 Work Item을 계획에서 제거합니다.','Planned Work Items 목록에서 X 클릭'),

 row('pl-44','Test Runs · 시험과 결함','Test Run 생성','test-runs','create-run','수동 시험을 위한 Test Run을 새로 생성합니다.','Create Test Run → 이름 입력 → Create'),
 row('pl-45','Test Runs · 시험과 결함','Test Run 선택','test-runs','select-run','시험 케이스와 진행 현황을 확인합니다.','Test Runs 목록에서 실행 항목 클릭'),
 row('pl-46','Test Runs · 시험과 결함','Test Case 추가','test-runs','attach-case','새로운 Test Case를 Test Run에 포함합니다.','Add Test Case → 기존에 없는 Test Case 선택 → Add'),
 row('pl-47','Test Runs · 시험과 결함','Test Case 선택','test-runs','select-case','시험 단계와 실행 결과 입력란을 확인합니다.','Test Records의 Test Case 이름 클릭'),
 row('pl-48','Test Runs · 시험과 결함','시험 수행 메모 기록','test-runs','save-test-note','실제 수행 결과와 증빙 내용을 메모합니다.','Execution Notes 입력 → Save Notes'),
 row('pl-49','Test Runs · 시험과 결함','Pass 결과 기록','test-runs','record-pass','수동 테스트를 실행하고 Passed로 기록합니다.','Test Record 결과를 Passed로 변경'),
 row('pl-50','Test Runs · 시험과 결함','시험 결과 요약','test-runs','view-test','실행률과 Pass/Fail/Blocked 집계를 확인합니다.','Review Summary 클릭'),
 row('pl-51','Test Runs · 시험과 결함','Fail 결과 기록','test-runs','record-failure','검증 실패를 기록하면 Defect 생성 기능을 사용할 수 있습니다.','Test Record 결과를 Failed로 변경'),
 row('pl-52','Test Runs · 시험과 결함','실패 기반 Defect 생성','test-runs','create-defect','Failed 항목의 결함을 생성하고 Test Case에 연결합니다.','Create linked Defect 클릭'),
 row('pl-53','Test Runs · 시험과 결함','새 Defect 확인','work-items','select-item','생성된 결함과 테스트 링크를 확인합니다.','Work Items 목록의 새 Defect 행 클릭'),

 row('pl-54','Baseline · 보고서','프로젝트 Baseline 생성','baselines','create-baseline','현재 Work Item 상태를 보존하는 학습용 기준선을 생성합니다.','Create Baseline → 이름 입력 → Save Snapshot'),
 row('pl-55','Baseline · 보고서','저장된 Baseline 열기','baselines','select-baseline','기준선의 기록 시점과 저장된 상태를 확인합니다.','Baseline 목록의 새 기준선 클릭'),
 row('pl-56','Baseline · 보고서','기준선과 현재 상태 비교','baselines','compare-baseline','동일 항목의 현재 상태와 저장 당시 상태를 비교합니다.','Compare with Current 버튼 클릭'),
 row('pl-57','Baseline · 보고서','프로젝트 현황 보고서','reports','open-reports','Work Item, 테스트, 결함의 집계 보고서를 봅니다.','Reports의 Refresh Metrics 클릭'),
 row('pl-58','Baseline · 보고서','보고서 상태별 집계','reports','report-filter','상태 필터로 보고서 수치를 비교합니다.','보고서의 Status 필터 선택')
]
