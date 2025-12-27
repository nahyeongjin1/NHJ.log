interface ImageProps {
  src: string;
  alt?: string;
}

export function Image({ src, alt = '' }: ImageProps) {
  return (
    <figure className="my-6">
      <img src={src} alt={alt} loading="lazy" className="w-full rounded-lg" />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-secondary">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
