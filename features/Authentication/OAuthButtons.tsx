"use client"

import { FC, useEffect, useState } from "react";
import { useSignInWithGoogle } from "@/hooks/useSignInWithGoogle";

import { CreateUpdateUser } from "@/helpers/CreateUpdateUser";
import Image from "next/image";

type OAuthButtonsProps = {};
import { Session } from "@supabase/supabase-js";

const OAuthButtons: FC<OAuthButtonsProps> = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { signInWithGoogle, userCred, loading, authError: error } = useSignInWithGoogle(session);

  useEffect(() => {
    if (userCred) {
      CreateUpdateUser(userCred);
    }
  }, [userCred]);

  return (
    <div className="flex flex-col mb-4 w-full">
      <button
        className={`oauth mb-2 ${loading ? "loading" : ""}`}
        onClick={() => signInWithGoogle()}
        disabled={loading}
      >
        <Image src="/images/googlelogo.png" width={20} height={20} className="mr-4" alt="Continue with Google" />
        Continue with Google
      </button>
      <button className="oauth">Some Other Provider</button>
      {error && (
        <p className="text-center text-sm text-red-500 mt-2">
          {error}
        </p>
      )}
    </div>
  );
};
export default OAuthButtons;