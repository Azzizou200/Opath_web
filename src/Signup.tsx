import { SignupForm } from "./components/signupform";
import type { User } from "@supabase/supabase-js";

function Signup({ onSignup }: { onSignup: (user: User) => void }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm onSignup={onSignup} className="" />
      </div>
    </div>
  );
}

export default Signup;
