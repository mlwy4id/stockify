import type { UserSignUp } from '@/shared/types/user.type';
import { useSignUpUser } from './queries/auth.query';

export const useConfirmSignUp = () => {
  const { mutate, isPending } = useSignUpUser();

  const confirmSignUp = (user: UserSignUp) => {
    mutate(user);
  };

  return { confirmSignUp, isPending };
};
