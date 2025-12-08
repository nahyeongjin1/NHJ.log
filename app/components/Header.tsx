import { Link } from 'react-router';
import { useTheme, Theme } from 'remix-themes';
import { Sun, Moon, User } from 'lucide-react';
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
            className="w-9 h-9 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center text-secondary"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Login 버튼 (UI만) */}
          <button className="h-10 px-4 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-label flex items-center gap-2 hover:opacity-90 transition-opacity">
            <User size={18} />
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
