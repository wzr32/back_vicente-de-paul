import { Secret } from "jsonwebtoken";

export const SECRET_KEY = process.env.SECRET_KEY as Secret;
export const SALT_ROUNDS = 15;
