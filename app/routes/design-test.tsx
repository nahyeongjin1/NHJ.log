import { useState } from 'react';
import type { Route } from './+types/design-test';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Design System Test - NHJ.log' },
    { name: 'description', content: 'Testing design tokens and typography' },
  ];
}

export default function DesignTest() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);

    if (newMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Dark Mode Toggle */}
      <div className="fixed top-8 right-8">
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 rounded-lg bg-secondary text-primary border border-default hover:bg-hover transition-colors"
        >
          {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="heading-1">Design System Test</h1>
          <p className="body text-secondary">
            Pretendard 폰트와 디자인 토큰 테스트 페이지입니다.
          </p>
        </div>

        {/* Typography Test */}
        <section className="space-y-6">
          <h2 className="heading-2 text-primary">Typography</h2>
          <div className="space-y-4 p-6 rounded-lg bg-secondary border border-default">
            <div>
              <p className="caption text-tertiary mb-1">
                heading-1 (36px/44px)
              </p>
              <h1 className="heading-1">The quick brown fox</h1>
            </div>
            <div>
              <p className="caption text-tertiary mb-1">
                heading-2 (30px/38px)
              </p>
              <h2 className="heading-2">The quick brown fox</h2>
            </div>
            <div>
              <p className="caption text-tertiary mb-1">
                heading-3 (24px/32px)
              </p>
              <h3 className="heading-3">The quick brown fox</h3>
            </div>
            <div>
              <p className="caption text-tertiary mb-1">
                body-large (20px/32px)
              </p>
              <p className="body-large">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <p className="caption text-tertiary mb-1">body (16px/24px)</p>
              <p className="body">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <p className="caption text-tertiary mb-1">
                body-small (14px/20px)
              </p>
              <p className="body-small">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <p className="caption text-tertiary mb-1">
                label (16px/24px, medium weight)
              </p>
              <p className="label">The quick brown fox</p>
            </div>
            <div>
              <p className="caption text-tertiary mb-1">caption (12px/16px)</p>
              <p className="caption">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>
        </section>

        {/* Color Test */}
        <section className="space-y-6">
          <h2 className="heading-2 text-primary">Colors</h2>

          {/* Semantic Tokens */}
          <div className="space-y-4">
            <h3 className="heading-3 text-primary">Semantic Tokens</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary border border-default">
                <p className="label-small">bg-primary</p>
                <p className="caption text-tertiary">Main background</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary border border-default">
                <p className="label-small">bg-secondary</p>
                <p className="caption text-tertiary">Card background</p>
              </div>
              <div className="p-4 rounded-lg bg-tertiary border border-default">
                <p className="label-small">bg-tertiary</p>
                <p className="caption text-tertiary">Subtle elements</p>
              </div>
              <div className="p-4 rounded-lg bg-hover border border-default">
                <p className="label-small">bg-hover</p>
                <p className="caption text-tertiary">Hover state</p>
              </div>
            </div>
          </div>

          {/* Text Colors */}
          <div className="space-y-4">
            <h3 className="heading-3 text-primary">Text Colors</h3>
            <div className="p-6 rounded-lg bg-secondary border border-default space-y-2">
              <p className="body text-primary">text-primary: Primary text</p>
              <p className="body text-secondary">
                text-secondary: Secondary text
              </p>
              <p className="body text-tertiary">text-tertiary: Tertiary text</p>
              <p className="body text-muted">text-muted: Muted text</p>
            </div>
          </div>

          {/* Primitives */}
          <div className="space-y-4">
            <h3 className="heading-3 text-primary">Gray Scale (Primitives)</h3>
            <div className="grid grid-cols-6 gap-2">
              {[
                0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000,
              ].map((shade) => (
                <div key={shade} className="space-y-1">
                  <div
                    className="h-12 rounded border border-default"
                    style={{
                      backgroundColor:
                        shade === 0
                          ? '#ffffff'
                          : shade === 50
                            ? '#fafafa'
                            : shade === 100
                              ? '#f5f5f5'
                              : shade === 200
                                ? '#e5e5e5'
                                : shade === 300
                                  ? '#d4d4d4'
                                  : shade === 400
                                    ? '#a3a3a3'
                                    : shade === 500
                                      ? '#737373'
                                      : shade === 600
                                        ? '#525252'
                                        : shade === 700
                                          ? '#404040'
                                          : shade === 800
                                            ? '#262626'
                                            : shade === 900
                                              ? '#171717'
                                              : shade === 950
                                                ? '#0a0a0a'
                                                : '#000000',
                    }}
                  />
                  <p className="caption text-center text-tertiary">{shade}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Component Preview */}
        <section className="space-y-6">
          <h2 className="heading-2 text-primary">Component Preview</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Card Example */}
            <div className="p-6 rounded-lg bg-secondary border border-default space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-tertiary">
                <span className="label-small text-secondary">Design</span>
              </div>
              <h3 className="heading-3">Sample Card</h3>
              <p className="body-small text-secondary">
                This is a sample card component using the design system tokens.
              </p>
              <div className="flex gap-4 caption text-tertiary">
                <span>2025.01.01</span>
                <span>5 min read</span>
              </div>
            </div>

            {/* Button Examples */}
            <div className="space-y-4 p-6 rounded-lg bg-secondary border border-default">
              <h3 className="heading-3">Buttons</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 rounded-lg text-primary bg-primary label">
                  Primary Button
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-tertiary text-primary border border-default label hover:bg-hover">
                  Secondary Button
                </button>
                <button className="w-full px-4 py-2 rounded-lg border border-strong text-secondary label hover:bg-hover">
                  Outline Button
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
