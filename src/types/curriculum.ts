export interface CurriculumNode {
  id?: string;
  title?: string;
  name?: string;
  credits?: number | string;
  description?: string;
  subgroups?: CurriculumNode[];
  subcategories?: CurriculumNode[];
  children?: CurriculumNode[];
  courses?: string[];
  [key: string]: unknown;
}

export interface StudyCourse {
  code?: string;
  courseId?: string;
  titleTh?: string;
  nameTh?: string;
  credits?: string;
  status?: string;
  counted?: boolean;
  dangerous?: boolean;
  [key: string]: unknown;
}

export interface StudySemester {
  id?: string;
  title?: string;
  semester?: string | number;
  totalCredits?: number | string;
  courses?: StudyCourse[];
  nonCreditCourses?: StudyCourse[];
  [key: string]: unknown;
}

export interface StudyYear {
  year?: number;
  semesters?: StudySemester[];
  terms?: StudySemester[];
  [key: string]: unknown;
}
