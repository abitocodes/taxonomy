import { FC, useState } from "react";
import { useSendPasswordResetEmail } from "@/hooks/useSendPasswordResetEmail";
import { BsDot, BsReddit } from "react-icons/bs";

import { ModalView } from "@/types/atoms/AuthModalStateType";
import { Session } from '@supabase/supabase-js';

type ResetPasswordProps = {
  toggleView: (view: ModalView) => void;
};

const ResetPassword: FC<ResetPasswordProps> = ({ toggleView }) => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const { sendPasswordResetEmail, loading: sending, error } = useSendPasswordResetEmail(session);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };
  return (
    <div className="flex flex-col items-center w-full">
      <BsReddit className="text-brand-100 text-5xl mb-2" />
      <p className="font-bold mb-2">
        Reset your password
      </p>
      {success ? (
        <p className="mb-4">Check your email :)</p>
      ) : (
        <>
          <p className="text-sm text-center mb-2">
            Enter the email associated with your account and we will send you a reset link
          </p>
          <form onSubmit={onSubmit} className="w-full">
            <input
              required
              name="email"
              placeholder="email"
              type="email"
              className="mb-2 text-sm placeholder-gray-500 hover:hover:border-blue-500 focus:outline-none focus:focus:border-blue-500 bg-gray-50 w-full p-2 border border-gray-300"
              onChange={(event) => setEmail(event.target.value)}
            />
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
            <button type="submit" className={`w-full h-9 mb-2 mt-2 ${sending ? 'loading' : ''} bg-blue-500 font-bold`}>
              Reset Password
            </button>
          </form>
        </>
      )}
      <div className="flex items-center text-sm text-blue-500 font-bold cursor-pointer">
        <p onClick={() => toggleView("login")}>로그인</p>
        <BsDot />
        <p onClick={() => toggleView("signup")}>SIGN UP</p>
      </div>
    </div>
  );
};
export default ResetPassword;
