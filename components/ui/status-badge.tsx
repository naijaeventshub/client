import { Badge } from './badge';

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const variant: 'default' | 'secondary' | 'destructive' = 'secondary';
  const badgeClass = `font-xs status ${status} ${className}`;

  return (
    <Badge variant={variant} className={badgeClass.trim()}>
      {status?.replace(/_/g, ' ')?.replace(/^\w/, (c) => c.toUpperCase())}
    </Badge>
  );
}
