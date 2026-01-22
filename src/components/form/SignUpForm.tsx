import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '../ui/input';
import type { UserSignUp } from '@/types/user.type';
import { NavLink } from 'react-router-dom';

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<UserSignUp>;
  onSubmitHandler: () => void;
  submitBtn: React.ReactNode;
};

const SignUpForm = ({ register, errors, onSubmitHandler, submitBtn }: Props) => {
  return (
    <form
      className="w-[30%] h-full flex flex-col gap-4 font-jakarta-sans mt-[5%]"
      onSubmit={onSubmitHandler}
    >
      <h1 className="heading font-bold text-3xl text-center">Sign Up</h1>
      <div className="grid gap-2">
        <label htmlFor="name">Name:</label>
        <Input id="name" type="text" {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
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
      <NavLink to={'/sign-in'} className="text-blue-700">
        Already have an account?{' '}
      </NavLink>
      {submitBtn}
    </form>
  );
};

export default SignUpForm;
