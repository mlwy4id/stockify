import type { UserSignIn } from '@/types/user.type';
import { useSignInUser } from '../queries/auth.query';

export const useConfirmSignIn = () => {
  const { mutate, isPending } = useSignInUser();

  const confirmSignIn = (user: UserSignIn) => {
    mutate(user);
  };

  return { confirmSignIn, isPending };
};
