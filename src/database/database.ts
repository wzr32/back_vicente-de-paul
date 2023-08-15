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
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
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
  ssl: true, // Habilita la conexión SSL/TLS
  extra: {
    ssl: {
      rejectUnauthorized: false, // Esto puede ser necesario en algunos casos, aunque no es recomendado para producción
    },
  },
});
