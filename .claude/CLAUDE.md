# NHJ.log 블로그

## 기술 스택

- React Router v7 (prerender, SSR 미사용)
- Netlify 배포
- Notion CMS → MDX 변환 파이프라인
- drizzle-orm + Neon PostgreSQL
- better-auth (GitHub OAuth)
- remix-themes (patch-package 패치 적용 중 - PR #63 머지 시 제거)
- Tailwind CSS + @tailwindcss/typography

## 주요 명령어

- `npm run publish` - Notion 싱크 + 빌드 + preview 배포 (한 번에)
- `npm run sync-notion` - Notion 콘텐츠 싱크만
- `npm run deploy` - production 배포
- 패키지 매니저: **npm** (pnpm/yarn 아님)

## 주의사항

- prerender 환경: 서버 사이드 로직은 빌드 시점에만 실행됨
- Netlify가 trailing slash 추가 → slug 정규화 필요 (api/comments.ts, Comments.tsx)
- remix-themes는 prerender 미지원 → patch-package로 쿠키 기반 테마 유지 패치 적용 중

## 코드 컨벤션

- commitlint conventional commits (한글 메시지 허용)
- husky + lint-staged (eslint, prettier)

## MCP 도구 활용

- 라이브러리/API 문서가 필요한 경우 context7 MCP를 명시적 요청 없이 사용
- better-auth 관련 작업 시 better-auth MCP 활용
