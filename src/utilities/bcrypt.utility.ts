import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config";

export const hashPass = (pass: string): string => {
  const hash = bcrypt.hashSync(pass, SALT_ROUNDS);
  return hash;
};

export const checkPass = (pass: string, hash: string): boolean => {
  return bcrypt.compareSync(pass, hash);
};
