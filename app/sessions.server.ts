import { createThemeSessionResolver } from 'remix-themes';
import { createCookieSessionStorage } from 'react-router';

// 쿠키 기반 세션 스토리지 생성
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__remix-themes',
    // 프로덕션에서만 domain 설정
    ...(process.env.NODE_ENV === 'production' && {
      domain: 'hyeongjin.me',
    }),
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'dev-secret-please-change'],
    // HTTPS 환경(프로덕션)에서만 secure 활성화
    secure: process.env.NODE_ENV === 'production',
  },
});

// 테마 세션 리졸버 생성 및 내보내기
export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
