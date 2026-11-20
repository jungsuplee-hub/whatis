# WHATIS · Visual Technology Encyclopedia

복잡한 기술을 시각적으로 설명하는 정적 기술 백과사전입니다.

## Features
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
- **Siemens Solution Architect**: Teamcenter 2606 및 Polarion ALM 2606 중심의 공개 가능한 개념형 아키텍처 가이드. 논리/배포 영역 시각화, 선택형 구성요소 설명, 설계 검토 체크리스트, 양 제품 간 연계 검토 도식을 제공합니다. Opcenter는 후속 확장 대상입니다.
- **Teamcenter 인프라 탐색**: Client / Web / Enterprise / Resource의 4계층과 FMS·캐시·볼륨·검색·연동·인증·운영을 클릭하는 독립형 인프라 구성도. 제품 정보 조회·CAD 파일 접근·외부 연계의 요청 경로를 선택할 수 있으며 HA/DR·보안·성능 설계 질문을 표시합니다. 공개 Siemens 설명과 Microsoft/AWS 참조 아키텍처를 참고한 교육용 도식이며, 설치 가이드 또는 확정 서버 수/지원 구성으로 주장하지 않습니다. 소스: src/TeamcenterInfrastructure.tsx.
- **Teamcenter 2606 심화 아키텍처**: 사용자가 작성한 2026년 3월 Google Drawing을 서비스 수준의 도식으로 재구성했습니다. src/TeamcenterDeepDive.tsx 에서 Client/Web/Enterprise/Resource 19개 서비스 노드, 16개 연결, 4개 업무 흐름, 포트 검색/근거 분류, 제품 Copilot·자체호스팅 사례·Microsoft 365 Copilot·별도 MCP 확장 흐름, 사전 색인/실시간 추론 구분, 운영 점검 항목을 제공합니다. AWS형 연결선은 `src/ServiceConnections.tsx`에서 16개 연결 데이터만 이용해 실제 노드 위치 사이에 SVG 화살표로 그리며, 해당 선을 클릭하면 연결 포트·근거 수준이 같은 화면에 표시됩니다. 흐름별 강조/전체 연결선 토글, 모바일 내부 가로 스크롤을 지원합니다. 기존 간단 4계층 설명도는 접어서 남겨두었습니다.
- **Teamcenter 4-tier Atlas UI**: src/TeamcenterAtlas.tsx와 src/teamcenter-atlas.css로 기존 세로형 박스 목록을 인프라 영역별 서비스 아이콘·네트워크 경계·연결선 기반의 새 인터랙티브 구성도로 대체했습니다. Client/Web/Teamcenter Services/Data & Search 4개 영역, 19개 서비스와 검증 대상 16개 연결, 업무 흐름 강조, 경로별 포트 표시, 구역 빠른 이동, PC 너비 자동 맞춤/모바일 좌우 탐색을 지원합니다. src/ServiceConnections.tsx의 선택적 직각 경유지 기능으로 9개 Teamcenter 연결선이 서비스 카드 내부를 관통하지 않도록 했고, Polarion 구성도는 기존 경로를 유지합니다. 그림은 AWS 스타일의 시각적 표현을 차용한 독자적 학습 도식이지 AWS 배포 구성이나 Siemens 인증 설치도가 아닙니다.
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
- src/SiemensArchitect.tsx에서 공개 가능한 아키텍트 가이드 내용을 유지보수합니다. Opcenter는 추후 검증 후 별도로 설계합니다.
