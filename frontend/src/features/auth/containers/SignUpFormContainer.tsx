'use client';
import SignUpForm from '../components/SignUpForm';
import { Button } from '@/shared/components/ui/button';
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
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Submit
        </Button>
      }
    />
  );
};

export default SignUpFormContainer;
