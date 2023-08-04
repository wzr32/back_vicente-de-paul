import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "teachers" })
export class Teacher extends BaseEntity {
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

  @Column({ unique: true, nullable: false })
  email: string;

  @CreateDateColumn({
    name: "created_at",
    default: () => "timezone('America/Caracas', now())",
    nullable: false,
  })
  createdAt: Date;
}
