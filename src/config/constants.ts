import { Secret } from "jsonwebtoken";

export const SECRET_KEY = process.env.SECRET_KEY as Secret;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const SALT_ROUNDS = 15;
