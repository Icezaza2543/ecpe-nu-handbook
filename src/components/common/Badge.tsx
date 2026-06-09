import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'default' | 'official' | 'verified' | 'warning' | 'danger' | 'soft' | 'muted';
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
