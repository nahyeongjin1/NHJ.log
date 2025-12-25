'use client';

import { useState, Children, isValidElement, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface ToggleProps {
  children: ReactNode;
}

export function Toggle({ children }: ToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  // children에서 summary와 나머지 분리
  let summary: ReactNode = null;
  const content: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === 'summary') {
      summary = child.props.children;
    } else {
      content.push(child);
    }
  });

  return (
    <div className="border border-default rounded-lg">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-start gap-2 w-full p-3 text-left hover:bg-hover-subtle transition-colors"
      >
        <ChevronRight
          className={`w-4 h-4 mt-1 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
        <div className="flex-1">{summary}</div>
      </button>
      {isOpen && <div className="px-3 pb-3 pl-9">{content}</div>}
    </div>
  );
}
