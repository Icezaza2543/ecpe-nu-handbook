export type SourceConfidence =
  | 'verified-official'
  | 'verified-description'
  | 'official-from-uploaded-gened-file'
  | 'needs-verification'
  | string;

export interface Course {
  id: string;
  code?: string;
  slug?: string;
  courseId?: string;
  nameTh?: string;
  nameEn?: string;
  titleTh?: string;
  title?: string;
  officialCategory?: string;
  requirementGroup?: string;
  credits?: string | number | null;
  category?: string;
  subcategory?: string | null;
  type?: string;
  year?: number | null;
  semester?: string | number | null;
  recommendedYear?: number;
  recommendedSemester?: string | number;
  recommendedYearSemester?: string;
  description?: string;
  prerequisite?: string;
  prerequisites?: string[];
  prerequisiteOf?: string[];
  officialPrerequisites?: string[];
  officialPrerequisiteOf?: string[];
  officialPrerequisiteText?: string;
  legacyIds?: string[];
  dangerousToFail?: boolean;
  whyItMatters?: string;
  seniorTips?: string[];
  careerPaths?: string[];
  tags?: string[];
  projectIdeas?: string[];
  sourceConfidence?: SourceConfidence;
  sourcePage?: string | null;
  sourceRef?: string | null;
  sourceNote?: string;
  sourceFile?: string;
  sourceSection?: string;
  sourceStatus?: string;
  needsVerification?: boolean;
  isPlaceholder?: boolean;
  isClickable?: boolean;
  isGeneralEducation?: boolean;
  isMajorCourse?: boolean;
  [key: string]: unknown;
}

export interface CourseSearchResult {
  course: Course;
  score: number;
  reason: string;
}
