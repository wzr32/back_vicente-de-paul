import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Period } from "./period.entity";

@Entity()
@Index(["period", "name"], { unique: true })
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Period)
  @JoinColumn({ name: "period_id" })
  period: Period;

  @Column({ type: "timestamptz" })
  created_at: Date;
}
