import { useState, useRef, type ComponentProps } from 'react';
import { Check, Copy } from 'lucide-react';

type CodeBlockProps = ComponentProps<'pre'>;

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (!preRef.current) return;

    const code = preRef.current.querySelector('code');
    if (!code) return;

    const text = code.textContent || '';

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-tertiary/80 hover:bg-tertiary text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={copied ? '복사됨' : '코드 복사'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
