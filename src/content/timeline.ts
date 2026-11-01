import type { Politician } from '@/lib/types';

/** Source order is preserved in storage; the reader sees events in date order. */
export function chronologicalTimeline(events: Politician['timeline']) {
  return [...events].sort((first, second) => first.date.localeCompare(second.date));
}
