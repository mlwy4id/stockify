import type { UserSignIn, UserSignUp } from '@/shared/types/user.type';
import api from '../axios/axios';

export const getUser = async () => {
  const res = await api.get('auth/me');
  return res.data;
};

export const signUp = async (user: UserSignUp) => {
  const res = await api.post('auth/sign-up/email', user);
  return res.data;
};

export const signIn = async (user: UserSignIn) => {
  const res = await api.post('auth/sign-in/email', user);
  return res.data;
};

export const signOut = async () => {
  const res = await api.post('auth/sign-out');
  return res.data;
};
