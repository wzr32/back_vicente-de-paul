import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Student } from "./student.entity";

@Entity({ name: "student_performance_comments" })
export class StudentPerformanceComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: "lap_1_comment" })
  lap1Comment: string;

  @Column({ nullable: false, name: "lap_2_comment" })
  lap2Comment: string;

  @Column({ nullable: false, name: "lap_3_comment" })
  lap3Comment: string;

  @ManyToOne(() => Student, (student) => student.performanceComments)
  student: Student;
}
