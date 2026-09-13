import type { ElementType, ReactNode } from 'react';

interface BlueprintProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export default function Blueprint({ as: Tag = 'div', className = '', children }: BlueprintProps) {
  return <Tag className={`blueprint ${className}`}>{children}</Tag>;
}
