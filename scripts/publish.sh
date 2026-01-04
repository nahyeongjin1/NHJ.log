#!/bin/bash

# develop 브랜치 체크
if [ "$(git branch --show-current)" != "develop" ]; then
  echo "Error: develop 브랜치에서 실행해주세요"
  exit 1
fi

# Notion 동기화
npm run sync-notion

# 변경사항 있으면 커밋 & 푸시
git add content/ public/sitemap.xml
if ! git diff --cached --quiet; then
  TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
  git commit --no-verify -m "chore: sync content from Notion ($TIMESTAMP)"
  git push origin develop
  echo "✅ 동기화 완료 및 push 성공"
else
  echo "ℹ️ 변경사항 없음"
fi