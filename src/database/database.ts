import { DataSource } from "typeorm";
import {
  Course,
  Pensum,
  Period,
  Representant,
  Role,
  Section,
  Student,
  Teacher,
  User,
} from "../entities";
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "dpg-cjdhulgq339s73alsnfg-a.oregon-postgres.render.com",
  port: Number(DB_PORT) || 5432,
  username: DB_USER || "root",
  password: DB_PASS || "pcdd1qFWxYuj8juqmejDtXTkgPNlirW0",
  database: DB_NAME || "school_7mh5",
  synchronize: true,
  logging: false,
  entities: [
    Course,
    Pensum,
    Period,
    Representant,
    Role,
    Section,
    Student,
    Teacher,
    User,
  ],
  subscribers: [],
  migrations: ["./src/migrations"],
  migrationsTableName: "migration_table",
});
