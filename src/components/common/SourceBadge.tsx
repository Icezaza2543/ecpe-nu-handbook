import type { Course } from '../../types/course';
import { getSourceLabel, getSourceTone } from '../../utils/sourceConfidence';
import { Badge } from './Badge';

export function SourceBadge({ course }: { course: Course }) {
  return <Badge tone={getSourceTone(course)}>{getSourceLabel(course)}</Badge>;
}
