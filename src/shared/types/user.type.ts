import type { UserSignInSchema, UserSignupSchema } from '@stockify/schema';
import type z from 'zod';

export type User = {
  name: string;
  email: string;
  password: string;
};

export type UserSignUp = z.infer<typeof UserSignupSchema>;
export type UserSignIn = z.infer<typeof UserSignInSchema>;
