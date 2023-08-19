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

  @ManyToOne(() => Teacher)
  teacher: Teacher;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Course)
  course: Course;

  @Column({ type: "timestamptz", nullable: false })
  start_date_lap1: Date;

  @Column({ type: "timestamptz", nullable: false })
  end_date_lap1: Date;

  @Column({ type: "timestamptz", nullable: false })
  start_date_lap2: Date;

  @Column({ type: "timestamptz", nullable: false })
  end_date_lap2: Date;

  @Column({ type: "timestamptz", nullable: false })
  start_date_lap3: Date;

  @Column({ type: "timestamptz", nullable: false })
  end_date_lap3: Date;

  @OneToMany(() => Section, (section) => section.period)
  sections: Section[];
}
