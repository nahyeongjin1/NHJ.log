# 배포 가이드 (Deployment Guide)

## 🚀 자동 배포 설정

이 프로젝트는 GitHub Actions를 통해 Netlify에 자동 배포됩니다.

### 배포 트리거

| 브랜치      | 배포 타입 | URL                                            |
| ----------- | --------- | ---------------------------------------------- |
| **main**    | 프로덕션  | https://hyeongjin.me                           |
| **develop** | 미리보기  | https://develop-preview--hyeongjin.netlify.app |

> 💡 **참고:** 프로덕션은 커스텀 도메인(`hyeongjin.me`)을 사용하며, Netlify 서브도메인(`hyeongjin.netlify.app`)에서도 접근 가능합니다.

- **main 브랜치 푸시**: 프로덕션 배포
- **develop 브랜치 푸시**: 미리보기 배포
- **수동 실행**: GitHub Actions 탭에서 직접 실행 가능

## 🔑 필수 설정: GitHub Secrets

배포를 위해 다음 Secrets을 GitHub 저장소에 추가해야 합니다.

### 1. NETLIFY_AUTH_TOKEN 가져오기

1. [Netlify](https://app.netlify.com) 로그인
2. User settings → Applications → Personal access tokens
3. "New access token" 클릭
4. Token 이름 입력 (예: "GitHub Actions")
5. 생성된 토큰 복사 (⚠️ 한 번만 표시됩니다!)

### 2. NETLIFY_SITE_ID 가져오기

#### 방법 1: Netlify Dashboard에서

1. Netlify 사이트 선택
2. Site settings → General → Site details
3. "Site ID" 복사

#### 방법 2: CLI로 확인

```bash
netlify status
# API ID 항목이 SITE_ID입니다
```

### 3. GitHub Secrets 등록

1. GitHub 저장소 페이지 이동
2. **Settings** → **Secrets and variables** → **Actions**
3. "New repository secret" 클릭
4. 다음 2개의 Secret 추가:

| Name                 | Value                         |
| -------------------- | ----------------------------- |
| `NETLIFY_AUTH_TOKEN` | Netlify Personal Access Token |
| `NETLIFY_SITE_ID`    | Netlify Site ID               |

## 📋 워크플로우 상세 설명

### 배포 단계

```yaml
1. ✅ 코드 체크아웃
2. ⚙️  Node.js 20 설정 (npm 캐시 활성화)
3. 📦 의존성 설치 (npm ci)
4. 🔍 타입 체크 (TypeScript)
5. 🎨 린트 체크 (ESLint)
6. 🏗️  프로젝트 빌드
7. 🚀 Netlify 배포
8. ✅ 배포 완료 알림
```

### 빌드 시간 최적화

**현재 적용된 최적화:**

- ✅ npm 캐시 활성화 (`cache: 'npm'`)
- ✅ `npm ci` 사용 (빠른 설치)
- ✅ 동시 배포 방지 (`concurrency`)

**추가 최적화 옵션:**

특정 파일 변경 시에만 배포하려면 `deploy.yml`에서 주석 해제:

```yaml
on:
  push:
    branches:
      - main
      - develop
    paths: # 이 부분 주석 해제
      - 'app/**'
      - 'public/**'
      - 'package.json'
      - 'vite.config.ts'
```

> 💡 **Tip:** develop 배포는 무료이므로 paths 필터가 꼭 필요하진 않지만, main 배포에는 유용합니다. 문서만 수정한 경우 불필요한 프로덕션 배포를 방지할 수 있습니다.

## 🎯 배포 전략

### Free Tier 고려사항

**Netlify Free Tier 제한 (크레딧 기반 플랜):**

- 월 300 크레딧
- **프로덕션 배포**: 15 크레딧/회
- **미리보기 배포 (develop, PR)**: **0 크레딧** 🆓
- **빌드 시간**: 과금 없음 🆓
- **최대 프로덕션 배포**: 월 20회

> 📌 **중요:** 빌드 시간과 미리보기 배포는 무료입니다! develop 브랜치에서 무제한 테스트 가능합니다.

**권장 전략:**

1. ✅ **develop 브랜치에서 자유롭게 테스트** (무료!)
2. ✅ **main 배포는 신중하게** (크레딧 소비)
3. ✅ develop에서 충분히 검증 후 main 머지
4. ✅ 주 1회 main 배포 권장
5. 🔄 긴급 수정 시에만 추가 main 배포

### 예상 크레딧 사용량

| 시나리오                     | 크레딧 소비           |
| ---------------------------- | --------------------- |
| 주 2-3개 PR → develop 머지   | **0 크레딧** 🆓       |
| develop → main 머지 (주 1회) | **15 크레딧**         |
| 월 4번 main 배포             | **60 크레딧**         |
| 핫픽스 (월 2-3회)            | **30-45 크레딧**      |
| **월 예상 사용량**           | **90-105 크레딧**     |
| **남은 여유**                | **195-210 크레딧** ✅ |

**여유 넉넉!** develop에서 무제한 테스트하고 main은 월 20회까지 가능합니다.

## 🔄 수동 배포

필요한 경우 여전히 CLI로 수동 배포 가능:

```bash
# 프로덕션 배포
netlify deploy --prod

# 미리보기 배포
netlify deploy
```

## 🐛 트러블슈팅

### 배포 실패 시

1. **GitHub Actions 로그 확인**
   - Repository → Actions 탭
   - 실패한 워크플로우 클릭
   - 각 단계 로그 확인

2. **자주 발생하는 문제**
   - ❌ Secrets 미설정 → GitHub Secrets 확인
   - ❌ 빌드 에러 → 로컬에서 `npm run build` 테스트
   - ❌ 타입 에러 → `npm run typecheck` 실행
   - ❌ 린트 에러 → `npm run lint:fix` 실행

3. **Secrets 재설정**
   - GitHub Settings → Secrets → Update
   - Netlify에서 새 토큰 발급 후 교체

## 📊 모니터링

### 배포 상태 확인

- **프로덕션 사이트**: https://hyeongjin.me
- **GitHub Actions**: Repository → Actions 탭
- **Netlify Dashboard**: [Deploys 페이지](https://app.netlify.com/sites/hyeongjin/deploys)

### 빌드 사용량 확인

Netlify Dashboard → Billing → Build minutes 확인

## 🎉 완료!

이제 main과 develop 브랜치에 푸시하면 자동으로 배포됩니다!

```bash
# develop 푸시 → 미리보기 배포
git push origin develop

# main 푸시 → 프로덕션 배포
git push origin main
```

## 🔗 관련 문서

- [PR & Issue 워크플로우](PR_WORKFLOW.md)
- [Issue 템플릿](../.github/ISSUE_TEMPLATE/)
- [PR 템플릿](../.github/PULL_REQUEST_TEMPLATE.md)
