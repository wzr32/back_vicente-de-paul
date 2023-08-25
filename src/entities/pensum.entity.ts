import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course, Grade, Period, Section, Student, Teacher } from ".";

@Entity({ name: "pensum" })
export class Pensum extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => Period)
  @JoinColumn({ name: "period_id" })
  period: Period;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course;

  @ManyToOne(() => Section)
  @JoinColumn({ name: "section_id" })
  section: Section;

  @ManyToOne(() => Grade)
  @JoinColumn({ name: "grade_id" })
  grade: Grade;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: "teacher_id" })
  teacher: Teacher;

  @ManyToOne(() => Student)
  @JoinColumn({ name: "student_id" })
  student: Student;
}
