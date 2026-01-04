#!/bin/bash

# develop 브랜치 체크
if [ "$(git branch --show-current)" != "develop" ]; then
  echo "Error: develop 브랜치에서 실행해주세요"
  exit 1
fi

# main으로 체크아웃 후 머지
git switch main
git merge develop
git push origin main

# develop으로 복귀
git switch develop

echo "✅ main 브랜치에 배포 완료"