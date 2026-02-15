import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/shared/components';
import type { UserSignIn } from '@/shared/types';
import { NavLink } from 'react-router-dom';

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<UserSignIn>;
  onSubmitHandler: () => void;
  submitBtn: React.ReactNode;
};

const SignInForm = ({ register, errors, onSubmitHandler, submitBtn }: Props) => {
  return (
    <form
      className="w-[30%] h-full flex flex-col gap-4 font-jakarta-sans mt-[5%]"
      onSubmit={onSubmitHandler}
    >
      <h1 className="heading font-bold text-3xl text-center">Sign In</h1>
      <div className="grid gap-2">
        <label htmlFor="email">Email:</label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div className="grid gap-2">
        <label htmlFor="password">Password:</label>
        <Input id="password" type="text" {...register('password')} />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <NavLink to={'/sign-up'} className="text-blue-700">
        New to Stockify?{' '}
      </NavLink>
      {submitBtn}
    </form>
  );
};

export default SignInForm;
