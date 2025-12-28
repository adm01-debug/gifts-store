import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  cta?: {
    label: string;
    onClick: () => void;
  };
}

export function AnnouncementBanner({ announcement }: { announcement: Announcement }) {
  const [isVisible, setIsVisible] = useState(() => {
    const dismissed = localStorage.getItem(`announcement-${announcement.id}`);
    return !dismissed;
  });

  const handleDismiss = () => {
    localStorage.setItem(`announcement-${announcement.id}`, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const bgColors = {
    info: 'bg-blue-50 dark:bg-blue-950',
    success: 'bg-green-50 dark:bg-green-950',
    warning: 'bg-yellow-50 dark:bg-yellow-950'
  };

  return (
    <div className={`${bgColors[announcement.type]} border-b px-4 py-3`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <Badge>Novo</Badge>
          <p className="text-sm font-medium">{announcement.message}</p>
        </div>

        <div className="flex items-center gap-2">
          {announcement.cta && (
            <Button
              onClick={announcement.cta.onClick}
              size="sm"
              variant="outline"
            >
              {announcement.cta.label}
            </Button>
          )}
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
