import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "representants" })
export class Representant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  dni: string;

  @Column({ nullable: false, name: "first_name" })
  firstName: string;

  @Column({ nullable: true, name: "middle_name" })
  middleName: string;

  @Column({ nullable: false, name: "first_lastname" })
  firstLastName: string;

  @Column({ nullable: true, name: "second_last_name" })
  secondLastName: string;

  @CreateDateColumn({
    name: "created_at",
    default: () => "timezone('America/Caracas', now())",
    nullable: false,
  })
  createdAt: Date;
}
