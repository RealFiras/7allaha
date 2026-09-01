import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const IconComponent = (LucideIcons as Record<string, React.FC<{ className?: string; size?: number }>>)[name];

  if (!IconComponent) {
    return <LucideIcons.Wrench className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
};
