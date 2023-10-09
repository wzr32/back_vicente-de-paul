import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pensum } from "./pensum.entity";
import { Student } from "./student.entity";
import { Course } from "./course.entity";

@Entity({ name: "grades" })
export class Grade extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", default: 0 })
  grade_lap1: number;

  @Column({ type: "integer", default: 0 })
  grade_lap2: number;

  @Column({ type: "integer", default: 0 })
  grade_lap3: number;

  @ManyToOne(() => Pensum)
  @JoinColumn({ name: "pensum_id" })
  pensum: Pensum;

  @ManyToOne(() => Student)
  @JoinColumn({ name: "student_id" })
  student: Student;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course;
}
