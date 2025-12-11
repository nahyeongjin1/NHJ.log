import { siteConfig } from '~/config/site';

export function Hero() {
  return (
    <div>
      <h1 className="text-heading-1 text-primary mb-6">
        {siteConfig.hero.title.line1}
        <br />
        {siteConfig.hero.title.line2}
      </h1>
      <p className="text-body text-secondary max-w-3xl">
        {siteConfig.hero.description}
      </p>
    </div>
  );
}
