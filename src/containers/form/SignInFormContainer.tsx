import SignInForm from '@/components/form/SignInForm';
import { Button } from '@/components/ui/button';
import { useConfirmSignIn } from '@/hooks/users/useConfirmSignIn';
import { useSignInForm } from '@/hooks/users/useSignInForm';

const SignInFormContainer = () => {
  const { isPending, confirmSignIn } = useConfirmSignIn();
  const { register, errors, handleSubmit } = useSignInForm();

  return (
    <SignInForm
      register={register}
      errors={errors}
      onSubmitHandler={handleSubmit(confirmSignIn)}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Submit
        </Button>
      }
    />
  );
};

export default SignInFormContainer;
