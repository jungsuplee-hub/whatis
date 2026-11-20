# WHATIS · Visual Technology Encyclopedia

복잡한 기술을 시각적으로 설명하는 정적 기술 백과사전입니다.

## Features
- **일반 AI**: 핵심 개념과 대화형 단계별 구조도, 실무 적용, 오해/주의점, 공식 출처
- **Siemens(준비 중)**: 현재 상세 문서는 공개하지 않으며, 향후 Teamcenter / Polarion / Opcenter 솔루션별 콘텐츠로 확장 예정
- 카테고리 탐색, 실시간 검색 (단축키 `/`), 연결 기술, URL 해시 기반 딥링크
- 반응형 UI와 브라우저 북마크 저장 (localStorage)
- 별도 서버·DB·API 키 없는 정적 배포

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
