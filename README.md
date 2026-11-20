# WHATIS · Visual Technology Encyclopedia

복잡한 기술을 시각적으로 설명하는 정적 기술 백과사전입니다.

## Features
- **비전공자를 위한 AI 이야기 36개**: 기존 30개에 AI 사실 오류, 그림 생성, 음성 받아쓰기, 검색과 AI의 차이, 개인정보, AI의 한계를 추가
- **눈으로 먼저 보기**: 홈페이지의 일반 질문/도구 사용 시뮬레이션, 분야별 애니메이션 전시, 각 글에 특화된 움직이는 예시
- **클릭하면 설명 보기**: 기본 화면은 질문·애니메이션에 집중; 단계별 설명과 일상 비유·사용 사례·주의점·공식 출처는 상세에서 펼치기
- **비전공자 친화적인 콘텐츠**: src/lessonContent.ts가 36개 전체 주제의 쉬운 질문/설명/일상 비유/주의점을 관리하고, src/data.ts가 정확한 기술 정보·출처·단계별 구조를 관리
- **Siemens(준비 중)**: Teamcenter / Polarion / Opcenter의 추후 솔루션별 확장 항목만 유지; 실제 상세 자료는 게시하지 않음
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
`src/data.ts`의 `topics` 배열에 개념과 단계, 실무사례, 공식 출처를 추가하면 검색/목차/관련 글에 반영됩니다. 도식은 동일한 UI 컴포넌트로 자동 생성됩니다.

*WHATIS는 공식 제품 설명서가 아닌 학습용 개념 해설입니다. 기술별 원문 링크를 함께 확인하세요.*

### Siemens 확장 원칙
- 현재 공개된 Siemens 상세 설명/구조도는 없으며 준비 중 안내만 표시합니다.
- src/data.ts의 siemensSolutions는 솔루션별 확장을 위한 타입·메타데이터입니다. 제품별 상세 문서는 추후 공식 문서 검증 후 추가합니다.
