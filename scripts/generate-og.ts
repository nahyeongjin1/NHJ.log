/**
 * OG 이미지(public/og-image.png, 1200x630) 생성 스크립트.
 *
 * siteConfig 값(이름·태그라인·URL·저자)을 그대로 읽어 SVG 를 조립하고
 * resvg 로 PNG 렌더한다. 브랜드가 바뀌면 이 스크립트만 다시 돌리면
 * OG 이미지가 자동으로 최신 값으로 재생성된다.
 *
 *   npm run generate-og
 */
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../app/config/site';

const WIDTH = 1200;
const HEIGHT = 630;

/** SVG 텍스트 노드에 들어갈 문자열 이스케이프 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const wordmark = escapeXml(siteConfig.name);
const eyebrow = escapeXml(
  `TECH BLOG · ${siteConfig.author.name.toUpperCase()}`
);
const tagline = escapeXml(
  `${siteConfig.hero.title.line1} ${siteConfig.hero.title.line2}`
);
const host = escapeXml(new URL(siteConfig.url).host);

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141417"/>
      <stop offset="100%" stop-color="#0d0d0f"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="none" stroke="#26262b" stroke-width="2"/>

  <text x="116" y="198" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="24" font-weight="600" letter-spacing="6" fill="#818cf8">${eyebrow}</text>

  <rect x="80" y="238" width="10" height="132" rx="5" fill="url(#accent)"/>

  <text x="116" y="352" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="128" font-weight="800" letter-spacing="-3" fill="#fafafa">${wordmark}</text>

  <text x="116" y="428" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="34" font-weight="500" fill="#a1a1aa">${tagline}</text>

  <text x="116" y="556" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="26" font-weight="500" letter-spacing="1" fill="#71717a">${host}</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: WIDTH },
  font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica Neue' },
  background: '#0d0d0f',
});

const png = resvg.render().asPng();
const outPath = fileURLToPath(
  new URL('../public/og-image.png', import.meta.url)
);
writeFileSync(outPath, png);

// eslint-disable-next-line no-console
console.log(`✓ og-image.png 생성 완료 (${png.length} bytes) → ${outPath}`);
