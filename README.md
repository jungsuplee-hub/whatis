# WHATIS · Visual Technology Encyclopedia

복잡한 기술을 시각적으로 설명하는 정적 기술 백과사전입니다.

## Features
- **MES 실습 연구실**: [ECU 제조 시뮬레이터](https://jungsuplee-hub.github.io/whatis/mes/)에서 1,000개 Serial, 작업오더, 공정 인터락, BOM/LOT, 설비 상태, 품질 및 재작업, Genealogy, WIP, 데이터 수집, 작업자 자격, 문서 Revision, KPI/OEE를 연동한 자체 교육 모델을 제공합니다. 원본은 `public/mes/index.html`, 루트 `mes/index.html`은 빌드 시 동기화합니다. 실제 Opcenter API나 생산 규격은 아닙니다.
- **원본 설명 보존 + 단계별 초보자 설명 (2026-11-21)**: 이전에 제공하던 기본·심화 기술 문장과 연결 정보 및 전체 단계 기본 펼침 동작을 보존했습니다. 상단에 따로 삽입했던 초보자 소개/생활 비유는 제거했습니다. 대신 각 단계의 기존 문장 아래에 **처음 배우는 사람을 위한 설명**을 덧붙였고, 전체 단계 목록에서도 기존 원문 뒤에 같은 설명을 표시합니다. 34개 기술 아키텍처의 204개 단계와 AI 36개·컴퓨터 구조 27개 개별 주제의 원래 275개 단계 모두 쉽게 풀어 쓴 추가 설명이 있습니다. 추가 원고는 src/systemsTopicBeginnerStageMore.ts에 저장했고 기존 단계 제목·원문은 수정하지 않았습니다. 320px/390px 모바일에서도 확인했으며 아키텍처 34개와 학습 페이지 63개 전수 UI 검사 통과했습니다.
- **초보자 친화적 용어 풀이 (2026-11-21)**: AI 12개·컴퓨터 구조 10개·Teamcenter 6개·Polarion 6개 아키텍처 전체에 손으로 작성한 쉬운 설명 204개, 생활 속 비유 34개, 기술 용어 풀이를 추가했습니다. 기술 원리와 전문 용어는 삭제하지 않고 쉬운 설명 아래에 그대로 유지하며, 모든 단계 상세 설명을 기본 펼침 상태로 둡니다. AI 36개·컴퓨터 구조 27개 개별 학습 페이지에도 주제별 초보자 안내 문장을 추가했고 AI Agent/RAG/MCP/LLM/CPU 관련 주요 주제의 단계 문구도 보완했습니다. 새 데이터: src/systemsFlowBeginner.ts 및 src/systemsTopicBeginner.ts. 사실 관계를 넘어 임의로 설치 포트나 필수 서비스를 단정하지 않습니다.
- **시스템 아키텍처 단계 해설 심화 (2026-11-21)**: AI 12개, 컴퓨터 구조 10개, Teamcenter 6개, Polarion 6개 등 총 34개 구조도에 고유 기술 개요·실제 시나리오와 각 단계별 상세 설명 204개를 추가했습니다. 아키텍처 보드의 하단에서 현재 단계가 하는 일, 연결된 이전·다음 구성요소, 기술 배경, 시나리오, 전체 단계별 심화 해설을 기본 표시합니다. 일반 AI 36개 및 컴퓨터 구조 27개 주제에도 기존 주제 설명·비유·핵심 원리·유의사항을 재사용해 학습 내용을 확장했습니다. 공통 컴포넌트는 src/SystemsFlowAtlas.tsx, 34개 별도 원고는 src/systemsFlowGuides.ts에 있으며, 선택형 Siemens 기능·포트·물리 장비 수는 확정 사실로 제시하지 않습니다. 웹 화면에 참고 문서 배너를 추가하지 않습니다.
- **모바일 시각 흐름 연결선 보정 (2026-11-21)**: AI Agent 단계를 실제 순차·반복 처리와 맞게 재배치하고, Agentic RAG 등 분기형 흐름의 화살표를 독립된 출발/도착 포트와 우회 경로로 정리했습니다. SVG 화살촉은 화면 배율에 따라 과하게 커지지 않도록 고정 픽셀 단위로 조정했으며, 반복 연결은 점선으로 구분합니다. 760px 이하 화면에서 상세 보드 840px, 미리보기 보드 760px을 유지하고 내부 가로 스크롤과 안내 문구를 제공합니다. PC 및 390/320px 모바일에서 가로 페이지 넘침, 연결선 교차, 단계 선택, 팝업, 자동재생을 검증했습니다.
- **Interactive System Flow Atlas (2026-11)**: 34개의 고유 아키텍처 흐름 도식(일반 AI 12, 컴퓨터 구조 10, Teamcenter 6, Polarion 6)을 추가했습니다. cards에서 연결선을 따라 움직이는 데이터 표시를 보고 카드 클릭 시 PC 사이드 패널/모바일 바텀 시트에서 재생·일시정지·단계 선택·전체 해설을 확인할 수 있습니다. 일반 AI 36개 주제와 컴퓨터 구조 27개 주제의 상세 화면에도 원래 단계 설명에서 만들어진 별도 논리 흐름을 넣었습니다. 기존 Teamcenter/Polarion 토폴로지에서는 현재 선택한 통신 경로에 데이터 이동 마커를 추가했습니다. src/systemsFlowData.ts(34개 개념 흐름), src/SystemsFlowAtlas.tsx(공통 그래프·상세 패널), src/systems-flow-atlas.css에서 관리합니다. 컴퓨터 구조 및 Siemens는 lazy-loaded bundle로 분리하여 초기 로딩량을 줄입니다. 2606 제품 도식은 교육용 서비스 역할과 선택형 구성 설명이며 설치 네트워크/공식 필수 포트의 확정값이 아닙니다. UI에 출처·매뉴얼 페이지 배너를 노출하지 않습니다. 직접 진입 예: #general, #computer, #siemens/flows.
- **컴퓨터 구조 · 운영체제 시각 학습**: 상단 컴퓨터 구조 메뉴(#computer)를 추가했습니다. 첨부 PDF 『컴퓨터 구조 운영 체제』(268쪽)의 17–268쪽을 바탕으로 CPU/명령어, 병렬 처리, 메모리/캐시, OS/커널/프로세스, 가상 메모리/TLB/DMA, 디스크/RAID/NAS/SAN, 클러스터/HA/DR, 유틸리티·클라우드까지 8개 장·27개 이야기로 구성합니다. 장별 8개 고유 시각화와 주요 주제별 15개 전용 동작 도식, 단계 전환·자동 재생·일시정지·검색·원문 페이지 안내·320px 모바일 대응을 지원합니다. src/computerContent.ts, src/ComputerMotion.tsx, src/ComputerDetailDiagram.tsx, src/ComputerAtlas.tsx에서 관리하며 필요할 때만 별도 번들로 로드됩니다. 옛 자료의 고정 클록 주기·CPU 아키텍처·운영체제별 동작과 현대 시스템의 일반 원리를 혼동하지 않도록 한계를 명시했습니다. PDF 원본은 공개 저장소에 포함하지 않습니다.
- **비전공자를 위한 AI 이야기 36개**: 기존 30개에 AI 사실 오류, 그림 생성, 음성 받아쓰기, 검색과 AI의 차이, 개인정보, AI의 한계를 추가
- **채팅 시네마**: 질문 자동 입력 → 전송 → 문맥 구성 → 토큰 변환 → 모델 계산 → 선택적 도구 사용 → 답변이 글자별로 나타나는 과정 → 완료까지 끊김 없이 시각화. 예시 선택·임의 질문 입력·일시정지·단계 이동·다시 보기 및 관련 기술 바로가기 지원. 임의 질문은 실제 AI 응답을 생성하지 않고 공통 교육용 문구를 표시함.
- **답변 뒤의 기술 12개를 같은 채팅 화면에서**: 질문·문맥·토큰·관계 파악·학습된 가중치·다음 말 예측·도구·RAG·기억·안전장치·스트리밍·사실 확인을, 각각 다른 시각 예제와 선택식 쉬운 비유로 설명. 단계의 ‘이 기술 보기’와 완료 후 버튼은 페이지 이동 없이 같은 화면의 관련 항목을 선택합니다.
- **기술별 단계 애니메이션**: 일반 AI 상세 화면은 선택한 단계마다 내용과 움직임을 변경합니다. 환각·이미지 생성·음성·토큰 등 주요 주제는 고유 장면을 사용하며, 나머지도 해당 단계 데이터에 따라 장면이 전환됩니다.
- **질문과 이어지는 답변 흐름**: 현재 선택된 예시 질문과 미리 준비된 답변이 오른쪽 각 처리 장면에서도 함께 움직이도록 시뮬레이션을 연결했습니다.
- **모바일 최적화**: 작은 화면에서 채팅 과정·내부 장면을 가로 전체 폭으로 볼 수 있게 하고, MCP·AI Agent·RAG 등 기술명을 일반 설명보다 크고 분명하게 표시합니다.
- **눈으로 먼저 보기**: 따뜻한 미니멀 채팅창과 대비되는 내부 프로세스 패널, Pretendard Variable 기반의 타이포그래피와 에디토리얼 카드 레이아웃
- **클릭하면 설명 보기**: 기본 화면은 질문·애니메이션에 집중; 단계별 설명과 일상 비유·사용 사례·주의점·공식 출처는 상세에서 펼치기
- **비전공자 친화적인 콘텐츠**: src/lessonContent.ts가 36개 전체 주제의 쉬운 질문/설명/일상 비유/주의점을 관리하고, src/data.ts가 정확한 기술 정보·출처·단계별 구조를 관리
- **Siemens Solution Architect**: Teamcenter 2606 및 Polarion ALM 2606 중심의 공개 가능한 개념형 아키텍처 가이드. 논리/배포 영역 시각화, 선택형 구성요소 설명, 설계 검토 체크리스트, 양 제품 간 연계 검토 도식을 제공합니다. Opcenter는 Siemens 메뉴에서 MES 교육용 실습으로 연결됩니다.
- **Teamcenter 인프라 탐색**: Client / Web / Enterprise / Resource의 4계층과 FMS·캐시·볼륨·검색·연동·인증·운영을 클릭하는 독립형 인프라 구성도. 제품 정보 조회·CAD 파일 접근·외부 연계의 요청 경로를 선택할 수 있으며 HA/DR·보안·성능 설계 질문을 표시합니다. 공개 Siemens 설명과 Microsoft/AWS 참조 아키텍처를 참고한 교육용 도식이며, 설치 가이드 또는 확정 서버 수/지원 구성으로 주장하지 않습니다. 소스: src/TeamcenterInfrastructure.tsx.
- **Teamcenter 2606 심화 아키텍처**: 사용자가 작성한 2026년 3월 Google Drawing을 서비스 수준의 도식으로 재구성했습니다. src/TeamcenterDeepDive.tsx 에서 Client/Web/Enterprise/Resource 19개 서비스 노드, 16개 연결, 4개 업무 흐름, 포트 검색/근거 분류, 제품 Copilot·자체호스팅 사례·Microsoft 365 Copilot·별도 MCP 확장 흐름, 사전 색인/실시간 추론 구분, 운영 점검 항목을 제공합니다. AWS형 연결선은 `src/ServiceConnections.tsx`에서 16개 연결 데이터만 이용해 실제 노드 위치 사이에 SVG 화살표로 그리며, 해당 선을 클릭하면 연결 포트·근거 수준이 같은 화면에 표시됩니다. 흐름별 강조/전체 연결선 토글, 모바일 내부 가로 스크롤을 지원합니다. 기존 간단 4계층 설명도는 접어서 남겨두었습니다.
- **Teamcenter·Polarion 서비스 상세 가이드 및 AI Microservice Catalog**: 소스 src/architecture-service-guides.ts에 Teamcenter 2606 도식 19개 구성요소, Polarion 2606 도식 15개 구성요소의 개별 배치/처리 흐름/운영점검/주의사항을 정리하고, 기존 우측·모바일 하단 상세 패널에 연결했습니다. src/TeamcenterMicroserviceAtlas.tsx의 Microservices 탭은 AI 애플리케이션 4개, AI 처리 Microservices 4개, SO-341 Agent/MCP 예시 3개, 선택형 모델·검색·컨테이너 인프라 7개 등 총 18개 항목을 구별합니다. 표시된 18개 항목이 모두 설치된 Microservice라는 뜻은 아닙니다. 논리적 처리 흐름(질문/사전색인/Agent) 선택, 카테고리 필터, 검색, 항목별 설명 패널을 제공합니다. 참고 근거: Siemens Teamcenter Deployment Reference Architecture 2606 (April 2026), Teamcenter Rich Client 2606 가이드, Siemens Unrestricted Teamcenter AI Extension Microservices Configuration (2025), Polarion Deployment and Maintenance Guide 2606, 그리고 사용자가 정리한 2606 구축 지침. 내부 설치의 비밀값·호스트·사설 Endpoint 등은 공개하지 않습니다. 배경에는 블러 필터를 적용하지 않고 반투명 오버레이만 사용합니다.
- **인프라 구성도 즉시 상세 확인**: Teamcenter와 Polarion 인프라 토폴로지에서 서비스 노드 또는 연결선을 누르면 데스크톱에서는 오른쪽 슬라이드 패널, 모바일에서는 하단 시트를 열어 설명·포트·프로토콜·실환경 확인 사항·연결된 서비스 경로를 현재 화면에서 즉시 볼 수 있습니다. src/ArchitectureQuickView.tsx가 공통 UI를 제공하며 닫기·ESC·바깥 영역 클릭·관련 연결 이동·포트 매트릭스 전환을 지원합니다. 기존 아래쪽 중복 상세 영역은 제거했습니다. 구역 빠른 이동 버튼은 팝업을 열지 않고 도면 내 스크롤을 유지합니다.
- **Teamcenter 4-tier Atlas UI**: src/TeamcenterAtlas.tsx와 src/teamcenter-atlas.css로 기존 세로형 박스 목록을 인프라 영역별 서비스 아이콘·네트워크 경계·연결선 기반의 새 인터랙티브 구성도로 대체했습니다. Client/Web/Teamcenter Services/Data & Search 4개 영역, 19개 서비스와 검증 대상 16개 연결, 업무 흐름 강조, 경로별 포트 표시, 구역 빠른 이동, PC 너비 자동 맞춤/모바일 좌우 탐색을 지원합니다. src/ServiceConnections.tsx의 선택적 직각 경유지 기능으로 9개 Teamcenter 연결선이 서비스 카드 내부를 관통하지 않도록 했고, Polarion 구성도는 기존 경로를 유지합니다. 그림은 AWS 스타일의 시각적 표현을 차용한 독자적 학습 도식이지 AWS 배포 구성이나 Siemens 인증 설치도가 아닙니다.
- **Polarion 2606 토폴로지 시각 개선**: src/PolarionArchitecture.tsx에서 Coordinator와 ZooKeeper를 동일 Coordination 영역에 정렬하고, 이를 별도 물리 서버 두 대로 오해하지 않도록 표기를 보완했습니다. 웹 진입 구역은 LB/Apache만 표시하고, Node A/B의 PostgreSQL·Lucene 노드별 리소스 및 공통 SVN/Shared Services의 구역을 구분했습니다. 18개 연결에 명시적인 직각 경유 경로를 적용했으며 기본 화면에서는 핵심 8개 경로만 표시하고, 업무 흐름을 바꾸거나 모든 연결 18개 보기로 전체 경로를 표시할 수 있습니다. src/ServiceConnections.tsx의 직각 보정은 실제 렌더링된 카드 경계를 기준으로 연결 시작·끝을 처리합니다. PC 브라우저에서 18개 연결선의 비정상 대각 구간 0건·무관한 카드 관통 0건을 확인했으며, 390/320px 모바일 가로 탐색과 Teamcenter 16개 연결 및 상세 패널을 회귀 점검했습니다. 연결선은 실제 운영 망·방화벽 규칙이 아닌 개념적 서비스 의존성을 의미합니다.
- **Polarion 2606 상세 아키텍처**: src/PolarionArchitecture.tsx에 클러스터 배치 15개 구성요소, 18개 논리 연결선, Work Item·REST·검색·클러스터 조정 시나리오 및 포트 매트릭스를 구현했습니다. PC 화면 전체 맞춤, 모바일 내부 가로 스크롤과 구역 바로 이동, 구성요소/연결선 인스펙터를 지원합니다. Teamcenter/Polarion은 공통 src/ServiceConnections.tsx를 사용합니다. 공유된 Polarion Google Drawing은 메타데이터만 확인 가능하고 본문 열람은 403으로 실패하여, 사용자 도면과 1:1 대응이라고 주장하지 않습니다. Polarion 2606 제한 배포 가이드에서 확인되는 클러스터·AJP·ZooKeeper·SVN·DB/색인 원리만 재구성했으며 8889·2181·5433은 가이드 내 설정 예시로 표시했습니다.
- **포트 근거와 기밀 보호**: 도면 기입 예시(*) / 일반 표준 포트(†) / 환경 확인 필요를 분리했습니다. 공식 기본값으로 제시하지 않으며 불명확한 포트 숫자는 만들지 않습니다. GitHub Pages에는 사용자 도면의 사내 호스트명·주소 또는 재배포가 제한된 Siemens 내부 설치도/절차/파라미터를 옮기지 않았습니다. 특정 Copilot 자체호스팅 모델 및 AI 마이크로서비스 포트는 실제 설치 버전의 플랫폼 매트릭스·배포 자료로 확인해야 합니다.

- 정적 검색, 북마크(localStorage), 해시 URL 딥링크, 반응형·키보드 탐색, 움직임 줄이기 설정 지원
- 사이트 시뮬레이션은 실제 ChatGPT 서버를 호출하지 않으며, 공개된 일반 원리를 단순화한 교육용 콘텐츠

### 콘텐츠 편집 원칙
1. IT 용어로 시작하지 않고 독자의 질문으로 제목을 작성합니다.
2. 카드에는 시각화와 질문만 노출합니다. 기술 설명은 상세 단계/접힘 패널에서만 노출합니다.
3. 모든 분야는 공식 문서 원문 링크를 유지하고, 개념적 비유와 실제 제품 내부 동작을 혼동하지 않도록 표시합니다.
4. 사이트는 특정 모델의 비공개 내부 구현을 재현한다고 주장하지 않습니다.

## Local development
```sh
npm ci
npm run dev
npm run build
```

## GitHub Pages
- 배포 주소: https://jungsuplee-hub.github.io/whatis/
- 배포 방식: `main` 브랜치의 **/(root)** 정적 파일. GitHub Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/(root)`.
- `npm run build` 실행 시 Vite 빌드 결과인 `dist/`와 함께, Pages가 바로 실행할 수 있도록 저장소 루트의 `index.html`·`assets/`·`favicon.svg`를 동기화합니다.
- 배포할 때는 **`npm run build` 후 변경된 소스와 루트 배포 파일을 모두 커밋·푸시**합니다.
- `.github/workflows/pages.yml`은 푸시된 빌드 산출물이 원본 소스와 일치하는지 검사합니다.
- Vite base: `/whatis/`; 프런트엔드 원본 템플릿: `site/index.html`.
- 기술 상세 주소 예: `https://jungsuplee-hub.github.io/whatis/#general/rag`

## Content maintenance
`src/data.ts`의 `topics` 배열에 개념·단계·사례·출처를 추가하면 검색·목차·관련 글에 반영됩니다. 전문용어 대신 이해하기 쉬운 제목·비유는 `src/lessonContent.ts`에 추가합니다. 기술별 전용 애니메이션이 없는 항목은 복제 그림을 만들지 않고 실제 단계 데이터를 시각화합니다. 채팅 내부 12가지 기술은 `src/HiddenTechAtlas.tsx`에서 관리합니다.

*WHATIS는 공식 제품 설명서가 아닌 학습용 개념 해설입니다. 기술별 원문 링크를 함께 확인하세요.*

### Siemens 공개 가이드의 근거 및 공개 범위
- Google Drive에서 버전 표기가 있는 Teamcenter 2606 Deployment Reference Architecture와 Polarion 2606 Deployment and Maintenance Guide, 구성·연계 관련 자료를 확인했습니다.
- **자료 라이선스**: 해당 Siemens 원본에는 비공개·재배포 제한 문구가 있으므로, 공개 GitHub Pages에 원문·구성도·명령·비공개 포트·배포 파라미터를 올리지 않습니다.
- 사이트의 제품 소개와 버전은 공개 Siemens 릴리스 자료를 링크하며, 인프라/복구/보안 항목은 독자적으로 작성한 범용 솔루션 아키텍트 검토 질문입니다.
- 논리 구조와 배포 구역은 학습용 개념도입니다. Siemens 공식 지원 구성이나 검증된 HA/DR 토폴로지·사이징 값이 아닙니다.
- 실제 배포에는 권한이 있는 담당자가 최신 Siemens 지원 매트릭스·문서·계약 조건·현장 작업량을 확인하고 설계합니다.
- src/SiemensArchitect.tsx에서 공개 가능한 아키텍트 가이드 내용을 유지보수합니다. Opcenter의 실제 제품 아키텍처는 별도 검증 대상이며, 현재 MES 교육용 실습만 제공합니다.
