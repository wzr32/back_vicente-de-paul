import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Teacher } from "./teacher.entity";
import { Pensum } from "./pensum.entity";

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

  @ManyToMany(() => Teacher, (teacher) => teacher.courses)
  teachers!: Teacher[];
}
