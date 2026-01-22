import SignUpForm from '@/components/form/SignUpForm';
import { Button } from '@/components/ui/button';
import { useConfirmSignUp } from '@/hooks/users/useConfirmSignUp';
import { useSignUpForm } from '@/hooks/users/useSignUpForm';

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
