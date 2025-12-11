import { MapPin, Mail, Briefcase } from 'lucide-react';
import type { Route } from './+types/about';
import { PageLayout } from '~/components/PageLayout';
import { PageHeader } from '~/components/PageHeader';
import { SocialLinks } from '~/components/SocialLinks';
import { siteConfig } from '~/config/site';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${siteConfig.pages.about.title} - ${siteConfig.name}` },
    {
      name: 'description',
      content: siteConfig.pages.about.description,
    },
  ];
}

export default function AboutPage() {
  const { about } = siteConfig.pages;

  return (
    <PageLayout
      header={
        <PageHeader title={about.title} description={about.headline}>
          {/* 연락처 정보 */}
          <div className="flex flex-wrap gap-4 text-secondary">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span className="text-label">{about.location}</span>
            </div>
            <a
              href={`mailto:${siteConfig.author.email}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail size={18} />
              <span className="text-label">{siteConfig.author.email}</span>
            </a>
          </div>

          {/* 소셜 링크 */}
          <SocialLinks />
        </PageHeader>
      }
    >
      {/* 소개 */}
      <div className="flex flex-col gap-6">
        <h2 className="text-heading-3 text-primary">소개</h2>
        <div className="flex flex-col gap-4">
          {about.intro.map((paragraph, index) => (
            <p key={index} className="text-body text-secondary leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* 활동 */}
      <div className="flex flex-col gap-6 mt-16">
        <h2 className="text-heading-3 text-primary">활동</h2>
        <div className="flex flex-col gap-8">
          {about.activities.map((activity, index) => (
            <div
              key={index}
              className="relative pl-6 border-l-2 border-default"
            >
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-primary" />
              {activity.period && (
                <p className="text-caption text-tertiary mb-1">
                  {activity.period}
                </p>
              )}
              <h3 className="text-label text-primary font-semibold">
                {activity.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-secondary">
                <Briefcase size={14} />
                <span className="text-body-small">{activity.organization}</span>
              </div>
              <p className="text-body-small text-tertiary mt-2">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 학력 */}
      <div className="flex flex-col gap-6 mt-16">
        <h2 className="text-heading-3 text-primary">학력</h2>
        <div className="border border-default rounded-lg p-6">
          <p className="text-caption text-tertiary">{about.education.period}</p>
          <h3 className="text-label text-primary font-semibold mt-2">
            {about.education.degree}
          </h3>
          <p className="text-body text-secondary mt-1">
            {about.education.school}
          </p>
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="flex flex-col gap-6 mt-16">
        <h2 className="text-heading-3 text-primary">기술 스택</h2>
        <div className="flex flex-col gap-6">
          {Object.entries(about.skills).map(([category, skills]) => (
            <div key={category} className="flex flex-col gap-3">
              <h3 className="text-label text-primary font-semibold">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-tertiary rounded-full text-label-small text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 관심사 */}
      <div className="flex flex-col gap-6 mt-16">
        <h2 className="text-heading-3 text-primary">관심사</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {about.interests.map((interest, index) => (
            <div
              key={index}
              className="border border-default rounded-lg p-6 flex flex-col gap-2"
            >
              <h3 className="text-label text-primary font-semibold">
                {interest.title}
              </h3>
              <p className="text-body-small text-tertiary">
                {interest.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
