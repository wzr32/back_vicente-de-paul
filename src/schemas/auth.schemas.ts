import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty().email().trim(),
  password: z.string().nonempty().min(6).trim(),
});
