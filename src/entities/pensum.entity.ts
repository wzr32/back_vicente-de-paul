import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course, Period, Student, Teacher } from ".";

@Entity({ name: "pensum" })
export class Pensum extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: "teacher_id" })
  teacher: Teacher;

  @ManyToOne(() => Student)
  @JoinColumn({ name: "student_id" })
  student: Student;

  @ManyToOne(() => Period)
  @JoinColumn({ name: "period_id" })
  period: Period;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course;

  @Column({ type: "integer" })
  grade_lap1: number;

  @Column({ type: "integer" })
  grade_lap2: number;

  @Column({ type: "integer" })
  grade_lap3: number;
}
