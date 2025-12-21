// 사이트 전역 설정 및 정적 콘텐츠
export const siteConfig = {
  // 기본 정보
  name: 'NHJ.log',
  description:
    '문제 해결에 경계를 두지 않고, 해결이 될 때까지 파고들었던 경험을 공유합니다.',
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
    { name: 'Posts', href: '/posts' },
    { name: 'Projects', href: '/projects' },
    { name: 'Bookmarks', href: '/bookmarks' },
    { name: 'About', href: '/about' },
  ],

  // 소셜 링크
  social: {
    github: { url: 'https://github.com/nahyeongjin1', handle: '@nahyeongjin1' },
    linkedin: {
      url: 'https://www.linkedin.com/in/hyeongjin-na',
      handle: 'Hyeongjin Na',
    },
    instagram: {
      url: 'https://www.instagram.com/nagudwls',
      handle: '@nagudwls',
    },
  },

  // Footer
  footer: {
    copyright: '© 2025 Blog. All rights reserved.',
  },

  // 페이지별 설정
  pages: {
    posts: {
      title: 'Posts',
      description: '개발 중 마주친 문제들과 해결 과정을 기록합니다.',
    },
    projects: {
      title: 'Projects',
      description: '참여했던 프로젝트들과 그 과정에서의 경험을 정리했습니다.',
    },
    bookmarks: {
      title: 'Bookmarks',
      description: '유용한 기술 아티클, 도구, 라이브러리 모음',
    },
    about: {
      title: 'About',
      description: '소개, 활동, 기술 스택 등을 확인할 수 있습니다.',
      headline: '문제 앞에서 분야를 가리지 않는 백엔드 개발자입니다.',
      location: 'Seoul, South Korea',
      intro: [
        'TypeScript와 Node.js를 주력으로 백엔드 개발을 하고 있습니다.',
        '하지만 문제 해결이 필요하다면 프론트엔드든 인프라든 가리지 않고 뛰어듭니다.',
        '특정 언어나 프레임워크에 종속되기보다, 상황에 맞는 도구를 선택하고 깊이 파고들어 해결책을 찾는 과정을 즐깁니다.',
        '이 블로그에는 개발하면서 마주친 문제들과 그 해결 과정을 기록하고 있습니다.',
      ],
      activities: [
        {
          title: 'GDGoC Member',
          organization: 'Google Developer Groups on Campus',
          period: '2025 - 2026',
          description: 'GDGoC Konkuk 25-26 멤버로 활동',
        },
        {
          title: '공과대학 학생회',
          organization: '건국대학교',
          period: '2021',
          description: '공과대학 학생회 활동',
        },
        {
          title: '오픈소스 기여',
          organization: 'GitHub',
          period: '',
          description:
            'gemini-cli, claude-code 등 오픈소스 프로젝트에 이슈 생성 및 기여',
        },
      ],
      education: {
        degree: '컴퓨터공학부',
        school: '건국대학교',
        period: '2020.03 - 2026.08',
      },
      skills: {
        Languages: ['TypeScript', 'JavaScript', 'Python', 'C++'],
        Backend: ['Node.js', 'Fastify', 'Express', 'FastAPI'],
        Frontend: ['React', 'React Router v7', 'Next.js', 'Tailwind CSS'],
        Database: ['PostgreSQL', 'MongoDB', 'Redis'],
        'Infra / DevOps': ['Docker', 'AWS', 'GitHub Actions', 'K3S'],
        Tools: ['Git', 'Notion', 'Jira'],
      },
      interests: [
        {
          title: '시스템 아키텍처',
          description: '확장 가능하고 유지보수하기 좋은 시스템 설계',
        },
        {
          title: '성능 최적화',
          description: '병목 지점을 찾아 개선하는 과정',
        },
        {
          title: '트러블슈팅',
          description: '문제의 근본 원인을 파고들어 해결하기',
        },
      ],
    },
  },
} as const;
