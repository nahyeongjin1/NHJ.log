interface LinkCardProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export function LinkCard({
  url,
  title,
  description,
  image,
  favicon,
}: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex border border-default rounded-lg overflow-hidden hover:bg-hover-subtle transition-colors no-underline"
    >
      {/* 콘텐츠 영역 */}
      <div className="flex-1 p-4 min-w-0">
        <div className="font-medium text-primary truncate">{title}</div>
        {description && (
          <div className="text-sm text-secondary mt-1 line-clamp-2">
            {description}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2 text-sm text-tertiary">
          {favicon && (
            <img
              src={favicon}
              alt=""
              className="w-4 h-4"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="truncate">{new URL(url).hostname}</span>
        </div>
      </div>

      {/* 이미지 영역 */}
      {image && (
        <div className="hidden sm:block w-48 flex-shrink-0">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.parentElement!.style.display = 'none';
            }}
          />
        </div>
      )}
    </a>
  );
}
