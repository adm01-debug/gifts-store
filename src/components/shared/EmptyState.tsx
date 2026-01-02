import React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyStateSize = 'sm' | 'md' | 'lg';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  icon?: React.ReactNode;
  IconComponent?: LucideIcon;
  size?: EmptyStateSize;
  image?: string;
}

const sizeConfig = {
  sm: {
    container: 'p-8',
    iconContainer: 'p-4',
    iconSize: 'h-8 w-8',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    container: 'p-12',
    iconContainer: 'p-6',
    iconSize: 'h-12 w-12',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    container: 'p-16',
    iconContainer: 'p-8',
    iconSize: 'h-16 w-16',
    title: 'text-2xl',
    description: 'text-lg',
  },
} as const;

export function EmptyState({ 
  title, 
  description,
  action,
  secondaryAction,
  icon,
  IconComponent,
  size = 'md',
  image,
}: EmptyStateProps) {
  const config = sizeConfig[size];
  const Icon = IconComponent || PackageOpen;

  return (
    <div className={`flex flex-col items-center justify-center ${config.container} text-center`}>
      {image ? (
        <img 
          src={image} 
          alt={title}
          className="mb-4 max-w-xs opacity-50"
        />
      ) : (
        <div className={`rounded-full bg-muted ${config.iconContainer} mb-4`}>
          {icon || <Icon className={`${config.iconSize} text-muted-foreground`} />}
        </div>
      )}
      
      <h3 className={`font-semibold mb-2 ${config.title}`}>{title}</h3>
      
      {description && (
        <p className={`text-muted-foreground mb-6 max-w-md ${config.description}`}>
          {description}
        </p>
      )}
      
      {action && <div className="mb-2">{action}</div>}
      {secondaryAction && <div>{secondaryAction}</div>}
    </div>
  );
}
