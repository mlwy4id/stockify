'use client';
import SignInForm from '../components/SignInForm';
import { Button } from '@/shared/components/ui/button';
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
        <Button disabled={isPending}>
          Submit
        </Button>
      }
    />
  );
};

export default SignInFormContainer;
