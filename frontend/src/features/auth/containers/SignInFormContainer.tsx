'use client';
import SignInForm from '../components/SignInForm';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useConfirmSignIn } from '../hooks/useConfirmSignIn';
import { useSignInForm } from '../hooks/useSignInForm';

const SignInFormContainer = () => {
  const { isPending, confirmSignIn } = useConfirmSignIn();
  const { register, errors, handleSubmit } = useSignInForm();

  return (
    <SignInForm
      register={register}
      errors={errors}
      onSubmitHandler={handleSubmit(confirmSignIn)}
      submitBtn={
        <Button size="lg" className="w-full" disabled={isPending}>
          {isPending ? <Spinner /> : 'Sign In'}
        </Button>
      }
    />
  );
};

export default SignInFormContainer;
