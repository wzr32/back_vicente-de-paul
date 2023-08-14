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

  @ManyToOne(() => Period, (period) => period.id)
  @JoinColumn({ name: "period_id" })
  period: Period;
}
