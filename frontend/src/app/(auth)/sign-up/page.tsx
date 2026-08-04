import SignUpFormContainer from '@/features/auth/containers/SignUpFormContainer';

export default function SignUpPage() {
  return (
    <section className="fixed inset-0 bg-background flex flex-col items-center">
      <SignUpFormContainer />
    </section>
  );
}
