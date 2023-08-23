import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @ManyToOne(() => Teacher)
  teacher: Teacher;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Course)
  course: Course;

  @Column({ type: "timestamptz", nullable: true })
  start_date_lap1: Date;

  @Column({ type: "timestamptz", nullable: true })
  end_date_lap1: Date;

  @Column({ type: "timestamptz", nullable: true })
  start_date_lap2: Date;

  @Column({ type: "timestamptz", nullable: true })
  end_date_lap2: Date;

  @Column({ type: "timestamptz", nullable: true })
  start_date_lap3: Date;

  @Column({ type: "timestamptz", nullable: true })
  end_date_lap3: Date;

  @OneToOne(() => Section, (section) => section.period)
  @JoinColumn()
  section: Section;
}
