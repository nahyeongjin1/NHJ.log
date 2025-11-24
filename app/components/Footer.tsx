import { siteConfig } from '~/config/site';

export function Footer() {
  return (
    <footer className="bg-primary border-t border-strong">
      <div className="max-w-[1260px] mx-auto px-10 py-12">
        <div className="flex items-center justify-between">
          {/* 저작권 */}
          <p className="text-label-small text-tertiary">
            {siteConfig.footer.copyright}
          </p>

          {/* 소셜 링크 */}
          <div className="flex gap-6">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label-small text-tertiary hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label-small text-tertiary hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label-small text-tertiary hover:text-primary transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
