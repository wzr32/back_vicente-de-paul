import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Period } from "./period.entity";
import { Student } from "./student.entity";

@Entity({ name: "primary_evaluation_elements" })
export class PrimaryEvaluationElement extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  element: string;

  @Column({ type: "text" })
  description: string;

  @Column()
  grade: string;

  @OneToOne(() => Period)
  @JoinColumn({ name: "period_id" })
  period: Period;

  @OneToOne(() => Student)
  @JoinColumn({ name: "student_id" })
  student: Student;
}
