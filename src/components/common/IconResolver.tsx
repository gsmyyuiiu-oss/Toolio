import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconResolverProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconResolver: React.FC<IconResolverProps> = ({ name, className = 'w-5 h-5', size }) => {
  // @ts-ignore
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Wrench;
  return <IconComponent className={className} size={size} />;
};
