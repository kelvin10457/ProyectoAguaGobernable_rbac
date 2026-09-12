import type { ElementType, ReactNode } from 'react';

interface BlueprintProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export default function Blueprint({ as: Tag = 'div', className = '', children }: BlueprintProps) {
  return (
    <Tag className={`blueprint ${className}`}>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />
      {children}
    </Tag>
  );
}
