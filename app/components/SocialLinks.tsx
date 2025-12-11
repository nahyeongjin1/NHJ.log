import { Github, Linkedin, Instagram, type LucideIcon } from 'lucide-react';
import { siteConfig } from '~/config/site';

const socialMeta: Record<
  keyof typeof siteConfig.social,
  { icon: LucideIcon; label: string }
> = {
  github: { icon: Github, label: 'GitHub' },
  linkedin: { icon: Linkedin, label: 'LinkedIn' },
  instagram: { icon: Instagram, label: 'Instagram' },
};

interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className ?? ''}`}>
      {Object.entries(siteConfig.social).map(([key, { url, handle }]) => {
        const { icon: Icon, label } =
          socialMeta[key as keyof typeof socialMeta];
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary flex items-center gap-3 px-5 py-3 border border-subtle rounded-lg hover:border-strong transition-colors"
          >
            <Icon size={20} className="text-primary" />
            <div className="flex flex-col">
              <span className="text-label text-primary">{label}</span>
              <span className="text-caption text-tertiary">{handle}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
