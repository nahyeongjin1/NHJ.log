import { createThemeAction } from 'remix-themes';
import { themeSessionResolver } from '~/sessions.server';

// 테마 변경 액션
// POST 요청으로 테마를 쿠키에 저장
export const action = createThemeAction(themeSessionResolver);
