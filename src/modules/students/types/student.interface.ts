import {
  Course,
  Pensum,
  Period,
  Representant,
  Student,
  Teacher,
} from "../../../entities";

export interface StudentData extends Student {}
export interface RepresentantData extends Representant {}
export interface TeacherData extends Teacher {}
export interface CourseData extends Course {}
export interface PensumData extends Pensum {}
export interface PeriodData extends Period {}
