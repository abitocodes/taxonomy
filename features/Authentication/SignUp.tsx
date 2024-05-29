import { FC, useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "@/hooks/useCreateUserWithEmailAndPassword";

import InputItem from "@/components/InputItem";
import { SUPABASE_ERRORS } from "@/utils/supabase/errors";
import { CreateUpdateUser } from "@/helpers/CreateUpdateUser";
import { ModalView } from "@/types/AuthModalState";
import { Session } from "@supabase/supabase-js";

type SignUpProps = {
  toggleView: (view: ModalView) => void;
};

const SignUp: FC<SignUpProps> = ({ toggleView }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const { createUserWithEmailAndPassword, userCred, loading, error: authError } = useCreateUserWithEmailAndPassword(session);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError) setFormError("");
    if (!form.email.includes("@")) {
      return setFormError("Please enter a valid email");
    }

    if (form.password !== form.confirmPassword) {
      return setFormError("Passwords do not match");
    }

    // Valid form inputs
    createUserWithEmailAndPassword(form.email, form.password);
  };

  const onChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (userCred) {
      CreateUpdateUser(userCred);
    }
  }, [userCred]);

  return (
    <form onSubmit={onSubmit}>
      <InputItem name="email" placeholder="email" type="text" mb={2} onChange={onChange} />
      <InputItem name="password" placeholder="password" type="password" mb={2} onChange={onChange} />
      <InputItem name="confirmPassword" placeholder="confirm password" type="password" onChange={onChange} />
      <p className="text-center mt-2 text-sm text-red-500">
      {formError || SUPABASE_ERRORS[authError as keyof typeof SUPABASE_ERRORS]}
      </p>
      <button className="w-full h-9 mb-2 mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={loading}>
        Sign Up
      </button>
      <div className="text-xs text-center">
        <span className="mr-1">Have an account?</span>
        <span className="text-blue-500 font-bold cursor-pointer" onClick={() => toggleView("login")}>
          LOG IN
        </span>
      </div>
    </form>
  );
};
export default SignUp;
