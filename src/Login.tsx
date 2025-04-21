import type { User } from "@supabase/supabase-js";

import { LoginForm } from "./components/loginform";
const className = "mt-2";
function Login({ onLogin }: { onLogin: (user: User) => void }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onLogin={onLogin} className={className} />
      </div>
    </div>
  );
}

export default Login;
