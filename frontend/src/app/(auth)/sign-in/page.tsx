import SignInFormContainer from '@/features/auth/containers/SignInFormContainer';

export default function SignInPage() {
  return (
    <section className="fixed inset-0 bg-white flex flex-col items-center">
      <SignInFormContainer />
    </section>
  );
}
