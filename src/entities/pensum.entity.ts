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

  @Column({ unique: true, nullable: false })
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

  @OneToMany(() => Grade, (grade) => grade.pensum)
  grades: Grade[];

  @ManyToMany(() => Teacher)
  @JoinTable({
    name: "pensum_teachers",
    joinColumn: { name: "pensum_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "teacher_id", referencedColumnName: "id" },
  })
  teachers: Teacher[];

  @ManyToMany(() => Student)
  @JoinTable({
    name: "pensum_students",
    joinColumn: { name: "pensum_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "student_id", referencedColumnName: "id" },
  })
  students: Student[];

  @ManyToMany(() => Course, (course) => course.pensums)
  @JoinTable()
  courses: Course[];
}
