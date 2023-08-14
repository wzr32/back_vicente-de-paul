import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Teacher } from "./teacher.entity";
import { Student } from "./student.entity";
import { Course } from "./course.entity";
import { Section } from "./section.entity";

@Entity({ name: "periods" })
export class Period extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  observations: string;

  @Column({ nullable: false, name: "teacher_id" })
  teacherId: number;

  @Column({ nullable: false, name: "student_id" })
  studentId: number;

  @Column({ nullable: false, name: "course_id" })
  courseId: number;

  @ManyToOne(() => Teacher)
  teacher: Teacher;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Course)
  course: Course;

  @OneToMany(() => Section, (section) => section.id)
  sections: Section[];
}
