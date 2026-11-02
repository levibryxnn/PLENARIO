import Link from 'next/link';
import { ChevronRight, type LucideIcon } from 'lucide-react';

export type LegislativeRecord = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function LegislativeRecordList({ items }: { items: LegislativeRecord[] }) {
  return (
    <div className="pl-record-list" aria-label="Tipos de proposições">
      {items.map(({ id, title, description, href, icon: Icon }) => (
        <Link className="pl-record" href={href} key={id}>
          <span className="pl-record-icon" aria-hidden="true">
            <Icon size={27} strokeWidth={1.7} />
          </span>
          <strong className="pl-record-title">{title}</strong>
          <span className="pl-record-description">{description}</span>
          <ChevronRight className="pl-record-arrow" size={18} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
