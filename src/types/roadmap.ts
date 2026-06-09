export interface CourseReferenceObject {
  id?: string;
  code?: string;
  courseId?: string;
  name?: string;
  title?: string;
}

export interface ProjectIdeaObject {
  title?: string;
  description?: string;
  difficulty?: string;
  scope?: string;
}

export interface RoadmapItem {
  id?: string;
  title?: string;
  titleTh?: string;
  name?: string;
  emoji?: string;
  description?: string;
  overview?: string;
  whoIsThisFor?: string[];
  courses?: Array<string | CourseReferenceObject>;
  mappedCourses?: Array<string | CourseReferenceObject>;
  relatedCourses?: Array<string | CourseReferenceObject>;
  recommendedCourses?: Array<string | CourseReferenceObject>;
  careers?: string[];
  skills?: string[];
  projectIdeas?: Array<any>;
  seniorTips?: string[];
  tools?: Array<any>;
  yearPlan?: Array<any>;
  portfolioChecklist?: string[];
  internshipPrep?: string[];
  commonMistakes?: string[];
  [key: string]: any;
}
