import type { UserSignIn, UserSignUp } from '@/types/user.type';
import api from '../axios/axios';

export const getUser = async () => {
  const res = await api.get('/api/auth/me');
  return res.data;
};

export const signUp = async (user: UserSignUp) => {
  const res = await api.post('/api/auth/sign-up/email', user);
  return res.data;
};

export const signIn = async (user: UserSignIn) => {
  const res = await api.post('/api/auth/sign-in/email', user);
  return res.data;
};
