"use client"

import { FC, useEffect, useState } from "react";
import { useSignInWithGoogle } from "@/hooks/useSignInWithGoogle";

import { CreateUpdateUser } from "@/helpers/CreateUpdateUser";
import Image from "next/image";
import { Spinner } from "@radix-ui/themes";

type OAuthButtonsProps = {};
import { Session } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { CgGoogle } from "react-icons/cg";

const OAuthButtons: FC<OAuthButtonsProps> = () => {
  const { signInWithGoogle, userCred, loading, globalAuthErrorMsg: error } = useSignInWithGoogle(session);

  useEffect(() => {
    if (userCred) {
      CreateUpdateUser(userCred);
    }
  }, [userCred]);

  return (
    <div className="space-x-2">
      <Button
        variant="outline"
        onClick={() => signInWithGoogle()}
        disabled={loading}
        >
          {loading ? (
            <Spinner className="mr-2 animate-spin" />
          ) : (
            <CgGoogle className="mr-2" />
          )}{" "}
            {/* Google */}
      </Button>

      <Button variant="outline" type="button" disabled={loading}>
        {loading ? (
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
        )}{" "}
        {/* GitHub */}
      </Button>
      {error && (
        <p className="text-center text-sm text-red-500 mt-2">
          {error}
        </p>
      )}
    </div>
  );
};
export default OAuthButtons;