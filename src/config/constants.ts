import { Secret } from "jsonwebtoken";

export const SECRET_KEY = process.env.SECRET_KEY as Secret;
export const DB_HOST =
  process.env.DB_HOST ||
  "dpg-cjdhulgq339s73alsnfg-a.oregon-postgres.render.com";
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_NAME = process.env.DB_NAME || "school_7mh5";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASS =
  process.env.DB_PASS || "pcdd1qFWxYuj8juqmejDtXTkgPNlirW0";
export const SALT_ROUNDS = 15;
