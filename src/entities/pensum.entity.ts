import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course, Period, Student, Teacher } from ".";
import { Section } from "./section.entity";

@Entity({ name: "pensum" })
export class Pensum extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: "teacher_id" })
  teacherId: number;

  @Column({ nullable: false, name: "student_id" })
  studentId: number;

  @Column({ nullable: false, name: "period_id" })
  periodId: number;

  @Column({ nullable: false, name: "course_id" })
  courseId: number;

  @Column({ nullable: true })
  grade: number;

  @ManyToOne(() => Teacher)
  teacher: Teacher;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Period)
  period: Period;

  @ManyToOne(() => Course)
  course: Course;

  @ManyToOne(() => Section)
  @JoinColumn({ name: "section_id" })
  section: Section;
}
