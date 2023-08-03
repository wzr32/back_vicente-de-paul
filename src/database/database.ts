import { DataSource } from "typeorm";
import {
  Course,
  Pensum,
  Period,
  Representant,
  Role,
  Student,
  Teacher,
  User,
} from "../entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "pass",
  database: "school",
  synchronize: true,
  logging: true,
  entities: [
    Course,
    Pensum,
    Period,
    Representant,
    Role,
    Student,
    Teacher,
    User,
  ],
  subscribers: [],
  migrations: [],
});
