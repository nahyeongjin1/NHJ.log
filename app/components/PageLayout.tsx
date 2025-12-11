import type { ReactNode } from 'react';

interface PageLayoutProps {
  header: ReactNode;
  children: ReactNode;
  isHero?: boolean; // Hero일 때 다른 패딩 적용
}

export function PageLayout({
  header,
  children,
  isHero = false,
}: PageLayoutProps) {
  return (
    <div className="bg-primary min-h-screen">
      {/* 헤더 섹션 */}
      <section
        className={`max-w-[1260px] mx-auto px-10 ${
          isHero ? 'py-32' : 'pt-[72px]'
        }`}
      >
        {header}
      </section>

      {/* 콘텐츠 섹션 */}
      <section className="border-t border-strong mt-[72px]">
        <div className="max-w-[1260px] mx-auto px-12 py-12">{children}</div>
      </section>
    </div>
  );
}
