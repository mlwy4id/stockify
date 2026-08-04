'use client';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import type { UserSignIn } from '@/shared/types/user.type';
import Link from 'next/link';

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
      <h1 className="font-bold text-3xl text-center">Sign In</h1>
      <div className="grid gap-2">
        <label htmlFor="email">Email:</label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>
      <div className="grid gap-2">
        <label htmlFor="password">Password:</label>
        <PasswordInput id="password" {...register('password')} />
        {errors.password && <p className="text-danger">{errors.password.message}</p>}
      </div>
      <Link href={'/sign-up'} className="text-primary">
        New to Stockify?{' '}
      </Link>
      {submitBtn}
    </form>
  );
};

export default SignInForm;
