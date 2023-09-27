import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Teacher, Student, Course, Section, PeriodTime } from ".";

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

  @Column({
    type: "enum",
    enum: ["primary", "secondary"],
    default: "primary",
  })
  educationType: string;

  @ManyToOne(() => PeriodTime, (periodTime) => periodTime.periods)
  periodTime: PeriodTime;

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

  @OneToMany(() => Section, (section) => section.period, { cascade: true })
  sections: Section[];
}
