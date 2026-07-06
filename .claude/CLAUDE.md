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
- `npm run sync-notion` - Notion 콘텐츠 싱크만 (sitemap.xml도 이때 재생성)
- `npm run generate-og` - OG 이미지(public/og-image.png) 재생성
- `npm run deploy` - production 배포
- 패키지 매니저: **npm** (pnpm/yarn 아님)

## 주의사항

- prerender 환경: 서버 사이드 로직은 빌드 시점에만 실행됨
- Netlify가 trailing slash 추가 → slug 정규화 필요 (api/comments.ts, Comments.tsx)
- remix-themes는 prerender 미지원 → patch-package로 쿠키 기반 테마 유지 패치 적용 중

## SEO

메타·구조화 데이터는 `app/lib/seo.ts`에 집중되어 있고 **새 포스트에 자동 적용**된다 (라우트별 수작업 불필요).

- **메타 태그**: 각 라우트 `meta()`가 `generateMeta()`를 호출. canonical·og:url은 `withTrailingSlash()`로 정규화되어 sitemap·Netlify(trailing slash 추가)와 일치 → 불필요한 301 방지.
- **JSON-LD**: `generateMeta({ jsonLd })`로 주입 (RR v7 `script:ld+json` descriptor). 포스트 = `articleJsonLd`(BlogPosting) + `breadcrumbJsonLd`, 홈 = `websiteJsonLd`. 새 포스트는 별도 작업 없이 자동 포함.
- **sitemap.xml / robots.txt**: `public/`의 정적 파일. sitemap은 `scripts/sync-notion.ts`가 `npm run sync-notion` 시 자동 생성.
- **OG 이미지**: `scripts/generate-og.ts`가 `siteConfig`(이름·태그라인·URL) 값으로 `public/og-image.png`(1200×630)를 렌더. 브랜드 변경 시 `npm run generate-og` 재실행. 포스트는 frontmatter `thumbnail`이 우선.
- **배포 후 검증**: Google Search Console 등록 + Rich Results Test로 JSON-LD 확인.

## 코드 컨벤션

- commitlint conventional commits (한글 메시지 허용)
- husky + lint-staged (eslint, prettier)

## MCP 도구 활용

- 라이브러리/API 문서가 필요한 경우 context7 MCP를 명시적 요청 없이 사용
- better-auth 관련 작업 시 better-auth MCP 활용
