export type WorkType='Requirement'|'Test Case'|'Defect'|'Task'|'Change Request'
export type WorkStatus='Open'|'In Progress'|'In Review'|'Approved'|'Done'
export type WorkPriority='High'|'Medium'|'Low'
export type TestResult='Not Run'|'Passed'|'Failed'|'Blocked'
export interface WorkItem {id:string;title:string;type:WorkType;status:WorkStatus;priority:WorkPriority;assignee:string;description:string;updated:string;comments:string[];attachments?:string[]}
export interface WorkLink {source:string;target:string;role:'verifies'|'relates to'|'depends on'|'implements'}
export interface PolarionDoc {id:string;title:string;space:string;status:'Draft'|'In Review'|'Approved';sections:{id:string;heading:string;body:string;workItemId?:string}[]}
export interface Plan {id:string;title:string;start:string;end:string;status:'Not Started'|'In Progress'|'Finished';workItemIds:string[]}
export interface TestRun {id:string;title:string;template:string;date:string;cases:Record<string,TestResult>;notes?:Record<string,string>}
export interface PolarionState {workItems:WorkItem[];links:WorkLink[];documents:PolarionDoc[];plans:Plan[];testRuns:TestRun[];history:string[]}
export const sampleDate='2026-11-21'
export const seedPolarion=():PolarionState=>({
 workItems:[
  {id:'DP-101',type:'Requirement',title:'배터리 주행거리 요구사항',status:'Approved',priority:'High',assignee:'김기획',description:'예제 전동 이동수단의 주행거리 요구사항을 정의합니다. 실제 제품 성능이나 시험 기준은 아닙니다.',updated:sampleDate,comments:['요구사항의 검증 가능 여부를 확인했습니다.']},
  {id:'DP-102',type:'Requirement',title:'과충전 방지 안전 요구사항',status:'In Review',priority:'High',assignee:'이설계',description:'안전 기능과 테스트 조건을 정리하기 위한 학습용 요구사항입니다.',updated:sampleDate,comments:[]},
  {id:'DP-103',type:'Requirement',title:'상태 표시 화면 요구사항',status:'Open',priority:'Medium',assignee:'박개발',description:'충전 상태 및 경고 화면에 나타날 정보를 정리합니다.',updated:sampleDate,comments:[]},
  {id:'DP-201',type:'Test Case',title:'주행거리 요구사항 검증 시험',status:'In Progress',priority:'High',assignee:'최시험',description:'DP-101 요구사항을 검증하기 위한 예제 테스트 케이스입니다. 실제 측정 결과가 아닙니다.',updated:sampleDate,comments:[]},
  {id:'DP-202',type:'Test Case',title:'과충전 방지 기능 시험',status:'Open',priority:'High',assignee:'최시험',description:'DP-102 요구사항에 대한 기능 테스트 절차를 연습합니다.',updated:sampleDate,comments:[]},
  {id:'DP-203',type:'Test Case',title:'상태 표시 UI 시험',status:'Open',priority:'Medium',assignee:'최시험',description:'DP-103의 표시 항목을 확인하기 위한 예제 시험입니다.',updated:sampleDate,comments:[]},
  {id:'DP-301',type:'Defect',title:'충전 완료 표시 지연',status:'In Progress',priority:'High',assignee:'박개발',description:'상태 표시 지연 상황을 가정한 교육용 결함 기록입니다.',updated:sampleDate,comments:['관련 테스트 결과를 확인하고 있습니다.']},
  {id:'DP-401',type:'Task',title:'표시 화면 개선',status:'Open',priority:'Medium',assignee:'박개발',description:'상태 화면의 문구와 표시 순서를 개선하는 작업 예시입니다.',updated:sampleDate,comments:[]},
  {id:'DP-501',type:'Change Request',title:'배터리 안전 검토 강화',status:'In Review',priority:'High',assignee:'김기획',description:'안전 요구사항을 재검토하고 관련 테스트를 업데이트하는 변경 요청 예시입니다.',updated:sampleDate,comments:[]}
 ],
 links:[
  {source:'DP-201',target:'DP-101',role:'verifies'},
  {source:'DP-202',target:'DP-102',role:'verifies'},
  {source:'DP-203',target:'DP-103',role:'verifies'},
  {source:'DP-301',target:'DP-203',role:'relates to'},
  {source:'DP-401',target:'DP-103',role:'implements'}
 ],
 documents:[
  {id:'DOC-001',title:'제품 요구사항 명세서',space:'Specification',status:'In Review',sections:[
   {id:'sec-1',heading:'1. 개요',body:'본 문서는 학습용 Drive Pilot 프로젝트의 요구사항을 정리합니다.'},
   {id:'sec-2',heading:'2. 배터리 요구사항',body:'연결된 Work Item에서 상세 속성과 상태를 확인할 수 있습니다.',workItemId:'DP-101'},
   {id:'sec-3',heading:'3. 안전 요구사항',body:'검증 케이스가 연결되어 있는지 추적성 화면에서 확인하세요.',workItemId:'DP-102'},
   {id:'sec-4',heading:'4. 사용자 표시',body:'상태 표시 화면의 핵심 동작을 정의합니다.',workItemId:'DP-103'}]},
  {id:'DOC-002',title:'테스트 계획 및 검증 기준',space:'Testing',status:'Draft',sections:[
   {id:'sec-1',heading:'1. 테스트 범위',body:'요구사항과 Test Case 사이의 링크를 검토합니다.'},
   {id:'sec-2',heading:'2. 주행거리 검증',body:'Test Run에서 실행 결과를 기록할 수 있습니다.',workItemId:'DP-201'},
   {id:'sec-3',heading:'3. 충전 안전 검증',body:'관련 테스트 케이스의 검증 상태를 추적합니다.',workItemId:'DP-202'}]}
 ],
 plans:[
  {id:'PLAN-01',title:'Release 1.0',start:'2026-11-01',end:'2026-12-18',status:'In Progress',workItemIds:['DP-101','DP-102','DP-103','DP-201','DP-202','DP-301','DP-401']},
  {id:'PLAN-02',title:'Safety Review Sprint',start:'2026-11-15',end:'2026-12-02',status:'Not Started',workItemIds:['DP-102','DP-202','DP-501']}
 ],
 testRuns:[
  {id:'TR-001',title:'배터리 기능 검증',template:'Manual Test',date:sampleDate,cases:{'DP-201':'Passed','DP-202':'Not Run'}},
  {id:'TR-002',title:'UI 회귀 시험',template:'Manual Test',date:sampleDate,cases:{'DP-203':'Not Run'}}
 ],
 history:['학습용 예제 프로젝트를 준비했습니다.']
})
export type PolarionSection='home'|'work-items'|'documents'|'plans'|'test-runs'|'traceability'|'guide'
export const polarionScenarios=[
 {id:'failure',title:'시험 실패 → 결함 연결 → 추적',steps:[
  {section:'test-runs' as PolarionSection,title:'Test Run 선택',description:'배터리 기능 검증 Test Run을 선택하세요.',event:'select-run'},
  {section:'test-runs' as PolarionSection,title:'실패 결과 기록',description:'Test Case의 결과를 Failed로 변경하세요.',event:'record-failure'},
  {section:'test-runs' as PolarionSection,title:'결함 생성',description:'선택한 실패 항목의 Create linked Defect를 눌러 결함을 만드세요.',event:'create-defect'},
  {section:'work-items' as PolarionSection,title:'결함과 링크 확인',description:'새로 생성된 Defect를 목록에서 선택해 연결된 Test Case를 확인하세요.',event:'select-item'}
 ]},

 {id:'review',title:'Work Item 검토 → 승인 → 이력 확인',steps:[
  {section:'work-items' as PolarionSection,title:'검토할 항목 선택',description:'요구사항을 선택하고 목록 아래 Work Item Editor를 확인하세요.',event:'select-item'},
  {section:'work-items' as PolarionSection,title:'검토 요청',description:'Request Review 버튼으로 검토 상태를 만드세요.',event:'submit-item-review'},
  {section:'work-items' as PolarionSection,title:'승인 처리',description:'Approve 버튼을 눌러 검토 결과를 기록하세요.',event:'approve-item'},
  {section:'work-items' as PolarionSection,title:'처리 이력 확인',description:'Review · History · Attachments 탭에서 검토 이력을 확인하세요.',event:'show-activity'}
 ]},

 {id:'req',title:'요구사항 작성 → 테스트 연결',steps:[
  {section:'work-items' as PolarionSection,title:'Work Item 생성',description:'Create 버튼을 눌러 Requirement 유형의 새 Work Item을 생성하세요.',event:'create-item'},
  {section:'work-items' as PolarionSection,title:'요구사항 확인',description:'방금 생성한 항목을 선택해 제목·상태·설명을 확인하세요.',event:'select-item'},
  {section:'work-items' as PolarionSection,title:'테스트 케이스 연결',description:'Links에서 기존 Test Case와 연결 관계를 등록하세요.',event:'create-link'},
  {section:'traceability' as PolarionSection,title:'추적 관계 보기',description:'Traceability 화면에서 새 링크와 관계를 확인하세요.',event:'show-trace'}
 ]},
 {id:'doc',title:'LiveDoc → Work Item 통합',steps:[
  {section:'documents' as PolarionSection,title:'문서 열기',description:'제품 요구사항 명세서 문서를 선택하세요.',event:'select-doc'},
  {section:'documents' as PolarionSection,title:'문서 내용 편집',description:'본문의 섹션을 선택하고 내용을 변경해 저장하세요.',event:'edit-doc'},
  {section:'documents' as PolarionSection,title:'Work Item 삽입',description:'Add Work Item 버튼으로 항목을 문서에 추가하세요.',event:'add-doc-item'}
 ]},
 {id:'test',title:'Test Run 실행 결과 등록',steps:[
  {section:'test-runs' as PolarionSection,title:'Test Run 선택',description:'배터리 기능 검증 Test Run을 선택하세요.',event:'select-run'},
  {section:'test-runs' as PolarionSection,title:'시험 결과 등록',description:'Not Run 항목을 Pass/Fail/Blocked 중 하나로 변경하세요.',event:'record-test'},
  {section:'test-runs' as PolarionSection,title:'시험 현황 확인',description:'진행률과 테스트 결과 요약을 확인하세요.',event:'view-test'}
 ]}
]
export const polarionTerms=[
 ['Work Item','요구사항, 테스트 케이스, 결함, 작업, 변경 요청처럼 프로젝트에서 추적하는 업무 객체입니다.'],
 ['Requirement','개발 대상이 충족해야 하는 조건이나 요구를 나타내는 Work Item 유형입니다.'],
 ['Test Case','요구사항을 검증하는 절차와 기대 결과를 기록하는 Work Item 유형입니다.'],
 ['LiveDoc','문서 본문과 Work Item을 함께 편집·관리하는 Polarion 문서 기능입니다.'],
 ['Traceability','요구사항과 시험·작업 사이의 링크를 통해 영향을 추적하는 기능입니다.'],
 ['Test Run','여러 Test Case를 실행해 실제 수행 결과를 기록하는 단위입니다.'],
 ['Plan','일정과 범위, Work Item을 묶어 릴리스나 이터레이션의 진행 상태를 파악하는 기능입니다.'],
 ['Project','업무, 문서, 시험, 계획 등이 하나의 범위 안에서 관리되는 단위입니다.'],
 ['Baseline','특정 시점의 상태를 비교·검토하는 데 사용하는 프로젝트 기준선입니다.'],
 ['Work Item Link','두 Work Item 사이의 관계를 연결하고 역할과 방향을 표현합니다.']
] as const
export const polarionSource={title:'Administrator and User Help · Polarion 2606',url:'https://drive.google.com/file/d/11cutLihinJ7k7U6stxMniV6KKs3ObRTP/view?usp=drive_link'}
