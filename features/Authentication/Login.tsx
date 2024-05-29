import { FC, useEffect, useState } from "react";
import useSignInWithEmailAndPassword from "@/hooks/useSignInWithEmailAndPassword";

import { Button } from "@/components/ui/button";

import InputItem from "@/components/InputItem";
import { SUPABASE_ERRORS } from "@/utils/supabase/errors";
import { CreateUpdateUser } from "@/helpers/CreateUpdateUser";
import { ModalView } from "@/types/AuthModalState";

import { User } from "@supabase/supabase-js";

import { Session } from "@supabase/supabase-js";
type LoginProps = {
  toggleView: (view: ModalView) => void;
};

const Login: FC<LoginProps> = ({ toggleView }) => {
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const { signInWithEmailAndPassword, userCred, loading, authError } = useSignInWithEmailAndPassword(session);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError) setFormError("");
    if (!form.email.includes("@")) {
      return setFormError("Please enter a valid email");
    }

    // Valid form inputs
    signInWithEmailAndPassword(form.email, form.password);
  };

  const onChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (userCred && 'user' in userCred) {
      CreateUpdateUser(userCred.user as User);
    }
  }, [userCred]);

  return (
    <form onSubmit={onSubmit}>
      <InputItem name="email" placeholder="email" type="text" mb={2} onChange={onChange} />
      <InputItem name="password" placeholder="password" type="password" onChange={onChange} />
      <div className="text-center mt-2 text-sm text-red-500">
      {formError || SUPABASE_ERRORS[authError as keyof typeof SUPABASE_ERRORS]}
      </div>
      <Button className="w-full h-9 mb-2 mt-2" type="submit" disabled={loading}>
        {loading ? "Loading..." : "Log In"}
      </Button>
      <div className="flex justify-center mb-2">
        <div className="text-xs mr-1">
          Forgot your password?
        </div>
        <div className="text-xs text-blue-500 cursor-pointer" onClick={() => toggleView("resetPassword")}>
          Reset
        </div>
      </div>
      <div className="flex justify-center text-xs">
        <div className="mr-1">New here?</div>
        <div className="text-blue-500 font-bold cursor-pointer" onClick={() => toggleView("signup")}>
          SIGN UP
        </div>
      </div>
    </form>
  );
};
export default Login;
