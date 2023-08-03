import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Representant } from "./representant.entity";

@Entity({ name: "students" })
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  dni: string;

  @Column({ nullable: false, name: "representant_id" })
  representantId: number;

  @Column({ nullable: false, name: "first_name" })
  firstName: string;

  @Column({ nullable: true, name: "middle_name" })
  middleName: string;

  @Column({ nullable: false, name: "first_lastname" })
  firstLastName: string;

  @Column({ nullable: true, name: "second_last_name" })
  secondLastName: string;

  @Column({ nullable: false })
  birthdate: Date;

  @Column({ nullable: true, name: "birth_country" })
  birthCountry: number;

  @CreateDateColumn({
    name: "created_at",
    default: () => "timezone('America/Caracas', now())",
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(() => Representant)
  representant: Representant;
}
