export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능
        'fix', // 버그 수정
        'docs', // 문서 변경
        'style', // 코드 포맷팅, 세미콜론 누락 등
        'refactor', // 코드 리팩토링
        'perf', // 성능 개선
        'test', // 테스트 추가/수정
        'chore', // 빌드 업무, 패키지 매니저 수정
        'ci', // CI 설정 파일 수정
        'build', // 빌드 시스템 수정
        'revert', // 커밋 되돌리기
      ],
    ],
    'subject-case': [0], // subject case 체크 비활성화
  },
};
