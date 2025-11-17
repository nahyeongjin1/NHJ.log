# Pull Request & Issue 연동 가이드

## 🔗 자동 연동 기능

PR을 생성하면 자동으로 관련 GitHub Issue와 연동됩니다.

### 작동 방식

1. **PR 생성/수정 시 자동 실행**
2. **브랜치 이름, PR 제목, PR 본문에서 이슈 번호 추출**
3. **Issue 존재 확인**
4. **PR 제목을 `[BLOG-N] Issue 제목` 형식으로 자동 변경**
5. **PR 본문에 "Closes #N" 자동 추가**
6. **PR 본문의 Branch 섹션에 실제 브랜치 정보 자동 입력**
7. **Issue에 PR 링크 댓글 추가 (PR 최초 생성 시에만)**

## 📋 브랜치 네이밍 컨벤션

Issue 템플릿에 따라 다음 브랜치 명명 규칙을 따르세요:

### Feature (새 기능)

```bash
feature/BLOG-{issue_number}
```

예: `feature/BLOG-6`

### Bug Fix (버그 수정)

```bash
# Medium, Low severity
bugfix/BLOG-{issue_number}

# Critical, High severity
hotfix/BLOG-{issue_number}
```

예: `bugfix/BLOG-10`, `hotfix/BLOG-5`

### Documentation (문서)

```bash
docs/BLOG-{issue_number}
```

### Refactoring (리팩토링)

```bash
refactor/BLOG-{issue_number}
```

## 🚀 워크플로우 예시

### 1. Issue 생성

```
이슈 번호: #6
제목: [FEATURE] Notion CMS 연동
```

### 2. 브랜치 생성

```bash
git checkout -b feature/BLOG-6
```

### 3. 작업 후 커밋

```bash
git add .
git commit -m "feat: implement Notion CMS integration"
git push origin feature/BLOG-6
```

### 4. PR 생성

GitHub에서 PR을 생성하면:

#### ✅ 자동으로 수행되는 작업:

**1. PR 제목 자동 변경:**

변경 전: `feat: implement Notion CMS integration`
변경 후: `[BLOG-6] Notion CMS 연동`

- Issue 제목에서 `[FEATURE]` 같은 prefix 자동 제거
- `[BLOG-N]` prefix 자동 추가

**2. PR 본문에 자동 추가:**

```markdown
## 🔗 Related Issue

Closes #6

> [FEATURE] Notion CMS 연동
```

**3. Branch 정보 자동 입력:**

템플릿의 Branch 섹션이 실제 브랜치로 자동 변경됩니다:

변경 전:

```markdown
## 🌿 Branch

- From: `feature/BLOG-{number}`
- To: `develop`
```

변경 후:

```markdown
## 🌿 Branch

- From: `feature/BLOG-6`
- To: `develop`
```

**4. Issue #6에 자동 댓글 (최초 1회만):**

```markdown
🚀 **Linked Pull Request**

**#12** [BLOG-6] Notion CMS 연동
👤 Author: @nahyeongjin1
🔗 [View Pull Request](https://github.com/...)
```

> 💡 **참고:** Issue 댓글은 PR 최초 생성 시에만 추가됩니다. PR을 수정하더라도 추가 댓글이 달리지 않으므로 Issue가 지저분해지지 않습니다.

### 5. PR 머지

- PR이 머지되면 Issue #6 자동으로 닫힘 (`Closes #6` 덕분)
- develop 브랜치에 미리보기 자동 배포
- main 머지 시 프로덕션 자동 배포

## 🎯 추가 연동 방법

브랜치 이름에 이슈 번호가 없어도 다음 방법으로 연동 가능:

### PR 제목에 포함

```
feat: add new feature #6
```

### PR 본문에 포함

```markdown
## Description

New feature implementation

Closes #6
```

또는:

```markdown
Fixes #6
Resolves #6
```

## ⚠️ 이슈 번호가 없는 경우

브랜치, 제목, 본문 어디에도 이슈 번호가 없으면:

1. **경고 댓글이 PR에 자동 추가됨**
2. **GitHub Actions 로그에 경고 표시**

### 경고 댓글 예시:

```markdown
⚠️ Issue Link Not Found

This PR does not seem to be linked to any GitHub issue.

📌 Recommended Actions:

1. Follow branch naming convention
2. Add "Closes #N" to PR description
3. Create a related issue if needed
```

## 📊 자동 연동 상태 확인

### GitHub Actions에서 확인

1. PR 페이지 → **Checks** 탭
2. **Link PR to Issue** 워크플로우 확인
3. 로그에서 연동 상태 확인

### 로그 예시:

```
✅ Found issue #6 from branch (feature)
✅ Issue #6 exists
   Title: [FEATURE] Notion CMS 연동
   State: open
   Labels: feature
✅ Updated PR title to: [BLOG-6] Notion CMS 연동
✅ Added "Closes #6" to PR description
✅ Added PR link comment to issue #6
```

## 🔧 트러블슈팅

### Issue가 자동으로 닫히지 않는 경우

**원인:** PR 본문에 `Closes #N`이 없음

**해결:**

```markdown
# PR 본문에 추가

Closes #6
```

또는 워크플로우가 자동으로 추가할 때까지 기다림

### 브랜치 이름이 규칙과 다른 경우

**예:** `my-feature-branch` (이슈 번호 없음)

**해결:**

1. PR 본문에 `Closes #6` 추가
2. 또는 브랜치 이름 변경:

```bash
git branch -m feature/BLOG-6
git push origin -u feature/BLOG-6
git push origin --delete my-feature-branch
```

### 워크플로우가 실행되지 않는 경우

**확인 사항:**

1. `.github/workflows/pr-issue-link.yml` 파일이 main 브랜치에 있는지
2. PR이 `opened` 또는 `edited` 상태인지
3. GitHub Actions 권한이 활성화되어 있는지

## 💡 Best Practices

### ✅ DO

- Issue 템플릿 사용해서 이슈 생성
- 브랜치 네이밍 컨벤션 준수
- 하나의 PR은 하나의 Issue와 연결
- PR 본문에 변경 사항 상세히 작성

### ❌ DON'T

- 이슈 없이 PR 생성
- 여러 이슈를 하나의 PR에 포함
- 브랜치 네이밍 무시
- PR 본문 비워두기

## 🎨 브랜치 타입별 아이콘

자동 댓글에 사용되는 아이콘:

- 🚀 `feature/*` - 새로운 기능
- 🐛 `bugfix/*` - 버그 수정
- 🔥 `hotfix/*` - 긴급 수정
- 📝 `docs/*` - 문서
- ♻️ `refactor/*` - 리팩토링

## 🔗 관련 문서

- [Issue 템플릿](../.github/ISSUE_TEMPLATE/)
- [PR 템플릿](../.github/PULL_REQUEST_TEMPLATE.md)
- [배포 가이드](DEPLOYMENT.md)
- [커밋 컨벤션](../README.md#commit-convention)
