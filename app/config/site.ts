// 사이트 전역 설정 및 정적 콘텐츠
export const siteConfig = {
  // 기본 정보
  name: 'NHJ.log',
  description:
    '디자인 시스템, 웹 개발, 그리고 의미 있는 디지털 경험을 만드는 것에 대한 생각과 인사이트를 공유합니다.',
  url: 'https://hyeongjin.me',
  author: {
    name: 'Hyeongjin Na',
    email: 'skgudwls@konkuk.ac.kr',
  },

  // Hero 섹션
  hero: {
    title: {
      line1: "Doing What's Needed,",
      line2: "Learning What's Required",
    },
    description:
      '문제 해결에 경계를 두지 않고, 해결이 될 때까지 파고들었던 경험을 공유합니다.',
  },

  // 네비게이션 메뉴
  navigation: [
    { name: 'Blog', href: '/blog' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Bookmarks', href: '/bookmarks' },
    { name: 'About', href: '/about' },
  ],

  // 소셜 링크
  social: {
    github: 'https://github.com/nahyeongjin1',
    linkedin: 'https://www.linkedin.com/in/hyeongjin-na',
    instagram: 'https://www.instagram.com/nagudwls',
  },

  // Footer
  footer: {
    copyright: '© 2025 Blog. All rights reserved.',
  },
} as const;
