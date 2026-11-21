export type Section = 'home' | 'search' | 'explorer' | 'structure' | 'documents' | 'changes' | 'inbox' | 'viewer' | 'guide'
export type DemoStatus = '작업 중' | '검토 중' | '승인됨'
export type DemoKind = 'Item' | 'Document'
export interface DemoRecord {
  id: string; name: string; kind: DemoKind; revision: string; status: DemoStatus;
  owner: string; description: string; folder: string; modified: string
}
export interface BomRow { key: string; parent: string | null; recordId: string; qty: number }
export interface DemoTask {
  id: string; title: string; target: string; assignee: string; status: '대기' | '승인' | '반려';
  comment: string; priority: '높음' | '보통'
}
export interface DemoChange {
  id: string; title: string; status: '초안' | '검토 중' | '완료';
  reason: string; affected: string[]; owner: string
}
export interface DemoData {
  records: DemoRecord[]; bom: BomRow[]; tasks: DemoTask[];
  changes: DemoChange[]; files: Record<string, string[]>; history: string[]
}
export const DATE = '2026-11-21'
export const createDemoData = ():DemoData => ({
  records: [
    {id:'DEMO-1000',name:'전동 스쿠터 — 제품 어셈블리',kind:'Item',revision:'B',status:'작업 중',owner:'김설계',description:'예제 제품의 최상위 조립품입니다. 하위 부품과 수량을 구성합니다.',folder:'제품 개발',modified:DATE},
    {id:'DEMO-1100',name:'배터리 팩 어셈블리',kind:'Item',revision:'B',status:'검토 중',owner:'김설계',description:'셀 모듈과 보호 장치로 구성되는 배터리 조립품 예제입니다.',folder:'전장 설계',modified:DATE},
    {id:'DEMO-1110',name:'배터리 셀 모듈',kind:'Item',revision:'A',status:'작업 중',owner:'이연구',description:'배터리 팩에 투입되는 셀 모듈입니다.',folder:'전장 설계',modified:DATE},
    {id:'DEMO-1200',name:'구동 모터',kind:'Item',revision:'C',status:'승인됨',owner:'박개발',description:'예제 제품의 구동계 부품입니다.',folder:'기구 설계',modified:DATE},
    {id:'DEMO-1300',name:'전력 제어기',kind:'Item',revision:'A',status:'작업 중',owner:'이연구',description:'전동 스쿠터 예제에서 전원을 제어하는 부품입니다.',folder:'전장 설계',modified:DATE},
    {id:'DEMO-1400',name:'차체 프레임',kind:'Item',revision:'B',status:'승인됨',owner:'박개발',description:'구동계와 조향부를 지지하는 조립 구조입니다.',folder:'기구 설계',modified:DATE},
    {id:'DEMO-1500',name:'휠 어셈블리',kind:'Item',revision:'A',status:'승인됨',owner:'박개발',description:'앞바퀴와 뒷바퀴의 공통 예제 부품입니다.',folder:'기구 설계',modified:DATE},
    {id:'DEMO-1600',name:'핸들바',kind:'Item',revision:'A',status:'작업 중',owner:'김설계',description:'사용자가 방향을 조작하는 조향 부품입니다.',folder:'기구 설계',modified:DATE},
    {id:'DEMO-1700',name:'브레이크 어셈블리',kind:'Item',revision:'A',status:'검토 중',owner:'이연구',description:'제동 성능을 확인하는 예제 부품입니다.',folder:'기구 설계',modified:DATE},
    {id:'DEMO-D201',name:'제품 요구사항 명세서',kind:'Document',revision:'A',status:'승인됨',owner:'김설계',description:'제품의 요구사항을 기록하는 문서 예제입니다.',folder:'제품 문서',modified:DATE},
    {id:'DEMO-D202',name:'배터리 설계 검토서',kind:'Document',revision:'B',status:'작업 중',owner:'이연구',description:'배터리 설계 검토 항목과 결과를 기록합니다.',folder:'제품 문서',modified:DATE},
    {id:'DEMO-D203',name:'조립 공정 설명서',kind:'Document',revision:'A',status:'검토 중',owner:'박개발',description:'조립 순서와 검사 위치를 설명합니다.',folder:'제품 문서',modified:DATE}
  ],
  bom:[
    {key:'occ-0',parent:null,recordId:'DEMO-1000',qty:1},
    {key:'occ-1',parent:'occ-0',recordId:'DEMO-1100',qty:1},
    {key:'occ-2',parent:'occ-1',recordId:'DEMO-1110',qty:4},
    {key:'occ-3',parent:'occ-0',recordId:'DEMO-1200',qty:1},
    {key:'occ-4',parent:'occ-0',recordId:'DEMO-1300',qty:1},
    {key:'occ-5',parent:'occ-0',recordId:'DEMO-1400',qty:1},
    {key:'occ-6',parent:'occ-0',recordId:'DEMO-1500',qty:2},
    {key:'occ-7',parent:'occ-0',recordId:'DEMO-1600',qty:1},
    {key:'occ-8',parent:'occ-0',recordId:'DEMO-1700',qty:2}
  ],
  tasks: [
    {id:'TASK-001',title:'배터리 팩 설계 검토',target:'DEMO-1100',assignee:'나 (검토자)',status:'대기',comment:'',priority:'높음'},
    {id:'TASK-002',title:'조립 공정 설명서 승인',target:'DEMO-D203',assignee:'나 (검토자)',status:'대기',comment:'',priority:'보통'},
    {id:'TASK-003',title:'구동 모터 시험 결과 확인',target:'DEMO-1200',assignee:'나 (검토자)',status:'승인',comment:'검토 완료',priority:'보통'}
  ],
  changes:[{id:'CN-2026-014',title:'배터리 팩 열관리 개선',status:'초안',reason:'배터리 설계 변경에 따른 제품 구조 영향 검토',affected:['DEMO-1100','DEMO-1110'],owner:'김설계'}],
  files:{'DEMO-D201':['requirements_overview.pdf'],'DEMO-D202':['battery_design_review.pdf'],'DEMO-D203':['assembly_process.pdf']},
  history:['학습용 데이터 세트가 준비되었습니다.']
})
export interface DemoTourStep { section: Section; title: string; description: string; hint: string }
export interface DemoTour { id:string; title:string; subtitle:string; steps:DemoTourStep[] }
export const tours:DemoTour[] = [
  {id:'find',title:'01 · 부품을 검색하고 수정하기',subtitle:'검색 → 상세 정보 → 리비전',steps:[
    {section:'search',title:'부품 검색',description:'전역 검색 화면에서 “배터리”를 입력해 검색 결과를 확인하세요.',hint:'상단 검색창에 배터리 입력'},
    {section:'search',title:'검색 결과 선택',description:'검색 결과에서 배터리 팩 어셈블리를 선택하세요.',hint:'DEMO-1100 선택'},
    {section:'search',title:'속성 편집',description:'오른쪽 상세 패널에서 “속성 편집”을 눌러 설명을 바꾸고 저장하세요.',hint:'속성 편집 → 저장'},
    {section:'search',title:'리비전 이해',description:'“새 리비전”을 눌러 부품의 개정 번호가 바뀌는 과정을 확인하세요.',hint:'새 리비전 버튼'}
  ]},
  {id:'bom',title:'02 · 제품 구조(BOM) 구성하기',subtitle:'어셈블리 → 하위 부품 → 수량',steps:[
    {section:'structure',title:'구조 펼치기',description:'제품의 왼쪽 펼치기 아이콘을 눌러 배터리 팩과 하위 셀 모듈을 확인하세요.',hint:'구조에서 배터리 팩 펼치기'},
    {section:'structure',title:'부품 선택',description:'배터리 셀 모듈 행을 선택해 우측에 속성을 확인하세요.',hint:'DEMO-1110 선택'},
    {section:'structure',title:'수량 변경',description:'해당 하위 부품의 수량을 변경해 BOM에 적용해 보세요.',hint:'수량 - / + 버튼'},
    {section:'structure',title:'사용 위치 확인',description:'“어디에 사용되나?” 버튼으로 선택한 부품의 상위 조립품을 확인하세요.',hint:'사용 위치 확인'}
  ]},
  {id:'document',title:'03 · 문서 등록과 검토 요청',subtitle:'문서 → 첨부 파일 → 워크플로',steps:[
    {section:'documents',title:'문서 선택',description:'배터리 설계 검토서를 열고 문서 정보와 첨부 파일을 확인하세요.',hint:'DEMO-D202 선택'},
    {section:'documents',title:'파일 연결',description:'샘플 파일명을 입력해 첨부 데이터셋을 만들어 보세요.',hint:'파일명 입력 → 연결'},
    {section:'documents',title:'검토 워크플로 시작',description:'“검토 요청” 버튼으로 승인 작업을 생성하세요.',hint:'검토 요청 클릭'},
    {section:'inbox',title:'받은 작업 보기',description:'받은 작업에서 방금 생성한 검토 요청을 찾아 보세요.',hint:'받은 작업 → 최신 항목'}
  ]},
  {id:'approval',title:'04 · 검토 작업 처리하기',subtitle:'받은 작업 → 의견 → 승인/반려',steps:[
    {section:'inbox',title:'검토 작업 선택',description:'배터리 팩 설계 검토 작업을 선택하세요.',hint:'TASK-001 선택'},
    {section:'inbox',title:'의견 작성',description:'결재 의견 입력란에 검토 의견을 입력하세요.',hint:'검토 의견 입력'},
    {section:'inbox',title:'처리 결과 확인',description:'승인 또는 반려를 눌러 상태 변화가 기록되는지 확인하세요.',hint:'승인 / 반려'},
    {section:'home',title:'대시보드 확인',description:'홈 화면에서 남아 있는 작업과 최근 활동이 변경되었는지 확인하세요.',hint:'홈으로 돌아가기'}
  ]},
  {id:'change',title:'05 · 변경 관리 체험',subtitle:'변경 통지 → 영향 항목 → 검토',steps:[
    {section:'changes',title:'변경 통지 선택',description:'배터리 팩 열관리 개선 변경 통지를 열어 보세요.',hint:'CN-2026-014 선택'},
    {section:'changes',title:'영향 부품 추가',description:'이 변경에 영향을 받는 부품을 하나 더 연결하세요.',hint:'영향 항목 추가'},
    {section:'changes',title:'검토 요청',description:'변경 통지를 검토 중 상태로 전환해 보세요.',hint:'검토 요청 클릭'},
    {section:'changes',title:'상태 확인',description:'변경 통지가 검토 중으로 표시되는지 확인하세요.',hint:'상태 확인'}
  ]}
]
export const sources = [
  {title:'Active Workspace Fundamentals',topic:'홈·검색·탐색·속성·리비전',url:'https://drive.google.com/file/d/1gq5IbBq5xMVLMVvq0rbE95psPBrzQk5p/view'},
  {title:'Structure Management on Active Workspace – Usage',topic:'제품 구조·수량·사용 위치',url:'https://drive.google.com/file/d/1eeaZYTKb0eKGyzpx50oABhKZ3X2qySVU/view'},
  {title:'Document Management on Active Workspace – Usage',topic:'문서·첨부 데이터셋',url:'https://drive.google.com/file/d/11NO052aP0wUXS1JE18RlPKseTgyr19a2/view'},
  {title:'Workflows and Tasks on Active Workspace',topic:'작업함·검토·승인',url:'https://drive.google.com/file/d/1BflZ5c0dHvtwJ8dDJ_JJiY9e6cYPGoH6/view'},
  {title:'Change Management on Active Workspace – Usage',topic:'변경 통지·영향 항목',url:'https://drive.google.com/file/d/1zuqvKA1FSeCRFucI3go5NRUzAx9e1wER/view'},
  {title:'Product Data Visualization on Active Workspace',topic:'제품 모델 표시',url:'https://drive.google.com/file/d/1dkVWT15pw-05KjeaSudaCsJX2m5_q4fO/view'}
]
export const glossary = [
  {name:'PLM',meaning:'제품의 기획부터 설계·생산·유지보수에 이르는 정보를 연결해 관리하는 방식입니다.'},
  {name:'Active Workspace',meaning:'Teamcenter 기능을 웹 화면에서 이용하는 사용자 인터페이스입니다.'},
  {name:'Item',meaning:'부품이나 제품처럼 식별해서 관리하는 대상입니다. 실제 시스템에서는 조직의 데이터 모델에 따라 의미가 달라질 수 있습니다.'},
  {name:'Revision',meaning:'같은 대상을 변경한 버전입니다. 예: A → B → C. 기존 버전과 구분해 변경을 추적합니다.'},
  {name:'BOM',meaning:'제품을 구성하는 하위 부품과 수량을 계층적으로 나타낸 목록입니다.'},
  {name:'Occurrence',meaning:'특정 조립 구조에서 부품이 사용되는 위치나 사용 관계입니다. 동일 부품도 여러 위치에 나타날 수 있습니다.'},
  {name:'Dataset',meaning:'문서나 CAD 파일 같은 실제 파일 콘텐츠를 관리 대상 리비전에 연결할 때 사용하는 데이터 객체입니다.'},
  {name:'Workflow',meaning:'작성·검토·승인 같은 작업을 순서와 담당자에 따라 처리하는 업무 흐름입니다.'},
  {name:'Change Notice',meaning:'여러 제품 데이터의 변경 이유·대상·처리 과정을 묶어 추적하는 변경 관리 객체입니다.'},
  {name:'Where Used',meaning:'선택한 부품이 어떤 상위 조립품에서 사용되는지 찾아보는 기능입니다.'}
]
