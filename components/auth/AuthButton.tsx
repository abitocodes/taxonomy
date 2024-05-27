"use server"

import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/shad/new-york/ui/button";

export default async function AuthButton() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <button 
        className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 no-underline"
        onClick={signOut}
      >
        Logout
      </button>
    </div>
  ) : (
    <div>

    <Link href="/login">
      <Button>LOGIN</Button>
    </Link>
    </div>
  );
}
