import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Student } from "./student.entity";

@Entity({ name: "representants" })
export class Representant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  dni: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, name: "first_name" })
  firstName: string;

  @Column({ name: "middle_name" })
  middleName: string;

  @Column({ nullable: false, name: "first_lastname" })
  firstLastName: string;

  @Column({ name: "second_last_name" })
  secondLastName: string;

  @Column()
  phone: string;

  @Column({ name: "optional_phone" })
  optionalPhone: string;

  @CreateDateColumn({
    name: "created_at",
    default: () => "timezone('America/Caracas', now())",
    nullable: false,
  })
  createdAt: Date;

  @OneToMany(() => Student, (student) => student.representant)
  students: Student[];
}
