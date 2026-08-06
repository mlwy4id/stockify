'use client';
import SignUpForm from '../components/SignUpForm';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useConfirmSignUp } from '../hooks/useConfirmSignUp';
import { useSignUpForm } from '@/features/auth/hooks/useSignUpForm';

const SignUpFormContainer = () => {
  const { register, errors, handleSubmit } = useSignUpForm();
  const { isPending, confirmSignUp } = useConfirmSignUp();

  return (
    <SignUpForm
      register={register}
      errors={errors}
      onSubmitHandler={handleSubmit(confirmSignUp)}
      submitBtn={
        <Button size="lg" className="w-full" disabled={isPending}>
          {isPending ? <Spinner /> : 'Sign Up'}
        </Button>
      }
    />
  );
};

export default SignUpFormContainer;
