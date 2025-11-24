import { Link } from 'react-router';
import { useTheme, Theme } from 'remix-themes';
import { siteConfig } from '~/config/site';

export function Header() {
  // remix-themes의 useTheme 훅 사용
  const [theme, setTheme] = useTheme();
  const isDark = theme === Theme.DARK;

  const toggleDarkMode = () => {
    setTheme(isDark ? Theme.LIGHT : Theme.DARK);
  };

  return (
    <header className="bg-primary border-b border-strong">
      <div className="max-w-[1260px] mx-auto px-10 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="text-heading-3 text-primary">
          {siteConfig.name}
        </Link>

        {/* 네비게이션 */}
        <nav className="flex gap-8">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-label text-secondary hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-3">
          {/* 다크모드 토글 */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isDark ? (
                // 달 아이콘 (다크모드일 때)
                <path
                  d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-secondary"
                />
              ) : (
                // 해 아이콘 (라이트모드일 때)
                <>
                  <circle
                    cx="10"
                    cy="10"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-secondary"
                  />
                  <path
                    d="M10 1v2m0 14v2M4.22 4.22l1.42 1.42m8.72 8.72l1.42 1.42M1 10h2m14 0h2M4.22 15.78l1.42-1.42m8.72-8.72l1.42-1.42"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-secondary"
                  />
                </>
              )}
            </svg>
          </button>

          {/* Login 버튼 (UI만) */}
          <button className="h-10 px-4 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-label flex items-center gap-2 hover:opacity-90 transition-opacity">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 14v-1.5a3 3 0 00-3-3H7a3 3 0 00-3 3V14M12 6a3 3 0 11-6 0 3 3 0 016 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
