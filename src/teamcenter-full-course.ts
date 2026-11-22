import type {Section} from './teamcenter-demo-data'
import type {TrainingLesson} from './TrainingCurriculum'

type Step=TrainingLesson<Section>
const row=(id:string,chapter:string,title:string,section:Section,event:string,description:string,hint:string):Step=>({id,chapter,title,section,event,description,hint})
export const teamcenterCourse:Step[]=[
 row('tc-01','Active Workspace · 시작과 컨텍스트','홈 대시보드 확인','home','open-home','작업·최근 객체·변경 정보와 보고서 위젯을 확인합니다.','상단 Teamcenter 로고 또는 왼쪽 Home 클릭'),
 row('tc-02','Active Workspace · 시작과 컨텍스트','Launcher 도구 탐색','home','open-launcher','Launcher에서 사용할 애플리케이션 목록을 살펴봅니다.','왼쪽 Launcher 또는 홈 Actions 도구 클릭'),
 row('tc-03','Active Workspace · 시작과 컨텍스트','사용자 세션 설정 열기','home','open-profile','Group, Role, Revision Rule 조합을 확인합니다.','오른쪽 상단 사용자 아이콘 클릭'),
 row('tc-04','Active Workspace · 시작과 컨텍스트','Group 변경','home','change-group','조직별 세션 그룹을 전환해 봅니다.','사용자 설정에서 Group을 Manufacturing 등으로 변경'),
 row('tc-05','Active Workspace · 시작과 컨텍스트','Role 변경','home','change-role','Designer·Reviewer 등의 역할 컨텍스트를 선택합니다.','Role 선택창에서 다른 역할 선택'),
 row('tc-06','Active Workspace · 시작과 컨텍스트','Revision Rule 변경','home','change-rule','Latest Working/Released의 표시 개념을 연습합니다.','Revision Rule에서 다른 규칙 선택'),
 row('tc-07','Active Workspace · 시작과 컨텍스트','받은 작업 알림 확인','home','open-notifications','대기 중인 승인 알림을 확인합니다.','상단 알림(종 모양) 아이콘 클릭'),

 row('tc-08','검색 · 탐색 · 속성','전역 검색','search','search','제품이나 부품 이름으로 검색합니다.','Search 입력창에 배터리 또는 DEMO 입력'),
 row('tc-09','검색 · 탐색 · 속성','검색 유형 필터','search','filter-kind','Item과 Document 유형을 구분합니다.','Object Type에서 Item 또는 Document 클릭'),
 row('tc-10','검색 · 탐색 · 속성','검색 상태 필터','search','filter-status','검토 중·승인됨 등 상태를 선택합니다.','Release Status에서 상태 하나 선택'),
 row('tc-11','검색 · 탐색 · 속성','필터 초기화','search','clear-filters','검색 조건을 초기화합니다.','Filters의 Clear 또는 검색어 지우기 클릭'),
 row('tc-12','검색 · 탐색 · 속성','검색 결과 선택','search','select-record','선택한 객체의 ID·Revision·Owner를 확인합니다.','검색 결과에서 부품 행 선택'),
 row('tc-13','검색 · 탐색 · 속성','선택 객체 열기','search','open-record','검색 결과의 해당 객체를 Explorer/BOM/Document로 엽니다.','오른쪽 패널의 Open 클릭'),
 row('tc-14','검색 · 탐색 · 속성','Explorer 폴더 탐색','explorer','select-folder','폴더를 바꿔 Item과 Document를 탐색합니다.','Explorer 폴더 트리에서 다른 폴더 클릭'),
 row('tc-15','검색 · 탐색 · 속성','새 Item 생성','explorer','create-record','Item 객체를 만들고 탐색기에 저장합니다.','Explorer 폴더 선택 → More Commands → New → Add → Type: Item → Name → Add'),
 row('tc-16','검색 · 탐색 · 속성','객체 속성 저장','explorer','save-record','이름·소유자·설명을 편집합니다.','선택 Item 오른쪽 Edit → 필드 수정 → Save Edits'),
 row('tc-17','검색 · 탐색 · 속성','Item Revision 생성','explorer','new-revision','새 개정판으로 변경 이력을 추적합니다.','오른쪽 Revise 버튼 클릭'),
 row('tc-18','검색 · 탐색 · 속성','Document 객체 생성','explorer','create-document','제품 문서를 객체로 등록합니다.','Explorer → New / Add → Type: Document → Name → Add (오른쪽 패널)'),
 row('tc-19','검색 · 탐색 · 속성','객체 변경 이력 확인','explorer','open-object-history','속성 변경과 개정 기록을 확인합니다.','객체 속성 패널의 객체 처리 이력 펼치기'),

 row('tc-20','BOM · 구조 관리','상위 어셈블리 펼치기','structure','expand','제품 조립 구조의 상하 관계를 확인합니다.','BOM 화살표 클릭해 하위 부품 펼치기'),
 row('tc-21','BOM · 구조 관리','부품 행 선택','structure','select-row','Occurrence 선택과 속성 확인을 체험합니다.','BOM에서 하위 부품 행 선택'),
 row('tc-22','BOM · 구조 관리','BOM 수량 변경','structure','quantity','하위 부품의 사용 수량을 조정합니다.','선택한 하위 부품 수량의 + 또는 - 클릭'),
 row('tc-23','BOM · 구조 관리','Where Used 확인','structure','where-used','선택 부품의 상위 사용 위치를 확인합니다.','어디에 사용되나? 버튼 클릭'),
 row('tc-24','BOM · 구조 관리','구성품 추가','structure','add-bom','새로 만든 Item을 최상위 어셈블리에 연결합니다.','구성품 추가 → 부품 선택 → 상위 구조에 연결'),
 row('tc-25','BOM · 구조 관리','BOM 변경 비교','structure','compare-bom','초기 구조 대비 수량·구성 변화 확인을 연습합니다.','변경 비교 버튼 클릭'),
 row('tc-26','BOM · 구조 관리','Details 탭 조회','structure','workmode-details','선택 Item Revision의 상세 속성을 확인합니다.','상단 Details 탭 클릭'),
 row('tc-27','BOM · 구조 관리','Relations 탭 조회','structure','workmode-relations','현재 객체가 연결된 다른 객체를 봅니다.','Relations 탭 클릭'),
 row('tc-28','BOM · 구조 관리','Activity 이력 조회','structure','workmode-activity','객체 및 구조의 처리 이력을 살펴봅니다.','Activity 탭 클릭'),

 row('tc-29','Documents · Dataset','문서 선택','documents','select-document','Document Revision과 연결된 Dataset을 조회합니다.','Document Management에서 문서 행 선택'),
 row('tc-30','Documents · Dataset','Dataset 파일명 연결','documents','attach-file','Document에 파일 데이터셋 이름을 등록합니다.','새 데이터셋 파일명 입력 → 연결'),
 row('tc-31','Documents · Dataset','Dataset 연결 해제','documents','remove-file','문서에서 데이터셋 이름 연결을 제거합니다.','연결한 파일 오른쪽 X 클릭'),
 row('tc-32','Documents · Dataset','문서 검토 워크플로 선택','documents','open-workflow','Submit to Workflow 대화상자를 열어 프로세스와 참가자를 지정합니다.','Submit to Workflow 버튼 클릭'),
 row('tc-33','Documents · Dataset','검토 템플릿 변경','documents','change-workflow-template','워크플로 프로세스를 Review/Release 중 선택합니다.','Process Template에서 다른 템플릿 선택'),
 row('tc-34','Documents · Dataset','검토 참가자 변경','documents','change-workflow-reviewer','시뮬레이터의 검토 담당자를 지정합니다.','Review Participant에서 다른 참가자 선택'),
 row('tc-35','Documents · Dataset','워크플로 제출','documents','submit-review','검토를 요청하고 My Tasks에 작업을 생성합니다.','Submit 버튼 클릭'),

 row('tc-36','My Tasks · 승인','검토 작업함 열기','inbox','open-inbox','대기 중인 작업 목록을 엽니다.','왼쪽 My Tasks 또는 받은 작업 클릭'),
 row('tc-37','My Tasks · 승인','작업 선택','inbox','select-task','검토 대상과 우선순위를 확인합니다.','새로 만들어진 검토 작업 선택'),
 row('tc-38','My Tasks · 승인','검토 의견 작성','inbox','comment-task','검토 내용과 처리 의견을 작성합니다.','검토 의견 칸에 입력'),
 row('tc-39','My Tasks · 승인','승인 처리','inbox','approve-task','검토 결과를 승인으로 기록하고 문서 상태를 전환합니다.','승인 버튼 클릭'),
 row('tc-40','My Tasks · 승인','다른 작업 반려','inbox','reject-task','반려 처리 시 객체 상태를 작업 중으로 되돌립니다.','대기 중인 다른 작업 선택 → 반려 클릭'),

 row('tc-41','Change Management · 변경통지','새 Change Notice 생성','changes','create-change','변경 사유를 가진 Change Notice를 만듭니다.','Create Change → 오른쪽 패널의 Synopsis/Description 입력 → Create'),
 row('tc-42','Change Management · 변경통지','변경 통지 선택','changes','select-change','Change Notice의 상태와 영향 객체 목록을 확인합니다.','왼쪽 Change Notice 선택'),
 row('tc-43','Change Management · 변경통지','영향 부품 추가','changes','add-affected','변경에 영향을 받는 Item을 연결합니다.','Affected Items에서 항목 선택 → 추가'),
 row('tc-44','Change Management · 변경통지','영향 부품 제거','changes','remove-affected','잘못 연결된 영향 객체를 제거합니다.','영향 항목의 X 클릭'),
 row('tc-45','Change Management · 변경통지','변경 검토 요청','changes','review-change','초안 변경 통지를 검토 중으로 전환합니다.','검토 요청 버튼 클릭'),
 row('tc-46','Change Management · 변경통지','변경 완료 처리','changes','complete-change','변경 상태를 완료로 전환하고 기록합니다.','변경 완료 처리 클릭'),

 row('tc-47','Visualization · 제품 표시','시각화 부품 선택','viewer','viewer-part','3D 개념 도해의 구성품과 속성을 연결해 봅니다.','도해 부품 또는 오른쪽 부품 목록 선택'),
 row('tc-48','Visualization · 제품 표시','분해도 전환','viewer','viewer-explode','조립 구조를 분해도 형태로 확인합니다.','분해도 보기 버튼 클릭'),
 row('tc-49','Visualization · 제품 표시','모델 회전','viewer','viewer-rotate','개념 모델의 회전 각도를 조절합니다.','회전 슬라이더를 이동'),
 row('tc-50','Visualization · 제품 표시','뷰어 초기화','viewer','viewer-reset','회전과 분해 표시를 초기 상태로 되돌립니다.','뷰어 초기화 클릭'),
 row('tc-51','실무 확인 · 기록','세션 이력 확인','guide','open-guide','용어와 원문 출처를 확인합니다.','사용 가이드에서 핵심 용어와 자료 확인'),
 row('tc-52','실무 확인 · 기록','대시보드로 복귀','home','open-home','데모 작업과 현재 상태를 홈 위젯에서 최종 확인합니다.','Teamcenter 로고 또는 Home 클릭')
]
