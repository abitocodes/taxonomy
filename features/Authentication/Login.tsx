import { FC, useEffect, useState } from "react";
import useSignInWithEmailAndPassword from "@/hooks/useSignInWithEmailAndPassword";

import { Button } from "@/components/ui/button";

import InputItem from "@/components/InputItem";
import { SUPABASE_ERRORS } from "@/utils/supabase/errors";
import { CreateUpdateUser } from "@/helpers/CreateUpdateUser";
import { ModalView } from "@/types/AuthModalState";

import { User } from "@supabase/supabase-js";

import { Session } from '@supabase/supabase-js';
type LoginProps = {
  toggleView: (view: ModalView) => void;
};

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
    <form className="w-full" onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
          <div className="w-full">
            {/* <Input className="w-full text-center" id="email" type="text" value="enter your e-mail"/> */}
            <Input className="w-full text-center" id="email" type="text" value="그냥 넣어본 입력 상자, 아래를 눌러 로그인!"/>
          </div>
          <Button className="w-full h-9 mt-2" type="submit" disabled={loading}>
            {loading ? ".. 기달려봐 .." : "로그인"}
          </Button>
          {/* <div className="text-center text-sm text-red-500">
            {formError || SUPABASE_ERRORS[authError as keyof typeof SUPABASE_ERRORS]}
          </div> */}
        </div>
    </form>
  );
};
export default Login;