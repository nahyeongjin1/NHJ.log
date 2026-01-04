import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useTheme, Theme } from 'remix-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { siteConfig } from '~/config/site';
import { AuthButton } from './AuthButton';

export function Header() {
  // remix-themes의 useTheme 훅 사용
  const [theme, setTheme] = useTheme();
  const isDark = theme === Theme.DARK;
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setTheme(isDark ? Theme.LIGHT : Theme.DARK);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // 현재 경로가 메뉴 경로와 일치하는지 확인 (하위 경로 포함)
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-strong">
      <div className="max-w-[1260px] mx-auto px-10 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-heading-3 text-primary"
        >
          {siteConfig.name}
        </Link>

        {/* 네비게이션 (데스크탑) */}
        <nav className="hidden md:flex gap-8">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-label transition-colors ${
                isActive(item.href)
                  ? 'text-primary underline underline-offset-4'
                  : 'text-secondary hover:text-primary'
              }`}
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

          {/* 로그인/프로필 (데스크탑) */}
          <AuthButton variant="desktop" />

          {/* 로그인/프로필 (모바일) */}
          <AuthButton variant="mobile" />

          {/* 햄버거 메뉴 (모바일) */}
          <button
            onClick={toggleMenu}
            className="md:hidden w-9 h-9 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center text-secondary"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-strong bg-primary">
          <nav className="flex flex-col px-10 py-4 gap-4">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeMenu}
                className={`text-label transition-colors bg-secondary px-4 py-3 rounded-lg ${
                  isActive(item.href)
                    ? 'text-primary underline underline-offset-4'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
