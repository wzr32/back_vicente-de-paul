import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Teacher } from "./teacher.entity";

@Entity({ name: "courses" })
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @CreateDateColumn({
    name: "created_at",
    default: () => "timezone('America/Caracas', now())",
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn({ name: "teacher_id" })
  teacher: Teacher;
}
