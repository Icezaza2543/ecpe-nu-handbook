import { z } from 'zod';

export const studyCourseSchema = z.object({
  code: z.string().optional(),
  courseId: z.string().optional(),
  titleTh: z.string().optional(),
  nameTh: z.string().optional(),
  credits: z.union([z.string(), z.number()]).optional(),
  status: z.string().optional(),
  counted: z.boolean().optional(),
  dangerous: z.boolean().optional(),
}).passthrough();

export const studySemesterSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  semester: z.union([z.string(), z.number()]).optional(),
  totalCredits: z.union([z.string(), z.number()]).optional(),
  courses: z.array(studyCourseSchema).optional(),
  nonCreditCourses: z.array(studyCourseSchema).optional(),
}).passthrough();

export const studyYearSchema = z.object({
  year: z.number().optional(),
  semesters: z.array(studySemesterSchema).optional(),
  terms: z.array(studySemesterSchema).optional(),
}).passthrough();

export const curriculumNodeSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  credits: z.union([z.number(), z.string()]).optional(),
  description: z.string().optional(),
  subgroups: z.array(curriculumNodeSchema).optional(),
  subcategories: z.array(curriculumNodeSchema).optional(),
  children: z.array(curriculumNodeSchema).optional(),
  courses: z.array(z.string()).optional(),
}).passthrough());

export type StudyCourseData = z.infer<typeof studyCourseSchema>;
export type StudySemesterData = z.infer<typeof studySemesterSchema>;
export type StudyYearData = z.infer<typeof studyYearSchema>;
export type CurriculumNodeData = z.infer<typeof curriculumNodeSchema>;
