import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Period } from "./period.entity";

@Entity({ name: "period_times" })
export class PeriodTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ type: String, nullable: false })
  start_date: String;

  @Column({ type: String, nullable: false })
  end_date: String;

  @OneToMany(() => Period, (period) => period.periodTime)
  periods: Period[];

  @CreateDateColumn({ name: "created_at", nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", nullable: false })
  updatedAt: Date;
}
