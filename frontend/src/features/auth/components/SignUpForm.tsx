'use client';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import { Boxes, Check } from 'lucide-react';
import type { UserSignUp } from '@/shared/types/user.type';
import Link from 'next/link';

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<UserSignUp>;
  onSubmitHandler: () => void;
  submitBtn: React.ReactNode;
};

const features = [
  'Real-time stock tracking across all products',
  'Sales and broken item analytics',
  'Smart restock and depletion predictions',
];

const SignUpForm = ({ register, errors, onSubmitHandler, submitBtn }: Props) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex lg:flex-col lg:justify-between lg:w-[45%] bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-2">
          <Boxes size={28} />
          <span className="font-bold text-2xl">Stockify</span>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold leading-tight">
            Manage your inventory with confidence
          </h2>
          <p className="text-primary-foreground/80">
            Track stock levels, monitor sales, and predict when to restock — all in one place.
          </p>
          <ul className="flex flex-col gap-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="flex items-center justify-center size-6 rounded-full bg-primary-foreground/20">
                  <Check className="size-4" />
                </span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-primary-foreground/70">© 2026 Stockify</p>
      </aside>

      <section className="flex-1 flex flex-col items-center justify-center gap-18 px-6 py-10">
        <div className="lg:hidden flex items-center gap-4">
          <Boxes className="text-primary" size={32} />
          <span className="font-bold text-3xl">Stockify</span>
        </div>

        <form
          className="w-full max-w-sm flex flex-col gap-5 font-jakarta-sans"
          onSubmit={onSubmitHandler}
        >
          <div className="mb-2">
            <h1 className="font-bold text-3xl">Create your account</h1>
            <p className="text-muted-foreground mt-2">
              Start managing your inventory with Stockify.
            </p>
          </div>

          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" type="text" placeholder="Your name" {...register('name')} />
            {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-danger">{errors.password.message}</p>}
          </div>

          {submitBtn}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href={'/sign-in'} className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default SignUpForm;
