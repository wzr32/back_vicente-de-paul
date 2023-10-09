import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Grade, Period, Representant, Section } from ".";
import { StudentPerformanceComment } from "./studentPerformanceComments";

@Entity({ name: "students" })
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  dni: string;

  @Column({ nullable: false, name: "first_name" })
  firstName: string;

  @Column({ name: "middle_name" })
  middleName: string;

  @Column({ nullable: false, name: "first_lastname" })
  firstLastName: string;

  @Column({ name: "second_last_name" })
  secondLastName: string;

  @Column({ nullable: false })
  birthdate: string;

  @Column({ nullable: false, name: "address" })
  address: string;

  @CreateDateColumn({
    name: "created_at",
    default: () => "timezone('America/Caracas', now())",
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(() => Representant)
  @JoinColumn({ name: "representant_id" })
  representant: Representant;

  @OneToMany(() => Grade, (grade) => grade.student)
  grades: Grade[];

  @ManyToOne(() => Period, { nullable: true })
  @JoinColumn({ name: "active_period_id" })
  activePeriod: Period | null;

  @ManyToOne(() => Section, { eager: true })
  @JoinColumn({ name: "active_section_id" })
  activeSection: Section | null;

  @OneToMany(() => Period, (period) => period.student)
  periods: Period[];

  @OneToMany(() => StudentPerformanceComment, (comment) => comment.student)
  performanceComments: StudentPerformanceComment[];
}
