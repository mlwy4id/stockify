'use client';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import type { UserSignUp } from '@/shared/types/user.type';
import Link from 'next/link';

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
      <h1 className="font-bold text-3xl text-center">Sign Up</h1>
      <div className="grid gap-2">
        <label htmlFor="name">Name:</label>
        <Input id="name" type="text" {...register('name')} />
        {errors.name && <p className="text-danger">{errors.name.message}</p>}
      </div>
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
      <Link href={'/sign-in'} className="text-primary">
        Already have an account?{' '}
      </Link>
      {submitBtn}
    </form>
  );
};

export default SignUpForm;
